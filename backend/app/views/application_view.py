from fastapi import APIRouter
from app.controllers.application_controller import ApplicationController

router = APIRouter()
controller = ApplicationController()


@router.get("/applications/{application_id}")
def read_application(application_id: int):
    return controller.get_application(application_id)
