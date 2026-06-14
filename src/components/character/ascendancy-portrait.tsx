import { ascendancies, phreciaMapping, poe2Mapping } from "@mytypes/ascendancy";
import { GameVersion } from "@api";

interface AscendancyProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  character_class: string;
  game_version: GameVersion;
}

export function AscendancyPortrait({
  character_class,
  game_version,
  ...props
}: AscendancyProps) {
  const asc = ascendancies[game_version];
  if (!asc) {
    return null;
  }
  const char =
    phreciaMapping[character_class] ||
    poe2Mapping[character_class] ||
    character_class;
  if (!asc[char]) {
    return null;
  }
  return <img src={asc[char].thumbnail} alt={char} {...props} />;
}
