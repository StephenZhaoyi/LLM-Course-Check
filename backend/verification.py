import random
import time


VERIFICATION_CODES = {}

def generate_verification_code(email):
    """Generate a random verification code and store it"""
    code = str(random.randint(100000, 999999))
    VERIFICATION_CODES[email] = {
        "code": code,
        "timestamp": time.time()  
    }
    return code

def validate_verification_code(email, code, expiration=300):
    """Verify verification code"""
    if email not in VERIFICATION_CODES:
        return False, "No verification code found"

    stored_code = VERIFICATION_CODES[email]
    # check if verifivation code is expired
    if time.time() - stored_code["timestamp"] > expiration:
        del VERIFICATION_CODES[email]  # delete expired verification code
        return False, "Verification code expired"

    # check if code is matched
    if stored_code["code"] != code:
        return False, "Invalid verification code"

    del VERIFICATION_CODES[email]  # delete verifivation code
    return True, "Verification successful"