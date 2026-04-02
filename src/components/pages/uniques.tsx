import { useGetEventStatus } from "@client/query";
import { ItemTable } from "@components/table/item-table";
import TeamScoreDisplay from "@components/team/team-score";
import { UniqueCategoryCard } from "@components/cards/unique-category-card";
import { hasEnded, isWinnable, ScoreObjective } from "@mytypes/score";
import { GlobalStateContext } from "@utils/context-provider";
import { JSX, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ScoringMethod } from "@client/api";
import { twMerge } from "tailwind-merge";

function isTimed(objective: ScoreObjective): boolean {
  return objective.valid_from != null || objective.valid_to != null;
}

function isOpenEnded(objective: ScoreObjective): boolean {
  return objective.children.some((child) =>
    child.scoring_presets.some(
      (preset) => preset.scoring_method === ScoringMethod.POINTS_FROM_VALUE,
    ),
  );
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
  console.log(category);
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
  filtered: ScoreObjective[];
  selectedCategory?: ScoreObjective;
  selectedTeam?: number;
  handleCategoryClick: (objective: ScoreObjective) => void;
} & React.HTMLAttributes<HTMLDivElement>;

function CategoryGrid({
  categories,
  filtered,
  selectedCategory,
  selectedTeam,
  handleCategoryClick,
  ...htmlDivProps
}: CategoryGridProps) {
  if (categories.length === 0) return;
  const ids = categories.map((category) => category.id);
  const shownCategories = filtered
    .filter((category) => ids.includes(category.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  let label = "Standard Uniques";
  if (categories.some((category) => isTimed(category))) {
    label = "Timed Uniques";
  } else if (categories.some((category) => isOpenEnded(category))) {
    label = "Open Ended Uniques";
  }

  return (
    <>
      <div
        {...htmlDivProps}
        className={twMerge("tab-content", htmlDivProps.className)}
      >
        <div className="flex flex-col gap-4 rounded-box rounded-tl-none bg-base-200 p-8 pt-4 outline outline-base-300">
          <div className="m-2 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {shownCategories.map((category) => {
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

export function Uniques({
  categoryName,
  rules,
}: {
  categoryName: string;
  rules?: JSX.Element;
}): JSX.Element {
  const { currentEvent, scores, preferences, setPreferences } =
    useContext(GlobalStateContext);
  const [selectedCategory, setSelectedCategory] = useState<ScoreObjective>();
  const [selectedTeam, setSelectedTeam] = useState<number>();
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [itemFilter, setItemfilter] = useState<string>("");
  const { eventStatus } = useGetEventStatus(currentEvent.id);
  const tableRef = useRef<HTMLDivElement>(null);
  const uniqueCategory = scores?.children.find(
    (category) => category.name === categoryName,
  );
  const handleCategoryClick = (objective: ScoreObjective) => {
    if (objective.id === selectedCategory?.id) {
      setSelectedCategory(undefined);
      return;
    }
    setSelectedCategory(objective);
    tableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (eventStatus && eventStatus.team_id) {
      setSelectedTeam(eventStatus.team_id);
    } else if (
      currentEvent &&
      currentEvent.teams &&
      currentEvent.teams.length > 0
    ) {
      setSelectedTeam(currentEvent.teams[0].id);
    }
  }, [eventStatus, currentEvent]);

  const shownCategories = useMemo(() => {
    if (!uniqueCategory) {
      return [];
    }
    return uniqueCategory.children
      .filter((category) => {
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
  }, [uniqueCategory, categoryFilter, itemFilter, preferences, selectedTeam]);
  useEffect(() => {
    if (shownCategories.length == 0) {
      setSelectedCategory(undefined);
    } else if (shownCategories.length === 1) {
      setSelectedCategory(shownCategories[0]);
    }
  }, [shownCategories]);

  const table = useMemo(() => {
    if (!uniqueCategory) {
      return <></>;
    }
    if (!selectedCategory) {
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

    return <ItemTable objective={selectedCategory}></ItemTable>;
  }, [selectedCategory, uniqueCategory, shownCategories]);

  if (!uniqueCategory) {
    return <></>;
  }

  const standardUniques: ScoreObjective[] = [];
  const timedUniques: ScoreObjective[] = [];
  const openEndedUniques: ScoreObjective[] = [];
  for (const category of uniqueCategory.children) {
    if (isTimed(category)) {
      timedUniques.push(category);
    } else if (isOpenEnded(category)) {
      openEndedUniques.push(category);
    } else {
      standardUniques.push(category);
    }
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
        setSelectedTeam={setSelectedTeam}
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
        <div className="tabs-box tabs bg-base-100">
          <div className="join rounded-b-none bg-base-100">
            {["Standard", "Timed", "Open Ended"].map((label) => (
              <input
                type="radio"
                name="tab"
                className="btn join-item rounded-b-none border-2 bg-base-300 btn-lg"
                aria-label={label}
              />
            ))}
          </div>
          <CategoryGrid
            categories={standardUniques}
            filtered={shownCategories}
            selectedCategory={selectedCategory}
            selectedTeam={selectedTeam}
            handleCategoryClick={handleCategoryClick}
          />
          <CategoryGrid
            categories={timedUniques}
            filtered={shownCategories}
            selectedCategory={selectedCategory}
            selectedTeam={selectedTeam}
            handleCategoryClick={handleCategoryClick}
          />
          <CategoryGrid
            categories={openEndedUniques}
            filtered={shownCategories}
            selectedCategory={selectedCategory}
            selectedTeam={selectedTeam}
            handleCategoryClick={handleCategoryClick}
          />
        </div>
        <div
          ref={tableRef}
          className="divider divider-primary text-xl font-extrabold"
        >
          {(selectedCategory ? selectedCategory.name : "All") + " Items"}
        </div>
        {table}
      </div>
    </>
  );
}
