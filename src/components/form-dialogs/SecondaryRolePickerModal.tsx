import { PickerDialog } from "@components/form-dialogs/PickerDialog";
import {
  ROLES,
  ROLE_COLORS,
  SPECIALIZATIONS,
  SPECIALIZATION_COLORS,
} from "@mytypes/roles";
import { GlobalStateContext } from "@utils/context-provider";
import { pickColor } from "@utils/color";
import { twMerge } from "tailwind-merge";
import {
  BeakerIcon,
  BoltIcon,
  CubeIcon,
  HeartIcon,
  KeyIcon,
  LockClosedIcon,
  MapIcon,
  ShieldCheckIcon,
  Square3Stack3DIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "react";

const ROLE_ICONS: Record<string, typeof MapIcon> = {
  Anything: SparklesIcon,
  Janitor: WrenchScrewdriverIcon,
  Crafter: BeakerIcon,
  Mapper: MapIcon,
  Delver: CubeIcon,
  Lab: KeyIcon,
  Heister: LockClosedIcon,
  Bosser: BoltIcon,
  Sanctum: ShieldCheckIcon,
  Support: HeartIcon,
  "Side Content": Square3Stack3DIcon,
};

// A specialization is stored/displayed as "Role: Specialization" (e.g.
// "Delver: Deep Delve") so it stays unambiguous if a specialization name
// is ever reused across roles - none currently are, but nothing stops it.
export function specializationLabel(role: string, specialization: string) {
  return `${role}: ${specialization}`;
}

function roleOf(specializationLabel: string) {
  return specializationLabel.split(": ")[0];
}

interface SecondaryRolePickerModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  initialSelectedRoles: string[];
  initialSelectedSpecializations: string[];
  onConfirm: (roles: string[], specializations: string[]) => void;
}

export function SecondaryRolePickerModal({
  isOpen,
  setIsOpen,
  initialSelectedRoles,
  initialSelectedSpecializations,
  onConfirm,
}: SecondaryRolePickerModalProps) {
  const { preferences } = useContext(GlobalStateContext);

  // Roles have no checkbox of their own anymore - picking any specialization
  // (including "No Preference") under a role is what selects that role, so
  // selectedRoles is fully derived from selectedSpecs.
  const [selectedSpecs, setSelectedSpecs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isOpen) return;
    // Upgrade any pre-existing role-only selection (from before
    // specializations got their own checkboxes) into a "Role: No
    // Preference" specialization, so it isn't silently dropped.
    const specs = new Set(initialSelectedSpecializations);
    for (const role of initialSelectedRoles) {
      const hasSpec = [...specs].some((label) => roleOf(label) === role);
      if (!hasSpec) {
        specs.add(specializationLabel(role, "No Preference"));
      }
    }
    setSelectedSpecs(specs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const selectedRoles = new Set([...selectedSpecs].map(roleOf));

  const toggleSpec = (role: string, spec: string) => {
    const label = specializationLabel(role, spec);
    const next = new Set(selectedSpecs);
    if (next.has(label)) {
      next.delete(label);
    } else {
      next.add(label);
    }
    setSelectedSpecs(next);
  };

  return (
    <PickerDialog
      title="Pick secondary roles"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="max-w-2xl"
      onConfirm={() => onConfirm([...selectedRoles], [...selectedSpecs])}
    >
      <>
        <div className="w-full text-left text-sm text-base-content/60">
          {selectedRoles.size} roles, {selectedSpecs.size} specializations
          selected
        </div>
        <div className="flex max-h-[60vh] w-full flex-col divide-y divide-base-content/10 overflow-y-auto rounded-box border border-base-content/20">
          {ROLES.map((role) => {
            const Icon = ROLE_ICONS[role] ?? SparklesIcon;
            const color = pickColor(
              preferences.colorfulRoles,
              ROLE_COLORS[role],
            );
            // "No Preference" is only dropped from roles that also have
            // real specializations to pick from (redundant clutter next to
            // e.g. "I will do the thing"). A role where it's the only
            // specialization (currently just Anything) keeps it, exactly
            // like any other role keeps its one real specialization (e.g.
            // Lab keeps "Carry").
            const rawSpecs = SPECIALIZATIONS[role] ?? [];
            const specs =
              rawSpecs.length > 1
                ? rawSpecs.filter((s) => s !== "No Preference")
                : rawSpecs;
            const roleSelected = selectedRoles.has(role);
            return (
              <div key={role} className="w-full">
                <div
                  className={twMerge(
                    "flex w-full items-center gap-3 px-3 py-2",
                    roleSelected ? "bg-base-content/5" : "",
                  )}
                >
                  <Icon className={twMerge("size-6 shrink-0", color)} />
                  <span
                    className={twMerge(
                      "text-left font-semibold",
                      color,
                      !roleSelected && "opacity-70",
                    )}
                  >
                    {role}
                  </span>
                </div>
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-0.5 py-1 pr-3 pl-11 sm:grid-cols-3">
                  {specs.map((spec) => {
                    const specColor = pickColor(
                      preferences.colorfulSpecializations,
                      SPECIALIZATION_COLORS[role]?.[spec],
                    );
                    return (
                      <label
                        key={spec}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-base-100"
                      >
                        <input
                          type="checkbox"
                          className="checkbox shrink-0 checkbox-xs"
                          checked={selectedSpecs.has(
                            specializationLabel(role, spec),
                          )}
                          onChange={() => toggleSpec(role, spec)}
                        />
                        <span
                          className={twMerge("truncate text-left", specColor)}
                        >
                          {spec}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </>
    </PickerDialog>
  );
}
