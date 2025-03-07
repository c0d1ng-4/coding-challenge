from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class BaseRepository(Generic[T], ABC):
    @abstractmethod
    async def create(self, obj_in: T) -> T:
        pass

    @abstractmethod
    async def get_by_id(self, id: str) -> T | None:
        pass

    @abstractmethod
    async def get_all(self, skip: int = 0, limit: int = 100) -> list[T]:
        pass

    @abstractmethod
    async def update(self, id: str, obj_in: T) -> T | None:
        pass

    @abstractmethod
    async def delete(self, id: str) -> bool:
        pass

    @abstractmethod
    async def soft_delete(self, id: str) -> bool:
        pass
