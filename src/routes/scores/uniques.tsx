import { createFileRoute } from "@tanstack/react-router";
// import { UniqueTabRules } from "@rules/uniques";
import { useGetEventStatus } from "@api";
import { ItemTable } from "@components/table/item-table";
import TeamScoreDisplay from "@components/team/team-score";
import { UniqueCategoryCard } from "@components/cards/unique-category-card";
import { hasEnded, isWinnable, ScoreObjective } from "@mytypes/score";
import { GlobalStateContext } from "@utils/context-provider";
import { JSX, useContext, useMemo, useRef, useState } from "react";
import { router } from "../../main";
import { twMerge } from "tailwind-merge";
import { Countdown } from "@components/countdown";

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
      <div className="card h-full bborder bg-card shadow-xl">
        <div className="flex min-h-4 items-center rounded-t-box bborder-b bg-base-300/50 p-2">
          <h1 className="w-full font-extrabold">Coming Soon</h1>
        </div>
        <div className="flex h-full flex-col items-center justify-center px-4">
          <Countdown target={new Date(category.valid_to || "")} size="small" />
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
  selectedCategory?: ScoreObjective;
  selectedTeam?: number;
  handleCategoryClick: (objective: ScoreObjective) => void;
} & React.HTMLAttributes<HTMLDivElement>;

function CategoryGrid({
  categories,
  selectedCategory,
  selectedTeam,
  handleCategoryClick,
  ...htmlDivProps
}: CategoryGridProps) {
  if (categories.length === 0) return;
  return (
    <>
      <div {...htmlDivProps} className={twMerge("", htmlDivProps.className)}>
        <div className="flex flex-col gap-4 rounded-box rounded-tl-none bg-base-200 p-8 pt-4 outline outline-base-300">
          <div className="m-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {categories
              .sort(
                (a, b) =>
                  (a.valid_from?.getTime() || 0) -
                  (b.valid_from?.getTime() || 0),
              )
              .map((category) => {
                return (
                  <div key={`unique-category-${category.id}`}>
                    <CategoryCard
                      category={category}
                      selected={category.id === selectedCategory?.id}
                      teamId={selectedTeam}
                      onClick={() => handleCategoryClick(category)}
                    />
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
  const [selectedCategory, setSelectedCategory] = useState<ScoreObjective>();
  const [teamOverride, setTeamOverride] = useState<number>();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [itemFilter, setItemfilter] = useState<string>("");
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const tableRef = useRef<HTMLDivElement>(null);
  const selectedTeam =
    teamOverride ?? eventStatus?.team_id ?? currentEvent?.teams?.[0]?.id;
  const uniqueCategory = scores?.children.find(
    (category) => category.name === "Uniques",
  );
  const handleCategoryClick = (objective: ScoreObjective) => {
    if (objective.id === selectedCategory?.id) {
      setSelectedCategory(undefined);
      return;
    }
    setSelectedCategory(objective);
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const shownCategories = useMemo(() => {
    if (!uniqueCategory) {
      return [];
    }
    return uniqueCategory.children
      .filter((category) => {
        const timed = isTimed(category);
        if (type === "timed" && !timed) {
          return false;
        }
        if (type !== "timed" && timed) {
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
    type,
  ]);

  const effectiveSelectedCategory = useMemo(() => {
    if (shownCategories.length === 0) return undefined;
    if (shownCategories.length === 1) return shownCategories[0];
    return selectedCategory;
  }, [shownCategories, selectedCategory]);

  const table = useMemo(() => {
    if (!uniqueCategory) {
      return <></>;
    }
    if (!effectiveSelectedCategory) {
      const cat = {
        ...uniqueCategory,
        children: [],
      } as ScoreObjective;
      for (const child of shownCategories) {
        for (const grandChild of child.children) {
          cat.children.push(grandChild);
        }
      }
      return <ItemTable objective={cat} />;
    }

    return <ItemTable objective={effectiveSelectedCategory!}></ItemTable>;
  }, [effectiveSelectedCategory, uniqueCategory, shownCategories]);

  if (!uniqueCategory) {
    return <></>;
  }

  return (
    <>
      {rules ? (
        <div className="my-4 w-full rounded-box bg-base-200 p-8">
          <article className="prose max-w-4xl text-left">{rules}</article>
        </div>
      ) : null}
      <TeamScoreDisplay
        objective={uniqueCategory}
        selectedTeam={selectedTeam}
        setSelectedTeam={setTeamOverride}
      />
      <div className="mt-4 flex flex-col gap-4">
        <div className="flex justify-center">
          <fieldset className="fieldset flex w-3xl flex-row justify-center gap-12 rounded-box bg-base-200 p-2 md:p-4">
            <div>
              <legend className="fieldset-legend">Category</legend>
              <input
                type="search"
                className="input input-sm"
                placeholder=""
                onInput={(e) => setCategoryFilter(e.currentTarget.value)}
              />
            </div>
            <div>
              <legend className="fieldset-legend">Item Search</legend>
              <label className="fieldset-label">
                <input
                  type="search"
                  className="input input-sm"
                  placeholder=""
                  value={itemFilter}
                  onPaste={(e) => {
                    const paste = e.clipboardData.getData("text");
                    if (paste.split("\n").length > 2) {
                      setItemfilter(paste.split("\n")[2].trim());
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setItemfilter(e.target.value);
                  }}
                />
              </label>
            </div>
            <div>
              <legend className="fieldset-legend">Show finished</legend>
              <label className="fieldset-label">
                <input
                  type="checkbox"
                  checked={preferences.uniqueSets.showCompleted}
                  className="toggle toggle-lg"
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
              </label>
            </div>
            <div>
              <legend className="fieldset-legend">Show unwinnable</legend>
              <label className="fieldset-label">
                <input
                  type="checkbox"
                  checked={preferences.uniqueSets.showFirstAvailable}
                  className="toggle toggle-lg"
                  onChange={(e) => {
                    setPreferences({
                      ...preferences,
                      uniqueSets: {
                        ...preferences.uniqueSets,
                        showFirstAvailable: e.target.checked,
                      },
                    });
                  }}
                />
              </label>
            </div>
          </fieldset>
        </div>
        <div className="flex flex-col">
          <div className="join rounded-b-none bg-base-100">
            {[
              ["standard", "Permanent Unique Collection"],
              ["timed", "Temporary Unique Collection"],
            ].map(([value, label]) => (
              <input
                key={value}
                type="radio"
                name="tab"
                className="btn join-item rounded-b-none border-2 btn-outline btn-lg btn-primary"
                aria-label={label}
                checked={
                  value === type || (type === undefined && value === "standard")
                }
                onChange={() => {
                  setSelectedCategory(undefined);
                  if (value === type) {
                    router.navigate({
                      to: Route.fullPath,
                      search: (prev) => ({
                        rules: prev.rules ?? false,
                        type: undefined,
                      }),
                    });
                  } else {
                    router.navigate({
                      to: Route.fullPath,
                      search: (prev) => ({
                        rules: prev.rules ?? false,
                        type: value as "standard" | "timed",
                      }),
                    });
                  }
                }}
              />
            ))}
          </div>
          <CategoryGrid
            categories={shownCategories}
            selectedCategory={effectiveSelectedCategory}
            selectedTeam={selectedTeam}
            handleCategoryClick={handleCategoryClick}
          />
        </div>
        <div
          ref={tableRef}
          className="divider divider-primary text-xl font-extrabold"
        >
          {(effectiveSelectedCategory
            ? effectiveSelectedCategory.name
            : "All") + " Items"}
        </div>
        {table}
      </div>
    </>
  );
}
