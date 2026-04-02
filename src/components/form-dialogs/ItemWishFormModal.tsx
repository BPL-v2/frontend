import { ItemField } from "@api";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateItemWish, useFile } from "@api";
import { decodePoBExport, Rarity } from "@utils/pob";

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
  const { data: uniques } = useFile<
    Record<string, { base_type: string; is_drop_restricted: boolean }>
  >("/assets/poe1/items/uniques.json");
  const { data: gems } = useFile<Record<string, string[]>>(
    "/assets/poe1/items/gem_colors.json",
  );

  const allGems = new Set<string>(Object.values(gems || {}).flat());
  const altGems = Object.values(gems || {})
    .flat()
    .filter((gem) => {
      const baseGem = gem.split(" of ")[0];
      return baseGem !== gem && allGems.has(baseGem);
    });

  const { saveItemWish } = useCreateItemWish(qc, eventId, teamId);

  const form = useAppForm({
    defaultValues: {
      unique_name: "",
      gem_name: "",
      pob_export: "",
    },
    onSubmit: async (data) => {
      if (data.value.pob_export) {
        const pobData = await decodePoBExport(data.value.pob_export);
        pobData.items
          .filter((item) => item.rarity === Rarity.Unique)
          .map((item) => item.name)
          .forEach((itemName) =>
            saveItemWish({ item_field: ItemField.NAME, value: itemName }),
          );
        pobData.skills.skillSets
          .flatMap((set) => set.skills)
          .flatMap((skill) => skill.gems)
          .filter((gem) => gem.variantId.includes("Alt"))
          .map((gem) => gem.nameSpec)
          .forEach((itemName) =>
            saveItemWish({ item_field: ItemField.BASE_TYPE, value: itemName }),
          );
      }
      if (data.value.unique_name) {
        saveItemWish({
          item_field: ItemField.NAME,
          value: data.value.unique_name,
        });
      }
      if (data.value.gem_name) {
        saveItemWish({
          item_field: ItemField.BASE_TYPE,
          value: data.value.gem_name,
        });
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
          name="gem_name"
          children={(field) => (
            <field.TextField label="Gem" options={altGems} />
          )}
        />
        <form.AppField
          name="pob_export"
          children={(field) => <field.TextField label="PoB Export" />}
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
