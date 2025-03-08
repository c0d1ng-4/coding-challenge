import { z } from 'zod';
import { CareType } from "@/api/models/CareType";

export const patientNameSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});

export const careTypeSchema = z.object({
  careType: z.nativeEnum(CareType, {
    required_error: "Please select a type of care.",
  }),
});

export const zipCodeSchema = z.object({
  zipCode: z.string().regex(/^\d{5}$/, {
    message: "Please enter a valid 5-digit zip code.",
  }),
});

export const patientFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  careType: z.nativeEnum(CareType, {
    required_error: "Please select a type of care.",
  }),
  zipCode: z.string().regex(/^\d{5}$/, {
    message: "Please enter a valid 5-digit zip code.",
  }).optional(),
}).refine(data => {
  return data.careType === CareType.DAY_CARE || !!data.zipCode;
}, {
  message: "Zip code is required for stationary and ambulatory care",
  path: ["zipCode"],
});

export type PatientFormData = z.infer<typeof patientFormSchema>;