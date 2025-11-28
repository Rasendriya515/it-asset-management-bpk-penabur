from fastapi import APIRouter
from app.api.v1.endpoints import areas, auth, assets, schools, dashboard, service_histories

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(areas.router, prefix="/areas", tags=["areas"])
api_router.include_router(assets.router, prefix="/assets", tags=["assets"])
api_router.include_router(schools.router, prefix="/schools", tags=["schools"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(service_histories.router, prefix="/services", tags=["services"])