import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

export type SelectOption<T> = {
  label: string;
  value: T;
};

type SelectProps<T> = {
  name?: string;
  options: SelectOption<T>[];
  values: T[];
  onChange: (value: NoInfer<NonNullable<T[]>>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
};

export function MultiSelect<T>({
  name,
  options,
  onChange,
  placeholder,
  required = false,
  className = "",
  values,
}: SelectProps<T>) {
  const [query, setQuery] = useState("");
  const filtered = options.filter(
    (o) => !query || o.label.toLowerCase().includes(query.toLowerCase()),
  );
  const labelByValue = useMemo(
    () => new Map(options.map((o) => [o.value, o.label])),
    [options],
  );

  return (
    <Combobox
      multiple
      value={values ?? []}
      onChange={onChange}
      onClose={() => setQuery("")}
      virtual={{ options: filtered.map((o) => o.value) }}
    >
      <div className={twMerge("w-full", className, "relative")}>
        <ComboboxButton className="w-full">
          <ComboboxInput
            className={twMerge("w-full", className, "input")}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(e) => {
              if (e.key === " ") e.stopPropagation();
            }}
            placeholder={
              values.length > 0
                ? options.find((o) => o.value === values[values.length - 1])
                    ?.label
                : placeholder
            }
            required={required && values.length === 0}
            name={name}
            autoComplete="off"
          />
          {values.length > 1 && (
            <div className="absolute inset-y-0 right-0 m-2 flex size-6 items-center justify-center rounded-full border border-highlight bg-base-200">
              <span className="text-sm">{values.length}</span>
            </div>
          )}
        </ComboboxButton>
      </div>
      {filtered.length > 0 && (
        <ComboboxOptions
          anchor="bottom"
          className="z-1000 max-h-72 w-(--input-width) space-y-1 overflow-y-auto rounded-box border border-highlight bg-base-300 p-2"
        >
          {({ option }: { option: T }) => (
            <ComboboxOption
              value={option}
              className="cursor-pointer rounded-box px-2 py-1 hover:bg-primary/50 hover:text-primary-content data-selected:bg-primary data-selected:text-primary-content"
            >
              {labelByValue.get(option)}
            </ComboboxOption>
          )}
        </ComboboxOptions>
      )}
    </Combobox>
  );
}
