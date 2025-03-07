from pydantic import Field, field_validator

from app.domain.models.base import CustomBaseModel
from app.domain.models.capacity_type import CapacityType
from app.domain.models.care_type import CareType
from app.domain.models.utils import validate_uuid
from app.domain.models.zip_code_range import ZipCodeRange


class Facility(CustomBaseModel):
    id: str | None = None
    name: str
    capacity: CapacityType
    zip_code: str
    care_types: list[CareType] = Field(default_factory=list)
    zip_code_ranges: list[ZipCodeRange] = Field(default_factory=list)

    @field_validator("id", mode="before")
    def validate_uuid(cls, value):
        if value is None:
            return value
        return validate_uuid(value)

    @field_validator("capacity", mode="before")
    def validate_capacity(cls, value: str | None):
        if value is not None:
            return value.lower()
        return value

    @field_validator("care_types", mode="before")
    def validate_care_types(cls, value: list[str] | None):
        if value is not None:
            return [care_type.lower() for care_type in value]
        return value
