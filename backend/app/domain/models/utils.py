from uuid import UUID


def validate_uuid(value: str | None) -> str | None:
    if value is not None:
        try:
            UUID(value)
        except ValueError:
            raise ValueError(f"{value} is not a valid UUID")
    return str(value)
