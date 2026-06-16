/**
 * Pipeline proof: a REAL scraped firm → extracted SiteContent → SiteComposer
 * renders a full generated homepage. Shown in its auto-picked look AND a
 * contrasting look to prove the same generated site re-skins.
 *
 * content/examples/active.json is produced by content/extract.ts from a real
 * scraper/output/<slug>/site.json.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { SiteComposer } from "./compose/SiteComposer";
import { presetList } from "./tokens";
import type { SiteContent } from "./content/types";
import active from "./content/examples/active.json";

const content = active as unknown as SiteContent;

const Bar: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <div style={{ padding: "0.7rem 1.5rem", background: "#0b0b0c", color: "#fff", fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", letterSpacing: "0.08em", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
    <span style={{ textTransform: "uppercase" }}>{text}</span>
    {sub && <span style={{ opacity: 0.6 }}>{sub}</span>}
  </div>
);

const pickedLook = content.meta.lookId;
const contrastLook = presetList.find((p) => p.meta.id !== pickedLook)!.meta.id;

const App = () => (
  <div style={{ fontFamily: "system-ui, sans-serif" }}>
    <Bar text={`Generated website · ${content.meta.firm}`} sub={`${content.meta.domain} · archetype: ${content.meta.archetype} · look: ${pickedLook} (auto)`} />
    <SiteComposer content={content} lookId={pickedLook} />
    <Bar text="Same generated site · re-skinned" sub={`look: ${contrastLook}`} />
    <SiteComposer content={content} lookId={contrastLook} />
  </div>
);

createRoot(document.getElementById("root")!).render(<App />);
