# models.py
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Applicant(Base):
    __tablename__ = "applicants"

    applicant_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    date_of_birth = Column(Date)
    nationality = Column(String(50))
    university = Column(String(100))
    subject = Column(String(100))
    regular_duration = Column(Integer)
    number_of_credits = Column(Integer)
    submission_time = Column(Date)
    score = Column(Integer, nullable=True)

    # Relationship to Courses
    courses = relationship("Course", back_populates="applicant")


class Module(Base):
    __tablename__ = "modules"

    module_id = Column(Integer, primary_key=True, index=True)
    module_name = Column(String(100), nullable=False)
    description = Column(Text)

    # Relationship to Courses
    courses = relationship("Course", back_populates="module")


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey("applicants.applicant_id"))
    module_id = Column(Integer, ForeignKey("modules.module_id"))

    course_name = Column(String(100), nullable=False)
    achieved_credits = Column(Integer)
    total_credits = Column(Integer)
    score = Column(Integer)                   # ChatGPT-generated score
    deduction_recommendation = Column(Integer) # ChatGPT’s recommended deductions
    explanation_recommendation = Column(Text)  # ChatGPT’s explanation for the deduction

    # Relationships
    applicant = relationship("Applicant", back_populates="courses")
    module = relationship("Module", back_populates="courses")
