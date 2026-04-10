import { useState } from "react";
import { useFieldContext } from "./context";
import { twMerge } from "tailwind-merge";

export function CommaSeperatedField<T>({
  label,
  className,
  fromString,
  toString,
  ...props
}: {
  label: string;
  fromString: (value: string) => T;
  toString: (value: T) => string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldContext<T[]>();
  const [editedValue, setEditedValue] = useState<string | undefined>(undefined);
  const stringValue = editedValue ?? (field.state.value?.map(toString).join(",") || "");

  return (
    <label
      className="flex w-full flex-col items-start gap-1"
      hidden={props.hidden}
    >
      <span className="label px-2">
        {label}
        {props.required && <span className="text-red-500">*</span>}
      </span>
      <input
        value={stringValue}
        onChange={(e) => {
          setEditedValue(e.target.value);
          field.handleChange(
            e.target.value
              .split(",")
              .filter((v) => v.trim())
              .map(fromString),
          );
        }}
        className={twMerge("input w-full", className)}
        {...props}
      />
    </label>
  );
}
