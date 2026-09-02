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
  // Tailwind text-color class (e.g. "text-blue-500") applied to the option
  // label and, when selected, to the input's displayed value.
  color?: string;
};

type SelectProps<T> = {
  name?: string;
  options: T[] | SelectOption<T>[];
  value?: T | null;
  onChange?: (value: NoInfer<NonNullable<T> | null> | null) => void;
  className?: string;
  placeholder?: string;
  fontSize?: string;
  required?: boolean;
};

export default function Select<T>({
  name,
  options,
  onChange,
  placeholder,
  required = false,
  fontSize = "text-sm",
  className = "",
  value,
}: SelectProps<T>) {
  const [query, setQuery] = useState("");
  const [manualSelected, setSelected] = useState<
    SelectOption<T> | null | undefined
  >(undefined);
  const cleanOptions = useMemo(() => {
    if (!options || options.length === 0) {
      return [];
    }
    if (typeof options[0] === "object") {
      return options as SelectOption<T>[];
    }
    return options.map(
      (option) =>
        ({
          label: option as string,
          value: option as T,
        }) as SelectOption<T>,
    );
  }, [options]);

  // Derive selected from value prop, but allow manual override
  const selected =
    manualSelected !== undefined
      ? (manualSelected ?? undefined)
      : value == null
        ? undefined
        : cleanOptions.find((option) => option.value === value);

  const filtered =
    query === ""
      ? cleanOptions
      : cleanOptions.filter((option) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        });

  const labelByValue = useMemo(
    () => new Map(cleanOptions.map((o) => [o.value, o.label])),
    [cleanOptions],
  );
  const colorByValue = useMemo(
    () => new Map(cleanOptions.map((o) => [o.value, o.color])),
    [cleanOptions],
  );

  const showClear = !!selected && !required;
  const virtualOptions = showClear
    ? [null, ...filtered.map((o) => o.value)]
    : filtered.map((o) => o.value);

  return (
    <div className={twMerge(fontSize, className)}>
      {name && (
        <input
          type="hidden"
          name={name}
          value={String(selected?.value) || ""}
          required={required}
        />
      )}
      <Combobox
        value={selected?.value || null}
        onChange={(value) => {
          setSelected(cleanOptions.find((o) => o.value === value) ?? null);
          if (onChange) onChange(value);
        }}
        onClose={() => setQuery("")}
        name={name}
        virtual={{
          options: virtualOptions as (NonNullable<T> | null)[],
        }}
      >
        <ComboboxButton className="w-full" name={name}>
          <ComboboxInput
            className={twMerge(
              "select w-full",
              fontSize,
              className,
              selected?.color,
            )}
            displayValue={() => selected?.label || ""}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === " ") e.stopPropagation();
            }}
            placeholder={placeholder}
            name={name}
            required={required}
            autoComplete="off"
          />
        </ComboboxButton>
        <ComboboxOptions
          anchor="bottom"
          className="z-1000 max-h-72 w-(--input-width) overflow-y-auto rounded-box border-2 border-gray-200 bg-base-100 p-1"
        >
          {({ option }: { option: T | null }) =>
            option === null ? (
              <ComboboxOption
                value={null}
                className="group cursor-pointer rounded-lg px-3 py-2 text-error select-none data-focus:bg-error data-focus:text-error-content"
              >
                Clear Selection
              </ComboboxOption>
            ) : (
              <ComboboxOption
                value={option}
                className={twMerge(
                  "group cursor-pointer rounded-lg px-3 py-2 select-none hover:bg-base-300 data-selected:bg-primary data-selected:text-primary-content",
                  colorByValue.get(option),
                )}
              >
                {labelByValue.get(option)}
              </ComboboxOption>
            )
          }
        </ComboboxOptions>
      </Combobox>
    </div>
  );
}
