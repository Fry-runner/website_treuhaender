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
import { imageSize } from "./imageSize.ts";
import { extractBrand } from "./brand.ts";
import { deriveLook, fontsToLoad } from "../looks/deriveLook.ts";
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
const SERVICE_BULLETS = [
  "Laufende, termingerechte Betreuung",
  "Digitale Belegerfassung & Echtzeit-Zahlen",
  "Ein persönlicher Ansprechpartner",
  "Transparente Pauschale ohne versteckte Kosten",
];
function services() {
  const hit = SERVICE_CANON.filter((s) => s.key.some((k) => allText.includes(k)));
  return (hit.length >= 4 ? hit : SERVICE_CANON).slice(0, 6).map((s) => {
    const r = serviceText(s.title, s.key); // real copy from the firm's own service subpage
    return {
      title: s.title,
      summary: r.summary || s.summary,
      body: r.body || `Wir übernehmen ${s.title.toLowerCase()} vollständig und termingerecht – digital, transparent und persönlich betreut. So behalten Sie jederzeit den Überblick über Ihre Zahlen und gewinnen Zeit für Ihr Kerngeschäft.`,
      bullets: r.bullets ?? SERVICE_BULLETS,
      image: media.serviceImages?.[s.title],
    };
  });
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
/** Strip HTML tags + decode common entities to clean inline text. */
function stripTags(h: string): string {
  const t = h.replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'").replace(/&[a-z]+;/gi, " ");
  return fixEncoding(t).replace(/\s+/g, " ").trim();
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
    .map((h: string) => fixEncoding(h).trim()).filter(Boolean));
  const lines = fixEncoding(p.text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
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
  return pages.filter((p) => p !== home).find((p) => {
    const hay = deUmlaut(`${p.url || ""} ${(p.headings?.h1 || []).join(" ")} ${p.title || ""}`);
    return kk.some((k) => hay.includes(k));
  });
}
const SVC_BOILER = /cookie|datenschutz|impressum|©|copyright|alle rechte|mwst-?nr|newsletter|anmelden|öffnungszeit|oeffnungszeit|navigation|toggle|menü|^kontakt$/i;
function serviceText(title: string, keys: string[]): { summary?: string; body?: string; bullets?: string[] } {
  const p = pageForService(keys);
  if (!p) return {};
  const bl = pageContentBlocks(p);
  const paras = bl.filter((b) => b.tag === "p" && b.text.length >= 60 && b.text.length <= 600 && /[.!?]/.test(b.text) && !SVC_BOILER.test(b.text)).map((b) => b.text);
  const desc = fixEncoding(p.meta?.description || "");
  const summary = (desc.length >= 40 && desc.length <= 300) ? desc : paras[0];
  const body = paras.slice(0, 4).join("\n\n") || undefined;
  const lis = [...new Set(htmlBlocks(p.raw_html || "").filter((b) => b.tag === "li" && b.text.length >= 6 && b.text.length <= 90
    && !/^(home|kontakt|impressum|datenschutz|leistung|über|ueber|news|blog|team|standort|deutsch|english|fran)/i.test(b.text)
    && /[a-zäöü]/i.test(b.text)).map((b) => b.text))];
  const bullets = lis.length >= 3 ? lis.slice(0, 5) : undefined;
  if (summary || body) realServiceTitles.add(title);
  return { summary: summary?.slice(0, 280), body: body?.slice(0, 900), bullets };
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
function roleBio(role: string): string {
  const r = role.toLowerCase();
  if (/ceo|gesch[äa]ft|inhaber|gr[üu]nder|partner|leitung|leiter|direktor/.test(r))
    return "Verantwortlich für Mandatsführung und Strategie – Ihre erste Adresse für anspruchsvolle Treuhand- und Steuerfragen.";
  if (/lohn|payroll|personal|administ/.test(r))
    return "Kümmert sich um Lohnbuchhaltung, Sozialversicherungen und Personaladministration – zuverlässig und termingerecht.";
  if (/revis|pr[üu]f|audit/.test(r))
    return "Zugelassene Fachperson für eingeschränkte und ordentliche Revision sowie prüfungssichere Abschlüsse.";
  if (/steuer/.test(r))
    return "Begleitet Unternehmen und Privatpersonen bei Steuererklärungen, Optimierung und Vertretung gegenüber den Behörden.";
  if (/buchhalt|finanz|rechnungswesen|treuh/.test(r))
    return "Betreut die laufende Buchhaltung, Abschlüsse und das Reporting Ihrer Mandate – digital und übersichtlich.";
  return "Teil des Teams, das Ihre Zahlen kennt und persönlich für Sie da ist.";
}
const NAME_RE = /^([A-ZÄÖÜ][a-zäöüéèàç]+)(?:\s+(?:[A-ZÄÖÜ]\.|[A-ZÄÖÜ][a-zäöüéèàç]+)){1,2}$/;
// section headers / nav labels that look like a "First Last" pair but aren't people
const NAME_STOP = new Set(["unsere", "unser", "ihre", "ihr", "weitere", "alle", "mehr", "extra", "unternehmen", "dienstleistungen", "dienstleistung", "kontakt", "team", "publikationen", "mitgliedschaften", "startseite", "aktuelles", "leistungen", "über", "ueber", "about", "services", "willkommen", "herzlich", "news", "blog", "standort", "öffnungszeiten", "oeffnungszeiten", "impressum", "datenschutz", "downloads", "links", "home", "english", "deutsch", "français", "francais"]);
const isPersonName = (nm: string) => {
  if (!NAME_RE.test(nm)) return false;
  const parts = nm.replace(/\./g, "").split(/\s+/).map((w) => w.toLowerCase());
  return !parts.some((w) => NAME_STOP.has(w));
};
const ROLE_HINT = /(treuh|steuer|experte|expertin|berater|leiter|leitung|ceo|cfo|coo|gesch[äa]ft|fachfrau|fachmann|finanz|rechnungswesen|partner|inhaber|gr[üu]nder|direktor|assistent|mandatsleiter|buchhalt|revisor|wirtschaftspr[üu]f|dipl|lehrling|sachbearbeit)/i;
function teamMembers() {
  const teamPage = pages.find((p) => /\/(team|ueber-uns|ueber|about|wir-?ueber|mitarbeit)/i.test(p.url || "") && !/\/en\//i.test(p.url || ""))
    || pages.find((p) => /\/(team|ueber|about|mitarbeit)/i.test(p.url || ""));
  if (!teamPage) return undefined;

  // 1) (name, role) pairs from the page text — a name line followed by a role line.
  const lines = fixEncoding(teamPage.text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const found: { name: string; role: string }[] = [];
  for (let i = 0; i < lines.length - 1; i++) {
    const nm = lines[i];
    if (!isPersonName(nm)) continue;
    if (firm.toLowerCase().includes(nm.toLowerCase())) continue; // skip firm/brand
    const next = lines[i + 1];
    if (!(next.length < 80 && ROLE_HINT.test(next))) continue;
    if (found.some((f) => f.name.toLowerCase() === nm.toLowerCase())) continue;
    found.push({ name: nm, role: next });
  }
  if (!found.length) return undefined;

  // 2) candidate portrait images (team page first, then home), with alt text.
  const imgPool: { src: string; alt: string }[] = [];
  for (const p of [teamPage, home]) {
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
    return { name: m.name, role: m.role, initials, bio: roleBio(m.role), photo };
  });
  return members;
}
const realTeam = teamMembers();

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
    documents.push({ src: `/files/${slug}/${fn}`, title: linkText.get(norm(a.url || "")) || prettyDoc(orig), kind, bytes: a.bytes || 0 });
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
  const tPages = pages.filter((p) => /testimonial|referenz|kundenstimm|kundenmeinung|bewertung|feedback|das-sagen|stimmen/i.test(`${p.url || ""} ${p.title || ""}`));
  const scan = (tPages.length ? tPages : [home]);
  const items: { quote: string; person: string; company?: string; city?: string }[] = [];
  const seen = new Set<string>();
  for (const p of scan) {
    const lines = fixEncoding(p.text || "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(QUOTE_RE);
      if (!m) continue;
      const quote = m[1].trim();
      if (CREDENTIAL_RE.test(quote)) continue;   // a qualification, not a testimonial
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
  const text = fixEncoding(pages.map((p) => p.text || "").join("\n"));
  const out: { value: string; label: string }[] = [];
  const push = (value: string, label: string) => { if (!out.some((o) => o.label === label)) out.push({ value, label }); };
  // "300+ Kunden" and "300+ KMU" are the same metric twice — collapse client-count
  // synonyms that share a value so a number never appears duplicated.
  const CLIENTISH = /^(mandate|mandanten|kunden|kundinnen|kmu|unternehmen)$/i;
  const clientValues = new Set<string>();
  // Experience under ~3 years undercuts trust and is usually a mis-parse ("seit
  // 2025" → "1+") — only surface a meaningful span.
  const MIN_YEARS = 3;
  const since = text.match(/\bseit\s+((?:19|20)\d{2})\b/i);
  if (since) { const y = +since[1]; const yrs = 2026 - y; if (y > 1900 && y <= 2026 && yrs >= MIN_YEARS) push(`${yrs}+`, "Jahre Erfahrung"); }
  // Capture grouped numbers too (Swiss "1'000", "10'000") so a thousands
  // separator isn't truncated to a bare "000".
  for (const m of text.matchAll(/\b(\d{1,3}(?:[\s'’.  ]\d{3})+|\d{2,6})\s*\+?\s*(Mandate|Mandanten|Kunden|Kundinnen|Unternehmen|KMU|Mitarbeitende|Mitarbeiter)\b/gi)) {
    const digits = m[1].replace(/\D/g, "");
    if (!/[1-9]/.test(digits)) continue;          // skip mis-parsed fragments like "000"
    const w = m[2], value = `${digits}+`;
    if (CLIENTISH.test(w)) { if (clientValues.has(value)) continue; clientValues.add(value); }
    const label = w.toLowerCase() === "kmu" ? "KMU" : w[0].toUpperCase() + w.slice(1).toLowerCase();
    push(value, label);
  }
  for (const m of text.matchAll(/\b(\d{1,3})\s*Jahre[n]?\s+(?:Erfahrung|Praxis)\b/gi)) { const yrs = +m[1]; if (yrs >= MIN_YEARS) push(`${yrs}+`, "Jahre Erfahrung"); }
  return out.length >= 2 ? out.slice(0, 4) : undefined;
}
function realPricing(): SiteContent["pricing"]["tiers"] | undefined {
  if (!analysis.has?.pricing) return undefined;
  const pPages = pages.filter((p) => /preis|tarif|pakete|angebot|kosten|pricing/i.test(`${p.url || ""} ${p.title || ""}`));
  const prices: string[] = [];
  for (const p of (pPages.length ? pPages : [home])) {
    const text = fixEncoding(p.text || "");
    for (const m of text.matchAll(/(?:ab\s*)?CHF\s?(\d{2,4})(?:\.[-–]|\.\d{2})?\s*(?:\/\s*|pro\s+)?(?:Monat|Mt\.?|mtl\.?)/gi)) {
      const v = `ab CHF ${m[1]}`;
      if (!prices.includes(v)) prices.push(v);
    }
  }
  if (prices.length < 2) return undefined;
  const names = ["Starter", "KMU", "Komplett", "Premium"];
  return prices.slice(0, 4).map((price, i) => ({ name: names[i] ?? `Paket ${i + 1}`, price, period: "/Monat", features: [], recommended: i === 1 }));
}

// --- REAL editorial text (briefing honesty rule): values / faq / tagline
//     are taken from the firm's OWN pages where present, else omitted (never faked).
const VALUE_STOP = /leistung|dienstleistung|kontakt|impressum|datenschutz|team|über uns|ueber uns|standort|news|blog|preise|öffnungszeit|cookie|sitemap|navigation|autor|zusammenfassung|inhaltsverzeichnis|\bfazit\b|einleitung|quellen|kommentar|artikel|teilen|\bshare\b|weiterlesen/i;
function realValues(): SiteContent["values"]["items"] | undefined {
  // only the firm's OWN positioning pages — never blog/ratgeber articles (noise)
  const scan = pages.filter((p) => {
    const hay = `${p.url || ""} ${p.title || ""}`;
    return /ueber-?uns|über-?uns|about-?us|\babout\b|philosoph|leitbild|unsere-?werte|warum-?wir|vorteile|grundsatz|versprechen/i.test(hay)
      && !/blog|news|ratgeber|aktuell|artikel|magazin|publikation|\/20\d\d\//i.test(hay);
  });
  const pool = scan.length ? scan : [home];
  const items: { title: string; body: string }[] = [];
  const seen = new Set<string>();
  for (const p of pool) {
    const bl = pageContentBlocks(p);
    for (let i = 0; i < bl.length - 1; i++) {
      if (!/^h[2-4]$/.test(bl[i].tag)) continue;
      const title = bl[i].text;
      if (title.length < 4 || title.length > 52 || /\?$/.test(title) || VALUE_STOP.test(title)) continue;
      const nx = bl[i + 1];
      if (!nx || nx.tag !== "p" || nx.text.length < 40 || nx.text.length > 320) continue;
      const k = title.toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      items.push({ title, body: nx.text });
      if (items.length >= 4) break;
    }
    if (items.length >= 4) break;
  }
  return items.length >= 3 ? items.slice(0, 4) : undefined;
}
function realFaq(): SiteContent["faq"]["items"] | undefined {
  const scan = pages.filter((p) => /faq|haeufig|häufig|fragen|wissen|q-?a|ratgeber/i.test(`${p.url || ""} ${p.title || ""}`));
  const pool = scan.length ? scan : pages.slice(0, 10);
  const items: { q: string; a: string }[] = [];
  const seen = new Set<string>();
  for (const p of pool) {
    const bl = pageContentBlocks(p);
    for (let i = 0; i < bl.length - 1; i++) {
      const isQ = /^(h[2-4]|dt|summary)$/.test(bl[i].tag) && /\?$/.test(bl[i].text);
      if (!isQ) continue;
      const q = bl[i].text;
      if (q.length < 10 || q.length > 160) continue;
      const nx = bl[i + 1];
      if (!nx || !/^(p|dd)$/.test(nx.tag) || nx.text.length < 25 || nx.text.length > 600) continue;
      const k = q.slice(0, 40).toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      items.push({ q, a: nx.text });
      if (items.length >= 8) break;
    }
    if (items.length >= 8) break;
  }
  return items.length >= 3 ? items.slice(0, 8) : undefined;
}
function realTagline(): string | undefined {
  if (desc && desc.length >= 20 && desc.length <= 160) return desc;
  const h2s = (home.headings?.h2 || []).map((t: string) => fixEncoding(t));
  return h2s.find((t: string) => t.length >= 15 && t.length <= 120 && /[a-zäöü]/.test(t) && !/leistung|kontakt|team|news|blog|impressum|cookie/i.test(t));
}

const h1: string = fixEncoding((home.headings?.h1 || [])[0] || "");
const desc: string = fixEncoding(home.meta?.description || "");
const heroHeadlineReal = h1 && h1.length > 8 && h1.length < 90 && h1.toLowerCase() !== firm.toLowerCase();
const ledeReal = desc && desc.length > 30;

// --- archetype (still drives variant affinity + per-page section sets) ---
const a = analysis.has || {};
const arch: ArchetypeId =
  a.pricing || (a.blog_news && (analysis.pages || 0) > 30) ? "swiss-digital"
  : (analysis.pages || 0) < 15 || (a.team && !a.pricing) ? "boutique"
  : "boutique";

// --- LOOK: dress the firm's recovered visual core in a modern design language ---
const brand = extractBrand(slug, ROOT);
const derived = deriveLook(brand, { firmKey: slug, archetype: arch });
const basePresetId = derived.basePresetId;

const c: string = city();

// --- trust: REAL certifications/software only (no fabricated CH fallback) ---
const realCerts: string[] = (analysis.trust?.certifications || []).slice(0, 5);
const realSoftware: string[] = (analysis.trust?.software || []).slice(0, 3);
const trustItems = [...realCerts, ...realSoftware];

// --- real social proof (or omitted) ---
const serviceItems = services();
const testimonialItems = realTestimonials(c);
const statItems = realStats();
const pricingTiers = realPricing();
const valueItems = realValues();
const faqItems = realFaq();
const tagline = realTagline();

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
      tagline ? "footer.tagline" : null, testimonialItems ? "hero.aside" : null,
      pricingTiers ? "pricing" : null, trustItems.length ? "trust.items" : null,
      media.assets.length ? "media.pool" : null,
      media.logo ? "media.logo" : null,
      media.badges.length ? "trust.badges" : null,
      Object.keys(media.serviceImages || {}).length ? "services.images" : null,
      media.documents.length ? "media.documents" : null,
      derived.colourSource === "scraped" ? "brand.colors" : null,
      brand.heading || brand.body ? "brand.fonts" : null].filter((x): x is string => !!x),
  },
  media,
  nav: {
    brand: firm,
    links: [{ label: "Home", href: "#" }, { label: "Leistungen", href: "#services" }, { label: "Über uns", href: "#about" }],
    cta: bookCta,
    logo: media.logo, logoLight: media.logoLight,
  },
  hero: {
    eyebrow: `Treuhand · ${c}`,
    titleLead: heroHeadlineReal ? h1 : "Ihre Finanzen,",
    titleAccent: heroHeadlineReal ? "" : "klar geführt.",
    lede: ledeReal ? desc : `Buchhaltung, Steuern und Beratung für KMU und Privatpersonen in ${c}. Persönlich, präzise und vorausschauend an Ihrer Seite.`,
    primaryCta: bookCta, secondaryCta: "Leistungen",
    asideLabel: testimonialItems ? "Mandantenstimme" : "Über uns",
    asideQuote: testimonialItems ? testimonialItems[0].quote : (tagline ?? `Persönliche Treuhand-Betreuung für KMU und Private in ${c}.`),
    asideAttribution: testimonialItems ? `— ${testimonialItems[0].person}${testimonialItems[0].company ? ", " + testimonialItems[0].company : ""}` : firm,
    image: heroImage ?? media.hero,   // real hero, else CC stock fallback
  },
  services: { eyebrow: "Leistungen", heading: "Alles aus einer Hand.", items: serviceItems },
  values: { eyebrow: "Warum wir", heading: "Ihr Vorteil.", items: valueItems ?? [] },
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
      address: undefined, phone: site.contact?.phones?.[0], email: site.contact?.emails?.[0],
      hours: "Mo–Fr 08:00–17:00",
    },
    formCta: "Nachricht senden",
  },
  footer: {
    brand: firm, tagline: tagline ?? `Ihr Treuhandpartner in ${c} – Buchhaltung, Steuern und Beratung für KMU.`,
    logo: media.logo, logoLight: media.logoLight,
    columns: [
      { title: "Sitemap", links: ["Leistungen", "Über uns", ...(fns.jobs ? ["Offene Stellen"] : []), "Kontakt"] },
      { title: "Standort", links: [c, site.contact?.phones?.[0] || "+41 …", site.contact?.emails?.[0] || "info@…"] },
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
console.log(`Extracted ${slug} -> archetype=${arch} base=${basePresetId} color=${derived.tokens.color.primary} (${derived.colourSource}; scraped=${brand.primary ?? "none"}/${brand.confidence})${brand.heading ? " font=" + brand.heading.family : ""}`);
console.log(`  media: ${media.assets.length} assets (logo=${media.logo ? "y" : "n"} badges=${media.badges.length} photos=${media.photos.length} serviceImages=${Object.keys(media.serviceImages || {}).length}) docs=${media.documents.length} optimized=${opt.n} (-${(opt.saved / 1048576).toFixed(1)}MB) prunedLowQ=${droppedLowQ} faces=${facePhotos} clip=${clip.refined}r/${clip.removed}x stock=${stockN}${media.stock ? " (CC fallback)" : ""}`);
console.log(`  homepage: ${brief.homepageSlots.join(" › ")}`);
console.log(`  dropped:  ${dropped.length ? dropped.join(", ") : "none"}  | pages: ${brief.pageRefs.map((r) => r.pageType).join(", ")}`);
console.log(`  fns: booking=${fns.onlineBooking} jobs=${fns.jobs} | media=${media.assets.length}(logo=${media.logo ? "y" : "n"} badges=${media.badges.length})`);
