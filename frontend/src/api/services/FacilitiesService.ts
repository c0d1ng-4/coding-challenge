/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapacityType } from '../models/CapacityType';
import type { CareType } from '../models/CareType';
import type { FacilityCreate } from '../models/FacilityCreate';
import type { FacilityResponse } from '../models/FacilityResponse';
import type { FacilityUpdate } from '../models/FacilityUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FacilitiesService {
    /**
     * Create Facility
     * @param requestBody
     * @returns FacilityResponse Successful Response
     * @throws ApiError
     */
    public static createFacilityApiV1FacilitiesPost(
        requestBody: FacilityCreate,
    ): CancelablePromise<FacilityResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facilities',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Facilities
     * @param skip
     * @param limit
     * @param capacity
     * @param careType
     * @param zipCode
     * @returns FacilityResponse Successful Response
     * @throws ApiError
     */
    public static getFacilitiesApiV1FacilitiesGet(
        skip?: number,
        limit: number = 100,
        capacity?: (CapacityType | null),
        careType?: (CareType | null),
        zipCode?: (string | null),
    ): CancelablePromise<Array<FacilityResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facilities',
            query: {
                'skip': skip,
                'limit': limit,
                'capacity': capacity,
                'care_type': careType,
                'zip_code': zipCode,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Facility
     * @param facilityId
     * @returns FacilityResponse Successful Response
     * @throws ApiError
     */
    public static getFacilityApiV1FacilitiesFacilityIdGet(
        facilityId: string,
    ): CancelablePromise<FacilityResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facilities/{facility_id}',
            path: {
                'facility_id': facilityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Facility
     * @param facilityId
     * @param requestBody
     * @returns FacilityResponse Successful Response
     * @throws ApiError
     */
    public static updateFacilityApiV1FacilitiesFacilityIdPut(
        facilityId: string,
        requestBody: FacilityUpdate,
    ): CancelablePromise<FacilityResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/facilities/{facility_id}',
            path: {
                'facility_id': facilityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Facility
     * @param facilityId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deleteFacilityApiV1FacilitiesFacilityIdDelete(
        facilityId: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/facilities/{facility_id}',
            path: {
                'facility_id': facilityId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
