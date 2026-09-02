import { ItemField } from "@api";
import { useEffect, useMemo } from "react";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateItemWish,
  useFile,
  useGetUser,
  useGetWishlist,
  useUpdateItemWish,
} from "@api";
import { TRANSFIGURED_SKILL_GEMS } from "@mytypes/skill-gems";
import {
  BUILD_ENABLING_LEVELS,
  DEFAULT_BUILD_ENABLING,
} from "@mytypes/item-wish";
import { BuildEnablingRating } from "@components/build-enabling-rating";

const MAX_QUANTITY = 5;

type ExtraFieldApi = {
  state: { value: string };
  handleChange: (value: string) => void;
  TextField: (props: {
    label: string;
    options?: string[];
    helperText?: React.ReactNode;
  }) => React.ReactNode;
};

// The `extra` input. For a Foulborn unique with a single possible mod there is
// nothing to choose, so we lock it to that mod; with several, it's a picker;
// otherwise it's a free-text note.
function ExtraField({
  field,
  isFoulborn,
  modOptions,
}: {
  field: ExtraFieldApi;
  isFoulborn: boolean;
  modOptions: string[];
}) {
  const onlyMod = modOptions.length === 1 ? modOptions[0] : null;

  useEffect(() => {
    if (onlyMod && field.state.value !== onlyMod) {
      field.handleChange(onlyMod);
    } else if (isFoulborn && modOptions.length > 1 && field.state.value) {
      // switched to a different Foulborn unique whose mod list doesn't include
      // the previously picked mod
      if (!modOptions.includes(field.state.value)) field.handleChange("");
    }
  }, [onlyMod, isFoulborn, modOptions, field]);

  return (
    <field.TextField
      label={isFoulborn ? "Foulborn mod" : "Extra"}
      options={modOptions}
      helperText={
        onlyMod
          ? "Foulborn Mod"
          : isFoulborn
            ? "Pick the Foulborn mod you want."
            : "Optional note."
      }
    />
  );
}

interface ItemWishFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  teamId: number | undefined;
}

export function ItemWishFormModal({
  isOpen,
  setIsOpen,
  eventId,
  teamId,
}: ItemWishFormModalProps) {
  const qc = useQueryClient();
  const { user } = useGetUser();
  const { wishlist = [] } = useGetWishlist(eventId, teamId);
  const { data: uniques } = useFile<
    Record<string, { base_type: string; is_drop_restricted: boolean }>
  >("/assets/poe1/items/uniques.json");
  const { data: foulbornEntries } = useFile<{ name: string; mod: string }[]>(
    "/assets/poe1/items/foulborn_uniques.json",
  );

  const uniqueOptions = useMemo(() => {
    const names = new Set(uniques ? Object.keys(uniques) : []);
    for (const entry of foulbornEntries ?? []) {
      names.add(`Foulborn ${entry.name}`);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [uniques, foulbornEntries]);

  const foulbornModsByName = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const entry of foulbornEntries ?? []) {
      (map[entry.name] ??= []).push(entry.mod);
    }
    return map;
  }, [foulbornEntries]);

  const { saveItemWish } = useCreateItemWish(qc, eventId, teamId);
  const { updateItemWish } = useUpdateItemWish(qc, eventId, teamId);

  // Adding something that's already on the wishlist (e.g. also picked via
  // the sheet's "Pick uniques" picker) must update that same row instead of
  // creating a duplicate, so there's always exactly one row per (user,
  // item) and removing it from either place removes it everywhere.
  const findExisting = (itemField: ItemField, value: string, extra: string) =>
    wishlist.find(
      (w) =>
        w.user_id === user?.id &&
        w.item_field === itemField &&
        w.value === value &&
        (w.extra ?? "") === extra,
    );

  const addWishIfMissing = (
    itemField: ItemField,
    value: string,
    quantity: number,
    buildEnabling: number,
    extra = "",
  ) => {
    const existing = findExisting(itemField, value, extra);
    if (!existing) {
      saveItemWish({
        item_field: itemField,
        value,
        build_enabling: buildEnabling,
        quantity: quantity,
        extra: extra || undefined,
      });
    } else {
      if (
        existing.quantity !== quantity ||
        existing.build_enabling !== buildEnabling
      ) {
        updateItemWish(existing.id, {
          quantity,
          build_enabling: buildEnabling,
        });
      }
    }
  };

  const form = useAppForm({
    defaultValues: {
      unique_name: "",
      gem_name: "",
      quantity: 1,
      build_enabling: DEFAULT_BUILD_ENABLING,
      extra: "",
    },
    onSubmit: (data) => {
      if (data.value.unique_name) {
        addWishIfMissing(
          ItemField.NAME,
          data.value.unique_name,
          data.value.quantity,
          data.value.build_enabling,
          data.value.extra.trim(),
        );
      }
      if (data.value.gem_name) {
        addWishIfMissing(
          ItemField.BASE_TYPE,
          data.value.gem_name,
          data.value.quantity,
          data.value.build_enabling,
        );
      }
      form.reset();
      setIsOpen(false);
    },
  });

  return (
    <Dialog title="Add Item Wish" open={isOpen} setOpen={setIsOpen}>
      <form
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="unique_name"
          children={(field) => (
            <field.TextField label="Unique" options={uniqueOptions} />
          )}
        />
        <form.Subscribe selector={(s) => s.values.unique_name}>
          {(uniqueName) => {
            const isFoulborn = uniqueName.startsWith("Foulborn ");
            const modOptions = isFoulborn
              ? (foulbornModsByName[uniqueName.slice("Foulborn ".length)] ?? [])
              : [];
            return (
              <form.AppField
                name="extra"
                children={(field) => (
                  <ExtraField
                    field={field}
                    isFoulborn={isFoulborn}
                    modOptions={modOptions}
                  />
                )}
              />
            );
          }}
        </form.Subscribe>
        <form.AppField
          name="quantity"
          children={(field) => (
            <field.NumberField
              label="Quantity"
              min={1}
              max={MAX_QUANTITY}
              className="w-24"
            />
          )}
        />
        <form.AppField
          name="gem_name"
          children={(field) => (
            <field.TextField label="Gem" options={TRANSFIGURED_SKILL_GEMS} />
          )}
        />
        <form.AppField
          name="build_enabling"
          children={(field) => (
            <div className="flex flex-col gap-1">
              <span className="label-text">
                How important is this for your build?
              </span>
              <BuildEnablingRating
                name="add-wish-build-enabling"
                value={field.state.value}
                onChange={(level) => field.handleChange(level)}
              />
              <ul className="mt-1 flex flex-col gap-0.5 text-left text-xs text-base-content/70">
                {BUILD_ENABLING_LEVELS.map((level) => (
                  <li key={level.value}>
                    <span className="font-semibold">
                      {level.value} – {level.label}:
                    </span>{" "}
                    {level.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        />
        <div className="mt-4 flex flex-row justify-end gap-2">
          <button
            type="button"
            className="btn btn-error"
            onClick={() => {
              setIsOpen(false);
              form.reset();
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
