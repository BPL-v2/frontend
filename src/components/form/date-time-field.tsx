import { DateTimePicker } from "@components/form/datetime-picker";
import { twMerge } from "tailwind-merge";
import { useFieldContext } from "./context";

export function DateTimeField({
  label,
  className,
  helperText,
  hidden,
  ...props
}: {
  label: string;
  className?: string;
  helperText?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldContext<string>();
  return (
    <div className="flex w-full flex-col items-start gap-1" hidden={hidden}>
      <DateTimePicker
        defaultValue={field.state.value}
        label={label}
        name={props.name}
        required={props.required}
        onChange={(date) => {
          try {
            field.handleChange(date);
          } catch {
            // ignore
          }
        }}
        className={twMerge("w-full", className)}
      />
      {helperText && (
        <span className="px-2 text-left text-sm text-base-content/70">
          {helperText}
        </span>
      )}
    </div>
  );
}
