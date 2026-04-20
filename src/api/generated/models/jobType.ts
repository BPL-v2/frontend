
export type JobType = typeof JobType[keyof typeof JobType];


export const JobType = {
  FetchStashChanges: 'FetchStashChanges',
  EvaluateStashChanges: 'EvaluateStashChanges',
  FetchCharacterData: 'FetchCharacterData',
  FetchGuildStashes: 'FetchGuildStashes',
} as const;
