from enum import Enum


class CapacityType(str, Enum):
    FULL = "full"
    AVAILABLE = "available"

    def __str__(self) -> str:
        return self.value
