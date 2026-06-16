/**
 * Generates the component-collection folder scaffold:
 *   design-system/components/<category>/<type>/{meta.json,.gitkeep}
 * Sections are grouped by slot; other categories by element id.
 * Merges the inventory extracted from the 4 built sites with new element types
 * discovered across the 50 scraped Treuhänder sites.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { inventory, sections, type InventoryEntry } from "./component-inventory.ts";

const ROOT = join(import.meta.dirname, "components");

// --- new element types observed in the 50 real sites but weak/absent in the 4 templates ---
type Extra = Omit<InventoryEntry, "id"> & { id: string; discoveredIn: "scraped"; prevalence?: string };
const additions: Extra[] = [
  { id: "sections/testimonials", category: "section", slot: undefined, name: "Testimonials / reviews",
    variants: ["quote cards", "star-rating row", "Google-reviews embed", "logo + quote"],
    structure: "grid/carousel of client quotes with name/role/rating; or embedded Google rating badge",
    sources: [], styleAffinity: ["any"], priority: "common",
    discoveredIn: "scraped", prevalence: "28% of scraped sites; absent in built templates" },
  { id: "sections/blog-teaser", category: "section", slot: undefined, name: "Blog / insights teaser",
    variants: ["3-card latest articles", "news list", "downloads / Merkblätter list"],
    structure: "section header + 3-col article cards (image, date, title, excerpt, read-more)",
    sources: [], styleAffinity: ["any"], priority: "common",
    discoveredIn: "scraped", prevalence: "64% of scraped sites have a blog/news area; absent in built templates" },
  { id: "sections/trust-bar", category: "section", slot: undefined, name: "Trust / certification & partner logo bar",
    variants: ["certification logos (TREUHAND SUISSE, EXPERTsuisse, RAB)", "software partner logos (bexio, Abacus)", "membership row"],
    structure: "horizontal strip of greyscale logos; often above footer or under hero",
    sources: [], styleAffinity: ["any"], priority: "core",
    discoveredIn: "scraped", prevalence: "certifications cited by ~70% (eidg. Diplom) / 68% (RAB); built sites only used text" },
  { id: "sections/jobs-teaser", category: "section", slot: undefined, name: "Jobs / open positions teaser",
    variants: ["open-roles list", "we're-hiring banner"],
    structure: "list of positions or a recruiting CTA band",
    sources: [], styleAffinity: ["any"], priority: "optional",
    discoveredIn: "scraped", prevalence: "34% of scraped sites" },
  { id: "widgets/client-portal-login", category: "widget", name: "Client portal / login entry",
    variants: ["login button in nav", "AbaWeb/portal CTA"],
    structure: "prominent login link/button routing to a client portal",
    sources: [], styleAffinity: ["any"], priority: "common",
    discoveredIn: "scraped", prevalence: "16% of scraped sites expose a client portal/login" },
  { id: "widgets/cookie-consent", category: "widget", name: "Cookie consent banner",
    variants: ["bottom banner", "modal w/ preferences"],
    structure: "consent banner with accept/settings (legally required CH/EU)",
    sources: [], styleAffinity: ["any"], priority: "common",
    discoveredIn: "scraped", prevalence: "explicit tooling on 6%, but required for all" },
  { id: "forms/newsletter-signup", category: "form", name: "Newsletter signup",
    variants: ["inline email field", "footer subscribe"],
    structure: "single email input + subscribe button, often in footer or after blog",
    sources: [], styleAffinity: ["any"], priority: "optional",
    discoveredIn: "scraped", prevalence: "common alongside blog/news sites" },
];

function slugForSectionSlot(slot: string) { return `sections/${slot}`; }
function slugForEntry(e: InventoryEntry) {
  const id = e.id.includes(".") ? e.id.split(".")[1] : e.id;
  return `${categoryDir(e.category)}/${id}`;
}
function categoryDir(cat: string) {
  return cat === "section" ? "sections"
    : cat === "navigation" ? "navigation"
    : cat === "footer" ? "footer"
    : cat === "button" ? "buttons"
    : cat === "card" ? "cards"
    : cat === "form" ? "forms"
    : cat === "widget" ? "widgets"
    : cat === "decoration" ? "decoration"
    : "layout";
}

const manifest: Record<string, unknown> = {};

function emit(relPath: string, meta: Record<string, unknown>) {
  const dir = join(ROOT, ...relPath.split("/"));
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "meta.json"), JSON.stringify(meta, null, 2));
  writeFileSync(join(dir, ".gitkeep"), "");
  manifest[relPath] = meta;
}

// 1) sections grouped by slot (aggregate variants per slot)
const bySlot = new Map<string, InventoryEntry[]>();
for (const s of sections) {
  const slot = s.slot ?? "misc";
  if (!bySlot.has(slot)) bySlot.set(slot, []);
  bySlot.get(slot)!.push(s);
}
for (const [slot, entries] of bySlot) {
  emit(slugForSectionSlot(slot), {
    slot, category: "section", name: `Section: ${slot}`,
    variants: entries.flatMap((e) => e.variants),
    fromBuiltSites: [...new Set(entries.flatMap((e) => e.sources))],
    styleAffinity: [...new Set(entries.flatMap((e) => e.styleAffinity))],
    priority: entries.some((e) => e.priority === "core") ? "core"
      : entries.some((e) => e.priority === "common") ? "common" : "optional",
    entryIds: entries.map((e) => e.id),
  });
}

// 2) all non-section categories, one folder per element id
for (const [cat, entries] of Object.entries(inventory)) {
  if (cat === "sections") continue;
  for (const e of entries as InventoryEntry[]) {
    emit(slugForEntry(e), {
      id: e.id, category: e.category, name: e.name, variants: e.variants,
      structure: e.structure, fromBuiltSites: e.sources,
      styleAffinity: e.styleAffinity, priority: e.priority, notes: e.notes ?? null,
    });
  }
}

// 3) additions discovered in the scraped sites
for (const a of additions) {
  const rel = a.id.includes("/") ? a.id : slugForEntry(a as InventoryEntry);
  emit(rel, {
    id: a.id, category: a.category, name: a.name, variants: a.variants,
    structure: a.structure, fromBuiltSites: a.sources, styleAffinity: a.styleAffinity,
    priority: a.priority, discoveredIn: a.discoveredIn, prevalence: a.prevalence ?? null,
  });
}

writeFileSync(join(ROOT, "_manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Created", Object.keys(manifest).length, "element folders under design-system/components/");
