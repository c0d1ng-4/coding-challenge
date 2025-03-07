from pydantic import field_validator

from app.domain.models.base import CustomBaseModel
from app.domain.models.care_type import CareType
from app.domain.models.utils import validate_uuid


class Patient(CustomBaseModel):
    id: str | None = None
    name: str
    care_type: CareType
    zip_code: str | None = None

    @field_validator("id", mode="before")
    def validate_uuid(cls, value):
        return validate_uuid(value)

    @field_validator("care_type", mode="before")
    def validate_care_type(cls, value: str | None):
        if value is not None:
            return value.lower()
        return value
