import { ascendancies, phreciaMapping, poe2Mapping } from "@mytypes/ascendancy";
import { GameVersion } from "@api";
import { twMerge } from "tailwind-merge";

interface AscendancyProps extends React.HTMLAttributes<HTMLDivElement> {
  character_class: string;
  game_version: GameVersion;
}

export function AscendancyName({
  character_class,
  game_version,
  ...props
}: AscendancyProps) {
  const version = game_version;
  const class_name =
    phreciaMapping[character_class] ||
    poe2Mapping[character_class] ||
    character_class;
  const ascendancy = ascendancies[version];
  if (!ascendancy || !ascendancy[class_name]) {
    return character_class;
  }
  return (
    <span
      {...props}
      className={twMerge(
        "font-semi-bold",
        ascendancy[class_name].classColor,
        props.className,
      )}
    >
      {version === GameVersion.poe1 ? character_class : class_name}
    </span>
  );
}
