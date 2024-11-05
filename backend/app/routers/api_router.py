from fastapi import APIRouter
from app.views import application_view

api_router = APIRouter()
api_router.include_router(application_view.router, prefix="/api", tags=["applications"])
