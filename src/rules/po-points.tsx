import { JSX, useContext } from "react";
import { GlobalStateContext } from "@utils/context-provider";
function convertArrayToText(points: number[]): JSX.Element[] {
  const textParts = points.map((point, index) => {
    if (index === 0) {
      return (
        <span key={index}>
          The team with the most progress will be awarded{" "}
          <b className="text-info">{point}</b> points
        </span>
      );
    } else if (index === points.length - 1) {
      return (
        <span key={index}>
          {" "}
          and the remaining teams <b className="text-info">{point}</b> points
        </span>
      );
    } else {
      return (
        <span key={index}>
          {" "}
          the next team will get <b className="text-info">{point}</b> points
        </span>
      );
    }
  });
  return textParts;
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
    (obj) => obj.scoring_presets[0]?.point_cap || 0 > 0,
  );
  const checkPoints = objs.filter((obj) => !obj.scoring_presets[0]?.point_cap);
  return (
    <>
      <h3>Personal Objective Points</h3>
      <p>
        Players can earn personal objective points for their team by progressing
        their character. Each player can earn a maximum of{" "}
        <b className="text-info">9</b> points for a team score maximum of{" "}
        <b className="text-info">
          {totalObjective?.scoring_presets[0]?.point_cap}{" "}
        </b>{" "}
        points per team. These are the challenges that can be completed to earn
        points:
      </p>
      <p>9 Progress Points available from general objectives:</p>
      <table className="table w-full border bg-base-100 px-8 py-2">
        <thead>
          <tr>
            <th></th>
            <th>+1</th>
            <th>+2</th>
            <th>+3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-bold">Level</td>
            <td>40</td>
            <td>60</td>
            <td>80</td>
          </tr>
          <tr>
            <td className="font-bold">Lab</td>
            <td>Cruel</td>
            <td>Merciless</td>
            <td>Uber</td>
          </tr>
          <tr>
            <td className="font-bold">Atlas Nodes</td>
            <td></td>
            <td></td>
            <td>40 </td>
          </tr>
          <tr>
            <td className="font-bold">Level</td>
            <td>90</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <p>Up to 8 Progress Points available from custom objectives:</p>

      <table className="table w-full border bg-base-100 px-8 py-2">
        <thead>
          <tr>
            <th></th>
            <th>+1</th>
            <th>+2</th>
            <th>+4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-bold">Armor</td>
            <td>30k</td>
            <td>60k</td>
            <td>150k</td>
          </tr>
          <tr>
            <td className="font-bold">Evasion</td>
            <td>30k</td>
            <td>60k</td>
            <td>150k</td>
          </tr>
          <tr>
            <td className="font-bold">Player Level</td>
            <td></td>
            <td>95</td>
            <td>98</td>
          </tr>
          <tr>
            <td className="font-bold">Voidstones</td>
            <td></td>
            <td></td>
            <td>4</td>
          </tr>
          <tr>
            <td className="font-bold">magic ilvl 84 flasks</td>
            <td>5</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td className="font-bold">Movement Speed</td>
            <td>150</td>
            <td>200</td>
            <td>250</td>
          </tr>
          <tr>
            <td className="font-bold">Energy Shield</td>
            <td>9000</td>
            <td>12000</td>
            <td>15000</td>
          </tr>
          <tr>
            <td className="font-bold">Life</td>
            <td>5500</td>
            <td>6250</td>
            <td>7000</td>
          </tr>
          <tr>
            <td className="font-bold">Mana</td>
            <td>8000</td>
            <td>11000</td>
            <td>14000</td>
          </tr>
          <tr>
            <td className="font-bold">DPS</td>
            <td>5 mil</td>
            <td>10 mil</td>
            <td>32 mil</td>
          </tr>
          <tr>
            <td className="font-bold">eHP</td>
            <td>50k</td>
            <td>150k</td>
            <td>400k</td>
          </tr>
          <tr>
            <td className="font-bold">Attack Block</td>
            <td>75</td>
            <td>80</td>
            <td>83</td>
          </tr>
          <tr>
            <td className="font-bold">All Ele Max Res</td>
            <td>84</td>
            <td>90</td>
            <td></td>
          </tr>
          <tr>
            <td className="font-bold">Ele max hit</td>
            <td>40k</td>
            <td>80k</td>
            <td>120k</td>
          </tr>
          <tr>
            <td className="font-bold">Phys max hit</td>
            <td>12k</td>
            <td>16k</td>
            <td>20k</td>
          </tr>
        </tbody>
      </table>

      {checkPoints.length > 0 && (
        <>
          <h3>PO Checkpoints</h3>
          <p>
            During the event there will be {checkPoints.length} checkpoints,
            awarding the team that has made the most progress in the specified
            time period with extra points.{" "}
            {convertArrayToText(
              checkPoints[0].scoring_presets[0]?.points || [],
            )}
          </p>
        </>
      )}
    </>
  );
}
