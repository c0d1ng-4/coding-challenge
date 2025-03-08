/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapacityType } from './CapacityType';
import type { CareType } from './CareType';
import type { ZipCodeRangeCreate } from './ZipCodeRangeCreate';
export type FacilityCreate = {
    name: string;
    zip_code: string;
    capacity: CapacityType;
    care_types?: Array<CareType>;
    zip_code_ranges?: Array<ZipCodeRangeCreate>;
};

