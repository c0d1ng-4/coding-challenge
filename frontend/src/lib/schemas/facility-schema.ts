import { z } from "zod";
import { CareType } from "@/api/models/CareType";
import { CapacityType } from "@/api/models/CapacityType";

const zipCodePattern = /^\d{5}$/;

export const facilitySchema = z.object({
    name: z.string()
        .trim()
        .min(1, "Facility name is required")
        .max(100, "Facility name must be 100 characters or less"),

    capacity: z.nativeEnum(CapacityType, {
        required_error: "Please select a capacity status",
        invalid_type_error: "Invalid capacity type",
    }),

    zip_code: z.string()
        .trim()
        .regex(zipCodePattern, "Please enter a valid 5-digit zip code")
        .transform(val => val.replace(/\D/g, '')),

    care_types: z.array(z.nativeEnum(CareType, {
        invalid_type_error: "Invalid care type",
    }))
        .min(1, "Please select at least one care type"),

    min_zip_code: z.string()
        .trim()
        .regex(zipCodePattern, "Please enter a valid 5-digit minimum zip code")
        .transform(val => val.replace(/\D/g, '')),

    max_zip_code: z.string()
        .trim()
        .regex(zipCodePattern, "Please enter a valid 5-digit maximum zip code")
        .transform(val => val.replace(/\D/g, '')), // Remove non-digit characters
}).superRefine((data, ctx) => {
    const min = parseInt(data.min_zip_code);
    const max = parseInt(data.max_zip_code);

    if (isNaN(min)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum zip code must be a valid number",
            path: ["min_zip_code"]
        });
        return;
    }

    if (isNaN(max)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Maximum zip code must be a valid number",
            path: ["max_zip_code"]
        });
        return;
    }

    if (min > max) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum zip code must be less than or equal to maximum zip code",
            path: ["min_zip_code"]
        });

        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Maximum zip code must be greater than or equal to minimum zip code",
            path: ["max_zip_code"]
        });
    }
});

export type FacilityFormData = z.infer<typeof facilitySchema>; 