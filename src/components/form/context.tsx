import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { ArrayField } from "@components/form/array-field";
import { BooleanField } from "@components/form/bool-field";
import { ColorField } from "@components/form/color-field";
import { CommaSeperatedField } from "@components/form/comma-seperated-field";
import { DateTimeField } from "@components/form/date-time-field";
import { NumberField } from "@components/form/number-field";
import { SelectField } from "@components/form/select-field";
import { MultiSelectField } from "@components/form/multi-select-field";
import { TextField } from "@components/form/text-field";
export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    DateTimeField,
    BooleanField,
    SelectField,
    MultiSelectField,
    ColorField,
    ArrayField,
    CommaSeperatedField,
  },
  formComponents: {},
});

export function setFormValues(
  form: { setFieldValue: (key: never, value: never) => void },
  object: object,
) {
  Object.entries(object).forEach(([key, value]) => {
    (form.setFieldValue as (key: string, value: unknown) => void)(key, value);
  });
}
