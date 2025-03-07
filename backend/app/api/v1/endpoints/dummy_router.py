from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def dummy_endpoint():
    return {"message": "Hello, World!"}
