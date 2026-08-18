import { ScoreObjective } from "@mytypes/score";
import { BountyTabRules } from "./bounties";
import { RaceTabRules } from "./races";
import { JSX } from "react";
import React from "react";
import { CollectionTabRules } from "./collections";
import { DailyTabRules } from "./dailies";
import { AtlasRaceTabRules } from "./atlas-race";
import { getPointRules } from "@utils/rules";

type RuleProps = {
  category: ScoreObjective;
};

const ruleMap: Record<
  string,
  (props: { category: ScoreObjective }) => JSX.Element
> = {
  Bounties: BountyTabRules,
  Races: RaceTabRules,
  "Atlas Race": AtlasRaceTabRules,
  Collections: CollectionTabRules,
  Dailies: DailyTabRules,
};

export function GenericRule({ category }: RuleProps) {
  if (ruleMap[category.name]) {
    return (
      <div className="my-4 w-full rounded-box bg-base-200 p-8">
        <article className="prose max-w-4xl text-left">
          {React.createElement(ruleMap[category.name], { category })}
        </article>
      </div>
    );
  }
  return (
    <div className="my-4 w-full rounded-box bg-base-200 p-8">
      <article className="prose max-w-4xl text-left">
        <h2>Points</h2>
        {category?.children.map((objective) => getPointRules(objective))}
      </article>
    </div>
  );
}
