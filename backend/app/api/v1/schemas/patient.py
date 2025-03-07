from pydantic import BaseModel

from app.domain.models.care_type import CareType


class PatientBase(BaseModel):
    name: str
    care_type: CareType
    zip_code: str | None = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(PatientBase):
    name: str | None = None
    care_type: CareType | None = None
    zip_code: str | None = None


class PatientInDB(PatientBase):
    id: str

    class Config:
        from_attributes = True


class PatientResponse(PatientInDB):
    pass
