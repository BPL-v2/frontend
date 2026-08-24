import { useFieldContext } from "@components/form/context";
import { twMerge } from "tailwind-merge";

export function TextField({
  label,
  className,
  options,
  helperText,
  ...props
}: {
  label: string;
  className?: string;
  options?: string[];
  helperText?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldContext<string>();
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
        type="text"
        list={`${label}-options`}
        value={field.state.value || ""}
        onChange={(e) => field.handleChange(e.target.value)}
        className={twMerge("input w-full", className)}
        {...props}
      />
      {helperText && (
        <span className="px-2 text-left text-sm text-base-content/70">
          {helperText}
        </span>
      )}
      <datalist id={`${label}-options`}>
        {options?.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
    </label>
  );
}
