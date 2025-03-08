export interface Facility {
    id: string;
    name: string;
    capacity: string;
    zip_code: string;
    care_types: string[];
    zip_code_ranges: {
        min_zip_code: number;
        max_zip_code: number;
    }[];
} 