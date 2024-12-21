from flask import Blueprint, request, jsonify
from app.verification import generate_verification_code, validate_verification_code
from app.utils import send_email

blueprint = Blueprint("routes", __name__)

@blueprint.route("/api/send-code", methods=["POST"])
def send_code():
    data = request.get_json()
    email = data.get("email")

    # 生成验证码
    code = generate_verification_code(email)

    # 发送验证码邮件
    subject = "Your Login Verification Code"
    message = f"Your verification code is: {code}. It will expire in 5 minutes."
    if send_email(email, subject, message):
        return jsonify({"success": True, "message": "Verification code sent"}), 200
    return jsonify({"success": False, "message": "Failed to send email"}), 500

@blueprint.route("/api/verify-code", methods=["POST"])
def verify_code():
    data = request.get_json()
    email = data.get("email")
    code = data.get("code")

    # 验证验证码
    success, message = validate_verification_code(email, code)
    if success:
        return jsonify({"success": True, "message": message}), 200
    return jsonify({"success": False, "message": message}), 400
