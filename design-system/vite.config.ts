import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync, statSync, cpSync } from "node:fs";
import { join, normalize } from "node:path";

/**
 * Serve the licensed stock pack (design-system/stock/) at /stock/<topic>/<file>.
 * Pitch/cold-acquisition mode swaps the prospect's real photos for these. We do
 * NOT copy the 30 MB pack into public/ (no git bloat); instead we stream it in dev
 * and copy it into the build output (dist/stock) so it ships on Vercel too.
 */
function serveStock(): PluginOption {
  const stockDir = join(import.meta.dirname, "stock");
  return {
    name: "serve-stock",
    configureServer(server) {
      server.middlewares.use("/stock", (req, res, next) => {
        const rel = normalize(decodeURIComponent((req.url || "").split("?")[0])).replace(/^([/\\])+/, "");
        // Images ONLY — never intercept module/JSON requests Vite needs to serve.
        if (!/\.(jpe?g|png|webp)$/i.test(rel)) { next(); return; }
        const file = join(stockDir, rel);
        if (!file.startsWith(stockDir) || !existsSync(file) || !statSync(file).isFile()) { next(); return; }
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Cache-Control", "public, max-age=3600");
        createReadStream(file).pipe(res);
      });
    },
    closeBundle() {
      // Production build (Vercel): copy the pack into dist so /stock resolves there.
      try { cpSync(stockDir, join(import.meta.dirname, "dist", "stock"), { recursive: true }); } catch { /* no dist yet */ }
    },
  };
}

/**
 * Dev-only endpoint: GET /__generate?slug=<slug>
 * Runs content/extract.ts for ONE firm and returns the freshly generated
 * SiteContent JSON. Lets the playground regenerate a real, current version of any
 * of the 50 leads on demand — one firm at a time, never a batch of all 50.
 */
function onDemandExtract(): PluginOption {
  return {
    name: "on-demand-extract",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__generate", (req, res) => {
        const full = (req as any).originalUrl || req.url || "";
        const slug = (new URL(full, "http://x").searchParams.get("slug") || "").replace(/[^a-z0-9._-]/gi, "");
        if (!slug) { res.statusCode = 400; res.end(JSON.stringify({ error: "no slug" })); return; }
        const child = spawn(process.execPath, ["--experimental-strip-types", "content/extract.ts", slug], { cwd: import.meta.dirname });
        let log = "";
        child.stdout.on("data", (d) => (log += d));
        child.stderr.on("data", (d) => (log += d));
        child.on("close", async (code) => {
          if (code !== 0) { res.statusCode = 500; res.end(JSON.stringify({ error: "extract failed", code, log: log.slice(-1500) })); return; }
          try {
            const json = await readFile(join(import.meta.dirname, "content", "examples", `${slug}.json`), "utf-8");
            res.setHeader("Content-Type", "application/json");
            res.end(json);
          } catch (e: any) { res.statusCode = 500; res.end(JSON.stringify({ error: "read failed", message: e?.message })); }
        });
      });
    },
  };
}

/**
 * Dev-only endpoint: POST /__deploy  (body: { slug, plan })
 * Approves ONE lead: runs scripts/publish.mjs, which merges the frozen plan into
 * public/published.json, builds dist/, and deploys to the single Vercel project
 * (REST API, VERCEL_TOKEN). Streams the script's JSON result back to the overlay.
 * With no token it falls back to a build + manual-deploy instructions.
 */
function deployLead(): PluginOption {
  return {
    name: "deploy-lead",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__deploy", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; res.end(JSON.stringify({ ok: false, error: "POST only" })); return; }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          const child = spawn(process.execPath, ["scripts/publish.mjs"], { cwd: import.meta.dirname });
          child.stdin.write(body);
          child.stdin.end();
          let out = "", err = "";
          child.stdout.on("data", (d) => (out += d));
          child.stderr.on("data", (d) => (err += d));
          child.on("close", () => {
            res.setHeader("Content-Type", "application/json");
            // The script prints exactly one JSON line on stdout; pass it through.
            const line = out.trim().split("\n").filter(Boolean).pop() || "";
            if (line && line.startsWith("{")) { res.end(line); return; }
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: "publish script produced no result", log: (out + err).slice(-1500) }));
          });
        });
      });
    },
  };
}

/**
 * Dev-only endpoint: POST /__send  (body: { to, subject, body })
 * Relays ONE outreach mail through the operator's ETH mailbox via
 * scripts/send-mail.mjs (authenticated SMTP). Opt-in path; needs ETH_SMTP_*
 * credentials in env or design-system/.env. Streams the script's JSON result back.
 */
function sendMail(): PluginOption {
  return {
    name: "send-mail",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/__send", (req, res) => {
        if (req.method !== "POST") { res.statusCode = 405; res.end(JSON.stringify({ ok: false, error: "POST only" })); return; }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", () => {
          const child = spawn(process.execPath, ["scripts/send-mail.mjs"], { cwd: import.meta.dirname });
          child.stdin.write(body);
          child.stdin.end();
          let out = "", err = "";
          child.stdout.on("data", (d) => (out += d));
          child.stderr.on("data", (d) => (err += d));
          child.on("close", () => {
            res.setHeader("Content-Type", "application/json");
            const line = out.trim().split("\n").filter(Boolean).pop() || "";
            if (line && line.startsWith("{")) { res.end(line); return; }
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: "send script produced no result", log: (out + err).slice(-1500) }));
          });
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), onDemandExtract(), deployLead(), sendMail(), serveStock()],
  server: {
    port: 3010, host: "0.0.0.0",
    // The on-demand endpoints WRITE into the project: /__generate (extract.ts) rewrites
    // content/examples/<slug>.json + public/images/<slug>/…, /__deploy rewrites
    // public/published.json. Those writes must NOT trip Vite's HMR/full-reload — a reload
    // remounts the studio and EJECTS the user from the open "Durchwinken" overlay (and
    // wipes its deploy/e-mail progress). The studio already shows the fresh content from
    // the /__generate fetch response, so it needs no file-watch HMR for these outputs.
    watch: {
      ignored: [
        "**/content/examples/**",
        "**/public/images/**",
        "**/public/files/**",
        "**/public/published.json",
      ],
    },
  },
});
