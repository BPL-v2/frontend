
export type Permission = typeof Permission[keyof typeof Permission];


export const Permission = {
  admin: 'admin',
  manager: 'manager',
  objective_designer: 'objective_designer',
  submission_judge: 'submission_judge',
} as const;
