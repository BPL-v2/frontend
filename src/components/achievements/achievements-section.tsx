import {
  useGetAchievements,
  useGetUserAchievements,
  AchievementResponse,
} from "@api";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

const baseUrl = process.env.VITE_PUBLIC_BPL_BACKEND_URL;

function AchievementBadge({
  achievement,
  earned,
}: {
  achievement: AchievementResponse;
  earned: boolean;
}) {
  const iconUrl = achievement.icon_url;
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const label = achievement.description
    ? `${achievement.name}: ${achievement.description}`
    : achievement.name;

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setPos(null)}
    >
      <div
        className={`flex size-20 items-center justify-center overflow-hidden rounded-lg border-2 border-primary bg-base-100 text-highlight-content transition-opacity ${
          earned ? "opacity-100" : "opacity-40"
        }`}
      >
        {iconUrl ? (
          <img
            src={`${baseUrl}${iconUrl}`}
            alt={achievement.name}
            className="size-full object-contain"
          />
        ) : (
          <span className="px-1 text-center text-xs leading-tight opacity-60">
            {achievement.name}
          </span>
        )}
      </div>
      <span className="w-20 text-center text-xs leading-tight opacity-70 sm:hidden">
        {achievement.name}
      </span>
      {pos &&
        createPortal(
          <div
            className="pointer-events-none fixed z-9999 max-w-xs -translate-x-1/2 -translate-y-full rounded-box bg-base-200 px-3 py-2 text-sm text-base-content shadow-lg"
            style={{ left: pos.x, top: pos.y - 8 }}
          >
            {label}
          </div>,
          document.body,
        )}
    </div>
  );
}

export function AchievementsSection({ userId }: { userId: number }) {
  const { achievements } = useGetAchievements();
  const { userAchievements } = useGetUserAchievements(userId);
  const [expanded, setExpanded] = useState(false);

  const grantedAt = new Map(
    userAchievements.map((ua) => [ua.achievement_id, ua.granted_at ?? ""]),
  );

  const earned = achievements
    .filter((a) => grantedAt.has(a.id))
    .sort((a, b) =>
      String(grantedAt.get(b.id) ?? "").localeCompare(
        String(grantedAt.get(a.id) ?? ""),
      ),
    );
  const available = achievements.filter((a) => !grantedAt.has(a.id));

  if (achievements.length === 0) return null;

  const ordered = [...earned, ...available];

  return (
    <div className="flex flex-col items-center gap-3 rounded-box bg-base-300 p-2">
      <h2 className="text-center text-2xl font-semibold">Achievements</h2>
      <div
        className={`flex flex-wrap justify-center gap-2 overflow-hidden transition-all ${
          expanded ? "max-h-[2000px]" : "max-h-32 sm:max-h-20"
        }`}
      >
        {ordered.map((a) => (
          <AchievementBadge
            key={a.id}
            achievement={a}
            earned={grantedAt.has(a.id)}
          />
        ))}
      </div>
      {ordered.length > 0 && (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Show less" : "Show all achievements"}
        </button>
      )}
    </div>
  );
}
