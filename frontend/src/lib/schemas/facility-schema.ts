import { z } from "zod";
import { CareType } from "@/api/models/CareType";
import { CapacityType } from "@/api/models/CapacityType";

export const facilitySchema = z.object({
    name: z.string().min(1, "Facility name must be at least 1 characters"),
    capacity: z.nativeEnum(CapacityType, {
        required_error: "Please select a capacity status",
    }),
    zip_code: z.string()
        .regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
    care_types: z.array(z.nativeEnum(CareType))
        .min(1, "Please select at least one care type"),
    min_zip_code: z.string()
        .regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
    max_zip_code: z.string()
        .regex(/^\d{5}$/, "Please enter a valid 5-digit zip code"),
}).superRefine((data, ctx) => {
    const min = parseInt(data.min_zip_code);
    const max = parseInt(data.max_zip_code);
    if (min > max) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum zip code must be less than or equal to maximum zip code",
            path: ["min_zip_code"]
        });
    }
});

export type FacilityFormData = z.infer<typeof facilitySchema>; 