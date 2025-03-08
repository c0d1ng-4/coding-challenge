/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapacityType } from './CapacityType';
import type { CareType } from './CareType';
import type { ZipCodeRangeCreate } from './ZipCodeRangeCreate';
export type FacilityUpdate = {
    name?: (string | null);
    zip_code?: (string | null);
    capacity?: (CapacityType | null);
    care_types?: (Array<CareType> | null);
    zip_code_ranges?: (Array<ZipCodeRangeCreate> | null);
};

