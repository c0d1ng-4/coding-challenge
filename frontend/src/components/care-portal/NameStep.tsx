import { UseFormReturn } from "react-hook-form";
import { PatientFormData } from "@/lib/schemas/patient-form-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormStep from "./FormStep";

interface NameStepProps {
  form: UseFormReturn<PatientFormData>;
}

export default function NameStep({ form }: NameStepProps) {
  return (
    <FormStep
      description="Enter the patient's full name to begin the matching process."
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel>Patient Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter full name"
                {...field}
                error={!!fieldState.error}
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