"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  patientFormSchema,
  PatientFormData
} from "@/lib/schemas/patient-form-schema";
import NameStep from "./NameStep";
import CareTypeStep from "./CareTypeStep";
import ZipCodeStep from "./ZipCodeStep";
import ResultStep from "./ResultStep";
import { FacilityMatchingService } from "@/api/services/FacilityMatchingService";
import { CareType } from "@/api/models/CareType";
import { ApiError } from "@/api/core/ApiError";
import { FormProvider, FORM_STEPS, useFormContext } from "./FormContext";
import { sanitizeInput, getErrorMessage } from "@/lib/utils";
import { useCallback } from "react";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Interface for form props
interface PatientFormProps {
  hideTitle?: boolean;
}

// The main form content, separate from the provider logic
function PatientFormContent({ hideTitle = false }: PatientFormProps) {
  const {
    step,
    setStep,
    isSubmitting,
    setIsSubmitting,
    setApiResponse,
    matchResult,
    goBack,
    resetForm,
    getProgress,
    form
  } = useFormContext();

  // Skip if form isn't available (shouldn't happen with proper setup)
  if (!form) return null;

  const handleNextStep = async () => {
    if (step === "name") {
      const nameValid = await form.trigger("name");
      if (!nameValid) return;
      setStep("careType");
      return;
    }

    if (step === "careType") {
      const careTypeValid = await form.trigger("careType");
      if (!careTypeValid) return;

      const careType = form.getValues("careType");

      if (careType === CareType.DAY_CARE) {
        setIsSubmitting(true);
        try {
          // Sanitize inputs before sending to API
          const sanitizedName = sanitizeInput(form.getValues("name"));

          const result = await FacilityMatchingService.matchFacilityApiV1FacilityMatchingMatchFacilityPost({
            patient_name: sanitizedName,
            care_type: careType,
          });
          setApiResponse(result);
          setStep("result");
        } catch (error) {
          if (error instanceof ApiError) {
            // Use improved error handling with specific messages
            const status = error.status?.toString() || undefined;
            toast.error(getErrorMessage(status, "Failed to process your request. Please try again."));
          } else {
            toast.error("An unexpected error occurred. Please try again.");
          }
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      setStep("zipCode");
      return;
    }

    if (step === "zipCode") {
      const zipCodeValid = await form.trigger("zipCode");
      if (!zipCodeValid) return;

      setIsSubmitting(true);
      try {
        // Sanitize all inputs before sending to API
        const zipCode = form.getValues("zipCode");
        const sanitizedData = {
          patient_name: sanitizeInput(form.getValues("name")),
          care_type: form.getValues("careType"),
          zip_code: zipCode ? sanitizeInput(zipCode) : ""
        };

        const result = await FacilityMatchingService.matchFacilityApiV1FacilityMatchingMatchFacilityPost(sanitizedData);
        setApiResponse(result);
        setStep("result");
      } catch (error) {
        if (error instanceof ApiError) {
          const status = error.status?.toString() || undefined;
          toast.error(getErrorMessage(status, "Failed to match facility. Please try again."));
        } else {
          toast.error(getErrorMessage("NETWORK_ERROR", "An unexpected error occurred while matching facility."));
        }
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const onSubmit = useCallback((data: PatientFormData) => {
    // This is just a placeholder for the form submission
    // The actual submission happens in handleNextStep
    console.log("Form submitted:", data);
  }, []);

  // Generate a title for the current step
  const getStepTitle = () => {
    switch (step) {
      case "name": return "Patient Information";
      case "careType": return "Care Requirements";
      case "zipCode": return "Location Details";
      case "result": return "Match Results";
      default: return "";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card text-card-foreground">
      <CardHeader className="pb-4">
        {!hideTitle && (
          <CardTitle className="text-center">CarePortal Beta</CardTitle>
        )}

        {/* Display appropriate title based on current step */}
        <div className="flex flex-col space-y-1">
          <h2 className="text-xl font-semibold text-center">{getStepTitle()}</h2>

          {/* Progress bar & step indicator */}
          {step !== "result" && (
            <div className="mt-6">
              <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                <div
                  className="h-full bg-violet-600 dark:bg-violet-500 transition-all duration-300 ease-in-out"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Step {FORM_STEPS.indexOf(step) + 1} of 3</span>
                <span>{Math.round(getProgress())}% complete</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pass empty title to avoid duplication */}
            {step === "name" && <NameStep form={form} />}
            {step === "careType" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Select the type of care the patient needs.
                </p>
                <FormField
                  control={form.control}
                  name="careType"
                  render={({ field }) => (
                    <div className="space-y-3">
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <label
                          className={`radio-option cursor-pointer ${field.value === CareType.STATIONARY ? 'radio-option-selected' : ''}`}
                          data-value={CareType.STATIONARY}
                        >
                          <RadioGroupItem value={CareType.STATIONARY} id="stationary" />
                          <div className="radio-option-content">
                            <span className="radio-option-label">Stationary</span>
                            <p className="radio-option-description">In-patient care at a facility</p>
                          </div>
                        </label>
                        <label
                          className={`radio-option cursor-pointer ${field.value === CareType.AMBULATORY ? 'radio-option-selected' : ''}`}
                          data-value={CareType.AMBULATORY}
                        >
                          <RadioGroupItem value={CareType.AMBULATORY} id="ambulatory" />
                          <div className="radio-option-content">
                            <span className="radio-option-label">Ambulatory</span>
                            <p className="radio-option-description">Out-patient visiting care</p>
                          </div>
                        </label>
                        <label
                          className={`radio-option cursor-pointer ${field.value === CareType.DAY_CARE ? 'radio-option-selected' : ''}`}
                          data-value={CareType.DAY_CARE}
                        >
                          <RadioGroupItem value={CareType.DAY_CARE} id="daycare" />
                          <div className="radio-option-content">
                            <span className="radio-option-label">Day Care</span>
                            <p className="radio-option-description">Temporary supervision and care</p>
                          </div>
                        </label>
                      </RadioGroup>
                    </div>
                  )}
                />
              </div>
            )}
            {step === "zipCode" && <ZipCodeStep form={form} />}
            {step === "result" && <ResultStep matchResult={matchResult} patientData={form.getValues()} />}
          </form>
        </Form>
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        {step !== "name" && (
          <Button
            variant="violet"
            onClick={goBack}
            disabled={isSubmitting}
            type="button"
            size="lg"
          >
            Back
          </Button>
        )}
        {step !== "result" ? (
          <Button
            onClick={handleNextStep}
            disabled={isSubmitting}
            type="button"
            variant="violet"
            size="lg"
            className={step === "name" ? "ml-auto" : ""}
          >
            {isSubmitting ? "Processing..." : step === "zipCode" ? "Find Matches" : "Next"}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={resetForm}
            variant="violet"
            size="lg"
          >
            Start Over
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// The main component that sets up the form provider
export default function PatientForm(props: PatientFormProps) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      careType: undefined,
      zipCode: "",
    },
    mode: "onChange",
  });

  return (
    <FormProvider form={form}>
      <PatientFormContent {...props} />
    </FormProvider>
  );
}