import random
import time

# 存储验证码信息 (临时存储，生产环境应存储在数据库中)
VERIFICATION_CODES = {}

def generate_verification_code(email):
    """生成随机验证码并存储"""
    code = str(random.randint(100000, 999999))
    VERIFICATION_CODES[email] = {
        "code": code,
        "timestamp": time.time()  # 保存生成时间，方便过期验证
    }
    return code

def validate_verification_code(email, code, expiration=300):
    """验证验证码"""
    if email not in VERIFICATION_CODES:
        return False, "No verification code found"

    stored_code = VERIFICATION_CODES[email]
    # 检查验证码是否过期
    if time.time() - stored_code["timestamp"] > expiration:
        del VERIFICATION_CODES[email]  # 删除过期验证码
        return False, "Verification code expired"

    # 检查验证码是否匹配
    if stored_code["code"] != code:
        return False, "Invalid verification code"

    del VERIFICATION_CODES[email]  # 验证成功后删除验证码
    return True, "Verification successful"
