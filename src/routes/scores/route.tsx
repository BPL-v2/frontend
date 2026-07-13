import { GameVersion } from "@api";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { BountyTabRules } from "@rules/bounties";
import { CollectionTabRules } from "@rules/collections";
import { DailyTabRules } from "@rules/dailies";
import { DelveTabRules } from "@rules/delve";
import { GemTabRules } from "@rules/gems";
import { HeistTabRules } from "@rules/heist";
import { RaceTabRules } from "@rules/races";
import { UniqueTabRules } from "@rules/uniques";
import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { GlobalStateContext } from "@utils/context-provider";
import { usePageSEO } from "@utils/use-seo";
import { JSX, useContext, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { router } from "../../main";
import { useGetRules } from "@api";
import { AscendancyChallengeTabRules } from "../../rules-alt/ascendancy-challenges";

type scoringTabKey =
  | "ladder"
  | "for-you"
  | "progress"
  | "uniques"
  | "races"
  | "bounties"
  | "ascendancy-challenges"
  | "collections"
  | "dailies"
  | "heist"
  | "gems"
  | "scarabs"
  | "delve"
  | "bingo";

const blackListedRoutes = ["Personal Objectives"];

type ScoreQueryParams = {
  rules: boolean;
};

export const Route = createFileRoute("/scores")({
  component: ScoringPage,
  validateSearch: (search: Record<string, boolean>): ScoreQueryParams => {
    return {
      rules: search.rules,
    };
  },
});

function ScoringPage() {
  usePageSEO("scores");
  const { currentEvent } = useContext(GlobalStateContext);
  const { rules: categories } = useGetRules(currentEvent.id);
  const { rules } = Route.useSearch();

  const selected = useRouterState({
    select: (state) => state.location.pathname.split("/").slice(-1)[0],
  });
  useEffect(() => {
    if (selected === "scores") {
      router.navigate({
        to: "/scores/ladder",
        search: {
          rules: rules,
        },
        replace: true,
      });
    }
  }, [rules, selected]);

  const scoringTabs: {
    key: scoringTabKey;
    name: string;
    visible: boolean;
    rules?: JSX.Element;
    shortName?: string;
  }[] = useMemo(() => {
    return [
      {
        name: "Ladder",
        key: "ladder",
        visible: true,
      },
      {
        name: "For You",
        key: "for-you",
        visible: true,
      },
      {
        name: "Progress",
        key: "progress",
        visible: true,
      },
      {
        name: "Uniques",
        key: "uniques",
        rules: <UniqueTabRules />,
        visible: true,
      },
      {
        name: "Races",
        key: "races",
        rules: <RaceTabRules />,
        visible: true,
      },
      {
        name: "Bounties",
        key: "bounties",
        rules: <BountyTabRules />,
        visible: true,
      },
      {
        name: "Ascendancy Challenges",
        key: "ascendancy-challenges",
        shortName: "Asc. Challenges",
        rules: <AscendancyChallengeTabRules />,
        visible: true,
      },
      {
        name: "Collections",
        key: "collections",
        rules: <CollectionTabRules />,
        visible: true,
      },
      {
        name: "Dailies",
        key: "dailies",
        rules: <DailyTabRules />,
        visible: true,
      },
      {
        name: "Heist",
        key: "heist",
        rules: <HeistTabRules />,
        visible: currentEvent.game_version === GameVersion.poe1,
      },
      {
        name: "Gems",
        key: "gems",
        rules: <GemTabRules />,
        visible: currentEvent.game_version === GameVersion.poe1,
      },
      {
        name: "Scarabs",
        key: "scarabs",
        rules: <GemTabRules />,
        visible: currentEvent.game_version === GameVersion.poe1,
      },
      {
        name: "Delve",
        key: "delve",
        rules: <DelveTabRules />,
        visible: currentEvent.game_version === GameVersion.poe1,
      },
      {
        name: "Bingo",
        key: "bingo",
        rules: <></>,
        visible: true,
      },
    ];
  }, [currentEvent]);
  const ulRef = useRef<HTMLUListElement>(null);
  const [forceScroll, setForceScroll] = useState(false);
  useEffect(() => {
    const ul = ulRef.current;
    if (!ul) return;
    const container = ul.parentElement!;
    const check = () => {
      const prev = ul.style.flexWrap;
      ul.style.flexWrap = "wrap";
      const firstItem = ul.firstElementChild as HTMLElement | null;
      const rowH = firstItem ? firstItem.getBoundingClientRect().height : 44;
      const wrappedH = ul.scrollHeight;
      ul.style.flexWrap = prev;
      setForceScroll(wrappedH > rowH * 2 + 4);
    };
    const ro = new ResizeObserver(check);
    ro.observe(container);
    check();
    return () => ro.disconnect();
  }, []);

  const tabs: {
    key: scoringTabKey;
    name: string;
    visible: boolean;
    rules?: JSX.Element;
    shortName?: string;
  }[] = [
    {
      name: "Ladder",
      key: "ladder",
      visible: true,
    },
    {
      name: "For You",
      key: "for-you",
      visible: true,
    },
    {
      name: "Progress",
      key: "progress",
      visible: true,
    },
    ...scoringTabs.filter(
      (tab) =>
        tab.visible && categories?.children?.find((c) => c.name === tab.name),
    ),
    ...(categories?.children
      .filter(
        (c) =>
          !scoringTabs.find((tab) => tab.name === c.name) &&
          !blackListedRoutes.includes(c.name),
      )
      .map((c) => ({
        name: c.name,
        key: c.name.toLowerCase().replace(/\s/g, "-") as scoringTabKey,
        visible: true,
      })) || []),
  ];
  return (
    <>
      <div className="sticky top-13 z-40 border-b border-base-content/8 bg-base-100/80 backdrop-blur-md">
        <div className="flex items-center">
          <div className={forceScroll ? "flex-1 overflow-x-auto" : "flex-1"}>
            <ul ref={ulRef} className={forceScroll ? "flex items-end" : "flex flex-wrap items-end"}>
              {tabs.map((tab) => (
                <li key={tab.key}>
                  <Link
                    to={`/scores/${tab.key}`}
                    search={{ rules: rules }}
                    className="inline-block border-b-2 border-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-150"
                    activeProps={{
                      className: "border-primary text-primary",
                    }}
                    inactiveProps={{
                      className:
                        "text-base-content/75 hover:text-base-content",
                    }}
                  >
                    {tab.shortName || tab.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="shrink-0 px-3">
            <Link
              to={"/scores/" + selected}
              className={twMerge(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150",
                rules
                  ? "bg-primary/8 text-primary"
                  : "text-base-content/65 hover:text-base-content",
              )}
              search={{ rules: !rules }}
            >
              <BookOpenIcon className="size-4" />
              <span className="hidden md:block text-base-content/85">
                {rules ? "Hide" : "Show"} Rules
              </span>
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
