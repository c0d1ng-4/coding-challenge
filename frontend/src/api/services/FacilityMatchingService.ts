/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FacilityMatchRequest } from '../models/FacilityMatchRequest';
import type { FacilityMatchResponse } from '../models/FacilityMatchResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FacilityMatchingService {
    /**
     * Match Facility
     * @param requestBody
     * @returns FacilityMatchResponse Successful Response
     * @throws ApiError
     */
    public static matchFacilityApiV1FacilityMatchingMatchFacilityPost(
        requestBody: FacilityMatchRequest,
    ): CancelablePromise<FacilityMatchResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facility-matching/match-facility',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
