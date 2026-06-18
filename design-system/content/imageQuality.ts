/**
 * imageQuality — the PURE technical-quality math, shared by the extractor
 * (scoreQuality + pickHeroImage) and the calibration audit. No I/O, no `sharp`:
 * callers gather the raw pixel stats (via sharp.stats) and pass them in, so the
 * scoring is deterministic and testable in isolation. One source of truth for the
 * weights/thresholds means the audit can never drift from production.
 */
export interface QualityMetrics {
  entropy: number;   // greyscale entropy 0..8 — detail (flat graphics score low)
  sharpRank: number; // 0..1 sharpness percentile WITHIN the firm's pool (scale is version-dependent)
  contrast: number;  // mean channel stdev (~0..127) — washed-out vs punchy
  mean: number;      // mean brightness 0..255 — over-/under-exposed
  opaque: boolean;   // false ⇒ has alpha ⇒ probably a graphic, not a photo
  bpp: number;       // bytes per pixel of the final file — over-compressed/upscaled
}

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Percentile rank of a value within an ascending-sorted sample (0..1). */
export function rankIn(sortedAsc: number[], v: number): number {
  if (Number.isNaN(v) || sortedAsc.length < 2) return 0.5; // no usable signal → neutral
  return sortedAsc.filter((x) => x < v).length / (sortedAsc.length - 1);
}

/** Composite 0..1 quality. Weighted blend of normalised sub-metrics, then hard
 *  caps for the three "definitely not a good website photo" cases. */
export function compositeQuality(m: QualityMetrics): number {
  const nEntropy = clamp01((m.entropy - 3) / 2);          // <3 flat · >5 rich detail
  const nContrast = clamp01((m.contrast - 25) / 45);      // <25 flat · >70 punchy
  const nExposure = m.mean < 30 || m.mean > 228 ? 0 : clamp01(Math.min(m.mean - 30, 228 - m.mean) / 40);
  const nBpp = clamp01((m.bpp - 0.4) / 1.2);              // very low ⇒ over-compressed / upscaled
  let q = 0.34 * m.sharpRank + 0.24 * nEntropy + 0.16 * nContrast + 0.12 * nExposure + 0.14 * nBpp;
  if (m.entropy < 2.6) q = Math.min(q, 0.2);              // near-blank / flat graphic
  if (!m.opaque) q = Math.min(q, 0.25);                   // transparency on a "photo"
  if (m.mean < 30 || m.mean > 232 || m.contrast < 14) q = Math.min(q, 0.25); // broken exposure
  return Math.round(clamp01(q) * 100) / 100;
}

/** Role floors the score must clear for the most visible slots (gallery has none).
 *  Single source so extractor + audit agree on what "hero-worthy" means. */
export const QUALITY_FLOOR = { hero: 0.5, feature: 0.5, background: 0.35, service: 0.4 } as const;
