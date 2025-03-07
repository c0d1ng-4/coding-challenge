from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models.patient import Patient
from app.domain.repositories.patient_repository import PatientRepository as PatientRepositoryBase
from app.infrastructure.database.models import Patient as PatientModel
from app.infrastructure.repositories.base import SQLAlchemyRepository


class PatientRepository(SQLAlchemyRepository[PatientModel, Patient], PatientRepositoryBase):
    def __init__(self, session: AsyncSession):
        super().__init__(session, PatientModel)

    async def get_by_care_type(self, care_type: str) -> list[Patient]:
        stmt = select(self.model_class).where(
            self.model_class.care_type == care_type, self.model_class.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.scalars().all()]

    async def get_by_zip_code(self, zip_code: str) -> list[Patient]:
        stmt = select(self.model_class).where(
            self.model_class.zip_code == zip_code, self.model_class.deleted_at.is_(None)
        )
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.scalars().all()]

    async def _to_domain(self, db_obj: PatientModel) -> Patient:
        return Patient(
            id=str(db_obj.id),
            name=db_obj.name,
            care_type=db_obj.care_type,
            zip_code=db_obj.zip_code,
            address=db_obj.address if hasattr(db_obj, "address") else "",
        )
