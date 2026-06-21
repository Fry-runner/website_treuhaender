/**
 * IA / information-architecture guard — protects the page-composition design rules
 * derived from the 50-site critique (see REVIEW-BRIEFING.md). Re-derives every
 * example firm's sitemap + per-page section sequence (mirroring pages.ts +
 * SiteRouter) and ASSERTS the rules, so a future template/heading edit can't quietly
 * reintroduce the problems:
 *
 *   R1/R6 — one H1 per page: a subpage's first content section must not repeat the
 *            page title as its heading (eyebrows are already off site-wide).
 *   R3    — owner-page principle: `testimonials` is not restated full on /leistungen.
 *   R4    — no full contact FORM stacked under the CTA on every service-detail page.
 *   R5    — homepage budget: <= HOME_MAX_CONTENT content sections after the trim.
 *
 * Run: `npm run audit:ia` (exits 1 on any violation). Pure JS, no build step.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pageTypes } from "../pages.ts";
import { HOME_MAX_CONTENT, HOME_DROP_ORDER, PREVIEW } from "../ia-rules.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const exDir = path.join(root, "content", "examples");
const files = fs.readdirSync(exDir).filter((f) => f.endsWith(".json"));

// ---- source-of-truth invariants imported from the real engine modules ---------
// (Was regex-parsed out of pages.ts / SiteRouter.tsx — fragile and silently stale
//  when the renderer changed. Now the guard tests the SAME rule objects the renderer
//  runs: page templates from pages.ts, budget/drop-order/preview from ia-rules.ts.)
const templateSections = (id) => pageTypes[id]?.sections ?? null;

// ---- firmHeadings (ported from content/sectionHeads.ts) -----------------------
const POOLS = {
  services: { eyebrow: ["Leistungen", "Unser Angebot", "Was wir tun", "Dienstleistungen"], heading: ["Alles aus einer Hand.", "Ihre Treuhand-Leistungen.", "Damit Ihre Zahlen stimmen.", "Rundum betreut.", "Treuhand für {city}.", "Ihr Treuhänder in {city}."] },
  values: { eyebrow: ["Warum wir", "Worauf es ankommt", "Was uns ausmacht", "Unsere Haltung"], heading: ["Ihr Vorteil.", "Warum Mandanten uns wählen.", "Das macht den Unterschied.", "Mehr als nur Zahlen."] },
  team: { eyebrow: ["Team", "Wer wir sind", "Menschen"], heading: ["Menschen, die Ihre Zahlen kennen.", "Das Team hinter Ihren Zahlen.", "Persönlich für Sie da.", "Ihr Team in {city}."] },
  pricing: { eyebrow: ["Preise", "Pakete", "Konditionen"], heading: ["Transparente Pauschalen.", "Faire, klare Preise.", "Preise ohne Überraschungen."] },
  testimonials: { eyebrow: ["Mandantenstimmen", "Referenzen", "Kundenstimmen"], heading: ["Unternehmen vertrauen uns.", "Was unsere Mandanten sagen.", "Vertrauen, das zählt."] },
  faq: { eyebrow: ["Fragen & Antworten", "FAQ", "Gut zu wissen"], heading: ["Häufige Fragen.", "Antworten auf Ihre Fragen.", "Das werden wir oft gefragt."] },
  gallery: { eyebrow: ["Galerie", "Einblicke", "Impressionen"], heading: ["Einblicke.", "Bei uns vor Ort.", "Impressionen aus {city}."] },
  contact: { eyebrow: ["Kontakt", "Sprechen wir", "Erreichbarkeit"], heading: ["Sprechen wir.", "So erreichen Sie uns.", "Wir freuen uns auf Sie.", "So erreichen Sie uns in {city}."] },
};
function cityOf(c) { const eb = c.hero?.eyebrow || ""; const x = eb.includes("·") ? eb.split("·").pop().trim() : ""; return (x && x.length >= 2 && x.length <= 30 && /[a-zäöü]/i.test(x)) ? x : undefined; }
function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }
function firmHeadings(c, seed = 0) {
  const city = cityOf(c); const base = (hash(c.meta?.domain || c.meta?.firm || "x") + seed) >>> 0;
  const fill = (t) => t.replace(/\{city\}/g, city ?? "");
  const usable = (arr) => { const u = arr.filter((t) => city || !t.includes("{city}")); return u.length ? u : arr; };
  const pick = (arr, salt) => { const p = usable(arr); return fill(p[(base + salt) % p.length]); };
  const out = {}; let salt = 1;
  for (const [k, p] of Object.entries(POOLS)) { out[k] = { heading: pick(p.heading, salt * 13) }; salt += 1; }
  return out;
}

// ---- composition mirror (pages.ts + SiteRouter budget) ------------------------
const PT_NAME = { home: "Home", services: "Leistungen", "service-detail": "", about: "Über uns", team: "Team", pricing: "Preise", contact: "Kontakt", legal: "" };
const TEAM_PAGE_MIN = 5;
const statItems = (c) => (c.stats?.items || []).filter((it) => { const d = String(it.value).replace(/[^0-9]/g, ""); return d === "" || Number(d) !== 0; });
const hasContent = (c, s) => {
  switch (s) {
    case "services": return (c.services?.items || []).length > 0;
    case "values": return (c.values?.items || []).length > 0;
    case "team": return (c.team?.members || []).length > 0;
    case "pricing": return (c.pricing?.tiers || []).length > 0;
    case "testimonials": return (c.testimonials?.items || []).length > 0;
    case "stats": return statItems(c).length > 0;
    case "faq": return (c.faq?.items || []).length > 0;
    case "partners": return (c.trust?.items || []).length > 0 || (c.media?.badges || []).length > 0;
    case "gallery": return (c.media?.photos || []).length >= 3;
    case "map": return false;
    case "downloads": return (c.media?.documents?.length ?? 0) > 0;
    default: return true;
  }
};
function withGenericSlots(slots) {
  const s = [...slots];
  if (!s.includes("audience")) { const at = s.indexOf("services"); s.splice(at >= 0 ? at + 1 : 0, 0, "audience"); }
  if (!s.includes("process")) { const at = s.indexOf("faq"); s.splice(at >= 0 ? at : (s.includes("cta") ? s.indexOf("cta") : s.length), 0, "process"); }
  return s;
}
// slot -> owner-subpage pageType, read from the shared PREVIEW rule.
function homeBudgetCount(c, slots, existingTypes) {
  let seq = withGenericSlots(slots);
  if ((c.media?.photos || []).length >= 3 && !seq.includes("gallery")) { const at = seq.indexOf("cta"); seq = at >= 0 ? [...seq.slice(0, at), "gallery", ...seq.slice(at)] : [...seq, "gallery"]; }
  const hasCta = seq.includes("cta"); // R4: a page with a CTA band drops its standalone contact section
  // R3+: one preview per subpage — keep the first home section per owner subpage.
  const seenTargets = new Set();
  let vis = seq
    .filter((s) => hasContent(c, s))
    .filter((s) => !(s === "contact" && hasCta))
    .filter((s) => {
      const t = PREVIEW[s]?.type;
      if (!t || !existingTypes.has(t)) return true;
      if (seenTargets.has(t)) return false;
      seenTargets.add(t);
      return true;
    });
  const count = (ss) => ss.filter((s) => s !== "nav" && s !== "footer").length;
  const drop = new Set();
  for (const s of HOME_DROP_ORDER) { if (count(vis.filter((x) => !drop.has(x))) <= HOME_MAX_CONTENT) break; if (vis.includes(s)) drop.add(s); }
  return count(vis.filter((s) => !drop.has(s)));
}
const norm = (s) => (s || "").toLowerCase().replace(/[.!?·]/g, "").trim();
const FIRST_HEADING = { services: (h) => h.services.heading, pricing: (h) => h.pricing.heading, team: (h) => h.team.heading };

// ---- run the assertions -------------------------------------------------------
const fails = [];
const note = (msg) => fails.push(msg);

// R4: a service-detail page must never carry a full contact form.
const sd = templateSections("service-detail");
if (!sd) note("R4: could not read service-detail template from pages.ts");
else if (sd.includes("contact")) note(`R4: service-detail template still includes a full "contact" form: [${sd.join(", ")}]`);

// R3: the services overview must not restate full social proof.
const sv = templateSections("services");
if (sv && sv.includes("testimonials")) note(`R3: services overview template restates full "testimonials": [${sv.join(", ")}]`);

for (const f of files) {
  const c = JSON.parse(fs.readFileSync(path.join(exDir, f), "utf8"));
  const slug = f.replace(".json", "");
  const heads = firmHeadings(c, 0);
  const brief = c.meta?.brief;
  if (!brief) continue;

  // R5: homepage budget (+ R3 one-preview-per-subpage dedupe).
  const homeRef = (brief.pageRefs || []).find((r) => r.pageType === "home");
  if (homeRef) {
    const existingTypes = new Set((brief.pageRefs || []).map((r) => r.pageType));
    const n = homeBudgetCount(c, brief.homepageSlots || [], existingTypes);
    if (n > HOME_MAX_CONTENT) note(`R5: ${slug} home has ${n} content sections (> ${HOME_MAX_CONTENT})`);
  }

  // R1/R6: first content section's heading must not equal the page H1.
  for (const r of brief.pageRefs || []) {
    const get = FIRST_HEADING[r.pageType];
    if (!get) continue;
    if (!hasContent(c, r.pageType)) continue;
    const title = PT_NAME[r.pageType];
    if (norm(title) === norm(get(heads))) note(`R1: ${slug} /${r.pageType}: first heading "${get(heads)}" repeats the page title "${title}"`);
  }
}

if (!(Array.isArray(HOME_DROP_ORDER) && HOME_DROP_ORDER.length > 0)) note("R5: HOME_DROP_ORDER did not load from ia-rules.ts");

if (fails.length) {
  console.error(`\n✗ IA guard: ${fails.length} violation(s)\n` + fails.map((m) => "  - " + m).join("\n") + "\n");
  process.exit(1);
}
console.log(`✓ IA guard passed — ${files.length} firms · home budget <= ${HOME_MAX_CONTENT} · service-detail form-free · no title/heading echo`);
