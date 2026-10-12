import { Team } from "@api";
import { backendUrl } from "@api/fetcher";
import { contrastColor } from "@utils/color";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TeamLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  team?: Team;
  eventId: number;
}

export function TeamLogo({ team, eventId, ...props }: TeamLogoProps) {
  const [errorCount, setErrorCount] = useState(0);
  if (!team?.name) return null;
  // uploaded icon first, then the static asset, then the text fallback
  const sources = [
    ...(team.icon_url ? [backendUrl(team.icon_url)] : []),
    `/assets/team/${eventId}/${team.name.replaceAll(" ", "").replaceAll("-", "").toLowerCase()}-min.svg`,
  ];
  if (errorCount >= sources.length) {
    return (
      <div
        {...props}
        className={twMerge(
          "flex h-full w-full flex-row items-center justify-center rounded-box",
          props.className,
        )}
        style={{
          ...props.style,
          backgroundColor:
            team.color !== "#000000" ? team.color : "var(--color-highlight)",
        }}
      >
        <div
          className={twMerge(
            "text-center leading-tight font-bold wrap-break-word",
            team.name.length <= 4
              ? "text-xl"
              : team.name.length <= 8
                ? "text-sm"
                : "text-xs",
          )}
          style={{
            color:
              team.color && team.color !== "#000000"
                ? contrastColor(team.color)
                : undefined,
          }}
        >
          {team.name}
        </div>
      </div>
    );
  }
  return (
    <img
      {...props}
      onError={() => {
        setErrorCount(errorCount + 1);
      }}
      src={sources[errorCount]}
      alt={team?.name || "Team Logo"}
    />
  );
}
