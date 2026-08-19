import { useContext } from "react";
import { GlobalStateContext } from "@utils/context-provider";
import { ScoringRuleType } from "@api";
import { pointsToGroup } from "@utils/text-utils";
import { ScoreObjective } from "@mytypes/score";

function convertArrayToText(points: number[] | undefined) {
  const groups = pointsToGroup(points || []);
  const textParts = groups.map((group, index) => {
    if (index === 0) {
      return (
        <span>
          The first {group.count} items award{" "}
          <b className="text-info">{group.value}</b> points
        </span>
      );
    } else if (index === groups.length - 1) {
      return (
        <span>
          {" "}
          and the remaining items award{" "}
          <b className="text-info">{group.value}</b> points
        </span>
      );
    } else {
      return (
        <span>
          {" "}
          the next {group.count} items award{" "}
          <b className="text-info">{group.value}</b> points
        </span>
      );
    }
  });
  return textParts;
}

export function UniqueTabRules({ category }: { category: ScoreObjective }) {
  const { currentEvent } = useContext(GlobalStateContext);
  const variantPoints = 3;
  const uniquePoints = 6;

  if (!category) {
    return <></>;
  }

  const wikiBaseUrl =
    currentEvent.game_version === "poe1"
      ? "https://www.poewiki.net/wiki/"
      : "https://www.poe2wiki.net/wiki/";
  const variantExample = category.children
    .flatMap((c) => c.children)
    .find((c) => c.children.length >= 2);

  const ubersCategory = category.children.find((c) =>
    c.scoring_rules.some(
      (rule) =>
        rule.scoring_rule === ScoringRuleType.BONUS_PER_CHILD_COMPLETION,
    ),
  );

  const exampleText = variantExample ? (
    <p>
      For example{" "}
      <a
        className="cursor-pointer text-nowrap text-orange-500 no-underline"
        href={`${wikiBaseUrl}${variantExample.children[0].name.replaceAll(
          " ",
          "_",
        )}`}
        target="_blank"
      >
        {variantExample.children[0].name}
      </a>{" "}
      is a distinct unique item with variants such as{" "}
      <strong className="text-nowrap text-info">
        [{variantExample.children[0].extra}]
      </strong>{" "}
      or{" "}
      <strong className="text-nowrap text-info">
        [{variantExample.children[1].extra}]
      </strong>
      . Collecting both of these would award{" "}
      <b className="text-info">
        {uniquePoints} + 2x{variantPoints} = {uniquePoints + 2 * variantPoints}
      </b>{" "}
      points
    </p>
  ) : null;

  return (
    <>
      <h3>Unique Items</h3>
      <p>
        The teams try to find every unique item listed in the below sets. Every{" "}
        <i className="text-info">distinct</i> unique item found awards{" "}
        <b className="text-info">{uniquePoints}</b> points. Every{" "}
        <i className="text-info">variant</i> of a unique item found awards{" "}
        <b className="text-info"> {variantPoints}</b> points. Variants are items
        with the same name but distinct stats - they do not contribute to the
        set completion after the first.
      </p>
      {exampleText}
      <h3>Unique Sets</h3>
      <p>
        Once a team has found every distinct unique item in a unique set, they
        are considered to have completed the set. They are given points
        depending on the time they completed the set. The first team to complete
        a set is given <b className="text-info">10</b> points, the second team{" "}
        <b className="text-info">5</b> points.
      </p>
      {ubersCategory ? (
        <>
          <h3 className="text-error">Exceptions</h3>
          <p className="text-error">
            One exception to the aforementioned rules is the{" "}
            <i>{ubersCategory?.name}</i> set and it's items. Set completion does
            not grant any additional points and the more uniques that are found,
            the less points they award.{" "}
            {convertArrayToText(
              ubersCategory.scoring_rules[0]?.points?.map(
                (p) => p + uniquePoints,
              ),
            )}
          </p>
        </>
      ) : null}
      <h3 className="">Repeatable Uniques</h3>
      <p>
        At certain points during the event, a group of 5 unique items from
        different sets will be made repeatable.
      </p>
      <p>
        During this time, up to <b className="text-info">50</b> points can be
        earned per unique item. The first 5 copies grant{" "}
        <b className="text-info">4</b> points each and the last 15 copies grant{" "}
        <b className="text-info">2</b> points each.
      </p>
      <p>
        You will be able to submit these in an 8h window after they are
        released.
      </p>
      <h3 className="text-warning">Notes</h3>
      <p className="text-warning">
        Foiled unique items from Voidborn Keys or Valdo maps are not counted.
        Foiled items from Uber Drop Reliquary keys do count, however.
      </p>
      <p className="text-warning">
        Items need to be identified in order to be counted.
      </p>
      {/* <p className="text-warning">
        Once a unique item has been scored it has to remain in the stash tab of
        a team member to ensure that no trading between teams takes place. The
        time of first discovery is used to determine the order of completion, so
        don't worry about trading it to a team lead to hold on to it for you
        after its scored
      </p> */}
    </>
  );
}
