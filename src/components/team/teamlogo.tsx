import { Team } from "@api";
import { backendUrl } from "@api/fetcher";
import { contrastColor } from "@utils/color";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

interface TeamLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  team?: Team;
}

export function TeamLogo({ team, ...props }: TeamLogoProps) {
  const [failedUrl, setFailedUrl] = useState<string>();
  if (!team?.name) return null;
  if (!team.icon_url || failedUrl === team.icon_url) {
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
      onError={() => setFailedUrl(team.icon_url)}
      src={backendUrl(team.icon_url)}
      alt={team?.name || "Team Logo"}
    />
  );
}
