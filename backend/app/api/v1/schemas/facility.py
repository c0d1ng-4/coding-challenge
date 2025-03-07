from pydantic import BaseModel, Field

from app.domain.models.capacity_type import CapacityType
from app.domain.models.care_type import CareType


class ZipCodeRangeCreate(BaseModel):
    min_zip_code: int
    max_zip_code: int


class FacilityBase(BaseModel):
    name: str
    zip_code: str
    capacity: CapacityType
    care_types: list[CareType] = Field(default_factory=list)
    zip_code_ranges: list[ZipCodeRangeCreate] = Field(default_factory=list)


class FacilityCreate(FacilityBase):
    pass


class FacilityUpdate(FacilityBase):
    name: str | None = None
    zip_code: str | None = None
    capacity: CapacityType | None = None
    care_types: list[CareType] | None = None
    zip_code_ranges: list[ZipCodeRangeCreate] | None = None


class FacilityInDB(FacilityBase):
    id: str

    class Config:
        from_attributes = True


class FacilityResponse(FacilityInDB):
    pass
