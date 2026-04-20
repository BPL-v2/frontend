export type GemSocket = (typeof GemSocket)[keyof typeof GemSocket];

export const GemSocket = {
  W: "W",
} as const;
