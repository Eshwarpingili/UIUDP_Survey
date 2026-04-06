"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { ProgressBar } from "@/components/survey/ProgressBar";
import { QuestionRenderer } from "@/components/survey/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DEMOGRAPHIC_STEP_COUNT,
  demographicQuestions,
  statusToPersona,
} from "@/lib/demographicsConfig";
import type { Persona, Question } from "@/lib/surveyConfig";
import { useSurveyStore } from "@/store/surveyStore";

type DemographicsFormValues = {
  response: unknown;
};

type DemographicsFlowProps = {
  onComplete?: (persona: Persona) => void;
};

const baseSchema = z.object({
  response: z.unknown(),
});

function getSchemaForQuestion(question: Question) {
  if (question.type === "multi") {
    return z.object({
      response: z.array(z.string()).min(1, "Please select at least one option to continue."),
    });
  }

  if (question.type === "scale") {
    return z.object({
      response: z.number().min(1).max(5),
    });
  }

  return z.object({
    response: z.string().min(1, "Please select an option to continue."),
  });
}

export function DemographicsFlow({ onComplete }: DemographicsFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const demographics = useSurveyStore((state) => state.demographics);
  const setDemographic = useSurveyStore((state) => state.setDemographic);
  const setPersona = useSurveyStore((state) => state.setPersona);
  const clearAnswers = useSurveyStore((state) => state.clearAnswers);

  const current = demographicQuestions[step];
  const question = useMemo<Question>(
    () => ({
      id: current.id,
      type: current.type,
      question: current.question,
      options: current.options,
    }),
    [current]
  );

  const schema = useMemo(() => getSchemaForQuestion(question), [question]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<DemographicsFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      response: demographics[current.id] ?? "",
    },
  });

  useEffect(() => {
    reset({
      response: demographics[current.id] ?? "",
    });
  }, [current.id, demographics, reset]);

  const onNext = (data: DemographicsFormValues) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setError("response", {
        message: parsed.error.issues[0]?.message ?? "Please provide a valid response.",
      });
      return;
    }

    setDemographic(current.id, data.response);

    if (step < demographicQuestions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    const persona = statusToPersona(String(data.response));

    if (!persona) {
      return;
    }

    setPersona(persona);
    clearAnswers();
    if (onComplete) {
      onComplete(persona);
      return;
    }

    router.push(`/survey/${persona}`);
  };

  const onBack = () => {
    if (step === 0) {
      return;
    }

    setStep((prev) => prev - 1);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
      <ProgressBar
        currentStep={step + 1}
        totalSteps={DEMOGRAPHIC_STEP_COUNT}
        label="Demographics"
      />

      <div className="mt-6 flex-1">
        <Card className="border-border/70 bg-card/95 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Step 1 - Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onNext)}
              className="animate-in fade-in-0 space-y-8 duration-300"
            >
              <Controller
                name="response"
                control={control}
                render={({ field }) => (
                  <QuestionRenderer
                    question={question}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.response?.message as string | undefined}
                  />
                )}
              />

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={step === 0 || isSubmitting}
                  className="min-h-11 px-5"
                >
                  Back
                </Button>

                <Button type="submit" disabled={isSubmitting} className="min-h-11 px-6">
                  {step === demographicQuestions.length - 1 ? "Continue" : "Next"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
