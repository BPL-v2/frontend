import { Event, LadderEntry, Team } from "@api";
import { getSkillColor } from "@utils/gems";
import { Link } from "@tanstack/react-router";
import { AscendancyName } from "./ascendancy-name";
import { AscendancyPortrait } from "./ascendancy-portrait";
import { ExperienceBar } from "./experience-bar";

export const ACTIVE_THRESHOLD_SECONDS = 20 * 60;

export function ActivityDot({
  last_active,
  className,
}: {
  last_active: number;
  className?: string;
}) {
  const isActive =
    last_active > 0 &&
    Date.now() / 1000 - last_active < ACTIVE_THRESHOLD_SECONDS;
  return (
    <span
      className={`rounded-full border-2 border-base-300 ${isActive ? "bg-success" : "bg-error"} ${className ?? ""}`}
    />
  );
}

interface Props {
  entry: LadderEntry;
  team?: Team;
  event: Event;
}

export function LadderPortrait({ entry, team, event }: Props) {
  return (
    <Link
      className="flex w-100 flex-row items-center gap-5"
      to={"/profile/$userId/$eventId/$characterId"}
      params={{
        userId: entry.user_id || 0,
        characterId: entry.character_id || "",
        eventId: event.id,
      }}
    >
      <div className="relative shrink-0">
        <AscendancyPortrait
          character_class={entry.ascendancy}
          game_version={event.game_version}
          className="size-20 rounded-full object-cover"
        />
        <ActivityDot
          last_active={entry.last_active}
          className="absolute top-0 right-0 size-4"
        />
      </div>
      <div className="flex w-full flex-col">
        <span className="font-bold" style={{ color: team?.color || "inherit" }}>
          {entry.character_name}
        </span>
        <span className={getSkillColor(entry.main_skill) + " font-bold"}>
          {entry.main_skill}
        </span>
        <AscendancyName
          character_class={entry.ascendancy}
          game_version={event.game_version}
          className="font-bold"
        />
        <div className="flex items-center gap-1">
          lvl
          <ExperienceBar experience={entry.xp} level={entry.level} />
        </div>
      </div>
    </Link>
  );
}
