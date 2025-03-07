from typing import AsyncGenerator

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.facility_repository import FacilityRepository as FacilityRepositoryBase
from app.domain.repositories.patient_repository import PatientRepository as PatientRepositoryBase
from app.infrastructure.database.session import get_db_session
from app.infrastructure.repositories.facility_repository import FacilityRepository
from app.infrastructure.repositories.patient_repository import PatientRepository


async def get_patient_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AsyncGenerator[PatientRepositoryBase, None]:
    yield PatientRepository(session)


async def get_facility_repository(
    session: AsyncSession = Depends(get_db_session),
) -> AsyncGenerator[FacilityRepositoryBase, None]:
    yield FacilityRepository(session)
