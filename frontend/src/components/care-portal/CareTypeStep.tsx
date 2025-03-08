// src/components/care-portal/CareTypeStep.tsx
import { UseFormReturn } from "react-hook-form";
import { PatientFormData } from "@/lib/schemas/patient-form-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import FormStep from "./FormStep";
import { CareType } from "@/api/models/CareType";

interface CareTypeStepProps {
  form: UseFormReturn<PatientFormData>;
}

export default function CareTypeStep({ form }: CareTypeStepProps) {
  return (
    <FormStep
      description="Select the type of care the patient needs."
    >
      <FormField
        control={form.control}
        name="careType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Type of Care Needed</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-3"
              >
                <div className="radio-option">
                  <RadioGroupItem value={CareType.STATIONARY} id="stationary" />
                  <Label htmlFor="stationary" className="radio-option-label">Stationary</Label>
                  <p className="radio-option-description">In-patient care at a facility</p>
                </div>
                <div className="radio-option">
                  <RadioGroupItem value={CareType.AMBULATORY} id="ambulatory" />
                  <Label htmlFor="ambulatory" className="radio-option-label">Ambulatory</Label>
                  <p className="radio-option-description">Out-patient visiting care</p>
                </div>
                <div className="radio-option">
                  <RadioGroupItem value={CareType.DAY_CARE} id="daycare" />
                  <Label htmlFor="daycare" className="radio-option-label">Day Care</Label>
                  <p className="radio-option-description">Temporary supervision and care</p>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormStep>
  );
}