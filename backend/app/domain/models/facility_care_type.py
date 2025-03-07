from pydantic import field_validator

from app.domain.models.base import CustomBaseModel
from app.domain.models.utils import validate_uuid


class FacilityCareType(CustomBaseModel):
    id: str
    facility_id: str
    care_type_id: str

    @field_validator("id", "facility_id", "care_type_id", mode="before")
    def validate_uuid(cls, value):
        return validate_uuid(value)
