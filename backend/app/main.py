from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.api.v1.api import api_router
from app.core.config import settings

PORT = 8000

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Coding challenge",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://coding-challenge-livid.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app.lifespan = lifespan

app.include_router(api_router, prefix=settings.API_V1_STR)

handler = Mangum(app)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=PORT, reload=True, timeout_keep_alive=180)
