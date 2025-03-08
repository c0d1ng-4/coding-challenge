import { PatientFormData } from "@/lib/schemas/patient-form-schema";
import { CareType } from "@/api/models/CareType";
import FormStep from "./FormStep";
import { FacilityForm } from "@/components/admin/FacilityForm";

interface FacilityMatch {
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

interface ResultStepProps {
  matchResult: FacilityMatch | null;
  patientData: PatientFormData;
}

export default function ResultStep({ matchResult, patientData }: ResultStepProps) {
  if (!matchResult) return null;

  const careTypeDisplay: Record<CareType, string> = {
    [CareType.STATIONARY]: "Stationary",
    [CareType.AMBULATORY]: "Ambulatory",
    [CareType.DAY_CARE]: "Day Care"
  };

  return (
    <FormStep>
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base font-medium">Patient Information</h3>
          <div className="p-4 rounded-lg border bg-card text-card-foreground dark:bg-gray-800/50 dark:border-gray-700">
            <div className="space-y-2">
              <p className="flex">
                <span className="font-medium w-24">Name:</span>
                <span>{patientData.name}</span>
              </p>
              <p className="flex">
                <span className="font-medium w-24">Care Type:</span>
                <span>{careTypeDisplay[patientData.careType as keyof typeof careTypeDisplay]}</span>
              </p>
              {patientData.zipCode && (
                <p className="flex">
                  <span className="font-medium w-24">Zip Code:</span>
                  <span>{patientData.zipCode}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium">Match Result</h3>
          </div>
          {matchResult.matched ? (
            <div className="p-4 rounded-lg border bg-green-50/80 dark:bg-green-950/30 dark:border-green-900/50">
              <p className="font-semibold text-green-700 dark:text-green-300">We found a match!</p>
              <div className="mt-3 space-y-2 text-green-700 dark:text-green-200">
                <p className="flex">
                  <span className="font-medium w-24">Facility:</span>
                  <span>{matchResult.facility?.name}</span>
                </p>
                <p className="flex">
                  <span className="font-medium w-24">Type of Care:</span>
                  <span>{matchResult.facility?.care_types.map(type =>
                    careTypeDisplay[type as keyof typeof careTypeDisplay]).join(", ")}</span>
                </p>
                <p className="flex">
                  <span className="font-medium w-24">Location:</span>
                  <span>{matchResult.facility?.zip_code}</span>
                </p>
                <p className="flex">
                  <span className="font-medium w-24">Capacity:</span>
                  <span>{matchResult.facility?.capacity}</span>
                </p>
              </div>
              <div className="mt-4 p-3 rounded-lg border border-green-200/50 dark:border-green-900/50 bg-green-100/50 dark:bg-green-950/50">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <span className="font-medium">Next Steps:</span> The facility will contact you within 1-2 business days to schedule an initial consultation.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-900/50">
              <p className="font-semibold text-amber-700 dark:text-amber-300">No matching facility found</p>
              <p className="mt-2 text-amber-700 dark:text-amber-200">
                We couldn't find a suitable care facility based on your requirements.
                This might be because:
              </p>
              <ul className="list-disc ml-5 mt-2 text-amber-700 dark:text-amber-200">
                <li>All nearby facilities are at full capacity</li>
                <li>There are no facilities in your area</li>
                <li>The care type you selected is not available near you</li>
              </ul>
              <div className="mt-4 p-3 rounded-lg border border-amber-200/50 dark:border-amber-900/50 bg-amber-100/50 dark:bg-amber-950/50">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-medium">Recommendation:</span> Try a different care type or contact our support team at 1-800-CARE-HELP for personalized assistance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FormStep>
  );
}