from dataclasses import dataclass

from app.domain.models.capacity_type import CapacityType
from app.domain.models.care_type import CareType
from app.domain.models.facility import Facility
from app.domain.repositories.facility_repository import FacilityRepository


@dataclass
class MatchFacilityUseCase:
    facility_repository: FacilityRepository

    async def execute(self, care_type: CareType, zip_code: str | None = None) -> Facility | None:
        if care_type == CareType.day_care:
            return None

        if not zip_code:
            return None

        facilities = await self.facility_repository.get_by_care_type(care_type)

        if not facilities:
            return None

        patient_zip = int(zip_code)
        eligible_facilities: list[Facility] = []

        for facility in facilities:
            for zip_range in facility.zip_code_ranges:
                if zip_range.min_zip_code <= patient_zip <= zip_range.max_zip_code:
                    eligible_facilities.append(facility)
                    break

        if not eligible_facilities:
            return None

        def facility_priority(facility: Facility) -> tuple[int, int]:
            availability_score = 0 if facility.capacity == CapacityType.AVAILABLE else 1
            distance = abs(int(facility.zip_code) - patient_zip)
            return (availability_score, distance)

        eligible_facilities.sort(key=facility_priority)

        best_available_facility = next((f for f in eligible_facilities if f.capacity == CapacityType.AVAILABLE), None)

        if best_available_facility:
            distance = abs(int(best_available_facility.zip_code) - patient_zip)
            if distance > 3000:
                return None

            best_available_facility.zip_code_ranges = [
                {"min_zip_code": zr.min_zip_code, "max_zip_code": zr.max_zip_code}
                for zr in best_available_facility.zip_code_ranges
            ]
            return best_available_facility

        return None
