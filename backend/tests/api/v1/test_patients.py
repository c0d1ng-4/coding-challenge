import pytest
from fastapi.testclient import TestClient

from app.domain.models.care_type import CareType
from app.domain.models.patient import Patient


async def create_test_patient(client: TestClient) -> str:
    patient = Patient(name="Test Patient", care_type=CareType.ambulatory, zip_code="12345")
    response = client.post("/api/v1/patients", json=patient.model_dump())
    return response.json()["id"]


@pytest.mark.asyncio
async def test_create_patient(client: TestClient):
    patient_id = await create_test_patient(client)
    assert patient_id is not None


@pytest.mark.asyncio
async def test_get_patients(client: TestClient):
    # Create a test patient first
    await create_test_patient(client)

    # Test getting all patients
    response = client.get("/api/v1/patients")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0
