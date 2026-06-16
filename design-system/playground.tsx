/**
 * Pipeline proof: a REAL scraped firm → extracted SiteContent → SiteComposer
 * renders a full generated homepage. Shown in its auto-picked look AND a
 * contrasting look to prove the same generated site re-skins.
 *
 * content/examples/active.json is produced by content/extract.ts from a real
 * scraper/output/<slug>/site.json.
 */
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { SiteComposer } from "./compose/SiteComposer";
import { presetList } from "./tokens";
import type { SiteContent } from "./content/types";
import active from "./content/examples/active.json";
import { InventoryBrowser } from "./InventoryBrowser";
import { planSite } from "./variants/select";

const content = active as unknown as SiteContent;

const Bar: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <div style={{ padding: "0.7rem 1.5rem", background: "#0b0b0c", color: "#fff", fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", letterSpacing: "0.08em", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
    <span style={{ textTransform: "uppercase" }}>{text}</span>
    {sub && <span style={{ opacity: 0.6 }}>{sub}</span>}
  </div>
);

const pickedLook = content.meta.lookId;
const contrastLook = presetList.find((p) => p.meta.id !== pickedLook)!.meta.id;

const SiteDemo = () => (
  <div style={{ fontFamily: "system-ui, sans-serif" }}>
    <Bar text={`Generated website · ${content.meta.firm}`} sub={`${content.meta.domain} · archetype: ${content.meta.archetype} · look: ${pickedLook} (auto)`} />
    <SiteComposer content={content} lookId={pickedLook} />
    <Bar text="Same generated site · re-skinned" sub={`look: ${contrastLook}`} />
    <SiteComposer content={content} lookId={contrastLook} />
  </div>
);

const VariantsDemo = () => {
  const seeds = [0, 1, 2, 3, 4, 5];
  const plans = seeds.map((s) => ({ s, p: planSite(content, { seed: s }) }));
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ padding: "1rem 1.5rem", background: "#0b0b0c", color: "#eee", fontFamily: "ui-monospace, monospace", fontSize: "0.74rem" }}>
        <div style={{ opacity: 0.6, marginBottom: "0.6rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          planSite("{content.meta.firm}") — each seed picks a coherent palette × hero structure × button style:
        </div>
        {plans.map(({ s, p }) => (
          <div key={s} style={{ display: "flex", gap: "1.5rem", padding: "2px 0" }}>
            <span style={{ width: 60, opacity: 0.55 }}>seed {s}</span>
            <span style={{ width: 170 }}>palette: <b>{p.lookId}</b></span>
            <span style={{ width: 160 }}>hero: <b>{p.heroId}</b></span>
            <span>button: <b>{p.primaryStyle}</b></span>
          </div>
        ))}
      </div>
      {[1, 2, 3].map((s) => {
        const p = planSite(content, { seed: s });
        return (
          <div key={s}>
            <Bar text={`Variant set · seed ${s}`} sub={`${p.lookId} · ${p.heroId} · button:${p.primaryStyle}`} />
            <SiteComposer content={content} seed={s} />
          </div>
        );
      })}
    </div>
  );
};

type View = "site" | "inventory" | "variants";

const Tabs: React.FC<{ view: View; setView: (v: View) => void }> = ({ view, setView }) => {
  const tab = (active: boolean): React.CSSProperties => ({
    fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", textTransform: "uppercase",
    letterSpacing: "0.08em", padding: "7px 16px", borderRadius: 999, cursor: "pointer",
    border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.25)"}`,
    background: active ? "#fff" : "transparent", color: active ? "#0b0b0c" : "rgba(255,255,255,0.85)",
  });
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50, background: "#0b0b0c",
      padding: "10px 24px", display: "flex", gap: 8, alignItems: "center",
    }}>
      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 4 }}>
        Treuhand design system
      </span>
      <button style={tab(view === "site")} onClick={() => setView("site")}>Generated site</button>
      <button style={tab(view === "variants")} onClick={() => setView("variants")}>Variants</button>
      <button style={tab(view === "inventory")} onClick={() => setView("inventory")}>Inventory specs</button>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<View>("inventory");
  return (
    <div>
      <Tabs view={view} setView={setView} />
      {view === "site" ? <SiteDemo /> : view === "variants" ? <VariantsDemo /> : <InventoryBrowser />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
