from pydantic import BaseModel

from app.api.v1.schemas.facility import FacilityResponse
from app.domain.models.care_type import CareType


class FacilityMatchRequest(BaseModel):
    patient_name: str
    care_type: CareType
    zip_code: str | None = None


class FacilityMatchResponse(BaseModel):
    matched: bool
    facility: FacilityResponse | None = None
