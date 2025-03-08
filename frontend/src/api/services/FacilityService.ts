import { FacilityFormData } from "@/lib/schemas/facility-schema";
import { FacilitiesService } from "./FacilitiesService";
import { FacilityCreate } from "../models/FacilityCreate";
import { CapacityType } from "../models/CapacityType";
import { OpenAPI } from "../core/OpenAPI";


export class FacilityService {
    static async addFacility(facilityData: FacilityFormData) {
        try {
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
                message: `Facility "${response.name}" added successfully!`
            };
        } catch (error) {
            console.error("Error adding facility:", error);
            return {
                success: false,
                message: error instanceof Error ? error.message : "Failed to add facility"
            };
        }
    }
} 