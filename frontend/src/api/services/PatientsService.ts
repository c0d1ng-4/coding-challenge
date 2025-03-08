/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CareType } from '../models/CareType';
import type { PatientCreate } from '../models/PatientCreate';
import type { PatientResponse } from '../models/PatientResponse';
import type { PatientUpdate } from '../models/PatientUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PatientsService {
    /**
     * Create Patient
     * @param requestBody
     * @returns PatientResponse Successful Response
     * @throws ApiError
     */
    public static createPatientApiV1PatientsPost(
        requestBody: PatientCreate,
    ): CancelablePromise<PatientResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/patients',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Patients
     * @param skip
     * @param limit
     * @param careType
     * @param zipCode
     * @returns PatientResponse Successful Response
     * @throws ApiError
     */
    public static getPatientsApiV1PatientsGet(
        skip?: number,
        limit: number = 100,
        careType?: (CareType | null),
        zipCode?: (string | null),
    ): CancelablePromise<Array<PatientResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/patients',
            query: {
                'skip': skip,
                'limit': limit,
                'care_type': careType,
                'zip_code': zipCode,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Patient
     * @param patientId
     * @returns PatientResponse Successful Response
     * @throws ApiError
     */
    public static getPatientApiV1PatientsPatientIdGet(
        patientId: string,
    ): CancelablePromise<PatientResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/patients/{patient_id}',
            path: {
                'patient_id': patientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Patient
     * @param patientId
     * @param requestBody
     * @returns PatientResponse Successful Response
     * @throws ApiError
     */
    public static updatePatientApiV1PatientsPatientIdPut(
        patientId: string,
        requestBody: PatientUpdate,
    ): CancelablePromise<PatientResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/patients/{patient_id}',
            path: {
                'patient_id': patientId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Patient
     * @param patientId
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static deletePatientApiV1PatientsPatientIdDelete(
        patientId: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/patients/{patient_id}',
            path: {
                'patient_id': patientId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
