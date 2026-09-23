import { rankedPointsToText } from "./ranked-points-text";
import { useContext } from "react";
import { GlobalStateContext } from "@utils/context-provider";
const convertArrayToText = (points: number[]) =>
  rankedPointsToText(points, "The team with the most progress");

const GENERAL_HEADERS = ["+1", "+2", "+3"];
const GENERAL_ROWS = [
  ["Level", "40", "60", "80"],
  ["Lab", "Cruel", "Merciless", "Uber"],
  ["Atlas Nodes", "", "", "40"],
  ["Level", "90", "", ""],
];

const CUSTOM_HEADERS = ["+1", "+2", "+4"];
const CUSTOM_ROWS = [
  ["Armor", "30k", "60k", "150k"],
  ["Evasion", "30k", "60k", "150k"],
  ["Player Level", "", "95", "98"],
  ["Voidstones", "", "", "4"],
  ["magic ilvl 84 flasks", "5", "", ""],
  ["Movement Speed", "150", "200", "250"],
  ["Energy Shield", "9000", "12000", "15000"],
  ["Life", "5500", "6250", "7000"],
  ["Mana", "8000", "11000", "14000"],
  ["DPS", "5 mil", "10 mil", "32 mil"],
  ["eHP", "50k", "150k", "400k"],
  ["Attack Block", "75", "80", "83"],
  ["All Ele Max Res", "84", "90", ""],
  ["Ele max hit", "40k", "80k", "120k"],
  ["Phys max hit", "12k", "16k", "20k"],
];

function ProgressTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className="table w-full border bg-base-100 px-8 py-2">
      <thead>
        <tr>
          <th></th>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, ...cells]) => (
          <tr key={label + cells.join()}>
            <td className="font-bold">{label}</td>
            {cells.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function POPointRules() {
  const { scores } = useContext(GlobalStateContext);
  const objs = scores?.children.find(
    (category) => category.name === "Personal Objectives",
  )?.children;
  if (!objs) {
    return <></>;
  }
  const totalObjective = objs.find(
    (obj) => obj.scoring_rules[0]?.point_cap || 0 > 0,
  );
  const checkPoints = objs.filter((obj) => !obj.scoring_rules[0]?.point_cap);
  return (
    <>
      <h3>Personal Objective Points</h3>
      <p>
        Players can earn personal objective points for their team by progressing
        their character. Each player can earn a maximum of{" "}
        <b className="text-info">9</b> points for a team score maximum of{" "}
        <b className="text-info">
          {totalObjective?.scoring_rules[0]?.point_cap}{" "}
        </b>{" "}
        points per team. These are the challenges that can be completed to earn
        points:
      </p>
      <p>9 Progress Points available from general objectives:</p>
      <ProgressTable headers={GENERAL_HEADERS} rows={GENERAL_ROWS} />
      <p>Up to 8 Progress Points available from custom objectives:</p>

      <ProgressTable headers={CUSTOM_HEADERS} rows={CUSTOM_ROWS} />

      {checkPoints.length > 0 && (
        <>
          <h3>PO Checkpoints</h3>
          <p>
            During the event there will be {checkPoints.length} checkpoints,
            awarding the team that has made the most progress in the specified
            time period with extra points.{" "}
            {convertArrayToText(checkPoints[0].scoring_rules[0]?.points || [])}
          </p>
        </>
      )}
    </>
  );
}
