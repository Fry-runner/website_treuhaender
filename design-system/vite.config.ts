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

export default defineConfig({
  plugins: [react(), onDemandExtract(), serveStock()],
  server: { port: 3010, host: "0.0.0.0" },
});
