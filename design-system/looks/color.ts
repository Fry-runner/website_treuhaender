/**
 * color.ts — dependency-free colour maths shared by brand extraction (Node) and
 * look derivation (browser). Keep this free of node:* imports so it can be
 * bundled by Vite as well as run under node --experimental-strip-types.
 */
function norm3(hex: string): string {
  return ("#" + hex.slice(1).split("").map((c) => c + c).join("")).toUpperCase();
}
export function normHex(s: string): string | undefined {
  const m = s.trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return undefined;
  return m[1].length === 3 ? norm3("#" + m[1]) : ("#" + m[1]).toUpperCase();
}
export function rgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function hex2(n: number): string { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"); }
export function toHex(r: number, g: number, b: number): string {
  return ("#" + hex2(r) + hex2(g) + hex2(b)).toUpperCase();
}
function srgb(c: number) { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }
export function luminance(hex: string): number {
  const [r, g, b] = rgb(hex);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}
export function contrast(a: string, b: string): number {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
export function saturation(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => c / 255) as [number, number, number];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  return mx === 0 ? 0 : (mx - mn) / mx;
}
export function hue(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => c / 255) as [number, number, number];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return 0;
  let h: number;
  if (mx === r) h = ((g - b) / d) % 6;
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60; return h < 0 ? h + 360 : h;
}
/** A near-grey, near-white or near-black colour — never a brand accent. */
export function isNeutral(hex: string): boolean {
  const [r, g, b] = rgb(hex);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  const sat = mx === 0 ? 0 : (mx - mn) / mx;
  return sat < 0.18 || mx < 26 || mn > 232;
}

export function toHsl(hex: string): [number, number, number] {
  const [r, g, b] = rgb(hex).map((c) => c / 255) as [number, number, number];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (mx === r) h = ((g - b) / d) % 6;
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
export function fromHsl(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return toHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
/** Linear blend of two hexes; t=0 → a, t=1 → b. */
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = rgb(a), [br, bg, bb] = rgb(b);
  return toHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}
/** Darken (or lighten) a colour until it meets a minimum contrast vs `bg`. */
export function ensureContrast(hex: string, bg: string, min: number): string {
  let [h, s, l] = toHsl(hex);
  const bgLight = luminance(bg) > 0.5;
  let out = hex, guard = 0;
  while (contrast(out, bg) < min && guard++ < 40) {
    l += bgLight ? -0.025 : 0.025;
    if (l <= 0.04 || l >= 0.97) break;
    out = fromHsl(h, s, l);
  }
  return out;
}
