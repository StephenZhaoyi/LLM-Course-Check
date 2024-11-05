from fastapi import FastAPI
from .core.config import settings
from .routers.api_router import api_router

app = FastAPI(title=settings.PROJECT_NAME)

app.include_router(api_router)
# from typing import Union
# from app.core.config import settings
#
# from fastapi import FastAPI
#
# app = FastAPI(title=settings.PROJECT_NAME)
#
#
# @app.get("/")
# def read_root():
#     return {"Hello": "World"}
#
#
# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}