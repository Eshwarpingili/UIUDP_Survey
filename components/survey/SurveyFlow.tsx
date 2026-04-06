"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { ProgressBar } from "@/components/survey/ProgressBar";
import { QuestionRenderer } from "@/components/survey/QuestionRenderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMOGRAPHIC_STEP_COUNT } from "@/lib/demographicsConfig";
import { submitSurveyResponse } from "@/lib/surveySubmission";
import { PERSONA_LABELS, surveyConfig, type Persona, type Question } from "@/lib/surveyConfig";
import { defaultQuestionValue, flattenSurveyQuestions } from "@/lib/surveyHelpers";
import { generateSuggestions } from "@/lib/suggestions";
import { useSurveyStore } from "@/store/surveyStore";

type SurveyFormValues = Record<string, unknown>;

type SurveyFlowProps = {
  persona: Persona;
  onBackToDemographics?: () => void;
};

function getQuestionSchema(question: Question): z.ZodTypeAny {
  if (question.type === "single" || question.type === "dropdown") {
    const schema = z.string().min(1, "Please select one option to continue.");
    return question.optional ? z.union([schema, z.literal("")]) : schema;
  }

  if (question.type === "multi") {
    const schema = z.array(z.string()).min(1, "Please select at least one option to continue.");
    return question.optional ? z.array(z.string()) : schema;
  }

  if (question.type === "scale") {
    const schema = z.number().min(1).max(5);
    return question.optional ? z.union([schema, z.undefined()]) : schema;
  }

  if (question.type === "text") {
    const schema = z.string().trim().min(1, "Please enter your response to continue.");
    return question.optional ? z.union([schema, z.literal("")]) : schema;
  }

  if (question.type === "matrix" && question.matrix) {
    const matrix = question.matrix;

    return z.record(z.string(), z.string()).superRefine((value, ctx) => {
      if (question.optional && Object.keys(value).length === 0) {
        return;
      }

      for (const row of matrix.rows) {
        if (!value[row]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please answer all rows before continuing.",
          });
          return;
        }
      }
    });
  }

  return z.unknown();
}

function isRequiredQuestionAnswered(question: Question, value: unknown): boolean {
  if (question.optional) {
    return true;
  }

  if (question.type === "single" || question.type === "dropdown" || question.type === "text") {
    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "multi") {
    return Array.isArray(value) && value.length > 0;
  }

  if (question.type === "scale") {
    return typeof value === "number" && value >= 1 && value <= 5;
  }

  if (question.type === "matrix" && question.matrix) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      return false;
    }

    const typedValue = value as Record<string, string>;
    return question.matrix.rows.every((row) => Boolean(typedValue[row]));
  }

  return false;
}

export function SurveyFlow({ persona, onBackToDemographics }: SurveyFlowProps) {
  const router = useRouter();
  const config = surveyConfig[persona];
  const questionList = useMemo(() => flattenSurveyQuestions(config), [config]);

  const hydrated = useSurveyStore((state) => state.hydrated);
  const demographics = useSurveyStore((state) => state.demographics);
  const answers = useSurveyStore((state) => state.answers);
  const setAnswer = useSurveyStore((state) => state.setAnswer);
  const setPersona = useSurveyStore((state) => state.setPersona);
  const resetAll = useSurveyStore((state) => state.resetAll);

  const [phase, setPhase] = useState<"survey" | "insights" | "final">("survey");
  const [submittedResponses, setSubmittedResponses] = useState<Record<string, unknown> | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formSchema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const item of questionList) {
      shape[item.question.id] = getQuestionSchema(item.question);
    }

    return z.object(shape);
  }, [questionList]);

  const defaultValues = useMemo(() => {
    const initial: SurveyFormValues = {};

    for (const item of questionList) {
      initial[item.question.id] = answers[item.question.id] ?? defaultQuestionValue(item.question);
    }

    return initial;
  }, [answers, questionList]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SurveyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    setPersona(persona);
    reset(defaultValues);
  }, [defaultValues, hydrated, persona, reset, setPersona]);

  const requiredQuestions = useMemo(
    () => questionList.filter((item) => !item.question.optional),
    [questionList]
  );

  const answeredRequiredCount = useMemo(
    () =>
      requiredQuestions.filter((item) =>
        isRequiredQuestionAnswered(item.question, watchedValues[item.question.id])
      ).length,
    [requiredQuestions, watchedValues]
  );

  const totalFlowSteps = DEMOGRAPHIC_STEP_COUNT + Math.max(requiredQuestions.length, 1);
  const currentFlowStep = DEMOGRAPHIC_STEP_COUNT + Math.max(answeredRequiredCount, 1);

  const onSubmit = (data: SurveyFormValues) => {
    setSubmitError(null);
    setSubmissionId(null);

    const responsePayload: Record<string, unknown> = {};

    for (const item of questionList) {
      setAnswer(item.question.id, data[item.question.id]);
      responsePayload[item.question.id] = data[item.question.id];
    }

    setSubmittedResponses(responsePayload);
    setPhase("insights");

    void submitSurveyResponse({
      persona,
      demographics,
      responses: responsePayload,
    })
      .then((result) => {
        setSubmissionId(result.id);
      })
      .catch((error) => {
        console.error("Failed to save survey response to Firestore", error);
        setSubmitError("We could not save your response online. You can still download your JSON below.");
      });
  };

  const onBack = () => {
    if (phase === "final") {
      setPhase("insights");
      return;
    }

    if (phase === "insights") {
      setPhase("survey");
      return;
    }

    if (onBackToDemographics) {
      onBackToDemographics();
      return;
    }

    router.push("/");
  };

  const insightsSource = submittedResponses ?? answers;
  const suggestions = useMemo(
    () => generateSuggestions(insightsSource, persona).slice(0, 5),
    [insightsSource, persona]
  );

  const completionPayload = {
    persona,
    demographics,
    responses: insightsSource,
  };

  const onDownload = () => {
    const blob = new Blob([JSON.stringify(completionPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${persona}-survey-response.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
        <ProgressBar
          currentStep={DEMOGRAPHIC_STEP_COUNT + 1}
          totalSteps={totalFlowSteps}
          label={`${PERSONA_LABELS[persona]} Survey`}
        />
        <Card className="mt-6 border-border/70 bg-card/95 shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">Loading your responses...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-10">
      <ProgressBar
        currentStep={Math.min(currentFlowStep, totalFlowSteps)}
        totalSteps={totalFlowSteps}
        label={`${PERSONA_LABELS[persona]} Survey`}
      />

      <Card className="mt-6 border-border/70 bg-card/95 shadow-sm backdrop-blur">
        {phase === "survey" ? (
          <>
            <CardHeader>
              <CardTitle className="text-base font-semibold tracking-wide text-foreground">
                {PERSONA_LABELS[persona]} survey
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="animate-in fade-in-0 space-y-10 duration-300"
              >
                {config.sections.map((section) => (
                  <section key={section.title} className="space-y-6 rounded-2xl border bg-background/50 p-5">
                    <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                      {section.title}
                    </h2>

                    <div className="space-y-10">
                      {section.questions.map((question) => (
                        <Controller
                          key={question.id}
                          name={question.id}
                          control={control}
                          render={({ field }) => (
                            <QuestionRenderer
                              question={question}
                              value={field.value}
                              onChange={field.onChange}
                              error={errors[question.id]?.message as string | undefined}
                            />
                          )}
                        />
                      ))}
                    </div>
                  </section>
                ))}

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isSubmitting}
                    className="min-h-11 px-5"
                  >
                    Back
                  </Button>

                  <Button type="submit" disabled={isSubmitting} className="min-h-11 px-6">
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : null}

        {phase === "insights" ? (
          <CardContent className="animate-in fade-in-0 space-y-6 py-8 duration-300">
            <h2 className="text-2xl font-semibold text-foreground">
              A few gentle insights based on your responses
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-base text-foreground">
              {suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>

            {submitError ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={onBack} className="min-h-11 px-5">
                Back
              </Button>
              <Button type="button" onClick={() => setPhase("final")} className="min-h-11 px-6">
                Continue
              </Button>
            </div>
          </CardContent>
        ) : null}

        {phase === "final" ? (
          <CardContent className="animate-in fade-in-0 space-y-6 py-8 duration-300">
            <h2 className="text-2xl font-semibold text-foreground">Thank you for completing this survey.</h2>

            <p className="text-base text-muted-foreground">
              Your responses have been prepared in a JSON file format that you can download.
            </p>

            {submissionId ? (
              <p className="rounded-xl border border-emerald-300/70 bg-emerald-100/60 px-4 py-3 text-sm text-emerald-900">
                Response saved to Firestore. Submission ID: {submissionId}
              </p>
            ) : null}

            {submitError ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </p>
            ) : null}

            <div className="rounded-xl border bg-background/60 p-4">
              <pre className="overflow-x-auto text-xs leading-relaxed text-foreground">
                {JSON.stringify(completionPayload, null, 2)}
              </pre>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={onBack} className="min-h-11 px-5">
                Back
              </Button>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="button" variant="outline" onClick={onDownload} className="min-h-11 px-5">
                  Download responses JSON
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    resetAll();

                    if (onBackToDemographics) {
                      onBackToDemographics();
                      return;
                    }

                    router.push("/");
                  }}
                  className="min-h-11 px-5"
                >
                  Start another response
                </Button>
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
