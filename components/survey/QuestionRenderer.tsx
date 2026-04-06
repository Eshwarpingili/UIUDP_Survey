"use client";

import type { Question } from "@/lib/surveyConfig";

import { CheckboxGroup } from "@/components/survey/CheckboxGroup";
import { MatrixTable } from "@/components/survey/MatrixTable";
import { RadioGroup } from "@/components/survey/RadioGroup";
import { ScaleInput } from "@/components/survey/ScaleInput";
import { TextInput } from "@/components/survey/TextInput";

type QuestionRendererProps = {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
};

export function QuestionRenderer({
  question,
  value,
  onChange,
  error,
}: QuestionRendererProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl leading-snug font-semibold text-foreground">{question.question}</h2>
        {question.optional ? (
          <p className="text-sm text-muted-foreground">This response is optional.</p>
        ) : null}
      </div>

      {question.type === "single" && question.options ? (
        <RadioGroup
          id={question.id}
          options={question.options}
          value={typeof value === "string" ? value : undefined}
          onChange={onChange}
        />
      ) : null}

      {question.type === "multi" && question.options ? (
        <CheckboxGroup
          id={question.id}
          options={question.options}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={onChange}
        />
      ) : null}

      {question.type === "scale" ? (
        <ScaleInput
          id={question.id}
          value={typeof value === "number" ? value : undefined}
          onChange={onChange as (value: number) => void}
          minLabel={question.scaleLabels?.[0]}
          maxLabel={question.scaleLabels?.[1]}
        />
      ) : null}

      {question.type === "text" ? (
        <TextInput
          id={question.id}
          value={typeof value === "string" ? value : ""}
          onChange={onChange as (value: string) => void}
          multiline
          placeholder="Write your response here"
        />
      ) : null}

      {question.type === "dropdown" && question.options ? (
        <div className="space-y-2">
          <label htmlFor={question.id} className="sr-only">
            {question.question}
          </label>
          <select
            id={question.id}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-11 w-full rounded-xl border border-input bg-card px-4 py-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select one option</option>
            {question.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {question.type === "matrix" && question.matrix ? (
        <MatrixTable
          id={question.id}
          rows={question.matrix.rows}
          columns={question.matrix.columns}
          value={typeof value === "object" && value !== null ? (value as Record<string, string>) : {}}
          onChange={onChange as (value: Record<string, string>) => void}
        />
      ) : null}

      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}
