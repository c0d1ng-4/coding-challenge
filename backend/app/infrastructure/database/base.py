# flake8: noqa: F401
from sqlalchemy.dialects.postgresql import UUID as _UUID
from sqlalchemy.orm import declarative_base

Base = declarative_base()


def UUID():
    return _UUID(as_uuid=True)


from app.infrastructure.database.models import Facility, FacilityCareType, Patient, ZipCodeRange
