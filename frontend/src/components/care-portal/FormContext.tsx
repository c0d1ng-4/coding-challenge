"use client";

import { ReactNode, createContext, useCallback, useContext, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PatientFormData } from "@/lib/schemas/patient-form-schema";
import { FacilityMatchResponse } from "@/api/models/FacilityMatchResponse";
import { adaptMatchResult } from "@/lib/adapters/facility-adapter";
import { CareType } from "@/api/models/CareType";

export const FORM_STEPS = ["name", "careType", "zipCode", "result"] as const;
export type FormStep = typeof FORM_STEPS[number];

export interface FormContextType {
    step: FormStep;
    setStep: (step: FormStep) => void;
    isSubmitting: boolean;
    setIsSubmitting: (isSubmitting: boolean) => void;
    apiResponse: FacilityMatchResponse | null;
    setApiResponse: (response: FacilityMatchResponse | null) => void;
    matchResult: ReturnType<typeof adaptMatchResult>;
    goToNextStep: () => void;
    goBack: () => void;
    resetForm: () => void;
    getProgress: () => number;
    form?: UseFormReturn<PatientFormData>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({
    children,
    form
}: {
    children: ReactNode;
    form: UseFormReturn<PatientFormData>;
}) {
    const [step, setStep] = useState<FormStep>("name");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiResponse, setApiResponse] = useState<FacilityMatchResponse | null>(null);

    const matchResult = adaptMatchResult(apiResponse);

    const goToNextStep = useCallback(() => {
        const currentIndex = FORM_STEPS.indexOf(step);
        const nextStep = FORM_STEPS[currentIndex + 1];
        if (nextStep) {
            setStep(nextStep);
        }
    }, [step]);

    const goBack = useCallback(() => {
        if (step === "careType") setStep("name");
        else if (step === "zipCode") setStep("careType");
        else if (step === "result") {
            const careType = form.getValues("careType");
            setStep(careType === CareType.DAY_CARE ? "careType" : "zipCode");
        }
    }, [step, form]);

    const resetForm = useCallback(() => {
        form.reset();
        setStep("name");
        setApiResponse(null);
    }, [form]);

    const getProgress = useCallback(() => {
        const stepIndex = FORM_STEPS.indexOf(step);
        const totalSteps = FORM_STEPS.length - 1; // Fix the redundant check
        return Math.round((stepIndex / totalSteps) * 100);
    }, [step]);

    return (
        <FormContext.Provider
            value={{
                step,
                setStep,
                isSubmitting,
                setIsSubmitting,
                apiResponse,
                setApiResponse,
                matchResult,
                goToNextStep,
                goBack,
                resetForm,
                getProgress,
                form,
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export function useFormContext() {
    const context = useContext(FormContext);
    if (context === undefined) {
        throw new Error("useFormContext must be used within a FormProvider");
    }
    return context;
} 