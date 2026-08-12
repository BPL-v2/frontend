import { Permission } from "@api";
import { useGetEvents } from "@api";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { renderConditionally } from "@utils/token";

const fieldGuide = [
  {
    field: "name",
    label: "Objective name",
    meaning: "A short title players will understand at a glance.",
  },
  {
    field: "objective_type",
    label: "Objective kind",
    meaning:
      "What this objective checks: item, player, team, submission, stash tab, or category progress.",
  },
  {
    field: "conditions",
    label: "Match rules",
    meaning: "The filters that decide whether an item matches this objective.",
  },
  {
    field: "required_number",
    label: "Target amount",
    meaning: "The number needed to finish this objective.",
  },
  {
    field: "tracked_value",
    label: "What to track",
    meaning:
      "Which numeric value is measured once something matches. The form filters the available options by objective kind.",
  },
  {
    field: "tracked_value_explanation",
    label: "Tracking note",
    meaning:
      "Optional and only relevant for submission objectives that track values. Will display as a note next to the tracked value input on the submission form to give context on the number.",
  },
  {
    field: "counting_method",
    label: "How it counts",
    meaning:
      "If there are multiple valid matches, this decides which result counts for the team.",
  },
  {
    field: "scoring_rule_ids / scoring_rules",
    label: "How it gives points",
    meaning:
      "The scoring rules applied after the counted result is calculated.",
  },
  {
    field: "valid_from",
    label: "Start time",
    meaning:
      "Optional start of the scoring window. Mainly important for time-window-based counting.",
  },
  {
    field: "valid_to",
    label: "End time",
    meaning:
      "Optional end of the scoring window. Mainly important for time-window-based counting.",
  },
  {
    field: "hide_progress",
    label: "Hide progress from other teams",
    meaning:
      "Use this when progress should be scored normally but not shown to other teams during the event.",
  },
  {
    field: "children",
    label: "Child objectives",
    meaning:
      "Used for category-style objectives that derive their result from child objectives.",
  },
  {
    field: "extra",
    label: "Extra",
    meaning:
      "Can be used to give additional info for an objective. Is also abused to store meta information for certain objective types that doesn't fit anywhere else.",
  },
];

const objectiveTypes = [
  [
    "ITEM",
    "Item objective",
    "Tracks items that match the configured conditions.",
  ],
  [
    "STASH_TAB",
    "Stash tab objective",
    "Tracks values derived from stash tab state rather than a single item.",
  ],
  [
    "PLAYER",
    "Player objective",
    "Tracks a value from an individual player or character state.",
  ],
  [
    "TEAM",
    "Team objective",
    "Tracks a team-level result built from player or team state.",
  ],
  [
    "SUBMISSION",
    "Submission objective",
    "Scores a manually submitted numeric value.",
  ],
  [
    "CATEGORY",
    "Category objective",
    "A parent objective whose result comes from child objectives rather than direct matching.",
  ],
];

const countingMethods = [
  [
    "LATEST_VALUE",
    "Latest value",
    "Use the most recent recorded value for the team.",
  ],
  [
    "FIRST_COMPLETION",
    "First completion",
    "The first team to fully finish wins. Unfinished teams still keep their best progress for ranking.",
  ],
  [
    "FIRST_FRESH_COMPLETION",
    "First fresh completion",
    "Like first completion, but only counts results from the latest fresh stash state.",
  ],
  [
    "HIGHEST_VALUE",
    "Highest value reached",
    "The team's best recorded value counts.",
  ],
  [
    "LOWEST_VALUE",
    "Lowest value reached",
    "The team's lowest recorded value counts.",
  ],
  [
    "VALUE_CHANGE_IN_WINDOW",
    "Progress made during time window",
    "Counts how much the value changed between the configured start and end times.",
  ],
  [
    "CHILD_RESULT",
    "Calculated from child objectives",
    "Use this for category-style parents whose result comes from child objectives.",
  ],
];

const scoringRules = [
  [
    "FIXED_POINTS_ON_COMPLETION",
    "Fixed points on completion",
    "Awards a fixed amount of points once the objective is finished.",
  ],
  [
    "POINTS_BY_VALUE",
    "Points by value",
    "Converts the counted numeric result directly into points.",
  ],
  [
    "RANK_BY_COMPLETION_TIME",
    "Rank by completion time",
    "Finished teams are ranked by who completed first.",
  ],
  [
    "RANK_BY_HIGHEST_VALUE",
    "Rank by highest value",
    "Teams are ranked by highest counted value.",
  ],
  [
    "RANK_BY_LOWEST_VALUE",
    "Rank by lowest value",
    "Teams are ranked by lowest counted value.",
  ],
  [
    "RANK_BY_CHILD_COMPLETION_TIME",
    "Rank by child completion time",
    "Teams are ranked by when they reached the required amount of completed child objectives.",
  ],
  [
    "BONUS_PER_CHILD_COMPLETION",
    "Bonus per child completion",
    "Awards points for each completed child objective.",
  ],
  [
    "BINGO_BOARD_RANKING",
    "Bingo board ranking",
    "Ranks teams by who completes the required number of bingo lines first.",
  ],
  [
    "RANK_BY_CHILD_VALUE_SUM",
    "Rank by child value sum",
    "Ranks teams by the sum of child objective values.",
  ],
];

const examples = [
  {
    title: "Simple item objective",
    summary:
      "Find out which team collects 200 Chaos Orbs first and give them a variable amount of points based on their ranking.",
    fields: [
      ["Objective name", "Collect 200 Chaos Orbs"],
      ["Objective kind", "ITEM"],
      ["What to track", "Stack size"],
      ["Match rules", 'Base type equals "Chaos Orb"'],
      ["Target amount", "200"],
      ["How it counts", "FIRST_COMPLETION"],
      ["How it gives points", "RANK_BY_COMPLETION_TIME"],
    ],
  },
  {
    title: "Daily",
    summary: "Collect a Mageblood. All teams get the same points",
    fields: [
      ["Objective name", "Collect Mageblood"],
      ["Objective kind", "ITEM"],
      ["What to track", "Stack size"],
      ["Match rules", 'Item Name equals "Mageblood"'],
      ["Target amount", "1"],
      ["How it counts", "FIRST_COMPLETION"],
      ["How it gives points", "FIXED_POINTS_ON_COMPLETION"],
      ["Starting time", "2024-12-20T00:00:00Z"],
      ["End time", "2024-12-21T00:00:00Z"],
    ],
  },
  {
    title: "Submission objective",
    summary:
      "Teams submit their highest reached Ritual Altar blood counts and get 1 point per 100 blood.",
    fields: [
      ["Objective name", "Ritual Altar blood count"],
      ["Objective kind", "SUBMISSION_OBJECTIVE"],
      ["What to track", "Submitted value"],
      ["Tracking note", "Highest blood count"],
      ["Target amount", "1"],
      ["How it counts", "HIGHEST_VALUE"],
      ["How it gives points", "POINTS_BY_VALUE"],
    ],
  },
  {
    title: "Category objective",
    summary:
      "Collect all Elder items. The teams get points on completion based on how fast they finish.",
    fields: [
      ["Objective name", "Collect all Elder items"],
      ["Objective kind", "CATEGORY"],
      ["What to track", "/"],
      ["How it counts", "CHILD_RESULT"],
      ["How it gives points", "Bonus per child completion"],
      [
        "Child objectives",
        "Add the underlying atlas goals under this category",
      ],
    ],
  },
];

export const Route = createFileRoute("/admin/events/$eventId/objective-help")({
  component: renderConditionally(RouteComponent, [
    Permission.admin,
    Permission.objective_designer,
    Permission.manager,
  ]),
  params: {
    parse: (params) => ({
      eventId: Number(params.eventId),
    }),
    stringify: (params) => ({
      eventId: params.eventId.toString(),
    }),
  },
});

function HelpTable({
  title,
  headings,
  rows,
}: {
  title: string;
  headings: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-box bg-base-300 p-4">
      <h2 className="mb-4 text-left text-xl font-semibold">{title}</h2>
      <table className="table table-zebra">
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RouteComponent() {
  const { eventId } = useParams({ from: Route.id });
  const { events } = useGetEvents();
  const event = events?.find((candidate) => candidate.id === eventId);

  return (
    <div className="mt-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Link
          to="/admin/events/$eventId/objectives"
          params={{ eventId }}
          className="btn btn-primary"
        >
          Open Objective Authoring
        </Link>
        <Link
          to="/admin/events/$eventId/scoring-rules"
          params={{ eventId }}
          className="btn btn-info"
        >
          Open Scoring Rules
        </Link>
      </div>

      <article className="prose max-w-none rounded-box bg-base-300 p-6 text-left">
        <h1>{`Objective help${event ? ` for "${event.name}"` : ""}`}</h1>
        <p>
          Objectives are the building blocks of your event scoring. Each
          objective defines <strong>what counts</strong>,{" "}
          <strong>what value to measure</strong>,{" "}
          <strong>when a team is finished</strong>, and{" "}
          <strong>how that result turns into points</strong>.
        </p>

        <h2>How to create a new objective</h2>
        <ol>
          <li>Choose the objective kind based on what you want to measure.</li>
          <li>
            Pick <strong>What to track</strong>. The form filters this list
            based on the selected objective kind. For Items we can track stack
            size, for players things like character level or delve depth.
          </li>
          <li>
            Set the target amount the team needs to reach to mark the objective
            as completed.
          </li>
          <li>
            Choose <strong>How it counts</strong> to decide which team result is
            kept when there are multiple matches. For example if we want to
            figure out which team found the first Mageblood drop and still owns
            that item, we can use the counting method "First fresh completion".
          </li>
          <li>
            Attach one or more scoring rules to decide how the result becomes
            points or ranking.
          </li>
          <li>
            Add optional timing, visibility, or advanced settings only when the
            objective actually needs them.
          </li>
        </ol>
      </article>

      <div className="overflow-x-auto rounded-box bg-base-300 p-4">
        <h2 className="mb-4 text-left text-xl font-semibold">Field guide</h2>
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>UI label</th>
              <th>API field</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {fieldGuide.map((field) => (
              <tr key={field.field}>
                <td>{field.label}</td>
                <td>
                  <code>{field.field}</code>
                </td>
                <td>{field.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <HelpTable
        title="Objective kinds"
        headings={["Enum value", "Label", "Description"]}
        rows={objectiveTypes}
      />

      <HelpTable
        title="Counting methods"
        headings={["Enum value", "Label", "Description"]}
        rows={countingMethods}
      />

      <HelpTable
        title="Scoring rules"
        headings={["Enum value", "Label", "Description"]}
        rows={scoringRules}
      />
      <div>
        <h1 className="mb-4 text-left text-3xl font-semibold">Examples</h1>

        <div className="grid gap-4 lg:grid-cols-2">
          {examples.map((example) => (
            <div
              key={example.title}
              className="rounded-box bg-base-300 p-4 text-left"
            >
              <h2 className="mb-1 text-xl font-semibold">{example.title}</h2>
              <p className="mb-4 text-sm text-base-content/70">
                {example.summary}
              </p>
              <div className="overflow-x-auto">
                <table className="table border-2 table-zebra table-sm">
                  <tbody>
                    {example.fields.map(([label, value]) => (
                      <tr key={label}>
                        <th className="w-40">{label}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
