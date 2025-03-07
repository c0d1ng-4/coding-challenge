from pydantic import field_validator

from app.domain.models.base import CustomBaseModel
from app.domain.models.utils import validate_uuid


class ZipCodeRange(CustomBaseModel):
    id: str
    facility_id: str
    min_zip_code: int
    max_zip_code: int

    @field_validator("id", "facility_id", mode="before")
    def validate_uuid(cls, value):
        return validate_uuid(value)
