/**
 * Generic, true-for-any-Treuhänder defaults for the "safe generic" sections
 * (process, audience). These are neutral and non-fabricated — no invented social
 * proof — so they can render on any firm without a scrape source. The composer
 * passes them like it builds the gallery content inline. Later these can be moved
 * into SiteContent + extract.ts to become scrape-driven.
 */
import type { ProcessContent, AudienceContent, AboutContent, FeatureContent } from "./sectionContent";

export const defaultProcess = (): ProcessContent => ({
  eyebrow: "Ablauf",
  heading: "So arbeiten wir",
  steps: [
    { title: "Kennenlernen", body: "Kostenloses Erstgespräch: Wir klären Ihre Situation, Ihre Ziele und den passenden Leistungsumfang." },
    { title: "Unterlagen & Einrichtung", body: "Sie übergeben uns Ihre Belege digital oder physisch; wir richten Buchhaltung und Zugänge ein." },
    { title: "Laufende Betreuung", body: "Buchhaltung, Abschlüsse und Steuern erledigen wir termingerecht — mit einem festen Ansprechpartner." },
    { title: "Reporting & Beratung", body: "Sie erhalten verständliche Auswertungen und proaktive Empfehlungen für Ihre Entscheidungen." },
  ],
});

export const defaultAudience = (): AudienceContent => ({
  eyebrow: "Für wen",
  heading: "Für wen wir arbeiten",
  items: [
    { title: "KMU & Unternehmen", body: "Von der Gründung bis zum Wachstum: Buchhaltung, Löhne und Abschlüsse aus einer Hand." },
    { title: "Selbständige & Freiberufler", body: "Schlanke Lösungen für Einzelfirmen — damit Sie sich aufs Kerngeschäft konzentrieren können." },
    { title: "Privatpersonen", body: "Steuererklärung, Vorsorge und persönliche Finanzfragen — klar erklärt und diskret behandelt." },
    { title: "Vereine & Stiftungen", body: "Ordentliche Rechnungslegung und Revision für gemeinnützige Organisationen." },
  ],
});

export const defaultAbout = (): AboutContent => ({
  eyebrow: "Über uns",
  heading: "Ihr verlässlicher Partner für Treuhand & Beratung",
  lead: "Wir verbinden persönliche Beratung mit digitalen, effizienten Prozessen — damit Sie sich auf Ihr Kerngeschäft konzentrieren können.",
  paragraphs: [
    "Als Treuhandpartner begleiten wir Sie in Buchhaltung, Steuern, Lohn und Abschluss — vorausschauend, termingerecht und mit einem festen Ansprechpartner.",
    "Wir denken mit: klare Auswertungen, proaktive Hinweise und Lösungen, die zu Ihrer Situation passen — vom ersten Beleg bis zur strategischen Entscheidung.",
  ],
  // No fabricated figures → highlights stays undefined; highlight-aware variants degrade gracefully.
});

/** Generic, non-fabricated feature-band angles (true for any Treuhänder — no
 *  invented figures). The composer rotates through these so a page with several
 *  image bands doesn't repeat the same copy. */
const FEATURE_VARIANTS: Omit<FeatureContent, "image">[] = [
  {
    eyebrow: "Warum wir",
    heading: "Persönliche Beratung, digital gedacht",
    body: "Wir verbinden den persönlichen Draht eines lokalen Treuhänders mit effizienten, digitalen Abläufen — für klare Zahlen, weniger Aufwand und Entscheidungen auf Basis aktueller Daten.",
    bullets: ["Fester Ansprechpartner statt Callcenter", "Digitale Belegerfassung & Echtzeit-Auswertungen", "Transparente Pauschalen ohne versteckte Kosten"],
    cta: { label: "Termin vereinbaren" },
  },
  {
    eyebrow: "Ihr Vorteil",
    heading: "Klare Zahlen, bessere Entscheidungen",
    body: "Statt einmal im Jahr eine Überraschung: laufend aktuelle, verständlich aufbereitete Auswertungen — damit Sie unternehmerische Entscheidungen auf gesicherter Basis treffen.",
    bullets: ["Aktuelle Auswertungen statt Jahresend-Überraschung", "Kennzahlen verständlich erklärt", "Proaktive Hinweise zu Steuern & Liquidität"],
    cta: { label: "Beratung anfragen" },
  },
  {
    eyebrow: "Arbeitsweise",
    heading: "Lokal verankert, effizient organisiert",
    body: "Ein fester Ansprechpartner vor Ort, schlanke digitale Prozesse und sichere Schweizer Datenhaltung — Treuhand, die zu Ihrem Tempo passt.",
    bullets: ["Treuhänder vor Ort, persönlich erreichbar", "Schlanke, digitale Abläufe", "Sichere Datenhaltung in der Schweiz"],
    cta: { label: "Kennenlernen" },
  },
  {
    eyebrow: "Fokus",
    heading: "Mehr Zeit fürs Wesentliche",
    body: "Buchhaltung, Löhne und Fristen übernehmen wir — zuverlässig und termingerecht. So gewinnen Sie den Kopf frei für Ihr Kerngeschäft.",
    bullets: ["Buchhaltung & Lohn vollständig ausgelagert", "Fristen und Abgaben im Griff", "Ein Ansprechpartner für alle Belange"],
    cta: { label: "Termin vereinbaren" },
  },
];

/** Image-forward feature band. The image is supplied by the composer from the
 *  firm's media pool (real photo, else CC stock) — never invented. `variant`
 *  rotates the copy so repeated bands on one page don't read identically. */
export const defaultFeature = (image: string, variant = 0): FeatureContent => ({
  ...FEATURE_VARIANTS[((variant % FEATURE_VARIANTS.length) + FEATURE_VARIANTS.length) % FEATURE_VARIANTS.length],
  image,
});

/** Inject the always-on safe-generic slots (audience, process) into a homepage
 *  sequence when a PRECOMPUTED brief predates them — idempotent (skips if already
 *  present). Mirrors how the composer injects the media gallery. */
export function withGenericSlots(slots: string[]): string[] {
  const s = [...slots];
  if (!s.includes("audience")) { const at = s.indexOf("services"); s.splice(at >= 0 ? at + 1 : 0, 0, "audience"); }
  if (!s.includes("process")) { const at = s.indexOf("faq"); s.splice(at >= 0 ? at : (s.includes("cta") ? s.indexOf("cta") : s.length), 0, "process"); }
  return s;
}

/** Inject ONE image-forward feature band mid-page (after values, else services,
 *  else before cta). Idempotent. The caller only calls this when a usable image
 *  exists — so images appear "where sensible", not on every section. */
export function injectFeature(slots: string[]): string[] {
  if (slots.includes("feature")) return slots;
  const s = [...slots];
  const at = (s.indexOf("values") + 1) || (s.indexOf("services") + 1) || (s.includes("cta") ? s.indexOf("cta") : s.length);
  s.splice(at, 0, "feature");
  return s;
}

/** Image rhythm: never let more than `maxGap` image-less CONTENT sections sit in a
 *  row — after that many, insert an image-forward "feature" band so a page always
 *  comes back to a picture. `isImage(slot)` reports whether a slot renders a photo;
 *  nav/footer are chrome and don't count. No-op when no feature image is available
 *  (`hasImage` false) — the caller supplies a real-photo-else-stock pool. */
export function enforceImageRhythm(order: string[], isImage: (slot: string) => boolean, hasImage: boolean, maxGap = 2): string[] {
  if (!hasImage) return order;
  const out: string[] = [];
  let gap = 0;
  for (const slot of order) {
    if (slot === "nav" || slot === "footer") { out.push(slot); continue; }
    if (isImage(slot)) { out.push(slot); gap = 0; continue; }
    if (gap >= maxGap) { out.push("feature"); gap = 0; }
    out.push(slot);
    gap += 1;
  }
  return out;
}
