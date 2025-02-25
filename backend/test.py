# test.py

import pytest
import json
import datetime
from unittest.mock import patch, MagicMock, mock_open

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Import from local modules
# NOTE: Removed write_to_json import, since main.py does not define it.
from main import app, execute_core, upload_documents
from database import Base, get_db
from models import Applicant, Module, Course
from schemas import (
    ApplicantCreate, ApplicantOut,
    ModuleCreate, ModuleOut,
    CourseCreate, CourseOut
)

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

def override_get_db():
    """
    Our testing DB session override. This ensures each test is run
    against the in-memory DB, and the DB is clean every time.
    """
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    """
    Returns a TestClient instance connected to the FastAPI app
    with the testing DB session override in place.
    """
    with TestClient(app) as c:
        yield c

@pytest.fixture
def db_session():
    """
    Direct DB session fixture, if we need to test models or direct queries.
    """
    session = TestingSessionLocal()
    Base.metadata.drop_all(bind=engine)  # clean up between tests
    Base.metadata.create_all(bind=engine)
    yield session
    session.close()


# ---------------------------------------------------------------------------------
# MODELS TEST
# ---------------------------------------------------------------------------------
def test_models_relationship(db_session):
    """
    Basic test to ensure the relationships among Applicant, Module, and Course
    can be created and retrieved without error.
    """
    applicant = Applicant(
        first_name="John", last_name="Doe",
        date_of_birth=datetime.date(2000, 1, 1),
        nationality="Testland"
    )
    db_session.add(applicant)
    db_session.commit()
    db_session.refresh(applicant)

    module = Module(module_name="Test Module", description="Description")
    db_session.add(module)
    db_session.commit()
    db_session.refresh(module)

    course = Course(
        course_name="Test Course",
        applicant_id=applicant.applicant_id,
        module_id=module.module_id,
        total_credits=5
    )
    db_session.add(course)
    db_session.commit()

    # Check relationships
    assert course.applicant == applicant
    assert course.module == module


# ---------------------------------------------------------------------------------
# SCHEMAS TEST
# ---------------------------------------------------------------------------------
def test_applicant_schema():
    obj = ApplicantOut(
        applicant_id=1,
        first_name="Jane",
        last_name="Smith",
        date_of_birth=datetime.date(1999, 12, 31),
        nationality="Test",
        university="Test University",
        subject="Test Subject",
        regular_duration=6,
        number_of_credits=180,
        submission_time=datetime.datetime(2025, 1, 1, 12, 30),
        score=100
    )
    data = obj.model_dump()
    assert data["first_name"] == "Jane"
    assert data["score"] == 100

def test_module_schema():
    obj = ModuleOut(
        module_id=10,
        module_name="Sample Module",
        description="Sample Description"
    )
    data = obj.model_dump()
    assert data["module_id"] == 10
    assert data["module_name"] == "Sample Module"

def test_course_schema():
    obj = CourseOut(
        course_id=100,
        applicant_id=2,
        module_id=3,
        course_name="Analytics",
        achieved_credits=4,
        total_credits=5,
        score=95,
        deduction_recommendation=0,
        explanation_recommendation="Everything matches"
    )
    data = obj.model_dump()
    assert data["course_name"] == "Analytics"
    assert data["score"] == 95


# ---------------------------------------------------------------------------------
# ENDPOINT TESTS
# ---------------------------------------------------------------------------------
def test_create_applicant(client):
    """
    Tests POST /applicants/
    """
    payload = {
        "first_name": "Alan",
        "last_name": "Turing",
        "date_of_birth": "1912-06-23",
        "nationality": "British"
    }
    response = client.post("/applicants/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Alan"
    assert "applicant_id" in data

def test_get_applicant(client):
    """
    Tests GET /applicants/{applicant_id}
    """
    # create applicant
    create_resp = client.post("/applicants/", json={"first_name": "Ada", "last_name": "Lovelace"})
    created_applicant = create_resp.json()

    # retrieve
    response = client.get(f'/applicants/{created_applicant["applicant_id"]}')
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Ada"

def test_list_all_applicants(client):
    """
    Test listing all applicants
    """
    # create applicant
    client.post("/applicants/", json={"first_name": "Test1", "last_name": "User1"})
    client.post("/applicants/", json={"first_name": "Test2", "last_name": "User2"})

    response = client.get("/applicants/")
    assert response.status_code == 200
    data = response.json()
    # we have at least 2 from above
    assert len(data) >= 2

def test_create_module(client):
    """
    Tests POST /modules/
    """
    payload = {
        "module_name": "Science 101",
        "description": "Intro to science"
    }
    response = client.post("/modules/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["module_name"] == "Science 101"
    assert "module_id" in data

def test_get_module(client):
    """
    Tests GET /modules/{module_id}
    """
    create_resp = client.post("/modules/", json={"module_name": "Math101", "description": "A course"})
    created_module = create_resp.json()

    # retrieve
    response = client.get(f'/modules/{created_module["module_id"]}')
    assert response.status_code == 200
    data = response.json()
    assert data["module_name"] == "Math101"

def test_create_course(client):
    """
    Tests POST /courses/
    """
    # first create applicant & module
    applicant_resp = client.post("/applicants/", json={"first_name": "Cathy", "last_name": "Smith"})
    applicant_id = applicant_resp.json()["applicant_id"]

    module_resp = client.post("/modules/", json={"module_name": "CompSci", "description": "CS"})
    module_id = module_resp.json()["module_id"]

    payload = {
        "course_name": "Data Structures",
        "applicant_id": applicant_id,
        "module_id": module_id,
        "achieved_credits": 2,
        "total_credits": 5
    }

    response = client.post("/courses/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["course_name"] == "Data Structures"
    assert "course_id" in data

def test_create_course_invalid_applicant(client):
    # module
    module_resp = client.post("/modules/", json={"module_name": "Bio", "description": "Bio module"})
    module_id = module_resp.json()["module_id"]

    payload = {
        "course_name": "Biology101",
        "applicant_id": 999999,  # non-existent
        "module_id": module_id
    }
    response = client.post("/courses/", json=payload)
    assert response.status_code == 404
    assert "Applicant not found." in response.json()["detail"]

def test_create_course_invalid_module(client):
    # create valid applicant
    applicant_resp = client.post("/applicants/", json={"first_name": "Test", "last_name": "User"})
    applicant_id = applicant_resp.json()["applicant_id"]

    payload = {
        "course_name": "NonExistent",
        "applicant_id": applicant_id,
        "module_id": 99999  # non-existent
    }
    response = client.post("/courses/", json=payload)
    assert response.status_code == 404
    assert "Module not found." in response.json()["detail"]

def test_get_course(client):
    """
    Tests GET /courses/{course_id}
    This endpoint is currently implemented to read from
    data1/evaluation_result.json. We'll test the fail branch
    as well if the key is not found.
    """
    # check 404 for missing course
    response = client.get("/courses/9999")
    assert response.status_code == 404

    # Mock the file data to ensure the code path is tested
    fake_evaluation = {
        "defaultCourse123": {
            "id": 123,
            "title": "Mock Course Title",
            "ects": 6,
            "score": 5.5,
            "deduction_recommendation": 0.5,
            "explanation_recommendation": "Shortfall in some topics"
        }
    }

    with patch("builtins.open", mock_open(read_data=json.dumps(fake_evaluation))):
        response = client.get("/courses/123")
        assert response.status_code == 200
        data = response.json()
        assert data["course_id"] == 123
        assert data["course_name"] == "Mock Course Title"
        assert data["deduction_recommendation"] == 0.5

from unittest.mock import patch, mock_open

def test_get_course(client):
    """
    Tests GET /courses/{course_id}
    We'll check 404 if the course doesn't exist in evaluation_data,
    then we'll patch main.evaluation_data so the test can succeed.
    """
    # 1) Check 404 for a missing course in the original data
    response = client.get("/courses/9999")
    assert response.status_code == 404

    # 2) Patch the in-memory evaluation_data dict in main.py 
    fake_evaluation = {
        "defaultCourse123": {
            "id": 123,
            "title": "Mock Course Title",
            "ects": 6,
            "score": 5.5,
            "deduction_recommendation": 0.5,
            "explanation_recommendation": "Shortfall in some topics"
        }
    }

    # Use patch to overwrite the global dictionary in main.py
    with patch("main.evaluation_data", fake_evaluation):
        response = client.get("/courses/123")
        assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
        data = response.json()
        assert data["course_id"] == 123
        assert data["course_name"] == "Mock Course Title"
        assert data["deduction_recommendation"] == 0.5



def test_get_courses_for_applicant_not_found(client):
    """
    Attempting to fetch courses for a non-existent applicant
    """
    resp = client.get("/applicants/9999/courses")
    assert resp.status_code == 404
    assert "No courses found for this applicant" in resp.json()["detail"]


# ---------------------------------------------------------------------------------
# TEST /execute-core
# ---------------------------------------------------------------------------------
@patch("main.main1", return_value="reader_excel_ok")
@patch("main.main2", return_value="core_updated_ok")
def test_execute_core_success(mock_main2, mock_main1, client):
    """
    Mocks reader_excel.main() and core_updated.main().
    Also mocks the open() calls for reading/writing 'data1/evaluation_result.json'.
    """
    # create applicant
    resp_app = client.post("/applicants/", json={
        "first_name": "Core", "last_name": "Tester"
    })
    applicant_id = resp_app.json()["applicant_id"]

    fake_evaluation = {
        "defaultCourse999": {
            "id": 999,
            "title": "Some Title",
            "ects": 4,
            "deduction_recommendation": 1.0,
            "explanation_recommendation": "Some lacking topics"
        }
    }

    mocked_file = mock_open(read_data=json.dumps(fake_evaluation))
    with patch("builtins.open", mocked_file, create=True):
        resp = client.post(f"/execute-core/{applicant_id}")
        assert resp.status_code == 200
        json_resp = resp.json()
        assert json_resp["status"] == "success"
        assert json_resp["output"]["reader"] == "reader_excel_ok"
        assert json_resp["output"]["core"] == "core_updated_ok"

    # Check that the updated JSON was written back
    handle = mocked_file()
    written_data = ""
    for call in handle.write.call_args_list:
        written_data += call[0][0]

    updated_obj = json.loads(written_data)
    # After the code updates the JSON, "score" should be ects - deduction => 4 - 1.0 = 3
    assert updated_obj["defaultCourse999"]["score"] == 3
    # also confirm applicant_id attached
    assert updated_obj["defaultCourse999"]["applicant_id"] == applicant_id

@patch("main.main1", return_value="reader_excel_ok")
@patch("main.main2", return_value="core_updated_ok")
def test_execute_core_no_applicant(mock_main2, mock_main1, client):
    resp = client.post("/execute-core/99999")
    assert resp.status_code == 404
    assert "Applicant not found" in resp.json()["detail"]

@patch("main.main1", side_effect=Exception("Simulated Failure"))
def test_execute_core_exception(mock_main1, client):
    # create applicant
    resp_app = client.post("/applicants/", json={
        "first_name": "Fail", "last_name": "Tester"
    })
    applicant_id = resp_app.json()["applicant_id"]

    resp = client.post(f"/execute-core/{applicant_id}")
    assert resp.status_code == 500
    assert "Execution failed: Simulated Failure" in resp.json()["detail"]


# ---------------------------------------------------------------------------------
# TEST /upload-documents
# ---------------------------------------------------------------------------------
def test_upload_documents_success(client):
    pdf_content = b"%PDF-1.4 FAKE PDF CONTENT"
    files = [
        ("applicant_excel", ("test_applicant.pdf", pdf_content, "application/pdf")),
        ("course_description", ("test_course.pdf", pdf_content, "application/pdf"))
    ]
    response = client.post("/upload-documents/", files=files)
    assert response.status_code == 200
    assert response.json()["message"] == "Files uploaded successfully."

def test_upload_documents_wrong_content_type(client):
    pdf_content = b"%PDF-1.4 FAKE PDF CONTENT"
    files = [
        ("applicant_excel", ("test_applicant.pdf", pdf_content, "application/pdf")),
        # second file is not pdf
        ("course_description", ("test_course.txt", b"NOT A PDF", "text/plain"))
    ]
    response = client.post("/upload-documents/", files=files)
    assert response.status_code == 400
    assert "Please upload only the course description PDF." in response.json()["detail"]

def test_upload_documents_only_one(client):
    """
    If you pass only one file, it won't match the function signature 
    that expects 2 (FastAPI will see it as a validation error).
    """
    pdf_content = b"%PDF-1.4 FAKE PDF CONTENT"
    files = [
        ("applicant_excel", ("test_applicant.pdf", pdf_content, "application/pdf"))
    ]
    response = client.post("/upload-documents/", files=files)
    assert response.status_code == 422


@patch("os.getenv", return_value="fake_api_key")
@patch("openai.OpenAI")
def test_openai_script_minimal(mock_openai_class, mock_getenv):
    """
    A minimal example to ensure openai client usage can be patched.
    Extend or remove as needed.
    """
    pass
