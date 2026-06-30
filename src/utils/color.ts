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

function perceivedLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
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
const MAX_WCAG = 0.240;

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

/** Returns a readable text color (same hue/saturation) to place ON TOP of `hex` background. */
export function contrastColor(hex: string): string {
  const [r, g, b] = parseHex(hex);
  const { h, s } = toHsl(r, g, b);
  const newL = perceivedLuminance(r, g, b) > 0.5 ? 0.15 : 0.9;
  return hslToHex(h, s, newL);
}
