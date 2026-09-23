import {
  Objective,
  Score,
  ScoringRuleType,
  CountingMethod,
} from "@api/generated/models";

// fallow-ignore-file unused-class-member
export class ScoreClass {
  score: Score;
  constructor(score: Score) {
    this.score = score;
  }

  totalPoints(): number {
    if (!this.score) {
      return 0;
    }
    let points = this.score.bonus_points;
    for (const completion of this.score.completions) {
      points += completion.points;
    }
    return points;
  }

  number(): number {
    if (!this.score) {
      return 0;
    }
    return this.score.completions[0]?.number || 0;
  }

  maxNumber(): number {
    if (!this.score) {
      return 0;
    }
    let max = 0;
    for (const completion of this.score.completions) {
      if (completion.number > max) {
        max = completion.number;
      }
    }
    return max;
  }

  isFinished(): boolean {
    if (!this.score) {
      return false;
    }
    return this.score.completions.every((completion) => completion.finished);
  }

  rank(): number {
    if (!this.score || this.score.completions.length === 0) {
      return 0;
    }
    return this.score.completions[0]?.rank || 0;
  }

  userId(): number | undefined {
    if (!this.score || this.score.completions.length === 0) {
      return;
    }
    for (const completion of this.score.completions) {
      if (completion.user_id) {
        return completion.user_id;
      }
    }
  }

  lastTimestamp(): number {
    let timestamp = 0;
    for (const completion of this.score?.completions || []) {
      if (completion.timestamp > timestamp) {
        timestamp = completion.timestamp;
      }
    }
    return timestamp;
  }
}

export type TeamScore = { [teamId: number]: ScoreClass };

export type ScoreObjective = Omit<Objective, "children"> & {
  team_score: TeamScore;
  children: ScoreObjective[];
};

export function isWinnable(category: ScoreObjective): boolean {
  if (
    category.scoring_rules.some(
      (preset) => preset.scoring_rule === "BONUS_PER_CHILD_COMPLETION",
    ) ||
    category.children.length === 0
  ) {
    return false;
  }
  for (const teamId in category.team_score) {
    if (category.team_score[teamId].isFinished()) {
      return false;
    }
  }
  return true;
}

export function hasEnded(objective: ScoreObjective, teamId?: number): boolean {
  if (!teamId) {
    return false;
  }
  if (
    objective.scoring_rules.some(
      (preset) => preset.scoring_rule === "BONUS_PER_CHILD_COMPLETION",
    )
  ) {
    const finishedObjectives = objective.children.filter((objective) =>
      objective.team_score[teamId].isFinished(),
    ).length;
    return finishedObjectives === objective.children.length;
  }
  for (const child of objective.children) {
    if (!child.team_score[teamId].isFinished()) {
      return false;
    }
  }
  return true;
}

export function canBeFinished(objective: ScoreObjective): boolean {
  return (
    objective.scoring_rules[0]?.scoring_rule !==
      ScoringRuleType.RANK_BY_CHILD_VALUE_SUM ||
    !objective.children.some(
      (child) => child.counting_method === CountingMethod.HIGHEST_VALUE,
    )
  );
}
