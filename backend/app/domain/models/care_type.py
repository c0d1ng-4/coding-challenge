from enum import Enum


class CareType(str, Enum):
    ambulatory = "ambulatory"
    stationary = "stationary"
    day_care = "day_care"

    def __str__(self) -> str:
        return self.value
