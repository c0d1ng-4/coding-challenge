from abc import ABC

from app.domain.models.patient import Patient
from app.domain.repositories.base import BaseRepository


class PatientRepository(BaseRepository[Patient], ABC):
    async def get_by_care_type(self, care_type: str) -> list[Patient]:
        pass

    async def get_by_zip_code(self, zip_code: str) -> list[Patient]:
        pass
