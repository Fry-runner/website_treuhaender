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
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { type ArchetypeId } from "../blueprints.ts";
import { whyUsPillars, canonicalFaq } from "./ch.ts";
import type { SiteContent, MediaLibrary, MediaAsset, MediaKind, Orientation, ImageSubject, ImageRole, DocAsset, DocKind } from "./types.ts";
import type { ProcessContent, AudienceContent, AboutContent, StepItem, AudienceItem, FeatureContent, HistoryContent, HistoryEntry } from "./sectionContent.ts";
import { imageSize } from "./imageSize.ts";
import { extractBrand } from "./brand.ts";
import { deriveLook, fontsToLoad } from "../looks/deriveLook.ts";
import { normHex, toHex, isNeutral, saturation, luminance } from "../looks/color.ts";
import { decideStructure } from "./plan.ts";
import { compositeQuality, rankIn, QUALITY_FLOOR } from "./imageQuality.ts";

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

// --- LANGUAGE GATE: a German example site must read 100% German. Foreign-language
//     pages (fr/it/en/rm — the page's <html lang>) are dropped so French/Italian copy
//     never leaks into the generated site; pages with no/unknown lang are kept and
//     vetted per-block by looksFrench below. (Images aren't language-bound, so the
//     media pipeline keeps using the full `pages`/manifest.)
// Per-block language markers (also used by the page-level gate just below). A block is
// French when it carries ≥3 unambiguous French markers and more of them than German
// ones (ambiguous tokens shared with German are excluded to avoid false positives).
const FR_MARK = /\b(nous|vous|votre|vos|notre|nos|avec|pour|sans|leurs?|ainsi|gestion|comptab(?:le|ilité|ilites?)|fiscale?|fiscaux|fiduciaire|entreprises?|sociétés?|conseils?|clients?|déclarations?|impôts?|salaires?|prestations?|gr[âa]ce|cette|aux|notamment|afin|être|c'est|qu'|d'|l'|n')\b/gi;
const DE_MARK = /\b(und|der|die|das|wir|sie|ihre?|für|mit|von|den|ein|eine|ist|sind|auch|bei|aus|über|unsere?|treuhand|buchhaltung|steuern?|beratung|unternehmen|abschluss|löhne?|jahres|sowie|werden|sich|nicht)\b/gi;
const looksFrench = (t: string): boolean => { if (!t || t.length < 20) return false; const fr = (t.match(FR_MARK) || []).length; const de = (t.match(DE_MARK) || []).length; return fr >= 3 && fr > de; };
// English gate (mirrors looksFrench): a block is English when it carries ≥3 English
// FUNCTION words — none of which exist in German, so loanwords ("Service", "Online")
// never trip it — and more of them than German markers. Catches an English SEO page
// (monere) whose lang attribute slipped past the de-only filter.
const EN_MARK = /\b(the|your|our|we|for|with|from|by|this|that|will|can|are|you|its|their|how|what|when|which|payroll|accounting|business(?:es)?|compan(?:y|ies)|solutions?|services?|advice|expert|individuals?|trusted|professional|personalized|reliable|seamless|efficient|simplify)\b/gi;
const looksEnglish = (t: string): boolean => { if (!t || t.length < 20) return false; const en = (t.match(EN_MARK) || []).length; const de = (t.match(DE_MARK) || []).length; return en >= 3 && en > de; };
// Keep a page when its lang is de/empty. A non-de lang (fr/it/rm) is trusted and the
// page dropped — EXCEPT a bare "en", which CH sites routinely mis-tag onto German
// pages (stmtreuhand's German /buchhaltung.html carries <html lang="en">): there we
// keep the page only when its TEXT actually reads German, so real German service copy
// is no longer thrown away while a genuinely English page still drops out.
const langDe = (p: any): boolean => {
  const l = String(p?.lang || "").toLowerCase().trim();
  if (!l || /^de/.test(l)) return true;
  if (!/^en/.test(l)) return false;                       // fr/it/rm/… → genuinely foreign
  const t = String(p?.text || "").slice(0, 2000);
  return !!t && !looksEnglish(t) && !looksFrench(t);       // "en" tag but German text → keep
};
const dePages: any[] = pages.filter(langDe);
const homeDe = langDe(home);
// Page URLs are often percent-encoded (Swiss "über-uns" → "%C3%BCber-uns"). Page-type
// detection regexes match the readable form ("über-uns"/"ueber-uns"), so ALWAYS decode
// the URL before matching — otherwise the whole about/team/history page is missed and
// its team + about prose silently vanish from the generated site.
const decU = (u: string): string => { try { return decodeURIComponent(u || ""); } catch { return u || ""; } };

const allText = dePages.map((p) => p.text || "").join(" ").toLowerCase();
const firm: string = site.name || site.domain;
const shortName = firm.replace(/\b(AG|GmbH|Treuhand|Treuhand AG)\b/g, "").trim() || firm;

// --- city ---
function city(): string {
  for (const p of pages) for (const b of p.jsonld || []) {
    const items = Array.isArray(b) ? b : [b];
    for (const it of items) if (it?.address?.addressLocality) return it.address.addressLocality;
  }
  // Swiss postal codes run 1000–9999 — match ANY (not just Zürich's 8xxx), so a
  // Romandie/Ticino/Eastern-CH firm isn't silently relabelled "Zürich". Exclude
  // bare years (19xx/20xx) so "2026 Geschäftsbericht" isn't read as a place.
  const m = (home.text || "").match(/\b(?!19\d\d|20\d\d)[1-9]\d{3}\s+([A-ZÀ-Ö][A-Za-zÀ-ÿ.\-]{2,})/);
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
  // Specialist profiles — only surface when the firm actually features them prominently
  // (relevance ranking in services()), so a real-estate or estate-law firm isn't forced
  // into the generic accounting grid.
  { key: ["immobil", "liegenschaft", "bewirtschaftung", "stockwerkeigentum", "vermietung"], title: "Immobilien", summary: "Bewirtschaftung, Vermietung und Verkauf von Liegenschaften – professionell aus einer Hand." },
  { key: ["erbrecht", "nachlass", "erbschaft", "willensvollstreck", "testament"], title: "Nachlass & Erbrecht", summary: "Nachlassplanung, Willensvollstreckung und Erbteilung – sorgfältig und diskret begleitet." },
];
// Curated, service-SPECIFIC detail copy — used as the detail-page body when the scrape
// has no usable per-service prose (or only a generic, repeated overview). Each text is
// true for any Swiss Treuhänder (no fabricated firm specifics like client counts) and
// distinct from the short card summary, so the detail page reads as a real explanation.
const SERVICE_DETAIL: Record<string, string> = {
  "Buchhaltung": "Eine saubere, tagesaktuelle Buchhaltung ist das Fundament jeder unternehmerischen Entscheidung. Wir führen Ihre Finanzbuchhaltung vollständig – von der laufenden Verbuchung der Belege über die Debitoren- und Kreditorenbewirtschaftung bis zum Zahlungsverkehr. Sie übergeben uns Ihre Unterlagen digital oder physisch, wir richten die passenden Abläufe ein und halten Ihre Zahlen termingerecht aktuell. Regelmässige, verständliche Auswertungen zeigen Ihnen jederzeit, wo Ihr Unternehmen steht – so erkennen Sie Entwicklungen früh und können sich auf Ihr Kerngeschäft konzentrieren.",
  "Steuerberatung": "Das Schweizer Steuerrecht ist komplex und ändert sich laufend – auf Ebene von Bund, Kanton und Gemeinde. Wir erstellen Ihre Steuererklärung, prüfen die Veranlagungen und vertreten Sie gegenüber den Steuerbehörden. Vor allem aber denken wir vorausschauend: Mit gezielter Steuerplanung nutzen wir legale Optimierungsmöglichkeiten, vermeiden Doppelbelastungen und sorgen dafür, dass Sie als Unternehmen oder Privatperson nicht mehr Steuern zahlen als nötig. So gewinnen Sie Planungssicherheit und schöpfen Ihren finanziellen Spielraum aus.",
  "Lohnadministration": "Die Lohnadministration ist anspruchsvoll: Quellensteuer, AHV/IV/EO, BVG, Unfall- und Krankentaggeldversicherungen sowie laufende Gesetzesänderungen müssen korrekt abgebildet werden. Wir übernehmen Ihre gesamte Lohnbuchhaltung – von der monatlichen Lohnabrechnung über die Sozialversicherungsabrechnungen bis zu Lohnausweisen und Jahresendarbeiten. Wir melden Ein- und Austritte, korrespondieren mit Ausgleichskasse und Versicherern und beraten Sie in arbeitsrechtlichen Fragen. So sind Ihre Mitarbeitenden pünktlich und korrekt entlöhnt – und Sie bleiben jederzeit regelkonform.",
  "Jahresabschluss": "Der Jahresabschluss ist mehr als eine gesetzliche Pflicht – er ist die Visitenkarte Ihres Unternehmens gegenüber Bank, Investoren und Steuerbehörden. Wir erstellen Ihre Jahresrechnung nach Obligationenrecht und auf Wunsch nach Swiss GAAP FER, mit Bilanz, Erfolgsrechnung und Anhang – prüfungssicher und termingerecht. Dabei nutzen wir den vorhandenen Spielraum bei Bewertung und Abschreibungen sinnvoll und erläutern Ihnen die Ergebnisse verständlich. So liegt Ihnen ein belastbarer Abschluss vor, der als Grundlage für Steuern, Finanzierung und Planung dient.",
  "Mehrwertsteuer": "Die Mehrwertsteuer birgt zahlreiche Stolpersteine – von der Wahl der Abrechnungsmethode (effektiv oder Saldosteuersatz) über die korrekte Behandlung der Vorsteuern bis zu Bezugsteuer und grenzüberschreitenden Sachverhalten. Wir übernehmen Ihre periodischen MWST-Abrechnungen, prüfen die Vorsteuerabzüge, klären Zweifelsfälle ab und korrespondieren mit der Eidgenössischen Steuerverwaltung. Bei einer MWST-Kontrolle stehen wir Ihnen zur Seite. So vermeiden Sie kostspielige Aufrechnungen und reichen Ihre Abrechnungen jederzeit korrekt und fristgerecht ein.",
  "Unternehmensberatung": "Ob Gründung, Wachstum, Nachfolge oder Umstrukturierung – unternehmerische Weichenstellungen haben langfristige finanzielle und rechtliche Folgen. Wir begleiten Sie mit betriebswirtschaftlichem Rat: bei der Wahl der Rechtsform, der Erstellung von Budget- und Liquiditätsplänen, bei Finanzierung und Investitionsentscheiden sowie bei Kauf, Verkauf oder Übergabe Ihres Unternehmens. Wir analysieren Ihre Zahlen, zeigen Handlungsoptionen auf und setzen die nötigen Schritte gemeinsam mit Ihnen um – damit Sie fundiert entscheiden und Chancen rechtzeitig nutzen.",
  "Revision": "Eine Revision schafft Vertrauen – bei Eigentümern, Verwaltungsrat, Banken und Geschäftspartnern. Als zugelassene Fachpersonen führen wir die eingeschränkte sowie die ordentliche Revision durch und prüfen Ihre Jahresrechnung auf Gesetzes- und Statutenkonformität. Wir stimmen den Prüfungsumfang auf Grösse und Risikoprofil Ihres Unternehmens ab und liefern neben dem Revisionsbericht auch konkrete Hinweise zur Verbesserung Ihres internen Kontrollsystems. So erfüllen Sie Ihre gesetzlichen Pflichten und gewinnen zugleich verlässliche Erkenntnisse über Ihr Rechnungswesen.",
  "Immobilien": "Liegenschaften sind werthaltige, aber betreuungsintensive Vermögenswerte. Wir übernehmen die kaufmännische und administrative Bewirtschaftung Ihrer Immobilien – von der Vermietung und der Mietzinsverwaltung über die Nebenkostenabrechnung bis zur Koordination von Unterhalt und Handwerkern. Bei Kauf, Verkauf oder Bewertung stehen wir Ihnen mit Marktkenntnis und einer sauberen Aufbereitung der Zahlen zur Seite. So bleibt Ihre Liegenschaft werterhaltend bewirtschaftet, und Sie behalten jederzeit den Überblick über Erträge und Kosten.",
  "Nachlass & Erbrecht": "Eine vorausschauende Nachlassplanung erspart Ihren Angehörigen Unsicherheit und Streit. Wir unterstützen Sie bei der Strukturierung Ihres Vermögens, bei Testament und Erbvertrag sowie bei der steuerlich sinnvollen Übertragung zu Lebzeiten oder von Todes wegen. Im Erbfall übernehmen wir auf Wunsch die Willensvollstreckung, erstellen das Nachlassinventar und sorgen für eine faire, gesetzeskonforme Erbteilung. Mit der nötigen Sorgfalt und Diskretion begleiten wir Sie und Ihre Familie durch alle Schritte – sachlich, verständlich und vorausschauend.",
};
const DEFAULT_DETAIL = "Diese Leistung erbringen wir vollständig und termingerecht – digital, transparent und mit einem festen Ansprechpartner. So behalten Sie jederzeit den Überblick über Ihre Zahlen und gewinnen Zeit für Ihr Kerngeschäft.";
function services() {
  // Rank every canonical service by how prominently the firm features it (keyword
  // frequency, de-umlauted so "wirtschaftsprüf" also matches "wirtschaftspruefung"), so
  // the firm's CORE services lead and Revision is never silently dropped just for being
  // last in the list. A specialist firm (real estate / inheritance) surfaces its own
  // services; a classic accounting firm keeps the usual set. Too few matches → the
  // generic core six, so every site still has a populated services section.
  const hay = deUmlaut(allText);
  const score = (s: { key: string[] }) => s.key.reduce((n, k) => { const kk = deUmlaut(k); return n + (kk ? hay.split(kk).length - 1 : 0); }, 0);
  // A SPECIALIST profile (real estate / estate law) only qualifies when the firm truly
  // FEATURES it — at least 20% as prominent as its top service — so an accounting firm
  // with a few incidental "Immobilien"/"Nachlass" mentions keeps the classic grid, while
  // a real-estate or estate-law firm surfaces (and leads with) its own services.
  const SPECIALIST = new Set(["Immobilien", "Nachlass & Erbrecht"]);
  // Prefer services the firm has a DEDICATED page for (→ a real detail text) over ones
  // that would only get the generic fallback body, so the detail pages actually carry
  // prose; relevance breaks ties. Memoised — serviceText() reuses pageForService below.
  const pageCache = new Map<string, boolean>();
  const hasPage = (s: { title: string; key: string[] }) => {
    if (!pageCache.has(s.title)) pageCache.set(s.title, !!pageForService(s.key));
    return pageCache.get(s.title)!;
  };
  const scored = SERVICE_CANON.map((s) => ({ s, n: score(s) }));
  const maxN = Math.max(1, ...scored.map((x) => x.n));
  const ranked = scored.filter((x) => x.n > 0 && (!SPECIALIST.has(x.s.title) || x.n >= 0.2 * maxN))
    .sort((a, b) => (hasPage(b.s) ? 1 : 0) - (hasPage(a.s) ? 1 : 0) || b.n - a.n);
  const chosen = ranked.length >= 2 ? ranked.slice(0, 6).map((x) => x.s) : SERVICE_CANON.slice(0, 6);
  const items = chosen.map((s) => {
    const r = serviceText(s.title, s.key); // real copy from the firm's own service subpage
    return {
      title: s.title,
      summary: r.summary || s.summary,
      // No usable per-service prose in the scrape → a curated, service-SPECIFIC detail
      // text (the user authorised writing these). It explains the topic in full and is
      // distinct from the short card summary, so the detail page never reads as a stub.
      body: r.body || SERVICE_DETAIL[s.title] || DEFAULT_DETAIL,
      // Only REAL scraped bullets — never the same generic checklist on every service
      // (the detail aside then renders only when a service has its own selling points).
      bullets: r.bullets,
      image: media.serviceImages?.[s.title],
    };
  });
  // No two services may show the SAME detail body: a generic overview page ("Entdecken
  // Sie unsere Leistungen …") often matches several services and would repeat verbatim.
  // Replace any duplicated (or too-thin) body with the curated service-specific text, so
  // every detail page reads as its own topic.
  const normB = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const bodyCount = new Map<string, number>();
  for (const it of items) bodyCount.set(normB(it.body), (bodyCount.get(normB(it.body)) || 0) + 1);
  for (const it of items) {
    if (bodyCount.get(normB(it.body))! > 1 || it.body.length < 120) it.body = SERVICE_DETAIL[it.title] || DEFAULT_DETAIL;
  }
  return items;
}

// --- hero (real headline + lede where possible) ---
/** Repair UTF-8-as-Latin-1 mojibake (e.g. "WirtschaftsprÃ¼fung" -> "Wirtschaftsprüfung"). */
function fixEncoding(s: string): string {
  if (!s || !/[ÃÂ][-¿]/.test(s)) return s;
  try {
    const r = Buffer.from(s, "latin1").toString("utf8");
    return /[ÃÂ][-¿]/.test(r) ? s : r; // accept only if mojibake is gone
  } catch { return s; }
}
/** Emoji / decorative icon-glyphs that leak from scraped copy (☝ ✓ → ● ★ …). They are
 *  never real content — every render-time glyph comes from <Icon> — so a finished site
 *  must never show a stray symbol (caught by `npm run audit:design` D2). Deliberately
 *  EXCLUDES General Punctuation (– — · … „ " etc.), which is legitimate German typography. */
const GLYPH_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{25A0}-\u{25FF}\u{2713}-\u{2718}\u{FE0F}\u{200D}]/gu;
/** Collapse decode/scrape punctuation artefacts: stray space before punctuation,
 *  doubled sentence marks, and 2-dot runs ("unterwegs.." -> "unterwegs.") while a
 *  real ellipsis ("...") is left intact. Emoji/icon-glyphs are stripped. Whitespace
 *  is normalised last (so removed glyphs leave no double spaces). */
function tidyText(s: string): string {
  return s
    .replace(GLYPH_RE, " ")                // drop emoji/icon-glyphs (→ replaced by space)
    .replace(/ +([,.;:!?])/g, "$1")        // no space before punctuation
    .replace(/([,;:!?])\1+/g, "$1")        // collapse doubled , ; : ! ?
    .replace(/\.{4,}/g, "…")               // 4+ dots -> single ellipsis
    .replace(/(?<!\.)\.\.(?!\.)/g, ".")    // exactly two dots -> one (keep "..." ellipsis)
    .replace(/\s+/g, " ").trim();
}
/** True when text carries an irrecoverable decode failure (U+FFFD) — e.g. a
 *  mis-decoded page where every umlaut became "�" ("f�r", "Z�rich", "k�nnen").
 *  Such prose can't be repaired and must never reach the finished site; the caller
 *  drops it and falls back to clean canonical copy instead. */
const isCorrupted = (s: string): boolean => s.includes("�");
/** Trim prose to ~max chars on a CLEAN boundary so the site never shows a word cut
 *  in half ("… positive wie n"). Prefers ending at the last full sentence within the
 *  window; otherwise cuts at the last whole word and appends an ellipsis. */
function clipProse(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  const win = t.slice(0, max);
  const sent = win.match(/^[\s\S]*[.!?…]["”“»«)\]]?(?=\s|$)/); // up to the last sentence end
  if (sent && sent[0].trim().length >= max * 0.5) return sent[0].trim();
  const sp = win.lastIndexOf(" ");
  return (sp > 0 ? win.slice(0, sp) : win).replace(/[\s,;:–-]+$/, "").trim() + "…";
}
/** Drop a trailing INCOMPLETE sentence so prose ends cleanly, WITHOUT discarding the
 *  whole block (the old "<p> must end on .!?" rule wrongly rejected the prose of
 *  div-based service pages — text lines that carry full sentences but don't end on
 *  punctuation, e.g. stmtreuhand). A sentence break = terminator + space + capital, so
 *  abbreviations ("z.B.", "ca. 5") are not mistaken for an end. If nothing substantial
 *  remains, the text is left as-is rather than gutted. */
function trimToSentence(s: string): string {
  const t = s.trimEnd();
  if (/[.!?…]["”“»«)\]]?$/.test(t)) return t;                       // already ends clean
  const m = t.match(/^[\s\S]*[.!?…]["”“»«)\]]?(?=\s+[A-ZÄÖÜ"„»])/); // last real sentence break
  return m && m[0].trim().length >= 80 ? m[0].trim() : t;
}
/** Strip HTML tags + decode common entities to clean inline text. Returns "" for
 *  decode-corrupted blocks so callers (htmlBlocks, etc.) drop them. */
function stripTags(h: string): string {
  const t = h.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'").replace(/&[a-z]+;/gi, " ");
  const out = tidyText(fixEncoding(t));
  return isCorrupted(out) ? "" : out;
}
/** Ordered text blocks (heading / paragraph / list / definition) from a page's raw HTML. */
function htmlBlocks(html: string): { tag: string; text: string }[] {
  const out: { tag: string; text: string }[] = [];
  if (!html) return out;
  for (const m of html.matchAll(/<(h[1-4]|p|li|dt|dd|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const text = stripTags(m[2]);
    if (text) out.push({ tag: m[1].toLowerCase(), text });
  }
  return out;
}
/** Content blocks for a page: prefer semantic HTML (<p>/<h*>); if the page wraps
 *  its copy in <div>s (few real <p>), fall back to the flattened text + scraped
 *  headings so div-based sites still yield real prose/FAQ/value blocks. */
function pageContentBlocks(p: any): { tag: string; text: string }[] {
  const html = htmlBlocks(p.raw_html || "");
  if (html.filter((b) => b.tag === "p").length >= 2) return html;
  const heads = new Set([...(p.headings?.h2 || []), ...(p.headings?.h3 || []), ...(p.headings?.h4 || [])]
    .map((h: string) => tidyText(fixEncoding(h))).filter((h) => h && !isCorrupted(h)));
  const lines = fixEncoding(p.text || "").split(/\n+/).map((l) => tidyText(l)).filter((l) => l && !isCorrupted(l));
  const out: { tag: string; text: string }[] = [];
  for (const l of lines) {
    if (heads.has(l)) out.push({ tag: "h3", text: l });
    else if (/\?$/.test(l) && l.length >= 10 && l.length <= 160) out.push({ tag: "h3", text: l }); // question = FAQ heading
    else if (l.length >= 70 && /[.!?]/.test(l)) out.push({ tag: "p", text: l });
  }
  return out;
}
/** Real service copy from the firm's OWN service subpage (summary / body / bullets). */
const realServiceTitles = new Set<string>();
function pageForService(keys: string[]): any | undefined {
  const kk = keys.map(deUmlaut);
  // Skip foreign-language subpages (/en/, /fr/, /it/) — a German example site must
  // not source its service copy from an English "payroll-accounting" page.
  return dePages.filter((p) => p !== home && !/\/(en|fr|it)\//i.test(p.url || "")
      && !looksEnglish(`${p.title || ""} ${(p.headings?.h1 || []).join(" ")}`)).find((p) => {
    const hay = deUmlaut(`${p.url || ""} ${(p.headings?.h1 || []).join(" ")} ${p.title || ""}`);
    return kk.some((k) => hay.includes(k));
  });
}
const SVC_BOILER = /cookie|datenschutz|impressum|©|copyright|alle rechte|mwst-?nr|newsletter|anmelden|öffnungszeit|oeffnungszeit|navigation|toggle|menü|^kontakt$/i;
// CMS/page-builder helper text that leaks into the scraped prose (e.g. STG Zürich's
// Webflow filter helper). Never real copy — must be rejected wherever prose is taken.
const CMS_BOILER = /dieses element|nur in eingeloggtem|eingeloggtem zustand|nicht gel[öo]scht werden|definition der reihenfolge|filter[\s-]?element|sichtbar und darf nicht|platzhalter|lorem ipsum/i;
function serviceText(title: string, keys: string[]): { summary?: string; body?: string; bullets?: string[] } {
  const p = pageForService(keys);
  if (!p) return {};
  const bl = pageContentBlocks(p);
  // A real prose paragraph — not a pipe-stuffed <title>/meta line ("Firma – X & Y |
  // Thurgau, Zürich | Ratgeber") and not a blog teaser. Such lines slip in via the
  // div-fallback in pageContentBlocks() and must never become summary or body.
  const PARA_NOISE = /\s\|\s|jetzt mehr erfahren|mehr erfahren!|lesen sie|der komplette guide|in diesem beitrag|\bratgeber\b|devis gratuit|checkliste/i;
  // The paragraph must END on sentence punctuation (like realAbout/realFaq) — a `<p>`
  // the scrape cut mid-sentence ("… zeigen Dir, wie Du") or that flows into a list
  // must never become a summary/body, or the card ends on a dangling fragment.
  // A real prose paragraph must CONTAIN a sentence (not necessarily end on one — the
  // div-fallback yields full-sentence text lines that the body trims clean below), be
  // German, and not be boilerplate/SEO noise.
  const paras = bl.filter((b) => b.tag === "p" && b.text.length >= 60 && b.text.length <= 600 && /[.!?]/.test(b.text) && !SVC_BOILER.test(b.text) && !PARA_NOISE.test(b.text) && !looksFrench(b.text) && !looksEnglish(b.text)).map((b) => b.text);
  // Prefer the first REAL paragraph (paras[0]). The SEO meta.description is keyword-
  // stuffed ("… | 17 Jahre Erfahrung | 300 Kunden | Jetzt mehr erfahren!"), a blog
  // teaser, or foreign-language — only fall back to it when it is clean prose.
  const descRaw = fixEncoding(p.meta?.description || "");
  const desc = tidyText(descRaw);
  const metaOk = !desc.includes("|") && desc.length >= 40 && desc.length <= 280 && !isCorrupted(desc)
    && !looksFrench(desc) && !looksEnglish(desc)           // foreign-language SEO meta (monere)
    && !/[\n\r]/.test(descRaw)                              // multi-line = scraped form labels / CTA, not prose
    && !/[^.!?]\s[–-]\s[A-ZÄÖÜ][^.!?]{0,40}$/.test(desc)   // SEO title tail ("… - Firma AG Zürich")
    && !/jetzt mehr erfahren|lesen sie|devis gratuit|mehr erfahren!|checkliste/i.test(desc);
  const body = paras.length ? trimToSentence(clipProse(paras.slice(0, 4).join("\n\n"), 900)) : undefined;
  // The card description (and the detail-page lede) must be a SHORT, standalone line —
  // NOT the opening of the detail body, or the card and the lede read identically. The
  // paragraphs feed the BODY only. For the summary, accept a concise service meta-
  // description ONLY when it is clean and DISTINCT from the body's opening; otherwise
  // leave it undefined so services() supplies the curated canonical one-liner.
  // Reject low-quality service metas: portal/login nav, placeholder copy, SEO keyword
  // stuffing (✓/✅ checkmark lists) and blog/URL slugs ("Die-bevorstehende-MWST-…").
  const META_JUNK = /login|treuhandportal|\bportal\b|lorem ipsum|punchline|platzhalter|beschreib\b|[✓✔✅►▶▷➤★•]|\w-\w+-\w+-/i;
  const head = (s: string) => s.slice(0, 36).toLowerCase().replace(/\s+/g, " ");
  // A usable card summary is a clean, COMPLETE sentence (ends on .!?) that is DISTINCT
  // from the body's opening; else services() falls back to the canonical one-liner.
  const metaClean = metaOk && desc.length <= 200 && /[.!?]["»“)]?$/.test(desc) && !META_JUNK.test(desc);
  const distinct = !body || (!head(body).startsWith(head(desc).slice(0, 24)) && !head(desc).startsWith(head(body).slice(0, 24)));
  const summary = metaClean && distinct ? desc : undefined;
  const lis = [...new Set(htmlBlocks(p.raw_html || "").filter((b) => b.tag === "li" && b.text.length >= 6 && b.text.length <= 90
    && !/^(home|kontakt|impressum|datenschutz|leistung|über|ueber|news|blog|team|standort|deutsch|english|fran)/i.test(b.text)
    && /[a-zäöü]/i.test(b.text)).map((b) => b.text))];
  const bullets = lis.length >= 3 ? lis.slice(0, 5) : undefined;
  if (summary || body) realServiceTitles.add(title);
  // summary is a short card line; body is already length-clipped + sentence-trimmed above.
  return { summary: summary ? clipProse(summary, 200) : undefined, body, bullets };
}
// --- photo-subject heuristics: recognise person PORTRAITS, ZÜRICH/city shots and
//     OFFICE interiors so the creator places the right motif (never a portrait in a
//     hero). Tested on a de-umlauted "filename + alt" string. `foldUml` is a local
//     copy because the shared deUmlaut is declared further down. ---
const foldUml = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
const PORTRAIT_RE = /team|mitarbeit|portrait|portraet|person|profil|headshot|kopf|inhaber|geschaeftsf|geschaeftsleit|berater|leitung|vorstand|crew|\bceo\b|\bcfo\b|\bcoo\b/;
const CITY_RE = /zuerich|zurich|stadt|city|skyline|panorama|altstadt|limmat|bahnhofstr|architekt|architecture|aerial|luftaufnahme|grossmuenster|paradeplatz/;
const OFFICE_RE = /office|buero|bureau|empfang|reception|besprechung|meeting|boardroom|sitzung|konferenz|arbeitsplatz|schreibtisch|\bdesk\b|kanzlei|praxis|interior|innenraum|eingang|gebaeude|building|lobby|raeumlichkeit/;
// Open-air scenery (Swiss Alps, lakes, panoramas) — a valid hero motif.
const LANDSCAPE_RE = /landschaft|landscape|natur\b|nature|panorama|\bberg|mountain|alpen|\balps|\bsee\b|\blake|wald|forest|himmel|\bsky\b|aussicht|horizont|scenery|outdoor|wiese|feld\b/;
// Close-up of an accounting/bookkeeping activity (documents, calculator, ledgers,
// signing, desk work) — a valid hero motif.
const ACCOUNTING_RE = /buchhalt|buchf(ue|u)hr|\bbeleg|dokument|document|unterlage|akten\b|\bordner|rechnung|taschenrechner|calculator|\brechner\b|laptop|computer|tastatur|keyboard|vertrag|contract|unterschrift|signatur|signature|formular|steuererkl|bilanz|abschluss|tabelle|spreadsheet|finanz|paperwork|\bpen\b|\bstift\b|zahlen\b/;
/** A hero may ONLY depict one of four motifs: landscape, Zürich/city, an office
 *  interior, or an accounting-activity detail. People, products, logos and graphics
 *  never qualify. */
const heroMotif = (hay: string): boolean => CITY_RE.test(hay) || OFFICE_RE.test(hay) || LANDSCAPE_RE.test(hay) || ACCOUNTING_RE.test(hay);

/** Classify a photo's motif from filename + alt (+ orientation as a weak fallback:
 *  a tall photo with no topic signal is most likely a person/portrait). */
function classifySubject(file: string, alt: string, orientation?: Orientation): ImageSubject {
  const hay = foldUml(`${(file.split("/").pop() || "").replace(/^[0-9a-f]{6,}__/i, "")} ${alt || ""}`);
  if (CITY_RE.test(hay)) return "city";
  if (OFFICE_RE.test(hay)) return "office";
  if (PORTRAIT_RE.test(hay)) return "portrait";
  if (orientation === "portrait") return "portrait";
  return "generic";
}

/** Which page SLOTS an asset suits, from its final geometry + motif. An image can
 *  fit several (a wide office shot → hero + background + gallery). Person PORTRAITS
 *  are kept out of hero/background/service (a face never fronts those slots); the
 *  gallery is scenes only — portraits are routed to the team section. Logos/badges get no slot
 *  roles. Mirrors what the creators consume: hero · gallery · sectionBackgrounds
 *  (background) · serviceImages (service) · the feature band (feature). */
function imageRoles(a: MediaAsset): ImageRole[] {
  if (a.kind !== "photo" && a.kind !== "hero") return [];
  const w = a.width ?? 0, h = a.height ?? 0;
  const o = a.orientation ?? (w >= h * 1.15 ? "landscape" : w <= h * 0.87 ? "portrait" : "square");
  const land = o === "landscape", portrait = o === "portrait";
  const face = a.subject === "portrait";        // a person — never a hero/bg/service front
  const pano = land && w >= h * 2.4;             // ultra-wide strip — too letterboxed for a card
  const q = a.quality ?? 1;                      // unscored (sharp missing) ⇒ unchanged behaviour
  const roles: ImageRole[] = [];
  if (w >= 700 && !face) roles.push("gallery");                                                 // scenes only — a face belongs in a team card, not the gallery
  if (land && w >= 1400 && !face && q >= QUALITY_FLOOR.hero) roles.push("hero");                 // wide, high-res, GOOD, full-bleed
  if (land && w >= 1100 && !face && q >= QUALITY_FLOOR.background) roles.push("background");     // scrim hides minor flaws → lower bar
  if (w >= 600 && !face && !portrait && !pano && q >= QUALITY_FLOOR.service) roles.push("service"); // work scene for a card
  if (w >= 900 && !pano && q >= QUALITY_FLOOR.feature) roles.push("feature");                   // one strong split-block photo
  return roles;
}

/** The raw scrape file chosen as the hero — excluded from the media pool below so
 *  the hero photo (served from /hero.jpg) never also appears in the gallery. */
let heroSourceFile: string | undefined;
/** Pick the best real photo from the scraped assets and copy it to public/images/<slug>/.
 *  Candidates are first filtered by geometry + motif + the firm's naming intent, then
 *  the strongest few are re-ranked by TECHNICAL quality (sharpness/exposure/detail) so
 *  a crisp shot wins over a soft "header.jpg" and clearly broken/blurry ones are dropped. */
async function pickHeroImage(): Promise<string | undefined> {
  // Wipe stale ROOT images from a previous run (an old hero.<otherExt> left behind
  // when this run's hero is a different extension or stock, plus any legacy logo.*).
  // They are unreferenced orphans that otherwise linger as "duplicates" on disk.
  // The pool/ subdir is wiped separately by buildMedia.
  const idir = join(import.meta.dirname, "..", "public", "images", slug);
  if (existsSync(idir)) for (const f of readdirSync(idir)) {
    if (/^(hero|logo)\.[a-z0-9]+$/i.test(f)) { try { rmSync(join(idir, f), { force: true }); } catch { /* keep */ } }
  }
  const manifest: any[] = site.assets?.manifest || [];
  const imgs = manifest.filter((a) => a.ok && /image\/(jpe?g|png|webp)/.test(a.content_type || "")
    && !/logo|icon|favicon|sprite|placeholder|avatar|badge/i.test(a.file || a.url || "")
    && !PORTRAIT_RE.test(foldUml(a.file || a.url || ""))   // never a person portrait as the hero
    && (a.bytes || 0) > 45000 && (a.bytes || 0) < 4_000_000);
  if (!imgs.length) return undefined;
  const dimsOf = (a: any) => imageSize(join(ROOT, "scraper", "output", slug, a.file));
  const HERO_NAME = /hero|banner|slider|header|\bbg\b|background|titel|about|ueber|cover|key.?visual|landing/i;
  const GRAPHIC = /infograf|infographic|diagramm|\bchart\b|schaubild|organigramm|preis(liste|tabelle)|tarif(liste|tabelle)|wortmarke|schriftzug/i;
  const hayOf = (a: any) => foldUml(`${a.file || ""} ${a.url || ""}`);
  const score = (a: any) => { const h = hayOf(a); return (heroMotif(h) ? 2 : 0) + (HERO_NAME.test(a.file || "") ? 1 : 0); };
  // A full-bleed hero must FIT, or its subject crops to an unreadable sliver. Keep
  // only well-proportioned, high-enough-res landscapes (≈4:3 … 21:9, ≥1000px wide):
  // reject portraits/squares AND ultra-wide name-strips (e.g. 1920×192 = 10:1).
  // And it must depict ONE OF THE FOUR ALLOWED MOTIFS (landscape / Zürich / office /
  // accounting detail) — never a product, a person or a graphic. Prefer the most
  // hero-shaped (~1.7) so a centre crop still shows the subject. Nothing qualifies →
  // undefined, so the stock landscape/Zürich/office/accounting hero fallback takes over.
  const ranked = imgs.map((a) => { const d = dimsOf(a); return { a, r: d && d.height ? d.width / d.height : 0, w: d?.width ?? 0, s: score(a), b: a.bytes || 0, h: hayOf(a) }; })
    .filter((x) => x.r >= 1.3 && x.r <= 2.4 && x.w >= 1000 && heroMotif(x.h) && !GRAPHIC.test(x.h))
    .sort((x, y) => (y.s - x.s) || (Math.abs(x.r - 1.7) - Math.abs(y.r - 1.7)) || (y.w - x.w) || (y.b - x.b));
  if (!ranked.length) return undefined;

  // Quality-aware re-rank of the top candidates: naming intent (s) stays primary,
  // but a crisp/well-exposed shot beats a soft one (q weighted into the score) and
  // clearly broken/blurry/flat candidates (q<0.3) are dropped. Falls back to the
  // geometry ranking if sharp is unavailable.
  let best = ranked[0].a;
  let sharp: any; try { sharp = (await import("sharp")).default; } catch { sharp = undefined; }
  if (sharp) {
    const top = ranked.slice(0, 8);
    const stats = await Promise.all(top.map(async (x) => {
      const p = join(ROOT, "scraper", "output", slug, x.a.file);
      return existsSync(p) ? pixelStats(sharp, readFileSync(p)) : undefined;
    }));
    const sv = stats.filter((s): s is NonNullable<typeof s> => !!s).map((s) => s.sharpness).filter((v) => !Number.isNaN(v)).sort((a, b) => a - b);
    const scored = top.map((x, i) => {
      const st = stats[i];
      const px = x.w && x.r ? (x.w * x.w) / x.r : 0;        // pixels = w · (w/r)
      const q = st ? compositeQuality({ entropy: st.entropy, sharpRank: rankIn(sv, st.sharpness), contrast: st.contrast, mean: st.mean, opaque: st.opaque, bpp: px ? x.b / px : 0 }) : 0.5;
      return { x, q };
    });
    const eligible = scored.filter((e) => e.q >= 0.3);     // drop broken/very-soft/flat
    (eligible.length ? eligible : scored).sort((a, b) =>
      (b.x.s + 2 * b.q) - (a.x.s + 2 * a.q)                 // naming intent + 2×quality
      || (Math.abs(a.x.r - 1.7) - Math.abs(b.x.r - 1.7)) || (b.x.w - a.x.w));
    best = (eligible.length ? eligible : scored)[0].x.a;
  }
  heroSourceFile = best.file;                              // keep this file out of the media pool
  const src = join(ROOT, "scraper", "output", slug, best.file);
  if (!existsSync(src)) return undefined;
  const ext = (best.file.match(/\.(jpe?g|png|webp)$/i) || [".jpg"])[0];
  const destDir = join(import.meta.dirname, "..", "public", "images", slug);
  mkdirSync(destDir, { recursive: true });
  copyFileSync(src, join(destDir, `hero${ext}`));
  return `/images/${slug}/hero${ext}`;
}
const heroImage = await pickHeroImage();

// --- real team members (names + roles from the team/about page, photos matched
//     from the scraped assets by surname/initials). Falls back to scaffold. ---
const norm = (s: string) => (s || "").toLowerCase().replace(/^https?:\/\/[^/]+/, "").replace(/^\.?\//, "").replace(/[?#].*$/, "");
function manifestFileFor(src: string): string | undefined {
  const manifest: any[] = site.assets?.manifest || [];
  const t = norm(src);
  if (!t) return undefined;
  const hit = manifest.find((a) => a.ok && a.file && norm(a.url || "") === t)
    || manifest.find((a) => a.ok && a.file && norm(a.url || "").endsWith(t))
    || manifest.find((a) => a.ok && a.file && norm(a.url || "").split("/").pop() === t.split("/").pop());
  return hit?.file;
}
// (roleBio removed — team bios are never fabricated from the role. The scraper has
//  no real per-person bio source, so a member carries only the scraped name + role;
//  the Team structures render name + role and show a bio paragraph only if one exists.)
const NAME_RE = /^([A-ZÄÖÜ][a-zäöüéèàç]+)(?:\s+(?:[A-ZÄÖÜ]\.|[A-ZÄÖÜ][a-zäöüéèàç]+)){1,2}$/;
// section headers / nav labels that look like a "First Last" pair but aren't people
const NAME_STOP = new Set(["unsere", "unser", "ihre", "ihr", "weitere", "alle", "mehr", "extra", "unternehmen", "dienstleistungen", "dienstleistung", "kontakt", "team", "publikationen", "mitgliedschaften", "startseite", "aktuelles", "leistungen", "über", "ueber", "about", "services", "willkommen", "herzlich", "news", "blog", "standort", "öffnungszeiten", "oeffnungszeiten", "impressum", "datenschutz", "downloads", "links", "home", "english", "deutsch", "français", "francais", "partner", "partners", "treuhand", "treuhandbüro", "fiduciaire", "gmbh", "consulting", "filiale", "filialen", "standort", "standorte", "büro", "buero", "niederlassung", "office", "sitz", "hauptsitz"]);
const isPersonName = (nm: string) => {
  if (!NAME_RE.test(nm)) return false;
  const parts = nm.replace(/\./g, "").split(/\s+/).map((w) => w.toLowerCase());
  return !parts.some((w) => NAME_STOP.has(w));
};
const ROLE_HINT = /(treuh|steuer|experte|expertin|berater|leiter|leitung|ceo|cfo|coo|gesch[äa]ft|fachfrau|fachmann|spezialist|finanz|rechnungswesen|personal|\bhr\b|payroll|lohn|sekretariat|empfang|kundenbe|mandats|partner|inhaber|gr[üu]nder|direktor|assistent|mandatsleiter|buchhalt|revisor|wirtschaftspr[üu]f|dipl|lehrling|sachbearbeit)/i;
// A name candidate that contains a service/topic token is a keyword line, not a
// person ("Steuerberatung Privat", "Vermögen finden") — reject it outright.
const NAME_TOPIC = /steuer|buchhalt|lohn|preis|kosten|beratung|mwst|revision|abschluss|verm[öo]gen|treuhand|finanz|immobil|hypothek|g[üu]nstig|finden|privat|kryptow/i;
// The following line must assert a REAL role (beyond the looser ROLE_HINT) to keep
// a (name, role) pair — so a stray heading after a name isn't mistaken for a title.
const ROLE_STRICT = /gesch[äa]ftsf|inhaber|partner|treuh(?:[äa]nder|andexperte|expert)|direktor(in)?|berater(in)?|leiter(in)?|gr[üu]nder(in)?|dipl\.|mandatsleiter|sachbearbeiter|buchhalter(in)?|revisor(in)?|fachfrau|fachmann|spezialist(in)?|assistent(in)?|lernende|mitarbeit/i;
// A real personal name: 2-3 tokens, each Capitalised, letters only, not ALL-CAPS.
const looksLikePersonName = (nm: string) => {
  if (NAME_TOPIC.test(nm)) return false;
  const parts = nm.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 3) return false;
  if (nm === nm.toUpperCase()) return false;            // ALL-CAPS = label/heading, not a name
  return parts.every((w) => /^[A-ZÄÖÜ][a-zäöüéèàçA-ZÄÖÜ.]*$/.test(w) && !/\d/.test(w));
};
// A heading that is merely a PERSON NAME — used to keep team-roster names off SECTION
// titles (about pages list people as headings). Deliberately MORE permissive than the
// strict team detector above: it also accepts a hyphenated/accented surname ("Jasna
// Florian-Obrez") and a middle initial ("Alfons G. Florian"), which NAME_RE/looksLike
// miss. NAME_STOP + NAME_TOPIC keep genuine German headings ("Unsere Geschichte",
// "Persönliche Beratung") from being mistaken for a name.
// A token is a NAME token: a single-letter initial ("G.") OR a Capitalised word (with an
// optional hyphen/apostrophe surname part), but NOT a whole word ending in a period — a
// trailing dot there is sentence punctuation, so "Gründer." / "Versprechen." (the slogan
// "Zwei Gründer. Ein Versprechen.") are excluded while "Alfons G. Florian" is not.
const NAME_TOKEN = /^(?:[A-ZÄÖÜ]\.|[A-ZÄÖÜ][a-zäöüéèàçA-ZÄÖÜ]*(?:['’-][A-ZÄÖÜ]?[a-zäöüéèàçA-ZÄÖÜ]+)*)$/;
const looksLikePersonHeading = (h: string): boolean => {
  const parts = h.trim().split(/\s+/);
  if (parts.length < 2 || parts.length > 4 || h === h.toUpperCase()) return false;
  if (NAME_TOPIC.test(h) || h.toLowerCase().replace(/\./g, "").split(/\s+/).some((w) => NAME_STOP.has(w))) return false;
  return parts.every((w) => NAME_TOKEN.test(w));
};
function teamMembers() {
  // (name, role) pairs from ONE page: a person-name line immediately followed by a
  // role line. NB: a name contained in the firm name is NOT skipped — that wrongly
  // dropped the EPONYMOUS owner ("Catherine Schmid" of "Treuhand Catherine Schmid
  // GmbH"); the adjacent ROLE_STRICT role line is the real person-vs-brand test, so a
  // bare firm brand ("Langhart Partner") has no role line and is rejected.
  const extractFrom = (page: any): { name: string; role: string }[] => {
    const lines = fixEncoding(page?.text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const out: { name: string; role: string }[] = [];
    for (let i = 0; i < lines.length - 1; i++) {
      const nm = lines[i];
      if (!isPersonName(nm) || !looksLikePersonName(nm)) continue;
      const next = lines[i + 1];
      if (!(next.length < 80 && ROLE_HINT.test(next) && ROLE_STRICT.test(next))) continue;
      if (out.some((f) => f.name.toLowerCase() === nm.toLowerCase())) continue;
      out.push({ name: nm, role: next });
    }
    return out;
  };
  const deNonForeign = dePages.filter((p) => !/\/(en|fr|it)\//i.test(p.url || ""));
  const isTeamUrl = (u: string) => /\/(team|teammitglieder|team2|mitarbeit(?:ende|er)?|crew|unser-?team|das-?team)/i.test(decU(u));

  // (a) AGGREGATE the roster across ALL dedicated team pages — handles a roster split
  //     into ONE PAGE PER PERSON (langhart /teammitglieder/urs-langhart/, kmu-trex
  //     /Team2/<Name>.htm), which the old "first matching page only" logic collapsed to
  //     a single member.
  const found: { name: string; role: string }[] = [];
  const seenN = new Set<string>();
  const pagesUsed: any[] = [];
  for (const p of deNonForeign.filter((p) => isTeamUrl(p.url || ""))) {
    const f = extractFrom(p);
    if (f.length) pagesUsed.push(p);
    for (const m of f) { const k = m.name.toLowerCase(); if (!seenN.has(k)) { seenN.add(k); found.push(m); } }
  }
  // (b) No real team page (or too thin) → the SINGLE best about/home page, where smaller
  //     firms list their people (maurer on /ueber-uns, aawi on the home page).
  if (found.length < 2) {
    const aboutCands = [home, ...deNonForeign.filter((p) => /ueber-?uns|über-?uns|\babout\b|wer-wir|inhaber|\/wir\b/i.test(`${decU(p.url)} ${p.title || ""}`))];
    let best = found, bestPage: any;
    for (const p of aboutCands) { const f = extractFrom(p); if (f.length > best.length) { best = f; bestPage = p; } }
    if (best.length > found.length) { found.length = 0; found.push(...best); pagesUsed.length = 0; if (bestPage) pagesUsed.push(bestPage); }
  }
  if (!found.length) return undefined;

  // 2) candidate portrait images from the page(s) we actually used + home, with alt text.
  const imgPool: { src: string; alt: string }[] = [];
  for (const p of [...pagesUsed, home]) {
    for (const im of (p.images || [])) {
      const src = typeof im === "string" ? im : im?.src;
      if (!src || /logo|icon|favicon|sprite|placeholder|transparent|banner|map/i.test(src)) continue;
      imgPool.push({ src, alt: fixEncoding((typeof im === "string" ? "" : im?.alt) || "") });
    }
  }
  const base = (s: string) => (s.split("/").pop() || "").toLowerCase();

  // 3) copy + match a photo per member (alt-surname > file-surname > initials).
  const destDir = join(import.meta.dirname, "..", "public", "images", slug, "team");
  let madeDir = false;
  const members = found.slice(0, 6).map((m, idx) => {
    const parts = m.name.replace(/\./g, "").split(/\s+/).filter(Boolean);
    const first = parts[0].toLowerCase();
    const surname = parts[parts.length - 1].toLowerCase();
    const init2 = (parts[0][0] + (parts[parts.length - 1][0] || "")).toLowerCase();
    const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
    const pick = imgPool.find((g) => g.alt && g.alt.toLowerCase().includes(surname))
      || imgPool.find((g) => base(g.src).includes(surname))
      || imgPool.find((g) => new RegExp(`(^|[_\\-/])${init2}([_\\-.]|$)`).test(base(g.src)))
      || imgPool.find((g) => new RegExp(`(^|[_\\-/])${surname[0]}([_\\-.])`).test(base(g.src)) && (g.alt || "").toLowerCase().includes(first));
    let photo: string | undefined;
    if (pick) {
      const file = manifestFileFor(pick.src);
      if (file) {
        const srcPath = join(ROOT, "scraper", "output", slug, file);
        if (existsSync(srcPath)) {
          const ext = (file.match(/\.(jpe?g|png|webp)$/i) || [".jpg"])[0];
          if (!madeDir) { mkdirSync(destDir, { recursive: true }); madeDir = true; }
          const fn = `${idx}-${surname}${ext}`;
          copyFileSync(srcPath, join(destDir, fn));
          photo = `/images/${slug}/team/${fn}`;
        }
      }
    }
    return { name: m.name, role: m.role, initials, photo };
  });
  return members;
}
const realTeam = teamMembers();
// Names of the firm's real people — so a team bio (person-name heading + bio) is
// never mis-harvested as a "value" or audience segment further down.
const teamNameSet = new Set((realTeam ?? []).map((m) => m.name.toLowerCase().trim()));

// --- media library: classify EVERY usable scraped image into a sorted pool, so
//     the website creator can wire the best-fitting asset onto each chosen
//     element. Each `kind` group is ordered best-first for downstream picking. ---
const MEDIA_KIND_ORDER: MediaKind[] = ["logo", "logo-light", "badge", "hero", "photo"];
const BADGE_RE = /\b(rab|treuhand[\s_-]?suisse|treuhandsuisse|expert[\s_-]?suisse|expertsuisse|handelskammer|abacus|bexio|sage|klara|swiss21|topal|winbiz|run[\s_-]?my[\s_-]?accounts|veb|fidpro|svds|svof|swissmem|zugelassen|revisor|fachausweis|iso[\s_-]?900|fiduciaire|swiss[\s_-]?gaap|mitglied|verband|zertifi|certified|partner|siegel|member)\b/i;
const HERO_RE = /hero|banner|slider|slide|header|\bbg\b|background|titel|landing|cover|key[\s_-]?visual|panorama/i;
const ICON_RE = /icon|sprite|favicon|pixel|spacer|arrow|chevron|bullet|placeholder|loader/i;
const THUMB_RE = /update|newsletter|thumb|teaser|vorschau|avatar|\bnews\b|blog|beitrag|\bpost\b/i;
// Raster GRAPHICS that are not photographs — infographics, diagrams / charts /
// org-charts, price-tables, and name/wordmark "Schriftzug" images. They read as
// wrong when dropped into a hero, gallery or section photo slot, so they're kept
// OUT of the content pool. (Real logos are routed by the mark-word / clean-firm
// rules above; this only guards the photo/hero path.)
const GRAPHIC_RE = /infograf|infographic|diagramm|\bdiagram\b|schaubild|organigramm|flow[\s_-]?chart|\bchart\b|\bablauf\b|\bprozess\b|prozessschritte|statistik|balkendiagramm|kreisdiagramm|preis(liste|tabelle|uebersicht|übersicht)|tarif(liste|tabelle)|wortmarke|schriftzug|namenszug|lettering/i;
const LIGHT_RE = /weiss|white|light|invert|negativ|hell|[_-]w\b/i;
const BARE_LOGO_RE = /^(logo|brand|signet|wortmarke|bildmarke|marke)([._\- ](transparent|transp|trans|alpha|white|weiss|hell|black|schwarz|dark|color|colou?r|rgb|cmyk|original|full|klein|small|gross|big|head|web|neu|new|v?\d{1,3}|\d{1,4}x\d{1,4})?)*$/i;

type MediaCand = { file: string; kind: MediaKind; alt: string; bytes: number; hash?: string };

/** Fold umlauts so a key like "wirtschaftsprüf" matches a file "wirtschaftspruefung". */
const deUmlaut = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
/** Word-ish segments of a candidate's FILENAME (for service-name matching).
 *  Alt text is excluded on purpose: these firms SEO-stuff every alt with the same
 *  service keywords, which would mislabel generic/portrait photos as service shots. */
function candTokens(c: MediaCand): string[] {
  const base = (c.file.split("/").pop() || "").replace(/^[0-9a-f]{6,}__/i, "").replace(/\.[a-z0-9]+$/i, "");
  return deUmlaut(base).split(/[-_.\s]+/).filter(Boolean);
}

/** Generic logo/descriptor + industry tokens (NOT a distinguishing brand name).
 *  Used to tell a firm's OWN mark from a partner/association mark in a
 *  "<brand>-logo" filename: if nothing but these (+ the firm's own name) remains,
 *  it's the firm logo; a leftover foreign brand token makes it a partner badge. */
const GENERIC_MARK = new Set([
  "logo", "signet", "wortmarke", "bildmarke", "brand", "marke", "schriftzug", "claim", "text", "slogan",
  "rgb", "cmyk", "srgb", "pos", "neg", "black", "white", "weiss", "hell", "dark", "schwarz", "color", "colour", "col", "farbig",
  "blue", "blau", "red", "rot", "grey", "gray", "grau", "green", "gruen", "gold", "silber", "orange",
  "neu", "new", "gross", "klein", "small", "large", "big", "web", "webp", "mobile", "desktop", "retina", "app",
  "header", "footer", "head", "top", "bottom", "nav", "menu", "transparent", "transp", "trans", "alpha",
  "final", "original", "orig", "def", "default", "favicon", "icon", "square", "quadrat", "round", "rund",
  "shadow", "scaled", "scale", "copy", "cropped", "version", "ver", "print", "screen",
  // file-type / CMS noise tokens that appear inside mangled filenames
  "png", "jpg", "jpeg", "webp", "gif", "svg", "ico", "img", "image", "bild", "foto", "photo", "pic", "og", "msi", "www", "cdn", "mv",
  // industry words — present on most firms, so not a distinguishing brand name
  "treuhand", "treuhandbuero", "fiduciaire", "consulting", "beratung", "steuer", "steuerberatung",
  "revision", "revisions", "finanz", "partner", "partners", "ag", "gmbh", "sa", "swiss", "suisse",
  "holding", "group", "gruppe", "de", "en", "fr", "it", "und", "mit", "der", "die", "das",
]);
/** Industry-word STEMS — a token starting with one of these is generic, not a
 *  distinguishing brand name (handles spelling drift like "treuhandburo"/"buero"). */
const INDUSTRY_RE = /^(treuhand|fiduciair|buchhalt|rechnungswes|steuer|revision|wirtschaftspr|beratung|consult|finanz|lohn|immobil)/;
/** Filename tokens with the word "logo/signet/…" split out (handles camelCase like "HMRlogo"). */
const markTokens = (name: string): string[] =>
  deUmlaut(name).toLowerCase().replace(/(logo|signet|wortmarke|bildmarke)/g, " logo ").split(/[^a-z0-9]+/).filter(Boolean);

function buildMedia(): MediaLibrary {
  const manifest: any[] = site.assets?.manifest || [];
  // alt-text lookup (by normalized url and by basename) from the page image refs
  const altByKey = new Map<string, string>();
  const putAlt = (k: string, v: string) => { if (k && v && !altByKey.has(k)) altByKey.set(k, v); };
  for (const p of pages) for (const im of (p.images || [])) {
    const src = typeof im === "string" ? im : im?.src;
    if (!src) continue;
    const alt = fixEncoding(((typeof im === "string" ? "" : (im?.alt || im?.title)) || "")).trim();
    putAlt(norm(src), alt);
    putAlt((src.split("/").pop() || "").toLowerCase(), alt);
  }
  // firm identity tokens: name words PLUS domain labels (catches acronyms like
  // "stm" / "idp" / "spp" that the display name may not spell out).
  const firmTokens = (() => {
    const clean = (s: string) => deUmlaut(s).replace(/[^a-z0-9 ]/g, " ");
    const domBase = (site.domain || "").toLowerCase().replace(/^www\./, "").replace(/\.[a-z]{2,3}$/, "");
    const fromName = clean(firm).split(/\s+/);
    const fromDom = clean(domBase.replace(/[.\-]/g, " ")).split(/\s+/);
    const joined = clean(domBase.replace(/[.\-]/g, "")).trim();   // e.g. "vbuchhaltung", "treuhandservicezh"
    const all = [...fromName, ...fromDom, joined].map((w) => w.trim()).filter((w) => w.length >= 3 && !GENERIC_MARK.has(w));
    return [...new Set(all)];
  })();
  const firmMatch = (t: string) => t.length >= 3 && firmTokens.some((ft) => t === ft || ft.startsWith(t) || t.startsWith(ft));

  const cands: MediaCand[] = [];
  const seenHash = new Set<string>();      // file content hashes already taken (byte-identical dedupe)
  const byNorm = new Map<string, number>(); // normalised base name -> index in `cands` (responsive-variant dedupe)
  for (const a of manifest) {
    if (!a.ok || !a.file) continue;
    if (a.file === heroSourceFile) continue;                // hero photo is served from /hero.jpg — never pool it too
    const isSvg = /svg/.test(a.content_type || "") || /\.svg$/i.test(a.file);
    // accept jpeg/jpg (some servers send the non-standard image/jpg), png, webp, gif, svg
    if (!isSvg && !/image\/(jpe?g|png|webp|gif)/.test(a.content_type || "")) continue;
    const orig = (a.file.split("/").pop() || "").replace(/^[0-9a-f]{6,}__/i, "");
    const nameNoExt = orig.replace(/\.[a-z0-9]+$/i, "");
    const url: string = a.url || "";
    const alt = altByKey.get(norm(url)) || altByKey.get((url.split("/").pop() || "").toLowerCase()) || altByKey.get(orig.toLowerCase()) || "";
    const bytes: number = a.bytes || 0;
    const hay = `${orig} ${alt} ${url}`.toLowerCase();
    const badgeHay = hay.replace(/_/g, " ");               // BADGE_RE \b fails after "_" (a word char)
    const isPng = /png|webp/.test(a.content_type || "");
    if (ICON_RE.test(orig) && !/logo|brand/.test(hay)) continue;
    if (/\b(unterschrift|signatur|signature|underschrift)\b/i.test(hay)) continue; // decorative signature

    // A filename containing the word "logo/signet/…" is a strong mark signal. Decide
    // firm-OWN-logo vs partner/association badge by what's left after dropping the
    // mark word, generic descriptors, dimensions, hashes and the firm's own name:
    // a leftover foreign brand token ⇒ partner badge; nothing left ⇒ the firm logo.
    const hasMarkWord = /logo|signet|wortmarke|bildmarke/i.test(nameNoExt);
    const toks = markTokens(nameNoExt);
    const foreign = toks.filter((t) =>
      t.length >= 3 && t !== "logo" && !GENERIC_MARK.has(t) && !INDUSTRY_RE.test(t)
      && !/^\d/.test(t) && !/^[0-9a-f]{6,}$/i.test(t) && !/^v\d+$/.test(t) && !firmMatch(t));
    // "clean firm mark": filename is just the firm's own name + generic descriptors
    // (no foreign brand token) — catches firm logos that lack the word "logo".
    const cleanFirm = foreign.length === 0 && toks.some((t) => firmMatch(t));
    const resolveMark = (): MediaKind =>
      BADGE_RE.test(badgeHay) ? "badge"
      : foreign.length === 0 ? (LIGHT_RE.test(hay) ? "logo-light" : "logo")
      : "badge";                                           // leftover foreign brand ⇒ partner mark
    let kind: MediaKind | undefined;
    if (isSvg) {
      // vector asset: useful only as a crisp logo/badge; skip decorative UI icons.
      if (hasMarkWord || cleanFirm || BADGE_RE.test(badgeHay)) kind = resolveMark();
      else continue;
    } else {
      if (bytes < 2500) continue;                          // too small to be content
      if (hasMarkWord && bytes < 120000) kind = resolveMark();           // named logo / partner mark (png, jpg or webp)
      else if (cleanFirm && isPng && bytes < 60000) kind = resolveMark(); // firm-named png mark without explicit "logo"
      else if (BADGE_RE.test(badgeHay) && bytes < 80000) kind = "badge";      // known association / software badge
      else {
        // Candidate CONTENT photo (hero / gallery / section). Reject graphics that
        // aren't photographs: a logo/wordmark/badge whose filename says so but was
        // too large for the mark size-caps above (e.g. "swiss-accounting-logo.png",
        // "kmu-hsg_logo_…jpeg") is still a mark, never a photo; plus named
        // infographics/diagrams and banner-strip / skyscraper aspect ratios.
        // (badgeHay = hay with "_"→" " so the \b in these regexes matches.)
        if (hasMarkWord || BADGE_RE.test(badgeHay) || GRAPHIC_RE.test(badgeHay)) continue;
        const dim = imageSize(join(ROOT, "scraper", "output", slug, a.file));
        const ar = dim && dim.height ? dim.width / dim.height : 0;
        if (ar && (ar > 4 || ar < 0.33)) continue;
        if (bytes >= 30000) kind = HERO_RE.test(hay) ? "hero" : "photo";
        else if (bytes >= 12000 && !THUMB_RE.test(hay) && /jpe?g|webp/.test(a.content_type || "")) kind = "photo";
        else continue;
      }
    }

    // Dedupe pictures the scrape emitted under several filenames:
    //  (a) byte-for-byte re-uploads -> collapse by CONTENT HASH (filename-independent),
    //      so `pic_92691.jpg` and `Revision_92691.jpg` no longer both enter the pool;
    //  (b) responsive crops of ONE image (foo-1920w / foo-300x274 / foo-scaled) ->
    //      collapse by a normalised base name, keeping the largest variant.
    const srcPath = join(ROOT, "scraper", "output", slug, a.file);
    if (!existsSync(srcPath)) continue;
    const chash = createHash("md5").update(readFileSync(srcPath)).digest("hex");
    if (seenHash.has(chash)) continue;                      // (a) identical bytes already taken
    const normBase = nameNoExt.toLowerCase()
      .replace(/_2528\d+_2529|_281_29|\(\d+\)/gi, "")       // URL-encoded "(1)" copy marker
      .replace(/[-_](kopie|copy|dup(likat)?)\b/gi, "")      // explicit copy markers
      .replace(/-\d+x\d+$/i, "")                            // -300x274 crop
      .replace(/-\d+w$/i, "")                               // -1920w width variant
      .replace(/-scaled$/i, "")                             // WordPress -scaled
      .replace(/-e\d{6,}$/i, "");                           // WordPress edit hash
    const prevIdx = byNorm.get(normBase);
    if (prevIdx != null) {                                  // (b) same image, different size
      if (bytes > cands[prevIdx].bytes) {                   // keep the largest crop
        seenHash.delete(cands[prevIdx].hash!);
        cands[prevIdx] = { file: a.file, kind, alt, bytes, hash: chash };
        seenHash.add(chash);
      }
      continue;
    }
    seenHash.add(chash);
    byNorm.set(normBase, cands.length);
    cands.push({ file: a.file, kind, alt, bytes, hash: chash });
  }

  // order each kind best-first: logos = clean/transparent mark then smallest;
  // badges = known certs first; hero/photos = largest (highest resolution) first.
  const svgScore = (c: MediaCand) => (/\.svg$/i.test(c.file) ? 0 : 1); // vector logos first
  const logoScore = (c: MediaCand) => (/(transparent|transp|trans|alpha|frei)/i.test(c.file) ? 0 : 1);
  const cmp: Record<MediaKind, (a: MediaCand, b: MediaCand) => number> = {
    "logo":       (a, b) => svgScore(a) - svgScore(b) || logoScore(a) - logoScore(b) || a.bytes - b.bytes,
    "logo-light": (a, b) => svgScore(a) - svgScore(b) || logoScore(a) - logoScore(b) || a.bytes - b.bytes,
    "badge":      (a, b) => (BADGE_RE.test(b.file) ? 1 : 0) - (BADGE_RE.test(a.file) ? 1 : 0) || a.bytes - b.bytes,
    "hero":       (a, b) => b.bytes - a.bytes,
    "photo":      (a, b) => b.bytes - a.bytes,
  };
  const CAP: Record<MediaKind, number> = { "logo": 4, "logo-light": 3, "badge": 8, "hero": 4, "photo": 16 };
  const byKind = (k: MediaKind) => cands.filter((c) => c.kind === k).sort(cmp[k]).slice(0, CAP[k]);

  // match a DISTINCT content photo to each canonical service (e.g. "revision.jpg"
  // -> Revision), so the generator can show real imagery on service cards/detail.
  // Matched against ALL photo candidates (not the capped set) and force-included
  // below, since service shots are often smaller than the team portraits.
  const photoPool = cands.filter((c) => c.kind === "photo").sort((x, y) => y.bytes - x.bytes);
  const serviceMatch: Record<string, MediaCand> = {};
  const usedSvc = new Set<string>();
  for (const s of SERVICE_CANON) {
    for (const k of s.key) {
      const kk = deUmlaut(k);
      const hit = photoPool.find((p) => !usedSvc.has(p.file) && candTokens(p).some((t) => t.startsWith(kk)));
      if (hit) { usedSvc.add(hit.file); serviceMatch[s.title] = hit; break; }
    }
  }

  // selection = capped picks per kind ∪ the (possibly capped-out) service photos
  const selected: MediaCand[] = [];
  const inSel = new Set<string>();
  const add = (c: MediaCand) => { if (!inSel.has(c.file)) { inSel.add(c.file); selected.push(c); } };
  for (const k of MEDIA_KIND_ORDER) for (const c of byKind(k)) add(c);
  for (const c of Object.values(serviceMatch)) add(c);

  // copy the selected assets into the pool, in canonical processing order.
  // wipe first so a re-extraction never leaves stale (de-selected) assets behind.
  const destDir = join(import.meta.dirname, "..", "public", "images", slug, "pool");
  rmSync(destDir, { recursive: true, force: true });
  let made = false;
  const assets: MediaAsset[] = [];
  const srcOf: Record<string, string> = {};
  for (const c of selected) {
    const srcPath = join(ROOT, "scraper", "output", slug, c.file);
    if (!existsSync(srcPath)) continue;
    if (!made) { mkdirSync(destDir, { recursive: true }); made = true; }
    const fn = c.file.split("/").pop()!;
    const destPath = join(destDir, fn);
    copyFileSync(srcPath, destPath);
    const src = `/images/${slug}/pool/${fn}`;
    srcOf[c.file] = src;
    // intrinsic dimensions + orientation, so the creator can pick by aspect ratio
    const dim = imageSize(destPath);
    let orientation: Orientation | undefined;
    if (dim && dim.width && dim.height) {
      const r = dim.width / dim.height;
      orientation = r > 1.15 ? "landscape" : r < 0.87 ? "portrait" : "square";
    }
    assets.push({ src, kind: c.kind, alt: c.alt, bytes: c.bytes, width: dim?.width, height: dim?.height, orientation, subject: classifySubject(c.file, c.alt, orientation) });
  }
  assets.sort((a, b) => MEDIA_KIND_ORDER.indexOf(a.kind) - MEDIA_KIND_ORDER.indexOf(b.kind)); // canonical order
  const serviceImages: Record<string, string> = {};
  for (const [title, c] of Object.entries(serviceMatch)) if (srcOf[c.file]) serviceImages[title] = srcOf[c.file];

  // --- documents: downloadable PDFs / Office files (Merkblätter, Checklisten,
  //     Formulare). Copied to public/files/<slug>/; title prefers a descriptive
  //     anchor text, else a prettified filename. ---
  const GENERIC = /^(download|herunterladen|pdf|hier|klicken?|mehr|link|datei|öffnen|oeffnen|ansehen|dokument|merkblatt|file|view|open)$/i;
  const linkText = new Map<string, string>();
  for (const p of pages) for (const l of (p.links || [])) {
    const href = typeof l === "string" ? l : (l?.href || l?.url || "");
    const txt = fixEncoding((typeof l === "string" ? "" : (l?.text || "")) || "").trim();
    if (href && txt && txt.length > 2 && !GENERIC.test(txt) && !linkText.has(norm(href))) linkText.set(norm(href), txt);
  }
  const docKind = (ct: string, file: string): DocKind | undefined => {
    if (/pdf/.test(ct) || /\.pdf$/i.test(file)) return "pdf";
    if (/word|wordprocessing/.test(ct) || /\.docx?$/i.test(file)) return "doc";
    if (/excel|spreadsheet/.test(ct) || /\.xlsx?$/i.test(file)) return "xls";
    return undefined;
  };
  const prettyDoc = (name: string) => fixEncoding(name).replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_][0-9a-f]{6,}$/i, "")                       // drop trailing cache-hash suffix
    .replace(/[_-]+/g, " ").replace(/([a-zäöü])([A-ZÄÖÜ])/g, "$1 $2")
    .replace(/([A-Za-zÄÖÜäöü])(\d)/g, "$1 $2").replace(/\s+/g, " ").trim();
  const docDir = join(import.meta.dirname, "..", "public", "files", slug);
  rmSync(docDir, { recursive: true, force: true });
  let docMade = false;
  const documents: DocAsset[] = [];
  const seenDoc = new Set<string>();
  for (const a of manifest) {
    if (!a.ok || !a.file) continue;
    const kind = docKind(a.content_type || "", a.file);
    if (!kind) continue;
    const orig = (a.file.split("/").pop() || "").replace(/^[0-9a-f]{6,}__/i, "");
    const dk = `${orig.toLowerCase()}|${a.bytes || 0}`;
    if (seenDoc.has(dk)) continue;
    seenDoc.add(dk);
    const srcPath = join(ROOT, "scraper", "output", slug, a.file);
    if (!existsSync(srcPath)) continue;
    if (!docMade) { mkdirSync(docDir, { recursive: true }); docMade = true; }
    const fn = a.file.split("/").pop()!;
    copyFileSync(srcPath, join(docDir, fn));
    documents.push({ src: `/files/${slug}/${fn}`, title: tidyText(linkText.get(norm(a.url || "")) || prettyDoc(orig)), kind, bytes: a.bytes || 0 });
    if (documents.length >= 24) break;
  }
  documents.sort((a, b) => a.title.localeCompare(b.title, "de"));

  const srcs = (k: MediaKind) => assets.filter((a) => a.kind === k).map((a) => a.src);
  // general photo pool, ordered landscape-first (the safe default for hero/section/
  // gallery slots); portraits sink to the end. Aspect lives on each asset for
  // finer per-slot picking by the creator.
  const photoPoolAssets = assets.filter((a) => a.kind === "photo" || a.kind === "hero");
  const aspectRank = (o?: Orientation) => (o === "landscape" ? 0 : o === "square" ? 1 : 2);
  // subject rank: city/office shots lead (hero/section-worthy), generic next,
  // person PORTRAITS sink to the very end so they're never picked for hero/feature.
  const subjRank = (s?: ImageSubject) => (s === "city" || s === "office" ? 0 : s === "portrait" ? 2 : 1);
  photoPoolAssets.sort((a, b) => subjRank(a.subject) - subjRank(b.subject) || aspectRank(a.orientation) - aspectRank(b.orientation) || b.bytes - a.bytes);
  return {
    logo: srcs("logo")[0] || srcs("logo-light")[0],
    logoLight: srcs("logo-light")[0],
    hero: heroImage,
    badges: srcs("badge"),
    photos: photoPoolAssets.filter((a) => a.subject !== "portrait").map((a) => a.src),
    serviceImages,
    documents,
    assets,
  };
}

/**
 * optimizeMedia — shrink/recompress the copied hero & content photos in place so
 * the generated site ships reasonable assets instead of multi-MB originals. Logos
 * and SVGs are left untouched (crisp marks); dimensions/bytes are updated to the
 * post-resize values. Gracefully skipped if `sharp` is unavailable.
 */
async function optimizeMedia(lib: MediaLibrary): Promise<{ saved: number; n: number }> {
  let sharp: any;
  try { sharp = (await import("sharp")).default; } catch { return { saved: 0, n: 0 }; }
  const imgDir = join(import.meta.dirname, "..", "public", "images", slug);
  const recompress = async (buf: Buffer, file: string): Promise<Buffer> =>
    /\.png$/i.test(file) ? sharp(buf).png({ compressionLevel: 9, palette: true }).toBuffer()
    : /\.webp$/i.test(file) ? sharp(buf).webp({ quality: 82 }).toBuffer()
    : sharp(buf).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  let saved = 0, n = 0;
  // 1) pool photos & hero crops (cap longest edge); logos/badges/svg untouched
  for (const a of lib.assets) {
    if ((a.kind !== "photo" && a.kind !== "hero") || /\.svg$/i.test(a.src)) continue;
    const file = join(imgDir, "pool", a.src.split("/").pop()!);
    if (!existsSync(file)) continue;
    try {
      // read bytes with Node sync fs first (sharp's own file-open races on Windows
      // against the copyFileSync we just did), then process the in-memory buffer.
      const input = readFileSync(file);
      const max = a.kind === "hero" ? 1920 : 1600;
      const resized = await sharp(input).rotate().resize({ width: max, height: max, fit: "inside", withoutEnlargement: true }).toBuffer();
      const out = await recompress(resized, file);
      if (out.length < (a.bytes || Infinity)) {
        saved += (a.bytes || 0) - out.length; n++;
        writeFileSync(file, out);
        const m = await sharp(out).metadata();
        a.bytes = out.length; a.width = m.width; a.height = m.height;
        a.orientation = m.width >= m.height * 1.15 ? "landscape" : m.width <= m.height * 0.87 ? "portrait" : "square";
      }
    } catch { /* leave original */ }
  }
  // 2) the dedicated full-bleed hero file
  if (lib.hero && !/\.svg$/i.test(lib.hero)) {
    const hf = join(imgDir, lib.hero.split("/").pop()!);
    if (existsSync(hf)) try {
      const input = readFileSync(hf);
      const before = input.length;
      const resized = await sharp(input).rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).toBuffer();
      const out = await recompress(resized, hf);
      if (out.length < before) { saved += before - out.length; n++; writeFileSync(hf, out); }
    } catch { /* leave original */ }
  }
  return { saved, n };
}

/**
 * dedupePerceptual — kill VISUAL duplicates the content hash can't see: the same
 * picture re-encoded or re-named (different bytes), responsive crops with odd
 * suffixes, the hero photo pooled again, or a logo kept twice (original + recolour).
 * Compares a perceptual dHash (structure, not bytes). Conservative by design:
 *  - drops pool photos that look like the served hero (one big repeat, the #1 cause),
 *  - keeps only one of each logo/badge cluster (recoloured copies collapse),
 *  - drops near-duplicate non-portrait photos, keeping the largest,
 *  - NEVER merges person PORTRAITS (two real team faces must both survive).
 * Stores the dHash on every surviving asset so the renderer can use it as a net.
 */
async function dedupePerceptual(lib: MediaLibrary): Promise<number> {
  let sharp: any;
  try { sharp = (await import("sharp")).default; } catch { return 0; }
  const imgDir = join(import.meta.dirname, "..", "public", "images", slug);
  const fileOf = (src: string) => { const n = src.split("/").pop()!; return src.includes("/pool/") ? join(imgDir, "pool", n) : join(imgDir, n); };
  // dHash: 9×8 greyscale, each bit = "pixel brighter than its right neighbour".
  const dhash = async (file: string): Promise<bigint | null> => {
    try {
      // Read bytes via Node fs first — sharp's own file-open races on Windows
      // against the writeFileSync optimizeMedia just performed on this same file.
      const input = readFileSync(file);
      const buf = await sharp(input, { failOn: "none" }).flatten({ background: "#ffffff" }).greyscale().resize(9, 8, { fit: "fill" }).raw().toBuffer();
      let bits = 0n;
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const i = r * 9 + c; bits = (bits << 1n) | (buf[i] > buf[i + 1] ? 1n : 0n); }
      return bits;
    } catch { return null; }
  };
  const ham = (a: bigint, b: bigint) => { let x = a ^ b, n = 0; while (x) { n += Number(x & 1n); x >>= 1n; } return n; };

  const ph = new Map<string, bigint>();
  for (const a of lib.assets) { const h = await dhash(fileOf(a.src)); if (h !== null) { ph.set(a.src, h); a.phash = h.toString(16); } }
  const heroH = lib.hero ? await dhash(fileOf(lib.hero)) : null;
  const logoH = lib.logo ? ph.get(lib.logo) ?? null : null;
  const drop = new Set<string>();
  const portrait = (a: MediaAsset) => a.subject === "portrait";

  // 1) any pool image that is just the hero again (the most common, most glaring
    //  repeat) — checked across ALL kinds, since a hero photo sometimes lands in the
    //  pool mis-tagged as a "badge". The hero is never a portrait or a logo, so
    //  anything that resembles it IS the hero, whatever its kind.
  if (heroH !== null) for (const a of lib.assets) {
    const h = ph.get(a.src); if (h !== undefined && ham(h, heroH) <= 6) drop.add(a.src);
  }
  // 2) logos/badges: one per perceptual cluster. The firm's own logo is the anchor,
  //    so a pooled copy of it (and any recoloured/variant duplicate) collapses.
  const kept: bigint[] = logoH !== null ? [logoH] : [];
  for (const a of lib.assets) {
    if (!(a.kind === "logo" || a.kind === "logo-light" || a.kind === "badge") || drop.has(a.src) || a.src === lib.logo) continue;
    const h = ph.get(a.src); if (h === undefined) continue;
    if (kept.some((k) => ham(k, h) <= 4)) drop.add(a.src); else kept.push(h);
  }
  // 3) photos: keep the largest of each near-duplicate cluster. Non-portraits use a
  //    normal threshold; PORTRAITS only collapse on a near-exact match, so a re-upload
  //    of ONE face merges while two DIFFERENT team members (often similar studio
  //    shots) never do. Like-with-like only (a portrait never merges into a scene).
  const photos = lib.assets.filter((a) => (a.kind === "photo" || a.kind === "hero") && !drop.has(a.src))
    .sort((a, b) => (b.bytes || 0) - (a.bytes || 0));
  const keptPhotos: { h: bigint; p: boolean }[] = [];
  for (const a of photos) {
    const h = ph.get(a.src); if (h === undefined) continue;
    const p = portrait(a), lim = p ? 2 : 5;
    if (keptPhotos.some((k) => k.p === p && ham(k.h, h) <= lim)) drop.add(a.src); else keptPhotos.push({ h, p });
  }

  if (!drop.size) return 0;
  lib.assets = lib.assets.filter((a) => !drop.has(a.src));
  lib.photos = (lib.photos || []).filter((s) => !drop.has(s));
  lib.badges = (lib.badges || []).filter((s) => !drop.has(s));
  if (lib.sectionBackgrounds) lib.sectionBackgrounds = lib.sectionBackgrounds.filter((s) => !drop.has(s));
  if (lib.serviceImages) for (const k of Object.keys(lib.serviceImages)) if (drop.has(lib.serviceImages[k])) delete lib.serviceImages[k];
  for (const s of drop) { try { const f = fileOf(s); if (existsSync(f)) rmSync(f, { force: true }); } catch { /* leave file */ } }
  return drop.size;
}

/** Raw pixel stats for one image buffer: greyscale entropy + libvips Laplacian
 *  sharpness (from sharp.stats), plus channel-mean brightness and channel-stdev
 *  contrast. Shared by scoreQuality and the hero picker. undefined on failure. */
async function pixelStats(sharp: any, buf: Buffer): Promise<{ entropy: number; sharpness: number; contrast: number; mean: number; opaque: boolean } | undefined> {
  try {
    const st = await sharp(buf, { failOn: "none" }).stats();
    const ch = st.channels.slice(0, 3);                          // RGB (ignore alpha)
    const mean = ch.reduce((s: number, c: any) => s + c.mean, 0) / ch.length;
    const contrast = ch.reduce((s: number, c: any) => s + c.stdev, 0) / ch.length;
    return { entropy: st.entropy ?? 0, sharpness: typeof st.sharpness === "number" ? st.sharpness : NaN, contrast, mean, opaque: st.isOpaque !== false };
  } catch { return undefined; }
}

/**
 * scoreQuality — a 0..1 TECHNICAL-quality score per content photo, from cheap,
 * deterministic pixel statistics (no ML, no extra deps — sharp is already used):
 * detail (entropy), sharpness (Laplacian variance, RANK-normalised within the
 * firm's pool), contrast + exposure (channel stdev/brightness) and compression
 * density (bytes/pixel). The actual maths live in ./imageQuality (one source of
 * truth, shared with the calibration audit). The score RANKS the photo pool and
 * GATES the hero/feature/background roles (imageRoles) — strong shots front the
 * most visible slots, blurry/flat/graphic ones sink to the gallery or out.
 * Logos/badges/SVGs aren't scored. Skipped (assets unscored ⇒ neutral) if `sharp`
 * is unavailable.
 */
async function scoreQuality(lib: MediaLibrary): Promise<void> {
  let sharp: any;
  try { sharp = (await import("sharp")).default; } catch { return; }
  const imgDir = join(import.meta.dirname, "..", "public", "images", slug);
  const fileOf = (src: string) => { const n = src.split("/").pop()!; return src.includes("/pool/") ? join(imgDir, "pool", n) : join(imgDir, n); };

  const photos = lib.assets.filter((a) => (a.kind === "photo" || a.kind === "hero") && !/\.svg$/i.test(a.src));
  const raws: { a: MediaAsset; st: NonNullable<Awaited<ReturnType<typeof pixelStats>>> }[] = [];
  for (const a of photos) {
    const f = fileOf(a.src);
    if (!existsSync(f)) continue;
    const st = await pixelStats(sharp, readFileSync(f));
    if (st) raws.push({ a, st });
  }
  // sharpness scale is image/version-dependent → rank-normalise within this pool.
  const sv = raws.map((r) => r.st.sharpness).filter((x) => !Number.isNaN(x)).sort((x, y) => x - y);
  for (const { a, st } of raws) {
    const bpp = a.width && a.height ? a.bytes / (a.width * a.height) : 0;
    a.quality = compositeQuality({ entropy: st.entropy, sharpRank: rankIn(sv, st.sharpness), contrast: st.contrast, mean: st.mean, opaque: st.opaque, bpp });
  }
}

/**
 * dropLowQualityGraphics — Tier-1.5 cleanup. The kind classifier tags by filename,
 * so map screenshots, app-icons, diagrams, youtube thumbnails and near-blank banners
 * slip through as "photo". The technical score (entropy/contrast/transparency caps)
 * exposes them at the very bottom; here we PRUNE the non-stock photo/hero assets at
 * or below the floor entirely — not just from prominent roles — so they never reach
 * a gallery either. Curated stock is kept (deliberate fallback). Runs BEFORE stock
 * so the pruning's gaps get refilled. Mirrors dedupePerceptual's removal. No-op when
 * `sharp` was unavailable (no scores ⇒ nothing pruned). Returns the count removed.
 */
const GRAPHIC_Q_FLOOR = 0.25;
function dropLowQualityGraphics(lib: MediaLibrary): number {
  const drop = new Set<string>();
  for (const a of lib.assets) {
    if ((a.kind === "photo" || a.kind === "hero") && !a.stock && typeof a.quality === "number" && a.quality <= GRAPHIC_Q_FLOOR) drop.add(a.src);
  }
  if (!drop.size) return 0;
  const imgDir = join(import.meta.dirname, "..", "public", "images", slug);
  const fileOf = (src: string) => { const n = src.split("/").pop()!; return src.includes("/pool/") ? join(imgDir, "pool", n) : join(imgDir, n); };
  lib.assets = lib.assets.filter((a) => !drop.has(a.src));
  lib.photos = (lib.photos || []).filter((s) => !drop.has(s));
  if (lib.sectionBackgrounds) lib.sectionBackgrounds = lib.sectionBackgrounds.filter((s) => !drop.has(s));
  if (lib.serviceImages) for (const k of Object.keys(lib.serviceImages)) if (drop.has(lib.serviceImages[k])) delete lib.serviceImages[k];
  for (const s of drop) { try { const f = fileOf(s); if (existsSync(f)) rmSync(f, { force: true }); } catch { /* leave file */ } }
  return drop.size;
}

/**
 * detectFaces — Tier-2 face pass. Runs a tiny ONNX face detector
 * (models/face-detector-rfb320.onnx) over each content photo to (a) record the face
 * count and (b) firm up the `subject` classification beyond the filename/orientation
 * heuristic: a single detected face — or any face in a vertical/square frame — marks
 * the image a person PORTRAIT, so it is routed to team/gallery and kept OUT of the
 * hero/feature/service slots (a face must never front those). A multi-person
 * landscape (≥2 faces) stays a SCENE (a team/office hero is fine), and a
 * filename-confirmed city/office scene is never overridden. Offline + deterministic.
 * Skipped gracefully (subjects fall back to the heuristic) if onnxruntime-node or the
 * model file is unavailable. Returns how many assets contained ≥1 face.
 */
async function detectFaces(lib: MediaLibrary): Promise<number> {
  let ort: any, sharp: any;
  try { const m = await import("onnxruntime-node"); ort = m.default ?? m; } catch { return 0; }
  try { sharp = (await import("sharp")).default; } catch { return 0; }
  const modelPath = join(import.meta.dirname, "..", "models", "face-detector-rfb320.onnx");
  if (!existsSync(modelPath)) return 0;
  let sess: any;
  try { if (ort.env) ort.env.logLevel = "error"; sess = await ort.InferenceSession.create(modelPath, { logSeverityLevel: 3 }); } catch { return 0; }

  const W = 320, H = 240, CONF = 0.7, IOU = 0.3;
  const imgDir = join(import.meta.dirname, "..", "public", "images", slug);
  const fileOf = (src: string) => { const n = src.split("/").pop()!; return src.includes("/pool/") ? join(imgDir, "pool", n) : join(imgDir, n); };
  const iou = (a: number[], b: number[]) => {
    const x1 = Math.max(a[0], b[0]), y1 = Math.max(a[1], b[1]), x2 = Math.min(a[2], b[2]), y2 = Math.min(a[3], b[3]);
    const w = Math.max(0, x2 - x1), h = Math.max(0, y2 - y1), inter = w * h;
    const ua = (a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter;
    return ua > 0 ? inter / ua : 0;
  };

  let withFaces = 0;
  for (const a of lib.assets) {
    if (a.kind !== "photo" && a.kind !== "hero") continue;
    const f = fileOf(a.src); if (!existsSync(f)) continue;
    let count = 0;
    try {
      const raw = await sharp(readFileSync(f), { failOn: "none" }).resize(W, H, { fit: "fill" }).removeAlpha().raw().toBuffer();
      const inp = new Float32Array(3 * H * W);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 3; for (let c = 0; c < 3; c++) inp[c * H * W + y * W + x] = (raw[i + c] - 127) / 128; }
      const out = await sess.run({ [sess.inputNames[0]]: new ort.Tensor("float32", inp, [1, 3, H, W]) });
      const sc = out.scores.data as Float32Array, bx = out.boxes.data as Float32Array, N = sc.length / 2;
      const cand: { s: number; b: number[] }[] = [];
      for (let i = 0; i < N; i++) { const s = sc[i * 2 + 1]; if (s > CONF) cand.push({ s, b: [bx[i * 4], bx[i * 4 + 1], bx[i * 4 + 2], bx[i * 4 + 3]] }); }
      cand.sort((p, q) => q.s - p.s);
      const keep: number[][] = [];
      for (const c of cand) if (!keep.some((k) => iou(k, c.b) > IOU)) keep.push(c.b);
      count = keep.length;
    } catch { continue; }
    a.faces = count;
    if (count >= 1) {
      withFaces++;
      // person shot unless it's a confirmed city/office SCENE or a multi-person
      // landscape group (both make fine heroes).
      const landscapeGroup = a.orientation === "landscape" && count >= 2;
      if (!landscapeGroup && a.subject !== "city" && a.subject !== "office") a.subject = "portrait";
    }
  }
  return withFaces;
}

/**
 * classifySubjectCLIP — Tier-3 semantic pass. Zero-shot CLIP (Transformers.js,
 * quantized ViT-B/32) labels each content photo against a fixed prompt set and uses
 * the result to (a) SHARPEN `subject` (office / city / portrait / generic) far more
 * accurately than the filename heuristic — so heroes and section images are chosen
 * by what the picture actually shows — and (b) REMOVE semantic non-photos a logo or
 * a screenshot/diagram the kind+quality+filename filters all missed (e.g. a colourful
 * logo or app-icon that scored fine on entropy). A Tier-2 face PORTRAIT is never
 * overridden. Deterministic; the model is fetched once into .models-cache (gitignored).
 * Skipped gracefully (subjects keep their heuristic value) if Transformers.js or the
 * model is unavailable. Returns {refined, removed}.
 */
const CLIP_LABELS = [
  "a professional headshot portrait of a person",        // 0 → portrait
  "a photograph of an office interior or workplace",     // 1 → office
  "a photograph of a city skyline and buildings",        // 2 → city
  "a photo of business people working or meeting",       // 3 → office (work scene)
  "a screenshot, document, chart, diagram or graphic",   // 4 → graphic (remove)
  "a company logo or app icon",                          // 5 → logo (remove)
  "a decorative background photograph",                  // 6 → generic
];
const CLIP_CAT: (ImageSubject | "graphic" | "logo")[] = ["portrait", "office", "city", "office", "graphic", "logo", "generic"];
const CLIP_REMOVE_CONF = 0.7;
async function classifySubjectCLIP(lib: MediaLibrary): Promise<{ refined: number; removed: number }> {
  let tf: any, sharp: any;
  try { tf = await import("@huggingface/transformers"); } catch { return { refined: 0, removed: 0 }; }
  try { sharp = (await import("sharp")).default; } catch { return { refined: 0, removed: 0 }; }
  try { tf.env.cacheDir = join(import.meta.dirname, "..", ".models-cache"); } catch { /* default cache */ }
  let pipe: any;
  try { pipe = await tf.pipeline("zero-shot-image-classification", "Xenova/clip-vit-base-patch32", { dtype: "q8" }); } catch { return { refined: 0, removed: 0 }; }

  const imgDir = join(import.meta.dirname, "..", "public", "images", slug);
  const fileOf = (src: string) => { const n = src.split("/").pop()!; return src.includes("/pool/") ? join(imgDir, "pool", n) : join(imgDir, n); };
  // Decode via our own sharp (fixed-square fill + raw, NO colourspace resolution) and
  // build the RawImage directly: Transformers.js's RawImage.read resolves the image's
  // colourspace, which throws on assets whose embedded profile is non-standard once
  // libvips is warmed up (the "space not set" failure). The CLIP processor resizes/
  // normalises from here, so a 224² square is enough.
  const S = 224;
  const toImage = async (f: string) => {
    const buf = await sharp(readFileSync(f), { failOn: "none" }).resize(S, S, { fit: "fill" }).removeAlpha().raw().toBuffer();
    const ch = buf.length / (S * S);
    let img = new tf.RawImage(new Uint8ClampedArray(buf), S, S, ch);
    if (img.channels !== 3) img = img.rgb();
    return img;
  };
  const remove = new Set<string>();
  let refined = 0;
  for (const a of lib.assets) {
    if (a.kind !== "photo" && a.kind !== "hero") continue;
    const f = fileOf(a.src); if (!existsSync(f)) continue;
    let idx = -1, score = 0;
    try {
      const out = await pipe(await toImage(f), CLIP_LABELS);
      idx = CLIP_LABELS.indexOf(out[0].label); score = out[0].score;
    } catch { continue; }
    if (idx < 0) continue;
    const cat = CLIP_CAT[idx];
    if ((cat === "graphic" || cat === "logo") && score >= CLIP_REMOVE_CONF && !a.stock) { remove.add(a.src); continue; }
    if (a.subject === "portrait") continue;                 // keep a confirmed Tier-2 face portrait
    if (cat === "portrait" || cat === "office" || cat === "city" || cat === "generic") {
      if (a.subject !== cat) { a.subject = cat; refined++; }
    }
  }
  if (remove.size) {
    lib.assets = lib.assets.filter((a) => !remove.has(a.src));
    lib.photos = (lib.photos || []).filter((s) => !remove.has(s));
    if (lib.sectionBackgrounds) lib.sectionBackgrounds = lib.sectionBackgrounds.filter((s) => !remove.has(s));
    if (lib.serviceImages) for (const k of Object.keys(lib.serviceImages)) if (remove.has(lib.serviceImages[k])) delete lib.serviceImages[k];
    for (const s of remove) { try { const fp = fileOf(s); if (existsSync(fp)) rmSync(fp, { force: true }); } catch { /* leave file */ } }
  }
  return { refined, removed: remove.size };
}

/**
 * stockFallback — when the scrape yields little/no usable imagery, fill the empty
 * slots (hero, gallery photos, service cards, section backgrounds) from the curated
 * CC stock pack in design-system/stock/. Picks are deterministic per domain, copied
 * into the firm pool, optimized, flagged `stock:true` + credited. Honesty rule:
 * stock is a FALLBACK only (real assets always win) and is never used for team faces.
 */
type StockPick = { topic: string; file: string; abs: string; width: number; height: number; credit?: string; source?: string; hash: string };
async function stockFallback(lib: MediaLibrary): Promise<number> {
  const STOCK = join(import.meta.dirname, "..", "stock");
  if (!existsSync(STOCK)) return 0;
  let credits: Record<string, any> = {};
  try { credits = JSON.parse(readFileSync(join(STOCK, "credits.json"), "utf-8")); } catch { /* none */ }
  const pool: StockPick[] = [];
  for (const topic of ["city", "skyline", "architecture", "landscape", "swiss", "office", "reception", "boardroom", "meeting", "consultation", "handshake", "team", "advisory", "desk", "documents", "laptop", "finance", "success", "texture"]) {
    let files: string[] = [];
    try { files = readdirSync(join(STOCK, topic)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)); } catch { continue; }
    for (const f of files) {
      const abs = join(STOCK, topic, f);
      const d = imageSize(abs) || { width: 1600, height: 1067 };
      const c = credits[`${topic}/${f}`];
      const author = (c?.author || "").replace(/^(.{3,40}?)\1$/, "$1").trim().slice(0, 42); // collapse doubled author text
      const hash = createHash("md5").update(readFileSync(abs)).digest("hex"); // same photo filed under two topics -> one identity
      pool.push({ topic, file: f, abs, width: d.width, height: d.height, credit: c ? `${author || "Unbekannt"} (${c.license})` : undefined, source: c?.source, hash });
    }
  }
  if (!pool.length) return 0;

  // deterministic per-firm RNG so re-generation is stable
  let seed = 0; for (const ch of String(site.domain || slug)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const used = new Set<string>();   // CONTENT hashes already placed (dedupe the same photo across topics)
  const pick = (topics: string[]): StockPick | undefined => {
    const c = pool.filter((p) => topics.includes(p.topic) && !used.has(p.hash));
    return c.length ? c[Math.floor(rng() * c.length)] : undefined;
  };

  const sharp = await import("sharp").then((m) => m.default).catch(() => undefined as any);
  const destDir = join(import.meta.dirname, "..", "public", "images", slug, "pool");
  const creditSet = new Set<string>();
  let added = 0;
  const place = async (p: StockPick, kind: MediaKind, cap: number): Promise<string | undefined> => {
    used.add(p.hash);
    try {
      mkdirSync(destDir, { recursive: true });
      const fn = `stock-${p.topic}-${p.file.replace(/^[a-z]+-\d+-/, "")}`;
      const out = join(destDir, fn);
      let bytes = 0, w = p.width, h = p.height;
      if (sharp) {
        const buf = await sharp(readFileSync(p.abs)).rotate().resize({ width: cap, height: cap, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
        writeFileSync(out, buf); bytes = buf.length; const m = await sharp(buf).metadata(); w = m.width || w; h = m.height || h;
      } else { copyFileSync(p.abs, out); bytes = statSync(out).size; }
      const src = `/images/${slug}/pool/${fn}`;
      const orientation: Orientation = w >= h * 1.15 ? "landscape" : w <= h * 0.87 ? "portrait" : "square";
      lib.assets.push({ src, kind, alt: "", bytes, width: w, height: h, orientation, subject: classifySubject(fn, p.topic, orientation), stock: true, credit: p.credit, source: p.source });
      if (p.credit) creditSet.add(p.credit);
      added++;
      return src;
    } catch { return undefined; }
  };

  // aggressive trigger: also when few / low-resolution real images
  const usable = lib.assets.filter((a) => (a.kind === "photo" || a.kind === "hero") && (a.width ?? 0) >= 1000 && !a.stock);
  const imagePoor = usable.length < 2;

  // hero: prefer wide, cinematic, full-bleed-grade topics
  // Hero stock = ONLY the four allowed motifs: Zürich/city, landscape, office
  // interior, or an accounting-activity detail (desk/documents/laptop/finance).
  if (!lib.hero) { const p = pick(["city", "skyline", "architecture", "landscape", "swiss", "office", "reception", "boardroom", "desk", "documents", "laptop", "finance"]); if (p) { const s = await place(p, "hero", 1920); if (s) lib.hero = s; } }
  if (imagePoor) {
    // The gallery ("Einblicke") is filled with REAL scraped photos ONLY — never
    // topped up with stock. Too few real photos ⇒ no gallery (gated ≥3 at render).
    lib.serviceImages = lib.serviceImages || {};
    for (const s of SERVICE_CANON) {
      if (lib.serviceImages[s.title]) continue;
      const p = pick(["desk", "finance", "documents", "laptop", "advisory", "office", "meeting", "success"]) || pick(["team", "city"]); if (!p) break; // prefer work-themed shots for service cards
      const src = await place(p, "photo", 1280); if (src) lib.serviceImages[s.title] = src;
    }
    // decorative section backgrounds reuse already-placed stock landscape images
    // (they sit behind a brand scrim) — prefer wide hero-grade scenery.
    const land = lib.assets.filter((a) => a.stock && a.orientation === "landscape").map((a) => a.src);
    const heroGrade = land.filter((s) => /stock-(city|skyline|architecture|landscape|swiss)-/.test(s));
    const bg = [...new Set([...heroGrade, ...land])].slice(0, 3);
    if (bg.length) lib.sectionBackgrounds = bg;
  }

  if (added) { lib.stock = true; lib.credits = [...creditSet]; }
  return added;
}

const media = buildMedia();
const opt = await optimizeMedia(media);
// Kill VISUAL duplicates (hero pooled twice, recoloured logos, re-encoded photos)
// before stock fills any remaining gaps — run on the optimized files.
const dropN = await dedupePerceptual(media);
// Tier-1 quality scoring runs BEFORE stock so the graphic-cleanup can prune
// mis-classified "photos" (maps/icons/diagrams the filename filter missed) and
// stock then refills any real gap the pruning opens. A final re-score covers the
// stock additions so ranking + role gating see the whole pool.
await scoreQuality(media);
const droppedLowQ = dropLowQualityGraphics(media);
const stockN = await stockFallback(media);
await scoreQuality(media);
// Tier-2 face pass: refine `subject` with real face detection (catches person
// shots the filename/orientation heuristic missed) so portraits sink in the gallery
// rank below and are kept out of hero/feature/service via imageRoles.
const facePhotos = await detectFaces(media);
// Tier-3 semantic pass: CLIP zero-shot sharpens `subject` (what the picture actually
// shows) and removes semantic non-photos (logos/screenshots/diagrams) the earlier
// filters missed. Runs after faces so a confirmed portrait is never overridden.
const clip = await classifySubjectCLIP(media);

// The gallery is SCENES only — portraits belong in the team cards, never the
// gallery. Subjects are FINAL now (post face + CLIP passes), so drop any portrait
// the early heuristic missed, then rank the rest by quality (city/office lead).
{
  const aOf = (src: string) => media.assets.find((a) => a.src === src);
  const subjRank = (s?: ImageSubject) => (s === "city" || s === "office" ? 0 : 1);
  media.photos = media.photos
    .filter((src) => { const a = aOf(src); return !!a && a.subject !== "portrait" && !a.stock; })
    .sort((x, y) => {
      const ax = aOf(x), ay = aOf(y);
      return subjRank(ax?.subject) - subjRank(ay?.subject) || (ay?.quality ?? 0) - (ax?.quality ?? 0);
    });
}

// Tag every content asset with the page SLOTS it suits, on FINAL (post-optimize,
// post-stock, post-score) dimensions + quality, so the creator can wire a fitting
// image per element and weak shots stay out of the hero/feature slots.
for (const a of media.assets) a.roles = imageRoles(a);
// Firms with real imagery get no stock-derived section backgrounds; fill them from
// the real background-suitable assets so CTA bands / sub-page headers (both creators
// draw decorative bgs from media.sectionBackgrounds) use a wide, fitting shot.
if (!media.sectionBackgrounds?.length) {
  const bg = media.assets.filter((a) => !a.stock && a.roles?.includes("background")).map((a) => a.src);
  if (bg.length) media.sectionBackgrounds = [...new Set(bg)].slice(0, 3);
}

// --- REAL social proof only (briefing honesty rule): testimonials / stats /
//     pricing are shown ONLY when extractable from the scrape, never fabricated.
const QUOTE_RE = /[„“"»«”]([^„“"»«”]{40,400})[„“"”«»]/;
// A quoted string that is a qualification/credential, not a client testimonial —
// these leak into the quote regex (e.g. "eidg. diplomierter Experte …") and must
// never be shown as a customer voice.
const CREDENTIAL_RE = /eidg\.|dipl\.|diplom|fachausweis|fachfrau|fachmann|zugelassen|treuhandkammer|expertsuisse|zertifizier|mitglied\s+(der|von|des)/i;
function realTestimonials(cty: string): SiteContent["testimonials"]["items"] | undefined {
  if (!analysis.has?.testimonials) return undefined;
  const tPages = dePages.filter((p) => /testimonial|referenz|kundenstimm|kundenmeinung|bewertung|feedback|das-sagen|stimmen/i.test(`${p.url || ""} ${p.title || ""}`));
  const scan = (tPages.length ? tPages : (homeDe ? [home] : []));
  const items: { quote: string; person: string; company?: string; city?: string }[] = [];
  const seen = new Set<string>();
  for (const p of scan) {
    const lines = fixEncoding(p.text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(QUOTE_RE);
      if (!m) continue;
      const quote = m[1].trim();
      if (CREDENTIAL_RE.test(quote)) continue;   // a qualification, not a testimonial
      if (looksFrench(quote) || isCorrupted(quote)) continue; // French / decode-corrupted quote
      const key = quote.slice(0, 40).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const after = lines[i].split(m[0])[1] || "";
      const nm = after.match(/[—–-]\s*([A-ZÄÖÜ][\wäöüé.]+(?:\s+[A-ZÄÖÜ][\wäöüé.]+){0,2})/)
        || (lines[i + 1] && lines[i + 1].length < 60 && !QUOTE_RE.test(lines[i + 1])
            ? lines[i + 1].match(/^[—–-]?\s*([A-ZÄÖÜ][\wäöüé.]+(?:\s+[A-ZÄÖÜ][\wäöüé.]+){0,2})$/) : null);
      // Honesty rule: an unattributed quote is not verifiable social proof — omit
      // it rather than inventing a "Mandant" placeholder.
      if (!nm) continue;
      items.push({ quote, person: nm[1], city: cty });
    }
  }
  return items.length >= 2 ? items.slice(0, 4) : undefined;
}
function realStats(): SiteContent["stats"]["items"] | undefined {
  const text = fixEncoding(dePages.map((p) => p.text || "").join("\n"));
  const out: { value: string; label: string }[] = [];
  const push = (value: string, label: string) => { if (!out.some((o) => o.label === label)) out.push({ value, label }); };
  // ALL client synonyms (Mandate/Mandanten/Kunden/Kundinnen/KMU/Unternehmen) are ONE
  // metric — collect candidates and emit exactly ONE, so the page never shows e.g.
  // "80000+ Unternehmen" next to "38+ KMU".
  const CLIENTISH = /^(mandate|mandanten|kunden|kundinnen|kmu|unternehmen)$/i;
  const clientCounts: { value: string; n: number; label: string }[] = [];
  // Experience under ~3 years undercuts trust and is usually a mis-parse ("seit
  // 2025" → "1+") — only surface a meaningful span.
  const MIN_YEARS = 3;
  // "seit 1985" / "gegründet 1906" / "gegründet im Jahr 1985" / "Gründung 1972" → Jahre Erfahrung.
  const since = text.match(/\b(?:seit|gegr(?:ündet|uendet)|gegr\.|gr[üu]ndung(?:\s+im\s+jahr)?|established|founded|est\.)\s*(?:im\s+(?:jahr\s+)?)?((?:18|19|20)\d{2})\b/i);
  if (since) { const y = +since[1]; const yrs = 2026 - y; if (y > 1850 && y <= 2026 && yrs >= MIN_YEARS) push(`${yrs}+`, "Jahre Erfahrung"); }
  // Capture grouped numbers too (Swiss "1'000", "10'000") so a thousands
  // separator isn't truncated to a bare "000".
  for (const m of text.matchAll(/\b(\d{1,3}(?:[\s'’.  ]\d{3})+|\d{2,6})\s*\+?\s*(Mandate|Mandanten|Kunden|Kundinnen|Unternehmen|KMU|Mitarbeitende|Mitarbeiter)\b/gi)) {
    const digits = m[1].replace(/\D/g, "");
    if (!/[1-9]/.test(digits)) continue;          // skip mis-parsed fragments like "000"
    const w = m[2], n = +digits, value = `${digits}+`;
    if (digits.length === 4 && n >= 1990 && n <= 2099) continue; // a year ("…2024. KMU…") mis-read as a count
    // "Mitarbeiter" and "Mitarbeitende" are the same metric — one label so a firm
    // never shows two contradictory headcounts (e.g. "15+" next to "250+").
    const label = w.toLowerCase() === "kmu" ? "KMU"
      : /^mitarbeit/i.test(w) ? "Mitarbeitende"
      : w[0].toUpperCase() + w.slice(1).toLowerCase();
    if (CLIENTISH.test(w)) {
      if (n > 5000) continue;                     // absurd client count — discard
      clientCounts.push({ value, n, label });     // defer: emit only one below
      continue;
    }
    if (/^mitarbeit/i.test(w) && n > 500) continue; // implausible headcount — discard
    push(value, label);
  }
  // One client-count stat: prefer a plausible value (10–5000); among those, the
  // largest; else the largest of whatever remains.
  if (clientCounts.length) {
    const inRange = clientCounts.filter((cc) => cc.n >= 10 && cc.n <= 5000);
    const best = (inRange.length ? inRange : clientCounts).sort((a, b) => b.n - a.n)[0];
    push(best.value, best.label);
  }
  for (const m of text.matchAll(/\b(\d{1,3})\s*Jahre[n]?\s+(?:Erfahrung|Praxis)\b/gi)) { const yrs = +m[1]; if (yrs >= MIN_YEARS) push(`${yrs}+`, "Jahre Erfahrung"); }
  return out.length >= 2 ? out.slice(0, 4) : undefined;
}
function realPricing(): SiteContent["pricing"]["tiers"] | undefined {
  if (!analysis.has?.pricing) return undefined;
  const pPages = dePages.filter((p) => /preis|tarif|pakete|angebot|kosten|pricing/i.test(`${p.url || ""} ${p.title || ""}`));
  const prices: string[] = [];
  for (const p of (pPages.length ? pPages : (homeDe ? [home] : []))) {
    const text = fixEncoding(p.text || "");
    for (const m of text.matchAll(/(?:ab\s*)?CHF\s?(\d{2,4})(?:\.[-–]|\.\d{2})?\s*(?:\/\s*|pro\s+)?(?:Monat|Mt\.?|mtl\.?)/gi)) {
      const v = `ab CHF ${m[1]}`;
      if (!prices.includes(v)) prices.push(v);
    }
  }
  if (prices.length < 2) return undefined;
  // Sort ASCENDING by the numeric CHF amount BEFORE name assignment, so the cheapest
  // tier becomes "Starter" and the dearest "Komplett" (never "Komplett" < "Starter").
  const amount = (p: string) => +((p.match(/(\d{2,4})/) || [])[1] || 0);
  prices.sort((a, b) => amount(a) - amount(b));
  const names = ["Starter", "KMU", "Komplett", "Premium"];
  return prices.slice(0, 4).map((price, i) => ({ name: names[i] ?? `Paket ${i + 1}`, price, period: "/Monat", features: [], recommended: i === 1 }));
}

// --- REAL editorial text (briefing honesty rule): values / faq / tagline
//     are taken from the firm's OWN pages where present, else omitted (never faked).
const VALUE_STOP = /leistung|dienstleistung|kontakt|impressum|datenschutz|team|über uns|ueber uns|standort|news|blog|preise|öffnungszeit|cookie|newsletter|formular|anmeld|sitemap|navigation|men[üu]\b|autor|zusammenfassung|inhaltsverzeichnis|\bfazit\b|einleitung|quellen|kommentar|artikel|teilen|\bshare\b|weiterlesen|akzeptieren|einstellungen/i;
function realValues(): SiteContent["values"]["items"] | undefined {
  // only the firm's OWN positioning pages — never blog/ratgeber articles (noise)
  const scan = dePages.filter((p) => {
    const hay = `${decU(p.url)} ${p.title || ""}`;
    return /ueber-?uns|über-?uns|about-?us|\babout\b|philosoph|leitbild|unsere-?werte|warum-?wir|vorteile|grundsatz|versprechen/i.test(hay)
      && !/blog|news|ratgeber|aktuell|artikel|magazin|publikation|\/20\d\d\//i.test(hay);
  });
  const pool = scan.length ? scan : (homeDe ? [home] : []);
  const items: { title: string; body: string }[] = [];
  const seen = new Set<string>();
  for (const p of pool) {
    const bl = pageContentBlocks(p);
    for (let i = 0; i < bl.length - 1; i++) {
      if (!/^h[2-4]$/.test(bl[i].tag)) continue;
      const title = bl[i].text;
      if (title.length < 4 || title.length > 52 || /[?!]$/.test(title) || VALUE_STOP.test(title)) continue;
      if (teamNameSet.has(title.toLowerCase().trim())) continue; // a real team member's bio, not a value
      const nx = bl[i + 1];
      // body must be real prose, not a parenthetical CTA fragment ("(30 Min.) – …"),
      // and never boilerplate (cookie banner / nav / legal — budliger leaked cookie text).
      if (!nx || nx.tag !== "p" || nx.text.length < 40 || nx.text.length > 320 || /^[([]/.test(nx.text) || SVC_BOILER.test(nx.text)) continue;
      if (looksFrench(title) || looksFrench(nx.text) || looksEnglish(nx.text)) continue;   // foreign block on a mixed page
      const k = title.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      items.push({ title, body: nx.text });
      if (items.length >= 4) break;
    }
    if (items.length >= 4) break;
  }
  return items.length >= 3 ? items.slice(0, 4) : undefined;
}
/** REAL FAQ straight from FAQPage JSON-LD (mainEntity question + acceptedAnswer.text).
 *  This is clean, correctly PAIRED and COMPLETE — unlike the heading→next-block HTML
 *  heuristic, which clips answers to fragments ("für Gründungskosten rechnen …") and
 *  pairs the wrong block. Preferred whenever the firm ships FAQ structured data. */
function faqFromJsonLd(): { q: string; a: string }[] {
  const LEGAL_Q = /datenschutzerkl|personendaten|cookies?|bearbeiten wir ihre daten|welche daten|ihre rechte|widerruf|tracking/i;
  const out: { q: string; a: string }[] = [];
  const seen = new Set<string>();
  const clipAns = (raw: string): string => {
    const t = stripTags(String(raw || ""));
    if (t.length <= 320) return t;
    const cut = t.slice(0, 320); const i = cut.lastIndexOf(". ");
    return i > 120 ? cut.slice(0, i + 1) : cut.replace(/\s+\S*$/, "") + "…";
  };
  const add = (qRaw: any, aRaw: any) => {
    const q = stripTags(String(qRaw || "")); const a = clipAns(aRaw);
    if (q.length < 10 || q.length > 160 || a.length < 25) return;
    if (LEGAL_Q.test(q) || SVC_BOILER.test(a) || looksFrench(q) || looksFrench(a)) return;
    const k = q.toLowerCase().replace(/[^\wäöüéèàç\s]/g, "").split(/\s+/).filter(Boolean).slice(0, 6).join(" ");
    if (!k || seen.has(k)) return; seen.add(k);
    out.push({ q, a });
  };
  const ansText = (ans: any) => Array.isArray(ans) ? ans[0]?.text : ans?.text;
  const walk = (o: any) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (o["@graph"]) walk(o["@graph"]);
    const t = o["@type"]; const types = Array.isArray(t) ? t : [t];
    if (types.some((x: any) => /FAQPage/i.test(String(x))) && Array.isArray(o.mainEntity)) {
      for (const qn of o.mainEntity) add(qn?.name, ansText(qn?.acceptedAnswer));
    } else if (types.some((x: any) => /Question/i.test(String(x)))) {
      add(o.name, ansText(o.acceptedAnswer));
    }
    for (const k of Object.keys(o)) if (k !== "@graph" && typeof o[k] === "object") walk(o[k]);
  };
  for (const p of dePages) for (const j of (p.jsonld || [])) walk(j);
  return out.slice(0, 8);
}

function realFaq(): SiteContent["faq"]["items"] | undefined {
  // Prefer structured FAQ data (clean, paired, complete) over the HTML heuristic.
  const fromLd = faqFromJsonLd();
  if (fromLd.length >= 3) return fromLd;
  const scan = dePages.filter((p) => {
    const hay = `${decU(p.url)} ${p.title || ""}`;
    if (/datenschutz|impressum|cookie|privacy|agb|blog|news|ratgeber|magazin|aktuell|\/20\d\d\//i.test(hay)) return false;
    return /faq|haeufig|häufig|fragen|wissen|q-?a/i.test(hay);
  });
  // No fallback to arbitrary pages — better no FAQ than legal / blog noise.
  if (!scan.length) return undefined;
  const LEGAL_Q = /datenschutzerkl|personendaten|cookies?|bearbeiten wir ihre daten|welche daten|ihre rechte|widerruf|tracking/i;
  const TEASER_A = /der komplette guide|in diesem beitrag|lesen sie|jetzt mehr erfahren/i;
  const items: { q: string; a: string }[] = [];
  const seen = new Set<string>();
  for (const p of scan) {
    const bl = pageContentBlocks(p);
    for (let i = 0; i < bl.length - 1; i++) {
      const isQ = /^(h[2-4]|dt|summary)$/.test(bl[i].tag) && /\?$/.test(bl[i].text);
      if (!isQ) continue;
      let q = bl[i].text.replace(/^\s*\d{1,2}[.)]\s*/, ""); // strip a leading list number
      if (q.length < 10 || q.length > 160) continue;
      if (LEGAL_Q.test(q)) continue;                        // privacy / legal question, not a real FAQ
      const nx = bl[i + 1];
      if (!nx || !/^(p|dd)$/.test(nx.tag) || nx.text.length < 25 || nx.text.length > 600) continue;
      const a = nx.text;
      if (SVC_BOILER.test(a) || TEASER_A.test(a)) continue; // cookie/legal boilerplate or blog teaser
      if (looksFrench(q) || looksFrench(a)) continue;       // French Q/A on a mixed page
      // Reject truncated answers: must end on sentence punctuation/colon, unless long enough to stand alone.
      if (!/[.!?:]$/.test(a) && a.length < 60) continue;
      // Reject MID-sentence fragments: a real answer opens a sentence (capital / quote /
      // paren), never a clipped lowercase start like "für Gründungskosten …" / "lohnen –".
      if (!/^[A-ZÄÖÜ»„"'(]/.test(a.trim())) continue;
      // Dedup similar questions by their first ~6 normalised words.
      const k = q.toLowerCase().replace(/[^\wäöüéèàç\s]/g, "").split(/\s+/).filter(Boolean).slice(0, 6).join(" ");
      if (!k || seen.has(k)) continue; seen.add(k);
      items.push({ q, a });
      if (items.length >= 8) break;
    }
    if (items.length >= 8) break;
  }
  return items.length >= 3 ? items.slice(0, 8) : undefined;
}
function realTagline(): string | undefined {
  if (!homeDe) return undefined; // a French home gives no German tagline → scaffold
  if (desc && desc.length >= 20 && desc.length <= 160 && !looksFrench(desc) && !isCorrupted(desc)) return desc;
  const h2s = (home.headings?.h2 || []).map((t: string) => tidyText(fixEncoding(t)));
  return h2s.find((t: string) => t.length >= 15 && t.length <= 120 && /[a-zäöü]/.test(t) && !looksFrench(t) && !isCorrupted(t) && !/leistung|kontakt|team|news|blog|impressum|cookie/i.test(t));
}

/** REAL "Über uns" prose: lead + up to 3 paragraphs from the firm's own about /
 *  philosophy / company page. Omitted (→ generic default) when no usable prose. */
function realAbout(): AboutContent | undefined {
  const scan = dePages.filter((p) => {
    const hay = `${decU(p.url)} ${p.title || ""}`;
    // A genuine ABOUT/company page — NOT a how-to guide, ratgeber or blog. "firma" is
    // deliberately gone (it matched "EinzelFIRMA" / "FIRMengründung-guide"); a guide is
    // excluded even if its SEO title says "Unternehmen gründen". Bare path segments
    // (/wir, /team, /uns) are matched too (e.g. budliger.ch/wir).
    const isAbout = /ueber-?uns|über-?uns|about-?us|\babout\b|philosoph|leitbild|wer-wir|unternehmensprofil|firmenportr[äa]t|\bportrait\b|portr[äa]t|wir-ueber|unser-?team|\/(wir|team|uns)\b/i.test(hay);
    const isGuide = /blog|news|ratgeber|aktuell|artikel|magazin|publikation|guide|leitfaden|tipps?|\bwissen\b|\bfaq\b|gr[üu]ndung|checkliste|\/20\d\d\//i.test(hay);
    return isAbout && !isGuide;
  });
  const WE = /\b(wir|uns|unser|unsere|unserem|unseren|unserer)\b/i;
  // A real about PARAGRAPH: a complete sentence (not a truncated "… je nach Kanton. In"
  // fragment), no SEO meta-title pipe, German, non-boilerplate.
  // NB: VALUE_STOP is deliberately NOT applied to paragraph bodies — it lists section
  // labels (Team, Leistungen, …) that legitimately appear inside about prose ("Ich und
  // mein Team …"); it stays on the heading filter only.
  // A block can start MID-sentence because the firm's name/heading sits in a separate
  // block ("Jürg … und Christian Sager" heading, then a <p> opening "sind die prägenden
  // Gesichter …"). Drop that dangling lead fragment so the complete sentences survive.
  const cleanPara = (raw: string): string => {
    let t = fixEncoding(raw).trim();
    if (/^[a-zäöü–—-]/.test(t)) {
      const m = t.match(/[.!?]\s+(?=[A-ZÄÖÜ])/);   // first sentence boundary before a capital
      if (m && m.index !== undefined) t = t.slice(m.index + m[0].length).trim();
    }
    return t;
  };
  const okPara = (t: string) => t.length >= 70 && t.length <= 520
    && /^[A-ZÄÖÜ»„"(]/.test(t)                     // opens a sentence — no mid-sentence fragment
    && /[.!?]["»“)]?$/.test(t) && !/\s[|·]\s/.test(t)
    && !SVC_BOILER.test(t) && !CMS_BOILER.test(t) && !looksFrench(t);
  for (const p of scan) {
    const bl = pageContentBlocks(p);
    const paras = [...new Set(bl.filter((b) => b.tag === "p").map((b) => cleanPara(b.text)).filter(okPara))];
    // The page must speak AS THE FIRM (we-language) — generic guide prose ("Die
    // Gründungskosten variieren je nach Kanton …") never does, so it's filtered out.
    // A single solid we-paragraph is enough (lead-only); extras ride along.
    const lead = paras.find((t) => WE.test(t));
    if (!lead) continue;
    const rest = paras.filter((t) => t !== lead).slice(0, 3);
    const heads = [...(p.headings?.h1 || []), ...(p.headings?.h2 || [])].map((h: string) => fixEncoding(h).trim())
      // …and NEVER a PERSON NAME. About pages list the team, so a member-name heading
      // ("Alfons G. Florian") sits right above the prose and was being harvested as the
      // section title. Reject any known team name AND the canonical person-name shape
      // (NAME_STOP/NAME_TOPIC keep real German headings like "Unsere Geschichte").
      .filter((h) => h.length >= 6 && h.length <= 70 && !/\?$/.test(h) && !/\s[|·]\s/.test(h) && !VALUE_STOP.test(h) && !/^\d/.test(h) && /[a-zäöü]/i.test(h) && !looksFrench(h) && !isCorrupted(h)
        && !teamNameSet.has(h.toLowerCase().trim()) && !looksLikePersonHeading(h));
    // Heading must NOT echo the page-header title ("Über uns"); fall back to a distinct
    // sub-headline when the page exposes no usable own heading.
    return { eyebrow: "Über uns", heading: heads[0] || "Wer wir sind", lead, paragraphs: rest };
  }
  return undefined;
}

/** REAL company timeline: dated milestones (year + event) from the firm's own
 *  Geschichte / Chronik / About page. Conservative — needs ≥3 DISTINCT years each
 *  with a multi-word event (so a postal code / address like "8032 Zürich" can never
 *  pose as a milestone). Omitted entirely when too sparse — never scaffolded. */
function realHistory(): HistoryContent | undefined {
  const scan = dePages.filter((p) => {
    const hay = `${decU(p.url)} ${p.title || ""}`;
    return /geschichte|chronik|historie|history|meilenstein|werdegang|tradition|firmengeschichte|ueber-?uns|über-?uns|unternehmen/i.test(hay)
      && !/blog|news|ratgeber|aktuell|artikel|magazin|publikation|\/20\d\d\//i.test(hay);
  });
  const seen = new Set<string>();
  const entries: HistoryEntry[] = [];
  const add = (year: string, raw: string) => {
    const y = +year; if (!(y >= 1850 && y <= 2026)) return;
    const body = (raw || "").replace(/^[\s–—:.\-•|]+/, "")
      // strip a leading range END-year or "heute" ("1982–1990 Banklehre" → "Banklehre")
      .replace(/^(?:(?:18|19|20)\d{2}|bis heute|heute)\s*[–—:.\-]?\s*/i, "")
      .replace(/\s+/g, " ").trim();
    if (body.length < 12 || body.length > 240 || !/\s/.test(body)) return; // single word ⇒ likely a city, not an event
    if (looksFrench(body) || SVC_BOILER.test(body) || /^(impressum|datenschutz|cookie)/i.test(body)) return;
    if (seen.has(year)) return; seen.add(year);
    entries.push({ year, body });
  };
  for (const p of scan) {
    const bl = pageContentBlocks(p);
    // (a) a heading/dt that IS or STARTS WITH a year → inline rest, else the next p/dd.
    for (let i = 0; i < bl.length - 1 && entries.length < 8; i++) {
      const m = bl[i].text.match(/^\s*((?:18|19|20)\d{2})\b\s*[–—:.\-]?\s*(.*)$/);
      if (!m) continue;
      const rest = m[2].trim(), nx = bl[i + 1];
      add(m[1], rest.length >= 12 ? rest : (nx && /^(p|dd)$/.test(nx.tag) ? nx.text : ""));
    }
    // (b) inline "YYYY – Event …" lines — a separator is REQUIRED, so a bare
    //     "8032 Zürich" address never matches.
    if (entries.length < 3) {
      for (const l of fixEncoding(p.text || "").split(/\n+/).map((s) => s.trim())) {
        const m = l.match(/^((?:18|19|20)\d{2})\s*[–—:.\-]\s*(.{12,200})$/);
        if (m) add(m[1], m[2]);
      }
    }
    if (entries.length >= 3) break;
  }
  if (entries.length < 3) return undefined;
  entries.sort((a, b) => +a.year - +b.year);
  return { heading: "Unsere Geschichte", entries: entries.slice(0, 8) };
}

/** REAL "So arbeiten wir" process: numbered step headings (+ body) from a page
 *  describing the workflow. Conservative — needs ≥3 numbered steps with prose, so a
 *  random list never masquerades as a process. Omitted (→ generic default) otherwise. */
const STEP_NUM_RE = /^\s*(?:schritt\s*)?(\d{1,2})[.):\s]\s*(.{3,60})$/i;
function realProcess(): ProcessContent | undefined {
  // Only a dedicated workflow page — never a blog/ratgeber how-to article (those
  // carry numbered "in N Schritten" headings that would masquerade as the firm's
  // own client process). No generic fallback: no such page ⇒ neutral default.
  const scan = dePages.filter((p) => {
    const hay = `${decU(p.url)} ${p.title || ""}`;
    return /ablauf|vorgehen|so-?arbeiten|so-?funktioniert|zusammenarbeit|ihr-weg|onboarding|so-?gehts|so-?l[äa]uft|unser-?prozess|ihr-?prozess|wie-wir-arbeiten/i.test(hay)
      && !/blog|news|ratgeber|aktuell|artikel|magazin|publikation|guide|tipps?|wissen|\/20\d\d\//i.test(hay);
  });
  for (const p of scan) {
    const bl = pageContentBlocks(p);
    const steps: StepItem[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < bl.length - 1; i++) {
      if (!/^h[2-4]$/.test(bl[i].tag)) continue;
      const hm = bl[i].text.match(STEP_NUM_RE);
      if (!hm) continue;
      const title = hm[2].trim().replace(/[\s:–-]+$/, "");
      const nx = bl[i + 1];
      if (!title || /[a-zäöü]/i.test(title) === false) continue;
      // A numbered "Ablauf"/"Zusammenarbeit" list of PEOPLE (e.g. "1. Max Müller" + role
      // prose) is a team, not a workflow — never let staff masquerade as process steps.
      if (teamNameSet.has(title.toLowerCase().trim()) || isPersonName(title)) continue;
      if (!nx || nx.tag !== "p" || nx.text.length < 30 || nx.text.length > 360 || SVC_BOILER.test(nx.text)) continue;
      if (looksFrench(title) || looksFrench(nx.text)) continue; // French step on a mixed page
      const k = title.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      steps.push({ title, body: nx.text });
      if (steps.length >= 6) break;
    }
    if (steps.length >= 3) return { eyebrow: "Ablauf", heading: "So arbeiten wir", steps };
  }
  return undefined;
}

/** REAL audience segmentation: (audience-noun heading + body) pairs from a "Für wen /
 *  Zielgruppen / Branchen" page. Needs ≥3. Omitted (→ generic default) otherwise. */
// Whole-word audience nouns only — NO bare stems (e.g. "gen" would match any
// German "-gen" plural like "Erklärungen"/"Augenhöhe" and mislabel it an audience).
const AUDIENCE_HINT = /\b(kmu|unternehmen|firmen|betriebe?n?|selbst[äa]ndige?|selbstst[äa]ndige?|freiberufler?|einzelfirmen?|einzelunternehmen?|privatpersonen?|privatkunden?|private?|familien?|pensionierte?|vereine?|stiftungen?|startups?|start-ups?|gr[üu]nder(innen)?|gewerbe|gewerbetreibende?|gastronomie|gastronomen|[äa]rzte|mediziner|handwerker?|immobilien|liegenschaften?|landwirte?|expats?|holdings?|genossenschaften?|freelancer?|gmbh|ag)\b/i;
function realAudience(): AudienceContent | undefined {
  const scan = dePages.filter((p) => /fuer-wen|für-wen|zielgrupp|branchen|kundenkreis|wen-wir|for-whom|mandate|kundensegment/i.test(`${p.url || ""} ${p.title || ""}`));
  const pool = scan.length ? scan : (homeDe ? [home] : []);
  for (const p of pool) {
    const bl = pageContentBlocks(p);
    const items: AudienceItem[] = [];
    const seen = new Set<string>();
    for (let i = 0; i < bl.length - 1; i++) {
      if (!/^h[2-4]$/.test(bl[i].tag)) continue;
      const title = bl[i].text;
      if (title.length < 3 || title.length > 46 || /\?$/.test(title) || VALUE_STOP.test(title) || !AUDIENCE_HINT.test(title)) continue;
      const nx = bl[i + 1];
      if (!nx || nx.tag !== "p" || nx.text.length < 30 || nx.text.length > 300 || SVC_BOILER.test(nx.text)) continue;
      if (looksFrench(nx.text)) continue;                       // French block on a mixed page
      const k = title.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      items.push({ title, body: nx.text });
      if (items.length >= 4) break;
    }
    if (items.length >= 3) return { eyebrow: "Für wen", heading: "Für wen wir arbeiten", items };
  }
  return undefined;
}

/** REAL opening hours from the firm's structured data (schema.org
 *  openingHoursSpecification / openingHours) — formatted to compact German
 *  ("Mo–Fr 08:00–17:00 · Sa 09:00–12:00"). Returns undefined when none is
 *  published, so the contact card omits hours rather than asserting a guess. */
const DAY_IDX: Record<string, number> = {
  mo: 0, mon: 0, monday: 0, montag: 0, tu: 1, tue: 1, tuesday: 1, di: 1, dienstag: 1,
  we: 2, wed: 2, wednesday: 2, mi: 2, mittwoch: 2, th: 3, thu: 3, thursday: 3, do: 3, donnerstag: 3,
  fr: 4, fri: 4, friday: 4, freitag: 4, sa: 5, sat: 5, saturday: 5, samstag: 5,
  su: 6, sun: 6, sunday: 6, so: 6, sonntag: 6,
};
const DE_DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const dayIdx = (tok: string): number | undefined => DAY_IDX[tok.trim().toLowerCase().replace(/^.*\//, "").replace(/[^a-zäöü]/g, "")];
const padTime = (t: string): string | undefined => { const m = String(t).match(/^(\d{1,2})[:.h](\d{2})$/); return m ? `${m[1].padStart(2, "0")}:${m[2]}` : undefined; };
function realHours(): string | undefined {
  const ranges = new Map<number, Set<string>>();
  const addRange = (day: number, opens: string, closes: string) => {
    const o = padTime(opens), c = padTime(closes);
    if (o == null || c == null) return;
    (ranges.get(day) ?? ranges.set(day, new Set()).get(day)!).add(`${o}–${c}`);
  };
  const addSpec = (spec: any) => {
    for (const s of (Array.isArray(spec) ? spec : [spec])) {
      if (!s || typeof s !== "object") continue;
      const days = (Array.isArray(s.dayOfWeek) ? s.dayOfWeek : (s.dayOfWeek != null ? [s.dayOfWeek] : []))
        .map((d: any) => dayIdx(String(d))).filter((x: number | undefined): x is number => x != null);
      if (!days.length || !s.opens || !s.closes) continue;
      for (const d of days) addRange(d, s.opens, s.closes);
    }
  };
  // "Mo-Fr 08:00-17:00" | "Monday,Tuesday 09:00-17:00"
  const addOHString = (str: string) => {
    const m = str.match(/^\s*([A-Za-zÄÖÜäöü,–\-\s]+?)\s+(\d{1,2}[:.h]\d{2})\s*(?:[-–]|bis)\s*(\d{1,2}[:.h]\d{2})/);
    if (!m) return;
    for (const seg of m[1].split(",")) {
      const rg = seg.split(/[–-]/).map((x) => dayIdx(x)).filter((x): x is number => x != null);
      if (rg.length === 1) addRange(rg[0], m[2], m[3]);
      else if (rg.length >= 2) for (let d = rg[0]; d <= rg[rg.length - 1]; d++) addRange(d, m[2], m[3]);
    }
  };
  const walk = (o: any) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (o.openingHoursSpecification) addSpec(o.openingHoursSpecification);
    if (o.openingHours) for (const s of (Array.isArray(o.openingHours) ? o.openingHours : [o.openingHours])) if (typeof s === "string") addOHString(s);
    for (const k of Object.keys(o)) walk(o[k]);
  };
  for (const p of pages) for (const b of (p.jsonld || [])) walk(b);
  if (!ranges.size) return undefined;
  // Reject obvious plugin/theme DEFAULTS instead of asserting fake office times: a
  // Treuhänder is never genuinely "open" all week / on Sunday, and a 24-hour span
  // (00:00–23:59) is the "always open" placeholder. Better to omit than to publish a
  // guessed "Mo–So 00:00–23:59".
  const spans = [...ranges.values()].flatMap((s) => [...s]);
  if (ranges.size >= 7 || ranges.has(6)) return undefined;                 // all week / Sunday open
  if (spans.some((r) => /00:00.?(23:59|00:00)/.test(r))) return undefined; // 24h placeholder
  const val = (d: number) => [...(ranges.get(d) ?? [])].sort().join(", ");
  const out: string[] = [];
  for (let i = 0; i < 7;) {
    if (!ranges.has(i)) { i++; continue; }
    const v = val(i); let j = i;
    while (j + 1 < 7 && ranges.has(j + 1) && val(j + 1) === v) j++;
    out.push(`${i === j ? DE_DAYS[i] : `${DE_DAYS[i]}–${DE_DAYS[j]}`} ${v}`);
    i = j + 1;
  }
  return out.length ? out.join(" · ") : undefined;
}

/** REAL postal address (street + ZIP + town) from the firm's own contact/impressum
 *  page text, so the contact card shows the full address instead of a bare town (the
 *  old behaviour, which once even surfaced a stray "Durchschnittliche" fragment from
 *  the ZIP regex). Prefers contact/impressum/standort pages, then the home page. */
function realAddress(): string | undefined {
  // Street suffix is matched case-insensitively ("Europa-Strasse" as well as
  // "Bahnhofstrasse"); an optional leading word captures two-word streets ("Oberer
  // Deutweg"); the house number may carry a space-separated letter ("16 e").
  const ADDR_RE = /((?:[A-ZÄÖÜ][a-zäöüß]+\s)?[A-ZÄÖÜ][\wäöüÄÖÜß.\-]*?(?:[Ss]trasse|[Ss]tr\.|[Gg]asse|[Ww]eg|[Pp]latz|[Aa]llee|[Rr]ing|[Rr]ain|[Hh]alde|[Hh]of|[Mm]atte|[Qq]uai|[Vv]ia|[Rr]oute)\s+\d+\s?[a-z]?)\s*,?\s+((?:CH-)?\d{4})\s+((?:(?:St\.|Bad|Le|La)\s)?[A-ZÄÖÜ][\wäöüÄÖÜß\-]+)/;
  const ordered = [
    ...dePages.filter((p) => /kontakt|impressum|contact|standort|anfahrt|ueber|über/i.test(`${p.url || ""} ${p.title || ""}`)),
    home, ...dePages,
  ];
  for (const p of ordered) {
    const m = fixEncoding(p.text || "").match(ADDR_RE);
    if (m) {
      const street = m[1].replace(/\s+/g, " ").trim();
      const zip = m[2].replace(/^CH-/i, "").trim();
      const town = m[3].replace(/\s+/g, " ").trim();
      return `${street}, ${zip} ${town}`;
    }
  }
  return undefined;
}

/** REAL contact email: prefer a generic role inbox (info@/kontakt@) on the firm's OWN
 *  domain. Foreign-domain addresses (a web agency's "info@hingucker.ch"), %20-mangled
 *  and personal/employee mails are dropped — better no email than a wrong one. Falls
 *  back to a mailto: in the page HTML when site.contact carries none. */
function realEmail(): string | undefined {
  const siteDom = (site.domain || "").toLowerCase().replace(/^www\./, "");
  const clean = (e: string) => { try { e = decodeURIComponent(e); } catch { /* keep */ }
    return e.toLowerCase().replace(/%20|\s+/g, "").replace(/^mailto:/, "").replace(/^[._%+\-]+/, "").trim(); };
  const raw = new Set<string>();
  for (const e of (site.contact?.emails || [])) if (typeof e === "string") raw.add(e);
  for (const p of pages) for (const m of (p.raw_html || "").matchAll(/mailto:([^"'?\s>&]+)/gi)) raw.add(m[1]);
  const valid = [...raw].map(clean).filter((e) => /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(e));
  const ownDom = (ed: string) => !!siteDom && (ed === siteDom || ed.endsWith("." + siteDom) || siteDom.endsWith("." + ed));
  const own = valid.filter((e) => ownDom(e.split("@")[1]));
  if (!own.length) return undefined;                       // only foreign domains → omit (honesty rule)
  const ROLE = /^(info|kontakt|contact|mail|office|kanzlei|welcome|hallo|hello)@/;
  return own.filter((e) => ROLE.test(e)).sort((a, b) => a.length - b.length)[0]
      ?? own.sort((a, b) => a.split("@")[0].length - b.split("@")[0].length)[0]; // shortest local = least personal
}

const h1: string = tidyText(fixEncoding((home.headings?.h1 || [])[0] || ""));
const desc: string = tidyText(fixEncoding(home.meta?.description || ""));
// Hero headline/lede come from the HOME page — only honoured when the home is German
// (a French home → German scaffold defaults), and never when the text itself is French.
// A scraped H1 is only a USABLE hero headline when it reads like one — not the firm's
// name (± a legal suffix / location), and not an all-lowercase unstyled brand string.
// Otherwise fall back to the benefit scaffold. (Was: only an EXACT firm-name match was
// rejected, so "aurora treuhand ag in Zumikon ZH" slipped through as the headline.)
const headlineIsName = (() => {
  if (!h1) return false;
  const norm = (x: string) => x.toLowerCase().replace(/[^a-zäöü0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  const hn = norm(h1), fn = norm(firm);
  if (!fn) return false;
  if (hn === fn) return true;
  if (hn.includes(fn)) { // firm name present, and only legal/location filler remains
    const rest = hn.replace(fn, " ").replace(/\b(ag|gmbh|kg|sa|sarl|gruppe|partner|treuhand|in|im|bei|zur|und|der|die|das|zh|be|lu|sg|tg|ar|sz|zg)\b/g, " ").replace(/\s+/g, " ").trim();
    if (rest.split(" ").filter(Boolean).length <= 1) return true;
  }
  return false;
})();
const isLowercaseH1 = !!h1 && !/[A-ZÄÖÜ]/.test(h1); // an unstyled, all-lowercase brand string
const heroHeadlineReal = homeDe && h1 && h1.length > 8 && h1.length < 90 && !headlineIsName && !isLowercaseH1 && !looksFrench(h1) && !isCorrupted(h1);
const ledeReal = homeDe && desc && desc.length > 30 && !looksFrench(desc) && !isCorrupted(desc);

// --- archetype (still drives variant affinity + per-page section sets) ---
const a = analysis.has || {};
const arch: ArchetypeId =
  a.pricing || (a.blog_news && (analysis.pages || 0) > 30) ? "swiss-digital"
  : (analysis.pages || 0) < 15 || (a.team && !a.pricing) ? "boutique"
  : "boutique";

// --- LOOK: dress the firm's recovered visual core in a modern design language ---
/** Recover the dominant CHROMATIC colour from the firm's logo (the logo IS the brand
 *  identity). SVG → its declared fill/stroke colours; raster → a saturated-pixel
 *  histogram via sharp. Returns #RRGGBB or undefined (monochrome / unreadable logo).
 *  Used as the accent fallback when the scraped page colour isn't clearly the brand. */
async function extractLogoColor(logoSrc?: string): Promise<string | undefined> {
  if (!logoSrc) return undefined;
  const file = join(import.meta.dirname, "..", "public", logoSrc.replace(/^\//, ""));
  if (!existsSync(file)) return undefined;
  // A real chromatic accent. The low-luminance floor is deliberately tiny: a saturated
  // DARK navy/green (e.g. #002F60, luminance ≈ 0.03) is a perfectly valid brand colour,
  // not "near-black" — only true black is rejected (saturation ≥ 0.2 already excludes grey).
  const chromatic = (hex?: string): hex is string =>
    !!hex && !isNeutral(hex) && saturation(hex) >= 0.2 && luminance(hex) <= 0.92 && luminance(hex) >= 0.02;
  if (/\.svg$/i.test(file)) {
    let txt = ""; try { txt = readFileSync(file, "utf8"); } catch { return undefined; }
    const score: Record<string, number> = {};
    for (const m of txt.matchAll(/(?:fill|stroke|stop-color|color)\s*[:=]\s*["']?\s*(#[0-9a-fA-F]{3,6}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))/gi)) {
      const v = m[1];
      let hex: string | undefined;
      if (v[0] === "#") hex = normHex(v);
      else { const n = (v.match(/\d+/g) || []).map(Number); hex = toHex(n[0], n[1], n[2]); }
      if (chromatic(hex)) score[hex] = (score[hex] ?? 0) + 1;
    }
    return Object.entries(score).sort((a, b) => b[1] - a[1])[0]?.[0];
  }
  let sharp: any; try { sharp = (await import("sharp")).default; } catch { return undefined; }
  try {
    const { data, info } = await sharp(file, { failOn: "none" }).resize(64, 64, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const buckets: Record<string, { n: number; r: number; g: number; b: number }> = {};
    for (let i = 0; i + ch - 1 < data.length; i += ch) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = ch >= 4 ? data[i + 3] : 255;
      if (a < 128) continue;                                   // transparent pixel
      const hex = toHex(r, g, b);
      if (!chromatic(hex)) continue;                            // neutral / washed / near-black
      const q = `${r >> 4}-${g >> 4}-${b >> 4}`;                // quantise to tame anti-aliasing
      const bk = (buckets[q] ??= { n: 0, r: 0, g: 0, b: 0 });
      bk.n++; bk.r += r; bk.g += g; bk.b += b;
    }
    const top = Object.values(buckets).sort((a, b) => b.n - a.n)[0];
    if (!top || top.n < 4) return undefined;                    // too few chromatic pixels → monochrome logo
    return toHex(Math.round(top.r / top.n), Math.round(top.g / top.n), Math.round(top.b / top.n));
  } catch { return undefined; }
}
/** Detect whether the logo sits on a SOLID NEAR-WHITE plate (an opaque raster logo whose
 *  border pixels are uniformly white-ish) instead of a transparent canvas. When it does,
 *  the header must wear that exact plate colour — otherwise the white box reads as a seam
 *  on a brand-tinted off-white header (e.g. a #FAF9F6 page bg). Returns the averaged plate
 *  hex (#RRGGBB) or undefined (transparent / coloured / dark / SVG logo → header keeps the
 *  page bg). SVG logos are vector + transparent, so they always adapt and are skipped. */
async function extractLogoBg(logoSrc?: string): Promise<string | undefined> {
  if (!logoSrc || /\.svg$/i.test(logoSrc)) return undefined;
  const file = join(import.meta.dirname, "..", "public", logoSrc.replace(/^\//, ""));
  if (!existsSync(file)) return undefined;
  let sharp: any; try { sharp = (await import("sharp")).default; } catch { return undefined; }
  try {
    const { data, info } = await sharp(file, { failOn: "none" }).resize(48, 48, { fit: "inside" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels, W = info.width, H = info.height;
    // "White" plate = high luminance + near-zero saturation (covers pure white AND faint
    // off-whites/creams like #FAF9F6; a coloured or dark plate fails and is left alone).
    let opaque = 0, transparent = 0, white = 0, r = 0, g = 0, b = 0;
    const sample = (x: number, y: number) => {
      const i = (y * W + x) * ch;
      if ((ch >= 4 ? data[i + 3] : 255) < 128) { transparent++; return; }   // transparent pixel → no plate here
      opaque++;
      const cr = data[i], cg = data[i + 1], cb = data[i + 2], hex = toHex(cr, cg, cb);
      if (luminance(hex) >= 0.9 && saturation(hex) <= 0.1) { white++; r += cr; g += cg; b += cb; }
    };
    for (let x = 0; x < W; x++) { sample(x, 0); sample(x, H - 1); }          // top + bottom edge
    for (let y = 1; y < H - 1; y++) { sample(0, y); sample(W - 1, y); }      // left + right edge
    const border = opaque + transparent;
    if (!border || transparent / border > 0.25) return undefined;           // mostly transparent → adapts
    if (!opaque || white / opaque < 0.9) return undefined;                   // border isn't a uniform white plate
    return toHex(Math.round(r / white), Math.round(g / white), Math.round(b / white));
  } catch { return undefined; }
}
const brand = extractBrand(slug, ROOT);
const logoColor = await extractLogoColor(media.logo);
const logoBg = await extractLogoBg(media.logo);
const derived = deriveLook(brand, { firmKey: slug, archetype: arch, logoColor });
const basePresetId = derived.basePresetId;
// If the logo is on a near-white plate, the header adopts that exact colour so the logo
// doesn't read as a white box seamed onto a brand-tinted off-white header. Only on LIGHT
// looks (a dark look wants logoLight, not a forced-white bar) and only when it actually
// differs from the page bg (otherwise the header already matches via --ds-bg).
const headerBg = logoBg && luminance(derived.tokens.color.bg) > 0.6 && normHex(logoBg) !== normHex(derived.tokens.color.bg)
  ? logoBg : undefined;

const c: string = city();

// --- trust: REAL certifications/software only (no fabricated CH fallback) ---
const realCerts: string[] = (analysis.trust?.certifications || []).slice(0, 5);
const realSoftware: string[] = (analysis.trust?.software || []).slice(0, 3);
const trustItems = [...realCerts, ...realSoftware];

// --- real social proof (or omitted) ---
const serviceItems = services();
// Dedup service summaries: no two services may show the same paragraph, and none
// may echo the hero lede / its own meta.description. Collisions are replaced with
// the service's curated default summary (SERVICE_CANON) or dropped (→ undefined).
{
  const curatedSummary = (title: string) => SERVICE_CANON.find((s) => s.title === title)?.summary;
  const norm = (s?: string) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  const heroLede = norm(desc);
  const usedSummaries = new Set<string>();
  for (const s of serviceItems) {
    const n = norm(s.summary);
    if (!n) continue;
    if (n === heroLede || usedSummaries.has(n)) {
      const def = curatedSummary(s.title);
      s.summary = def && !usedSummaries.has(norm(def)) ? def : undefined;
      realServiceTitles.delete(s.title); // summary no longer real firm copy
    }
    if (s.summary) usedSummaries.add(norm(s.summary));
  }
}
const testimonialItems = realTestimonials(c);
const statItems = realStats();
const pricingTiers = realPricing();
const valueItems = realValues();
const faqItems = realFaq();
const tagline = realTagline();
// --- real editorial sections (or omitted → composer renders a neutral default) ---
const aboutContent = realAbout();
const historyContent = realHistory();
const processContent = realProcess();
const audienceContent = realAudience();
const hours = realHours();
const fullAddress = realAddress();
const contactEmail = realEmail();

// --- decide the structure from what the scrape actually shows ---
const brief = decideStructure({
  archetype: arch,
  has: analysis.has || {},
  pageTypes: analysis.page_types || {},
  servicesCount: serviceItems.length,
  teamCount: realTeam?.length ?? 0,
  real: {
    services: serviceItems.length > 0,
    team: !!(realTeam && realTeam.length),
    trust: trustItems.length > 0 || media.badges.length > 0,
    testimonials: !!testimonialItems,
    stats: !!statItems,
    pricing: !!pricingTiers,
    values: !!valueItems,
    faq: !!faqItems,
  },
});
const fns = brief.functions;
const bookCta = fns.onlineBooking ? "Termin buchen" : "Kontakt aufnehmen";
const lookId = basePresetId; // kept for backwards-compat; affinity source for variants

// Feature-band angles distilled from REAL editorial material only (the firm's own
// values, then its real service copy) — so an image band echoes the firm's actual
// positioning, not generic copy. None real ⇒ undefined ⇒ composer uses the crafted,
// non-fabricated FEATURE_VARIANTS fallback.
const realFeatureAngles: Omit<FeatureContent, "image">[] = [];
for (const v of (valueItems ?? [])) realFeatureAngles.push({ eyebrow: "Unser Ansatz", heading: v.title, body: v.body, cta: { label: bookCta } });
for (const s of serviceItems) if (realServiceTitles.has(s.title) && s.summary) realFeatureAngles.push({ eyebrow: "Leistung", heading: s.title, body: s.summary, bullets: s.bullets?.slice(0, 3), cta: { label: bookCta } });
const featureAngles = realFeatureAngles.length ? realFeatureAngles.slice(0, 4) : undefined;

const content: SiteContent = {
  meta: {
    firm, domain: site.domain, archetype: arch, lookId, sourceUrl: site.start_url,
    basePresetId, look: derived.tokens, brand, fontsToLoad: fontsToLoad(brand), brief,
    // honest provenance — what's real vs scaffolded:
    placeholders: [
      testimonialItems ? null : "hero.aside",
      valueItems ? null : "values",
      faqItems ? null : "faq",
      tagline ? null : "footer.tagline",
      realServiceTitles.size ? null : "services.text",
      // safe-generic sections: scaffolded copy renders when the scrape exposed none.
      processContent ? null : "process (generic)",
      audienceContent ? null : "audience (generic)",
      aboutContent ? null : "about (generic)",
      featureAngles ? null : "feature (generic)",
      derived.colourSource === "generated" ? "look.colors (generated)" : null,
      media.stock ? "media.stock (CC fallback)" : null,
      // team is real-only now (no generic fallback) → never a placeholder, just absent.
    ].filter((x): x is string => !!x),
    real: ["meta.firm", "meta.domain", "contact.email", "contact.phone",
      heroHeadlineReal ? "hero.headline" : null, ledeReal ? "hero.lede" : null,
      realServiceTitles.size ? "services.text" : null,
      realTeam && realTeam.length ? "team.members" : null,
      realTeam && realTeam.some((m) => m.photo) ? "team.photos" : null,
      testimonialItems ? "testimonials" : null, statItems ? "stats" : null,
      valueItems ? "values" : null, faqItems ? "faq" : null,
      aboutContent ? "about" : null, historyContent ? "history" : null, processContent ? "process" : null,
      audienceContent ? "audience" : null, featureAngles ? "feature" : null,
      hours ? "contact.hours" : null,
      tagline ? "footer.tagline" : null, testimonialItems ? "hero.aside" : null,
      pricingTiers ? "pricing" : null, trustItems.length ? "trust.items" : null,
      media.assets.length ? "media.pool" : null,
      media.logo ? "media.logo" : null,
      media.badges.length ? "trust.badges" : null,
      Object.keys(media.serviceImages || {}).length ? "services.images" : null,
      media.documents.length ? "media.documents" : null,
      derived.colourSource === "scraped" ? "brand.colors" : derived.colourSource === "logo" ? "logo.colors" : null,
      brand.heading || brand.body ? "brand.fonts" : null].filter((x): x is string => !!x),
  },
  media,
  nav: {
    brand: firm,
    links: [{ label: "Home", href: "#" }, { label: "Leistungen", href: "#services" }, { label: "Über uns", href: "#about" }],
    cta: bookCta,
    logo: media.logo, logoLight: media.logoLight,
    ...(headerBg ? { logoBg: headerBg } : {}),
  },
  hero: {
    eyebrow: `Treuhand · ${c}`,
    titleLead: heroHeadlineReal ? h1 : "Ihre Finanzen,",
    titleAccent: heroHeadlineReal ? "" : "klar geführt.",
    lede: ledeReal ? clipProse(desc, 180) : `Buchhaltung, Steuern und Beratung für KMU und Privatpersonen in ${c}. Persönlich, präzise und vorausschauend an Ihrer Seite.`,
    primaryCta: bookCta, secondaryCta: "Leistungen",
    // The hero aside is a REAL-quote slot: a scraped testimonial, else empty (the hero
    // then hides the aside). Never echo the lede/meta-description back as a "quote", and
    // never a templated "Persönliche Treuhand-Betreuung in {Stadt}" — that's a fabricated
    // firm voice. A real testimonial also shows in the Testimonials section, so the
    // render layer drops the aside duplicate there.
    // asideLabel is DUAL-PURPOSE: the quote-card label (Hero/Split — hidden with the card
    // when there's no quote) AND a standalone trust chip (HeroCentered/Gradient, always
    // shown). So it keeps a real value; only the QUOTE itself is emptied when there's no
    // testimonial (no fake firm voice, no lede echo).
    asideLabel: testimonialItems ? "Mandantenstimme" : "Über uns",
    asideQuote: testimonialItems ? testimonialItems[0].quote : "",
    asideAttribution: testimonialItems ? `— ${testimonialItems[0].person}${testimonialItems[0].company ? ", " + testimonialItems[0].company : ""}` : "",
    image: heroImage ?? media.hero,   // real hero, else CC stock fallback
  },
  services: { eyebrow: "Leistungen", heading: "Alles aus einer Hand.", items: serviceItems },
  values: { eyebrow: "Warum wir", heading: "Ihr Vorteil.", items: valueItems ?? [] },
  // Scrape-driven where the firm exposed it; undefined ⇒ composer renders a neutral
  // default (omitted from the JSON, so the provenance flags it as "(generic)").
  about: aboutContent,
  history: historyContent,
  process: processContent,
  audience: audienceContent,
  featureAngles,
  team: {
    eyebrow: "Team", heading: "Menschen, die Ihre Zahlen kennen.",
    // Real members only — never fabricate generic placeholders. An empty list
    // drops the Team section everywhere and prevents a Team subpage from being
    // created; the firm then introduces itself via the generic "Über uns".
    members: realTeam && realTeam.length ? realTeam : [],
  },
  pricing: {
    eyebrow: "Preise", heading: "Transparente Pauschalen.",
    tiers: pricingTiers ?? [],
  },
  testimonials: {
    eyebrow: "Mandantenstimmen", heading: "Unternehmen vertrauen uns.", rating: "", reviewCount: "",
    items: testimonialItems ?? [],
  },
  stats: { items: statItems ?? [] },
  trust: { label: "Mitglied · Zertifiziert", items: trustItems, badges: media.badges },
  faq: { eyebrow: "Fragen & Antworten", heading: "Häufige Fragen.", items: faqItems ?? [] },
  cta: { heading: "Bereit, Ihre Finanzen abzugeben?", sub: "Buchen Sie ein kostenloses Erstgespräch – wir zeigen Ihnen den nächsten Schritt.", button: bookCta },
  contact: {
    eyebrow: "Kontakt", heading: "Sprechen wir.",
    info: {
      address: site.contact?.address ?? fullAddress ?? c, phone: site.contact?.phones?.[0], email: contactEmail,
      // Real published hours (schema.org) or omitted — never a guessed default.
      hours,
    },
    formCta: "Nachricht senden",
  },
  footer: {
    brand: firm, tagline: tagline ?? `Ihr Treuhandpartner in ${c} – Buchhaltung, Steuern und Beratung für KMU.`,
    logo: media.logo, logoLight: media.logoLight,
    columns: [
      { title: "Sitemap", links: ["Leistungen", "Über uns", ...(fns.jobs ? ["Offene Stellen"] : []), "Kontakt"] },
      { title: "Standort", links: [fullAddress ?? c, site.contact?.phones?.[0] || "+41 …", contactEmail || "info@…"] },
      { title: "Rechtliches", links: ["Impressum", "Datenschutz"] },
    ],
    legal: ["Impressum", "Datenschutz"], year: 2026,
    // imageCredits omitted for the prototype (Pexels needs no attribution); the
    // credit data still lives in media.credits if you want to surface it later.
  },
};

const dir = join(import.meta.dirname, "examples");
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, `${slug}.json`), JSON.stringify(content, null, 2));
writeFileSync(join(dir, "active.json"), JSON.stringify(content, null, 2));
const dropped = ["partners", "team", "testimonials", "stats", "pricing"].filter((s) => !brief.homepageSlots.includes(s));
console.log(`Extracted ${slug} -> archetype=${arch} base=${basePresetId} color=${derived.tokens.color.primary} (${derived.colourSource}; scraped=${brand.primary ?? "none"}/${brand.confidence}; logo=${logoColor ?? "none"})${brand.heading ? " font=" + brand.heading.family : ""}`);
console.log(`  media: ${media.assets.length} assets (logo=${media.logo ? "y" : "n"} badges=${media.badges.length} photos=${media.photos.length} serviceImages=${Object.keys(media.serviceImages || {}).length}) docs=${media.documents.length} optimized=${opt.n} (-${(opt.saved / 1048576).toFixed(1)}MB) prunedLowQ=${droppedLowQ} faces=${facePhotos} clip=${clip.refined}r/${clip.removed}x stock=${stockN}${media.stock ? " (CC fallback)" : ""}`);
console.log(`  homepage: ${brief.homepageSlots.join(" › ")}`);
console.log(`  editorial: about=${aboutContent ? "y" : "n"} history=${historyContent ? historyContent.entries.length + "yrs" : "n"} process=${processContent ? processContent.steps.length + "steps" : "n"} audience=${audienceContent ? audienceContent.items.length + "items" : "n"} feature=${featureAngles ? featureAngles.length + "angles" : "generic"} hours=${hours ? "y(" + hours + ")" : "n"}`);
console.log(`  dropped:  ${dropped.length ? dropped.join(", ") : "none"}  | pages: ${brief.pageRefs.map((r) => r.pageType).join(", ")}`);
console.log(`  fns: booking=${fns.onlineBooking} jobs=${fns.jobs} | media=${media.assets.length}(logo=${media.logo ? "y" : "n"} badges=${media.badges.length})`);
