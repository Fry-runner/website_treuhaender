// One-off content audit over all generated firm JSONs.
// Detects: duplicate text, image reuse across roles, empty/thin subpages,
// generic-filler sections. Read-only. Run: node scripts/audit-content.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/examples";
const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && f !== "active.json").sort();

const norm = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").replace(/[.,;:!?»«"'`–-]/g, "").trim();
const base = (p) => (typeof p === "string" ? p.split("/").pop() : p);
const short = (s, n = 60) => { s = (s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) + "…" : s; };

const report = {};
const tally = {};
const bump = (k) => (tally[k] = (tally[k] || 0) + 1);

for (const file of files) {
  const slug = file.replace(".json", "");
  let c;
  try { c = JSON.parse(readFileSync(join(DIR, file), "utf8")); } catch { continue; }
  const issues = [];

  // ---- 1) TEXT REUSE ----------------------------------------------------
  // Collect long-ish text strings with their path; flag any normalized string
  // that appears in >=2 distinct locations.
  const texts = []; // {path, raw}
  const add = (path, raw) => { if (raw && String(raw).trim().length >= 35) texts.push({ path, raw: String(raw) }); };
  const h = c.hero || {};
  add("hero.lede", h.lede);
  add("hero.titleAccent", [h.titleLead, h.titleAccent, h.titleTail].filter(Boolean).join(" "));
  add("hero.asideQuote", h.asideQuote);
  const ab = c.about || {};
  add("about.lead", ab.lead);
  (ab.paragraphs || []).forEach((p, i) => add(`about.paragraphs[${i}]`, p));
  (c.services?.items || []).forEach((s, i) => { add(`services[${i}].summary(${short(s.title,18)})`, s.summary); add(`services[${i}].body`, s.body); });
  (c.values?.items || []).forEach((v, i) => add(`values[${i}](${short(v.title,18)})`, v.body));
  (c.process?.steps || []).forEach((s, i) => add(`process[${i}](${short(s.title,18)})`, s.body));
  (c.audience?.items || []).forEach((a, i) => add(`audience[${i}](${short(a.title,18)})`, a.body));
  (c.faq?.items || []).forEach((q, i) => add(`faq[${i}].a`, q.a));
  (c.team?.members || []).forEach((m, i) => add(`team[${i}].bio(${short(m.name,16)})`, m.bio));
  add("cta.sub", c.cta?.sub);
  add("footer.tagline", c.footer?.tagline);

  const byNorm = new Map();
  for (const t of texts) {
    const k = norm(t.raw);
    if (!k) continue;
    if (!byNorm.has(k)) byNorm.set(k, []);
    byNorm.get(k).push(t.path);
  }
  for (const [k, paths] of byNorm) {
    if (paths.length >= 2) { issues.push({ cat: "text-dup", msg: `gleicher Text in ${paths.join(" + ")}: "${short(byNorm.get(k) && texts.find(t => norm(t.raw) === k).raw, 70)}"` }); bump("text-dup"); }
  }
  // service summary === body (redundant detail page)
  (c.services?.items || []).forEach((s) => {
    if (s.summary && s.body && norm(s.summary) === norm(s.body)) { issues.push({ cat: "text-dup", msg: `Leistung "${short(s.title,24)}": summary == body (Detailseite wiederholt sich)` }); bump("text-dup"); }
  });

  // ---- 2) IMAGE REUSE ACROSS ROLES -------------------------------------
  const m = c.media || {};
  const hero = c.hero?.image;
  const svcImgs = (c.services?.items || []).map((s) => s.image).filter(Boolean);
  const teamPhotos = (c.team?.members || []).map((t) => t.photo).filter(Boolean);
  const mapImgs = Object.values(m.serviceImages || {});
  // hero == a service image
  if (hero && (svcImgs.includes(hero) || mapImgs.includes(hero))) { issues.push({ cat: "img-dup", msg: `Hero-Bild = ein Leistungs-Bild (${base(hero)})` }); bump("img-dup"); }
  // duplicate service images
  const svcSeen = {};
  svcImgs.forEach((s, i) => { const t = c.services.items[i].title; (svcSeen[s] = svcSeen[s] || []).push(t); });
  for (const [src, titles] of Object.entries(svcSeen)) if (titles.length >= 2) { issues.push({ cat: "img-dup", msg: `gleiches Foto für mehrere Leistungen (${base(src)}): ${titles.map(t=>short(t,18)).join(", ")}` }); bump("img-dup"); }
  // duplicate team photos
  const teamSeen = {};
  teamPhotos.forEach((p, i) => { (teamSeen[p] = teamSeen[p] || []).push(c.team.members[i].name); });
  for (const [src, names] of Object.entries(teamSeen)) if (names.length >= 2) { issues.push({ cat: "img-dup", msg: `gleiches Portrait für mehrere Personen (${base(src)}): ${names.join(", ")}` }); bump("img-dup"); }
  // hero also in photos/backgrounds pool AND used as service → already flagged; check hero in serviceImages map mismatch
  // team photo == hero or service image
  teamPhotos.forEach((p, i) => { if (p === hero || svcImgs.includes(p)) { issues.push({ cat: "img-dup", msg: `Portrait ${short(c.team.members[i].name,16)} = Hero/Leistungsbild (${base(p)})` }); bump("img-dup"); } });

  // ---- 3) EMPTY / THIN SUBPAGES & SECTIONS -----------------------------
  if (!c.about || !(c.about.paragraphs || []).length) { issues.push({ cat: "thin", msg: `Über-uns ohne echten Fliesstext (about.paragraphs leer) → generischer Default` }); bump("thin"); }
  else if ((c.about.lead || "").length < 30 && (c.about.paragraphs || []).join("").length < 120) { issues.push({ cat: "thin", msg: `Über-uns sehr dünn (lead+Absätze < 150 Zeichen)` }); bump("thin"); }
  // service-detail pages that are thin (no body and no bullets)
  const thinSvc = (c.services?.items || []).filter((s) => !(s.body && s.body.trim()) && !((s.bullets || []).length));
  if (thinSvc.length) { issues.push({ cat: "thin", msg: `${thinSvc.length}/${c.services.items.length} Leistungs-Detailseiten ohne Body & ohne Bullets (nur Titel+Summary): ${thinSvc.slice(0,4).map(s=>short(s.title,18)).join(", ")}${thinSvc.length>4?" …":""}` }); bump("thin"); }
  // (Bio-Thinness-Check entfernt — Team-Bios werden bewusst NICHT mehr fabriziert;
  //  Karten zeigen Name + Rolle. Ein fehlendes Bio ist daher kein Mangel mehr.)
  if (!(c.values?.items || []).length) { issues.push({ cat: "thin", msg: `values leer (keine "Das macht uns aus"-Inhalte)` }); bump("thin"); }
  if (!(c.faq?.items || []).length) { issues.push({ cat: "thin", msg: `FAQ leer` }); bump("thin"); }
  if (!(c.testimonials?.items || []).length) { issues.push({ cat: "thin", msg: `keine Testimonials` }); bump("thin"); }

  // ---- 4) GENERIC FILLER (absent => composer renders neutral boilerplate)
  if (!c.process) { issues.push({ cat: "filler", msg: `kein scrape-Prozess → generischer "So arbeiten wir"-Default wird gerendert` }); bump("filler"); }
  if (!c.audience) { issues.push({ cat: "filler", msg: `keine scrape-Zielgruppen → generische "Für wen"-Default wird gerendert` }); bump("filler"); }
  if (!c.history) { issues.push({ cat: "info", msg: `keine Historie (< 3 datierte Meilensteine) → Über-uns ohne Zeitstrahl` }); bump("info-history"); }
  // stats that look like fillers (no digit)
  const stats = c.stats?.items || [];
  if (stats.length && stats.some((s) => !/\d/.test(s.value || ""))) { issues.push({ cat: "filler", msg: `Stats ohne echte Zahl: ${stats.filter(s=>!/\d/.test(s.value||"")).map(s=>short(s.value,12)).join(", ")}` }); bump("filler"); }

  report[slug] = { firm: c.meta?.firm || slug, issues, n: { svc: (c.services?.items||[]).length, val: (c.values?.items||[]).length, team: (c.team?.members||[]).length, faq:(c.faq?.items||[]).length } };
}

// ---- OUTPUT --------------------------------------------------------------
const order = ["img-dup", "text-dup", "thin", "filler", "info"];
let firmsWithIssues = 0;
for (const slug of Object.keys(report)) {
  const r = report[slug];
  const real = r.issues.filter((i) => i.cat !== "info");
  if (r.issues.length) firmsWithIssues++;
  const head = `\n### ${r.firm}  [${slug}]  (svc:${r.n.svc} val:${r.n.val} team:${r.n.team} faq:${r.n.faq})`;
  if (!r.issues.length) { console.log(head + "\n   ✓ keine auffälligen Unstimmigkeiten"); continue; }
  console.log(head);
  r.issues.sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
  for (const i of r.issues) console.log(`   [${i.cat}] ${i.msg}`);
}
console.log("\n\n===== SUMME =====");
console.log(`Firmen gesamt: ${files.length}`);
for (const [k, v] of Object.entries(tally).sort((a,b)=>b[1]-a[1])) console.log(`  ${k}: ${v}`);
