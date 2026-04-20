
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];


export const ApplicationStatus = {
  applied: 'applied',
  accepted: 'accepted',
  waitlisted: 'waitlisted',
  none: 'none',
} as const;
