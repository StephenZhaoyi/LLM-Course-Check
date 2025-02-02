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
from reader_excel import main as main1
from core_updated import main as main2
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

@app.post("/execute-core/{applicant_id}")
def execute_core(applicant_id: int, db: Session = Depends(get_db)):
    # 1. Ensure the applicant exists before proceeding.
    applicant = db.query(Applicant).filter(Applicant.applicant_id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    try:
        # Directly call the core functions
        reader_output = main1()
        print("Reader Excel Output:", reader_output)
        
        core_output = main2()
        print("Core Updated Output:", core_output)
        
        # 2. Use a consistent file path for evaluation JSON data.
        eval_file_path = "data1/evaluation_result.json"  # Make sure this is the correct path.
        with open(eval_file_path, "r", encoding="utf-8") as file:
            evaluation_data = json.load(file)
        
        # Update each course in the evaluation data
        for course in evaluation_data.values():
            # Attach the applicant id to the course data
            course["applicant_id"] = applicant_id
            # Ensure that a numeric value is used for the calculations (use 0 if missing or None)
            ects = course.get("ects",0)
            deduction = course.get("deduction_recommendation",0)
            course["score"] = ects - deduction
        
        # Write the updated JSON back to the file
        with open(eval_file_path, "w", encoding="utf-8") as file:
            json.dump(evaluation_data, file, indent=4)
        
        # Update or insert Course records in the database
        for course in evaluation_data.values():
            course_id = course.get("id")
            # Try to locate an existing course matching the JSON id and applicant_id.
            db_course = db.query(Course).filter(
                Course.course_id == course_id,
                Course.applicant_id == applicant_id
            ).first()
            
            if db_course:
                # Update the existing course record.
                db_course.course_name = course.get("title")
                db_course.total_credits = course.get("ects")
                db_course.score = course.get("score")
                db_course.deduction_recommendation = course.get("deduction_recommendation")
                db_course.explanation_recommendation = course.get("explanation_recommendation")
            else:
                # Insert a new course record.
                new_course = Course(
                    course_name=course.get("title"),
                    total_credits=course.get("ects"),
                    score=course.get("score"),
                    deduction_recommendation=course.get("deduction_recommendation"),
                    explanation_recommendation=course.get("explanation_recommendation"),
                    applicant_id=applicant_id,
                    module_id=None,
                    achieved_credits=None
                )
                db.add(new_course)
        
        db.commit()
        
        return {
            "status": "success",
            "output": {
                "reader": reader_output,
                "core": core_output
            }
        }
    except Exception as e:
        db.rollback()  # Rollback the transaction if anything fails.
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

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

from verification_routes import router as verification_router
app.include_router(verification_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)