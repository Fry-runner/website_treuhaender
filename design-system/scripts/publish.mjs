/**
 * publish.mjs — the "Durchwinken & Versenden" backend.
 *
 * Called by the dev endpoint /__deploy (see vite.config.ts). Reads ONE approved
 * lead's frozen plan on stdin, then:
 *   1. merges the lead into public/published.json (the manifest the prototype
 *      route reads to render the frozen plan under /p/<slug>),
 *   2. builds the static site (vite build → dist/),
 *   3. deploys dist/ to a SINGLE Vercel project via the REST API (one deploy
 *      serves every prototype; no per-firm projects, no CLI install needed).
 *
 * Auth = VERCEL_TOKEN (env or design-system/.vercel-token). Project pinned by
 * VERCEL_PROJECT_NAME (default "treuhand-prototypes") so every deploy lands on the
 * same project → stable URL https://<project>.vercel.app/p/<slug>. Optional team:
 * VERCEL_TEAM_ID. With no token the script still writes the record and builds
 * dist/, then returns manual-deploy instructions (graceful fallback).
 *
 * Input (stdin, JSON): { slug, plan: PublishedPlan }
 * Output (stdout, JSON): { ok, deployed, url?, prototypeUrl?, productionUrl?,
 *                          record, instructions?, error?, log? }
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, cpSync, renameSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLISHED = join(ROOT, "public", "published.json");
const PROTO_DATA = join(ROOT, "prototype.data.json"); // single-firm payload for the build
const DIST = join(ROOT, "dist");
const API = "https://api.vercel.com";

/** process.env wins; otherwise pull the key out of design-system/.env (KEY=VALUE). */
function envFile() {
  const f = join(ROOT, ".env");
  if (!existsSync(f)) return {};
  const out = {};
  for (const line of readFileSync(f, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}
const FILE = envFile();
const cfg = (k) => (process.env[k] ?? FILE[k] ?? "").trim();

const PROJECT = (cfg("VERCEL_PROJECT_NAME") || "treuhand-prototypes").toLowerCase();
const TEAM = cfg("VERCEL_TEAM_ID") || cfg("VERCEL_ORG_ID") || "";
const teamQ = TEAM ? `?teamId=${encodeURIComponent(TEAM)}` : "";

function readToken() {
  // env / .env first, then the standalone .vercel-token file.
  const t = cfg("VERCEL_TOKEN");
  if (t) return t;
  const f = join(ROOT, ".vercel-token");
  if (existsSync(f)) return readFileSync(f, "utf-8").trim();
  return "";
}

function readStdin() {
  return new Promise((resolve) => {
    let d = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (c) => (d += c));
    process.stdin.on("end", () => resolve(d));
    if (process.stdin.isTTY) resolve(""); // no piped input
  });
}

function loadManifest() {
  try { return JSON.parse(readFileSync(PUBLISHED, "utf-8")); } catch { return {}; }
}

function firmMeta(slug) {
  const p = join(ROOT, "content", "examples", `${slug}.json`);
  if (!existsSync(p)) return {};
  try {
    const c = JSON.parse(readFileSync(p, "utf-8"));
    return {
      firm: c?.meta?.firm,
      domain: c?.meta?.domain,
      sourceUrl: c?.meta?.sourceUrl,
      contactEmail: c?.contact?.info?.email?.trim() || undefined,
    };
  } catch { return {}; }
}

/** Build ONLY the single-firm prototype (vite.prototype.config.ts) — no studio,
 *  no firm glob, no public/ copy. dist/ ends up self-contained for one firm. */
function buildDist() {
  return new Promise((resolve, reject) => {
    const vite = join(ROOT, "node_modules", "vite", "bin", "vite.js");
    const child = spawn(process.execPath, [vite, "build", "--config", "vite.prototype.config.ts"], { cwd: ROOT });
    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));
    child.on("close", (code) => (code === 0 ? resolve(log) : reject(new Error("vite build failed:\n" + log.slice(-2000)))));
  });
}

function firmContent(slug) {
  const p = join(ROOT, "content", "examples", `${slug}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : null;
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}

async function vercelFetch(path, init) {
  const res = await fetch(API + path, init);
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }
  return { ok: res.ok, status: res.status, json };
}

/** Deploy dist/ to the single Vercel project. Two-phase: try to create the
 *  deployment with file digests; upload only the blobs Vercel reports missing. */
async function deploy(token) {
  const files = walk(DIST).map((abs) => {
    const buf = readFileSync(abs);
    const sha = createHash("sha1").update(buf).digest("hex");
    return { abs, buf, sha, size: buf.length, file: relative(DIST, abs).split("\\").join("/") };
  });
  const auth = { Authorization: `Bearer ${token}` };

  const uploaded = new Set();
  const uploadMissing = async (shas) => {
    const want = new Set(shas);
    // de-dup by sha (identical blobs share one upload)
    const bySha = new Map();
    for (const f of files) if (want.has(f.sha) && !uploaded.has(f.sha)) bySha.set(f.sha, f);
    for (const f of bySha.values()) {
      const up = await fetch(`${API}/v2/files${teamQ}`, {
        method: "POST",
        headers: { ...auth, "Content-Type": "application/octet-stream", "x-vercel-digest": f.sha, "x-vercel-size": String(f.size) },
        body: f.buf,
      });
      if (!up.ok) throw new Error(`file upload failed (${up.status}) for ${f.file}`);
      uploaded.add(f.sha);
    }
  };

  const createBody = () => ({
    name: PROJECT,
    // NOT a production deploy: each firm is its OWN isolated deployment under the one
    // project, reachable only via its own alias (see aliasDeployment). The site lives
    // at "/" (state-based nav), so the route below is just a safety net for stray paths.
    projectSettings: { framework: null },
    routes: [
      { handle: "filesystem" },
      { src: "/(.*)", dest: "/index.html" },
    ],
    files: files.map((f) => ({ file: f.file, sha: f.sha, size: f.size })),
  });

  // Up to 3 passes: create → (upload missing) → retry.
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    last = await vercelFetch(`/v13/deployments${teamQ}`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify(createBody()),
    });
    if (last.ok) {
      const d = last.json;
      return { deploymentUrl: d.url ? `https://${d.url}` : "", id: d.id };
    }
    // Missing blobs → upload them and retry.
    const missing = last.json?.error?.missing || last.json?.missing;
    if (Array.isArray(missing) && missing.length) {
      await uploadMissing(missing.map((m) => (typeof m === "string" ? m : m.sha)));
      continue;
    }
    break; // a non-missing error → stop and report it
  }
  const msg = last?.json?.error?.message || last?.json?.raw || `HTTP ${last?.status}`;
  throw new Error(`Vercel deployment failed: ${msg}`);
}

/** Wait until a deployment is READY (static deploys settle in seconds). Best-effort. */
async function waitReady(token, id) {
  const auth = { Authorization: `Bearer ${token}` };
  for (let i = 0; i < 30; i++) {
    const r = await vercelFetch(`/v13/deployments/${id}${teamQ}`, { headers: auth });
    const s = r.json?.readyState || r.json?.status;
    if (s === "READY") return true;
    if (s === "ERROR" || s === "CANCELED") return false;
    await new Promise((res) => setTimeout(res, 1500));
  }
  return false;
}

/** Point a stable alias at this deployment so the firm keeps ONE clean URL across
 *  re-deploys. Returns the alias URL, or null if Vercel refuses it (name taken/not
 *  permitted) → caller falls back to the immutable deployment URL. */
async function aliasDeployment(token, id, alias) {
  const r = await vercelFetch(`/v2/deployments/${id}/aliases${teamQ}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ alias }),
  });
  // 200/409 (already assigned to this deployment) both count as success.
  if (r.ok || r.json?.error?.code === "alias_already_exists") return `https://${alias}`;
  return null;
}

/** New Vercel projects often default to "Deployment Protection" (a Vercel-login wall)
 *  which would gate the public prototype behind a 401. Turn it off so the /p/<slug>
 *  link is openly reachable by the cold-outreach recipient. Idempotent + non-fatal. */
async function ensurePublic(token) {
  try {
    await vercelFetch(`/v9/projects/${encodeURIComponent(PROJECT)}${teamQ}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ssoProtection: null, passwordProtection: null }),
    });
  } catch { /* deploy already succeeded; protection can also be toggled in the dashboard */ }
}

/** treuhand-<slug>.vercel.app — clean, stable, per-firm alias host. */
function aliasHostFor(slug) {
  const label = slug.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  return `treuhand-${label}.vercel.app`;
}

async function main() {
  const raw = await readStdin();
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { input = {}; }
  const slug = String(input.slug || "").replace(/[^a-z0-9._-]/gi, "");
  const plan = input.plan || {};
  if (!slug) { console.log(JSON.stringify({ ok: false, error: "no slug" })); return; }

  // PUBLISH GUARD: a firm without a scrape source (scraper/output/<slug>/site.json)
  // cannot be regenerated, so its example JSON is stale/uncorrected — it must never be
  // deployed. This blocks the four source-less leads (mkfiduciaire, steuerberater365-
  // zuerich, steuerberatung-schweiz, treuhandbuero24) and any future orphan.
  const sourcePath = join(ROOT, "..", "scraper", "output", slug, "site.json");
  if (!existsSync(sourcePath)) {
    console.log(JSON.stringify({ ok: false, error: `Firma "${slug}" ist nicht veröffentlichbar: keine Scrape-Quelle (scraper/output/${slug}/site.json fehlt). Bitte zuerst neu scrapen.` }));
    return;
  }

  const content = firmContent(slug);
  if (!content) { console.log(JSON.stringify({ ok: false, error: `Firma "${slug}" nicht gefunden (content/examples/${slug}.json).` })); return; }

  const token = readToken();
  const meta = firmMeta(slug);
  const pitch = plan.pitch !== false;
  const aliasHost = aliasHostFor(slug);
  const aliasGuess = `https://${aliasHost}`;

  // Record kept ONLY locally (for the studio's own tracking). It is NOT shipped to the
  // customer — the single-firm build sets publicDir:false, so published.json never deploys.
  const record = {
    slug, firm: meta.firm || slug, domain: meta.domain || "", sourceUrl: meta.sourceUrl, contactEmail: meta.contactEmail,
    seed: plan.seed ?? 0, lookId: plan.lookId, heroId: plan.heroId, primaryStyle: plan.primaryStyle, kitId: plan.kitId,
    sectionOverrides: plan.sectionOverrides, pageHeaderId: plan.pageHeaderId, iconSetId: plan.iconSetId,
    moreStyle: plan.moreStyle, motionStyle: plan.motionStyle, imageSeed: plan.imageSeed, pitch,
    prototypeUrl: aliasGuess, approvedAt: new Date().toISOString(),
  };
  const manifest = loadManifest();
  manifest[slug] = { ...manifest[slug], ...record };
  writeFileSync(PUBLISHED, JSON.stringify(manifest, null, 2) + "\n");

  // 1. Inject ONLY this firm's data, then build the ISOLATED single-firm site
  //    (no studio, no firm glob, no manifest — see vite.prototype.config.ts).
  writeFileSync(PROTO_DATA, JSON.stringify({ content, plan }));
  let buildLog = "";
  try { buildLog = await buildDist(); }
  catch (e) { console.log(JSON.stringify({ ok: false, error: String(e.message || e), record })); return; }

  // 2. Serve the firm at "/" and copy in ONLY what this one firm needs.
  try {
    if (existsSync(join(DIST, "prototype.html"))) renameSync(join(DIST, "prototype.html"), join(DIST, "index.html"));
    const stockDir = join(ROOT, "stock");
    if (existsSync(stockDir)) cpSync(stockDir, join(DIST, "stock"), { recursive: true }); // pitch imagery
    if (!pitch) { const img = join(ROOT, "public", "images", slug); if (existsSync(img)) cpSync(img, join(DIST, "images", slug), { recursive: true }); }
  } catch (e) { console.log(JSON.stringify({ ok: false, error: "dist-prep fehlgeschlagen: " + String(e.message || e), record })); return; }

  // 3. No token → the isolated build is ready; hand back the manual path.
  if (!token) {
    console.log(JSON.stringify({
      ok: true, deployed: false, record, prototypeUrl: aliasGuess,
      instructions: [
        "Kein VERCEL_TOKEN gefunden — die isolierte Kundenseite liegt bereit unter design-system/dist/.",
        "Token in design-system/.env setzen (VERCEL_TOKEN=…).",
        "Danach erneut 'Durchwinken & Versenden' klicken — dann deployt + aliased es automatisch.",
      ],
    }));
    return;
  }

  // 4. Deploy this firm as its OWN isolated deployment under the one project, make the
  //    project public, then pin the stable alias so the firm keeps one clean URL.
  try {
    const { deploymentUrl, id } = await deploy(token);
    await ensurePublic(token);
    await waitReady(token, id);
    const aliased = await aliasDeployment(token, id, aliasHost);
    const prototypeUrl = aliased || deploymentUrl;
    manifest[slug].prototypeUrl = prototypeUrl;
    writeFileSync(PUBLISHED, JSON.stringify(manifest, null, 2) + "\n");
    console.log(JSON.stringify({
      ok: true, deployed: true, project: PROJECT, deploymentId: id,
      deploymentUrl, aliased: !!aliased, prototypeUrl,
      record: { ...record, prototypeUrl },
    }));
  } catch (e) {
    console.log(JSON.stringify({ ok: false, deployed: false, error: String(e.message || e), record, prototypeUrl: aliasGuess, log: buildLog.slice(-500) }));
  }
}

main();
