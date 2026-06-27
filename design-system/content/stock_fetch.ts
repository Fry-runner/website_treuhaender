/**
 * stock_fetch.ts — build the curated stock-photo fallback pack from the Pexels API
 * (curated, high-quality, commercial-free, no attribution required). Output goes to
 * design-system/stock/<topic>/ + credits.json; the generator (extract.ts →
 * stockFallback) then picks from it for firms whose scrape has no usable imagery.
 *
 * These are PROTOTYPE placeholders (replaced later), so quality/relevance matters
 * more than license — Pexels covers both.
 *
 * Setup: get a free key at https://www.pexels.com/api/ , then either
 *   - set env var  PEXELS_API_KEY=xxxx   (preferred), or
 *   - create file  design-system/.pexels-key  containing just the key.
 * Run: node --experimental-strip-types stock_fetch.ts
 */
import { mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const STOCK = join(import.meta.dirname, "..", "stock");

// topic -> Pexels queries + longest-edge cap + how many to keep (all landscape).
// Hero-grade (wide, impressive) topics carry a 1920 cap; section/content topics 1600.
const TOPICS: Record<string, { queries: string[]; cap: number; keep: number }> = {
  // --- HERO / full-bleed grade (the four allowed hero motifs) — enlarged so 50 firms
  //     draw distinct hero images instead of recycling the same three shots ---
  // city/skyline are kept BUSINESS-only (financial district, not touristy old-town/tram)
  // in case they're re-enabled; the Alpine "landscape" topic is gone (not a Treuhänder motif).
  city:        { queries: ["Zurich financial district buildings", "Zurich business district", "Zurich Paradeplatz banking district", "Zurich modern office towers", "Zurich Bahnhofstrasse business", "Swiss financial district city", "Zurich downtown skyscrapers", "modern Swiss business district"], cap: 1920, keep: 12 },
  skyline:     { queries: ["financial district skyscrapers", "business district skyline", "corporate office towers skyline", "modern downtown business district", "glass towers financial district"],            cap: 1920, keep: 8 },
  architecture:{ queries: ["glass office building facade", "modern corporate building exterior", "corporate headquarters building", "contemporary glass office tower", "geometric office facade", "office tower exterior", "modern business building"],   cap: 1920, keep: 12 },
  office:      { queries: ["modern office interior", "bright corporate office workspace", "professional office interior", "contemporary open plan office", "minimal corporate office", "empty modern office interior", "scandinavian office workspace", "business meeting room office", "elegant office reception area"], cap: 1920, keep: 16 },
  reception:   { queries: ["modern office reception lobby", "company office entrance interior", "office lobby design", "corporate reception desk"],     cap: 1920, keep: 6 },
  boardroom:   { queries: ["conference room boardroom", "modern meeting room interior", "empty boardroom table"],                                   cap: 1920, keep: 6 },
  desk:        { queries: ["accounting desk calculator", "tax documents desk", "office desk laptop coffee", "desk paperwork pen", "workspace desk top view", "accountant desk numbers"],               cap: 1920, keep: 10 },
  documents:   { queries: ["signing contract close up", "business documents signature pen", "tax paperwork documents", "financial documents close up", "stack of documents office", "invoice paperwork desk"],     cap: 1920, keep: 10 },
  laptop:      { queries: ["laptop spreadsheet finance", "working laptop office desk", "typing laptop business", "laptop financial charts", "laptop accounting software"],          cap: 1920, keep: 8 },
  finance:     { queries: ["financial charts report documents", "calculator financial planning", "spreadsheet analysis laptop", "financial report graphs", "accounting ledger numbers"], cap: 1920, keep: 8 },
  // --- SECTION / content grade (people scenes — never used for the hero) ---
  meeting:     { queries: ["business meeting office", "team meeting discussion", "advisor client meeting"],                cap: 1600, keep: 5 },
  consultation:{ queries: ["accountant client consultation", "financial advisor meeting client", "advisor explaining to client desk"], cap: 1600, keep: 4 },
  handshake:   { queries: ["business handshake partnership", "professional handshake deal"],                               cap: 1600, keep: 3 },
  team:        { queries: ["business team collaboration", "diverse business team office"],                                 cap: 1600, keep: 4 },
  advisory:    { queries: ["financial advisor consulting client", "accountant explaining documents"],                     cap: 1600, keep: 4 },
  success:     { queries: ["business growth chart upward", "financial success graph rising", "profit growth analytics"],    cap: 1600, keep: 3 },
  texture:     { queries: ["abstract blue gradient texture", "subtle geometric background", "soft light bokeh background"], cap: 1920, keep: 3 },
};

function apiKey(): string | undefined {
  if (process.env.PEXELS_API_KEY) return process.env.PEXELS_API_KEY.trim();
  const f = join(import.meta.dirname, "..", ".pexels-key");
  if (existsSync(f)) return readFileSync(f, "utf-8").trim();
  return undefined;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
interface Hit { id: number; url: string; download: string; w: number; h: number; author: string; alt: string; }

async function search(query: string, key: string): Promise<Hit[]> {
  const u = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=40&orientation=landscape&size=large`;
  const r = await fetch(u, { headers: { Authorization: key } });
  if (!r.ok) { console.log(`  query "${query}" -> HTTP ${r.status}`); return []; }
  const d: any = await r.json();
  return (d.photos || []).map((p: any): Hit => ({
    id: p.id, url: p.url, download: p.src?.large2x || p.src?.large || p.src?.original,
    w: p.width, h: p.height, author: p.photographer || "Pexels", alt: p.alt || "",
  }));
}

async function run() {
  const key = apiKey();
  if (!key) {
    console.error("No Pexels API key. Set PEXELS_API_KEY or create design-system/.pexels-key (https://www.pexels.com/api/).");
    process.exit(1);
  }
  rmSync(STOCK, { recursive: true, force: true });
  const credits: Record<string, { title: string; author: string; license: string; source: string }> = {};
  let total = 0;
  for (const [topic, cfg] of Object.entries(TOPICS)) {
    const dir = join(STOCK, topic);
    const seenId = new Set<number>();
    let n = 0;
    // Spread the picks ACROSS queries (a cap per query) instead of filling the whole
    // quota from the first one — distinct queries give visually distinct images, so
    // 50 firms don't all land on the same three Zürich shots.
    const perQuery = Math.max(2, Math.ceil(cfg.keep / cfg.queries.length));
    for (const q of cfg.queries) {
      if (n >= cfg.keep) break;
      let hits: Hit[] = [];
      try { hits = await search(q, key); } catch { hits = []; }
      await sleep(400);
      hits.sort((a, b) => (b.w / b.h) - (a.w / a.h));               // widest first
      let fromThisQuery = 0;
      for (const hit of hits) {
        if (n >= cfg.keep || fromThisQuery >= perQuery) break;
        if (seenId.has(hit.id) || !hit.download) continue;
        if (hit.w < hit.h * 1.2) continue;                          // landscape only
        seenId.add(hit.id);
        fromThisQuery++;
        try {
          const buf = Buffer.from(await (await fetch(hit.download)).arrayBuffer());
          const out = await sharp(buf).rotate().resize({ width: cfg.cap, height: cfg.cap, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
          mkdirSync(dir, { recursive: true });
          const fn = `${topic}-${n + 1}-${hit.id}.jpg`;
          writeFileSync(join(dir, fn), out);
          credits[`${topic}/${fn}`] = { title: hit.alt.slice(0, 80) || topic, author: hit.author, license: "Pexels", source: hit.url };
          n++; total++;
          console.log(`  ${topic}/${fn}  by ${hit.author}  ${Math.round(out.length / 1024)}KB`);
        } catch (e) { console.log(`  skip ${hit.id}: ${(e as any)?.message}`); }
        await sleep(300);
      }
    }
  }
  mkdirSync(STOCK, { recursive: true });
  writeFileSync(join(STOCK, "credits.json"), JSON.stringify(credits, null, 2));
  // Regenerate compose/stockManifest.json (topic -> [filenames]) that pitchStock reads,
  // so the fetched files and the manifest never drift out of sync after a re-fetch.
  const manifest: Record<string, string[]> = {};
  for (const k of Object.keys(credits)) { const i = k.indexOf("/"); const topic = k.slice(0, i), fn = k.slice(i + 1); (manifest[topic] ??= []).push(fn); }
  writeFileSync(join(import.meta.dirname, "..", "compose", "stockManifest.json"), JSON.stringify(manifest));
  console.log(`Stock pack: ${total} images across ${Object.keys(TOPICS).length} topics -> ${STOCK}`);
}
run();
