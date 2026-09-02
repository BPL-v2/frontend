function parseHex(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

function toHex(v: number, m: number): string {
  return Math.round((v + m) * 255)
    .toString(16)
    .padStart(2, "0");
}

function toHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0,
    s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h / 6;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  const hi = Math.floor(h * 6);
  if (hi === 0) [r, g, b] = [c, x, 0];
  else if (hi === 1) [r, g, b] = [x, c, 0];
  else if (hi === 2) [r, g, b] = [0, c, x];
  else if (hi === 3) [r, g, b] = [0, x, c];
  else if (hi === 4) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [r + m, g + m, b + m];
}

function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l);
  return `#${toHex(r, 0)}${toHex(g, 0)}${toHex(b, 0)}`;
}

function wcagLuminance(r: number, g: number, b: number): number {
  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// Binary search for the HSL L that yields the target WCAG luminance.
function hslLForWcagLuminance(h: number, s: number, target: number): number {
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    const [r, g, b] = hslToRgb(h, s, mid);
    if (wcagLuminance(r, g, b) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// 3:1 contrast against #0e141f (L≈0.014) and #e4e8f0 (L≈0.821)
const MIN_WCAG = 0.142;
const MAX_WCAG = 0.24;

/**
 * Normalizes a team color so it has ≥3:1 contrast as text on both dark
 * (#0e141f) and light (#e4e8f0) backgrounds. Hue and saturation are preserved.
 * Returns the original value unchanged if already in range or if it is the
 * "no color" sentinel (#000000).
 */
export function normalizeTeamColor(hex: string): string {
  if (!hex || hex === "#000000") return hex;
  const [r, g, b] = parseHex(hex);
  const lum = wcagLuminance(r, g, b);
  if (lum >= MIN_WCAG && lum <= MAX_WCAG) return hex;
  const { h, s } = toHsl(r, g, b);
  const target = lum < MIN_WCAG ? MIN_WCAG : MAX_WCAG;
  return hslToHex(h, s, hslLForWcagLuminance(h, s, target));
}

/** Returns white or black, whichever has higher WCAG contrast against `hex`. */
export function contrastColor(hex: string): string {
  const [r, g, b] = parseHex(hex);
  return wcagLuminance(r, g, b) > 0.179 ? "#000000" : "#ffffff";
}

// Hex values for the specific Tailwind `text-{color}-{shade}` classes used
// as per-option colors (ascendancies, altars, realms, skill gems), so those
// same classes can also be used as real fill colors in SVG charts.
const TAILWIND_HEX_BY_CLASS: Record<string, string> = {
  "text-blue-400": "#60a5fa",
  "text-blue-500": "#3b82f6",
  "text-blue-600": "#2563eb",
  "text-blue-800": "#1e40af",
  "text-red-300": "#fca5a5",
  "text-red-400": "#f87171",
  "text-red-500": "#ef4444",
  "text-red-600": "#dc2626",
  "text-green-300": "#86efac",
  "text-green-400": "#4ade80",
  "text-green-500": "#22c55e",
  "text-green-600": "#16a34a",
  "text-green-700": "#15803d",
  "text-cyan-300": "#67e8f9",
  "text-cyan-400": "#22d3ee",
  "text-cyan-500": "#06b6d4",
  "text-cyan-600": "#0891b2",
  "text-cyan-700": "#0e7490",
  "text-orange-300": "#fdba74",
  "text-orange-400": "#fb923c",
  "text-orange-500": "#f97316",
  "text-orange-600": "#ea580c",
  "text-orange-700": "#c2410c",
  "text-purple-300": "#d8b4fe",
  "text-purple-400": "#c084fc",
  "text-purple-500": "#a855f7",
  "text-purple-600": "#9333ea",
  "text-yellow-300": "#fde047",
  "text-yellow-400": "#facc15",
  "text-yellow-500": "#eab308",
  "text-yellow-600": "#ca8a04",
  "text-yellow-700": "#a16207",
  "text-amber-300": "#fcd34d",
  "text-amber-400": "#fbbf24",
  "text-amber-500": "#f59e0b",
  "text-amber-600": "#d97706",
  "text-amber-700": "#b45309",
  "text-fuchsia-500": "#d946ef",
  "text-indigo-300": "#a5b4fc",
  "text-indigo-400": "#818cf8",
  "text-indigo-500": "#6366f1",
  "text-indigo-600": "#4f46e5",
  "text-rose-300": "#fda4af",
  "text-rose-400": "#fb7185",
  "text-rose-500": "#f43f5e",
  "text-rose-600": "#e11d48",
  "text-rose-700": "#be123c",
  "text-gray-300": "#d1d5db",
  "text-gray-400": "#9ca3af",
  "text-gray-500": "#6b7280",
  "text-slate-400": "#94a3b8",
  "text-stone-500": "#78716c",
  "text-teal-500": "#14b8a6",
  "text-pink-500": "#ec4899",
  "text-white": "#ffffff",
  "text-highlight-content": "#9ca3af",
};

/** Resolves one of our `text-{color}-{shade}` option-color classes to a hex
 * value, for use as an SVG fill (e.g. chart slices) instead of a CSS class. */
export function classColorToHex(className?: string): string | undefined {
  return className ? TAILWIND_HEX_BY_CLASS[className] : undefined;
}

// Gates a picker's color behind its "colorful X" preference toggle, so every
// picker's `color: enabled ? SOME_COLORS[key] : undefined` collapses to
// `color: pickColor(enabled, SOME_COLORS[key])`.
export function pickColor(
  enabled: boolean,
  color: string | undefined,
): string | undefined {
  return enabled ? color : undefined;
}
