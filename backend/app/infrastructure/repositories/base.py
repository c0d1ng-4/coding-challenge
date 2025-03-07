from datetime import datetime, timezone
from typing import Generic, Type, TypeVar

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.repositories.base import BaseRepository

ModelType = TypeVar("ModelType")
DomainModelType = TypeVar("DomainModelType")


class SQLAlchemyRepository(BaseRepository[DomainModelType], Generic[ModelType, DomainModelType]):
    def __init__(self, session: AsyncSession, model_class: Type[ModelType]):
        self.session = session
        self.model_class = model_class

    async def create(self, obj_in: DomainModelType) -> DomainModelType:
        db_obj = self.model_class(**obj_in.model_dump(exclude={"id"} if obj_in.id is None else {}))
        self.session.add(db_obj)
        await self.session.flush()
        return await self._to_domain(db_obj)

    async def get_by_id(self, id: str) -> DomainModelType | None:
        stmt = select(self.model_class).where(self.model_class.id == id, self.model_class.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        db_obj = result.scalars().first()
        if db_obj is None:
            return None
        return await self._to_domain(db_obj)

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[DomainModelType]:
        stmt = select(self.model_class).where(self.model_class.deleted_at.is_(None)).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.scalars().all()]

    async def update(self, id: str, obj_in: DomainModelType) -> DomainModelType | None:
        stmt = select(self.model_class).where(self.model_class.id == id, self.model_class.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        db_obj = result.scalars().first()

        if db_obj is None:
            return None

        obj_data = obj_in.model_dump(exclude={"id"})
        for field, value in obj_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        self.session.add(db_obj)
        await self.session.flush()
        return await self._to_domain(db_obj)

    async def delete(self, id: str) -> bool:
        stmt = select(self.model_class).where(self.model_class.id == id, self.model_class.deleted_at.is_(None))
        result = await self.session.execute(stmt)
        db_obj = result.scalars().first()

        if db_obj is None:
            return False

        await self.session.delete(db_obj)
        return True

    async def soft_delete(self, id: str) -> bool:
        stmt = (
            update(self.model_class)
            .where(self.model_class.id == id, self.model_class.deleted_at.is_(None))
            .values(deleted_at=datetime.now(timezone.utc))
        )

        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0

    async def _to_domain(self, db_obj: ModelType) -> DomainModelType:
        """Convert a database model to a domain model"""
        raise NotImplementedError("Subclasses must implement this method")
