/**
 * dedupeImages — guarantee no single photo is shown twice across one site.
 * ======================================================================
 * Each consumer (hero, service cards, gallery, section backgrounds, sub-page
 * headers) picks from the same media pool, so the SAME file used to land in two
 * places (hero photo reused as a service card, an office shot in both the gallery
 * and a header) — a cheap, generator-ish tell. This pass assigns every photo to
 * AT MOST ONE role, in priority order, reassigning or dropping later collisions.
 *
 * The EXCEPTION the rule allows: an element that legitimately repeats — a gallery
 * grid or team/person cards — shows MANY photos. Those are still distinct photos
 * (one per item); we never force a single photo into two cards. Team member
 * photos are a person's identity, so they are left untouched entirely.
 *
 * Pure + browser-safe (structuredClone). Run once per content (memoized) at the
 * top of a composer, before planning/rendering.
 */
import type { SiteContent } from "./types";

/** Priority (highest first): the most prominent slot keeps a contested photo.
 *  hero > service-card images > gallery photos > section backgrounds. Team photos
 *  are exempt (person identity). Logos/badges are not photos and never touched. */
export function dedupeImages(content: SiteContent): SiteContent {
  if (!content) return content;
  const c: SiteContent = structuredClone(content);

  // The scrape often emits the SAME picture under several filenames (a byte-for-byte
  // re-upload, or responsive crops like foo-1920w / foo-300x274). Comparing raw `src`
  // strings would treat those as different photos and let one image land in two roles.
  // So we claim/free by a CONTENT IDENTITY, not the URL: an asset's bytes+dimensions
  // (catches byte-identical re-uploads) plus a conservatively-normalised base name
  // (catches resized variants). Only unambiguous resolution suffixes are stripped —
  // a bare `-1`/`-2` is left intact so distinct photos (team-1 vs team-2) never merge.
  const assetBySrc = new Map((c.media?.assets ?? []).map((a) => [a.src, a]));
  const normName = (src: string): string =>
    (src.split("/").pop() || src)
      .replace(/^[0-9a-f]{6,}__/i, "")        // scraper hash prefix
      .replace(/\.[a-z0-9]+$/i, "")           // extension
      .replace(/-\d+x\d+$/i, "")              // -300x274 crop
      .replace(/-\d+w$/i, "")                 // -1920w width variant
      .replace(/-scaled$/i, "")               // WordPress -scaled
      .replace(/-e\d{6,}$/i, "")              // WordPress edit hash
      .toLowerCase();
  const idsOf = (src: string): string[] => {
    const ids = ["n:" + normName(src)];
    const a = assetBySrc.get(src);
    if (a?.bytes) ids.push(`b:${a.bytes}|${a.width ?? ""}x${a.height ?? ""}`);
    if (a?.phash) ids.push("p:" + a.phash);   // perceptual identity: same picture, different bytes/name
    return ids;
  };

  const usedSrc = new Set<string>();
  const usedId = new Set<string>();
  const claim = (src?: string | null) => {
    if (!src) return;
    usedSrc.add(src);
    for (const id of idsOf(src)) usedId.add(id);
  };
  const free = (src?: string | null): src is string =>
    !!src && !usedSrc.has(src) && !idsOf(src).some((id) => usedId.has(id));

  // 1) Hero keeps its photo; team-member portraits are RESERVED (person identity)
  //    so no other role reuses a face — but the team section itself is never changed.
  claim(c.hero?.image);
  for (const m of c.team?.members ?? []) claim(m.photo);

  // Ordered candidate pool of every reusable photo (not logos/badges/team).
  const pool = [...new Set([
    ...(c.media?.photos ?? []),
    ...(c.media?.sectionBackgrounds ?? []),
    c.media?.hero,
  ].filter(Boolean) as string[])];
  const nextFree = (): string | undefined => pool.find((p) => free(p));

  // 2) Service-card images: keep if still free, else swap to another free photo,
  //    else drop (the card renders without a photo rather than a duplicate).
  for (const it of c.services?.items ?? []) {
    if (!it.image) continue;
    if (free(it.image)) { claim(it.image); continue; }
    const alt = nextFree();
    if (alt) { it.image = alt; claim(alt); } else delete (it as { image?: string }).image;
  }
  // Keep the serviceImages map consistent with the (possibly reassigned) items.
  if (c.media?.serviceImages) {
    const next: Record<string, string> = {};
    for (const it of c.services?.items ?? []) if (it.image) next[it.title] = it.image;
    c.media.serviceImages = next;
  }

  // Person PORTRAITS belong to team cards only — never the gallery, a section
  // background or the feature band. Recognise them by classified `subject`, or
  // (for un-regenerated firms without it) by a portrait aspect ratio.
  const isPortrait = (src: string): boolean => {
    const a = assetBySrc.get(src);
    if (!a) return false;
    return a.subject === "portrait" || (a.subject == null && a.orientation === "portrait");
  };
  const usable = (p: string): boolean => free(p) && !isPortrait(p);

  // 3) Gallery source: claim-as-we-keep so two byte-identical entries in the SAME
  //    array also collapse (not just exact-string repeats); drop anything a
  //    higher-priority role already took, and drop person portraits.
  const keepUnique = (arr?: string[]): string[] =>
    (arr ?? []).filter((p) => { if (usable(p)) { claim(p); return true; } return false; });
  if (c.media) {
    c.media.photos = keepUnique(c.media.photos);
    // 4) Section backgrounds (CTA bands, sub-page headers draw from here): unique, no portraits.
    c.media.sectionBackgrounds = keepUnique(c.media.sectionBackgrounds);
  }

  return c;
}
