import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

/**
 * Build config for ONE isolated customer prototype (used by scripts/publish.mjs).
 *
 * Builds ONLY prototype.html → a self-contained static site that renders a single
 * firm at "/". Two deliberate differences from the studio build (vite.config.ts):
 *   • input = prototype.html (NOT index.html) → the studio app never ships.
 *   • publicDir = false → public/ is NOT copied, so the manifest (published.json)
 *     and every OTHER firm's images stay out of the deployment. publish.mjs copies
 *     in only what this one firm needs (the stock pack; its own /images on demand).
 *
 * Net effect: a deployed prototype contains the renderer + exactly one firm and
 * nothing else — no studio, no other leads, no lead list.
 */
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: { input: resolve(import.meta.dirname, "prototype.html") },
  },
});
