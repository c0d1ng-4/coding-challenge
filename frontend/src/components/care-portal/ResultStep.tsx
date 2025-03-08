
import { PatientFormData } from "@/lib/schemas/patient-form-schema";
import FormStep from "./FormStep";

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

  const careTypeDisplay = {
    stationary: "Stationary",
    ambulatory: "Ambulatory",
    daycare: "Day Care"
  };

  return (
    <FormStep title="Match Results">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-base font-medium">Patient Information</h3>
          <div className="p-4 border rounded-md bg-slate-50">
            <p><span className="font-medium">Name:</span> {patientData.name}</p>
            <p>
              <span className="font-medium">Care Type:</span>
              {careTypeDisplay[patientData.careType as keyof typeof careTypeDisplay]}
            </p>
            {patientData.zipCode && <p><span className="font-medium">Zip Code:</span> {patientData.zipCode}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-medium">Match Result</h3>
          {matchResult.matched ? (
            <div className="p-4 border rounded-md bg-green-50">
              <p className="font-semibold text-green-700">We found a match!</p>
              <div className="mt-3 space-y-1">
                <p><span className="font-medium">Facility:</span> {matchResult.facility?.name}</p>
                <p><span className="font-medium">Type of Care:</span> {matchResult.facility?.care_types.map(type =>
                  careTypeDisplay[type as keyof typeof careTypeDisplay]).join(", ")}</p>
                <p><span className="font-medium">Location:</span> {matchResult.facility?.zip_code}</p>
                <p><span className="font-medium">Capacity:</span> {matchResult.facility?.capacity}</p>
              </div>
              <div className="mt-4 p-3 border border-green-200 rounded bg-green-100">
                <p className="text-sm">
                  <span className="font-medium">Next Steps:</span> The facility will contact you within 1-2 business days to schedule an initial consultation.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 border rounded-md bg-amber-50">
              <p className="font-semibold text-amber-700">No matching facility found</p>
              <p className="mt-2">
                We couldn't find a suitable care facility based on your requirements.
                This might be because:
              </p>
              <ul className="list-disc ml-5 mt-2">
                <li>All nearby facilities are at full capacity</li>
                <li>There are no facilities in your area</li>
                <li>The care type you selected is not available near you</li>
              </ul>
              <div className="mt-4 p-3 border border-amber-200 rounded bg-amber-100">
                <p className="text-sm">
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