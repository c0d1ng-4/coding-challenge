import os
from typing import Any

from pydantic import PostgresDsn, ValidationInfo, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Healthcare Facility API"

    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    DB_NAME: str = os.getenv("DB_NAME", "postgres")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DATABASE_URL: str | None = None
    DB_ECHO_LOG: bool = False

    @field_validator("DATABASE_URL", mode="before")
    def assemble_db_url(cls, v: str | None, info: ValidationInfo) -> Any:
        if isinstance(v, str):
            return v

        db_url = PostgresDsn.build(
            scheme="postgresql+asyncpg",
            username=info.data.get("DB_USER"),
            password=info.data.get("DB_PASSWORD"),
            host=info.data.get("DB_HOST"),
            port=int(info.data.get("DB_PORT", 5432)),
            path=f"{info.data.get('DB_NAME') or ''}",
        )
        return str(db_url)

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
