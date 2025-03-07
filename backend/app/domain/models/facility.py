from pydantic import Field, field_validator

from app.domain.models.base import CustomBaseModel
from app.domain.models.capacity_type import CapacityType
from app.domain.models.care_type import CareType
from app.domain.models.utils import validate_uuid
from app.domain.models.zip_code_range import ZipCodeRange


class Facility(CustomBaseModel):
    id: str
    name: str
    capacity: CapacityType
    zip_code: str
    care_types: list[CareType] = Field(default_factory=list)
    zip_code_ranges: list[ZipCodeRange] = Field(default_factory=list)

    @field_validator("id", mode="before")
    def validate_uuid(cls, value):
        return validate_uuid(value)
