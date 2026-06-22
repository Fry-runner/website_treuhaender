// Rank firms by how STRONG/MODERN their existing web presence looks, inferred from the
// scrape signals the generator stored (design maturity + content depth + media). A high
// score = already a solid site = cold-acquisition (a redesign pitch) is least likely to land.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "content/examples";
const GENERIC_BODY = /^Diese Leistung übernehmen wir vollständig und termingerecht/;
const rows = [];

for (const f of readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "active.json")) {
  let c; try { c = JSON.parse(readFileSync(join(dir, f), "utf8")); } catch { continue; }
  const b = c.meta?.brand ?? {};
  const m = c.media ?? {};
  const real = c.meta?.real ?? [];
  const svc = c.services?.items ?? [];
  const team = c.team?.members ?? [];
  const realPhotos = (m.photos ?? []).length;            // firm's own (non-stock) scene photos
  const usedStock = !!m.stock;                            // generator had to inject CC stock
  const sig = [];                                         // human-readable strengths
  let s = 0;

  // --- DESIGN MATURITY (strongest signal of a modern, built site) ---
  if (b.confidence === "high") { s += 4; sig.push("Brand-Tokens(high)"); }
  else if (b.confidence === "medium") { s += 2; sig.push("Brand-Vars(med)"); }
  if (b.heading) { s += 2; sig.push("Font:" + b.heading.family); }
  if (b.body && (!b.heading || b.body.family !== b.heading.family)) s += 1;

  // --- MEDIA INVESTMENT ---
  if (!usedStock && realPhotos >= 6) { s += 3; sig.push(realPhotos + " eigene Fotos"); }
  else if (!usedStock && realPhotos >= 3) { s += 2; sig.push(realPhotos + " eigene Fotos"); }
  else if (usedStock) { s -= 2; sig.push("Stock-Fallback nötig"); }
  if (team.some((t) => t.photo)) { s += 2; sig.push("Team-Fotos"); }
  if ((m.badges ?? []).length) { s += 1; sig.push((m.badges).length + " Badges/Zerti"); }
  if ((m.documents ?? []).length) { s += 1; sig.push((m.documents).length + " Downloads"); }

  // --- CONTENT DEPTH ---
  if ((c.about?.paragraphs ?? []).length) { s += 2; sig.push("echtes About"); }
  if ((c.testimonials?.items ?? []).length) { s += 2; sig.push((c.testimonials.items).length + " Testimonials"); }
  if ((c.values?.items ?? []).length) { s += 1; sig.push("Werte"); }
  if ((c.faq?.items ?? []).length) { s += 1; sig.push("FAQ"); }
  if (c.history) { s += 1; sig.push("Historie"); }
  if (c.process) { s += 1; sig.push("echter Prozess"); }
  if (c.audience) { s += 1; sig.push("echte Zielgruppen"); }
  const realSvcBodies = svc.filter((x) => x.body && !GENERIC_BODY.test(x.body)).length;
  if (realSvcBodies >= 2) { s += 2; sig.push(realSvcBodies + " echte Leistungstexte"); }
  if (team.length >= 4) { s += 1; sig.push(team.length + "-köpfiges Team"); }

  rows.push({ slug: f.replace(".json", ""), firm: c.meta?.firm || f, domain: c.meta?.domain, score: s, conf: b.confidence, realCount: real.length, sig });
}

rows.sort((a, b) => b.score - a.score);
const pad = (s, n) => String(s).padEnd(n);
console.log("RANG  SCORE  CONF    FIRMA / DOMAIN                              SIGNALE");
rows.forEach((r, i) => {
  console.log(`${pad(i + 1, 4)}  ${pad(r.score, 5)}  ${pad(r.conf, 6)}  ${pad((r.firm || "").slice(0, 26), 27)} ${pad(r.domain || "", 26)}  ${r.sig.join(", ")}`);
});
const scores = rows.map((r) => r.score);
const med = scores[Math.floor(scores.length / 2)];
console.log(`\nn=${rows.length}  max=${scores[0]}  median≈${med}  min=${scores[scores.length - 1]}`);

// --- Kaltakquise-Viabilität: schwacher Bestands-Auftritt = Prototyp klar besser = Pitch lohnt
const n = rows.length;
const strong = rows.filter((r) => r.score >= 11).length;   // starker Auftritt → Pitch unwahrscheinlich
const medium = rows.filter((r) => r.score >= 7 && r.score <= 10).length; // grenzwertig
const weak = rows.filter((r) => r.score <= 6).length;       // schwach → klar lohnend
const pct = (x) => `${x} (${Math.round((x / n) * 100)}%)`;
console.log(`\n=== Kaltakquise-Viabilität (Bestands-Auftritt) ===`);
console.log(`stark   (Score ≥11) → Pitch unwahrscheinlich : ${pct(strong)}`);
console.log(`mittel  (Score 7–10) → grenzwertig möglich    : ${pct(medium)}`);
console.log(`schwach (Score ≤6)  → klar lohnend            : ${pct(weak)}`);
console.log(`→ Kaltakquise sinnvoll möglich (mittel+schwach): ${pct(medium + weak)}`);
