import asyncio
from typing import AsyncGenerator

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.api.v1.api import api_router
from app.core.config import settings
from app.infrastructure.database.base import Base
from app.infrastructure.database.session import get_db_session

# Use SQLite for simplicity
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="function")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def db_engine():
    """Create a test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
    )

    # Create all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield engine

    # Drop all tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest.fixture
async def db_session(db_engine) -> AsyncGenerator[AsyncSession, None]:
    """Get a test database session."""
    session_factory = sessionmaker(
        db_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
    )

    async with session_factory() as session:
        yield session
        # Rollback any changes
        await session.rollback()


@pytest.fixture
def test_app(db_session):
    """Create a test FastAPI app with DB session override."""
    app = FastAPI()
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Override the dependency
    async def get_test_db():
        yield db_session

    app.dependency_overrides[get_db_session] = get_test_db

    return app


@pytest.fixture
def client(test_app):
    """Return a TestClient configured with the test app."""
    with TestClient(test_app) as test_client:
        yield test_client
