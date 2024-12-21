from flask import Flask
from app.config import Config
from app.extensions import jwt
from app.routes import blueprint
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    # 初始化扩展
    jwt.init_app(app)

    # 注册蓝图
    app.register_blueprint(blueprint)

    return app
