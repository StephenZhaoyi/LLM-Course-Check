# main.py
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from database import Base, engine, SessionLocal
from models import Applicant, Module, Course
from schemas import (
    ApplicantCreate, ApplicantOut, 
    ModuleCreate, ModuleOut,
    CourseCreate, CourseOut
)
import subprocess
import json

# Load JSON data
# For windows, use "\"; for linux, use "/"
with open("data/evaluation_result.json", "r", encoding="utf-8") as file:
    evaluation_data = json.load(file)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Credit Recognition API")

# Dependency to get a DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------------------
# APPLICANTS
# ------------------------------
@app.post("/applicants/", response_model=ApplicantOut)
def create_applicant(applicant: ApplicantCreate, db: Session = Depends(get_db)):
    db_applicant = Applicant(**applicant.dict())
    db.add(db_applicant)
    db.commit()
    db.refresh(db_applicant)
    return db_applicant

@app.get("/applicants/{applicant_id}", response_model=ApplicantOut)
def get_applicant(applicant_id: int, db: Session = Depends(get_db)):
    db_applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id).first()
    if not db_applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return db_applicant

@app.get("/applicants/", response_model=List[ApplicantOut])
def list_all_applicants(db: Session = Depends(get_db)):
    """ Fetch all applicants from the database. """
    applicants = db.query(Applicant).all()
    return applicants


# ------------------------------
# MODULES
# ------------------------------
@app.post("/modules/", response_model=ModuleOut)
def create_module(module: ModuleCreate, db: Session = Depends(get_db)):
    db_module = Module(**module.dict())
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module

@app.get("/modules/{module_id}", response_model=ModuleOut)
def get_module(module_id: int, db: Session = Depends(get_db)):
    db_module = db.query(Module).filter(Module.module_id == module_id).first()
    if not db_module:
        raise HTTPException(status_code=404, detail="Module not found")
    return db_module


# ------------------------------
# COURSES
# ------------------------------
@app.post("/courses/", response_model=CourseOut)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    # Optionally verify that the applicant and module exist
    applicant_exists = db.query(Applicant).filter(Applicant.applicant_id == course.applicant_id).first()
    if not applicant_exists:
        raise HTTPException(status_code=404, detail="Applicant not found.")

    module_exists = db.query(Module).filter(Module.module_id == course.module_id).first()
    if not module_exists:
        raise HTTPException(status_code=404, detail="Module not found.")

    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    # Find the course in the JSON data
    course_key = f"defaultCourse{course_id}"
    if course_key not in evaluation_data:
        raise HTTPException(status_code=404, detail="Course not found in evaluation data")

    course_data = evaluation_data[course_key]

    # Map JSON data to CourseOut schema
    course_out = CourseOut(
        course_id=course_data["id"],
        course_name=course_data["title"],
        total_credits=course_data["ects"],
        score=course_data["score"],
        deduction_recommendation=course_data["deduction_recommendation"],
        explanation_recommendation=course_data["explanation_recommendation"],
        achieved_credits=None,  # Assuming this is not available in the JSON
        applicant_id=None,      # Assuming this is not available in the JSON
        module_id=None          # Assuming this is not available in the JSON
    )
    return course_out

@app.post("/execute-core")
def execute_core():
    try:
        # First, execute the reader_excel.py script
        reader_result = subprocess.run(["python", "backend/reader_excel.py"], check=True, capture_output=True, text=True)
        print("Reader Excel Output:", reader_result.stdout)
        # Execute the core_updated.py script
        result = subprocess.run(["python", "core_updated.py"], check=True, capture_output=True, text=True)
        return {"status": "success", "output": result.stdout}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {e.stderr}")

@app.get("/applicants/{applicant_id}/courses", response_model=List[CourseOut])
def get_courses_for_applicant(applicant_id: int, db: Session = Depends(get_db)):
    """ Fetch all courses for a specific applicant. """
    courses = db.query(Course).filter(Course.applicant_id == applicant_id).all()
    if not courses:
        raise HTTPException(status_code=404, detail="No courses found for this applicant")
    return courses

# Create a directory for candidate data if it doesn't exist
candidate_data_dir = Path("candidate_data")
candidate_data_dir.mkdir(parents=True, exist_ok=True)

# Update the upload_documents endpoint
@app.post("/upload-documents/")
async def upload_documents(
    applicant_excel: UploadFile = File(...),
    course_description: UploadFile = File(...)
):
    # Validate file types
    if applicant_excel.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload only the applicant Excel PDF.")
    if course_description.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload only the course description PDF.")

    # Define the path where the applicant_excel will be saved
    applicant_excel_path = candidate_data_dir / "applicant_excel.pdf"
    course_description_path = candidate_data_dir / "course_description.pdf"

    with open(applicant_excel_path, "wb") as f:
        f.write(await applicant_excel.read())
    
    with open(course_description_path, "wb") as f:
        f.write(await course_description.read())

    return {"status": "success", "message": "Files uploaded successfully."}
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)