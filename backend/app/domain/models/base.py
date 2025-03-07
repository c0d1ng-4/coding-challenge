from datetime import datetime, timezone
from typing import Self

from pydantic import BaseModel, ConfigDict, model_validator


class CustomBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    # use utc timezone for all datetime fields to avoid timezone issues
    @model_validator(mode="after")
    def validate_model(self) -> Self:
        for key, value in self.model_fields.items():
            if isinstance(value, datetime) and value.tzinfo is None:
                setattr(self, key, value.astimezone(timezone.utc))
        return self

    # to enforce json serialization for all models
    def model_dump(self, **kwargs) -> dict:
        if "mode" not in kwargs:
            kwargs["mode"] = "json"
        return super().model_dump(**kwargs)
