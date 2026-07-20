import {
  useGetAchievements,
  useGetUserAchievements,
  AchievementResponse,
} from "@api";


function AchievementBadge({
  achievement,
  earned,
}: {
  achievement: AchievementResponse;
  earned: boolean;
}) {
  return (
    <div
      className="tooltip tooltip-top"
      data-tip={
        achievement.description
          ? `${achievement.name}: ${achievement.description}`
          : achievement.name
      }
    >
      <div
        className={`flex size-20 items-center justify-center overflow-hidden rounded-lg border-2 border-primary text-highlight-content transition-opacity ${
          earned ? "opacity-100" : "opacity-40"
        }`}
      >
        {achievement.icon_url ? (
          <img
            src={achievement.icon_url}
            alt={achievement.name}
            className="size-full object-contain"
          />
        ) : (
          <span className="px-1 text-center text-xs leading-tight opacity-60">
            {achievement.name}
          </span>
        )}
      </div>
    </div>
  );
}

export function AchievementsSection({ userId }: { userId: number }) {
  const { achievements } = useGetAchievements();
  const { userAchievements } = useGetUserAchievements(userId);

  const earnedIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  const earned = achievements.filter((a) => earnedIds.has(a.id));
  const available = achievements.filter((a) => !earnedIds.has(a.id));

  if (achievements.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-center text-2xl font-semibold">Achievements</h2>
      <div className="flex flex-wrap justify-center gap-2">
        {earned.map((a) => (
          <AchievementBadge key={a.id} achievement={a} earned />
        ))}
        {available.map((a) => (
          <AchievementBadge key={a.id} achievement={a} earned={false} />
        ))}
      </div>
    </div>
  );
}
