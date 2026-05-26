import { ItemField } from "@api/generated/models/itemField";
import { Operator } from "@api/generated/models/operator";
import { ScoreObjective } from "@mytypes/score";

interface Props {
  objective: ScoreObjective;
  children: React.ReactNode;
}
// export const Operator = {
//   EQ: "EQ",
//   NEQ: "NEQ",
//   GT: "GT",
//   LT: "LT",
//   IN: "IN",
//   NOT_IN: "NOT_IN",
//   MATCHES: "MATCHES",
//   CONTAINS: "CONTAINS",
//   CONTAINS_ALL: "CONTAINS_ALL",
//   CONTAINS_MATCH: "CONTAINS_MATCH",
//   LENGTH_EQ: "LENGTH_EQ",
//   LENGTH_GT: "LENGTH_GT",
//   LENGTH_LT: "LENGTH_LT",
//   DOES_NOT_MATCH: "DOES_NOT_MATCH",
// } as const;

const operatorToSymbol: Record<Operator, string> = {
  GT: ">",
  LT: "<",
  EQ: "=",
  NEQ: "!=",
  IN: "in",
  NOT_IN: "not in",
  MATCHES: "matches",
  DOES_NOT_MATCH: "does not match",
  CONTAINS: "contains",
  CONTAINS_ALL: "contains all",
  CONTAINS_MATCH: "contains match",
  LENGTH_EQ: "length =",
  LENGTH_GT: "length >",
  LENGTH_LT: "length <",
};

const fieldToName: Record<ItemField, string> = {
  BASE_TYPE: "Base Type",
  NAME: "Name",
  ITEM_CLASS: "Item Class",
  ICON_NAME: "Icon Name",
  TYPE_LINE: "Type Line",
  QUALITY: "Quality",
  LEVEL: "Level",
  RARITY: "Rarity",
  ILVL: "Item Level",
  FRAME_TYPE: "Frame Type",
  TALISMAN_TIER: "Talisman Tier",
  MAP_TIER: "Map Tier",
  MAP_QUANT: "Map Quantity",
  MAP_RARITY: "Map Rarity",
  MAP_PACK_SIZE: "Map Pack Size",
  HEIST_TARGET: "Heist Target",
  HEIST_ROGUE_REQUIREMENT: "Heist Rogue Requirement",
  ENCHANT_MODS: "Enchant Mods",
  EXPLICIT_MODS: "Explicit Mods",
  IMPLICIT_MODS: "Implicit Mods",
  CRAFTED_MODS: "Crafted Mods",
  FRACTURED_MODS: "Fractured Mods",
  INFLUENCES: "Influences",
  MAX_LINKS: "Max Links",
  SOCKETS: "Sockets",
  INCUBATOR_KILLS: "Incubator Kills",
  IS_CORRUPTED: "Corrupted",
  IS_VAAL: "Vaal",
  IS_SPLIT: "Split",
  IS_IDENTIFIED: "Identified",
  IS_MIRRORED: "Mirrored",
  SANCTUM_AFFLICTIONS: "Sanctum Afflictions",
  TEMPLE_ROOMS: "Temple Rooms",
  TEMPLE_ROOMS_T3: "Temple Rooms T3",
  RITUAL_VESSEL_BOSSES: "Ritual Vessel Bosses",
  RITUAL_VESSEL_MAP: "Ritual Vessel Map",
  FACETOR_LENS_EXP: "Facetor Lens Exp",
  MEMORY_STRANDS: "Memory Strands",
  IS_FOULBORN: "Is Foulborn",
  FOULBORN_MODS: "Foulborn Mods",
  GRAFT_SKILL_NAME: "Graft Skill Name",
  GRAFT_SKILL_LEVEL: "Graft Skill Level",
};

export const ConditionDescription: React.FC<Props> = ({
  objective,
  children,
}) => {
  if (objective.conditions.length === 0) {
    return children;
  }
  return (
    <div className="tooltip">
      <span className="tooltip-content list p-4">
        <ul>
          {objective.conditions.map((condition, index) => (
            <li className="list-row text-lg" key={index}>
              <span>
                <span className="font-bold">
                  {fieldToName[condition.field]}
                </span>{" "}
                <span>{operatorToSymbol[condition.operator]}</span>{" "}
                <span>{condition.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </span>
      {children}
    </div>
  );
};
