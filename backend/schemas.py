# schemas.py
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import date, datetime

# ---------------------
# APPLICANT SCHEMAS
# ---------------------
class ApplicantBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    nationality: Optional[str] = None
    university: Optional[str] = None
    subject: Optional[str] = None
    regular_duration: Optional[int] = None
    number_of_credits: Optional[int] = None
    submission_time: Optional[datetime] = None
    score: Optional[int] = None

class ApplicantCreate(ApplicantBase):
    """ Used for creating new applicants """
    pass

class ApplicantOut(ApplicantBase):
    applicant_id: int

    model_config = ConfigDict(from_attributes=True)  # ✅ Fixes orm_mode warning

# ---------------------
# MODULE SCHEMAS
# ---------------------
class ModuleBase(BaseModel):
    module_name: str
    description: Optional[str] = None

class ModuleCreate(ModuleBase):
    pass

class ModuleOut(ModuleBase):
    module_id: int

    model_config = ConfigDict(from_attributes=True)  # ✅ Fixes orm_mode warning

# ---------------------
# COURSE SCHEMAS
# ---------------------
class CourseBase(BaseModel):
    course_name: str
    achieved_credits: Optional[int] = None
    total_credits: Optional[int] = None
    score: Optional[int] = None
    deduction_recommendation: Optional[int] = None
    explanation_recommendation: Optional[str] = None

class CourseCreate(CourseBase):
    applicant_id: int
    module_id: int

class CourseOut(CourseBase):
    course_id: int
    applicant_id: Optional[int] = None
    module_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)  # ✅ Fixes orm_mode warning




