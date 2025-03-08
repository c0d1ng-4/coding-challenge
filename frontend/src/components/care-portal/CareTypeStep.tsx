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
      title="Care Requirements"
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
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-slate-50">
                  <RadioGroupItem value={CareType.STATIONARY} id="stationary" />
                  <Label htmlFor="stationary" className="font-medium">Stationary</Label>
                  <p className="text-sm text-gray-500 ml-2">In-patient care at a facility</p>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-slate-50">
                  <RadioGroupItem value={CareType.AMBULATORY} id="ambulatory" />
                  <Label htmlFor="ambulatory" className="font-medium">Ambulatory</Label>
                  <p className="text-sm text-gray-500 ml-2">Out-patient visiting care</p>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-slate-50">
                  <RadioGroupItem value={CareType.DAY_CARE} id="daycare" />
                  <Label htmlFor="daycare" className="font-medium">Day Care</Label>
                  <p className="text-sm text-gray-500 ml-2">Temporary supervision and care</p>
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