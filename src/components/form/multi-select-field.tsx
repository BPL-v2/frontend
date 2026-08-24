import { SelectOption } from "@components/form/select";
import { useFieldContext } from "@components/form/context";
import { MultiSelect } from "@components/form/multi-select";

export function MultiSelectField<T>({
  label,
  options,
  className,
  helperText,
  ...props
}: {
  label: string;
  options: SelectOption<T>[];
  className?: string;
  helperText?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const field = useFieldContext<T[]>();
  return (
    <div className={className} hidden={props.hidden}>
      <label className={"flex flex-col items-start gap-1"}>
        <span className="label px-2">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </span>
        <MultiSelect
          className="w-full"
          values={(field.state.value as T[]) || []}
          options={options}
          onChange={(value) => field.handleChange(value)}
          required={!props.hidden && props.required}
        />
        {helperText && (
          <span className="px-2 text-left text-sm text-base-content/70">
            {helperText}
          </span>
        )}
      </label>
    </div>
  );
}
