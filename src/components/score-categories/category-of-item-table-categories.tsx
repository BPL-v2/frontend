import { ScoreObjective } from "@mytypes/score";
import { isItemTableCategory } from "@components/score-categories/generic-score-category";
import { CategoryGrid } from "../../routes/scores/uniques";
import { ItemTable } from "@components/table/item-table";
import { useMemo } from "react";

interface ScoreCategoryProps extends React.HTMLAttributes<HTMLSpanElement> {
  category: ScoreObjective;
  selectedCategories: Set<number>;
  selectedTeam?: number;
  handleCategoryClick: (objective: ScoreObjective) => void;
}

export function CategoryOfItemTableCategories({
  category,
  selectedCategories,
  handleCategoryClick,
  selectedTeam,
  ...props
}: ScoreCategoryProps) {
  const itemTableCategoryChildren =
    category?.children.filter(isItemTableCategory) || [];

  const table = useMemo(() => {
    const cat = { ...category, children: [] } as ScoreObjective;
    for (const child of itemTableCategoryChildren) {
      if (selectedCategories.size > 0 && !selectedCategories.has(child.id)) {
        continue;
      }
      for (const grandChild of child.children) {
        cat.children.push(grandChild);
      }
    }
    return <ItemTable objective={cat} />;
  }, [itemTableCategoryChildren, category]);

  return (
    <div className="flex flex-col gap-4" {...props}>
      <CategoryGrid
        categories={itemTableCategoryChildren}
        selectedCategories={selectedCategories}
        handleCategoryClick={handleCategoryClick}
        selectedTeam={selectedTeam}
      />
      {table}
    </div>
  );
}
