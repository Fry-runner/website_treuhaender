/**
 * Switzerland / DACH content seed (briefing §5, §7, §8, §10).
 * Default copy + trust data the generator drops into the relevant slots.
 */

export interface Certification { name: string; kind: "association" | "standard" | "regulator"; }

/** CH trust currency — display as a logo/badge strip in the `partners` slot. */
export const chCertifications: Certification[] = [
  { name: "TREUHAND|SUISSE", kind: "association" },
  { name: "EXPERTsuisse", kind: "association" },
  { name: "Swiss GAAP FER", kind: "standard" },
  { name: "veb.ch / SwissAccounting", kind: "association" },
  { name: "RAB – zugelassener Revisor", kind: "regulator" },
];

/** Software ecosystem partner badges. */
export const softwarePartners = ["bexio", "Abacus", "KLARA", "AbaNinja", "Sage", "Xero", "Banana"];

/** The recurring CH "why us" four (+optional extras). */
export const whyUsPillars = [
  { title: "100% digital", body: "Belege hochladen, Echtzeit-Zahlen, ortsunabhängig – ohne Papierkram." },
  { title: "Transparente Preise", body: "Klare Pauschalen ab CHF X/Monat. Keine versteckten Kosten." },
  { title: "Persönliche Betreuung", body: "Ein fester Ansprechpartner, der Ihr Geschäft kennt." },
  { title: "Vollständig compliant", body: "OR, Swiss GAAP FER, MWST und nDSG/DSGVO – alles sauber geregelt." },
];

/** Objection-handling FAQ (briefing §3 / §10). */
export const canonicalFaq = [
  { q: "Was macht ein Treuhänder?", a: "Buchhaltung, Steuern, Lohn und Beratung – wir übernehmen den administrativen Teil, damit Sie sich auf Ihr Geschäft konzentrieren können." },
  { q: "Welche Dienstleistungen bieten Sie an?", a: "Finanzbuchhaltung, Jahresabschluss, Steuererklärungen, Lohnadministration, MWST und Unternehmensberatung." },
  { q: "Was kostet das?", a: "Je nach Umfang ab CHF X/Monat. Für eine genaue Offerte nutzen Sie den Rechner oder buchen Sie ein kostenloses Erstgespräch." },
  { q: "Brauche ich einen Vertrag?", a: "Wir arbeiten mit fairen, kündbaren Mandatsvereinbarungen – keine langfristige Bindung nötig." },
  { q: "Ist die Zusammenarbeit wirklich vollständig digital?", a: "Ja. Sie laden Belege online hoch und sehen Ihre Zahlen in Echtzeit – persönliche Beratung inklusive." },
  { q: "Welche Regionen betreuen Sie?", a: "Den ganzen Kanton Zürich und schweizweit – remote oder vor Ort." },
  { q: "Wie ist mein Daten geschützt?", a: "Verschlüsselte Übertragung, Schweizer Hosting und volle nDSG-/DSGVO-Konformität." },
];

/** The trust stack to layer across the page (§5), most→least aggregate. */
export const trustStack = [
  "Aggregate rating (Google 5★ + review count) — in hero and repeated",
  "Named testimonials (person · company · city · case-study link)",
  "Quantified scale ('1000+ KMU', '92% recommend', years in business)",
  "Professional credentials (Treuhand Suisse, Expert Suisse, Swiss GAAP FER, RAB)",
  "Real people (faces, names, qualifications)",
  "Compliance visibility (nDSG + DSGVO, secure document upload)",
  "Locality (Swiss address, +41 phone, office map, canton coverage)",
];

/** Default CH language set; DE/EN minimum, FR/IT for serious firms (§7). */
export const defaultLanguages = ["de", "en", "fr", "it"] as const;

/** Definition of done — usable as a generator/QA checklist (§10). */
export const definitionOfDone = [
  "Hero leads with a client benefit + 2 CTAs + a trust signal",
  "One persistent primary CTA ('Termin buchen') across the page",
  "Services as cards; transparent pricing where the model allows",
  "4-6 why-us pillars (digital · transparent · personal · compliant)",
  "Named testimonials (person·company·city) + an aggregate metric/rating",
  "Professional credentials / partner badges visible",
  "Audience or industry segmentation",
  "Focused FAQ (5-8, objection-handling)",
  "Team with real faces",
  "Contact: form + office info + map; booking as primary path",
  "Multi-column footer with legal (Impressum/Datenschutz), social, © year",
  "DE/EN (+FR/IT) language switch",
  "nDSG + DSGVO compliance, cookie consent",
  "One accent colour, generous whitespace, clean sans-serif, consistent corner/elevation lane",
  "<2s load, AVIF/WebP, fully responsive, accessible contrast",
  "Optional signature interaction (calculator / quiz / simulator) for the 'wow'",
];
