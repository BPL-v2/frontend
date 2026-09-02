export const REALMS = [
  "NA East",
  "NA West",
  "EU East",
  "EU West",
  "AU",
  "BR",
  "SG",
  "SA",
  "Canada",
];

// Grouped by region: North America in blue, Europe in red, with a distinct
// hue per remaining single-realm region.
export const REALM_COLORS: Record<string, string> = {
  "NA East": "text-blue-400",
  "NA West": "text-blue-600",
  Canada: "text-blue-800",
  "EU East": "text-red-400",
  "EU West": "text-red-600",
  AU: "text-green-500",
  BR: "text-yellow-500",
  SG: "text-purple-500",
  SA: "text-orange-500",
};
