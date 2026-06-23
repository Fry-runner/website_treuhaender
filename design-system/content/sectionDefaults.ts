/**
 * Generic, true-for-any-Treuhänder defaults for the "safe generic" sections
 * (process, audience). These are neutral and non-fabricated — no invented social
 * proof — so they can render on any firm without a scrape source. The composer
 * passes them like it builds the gallery content inline. Later these can be moved
 * into SiteContent + extract.ts to become scrape-driven.
 */
import type { ProcessContent, AudienceContent, AboutContent, FeatureContent } from "./sectionContent";

/** Non-fabricated "how we work" copy, in a few angles so the firms that fall back to
 *  the generic default don't all read identically. All variants are true for any
 *  Treuhänder (no invented claims). Picked per firm by `defaultProcess(variant)`. */
const PROCESS_VARIANTS: ProcessContent[] = [
  {
    eyebrow: "Ablauf",
    heading: "So arbeiten wir",
    steps: [
      { title: "Kennenlernen", body: "Kostenloses Erstgespräch: Wir klären Ihre Situation, Ihre Ziele und den passenden Leistungsumfang." },
      { title: "Unterlagen & Einrichtung", body: "Sie übergeben uns Ihre Belege digital oder physisch; wir richten Buchhaltung und Zugänge ein." },
      { title: "Laufende Betreuung", body: "Buchhaltung, Abschlüsse und Steuern erledigen wir termingerecht — mit einem festen Ansprechpartner." },
      { title: "Reporting & Beratung", body: "Sie erhalten verständliche Auswertungen und proaktive Empfehlungen für Ihre Entscheidungen." },
    ],
  },
  {
    eyebrow: "Ablauf",
    heading: "In vier Schritten zu klaren Zahlen",
    steps: [
      { title: "Erstgespräch", body: "Wir hören zu, verstehen Ihr Geschäft und zeigen ehrlich, wo wir den grössten Nutzen stiften." },
      { title: "Übernahme", body: "Wir übernehmen Ihre Unterlagen und richten saubere, digitale Abläufe ein — ohne Reibungsverlust." },
      { title: "Betreuung", body: "Fristen, Buchhaltung und Abschluss laufen zuverlässig — Sie haben jederzeit einen festen Ansprechpartner." },
      { title: "Mitdenken", body: "Wir melden uns proaktiv, wenn sich Chancen oder Handlungsbedarf bei Steuern und Liquidität zeigen." },
    ],
  },
  {
    eyebrow: "Ablauf",
    heading: "Ihr Weg zu uns",
    steps: [
      { title: "Termin vereinbaren", body: "Unverbindlich und kostenlos: Wir besprechen Ihren Bedarf und den passenden Umfang." },
      { title: "Onboarding", body: "Digitale Belegerfassung, Zugänge und Verantwortlichkeiten werden sauber aufgesetzt." },
      { title: "Im Tagesgeschäft", body: "Buchhaltung, Lohn und Steuern erledigen wir termingerecht und nachvollziehbar." },
      { title: "Vorausschauend", body: "Verständliche Auswertungen und rechtzeitige Hinweise für Ihre Entscheidungen." },
    ],
  },
];

export const defaultProcess = (variant = 0): ProcessContent =>
  PROCESS_VARIANTS[((variant % PROCESS_VARIANTS.length) + PROCESS_VARIANTS.length) % PROCESS_VARIANTS.length];

/** Non-fabricated "who we work for" copy, in a few angles (same rationale as
 *  PROCESS_VARIANTS). The four Treuhand segments are stable; the framing rotates. */
const AUDIENCE_VARIANTS: AudienceContent[] = [
  {
    eyebrow: "Für wen",
    heading: "Für wen wir arbeiten",
    items: [
      { title: "KMU & Unternehmen", body: "Von der Gründung bis zum Wachstum: Buchhaltung, Löhne und Abschlüsse aus einer Hand." },
      { title: "Selbständige & Freiberufler", body: "Schlanke Lösungen für Einzelfirmen — damit Sie sich aufs Kerngeschäft konzentrieren können." },
      { title: "Privatpersonen", body: "Steuererklärung, Vorsorge und persönliche Finanzfragen — klar erklärt und diskret behandelt." },
      { title: "Vereine & Stiftungen", body: "Ordentliche Rechnungslegung und Revision für gemeinnützige Organisationen." },
    ],
  },
  {
    eyebrow: "Für wen",
    heading: "Wen wir begleiten",
    items: [
      { title: "Kleine & mittlere Unternehmen", body: "Verlässliche Buchhaltung, Löhne und Jahresabschluss — damit der Betrieb läuft." },
      { title: "Einzelfirmen & Startups", body: "Pragmatische Unterstützung von der Gründung bis zur ersten Bilanz." },
      { title: "Privatpersonen", body: "Steuererklärung und persönliche Finanzthemen — diskret und verständlich." },
      { title: "Vereine & Stiftungen", body: "Saubere Rechnungslegung und Revision für gemeinnützige Organisationen." },
    ],
  },
  {
    eyebrow: "Für wen",
    heading: "Wir sind für Sie da",
    items: [
      { title: "Unternehmen & KMU", body: "Ein Partner für Buchhaltung, Lohn, Steuern und Abschluss — vorausschauend betreut." },
      { title: "Selbständige", body: "Damit Sie sich aufs Kerngeschäft konzentrieren — wir kümmern uns um die Zahlen." },
      { title: "Privatpersonen", body: "Steuern, Vorsorge und Finanzfragen — klar erklärt, sorgfältig erledigt." },
      { title: "Vereine & Stiftungen", body: "Ordentliche Rechnungslegung und Revision, auf gemeinnützige Strukturen zugeschnitten." },
    ],
  },
];

export const defaultAudience = (variant = 0): AudienceContent =>
  AUDIENCE_VARIANTS[((variant % AUDIENCE_VARIANTS.length) + AUDIENCE_VARIANTS.length) % AUDIENCE_VARIANTS.length];

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
    eyebrow: "Unser Ansatz",
    heading: "Persönliche Beratung, digital gedacht",
    body: "Wir verbinden den persönlichen Draht eines lokalen Treuhänders mit effizienten, digitalen Abläufen — für klare Zahlen, weniger Aufwand und Entscheidungen auf Basis aktueller Daten.",
    bullets: ["Fester Ansprechpartner statt Callcenter", "Digitale Belegerfassung & Echtzeit-Auswertungen", "Transparente Pauschalen ohne versteckte Kosten"],
    cta: { label: "Termin vereinbaren" },
  },
  {
    eyebrow: "Klartext",
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

/** Feature band = one copy "angle" + an image. Prefers the firm's REAL angles
 *  (distilled from scraped values/services in extract.ts); falls back to the
 *  generic, non-fabricated FEATURE_VARIANTS when the scrape yielded none. */
export const featureBand = (image: string, variant = 0, angles?: Omit<FeatureContent, "image">[]): FeatureContent => {
  const pool = angles && angles.length ? angles : FEATURE_VARIANTS;
  const i = ((variant % pool.length) + pool.length) % pool.length;
  return { ...pool[i], image };
};

/** Inject the always-on safe-generic slots (audience, process) into a homepage
 *  sequence when a PRECOMPUTED brief predates them — idempotent (skips if already
 *  present). Mirrors how the composer injects the media gallery. */
export function withGenericSlots(slots: string[]): string[] {
  const s = [...slots];
  if (!s.includes("audience")) { const at = s.indexOf("services"); s.splice(at >= 0 ? at + 1 : 0, 0, "audience"); }
  if (!s.includes("process")) { const at = s.indexOf("faq"); s.splice(at >= 0 ? at : (s.includes("cta") ? s.indexOf("cta") : s.length), 0, "process"); }
  return s;
}

// (injectFeature removed together with the legacy single-page SiteComposer — the
//  production SiteRouter inserts no generic feature band; it PROMOTES an existing
//  section to a photo variant instead.)

// (enforceImageRhythm removed — the SiteRouter now achieves image rhythm by PROMOTING
//  an existing necessary section to a photo variant, not by inserting a generic feature
//  band. See SiteRouter's promoteTo / homeSceneAt.)
