from fastapi import APIRouter

from app.api.v1.endpoints import facilities, facility_matching, patients

api_router = APIRouter()

api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
api_router.include_router(facilities.router, prefix="/facilities", tags=["facilities"])
api_router.include_router(facility_matching.router, prefix="/facility-matching", tags=["facility-matching"])
