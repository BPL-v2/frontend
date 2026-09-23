import { GameVersion } from "@api";
import { getGemColorKey } from "@utils/gem-utils";
import { InventoryIcon } from "@icons/inventory-icons";
import { Gem, PathOfBuilding, Skill } from "@utils/pob";
import { twMerge } from "tailwind-merge";
import { useState } from "react";

export function CharacterSkills({
  pob,
  gameVersion,
}: {
  pob: PathOfBuilding;
  gameVersion: GameVersion;
}) {
  var equipmentSlots = [
    "Helmet",
    "Body Armour",
    "Gloves",
    "Boots",
    "Belt",
    "Amulet",
    "Ring 1",
    "Ring 2",
    "Weapon 1",
    "Weapon 2",
  ].sort((slotA, slotB) => {
    const mainGroup =
      pob.skills.skillSets[0].skills[pob.build.mainSocketGroup - 1];
    if (mainGroup?.slot == slotA) return -1;
    if (mainGroup?.slot == slotB) return 1;
    const skillsA = pob.skills.skillSets[0].skills.filter(
      (skill) => skill.slot === slotA,
    );
    const skillsB = pob.skills.skillSets[0].skills.filter(
      (skill) => skill.slot === slotB,
    );
    return (
      skillsB.flatMap((skill) => skill.gems).length -
      skillsA.flatMap((skill) => skill.gems).length
    );
  });

  var slotSkills = equipmentSlots
    .filter((slot) =>
      pob.skills.skillSets[0].skills.some((skill) => skill.slot === slot),
    )
    .map((slot) => {
      return {
        slot: slot,
        skills: pob.skills.skillSets[0].skills.filter(
          (skill) => skill.slot === slot,
        ),
      };
    });
  if (gameVersion === GameVersion.poe2) {
    slotSkills = pob.skills.skillSets[0].skills
      .sort((skillA, skillB) => {
        if (skillB.gems.length === skillA.gems.length) {
          return skillA.gems[0].nameSpec.localeCompare(skillB.gems[0].nameSpec);
        }
        return skillB.gems.length - skillA.gems.length;
      })
      .map((skill, id) => {
        return {
          slot: id.toString(),
          skills: [skill],
        };
      });
  }
  return (
    <div className="h-full columns-2 gap-2 overflow-visible rounded-box bg-base-300 p-4 text-sm md:p-8">
      {slotSkills.map(({ slot, skills }) => {
        return (
          <div
            className="relative mb-2 flex break-inside-avoid flex-col overflow-visible rounded-xl bg-base-200 px-3 py-2.5"
            key={`skill-${slot}`}
          >
            <InventoryIcon slot={slot} className="absolute top-2 right-2" />
            <div key={slot} className="flex flex-col gap-2">
              {skills.map((skill, skillId) => {
                return (
                  <div
                    key={`skill-${slot}-${skillId}`}
                    className="flex flex-col"
                  >
                    {skill.gems.map((gem, gemId) => (
                      <SkillGem
                        key={`gem-${slot}-${skillId}-${gemId}`}
                        id={gemId}
                        gem={gem}
                        skill={skill}
                        pob={pob}
                        gameVersion={gameVersion}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillGem({
  id,
  gem,
  skill,
  pob,
  gameVersion,
}: {
  id: number;
  gem: Gem;
  skill: Skill;
  pob: PathOfBuilding;
  gameVersion: GameVersion;
}) {
  const [isHovered, setIsHovered] = useState(false);
  let text = getGemColor(gem, gameVersion);
  let position = "";
  if (gem.skillId.includes("Support")) {
    position = id === skill.gems.length - 1 ? "gem-last" : "gem-middle";
  } else {
    if (isMainSkill(skill, pob)) {
      text += " font-bold";
    }
  }
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={twMerge(
        "relative rounded-full",
        (gem.levelChangedFromLastSnapshot ||
          gem.qualityChangedFromLastSnapshot) &&
          "bg-info/20",
        gem.addedSinceLastSnapshot && "bg-success/20",
      )}
    >
      <span className={twMerge("truncate", position, text)}>
        {gem.nameSpec}
      </span>
      {isHovered && (
        <div
          className={twMerge(
            "pointer-events-none absolute top-0 right-0 z-50 rounded-lg border bg-black/90 px-2 text-sm",
            text,
          )}
        >
          <span
            className={gem.levelChangedFromLastSnapshot ? "font-black" : ""}
          >
            {gem.level || 0}
          </span>
          {" / "}
          <span
            className={gem.qualityChangedFromLastSnapshot ? "font-black" : ""}
          >
            {gem.quality || 0}
          </span>
        </div>
      )}
    </div>
  );
}

function isMainSkill(skill: Skill, pob: PathOfBuilding): boolean {
  const mainSkillGroup =
    pob.skills.skillSets[0].skills[pob.build.mainSocketGroup - 1];
  if (
    skill.slot !== mainSkillGroup.slot ||
    skill.gems.length !== mainSkillGroup.gems.length
  ) {
    return false;
  }
  for (let i = 0; i < skill.gems.length; i++) {
    if (skill.gems[i].gemId !== mainSkillGroup.gems[i].gemId) {
      return false;
    }
  }
  return true;
}

function getGemColor(gem: Gem, gameVersion: GameVersion): string {
  if (!gem.gemId) {
    return "text-base-content";
  }
  switch (getGemColorKey(gem.nameSpec, gameVersion)) {
    case "r":
      return "text-strength";
    case "g":
      return "text-dexterity";
    case "b":
      return "text-intelligence";
    default:
      return "text-base-content";
  }
}
