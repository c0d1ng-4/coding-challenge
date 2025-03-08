
import { UseFormReturn } from "react-hook-form";
import { PatientFormData } from "@/lib/schemas/patient-form-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormStep from "./FormStep";

interface ZipCodeStepProps {
  form: UseFormReturn<PatientFormData>;
}

export default function ZipCodeStep({ form }: ZipCodeStepProps) {
  return (
    <FormStep
      title="Location Information"
      description="Enter the patient's zip code to find facilities in their area."
    >
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient Zip Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter 5-digit zip code"
                {...field}
                maxLength={5}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormStep>
  );
}