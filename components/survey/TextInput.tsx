"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TextInputProps = {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
};

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  multiline = false,
  disabled = false,
}: TextInputProps) {
  if (multiline) {
    return (
      <Textarea
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-32 rounded-xl bg-card px-4 py-3"
      />
    );
  }

  return (
    <Input
      id={id}
      value={value ?? ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="min-h-11 rounded-xl bg-card px-4"
    />
  );
}
