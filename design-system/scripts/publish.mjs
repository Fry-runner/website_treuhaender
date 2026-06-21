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
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, copyFileSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLISHED = join(ROOT, "public", "published.json");
const DIST = join(ROOT, "dist");
const API = "https://api.vercel.com";

const PROJECT = (process.env.VERCEL_PROJECT_NAME || "treuhand-prototypes").toLowerCase();
const TEAM = process.env.VERCEL_TEAM_ID || process.env.VERCEL_ORG_ID || "";
const teamQ = TEAM ? `?teamId=${encodeURIComponent(TEAM)}` : "";

function readToken() {
  if (process.env.VERCEL_TOKEN) return process.env.VERCEL_TOKEN.trim();
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

function buildDist() {
  return new Promise((resolve, reject) => {
    const vite = join(ROOT, "node_modules", "vite", "bin", "vite.js");
    const child = spawn(process.execPath, [vite, "build"], { cwd: ROOT });
    let log = "";
    child.stdout.on("data", (d) => (log += d));
    child.stderr.on("data", (d) => (log += d));
    child.on("close", (code) => (code === 0 ? resolve(log) : reject(new Error("vite build failed:\n" + log.slice(-2000)))));
  });
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
    target: "production",
    projectSettings: { framework: null },
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
      const productionUrl = `https://${PROJECT}.vercel.app`;
      return { deploymentUrl: d.url ? `https://${d.url}` : productionUrl, productionUrl, id: d.id };
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

async function main() {
  const raw = await readStdin();
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { input = {}; }
  const slug = String(input.slug || "").replace(/[^a-z0-9._-]/gi, "");
  const plan = input.plan || {};
  if (!slug) { console.log(JSON.stringify({ ok: false, error: "no slug" })); return; }

  const token = readToken();
  const meta = firmMeta(slug);
  const productionUrl = `https://${PROJECT}.vercel.app`;
  const prototypeUrl = `${productionUrl}/p/${slug}`;

  // 1. Merge the frozen plan into the manifest the prototype route reads.
  const manifest = loadManifest();
  const record = {
    slug,
    firm: meta.firm || slug,
    domain: meta.domain || "",
    sourceUrl: meta.sourceUrl,
    contactEmail: meta.contactEmail,
    seed: plan.seed ?? 0,
    lookId: plan.lookId,
    heroId: plan.heroId,
    primaryStyle: plan.primaryStyle,
    kitId: plan.kitId,
    sectionOverrides: plan.sectionOverrides,
    pitch: plan.pitch !== false,
    prototypeUrl,
    approvedAt: new Date().toISOString(),
  };
  manifest[slug] = { ...manifest[slug], ...record };
  writeFileSync(PUBLISHED, JSON.stringify(manifest, null, 2) + "\n");

  // 2. Build the static site (bundles the updated manifest into /published.json).
  let buildLog = "";
  try { buildLog = await buildDist(); }
  catch (e) { console.log(JSON.stringify({ ok: false, error: String(e.message || e), record })); return; }

  // Ship the SPA rewrite config alongside the build so /p/<slug> resolves on Vercel.
  const vjson = join(ROOT, "vercel.json");
  if (existsSync(vjson)) copyFileSync(vjson, join(DIST, "vercel.json"));

  // 3. Deploy — or, with no token, hand back the manual path.
  if (!token) {
    console.log(JSON.stringify({
      ok: true,
      deployed: false,
      record,
      productionUrl,
      prototypeUrl,
      instructions: [
        "Kein VERCEL_TOKEN gefunden — Build liegt bereit unter design-system/dist/.",
        "Token einmalig setzen: design-system/.vercel-token anlegen (Inhalt = dein Vercel-Token)",
        `oder VERCEL_TOKEN als Umgebungsvariable. Projektname via VERCEL_PROJECT_NAME (Default: ${PROJECT}).`,
        "Danach erneut 'Durchwinken & Versenden' klicken — dann deployt es automatisch.",
      ],
    }));
    return;
  }

  try {
    const { deploymentUrl, id } = await deploy(token);
    manifest[slug].prototypeUrl = prototypeUrl;
    writeFileSync(PUBLISHED, JSON.stringify(manifest, null, 2) + "\n");
    console.log(JSON.stringify({
      ok: true,
      deployed: true,
      project: PROJECT,
      deploymentId: id,
      deploymentUrl,   // immutable, ready immediately (good for verification)
      productionUrl,   // stable alias
      prototypeUrl,    // stable per-firm link for the e-mail
      record,
    }));
  } catch (e) {
    console.log(JSON.stringify({ ok: false, deployed: false, error: String(e.message || e), record, productionUrl, prototypeUrl, log: buildLog.slice(-500) }));
  }
}

main();
