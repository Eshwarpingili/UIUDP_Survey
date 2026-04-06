"use client";

import { Label } from "@/components/ui/label";
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

type RadioGroupProps = {
  id: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function RadioGroup({
  id,
  options,
  value,
  onChange,
  disabled = false,
}: RadioGroupProps) {
  return (
    <ShadcnRadioGroup
      value={value ?? ""}
      onValueChange={onChange}
      className="gap-3"
      aria-label="Choose one option"
    >
      {options.map((option) => {
        const optionId = `${id}-${option.replace(/\s+/g, "-").toLowerCase()}`;

        return (
          <Label
            key={option}
            htmlFor={optionId}
            className="min-h-11 cursor-pointer rounded-xl border bg-card px-4 py-3 text-base text-foreground transition-colors hover:border-primary/60 has-[[data-slot=radio-group-item][data-checked=true]]:border-primary has-[[data-slot=radio-group-item][data-checked=true]]:bg-accent"
          >
            <RadioGroupItem id={optionId} value={option} disabled={disabled} className="size-5" />
            <span className="leading-snug">{option}</span>
          </Label>
        );
      })}
    </ShadcnRadioGroup>
  );
}
