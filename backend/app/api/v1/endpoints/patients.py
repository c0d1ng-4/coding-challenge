from fastapi import APIRouter, Depends, HTTPException
from starlette.status import HTTP_201_CREATED, HTTP_404_NOT_FOUND

from app.api.v1.dependencies.repositories import get_patient_repository
from app.api.v1.schemas.patient import PatientCreate, PatientResponse, PatientUpdate
from app.domain.models.care_type import CareType
from app.domain.models.patient import Patient
from app.domain.repositories.patient_repository import PatientRepository

router = APIRouter()


@router.post("", response_model=PatientResponse, status_code=HTTP_201_CREATED)
async def create_patient(
    patient_in: PatientCreate,
    patient_repo: PatientRepository = Depends(get_patient_repository),
) -> PatientResponse:

    patient = Patient(
        name=patient_in.name,
        care_type=patient_in.care_type,
        zip_code=patient_in.zip_code,
    )
    return await patient_repo.create(patient)


@router.get("", response_model=list[PatientResponse])
async def get_patients(
    skip: int = 0,
    limit: int = 100,
    care_type: CareType | None = None,
    zip_code: str | None = None,
    patient_repo: PatientRepository = Depends(get_patient_repository),
) -> list[PatientResponse]:
    if care_type:
        return await patient_repo.get_by_care_type(care_type)
    elif zip_code:
        return await patient_repo.get_by_zip_code(zip_code)
    return await patient_repo.get_all(skip=skip, limit=limit)


@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: str,
    patient_repo: PatientRepository = Depends(get_patient_repository),
) -> PatientResponse:
    patient = await patient_repo.get_by_id(patient_id)
    if patient is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found",
        )
    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: str,
    patient_in: PatientUpdate,
    patient_repo: PatientRepository = Depends(get_patient_repository),
) -> PatientResponse:
    current_patient = await patient_repo.get_by_id(patient_id)
    if current_patient is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found",
        )

    update_data = patient_in.model_dump(exclude_unset=True)
    updated_patient = Patient(
        id=patient_id,
        name=update_data.get("name", current_patient.name),
        care_type=update_data.get("care_type", current_patient.care_type),
        zip_code=update_data.get("zip_code", current_patient.zip_code),
    )

    result = await patient_repo.update(patient_id, updated_patient)
    if result is None:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found",
        )
    return result


@router.delete("/{patient_id}", response_model=bool)
async def delete_patient(
    patient_id: str,
    patient_repo: PatientRepository = Depends(get_patient_repository),
) -> bool:
    result = await patient_repo.soft_delete(patient_id)
    if not result:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found",
        )
    return result
