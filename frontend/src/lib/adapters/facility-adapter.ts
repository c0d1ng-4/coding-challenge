import { FacilityMatchResponse } from "@/api/models/FacilityMatchResponse";
import { CareType } from "@/api/models/CareType";

/**
 * Interface representing the application's internal facility match data structure
 */
export interface FacilityMatch {
    matched: boolean;
    facility?: {
        id: string;
        name: string;
        capacity: string;
        zip_code: string;
        care_types: string[];
        zip_code_ranges: { min_zip_code: number; max_zip_code: number }[];
    };
}

/**
 * Adapts the API response to the application's internal data structure
 * @param response The API response from the facility matching service
 * @returns Formatted facility match data
 */
export const adaptMatchResult = (response: FacilityMatchResponse | null): FacilityMatch | null => {
    if (!response) return null;

    return {
        matched: response.matched,
        facility: response.facility ? {
            id: response.facility.id,
            name: response.facility.name,
            capacity: response.facility.capacity.toString(),
            zip_code: response.facility.zip_code,
            care_types: response.facility.care_types?.map(ct =>
                typeof ct === 'number' ? CareType[ct] : ct.toString()
            ) || [],
            zip_code_ranges: response.facility.zip_code_ranges || []
        } : undefined
    };
}; 