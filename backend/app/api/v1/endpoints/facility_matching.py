from fastapi import APIRouter, Depends

from app.api.v1.dependencies.repositories import get_facility_repository
from app.api.v1.schemas.facility_match import FacilityMatchRequest, FacilityMatchResponse
from app.domain.repositories.facility_repository import FacilityRepository
from app.use_cases.match_facility import MatchFacilityUseCase

router = APIRouter()


@router.post("/match-facility", response_model=FacilityMatchResponse)
async def match_facility(
    request: FacilityMatchRequest,
    facility_repo: FacilityRepository = Depends(get_facility_repository),
):
    match_facility_use_case = MatchFacilityUseCase(facility_repository=facility_repo)
    facility = await match_facility_use_case.execute(request.care_type, request.zip_code)

    return FacilityMatchResponse(matched=facility is not None, facility=facility)
