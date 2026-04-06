"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CheckboxGroupProps = {
  id: string;
  options: string[];
  value?: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

export function CheckboxGroup({
  id,
  options,
  value = [],
  onChange,
  disabled = false,
}: CheckboxGroupProps) {
  return (
    <div className="space-y-3" role="group" aria-label="Choose one or more options">
      {options.map((option) => {
        const optionId = `${id}-${option.replace(/\s+/g, "-").toLowerCase()}`;
        const checked = value.includes(option);

        return (
          <Label
            key={option}
            htmlFor={optionId}
            className="min-h-11 cursor-pointer rounded-xl border bg-card px-4 py-3 text-base text-foreground transition-colors hover:border-primary/60 has-[[data-slot=checkbox][data-state=checked]]:border-primary has-[[data-slot=checkbox][data-state=checked]]:bg-accent"
          >
            <Checkbox
              id={optionId}
              checked={checked}
              disabled={disabled}
              className="size-5"
              onCheckedChange={(nextChecked) => {
                const normalized = Boolean(nextChecked);
                if (normalized) {
                  onChange([...value, option]);
                  return;
                }

                onChange(value.filter((item) => item !== option));
              }}
            />
            <span className="leading-snug">{option}</span>
          </Label>
        );
      })}
    </div>
  );
}
