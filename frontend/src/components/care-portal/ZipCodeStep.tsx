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
      description="Enter the patient's zip code to find facilities in their area."
    >
      <FormField
        control={form.control}
        name="zipCode"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Patient Zip Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter 5-digit zip code"
                {...field}
                error={!!fieldState.error}
                maxLength={5}
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  field.onChange(value);
                }}
                className="rounded-lg"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormStep>
  );
}