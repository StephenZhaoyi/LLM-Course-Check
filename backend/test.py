import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from main import app, get_db

# Create a test database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency to use the test database
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Create the test database tables
Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="module")
def test_client():
    with TestClient(app) as client:
        yield client
        
def test_create_applicant(test_client):
    response = test_client.post(
        "/applicants/",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "date_of_birth": "1990-01-01",
            "nationality": "USA",
            "university": "TUM",
            "subject": "CS",
            "regular_duration": 4,
            "number_of_credits": 120
        }
    )
    assert response.status_code == 200
    assert response.json()["first_name"] == "John"
    assert response.json()["last_name"] == "Doe"

def test_get_applicant(test_client):
    # Assuming an applicant with ID 1 exists
    response = test_client.get("/applicants/1")
    assert response.status_code == 200
    assert response.json()["first_name"] == "John"

def test_create_module(test_client):
    response = test_client.post(
        "/modules/",
        json={
            "module_name": "Informatics",
            "description": "Basic Informatics Module"
        }
    )
    assert response.status_code == 200
    assert response.json()["module_name"] == "Informatics"
    
def test_get_module(test_client):
    # Assuming a module with ID 1 exists
    response = test_client.get("/modules/1")
    assert response.status_code == 200
    assert response.json()["module_name"] == "Informatics"
    
def test_create_module(test_client):
    response = test_client.post(
        "/modules/",
        json={
            "module_name": "Informatics",
            "description": "Basic Informatics Module"
        }
    )
    assert response.status_code == 200
    assert response.json()["module_name"] == "Informatics"

def test_get_module(test_client):
    # Assuming a module with ID 1 exists
    response = test_client.get("/modules/1")
    assert response.status_code == 200
    assert response.json()["module_name"] == "Informatics"
    
def test_create_course(test_client):
    response = test_client.post(
        "/courses/",
        json={
            "course_name": "Introduction to Informatics",
            "achieved_credits": 6,
            "total_credits": 6,
            "score": 95,
            "deduction_recommendation": 0,
            "explanation_recommendation": "No deductions required.",
            "applicant_id": 1,
            "module_id": 1
        }
    )
    assert response.status_code == 200
    assert response.json()["course_name"] == "Introduction to Informatics"

def test_get_course(test_client):
    # Assuming a course with ID 1 exists
    response = test_client.get("/courses/1")
    assert response.status_code == 200
    assert response.json()["course_name"] == "Introduction to Informatics"