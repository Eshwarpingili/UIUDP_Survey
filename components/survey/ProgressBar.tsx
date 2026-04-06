"use client";

import { Progress } from "@/components/ui/progress";

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  label?: string;
};

export function ProgressBar({ currentStep, totalSteps, label }: ProgressBarProps) {
  const safeTotal = Math.max(totalSteps, 1);
  const safeCurrent = Math.min(Math.max(currentStep, 1), safeTotal);
  const percent = Math.round((safeCurrent / safeTotal) * 100);

  return (
    <div className="w-full rounded-2xl bg-card/95 p-4 shadow-sm ring-1 ring-border/80 backdrop-blur">
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <p className="font-medium text-foreground">{label ?? "Progress"}</p>
        <p aria-live="polite">
          Step {safeCurrent} of {safeTotal}
        </p>
      </div>
      <Progress value={percent} className="h-3 bg-secondary/60" />
    </div>
  );
}
