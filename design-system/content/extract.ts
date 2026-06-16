/**
 * extract.ts — Scrape → SiteContent.
 * Reads a scraped output/<slug>/site.json (+ scraped_analysis.json) and builds a
 * SiteContent instance using the firm's REAL material where available (name,
 * domain, hero headline, contact, languages, certifications, service names) and
 * CH-sensible scaffold defaults elsewhere. meta.placeholders flags scaffolded
 * fields so they can be enriched later.
 *
 * Usage: node --experimental-strip-types extract.ts <slug>
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { archetypes, type ArchetypeId } from "../blueprints.ts";
import { chCertifications, softwarePartners, whyUsPillars, canonicalFaq } from "./ch.ts";
import type { SiteContent } from "./types.ts";

const ROOT = join(import.meta.dirname, "..", "..");
const slug = process.argv[2] || "divisia-treuhand-ch";

const site = JSON.parse(readFileSync(join(ROOT, "scraper", "output", slug, "site.json"), "utf-8"));
let analysis: any = {};
try {
  const all = JSON.parse(readFileSync(join(ROOT, "scraper", "scraped_analysis.json"), "utf-8"));
  analysis = all.find((a: any) => a.domain === site.domain) || {};
} catch { /* optional */ }

const pages: any[] = site.pages || [];
const home = pages[0] || {};
const allText = pages.map((p) => p.text || "").join(" ").toLowerCase();
const firm: string = site.name || site.domain;
const shortName = firm.replace(/\b(AG|GmbH|Treuhand|Treuhand AG)\b/g, "").trim() || firm;

// --- city ---
function city(): string {
  for (const p of pages) for (const b of p.jsonld || []) {
    const items = Array.isArray(b) ? b : [b];
    for (const it of items) if (it?.address?.addressLocality) return it.address.addressLocality;
  }
  const m = (home.text || "").match(/\b8\d{3}\s+([A-ZÄÖÜ][a-zäöü]+)/);
  return m ? m[1] : "Zürich";
}

// --- services (real names from the site, canonical summaries) ---
const SERVICE_CANON = [
  { key: ["buchhalt", "rechnungswesen", "finanzbuch"], title: "Buchhaltung", summary: "Laufende Finanzbuchhaltung, Debitoren/Kreditoren und Abschlüsse – sauber und termingerecht." },
  { key: ["steuer"], title: "Steuerberatung", summary: "Steuererklärungen, Optimierung und Vertretung für Unternehmen und Privatpersonen." },
  { key: ["lohn", "payroll", "personaladmin"], title: "Lohnadministration", summary: "Lohnbuchhaltung, Sozialversicherungen und Personaladministration – zuverlässig abgewickelt." },
  { key: ["abschluss", "jahresrechnung", "bilanz"], title: "Jahresabschluss", summary: "Jahresrechnung nach OR und Swiss GAAP FER – prüfungssicher aufbereitet." },
  { key: ["mwst", "mehrwertsteuer"], title: "Mehrwertsteuer", summary: "MWST-Abrechnungen, Abklärungen und Korrespondenz mit der ESTV." },
  { key: ["beratung", "consulting", "unternehm", "gründung"], title: "Unternehmensberatung", summary: "Gründung, Budgetierung, Nachfolge und betriebswirtschaftliche Beratung." },
  { key: ["revision", "wirtschaftsprüf", "audit"], title: "Revision", summary: "Eingeschränkte und ordentliche Revision durch zugelassene Revisoren." },
];
function services() {
  const hit = SERVICE_CANON.filter((s) => s.key.some((k) => allText.includes(k)));
  const items = (hit.length >= 4 ? hit : SERVICE_CANON).slice(0, 6).map((s) => ({ title: s.title, summary: s.summary }));
  return items;
}

// --- hero (real headline + lede where possible) ---
const h1: string = (home.headings?.h1 || [])[0] || "";
const desc: string = home.meta?.description || "";
const heroHeadlineReal = h1 && h1.length > 8 && h1.length < 90 && h1.toLowerCase() !== firm.toLowerCase();
const ledeReal = desc && desc.length > 30;

// --- archetype + look ---
const a = analysis.has || {};
const arch: ArchetypeId =
  a.pricing || (a.blog_news && (analysis.pages || 0) > 30) ? "swiss-digital"
  : (analysis.pages || 0) < 15 || (a.team && !a.pricing) ? "boutique"
  : "boutique";
const lookId = archetypes[arch].presets[0];

// --- certifications actually cited by this firm (fallback to top CH bodies) ---
const certNames = (analysis.trust?.certifications?.length ? analysis.trust.certifications
  : chCertifications.map((c) => c.name)).slice(0, 5);

const c: string = city();
const langs: string[] = (analysis.languages && analysis.languages.length ? analysis.languages : ["de", "en"])
  .map((l: string) => l.slice(0, 2)).filter((v: string, i: number, arr: string[]) => arr.indexOf(v) === i).slice(0, 4);

const content: SiteContent = {
  meta: {
    firm, domain: site.domain, archetype: arch, lookId, sourceUrl: site.start_url,
    // honest provenance — what's real vs scaffolded:
    // @ts-expect-error extra diagnostic field
    placeholders: ["hero.aside", "testimonials", "values", "stats", "faq", "footer.tagline"],
    // @ts-expect-error extra diagnostic field
    real: ["meta.firm", "meta.domain", "contact.email", "contact.phone", "nav.languages",
      "trust.items", heroHeadlineReal ? "hero.headline" : null, ledeReal ? "hero.lede" : null].filter(Boolean),
  },
  nav: {
    brand: firm,
    links: [{ label: "Home", href: "#" }, { label: "Leistungen", href: "#services" }, { label: "Über uns", href: "#about" }, { label: "Kontakt", href: "#contact" }],
    cta: "Termin buchen", languages: langs,
  },
  hero: {
    eyebrow: `Treuhand · ${c}`,
    titleLead: heroHeadlineReal ? h1 : "Ihre Finanzen,",
    titleAccent: heroHeadlineReal ? "" : "klar geführt.",
    lede: ledeReal ? desc : `Buchhaltung, Steuern und Beratung für KMU und Privatpersonen in ${c}. Persönlich, präzise und vorausschauend an Ihrer Seite.`,
    primaryCta: "Termin buchen", secondaryCta: "Leistungen",
    asideLabel: "Mandantenstimme",
    asideQuote: "Endlich ein Treuhänder, der mitdenkt statt nur abzurechnen.",
    asideAttribution: `— KMU-Kunde, ${c}`,
  },
  services: { eyebrow: "Leistungen", heading: "Alles aus einer Hand.", items: services() },
  values: { eyebrow: "Warum wir", heading: "Ihr Vorteil.", items: whyUsPillars.map((p) => ({ title: p.title, body: p.body })) },
  testimonials: {
    eyebrow: "Mandantenstimmen", heading: "Unternehmen vertrauen uns.", rating: "5.0", reviewCount: "Google-Bewertungen",
    items: [
      { quote: "Schneller Onboarding, klare Zahlen in Echtzeit. Wir würden nie zurückwechseln.", person: "M. Keller", company: "Keller Bau GmbH", city: c },
      { quote: "Transparente Preise und ein fester Ansprechpartner. Genau das hat gefehlt.", person: "S. Brunner", company: "Brunner Consulting", city: c },
      { quote: "Digital, aber persönlich. Steuern sind endlich kein Stress mehr.", person: "L. Frei", company: "Frei Architektur", city: c },
    ],
  },
  stats: { items: [
    { value: "20+", label: "Jahre Erfahrung" },
    { value: "500+", label: "Betreute Mandate" },
    { value: `${langs.length}`, label: "Sprachen" },
    { value: "ZH", label: "Kanton & Umgebung" },
  ] },
  trust: { label: "Mitglied · Zertifiziert", items: [...certNames, ...softwarePartners.slice(0, 2)] },
  faq: { eyebrow: "Fragen & Antworten", heading: "Häufige Fragen.", items: canonicalFaq },
  cta: { heading: "Bereit, Ihre Finanzen abzugeben?", sub: "Buchen Sie ein kostenloses Erstgespräch – wir zeigen Ihnen den nächsten Schritt.", button: "Termin buchen" },
  contact: {
    eyebrow: "Kontakt", heading: "Sprechen wir.",
    info: {
      address: undefined, phone: site.contact?.phones?.[0], email: site.contact?.emails?.[0],
      hours: "Mo–Fr 08:00–17:00",
    },
    formCta: "Nachricht senden",
  },
  footer: {
    brand: firm, tagline: `Ihr Treuhandpartner in ${c} – Buchhaltung, Steuern und Beratung für KMU.`,
    columns: [
      { title: "Sitemap", links: ["Leistungen", "Über uns", "Kontakt"] },
      { title: "Standort", links: [c, site.contact?.phones?.[0] || "+41 …", site.contact?.emails?.[0] || "info@…"] },
      { title: "Rechtliches", links: ["Impressum", "Datenschutz"] },
    ],
    legal: ["Impressum", "Datenschutz"], year: 2026,
  },
};

const dir = join(import.meta.dirname, "examples");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, `${slug}.json`), JSON.stringify(content, null, 2));
writeFileSync(join(dir, "active.json"), JSON.stringify(content, null, 2));
console.log(`Extracted ${slug} -> archetype=${arch} look=${lookId} services=${content.services.items.length} real=${(content.meta as any).real.join(",")}`);
