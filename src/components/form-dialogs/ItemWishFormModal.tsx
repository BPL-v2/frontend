import { ItemField } from "@api";
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
import { DEFAULT_BUILD_ENABLING } from "@mytypes/item-wish";

const MAX_QUANTITY = 5;

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

  const { saveItemWish } = useCreateItemWish(qc, eventId, teamId);
  const { updateItemWish } = useUpdateItemWish(qc, eventId, teamId);

  // Adding something that's already on the wishlist (e.g. also picked via
  // the sheet's "Pick uniques" picker) must update that same row instead of
  // creating a duplicate, so there's always exactly one row per (user,
  // item) and removing it from either place removes it everywhere.
  const findExisting = (itemField: ItemField, value: string) =>
    wishlist.find(
      (w) =>
        w.user_id === user?.id &&
        w.item_field === itemField &&
        w.value === value &&
        !w.extra,
    );

  const addWishIfMissing = (itemField: ItemField, value: string) => {
    if (!findExisting(itemField, value)) {
      saveItemWish({
        item_field: itemField,
        value,
        build_enabling: DEFAULT_BUILD_ENABLING,
      });
    }
  };

  const setWishQuantity = (
    itemField: ItemField,
    value: string,
    quantity: number,
  ) => {
    const existing = findExisting(itemField, value);
    if (existing) {
      if (existing.quantity !== quantity) {
        updateItemWish(existing.id, { quantity });
      }
    } else {
      saveItemWish({
        item_field: itemField,
        value,
        quantity,
        build_enabling: DEFAULT_BUILD_ENABLING,
      });
    }
  };

  const form = useAppForm({
    defaultValues: {
      unique_name: "",
      unique_quantity: 1,
      gem_name: "",
    },
    onSubmit: (data) => {
      if (data.value.unique_name) {
        setWishQuantity(
          ItemField.NAME,
          data.value.unique_name,
          Math.min(MAX_QUANTITY, Math.max(1, data.value.unique_quantity || 1)),
        );
      }
      if (data.value.gem_name) {
        addWishIfMissing(ItemField.BASE_TYPE, data.value.gem_name);
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
            <field.TextField
              label="Unique"
              options={uniques ? Object.keys(uniques) : []}
            />
          )}
        />
        <form.AppField
          name="unique_quantity"
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
