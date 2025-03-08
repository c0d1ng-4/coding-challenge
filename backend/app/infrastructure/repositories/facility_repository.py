from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.domain.models.care_type import CareType
from app.domain.models.facility import Facility
from app.domain.models.zip_code_range import ZipCodeRange
from app.domain.repositories.facility_repository import FacilityRepository as FacilityRepositoryBase
from app.infrastructure.database.models import CareTypeModel
from app.infrastructure.database.models import Facility as FacilityModel
from app.infrastructure.database.models import FacilityCareType
from app.infrastructure.database.models import ZipCodeRange as ZipCodeRangeModel
from app.infrastructure.repositories.base import SQLAlchemyRepository


class FacilityRepository(SQLAlchemyRepository[FacilityModel, Facility], FacilityRepositoryBase):
    def __init__(self, session: AsyncSession):
        super().__init__(session, FacilityModel)

    async def get_by_capacity(self, capacity: str) -> list[Facility]:
        stmt = (
            select(self.model_class)
            .where(self.model_class.capacity_status == capacity, self.model_class.deleted_at.is_(None))
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.unique().scalars().all()]

    async def get_by_zip_code(self, zip_code: str) -> list[Facility]:
        stmt = (
            select(self.model_class)
            .where(self.model_class.facility_zip_code == zip_code, self.model_class.deleted_at.is_(None))
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.unique().scalars().all()]

    async def get_by_care_type(self, care_type: CareType) -> list[Facility]:
        stmt = (
            select(self.model_class)
            .join(FacilityCareType, FacilityCareType.facility_id == self.model_class.id)
            .join(CareTypeModel, CareTypeModel.id == FacilityCareType.care_type_id)
            .where(CareTypeModel.name == care_type, self.model_class.deleted_at.is_(None))
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.unique().scalars().all()]

    async def create(self, obj_in: Facility) -> Facility:
        facility_data = obj_in.model_dump(exclude={"id", "care_types", "zip_code_ranges"})
        db_obj = self.model_class(**facility_data)
        self.session.add(db_obj)
        await self.session.flush()

        # add care types
        if obj_in.care_types:
            for care_type in obj_in.care_types:
                care_type_stmt = select(CareTypeModel).where(CareTypeModel.name == care_type)
                care_type_result = await self.session.execute(care_type_stmt)
                care_type_db = care_type_result.scalars().first()

                if not care_type_db:
                    care_type_db = CareTypeModel(name=care_type)
                    self.session.add(care_type_db)
                    await self.session.flush()

                # create association
                facility_care_type = FacilityCareType(facility_id=db_obj.id, care_type_id=care_type_db.id)
                self.session.add(facility_care_type)

        # add zip code ranges
        if obj_in.zip_code_ranges:
            for zip_range in obj_in.zip_code_ranges:
                zip_range_db = ZipCodeRangeModel(
                    facility_id=db_obj.id, min_zip_code=zip_range.min_zip_code, max_zip_code=zip_range.max_zip_code
                )
                self.session.add(zip_range_db)

        await self.session.flush()
        return await self.get_by_id(str(db_obj.id))

    async def update(self, id: str, obj_in: Facility) -> Facility | None:
        stmt = (
            select(self.model_class)
            .where(self.model_class.id == id)
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        result = await self.session.execute(stmt)
        db_obj = result.scalars().first()

        if db_obj is None:
            return None

        # update basic facility attributes
        facility_data = obj_in.model_dump(exclude={"id", "care_types", "zip_code_ranges"})
        for field, value in facility_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)

        # update care types if provided
        if obj_in.care_types is not None:
            # clear existing care types
            care_types_stmt = select(FacilityCareType).where(FacilityCareType.facility_id == id)
            care_types_result = await self.session.execute(care_types_stmt)
            for care_type_assoc in care_types_result.scalars().all():
                await self.session.delete(care_type_assoc)

            # add new care types
            for care_type in obj_in.care_types:
                care_type_stmt = select(CareTypeModel).where(CareTypeModel.name == care_type)
                care_type_result = await self.session.execute(care_type_stmt)
                care_type_db = care_type_result.scalars().first()

                if not care_type_db:
                    care_type_db = CareTypeModel(name=care_type)
                    self.session.add(care_type_db)
                    await self.session.flush()

                facility_care_type = FacilityCareType(facility_id=db_obj.id, care_type_id=care_type_db.id)
                self.session.add(facility_care_type)

        if obj_in.zip_code_ranges is not None:
            zip_ranges_stmt = select(ZipCodeRangeModel).where(ZipCodeRangeModel.facility_id == id)
            zip_ranges_result = await self.session.execute(zip_ranges_stmt)
            for zip_range in zip_ranges_result.scalars().all():
                await self.session.delete(zip_range)

            for zip_range in obj_in.zip_code_ranges:
                zip_range_db = ZipCodeRangeModel(
                    facility_id=db_obj.id, min_zip_code=zip_range.min_zip_code, max_zip_code=zip_range.max_zip_code
                )
                self.session.add(zip_range_db)

        await self.session.flush()

        reload_stmt = (
            select(self.model_class)
            .where(self.model_class.id == id)
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        reload_result = await self.session.execute(reload_stmt)
        updated_db_obj = reload_result.scalars().first()

        return await self._to_domain(updated_db_obj)

    async def create_with_zip_ranges(self, obj_in: Facility, zip_ranges_data: list[dict]) -> Facility:
        db_obj = self.model_class(
            name=obj_in.name,
            facility_zip_code=obj_in.zip_code,
            capacity_status=obj_in.capacity,
        )
        self.session.add(db_obj)
        await self.session.flush()

        for care_type in obj_in.care_types:
            care_type_stmt = select(CareTypeModel).where(CareTypeModel.name == care_type)
            care_type_result = await self.session.execute(care_type_stmt)
            care_type_db = care_type_result.scalars().first()

            if not care_type_db:
                care_type_db = CareTypeModel(name=care_type)
                self.session.add(care_type_db)
                await self.session.flush()

            facility_care_type = FacilityCareType(
                facility_id=db_obj.id,
                care_type_id=care_type_db.id,
            )
            self.session.add(facility_care_type)

        for zip_range in zip_ranges_data:
            zip_range_db = ZipCodeRangeModel(
                facility_id=db_obj.id,
                min_zip_code=zip_range["min_zip_code"],
                max_zip_code=zip_range["max_zip_code"],
            )
            self.session.add(zip_range_db)

        await self.session.flush()

        stmt = (
            select(self.model_class)
            .where(self.model_class.id == db_obj.id)
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        result = await self.session.execute(stmt)
        loaded_obj = result.scalars().first()
        return await self._to_domain(loaded_obj)

    async def _to_domain(self, db_obj: FacilityModel) -> Facility:
        care_types = []
        zip_code_ranges = []

        if hasattr(db_obj, "care_types") and db_obj.care_types:
            for facility_care_type in db_obj.care_types:
                if hasattr(facility_care_type, "care_type") and facility_care_type.care_type:
                    care_types.append(facility_care_type.care_type.name)

        if hasattr(db_obj, "zip_code_ranges") and db_obj.zip_code_ranges:
            for zip_range in db_obj.zip_code_ranges:
                zip_code_ranges.append(
                    ZipCodeRange(
                        id=str(zip_range.id),
                        facility_id=str(zip_range.facility_id),
                        min_zip_code=zip_range.min_zip_code,
                        max_zip_code=zip_range.max_zip_code,
                    )
                )

        return Facility(
            id=str(db_obj.id),
            name=db_obj.name,
            capacity=db_obj.capacity_status,
            zip_code=db_obj.facility_zip_code,
            care_types=care_types,
            zip_code_ranges=zip_code_ranges,
        )

    async def get_all(self, skip: int = 0, limit: int = 100) -> list[Facility]:
        stmt = (
            select(self.model_class)
            .where(self.model_class.deleted_at.is_(None))
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return [await self._to_domain(obj) for obj in result.unique().scalars().all()]

    async def get_by_id(self, id: str) -> Facility | None:
        # override - eager load care types and zip code ranges
        stmt = (
            select(self.model_class)
            .where(self.model_class.id == id, self.model_class.deleted_at.is_(None))
            .options(
                joinedload(self.model_class.care_types).joinedload(FacilityCareType.care_type),
                joinedload(self.model_class.zip_code_ranges),
            )
        )
        result = await self.session.execute(stmt)
        db_obj = result.scalars().first()
        if db_obj is None:
            return None
        return await self._to_domain(db_obj)
