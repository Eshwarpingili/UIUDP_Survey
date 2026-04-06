"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ScaleInputProps = {
  id: string;
  value?: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
};

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

export function ScaleInput({
  id,
  value,
  onChange,
  minLabel,
  maxLabel,
  disabled = false,
}: ScaleInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{minLabel ?? "Strongly disagree"}</span>
        <span>{maxLabel ?? "Strongly agree"}</span>
      </div>

      <RadioGroup
        value={value ? String(value) : ""}
        onValueChange={(next) => onChange(Number(next))}
        className="grid grid-cols-5 gap-2"
        aria-label="Select scale value"
      >
        {SCALE_VALUES.map((scaleValue) => {
          const inputId = `${id}-scale-${scaleValue}`;

          return (
            <Label
              key={scaleValue}
              htmlFor={inputId}
              className="min-h-11 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-card px-2 py-2 text-foreground transition-colors hover:border-primary/60 has-[[data-slot=radio-group-item][data-checked=true]]:border-primary has-[[data-slot=radio-group-item][data-checked=true]]:bg-accent"
            >
              <RadioGroupItem id={inputId} value={String(scaleValue)} disabled={disabled} />
              <span className="text-sm font-semibold">{scaleValue}</span>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
