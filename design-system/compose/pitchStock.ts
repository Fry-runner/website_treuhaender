/**
 * Pitch-mode stock picker. In cold-acquisition mode every scraped photo is swapped
 * for a licensed stock image (served from /stock/<topic>/<file> by the serve-stock
 * Vite plugin). Picks are DETERMINISTIC per firm+slot, so a firm always gets the
 * same set and consecutive slots get distinct images.
 */
import manifest from "./stockManifest.json";

const M = manifest as Record<string, string[]>;

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0);
}

const filesFor = (topics: string[]): string[] => topics.flatMap((t) => (M[t] ?? []).map((f) => `/stock/${t}/${f}`));

/** Up to `n` DISTINCT stock URLs from the given topics, keyed by firm+slot. */
export function stockPick(topics: string[], key: string, n = 1, seed = 0): string[] {
  const pool = filesFor(topics);
  if (!pool.length) return [];
  const base = hash(key) + (seed | 0);
  const out: string[] = [];
  for (let i = 0; i < Math.min(n, pool.length); i++) out.push(pool[(base + i) % pool.length]);
  return out;
}

/** Topic groups by slot purpose (hero = wide/impressive, scene = office/people,
 *  work = accounting-activity, wide = full-bleed backgrounds). */
export const STOCK_TOPICS = {
  hero: ["city", "architecture", "office", "skyline", "reception", "boardroom"],
  scene: ["office", "desk", "meeting", "consultation", "advisory", "boardroom", "reception", "documents", "laptop"],
  work: ["desk", "documents", "laptop", "finance", "meeting", "advisory", "office"],
  wide: ["city", "architecture", "office", "landscape", "skyline"],
};
