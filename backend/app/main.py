from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import dummy_router

PORT = 8000

app = FastAPI(title="My FastAPI Project", description="Project description", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app.lifespan = lifespan


app.include_router(dummy_router.router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=PORT, reload=True, timeout_keep_alive=180)
