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
import { composeSite, pageTypes } from "./pages";
import { archetypes, type ArchetypeId } from "./blueprints";
import { SiteRouter } from "./compose/SiteRouter";

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
    <Bar text={`Generated website · ${content.meta.firm}`} sub={`${content.meta.domain} · ${content.meta.archetype} · multi-page — click the nav / footer links`} />
    <SiteRouter content={content} />
  </div>
);

const ReskinDemo = () => (
  <div style={{ fontFamily: "system-ui, sans-serif" }}>
    <Bar text={`Same generated site · re-skinned`} sub={`look: ${pickedLook}`} />
    <SiteComposer content={content} lookId={pickedLook} />
    <Bar text="Same generated site · re-skinned" sub={`look: ${contrastLook}`} />
    <SiteComposer content={content} lookId={contrastLook} />
  </div>
);
void ReskinDemo;

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

const SitemapDemo = () => {
  const arches = Object.keys(archetypes) as ArchetypeId[];
  const card: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, background: "#fff" };
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16, background: "#fafafa" }}>
      <div style={{ gridColumn: "1 / -1", fontFamily: "ui-monospace, monospace", fontSize: "0.8rem", color: "#444" }}>
        composeSite() — the multi-page structure each business-model archetype assembles for <b>{content.meta.firm}</b>:
      </div>
      {arches.map((a) => {
        const pages = composeSite(a, content, { includeOptional: true });
        return (
          <div key={a} style={card}>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>{archetypes[a].name}</div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.7rem", color: "#888", marginBottom: 12 }}>
              {a} · {pages.length} pages · {archetypes[a].reference}
            </div>
            <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {pages.map((p, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "baseline", fontSize: "0.82rem" }}>
                  <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4, fontSize: "0.72rem", whiteSpace: "nowrap" }}>{p.slug}</code>
                  <span style={{ fontWeight: 600 }}>{p.title}</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.7rem" }}>
                    {p.pageType}{p.presence !== "always" ? ` · ${p.presence}` : ""} · {p.sections.length} sections
                  </span>
                </li>
              ))}
            </ol>
          </div>
        );
      })}
      <div style={{ gridColumn: "1 / -1", ...card }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Page-type catalog ({Object.keys(pageTypes).length})</div>
        {Object.values(pageTypes).map((pt) => (
          <div key={pt.id} style={{ display: "flex", gap: 10, fontSize: "0.8rem", padding: "3px 0", borderTop: "1px solid #f1f5f9" }}>
            <span style={{ width: 120, fontWeight: 600 }}>{pt.name}</span>
            <span style={{ width: 90, color: "#64748b", fontFamily: "ui-monospace, monospace", fontSize: "0.7rem" }}>seo:{pt.attributes.seoWeight}</span>
            <span style={{ width: 110, color: "#94a3b8", fontSize: "0.72rem" }}>{pt.repeat ?? "single"}</span>
            <span style={{ color: "#475569", fontSize: "0.78rem" }}>{pt.attributes.purpose}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- all 50 generated firms, loaded from the batch-extracted content JSONs ---
const firmModules = import.meta.glob("./content/examples/*.json", { eager: true });
const firms = Object.entries(firmModules)
  .filter(([p]) => !p.endsWith("active.json"))
  .map(([p, mod]) => ({ slug: p.split("/").pop()!.replace(".json", ""), content: ((mod as any).default ?? mod) as SiteContent }))
  .sort((a, b) => a.content.meta.firm.localeCompare(b.content.meta.firm));

const FirmPicker = () => {
  const [i, setI] = useState(0);
  const firm = firms[i];
  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ padding: "10px 24px", background: "#0b0b0c", color: "#fff", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", position: "sticky", top: 44, zIndex: 40 }}>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.6 }}>
          Batch · {firms.length} generated sites
        </span>
        <select value={i} onChange={(e) => setI(+e.target.value)} style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.78rem", padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "#fff", color: "#0b0b0c", maxWidth: 380 }}>
          {firms.map((f, idx) => <option key={f.slug} value={idx}>{f.content.meta.firm} — {f.content.meta.archetype}</option>)}
        </select>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.7rem", opacity: 0.55 }}>{firm.slug} · look {firm.content.meta.lookId}</span>
      </div>
      <SiteRouter key={firm.slug} content={firm.content} />
    </div>
  );
};

type View = "site" | "all50" | "inventory" | "variants" | "sitemap";

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
      <button style={tab(view === "all50")} onClick={() => setView("all50")}>All {firms.length}</button>
      <button style={tab(view === "sitemap")} onClick={() => setView("sitemap")}>Sitemap</button>
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
      {view === "site" ? <SiteDemo /> : view === "all50" ? <FirmPicker /> : view === "sitemap" ? <SitemapDemo /> : view === "variants" ? <VariantsDemo /> : <InventoryBrowser />}
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
