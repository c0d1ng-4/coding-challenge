from pydantic import field_validator

from app.domain.models.base import CustomBaseModel
from backend.app.domain.models.care_type import CareType
from backend.app.domain.models.utils import validate_uuid


class Patient(CustomBaseModel):
    id: str
    name: str
    address: str
    care_type: CareType
    zip_code: str | None = None

    @field_validator("id", mode="before")
    def validate_uuid(cls, value):
        return validate_uuid(value)
