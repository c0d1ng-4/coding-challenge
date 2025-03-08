import { FacilityFormData } from "@/lib/schemas/facility-schema";
import { FacilitiesService } from "./FacilitiesService";
import { FacilityCreate } from "../models/FacilityCreate";
import { FacilityUpdate } from "../models/FacilityUpdate";
import { ApiError } from "../core/ApiError";

interface ServiceResult {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

export class FacilityService {
    static async addFacility(facilityData: FacilityFormData): Promise<ServiceResult> {
        try {
            if (!facilityData.name || !facilityData.zip_code || !facilityData.care_types.length || !facilityData.min_zip_code || !facilityData.max_zip_code) {
                return {
                    success: false,
                    message: "Please complete all required fields"
                };
            }

            const facilityCreate: FacilityCreate = {
                name: facilityData.name,
                capacity: facilityData.capacity,
                zip_code: facilityData.zip_code,
                care_types: facilityData.care_types,
                zip_code_ranges: [
                    {
                        min_zip_code: parseInt(facilityData.min_zip_code),
                        max_zip_code: parseInt(facilityData.max_zip_code)
                    }
                ]
            };

            const response = await FacilitiesService.createFacilityApiV1FacilitiesPost(facilityCreate);

            return {
                success: true,
                message: `Facility "${response.name}" added successfully!`,
                data: response
            };
        } catch (error) {
            console.error("Error adding facility:", error);

            if (error instanceof ApiError && error.status === 422) {
                return {
                    success: false,
                    message: "Validation error: Please check all fields",
                    error: error.body
                };
            }

            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to add facility",
                error: error
            };
        }
    }

    static async updateFacility(facilityId: string, facilityData: Partial<FacilityFormData>): Promise<ServiceResult> {
        try {
            const facilityUpdate: FacilityUpdate = {
                name: facilityData.name,
                capacity: facilityData.capacity,
                zip_code: facilityData.zip_code,
                care_types: facilityData.care_types,
                zip_code_ranges: facilityData.min_zip_code && facilityData.max_zip_code ? [
                    {
                        min_zip_code: parseInt(facilityData.min_zip_code),
                        max_zip_code: parseInt(facilityData.max_zip_code)
                    }
                ] : undefined
            };

            const response = await FacilitiesService.updateFacilityApiV1FacilitiesFacilityIdPut(
                facilityId,
                facilityUpdate
            );

            return {
                success: true,
                message: `Facility "${response.name}" updated successfully!`,
                data: response
            };
        } catch (error) {
            console.error("Error updating facility:", error);

            if (error instanceof ApiError && error.status === 422) {
                return {
                    success: false,
                    message: "Validation error: Please check all fields",
                    error: error.body
                };
            }

            if (error instanceof ApiError && error.status === 404) {
                return {
                    success: false,
                    message: "Facility not found",
                    error
                };
            }

            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to update facility",
                error
            };
        }
    }

    static async deleteFacility(facilityId: string): Promise<ServiceResult> {
        try {
            await FacilitiesService.deleteFacilityApiV1FacilitiesFacilityIdDelete(facilityId);

            return {
                success: true,
                message: "Facility deleted successfully"
            };
        } catch (error) {
            console.error("Error deleting facility:", error);

            if (error instanceof ApiError && error.status === 404) {
                return {
                    success: false,
                    message: "Facility not found",
                    error
                };
            }

            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to delete facility",
                error
            };
        }
    }
} 