"use client";

import { useState } from "react";
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
import { FacilityMatchRequest } from "@/api/models/FacilityMatchRequest";
import { CareType } from "@/api/models/CareType";
import { FacilityMatchResponse } from "@/api/models/FacilityMatchResponse";
import { ApiError } from "@/api/core/ApiError";

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

const FORM_STEPS = ["name", "careType", "zipCode", "result"] as const;
type FormStep = typeof FORM_STEPS[number];

// Adapter function to convert API response to the expected format
const adaptMatchResult = (response: FacilityMatchResponse | null): FacilityMatch | null => {
  if (!response) return null;

  return {
    matched: response.matched,
    facility: response.facility ? {
      id: response.facility.id,
      name: response.facility.name,
      capacity: response.facility.capacity.toString(),
      zip_code: response.facility.zip_code,
      care_types: response.facility.care_types?.map(ct => ct.toString()) || [],
      zip_code_ranges: response.facility.zip_code_ranges || []
    } : undefined
  };
};

export default function PatientForm() {
  const [step, setStep] = useState<FormStep>("name");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<FacilityMatchResponse | null>(null);
  // Derived state using the adapter function
  const matchResult = adaptMatchResult(apiResponse);

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      careType: undefined,
      zipCode: "",
    },
    mode: "onChange",
  });

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
          const result = await FacilityMatchingService.matchFacilityApiV1FacilityMatchingMatchFacilityPost({
            patient_name: form.getValues("name"),
            care_type: careType,
          });
          setApiResponse(result);
          setStep("result");
        } catch (error) {
          if (error instanceof ApiError) {
            toast.error(error.message || "Failed to process your request. Please try again.");
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
        const request: FacilityMatchRequest = {
          patient_name: form.getValues("name"),
          care_type: form.getValues("careType"),
          zip_code: form.getValues("zipCode")
        };

        const result = await FacilityMatchingService.matchFacilityApiV1FacilityMatchingMatchFacilityPost(request);
        setApiResponse(result);
        setStep("result");
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message || "Failed to match facility. Please try again.");
        } else {
          toast.error("An unexpected error occurred while matching facility. Please try again.");
        }
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const onSubmit = (data: PatientFormData) => {
    console.log("Form submitted:", data);
  };

  const goBack = () => {
    if (step === "careType") setStep("name");
    else if (step === "zipCode") setStep("careType");
    else if (step === "result") {
      const careType = form.getValues("careType");
      setStep(careType === CareType.DAY_CARE ? "careType" : "zipCode");
    }
  };

  const resetForm = () => {
    form.reset();
    setStep("name");
    setApiResponse(null);
  };

  const getProgress = () => {
    const stepIndex = FORM_STEPS.indexOf(step);
    const totalSteps = step === "result" ? FORM_STEPS.length - 1 : FORM_STEPS.length - 1;
    return Math.round((stepIndex / totalSteps) * 100);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>CarePortal Beta</CardTitle>
        <CardDescription>
          {step === "result"
            ? "Your match results"
            : "Find the right care facility for your needs"}
        </CardDescription>
        {step !== "result" && (
          <div className="mt-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Step {FORM_STEPS.indexOf(step) + 1} of {FORM_STEPS.length - 1}
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === "name" && <NameStep form={form} />}
            {step === "careType" && <CareTypeStep form={form} />}
            {step === "zipCode" && <ZipCodeStep form={form} />}
            {step === "result" && <ResultStep matchResult={matchResult} patientData={form.getValues()} />}
          </form>
        </Form>
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step !== "name" && (
          <Button
            variant="outline"
            onClick={goBack}
            disabled={isSubmitting}
            type="button"
          >
            Back
          </Button>
        )}
        {step !== "result" ? (
          <Button
            onClick={handleNextStep}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? "Processing..." : step === "zipCode" ? "Find Matches" : "Next"}
          </Button>
        ) : (
          <Button type="button" onClick={resetForm}>
            Start Over
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}