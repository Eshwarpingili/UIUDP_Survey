"use client";

import { Label } from "@/components/ui/label";
import {
  RadioGroup as ShadcnRadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

type MatrixValue = Record<string, string>;

type MatrixTableProps = {
  id: string;
  rows: string[];
  columns: string[];
  value?: MatrixValue;
  onChange: (value: MatrixValue) => void;
  disabled?: boolean;
};

export function MatrixTable({
  id,
  rows,
  columns,
  value = {},
  onChange,
  disabled = false,
}: MatrixTableProps) {
  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const groupValue = value[row] ?? "";

        return (
          <div key={row} className="rounded-xl border bg-card p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{row}</p>
            <ShadcnRadioGroup
              value={groupValue}
              onValueChange={(next) => {
                onChange({
                  ...value,
                  [row]: next,
                });
              }}
              className="grid grid-cols-1 gap-2 sm:grid-cols-3"
              aria-label={`${row} response options`}
            >
              {columns.map((column) => {
                const optionId = `${id}-${row}-${column}`.replace(/\s+/g, "-").toLowerCase();

                return (
                  <Label
                    key={column}
                    htmlFor={optionId}
                    className="min-h-11 cursor-pointer justify-center rounded-lg border px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/60 has-[[data-slot=radio-group-item][data-checked=true]]:border-primary has-[[data-slot=radio-group-item][data-checked=true]]:bg-accent"
                  >
                    <RadioGroupItem
                      id={optionId}
                      value={column}
                      disabled={disabled}
                      className="size-5"
                    />
                    <span>{column}</span>
                  </Label>
                );
              })}
            </ShadcnRadioGroup>
          </div>
        );
      })}
    </div>
  );
}
