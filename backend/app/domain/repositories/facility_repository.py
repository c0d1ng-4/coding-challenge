from abc import ABC

from app.domain.models.care_type import CareType
from app.domain.models.facility import Facility
from app.domain.repositories.base import BaseRepository


class FacilityRepository(BaseRepository[Facility], ABC):
    async def get_by_capacity(self, capacity: str) -> list[Facility]:
        pass

    async def get_by_zip_code(self, zip_code: str) -> list[Facility]:
        pass

    async def get_by_care_type(self, care_type: CareType) -> list[Facility]:
        pass
