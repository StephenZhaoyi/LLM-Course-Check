from app.models.application_model import Application
from app.core.database import SessionLocal


class ApplicationController:
    def get_application(self, application_id: int):
        db = SessionLocal()
        application = db.query(Application).filter(Application.id == application_id).first()
        db.close()
        return application
