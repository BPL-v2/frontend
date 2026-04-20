import { useEffect } from "react";
import { GameVersion, Team, TeamCreate } from "@api";
import { Dialog } from "@components/dialog";
import { useAppForm } from "@components/form/context";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTeam } from "@api";

interface TeamFormModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  eventId: number;
  gameVersion: GameVersion | undefined;
  existingTeam?: Team | null;
}

export function TeamFormModal({
  isOpen,
  setIsOpen,
  eventId,
  gameVersion,
  existingTeam,
}: TeamFormModalProps) {
  const qc = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      abbreviation: "",
      color: "#000000",
      discord_role_id: undefined,
      allowed_classes: [],
    } as TeamCreate,
    onSubmit: (data) => createTeam(data.value as TeamCreate),
  });

  const { createTeam } = useCreateTeam(qc, eventId, () => {
    setIsOpen(false);
    form.reset();
  });

  useEffect(() => {
    if (!isOpen) return;
    if (existingTeam) {
      form.reset(existingTeam, { keepDefaultValues: true });
    } else {
      form.reset();
    }
  }, [isOpen, existingTeam]); // eslint-disable-line react-hooks/exhaustive-deps

  const poe2Classes = [
    "Warbringer",
    "Titan",
    "Chronomancer",
    "Stormweaver",
    "Witchhunter",
    "Gemling Legionnaire",
    "Invoker",
    "Acolyte of Chayula",
    "Deadeye",
    "Pathfinder",
    "Blood Mage",
    "Infernalist",
  ];

  const poe1Classes = [
    "Ascendant",
    "Assassin",
    "Berserker",
    "Champion",
    "Chieftain",
    "Deadeye",
    "Elementalist",
    "Gladiator",
    "Guardian",
    "Hierophant",
    "Inquisitor",
    "Juggernaut",
    "Necromancer",
    "Occultist",
    "Pathfinder",
    "Saboteur",
    "Slayer",
    "Trickster",
    "Warden",
    "Reliquarian",
  ];

  return (
    <Dialog
      title={existingTeam ? "Edit Team" : "Create Team"}
      open={isOpen}
      setOpen={setIsOpen}
      className="w-md"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex w-full flex-col gap-2 rounded-box bg-base-300 p-4"
      >
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Name" required />}
        />
        <form.AppField
          name="abbreviation"
          children={(field) => (
            <field.TextField label="Abbreviation" required />
          )}
        />
        <form.AppField
          name="color"
          children={(field) => <field.ColorField label="Color" />}
        />
        <form.AppField
          name="discord_role_id"
          children={(field) => <field.TextField label="Discord Role ID" />}
        />
        <form.AppField
          name="allowed_classes"
          children={(field) => (
            <field.ArrayField
              className="h-80"
              label="Allowed Classes"
              options={
                gameVersion === GameVersion.poe2 ? poe2Classes : poe1Classes
              }
            />
          )}
        />
        <div className="mt-4 flex flex-row justify-end gap-2">
          <button
            className="btn btn-error"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}
