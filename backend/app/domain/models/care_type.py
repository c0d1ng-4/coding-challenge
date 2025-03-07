from enum import Enum


class CareType(str, Enum):
    Ambulatory = "ambulatory"
    Stationary = "stationary"

    def __str__(self) -> str:
        return self.value
