import { createFileRoute } from "@tanstack/react-router";
import { useGetEventStatus } from "@api";
import { ItemTable } from "@components/table/item-table";
import TeamScoreDisplay from "@components/team/team-score";
import { UniqueCategoryCard } from "@components/cards/unique-category-card";
import { hasEnded, isWinnable, ScoreObjective } from "@mytypes/score";
import { GlobalStateContext } from "@utils/context-provider";
import { JSX, useContext, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Countdown } from "@components/countdown";
import { EyeIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { RepeatableUniques } from "@components/temporary-uniques";
import { UniqueTabRules } from "@rules/uniques";

// had to cook this smooth scroll implementation cause daisyUI overrides scroll behaviour, can't just set it in the global css
function scrollToElement(el: HTMLElement, offset = 16) {
  const targetY = el.getBoundingClientRect().top + scrollY - offset;
  const startY = scrollY;
  const diff = targetY - startY;
  const dur = 500;
  let t0: number | null = null;

  function tick(t: number) {
    if (t0 === null) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    // easeInOutCubic
    const eased = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
    scrollTo(0, startY + diff * eased);
    if (p < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function isTimed(objective: ScoreObjective): boolean {
  return objective.valid_from != null || objective.valid_to != null;
}

function CategoryCard({
  category,
  selected,
  teamId,
  onClick,
}: {
  category: ScoreObjective;
  selected: boolean;
  teamId?: number;
  onClick: () => void;
}) {
  if (!isTimed(category)) {
    return (
      <UniqueCategoryCard
        objective={category}
        selected={selected}
        teamId={teamId}
        onClick={onClick}
      />
    );
  }
  const hasStarted =
    !category.valid_from || new Date(category.valid_from || "") < new Date();

  if (!hasStarted) {
    return (
      <div className="card h-full bg-card bborder shadow-xl">
        <div className="flex min-h-4 items-center rounded-t-box bborder-b bg-base-300/50 p-2">
          <h1 className="w-full font-extrabold">Coming Soon</h1>
        </div>
        <div className="flex h-full flex-col items-center justify-center px-4">
          <Countdown
            target={new Date(category.valid_from || "")}
            size="small"
          />
        </div>
      </div>
    );
  }
  return (
    <UniqueCategoryCard
      objective={category}
      selected={selected}
      teamId={teamId}
      onClick={onClick}
    />
  );
}

type CategoryGridProps = {
  categories: ScoreObjective[];
  selectedCategories: Set<number>;
  selectedTeam?: number;
  handleCategoryClick: (objective: ScoreObjective) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function CategoryGrid({
  categories,
  selectedCategories,
  selectedTeam,
  handleCategoryClick,
  ...htmlDivProps
}: CategoryGridProps) {
  const { currentEvent } = useContext(GlobalStateContext);
  if (categories.length === 0) return;
  return (
    <>
      <div {...htmlDivProps} className={twMerge("", htmlDivProps.className)}>
        <div className="flex flex-col gap-4 rounded-box rounded-tl-none bg-base-200 p-8 outline outline-base-300">
          <div className="m-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {categories
              .sort((a, b) => a.name.localeCompare(b.name))
              .sort(
                (a, b) =>
                  (a.valid_from?.getTime() || 0) -
                  (b.valid_from?.getTime() || 0),
              )
              .filter((category) => {
                if (!category.valid_from) {
                  return true;
                }
                return (
                  currentEvent.event_end_time.getTime() >
                  category.valid_from.getTime()
                );
              })
              .map((category) => {
                const isSelected = selectedCategories.has(category.id);
                return (
                  <div
                    key={`unique-category-${category.id}`}
                    className="relative"
                  >
                    <CategoryCard
                      category={category}
                      selected={isSelected}
                      teamId={selectedTeam}
                      onClick={() => handleCategoryClick(category)}
                    />
                    {isSelected && (
                      <div className="pointer-events-none absolute top-1.5 right-1.5 size-5 text-primary">
                        <EyeIcon />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export const Route = createFileRoute("/scores/uniques")({
  component: UniqueTab,
  validateSearch: (search) => {
    return {
      rules: search.rules as boolean,
      type: search.type as "standard" | "timed" | undefined,
    };
  },
});

function UniqueTab(): JSX.Element {
  const { rules, type } = Route.useSearch();
  const { currentEvent, scores, preferences, setPreferences } =
    useContext(GlobalStateContext);
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [teamOverride, setTeamOverride] = useState<number>();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [itemFilter, setItemfilter] = useState<string>("");
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const tableRef = useRef<HTMLDivElement>(null);
  const selectedTeam =
    teamOverride ??
    eventStatus?.team_id ??
    currentEvent?.teams?.sort((a, b) => b.id - a.id)[0]?.id;
  const uniqueCategory = scores?.children.find(
    (category) => category.name === "Uniques",
  );
  const hasStandard = useMemo(
    () =>
      uniqueCategory?.children.some((category) => !isTimed(category)) ?? false,
    [uniqueCategory],
  );
  const hasTimed = useMemo(
    () =>
      uniqueCategory?.children.some((category) => isTimed(category)) ?? false,
    [uniqueCategory],
  );
  const effectiveType =
    type ?? (!hasStandard && hasTimed ? "timed" : "standard");
  const handleCategoryClick = (objective: ScoreObjective) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(objective.id)) {
        next.delete(objective.id);
      } else {
        next.add(objective.id);
      }
      return next;
    });
    setShowScrollBtn(true);
  };

  const shownCategories = useMemo(() => {
    if (!uniqueCategory) {
      return [];
    }
    return uniqueCategory.children
      .filter((category) => {
        const timed = isTimed(category);
        if (effectiveType === "timed" && !timed) {
          return false;
        }
        if (effectiveType !== "timed" && timed) {
          return false;
        }
        if (timed && category.name === "") {
          return true;
        }
        return (
          category.name.toLowerCase().includes(categoryFilter.toLowerCase()) &&
          category.children.some((item) =>
            item.name.toLowerCase().includes(itemFilter.toLowerCase().trim()),
          ) &&
          (preferences.uniqueSets.showCompleted ||
            !hasEnded(category, selectedTeam)) &&
          (preferences.uniqueSets.showFirstAvailable || isWinnable(category))
        );
      })
      .map((category) => {
        return {
          ...category,
          children: category.children.filter((item) => {
            return item.name
              .toLowerCase()
              .includes(itemFilter.toLowerCase().trim());
          }),
        };
      });
  }, [
    uniqueCategory,
    categoryFilter,
    itemFilter,
    preferences,
    selectedTeam,
    effectiveType,
  ]);

  const activeCategories = useMemo(() => {
    if (selectedCategories.size === 0) return shownCategories;
    return shownCategories.filter((c) => selectedCategories.has(c.id));
  }, [shownCategories, selectedCategories]);

  const table = useMemo(() => {
    if (!uniqueCategory) return <></>;
    const cat = { ...uniqueCategory, children: [] } as ScoreObjective;
    for (const child of activeCategories) {
      for (const grandChild of child.children) {
        cat.children.push(grandChild);
      }
    }
    return <ItemTable objective={cat} />;
  }, [activeCategories, uniqueCategory]);

  if (!uniqueCategory) {
    return <></>;
  }

  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">
            <UniqueTabRules category={uniqueCategory} />
          </article>
        </div>
      ) : null}
      <TeamScoreDisplay
        objective={uniqueCategory}
        selectedTeam={selectedTeam}
        setSelectedTeam={setTeamOverride}
      />
      <div className="mt-4 flex flex-col gap-4 caret-transparent">
        <RepeatableUniques />
        <div className="flex flex-col overflow-hidden rounded-box border border-primary">
          <div className="flex flex-col gap-3 bg-base-200 px-4 py-3 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-4 md:gap-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
              <div className="flex gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xs opacity-60">Category</span>
                  <input
                    type="search"
                    className="input w-full input-sm"
                    placeholder=""
                    onInput={(e) => setCategoryFilter(e.currentTarget.value)}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <span className="text-xs opacity-60">Item Search</span>
                  <input
                    type="search"
                    className="input w-full input-sm"
                    placeholder=""
                    value={itemFilter}
                    onPaste={(e) => {
                      const paste = e.clipboardData.getData("text");
                      if (paste.split("\n").length > 2) {
                        setItemfilter(paste.split("\n")[2].trim());
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => setItemfilter(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-60">Show finished</span>
                  <input
                    type="checkbox"
                    checked={preferences.uniqueSets.showCompleted}
                    className="toggle toggle-md toggle-primary"
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        uniqueSets: {
                          ...preferences.uniqueSets,
                          showCompleted: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs opacity-60">Show unwinnable</span>
                  <input
                    type="checkbox"
                    checked={preferences.uniqueSets.showFirstAvailable}
                    className="toggle toggle-md toggle-primary"
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        uniqueSets: {
                          ...preferences.uniqueSets,
                          showFirstAvailable: e.target.checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <CategoryGrid
            categories={shownCategories}
            selectedCategories={selectedCategories}
            selectedTeam={selectedTeam}
            handleCategoryClick={handleCategoryClick}
          />
        </div>
        {selectedCategories.size > 0 && showScrollBtn && (
          <button
            className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-content shadow-lg transition-opacity hover:opacity-90"
            onClick={() => {
              scrollToElement(tableRef.current!);
              setShowScrollBtn(false);
            }}
          >
            <ChevronDownIcon className="size-5" />
            <span className="text-sm font-semibold">View items</span>
          </button>
        )}
        <div
          ref={tableRef}
          className="divider divider-primary text-xl font-extrabold"
        >
          {(selectedCategories.size > 0
            ? activeCategories.map((c) => c.name).join(" + ")
            : "All") + " Items"}
        </div>
        {table}
      </div>
    </>
  );
}
