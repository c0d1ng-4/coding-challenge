from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_201_CREATED, HTTP_404_NOT_FOUND

from app.api.v1.dependencies.repositories import get_facility_repository
from app.api.v1.schemas.facility import FacilityCreate, FacilityResponse, FacilityUpdate
from app.domain.models.capacity_type import CapacityType
from app.domain.models.care_type import CareType
from app.domain.models.facility import Facility
from app.domain.repositories.facility_repository import FacilityRepository

router = APIRouter()


@router.post("", response_model=FacilityResponse, status_code=HTTP_201_CREATED)
async def create_facility(
    facility_in: FacilityCreate,
    facility_repo: FacilityRepository = Depends(get_facility_repository),
) -> FacilityResponse:
    facility = Facility(
        id=None,  # db-generated
        name=facility_in.name,
        capacity=facility_in.capacity,
        zip_code=facility_in.zip_code,
        care_types=facility_in.care_types,
        zip_code_ranges=[],
    )

    zip_ranges_data = [
        {"min_zip_code": zr.min_zip_code, "max_zip_code": zr.max_zip_code} for zr in facility_in.zip_code_ranges
    ]

    return await facility_repo.create_with_zip_ranges(facility, zip_ranges_data)


@router.get("", response_model=list[FacilityResponse])
async def get_facilities(
    skip: int = 0,
    limit: int = 100,
    capacity: CapacityType | None = None,
    care_type: CareType | None = None,
    zip_code: str | None = None,
    facility_repo: FacilityRepository = Depends(get_facility_repository),
) -> list[FacilityResponse]:
    if capacity:
        return await facility_repo.get_by_capacity(capacity)
    elif care_type:
        return await facility_repo.get_by_care_type(care_type)
    elif zip_code:
        return await facility_repo.get_by_zip_code(zip_code)
    return await facility_repo.get_all(skip=skip, limit=limit)


@router.get("/{facility_id}", response_model=FacilityResponse)
async def get_facility(
    facility_id: str,
    facility_repo: FacilityRepository = Depends(get_facility_repository),
) -> FacilityResponse:
    facility = await facility_repo.get_by_id(facility_id)
    if facility is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Facility with ID {facility_id} not found",
        )
    return facility


@router.put("/{facility_id}", response_model=FacilityResponse)
async def update_facility(
    facility_id: str,
    facility_in: FacilityUpdate,
    facility_repo: FacilityRepository = Depends(get_facility_repository),
) -> FacilityResponse:
    current_facility = await facility_repo.get_by_id(facility_id)
    if current_facility is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Facility with ID {facility_id} not found",
        )

    update_data = facility_in.model_dump(exclude_unset=True)
    updated_facility = Facility(
        id=facility_id,
        name=update_data.get("name", current_facility.name),
        capacity=update_data.get("capacity", current_facility.capacity),
        zip_code=update_data.get("zip_code", current_facility.zip_code),
        care_types=update_data.get("care_types", current_facility.care_types),
        zip_code_ranges=update_data.get("zip_code_ranges", current_facility.zip_code_ranges),
    )

    result = await facility_repo.update(facility_id, updated_facility)
    if result is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Facility with ID {facility_id} not found",
        )
    return result


@router.delete("/{facility_id}", response_model=bool)
async def delete_facility(
    facility_id: str,
    facility_repo: FacilityRepository = Depends(get_facility_repository),
) -> bool:
    result = await facility_repo.soft_delete(facility_id)
    if not result:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Facility with ID {facility_id} not found",
        )
    return result
