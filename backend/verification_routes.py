# verification_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from verification import generate_verification_code, validate_verification_code
from utils import send_email

router = APIRouter()


class EmailRequest(BaseModel):
    email: EmailStr

class VerifyRequest(BaseModel):
    email: EmailStr
    code: str

@router.post("/api/send-code")
async def send_code(request: EmailRequest):
    email = request.email
    
    code = generate_verification_code(email)
    subject = "Your Login Verification Code"
    message = f"Your verification code is: {code}. It will expire in 5 minutes."
    if send_email(email, subject, message):
        return {"success": True, "message": "Verification code sent"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email")

@router.post("/api/verify-code")
async def verify_code(request: VerifyRequest):
    email = request.email
    code = request.code
    success, message = validate_verification_code(email, code)
    if success:
        return {"success": True, "message": message}
    else:
        raise HTTPException(status_code=400, detail=message)
