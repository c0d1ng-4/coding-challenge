
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
      title="Patient Information"
      description="Enter the patient's full name to begin the matching process."
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormStep>
  );
}