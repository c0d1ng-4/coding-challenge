import uuid

import sqlalchemy as sa
from sqlalchemy import TIMESTAMP, CheckConstraint, Column, Enum, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

import app.infrastructure.database.base as base
from app.domain.models.capacity_type import CapacityType
from app.domain.models.care_type import CareType


class Patient(base.Base):
    __tablename__ = "patients"

    id = Column(base.UUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    zip_code = Column(String, nullable=True, index=True)
    care_type = Column(Enum(CareType), nullable=False)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
        onupdate=sa.sql.func.now(),
    )


class Facility(base.Base):
    __tablename__ = "facilities"

    id = Column(base.UUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    facility_zip_code = Column(String, nullable=False, index=True)
    capacity_status = Column(Enum(CapacityType), nullable=False, default=CapacityType.AVAILABLE)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
        onupdate=sa.sql.func.now(),
    )

    care_types = relationship("FacilityCareType", back_populates="facility", cascade="all, delete-orphan")
    zip_code_ranges = relationship("ZipCodeRange", back_populates="facility", cascade="all, delete-orphan")


class CareTypeModel(base.Base):
    __tablename__ = "care_types"

    id = Column(base.UUID(), primary_key=True, default=uuid.uuid4)
    name = Column(Enum(CareType), nullable=False, unique=True, index=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
        onupdate=sa.sql.func.now(),
    )

    facilities = relationship("FacilityCareType", back_populates="care_type")


class FacilityCareType(base.Base):
    __tablename__ = "facility_care_types"

    id = Column(base.UUID(), primary_key=True, default=uuid.uuid4)
    facility_id = Column(
        base.UUID(),
        ForeignKey("facilities.id", ondelete="CASCADE"),
        nullable=False,
    )
    care_type_id = Column(
        base.UUID(),
        ForeignKey("care_types.id", ondelete="CASCADE"),
        nullable=False,
    )
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
        onupdate=sa.sql.func.now(),
    )

    facility = relationship("Facility", back_populates="care_types")
    care_type = relationship("CareTypeModel", back_populates="facilities")

    __table_args__ = (UniqueConstraint("facility_id", "care_type_id", name="uq_facility_care_type"),)


class ZipCodeRange(base.Base):
    __tablename__ = "zip_code_ranges"

    id = Column(base.UUID(), primary_key=True, default=uuid.uuid4)
    facility_id = Column(
        base.UUID(),
        ForeignKey("facilities.id", ondelete="CASCADE"),
        nullable=False,
    )
    min_zip_code = Column(Integer, nullable=False, index=True)
    max_zip_code = Column(Integer, nullable=False, index=True)
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=sa.sql.func.now(),
        nullable=False,
        index=True,
        onupdate=sa.sql.func.now(),
    )

    facility = relationship("Facility", back_populates="zip_code_ranges")

    __table_args__ = (CheckConstraint("min_zip_code <= max_zip_code", name="valid_range"),)
