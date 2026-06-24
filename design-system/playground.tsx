/**
 * Pipeline proof: a REAL scraped firm → extracted SiteContent → SiteRouter
 * renders the full generated multi-page site. The Variant Studio is the single
 * production render path; the demo tabs (Variants / re-skin) reuse SiteRouter too.
 *
 * content/examples/active.json is produced by content/extract.ts from a real
 * scraper/output/<slug>/site.json.
 */
import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { presetList } from "./tokens";
import type { SiteContent } from "./content/types";
import active from "./content/examples/onetreuhand-ch.json";
import { InventoryBrowser } from "./InventoryBrowser";
import { planSite } from "./variants/select";
import { heroVariants, primaryStyleVariants, sectionVariants, pageHeaderVariants } from "./variants/registry";
import { ICON_SETS } from "./icons/iconSets";
import type { MoreStyle } from "./structures/primitives";
import { MOTION_STYLE_IDS, type MotionStyleId } from "./motion/motionStyle";
// Per-element option pools exposed in the studio / Durchwinken overlay.
const MORE_STYLE_IDS: MoreStyle[] = ["underline", "arrow", "chip", "ghost", "boxed", "chevron", "arrow-up", "dot", "arrow-box", "bracket", "pill-arrow"];
import { kits } from "./variants/kits";
import type { PrimaryStyle } from "./structures/primitives";
import { composeSite, pageTypes } from "./pages";
import { archetypes, type ArchetypeId } from "./blueprints";
import { SiteRouter } from "./compose/SiteRouter";
import { ApproveOverlay } from "./compose/ApproveOverlay";
import { SendOverlay } from "./compose/SendOverlay";
import type { PublishedManifest } from "./compose/outreach";

const content = active as unknown as SiteContent;

// All 50 generated firms — loaded LAZILY via import.meta.glob, so picking one in the
// studio loads ONLY that firm's JSON (no batch generation of all 50). Default = the
// statically-imported onetreuhand. Stale firms still render their last-extracted JSON.
const firmGlob = import.meta.glob("./content/examples/*.json");
const firmList = Object.keys(firmGlob)
  .map((p) => ({ path: p, slug: p.split("/").pop()!.replace(/\.json$/, "") }))
  .filter((f) => f.slug !== "active")
  .sort((a, b) => a.slug.localeCompare(b.slug));
const firmSlugs = firmList.map((f) => f.slug);
const loadFirm = async (path: string): Promise<SiteContent> => {
  const m: any = await firmGlob[path]();
  return (m.default ?? m) as SiteContent;
};
/** Load a firm's content by slug — used by the Versand cockpit to draft the mail
 *  for each published lead. */
const loadFirmBySlug = async (slug: string): Promise<SiteContent | null> => {
  const e = firmList.find((f) => f.slug === slug);
  return e ? loadFirm(e.path).catch(() => null) : null;
};
const DEFAULT_SLUG = "onetreuhand-ch";

const Bar: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => (
  <div style={{ padding: "0.7rem 1.5rem", background: "#0b0b0c", color: "#fff", fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", letterSpacing: "0.08em", display: "flex", justifyContent: "space-between", gap: "1rem" }}>
    <span style={{ textTransform: "uppercase" }}>{text}</span>
    {sub && <span style={{ opacity: 0.6 }}>{sub}</span>}
  </div>
);

const pickedLook = content.meta.lookId;
const contrastLook = presetList.find((p) => p.meta.id !== pickedLook)!.meta.id;

// --- Variant Studio: the persistent test company, viewable in any combination of
//     palette × hero × button, as a COMPLETE multi-page site (real texts, photos,
//     team, animations, all subpages). Each control re-skins the same generated site.
const selectStyle: React.CSSProperties = {
  fontFamily: "ui-monospace, monospace", fontSize: "0.74rem", padding: "6px 10px", borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)", background: "#16181c", color: "#fff", cursor: "pointer", minWidth: 150,
};
const btnStyle: React.CSSProperties = { ...selectStyle, minWidth: 0, padding: "6px 12px" };
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" }}>{label}</span>
    {children}
  </label>
);

const sectionSlots = Object.keys(sectionVariants);

const VariantStudio = () => {
  const [lookId, setLookId] = useState<string>("auto");
  const [accent, setAccent] = useState<string>("");   // exact accent override ("" = auto / logo / palette)
  const [heroId, setHeroId] = useState<string>("auto");
  const [btn, setBtn] = useState<string>("auto");
  const [kitId, setKitId] = useState<string>("auto");
  const [secs, setSecs] = useState<Record<string, string>>({});
  const [seed, setSeed] = useState(0);
  const [phId, setPhId] = useState<string>("auto");
  const [iconId, setIconId] = useState<string>("auto");
  const [moreId, setMoreId] = useState<string>("auto");
  const [motionId, setMotionId] = useState<string>("auto");
  const [firm, setFirm] = useState<SiteContent>(content);
  const [firmSlug, setFirmSlug] = useState<string>(DEFAULT_SLUG);
  const [loadingFirm, setLoadingFirm] = useState(false);
  // Kaltakquise (cold-acquisition) is the product's default: unsolicited prototypes must
  // ship logo→wordmark, no third-party logos, stock photos, noindex. On unless toggled off.
  const [pitchOn, setPitchOn] = useState(true);
  const [imageSeed, setImageSeed] = useState(0);
  const [approveOpen, setApproveOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const resetControls = () => { setSeed(0); setLookId("auto"); setAccent(""); setHeroId("auto"); setBtn("auto"); setKitId("auto"); setSecs({}); setImageSeed(0); setPhId("auto"); setIconId("auto"); setMoreId("auto"); setMotionId("auto"); };
  // Generate a REAL, current version of ONE firm on demand (runs extract.ts via the
  // dev endpoint /__generate). Used automatically for stale firms + the 🔄 button.
  const generateFirm = (slug: string) => {
    setLoadingFirm(true);
    fetch(`/__generate?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)))
      .then((c: SiteContent) => { setFirm(c); setFirmSlug(slug); resetControls(); })
      .catch((e) => console.error("generate failed", e))
      .finally(() => setLoadingFirm(false));
  };
  const pickFirm = (slug: string) => {
    const entry = firmList.find((f) => f.slug === slug);
    if (!entry) return;
    setLoadingFirm(true);
    loadFirm(entry.path).then((c) => {
      setFirm(c); setFirmSlug(slug); resetControls(); setLoadingFirm(false);
      // stale firms (extracted before the media pipeline) have no media pool → render
      // imageless; auto-regenerate so every pick yields a REAL, current version.
      if (!((c as any)?.media?.assets?.length)) generateFirm(slug);
    }).catch(() => setLoadingFirm(false));
  };

  const look = lookId === "auto" ? undefined : lookId;
  const hero = heroId === "auto" ? undefined : heroId;
  const primary = btn === "auto" ? undefined : (btn as PrimaryStyle);
  const kitSel = kitId === "auto" ? undefined : kitId;
  const ph = phId === "auto" ? undefined : phId;
  const icon = iconId === "auto" ? undefined : iconId;
  const more = moreId === "auto" ? undefined : (moreId as MoreStyle);
  const motion = motionId === "auto" ? undefined : (motionId as MotionStyleId);
  const sectionOverrides = Object.fromEntries(Object.entries(secs).filter(([, v]) => v && v !== "auto"));
  // Auto keeps off the BASE preset (the brand-tinted look's design language), so the
  // labels match what SiteRouter actually renders.
  const baseId = firm.meta.basePresetId ?? firm.meta.lookId;
  const plan = planSite(firm, { seed, lookId: look ?? baseId, kitId: kitSel });
  const brandTinted = !look && !!firm.meta.look;
  const rLook = (look ?? plan.lookId) + (brandTinted ? " (brand)" : ""), rHero = hero ?? plan.heroId, rBtn = primary ?? plan.primaryStyle;

  const randomize = () => { setSeed(Math.floor(Math.random() * 1e6)); setLookId("auto"); setHeroId("auto"); setBtn("auto"); setKitId("auto"); setSecs({}); };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <div style={{ position: "sticky", top: 53, zIndex: 60, background: "#0b0b0c", padding: "12px 24px", display: "flex", gap: 18, alignItems: "flex-end", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Field label={`Testunternehmen (${firmList.length})`}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <select style={{ ...selectStyle, minWidth: 200 }} value={firmSlug} onChange={(e) => pickFirm(e.target.value)} disabled={loadingFirm}>
              {firmList.map((f) => <option key={f.slug} value={f.slug}>{f.slug}</option>)}
            </select>
            <button style={btnStyle} onClick={() => generateFirm(firmSlug)} disabled={loadingFirm} title="Echte Version neu generieren (extract.ts)">🔄</button>
          </div>
          <span style={{ color: loadingFirm ? "rgba(255,255,255,0.4)" : "#fff", fontWeight: 700, fontSize: "0.8rem", marginTop: 2 }}>
            {loadingFirm ? "generiert …" : firm.meta.firm}
          </span>
        </Field>
        <Field label="Ansicht">
          <button onClick={() => setPitchOn((p) => !p)}
            title="Kaltakquise-Modus: Logo → Wortmarke · keine Fremdlogos/Badges · Team ohne Portraits · echte Fotos → Stock · noindex. Für jede Firma einzeln umschaltbar."
            style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.74rem", fontWeight: 700, padding: "6px 14px", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap",
              border: pitchOn ? "1px solid #f5b301" : "1px solid rgba(255,255,255,0.3)",
              background: pitchOn ? "#f5b301" : "#16181c", color: pitchOn ? "#0b0b0c" : "#fff" }}>
            {pitchOn ? "🛡 Kaltakquise: AN" : "🛡 Kaltakquise: AUS"}
          </button>
        </Field>
        <Field label="Freigabe">
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setApproveOpen(true)} disabled={loadingFirm}
              title="Diesen Prototyp durchwinken: auf Vercel veröffentlichen (das Deploy läuft im Hintergrund). Versendet wird danach im Versand-Cockpit."
              style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.74rem", fontWeight: 700, padding: "6px 14px", borderRadius: 8,
                cursor: "pointer", whiteSpace: "nowrap", border: "1px solid #34d399", background: "#34d399", color: "#0b0b0c" }}>
              ✅ Durchwinken &amp; Veröffentlichen
            </button>
            <button onClick={() => setSendOpen(true)}
              title="Versand-Cockpit: alle veröffentlichten Prototypen per Galerie durchgehen und einzeln per E-Mail versenden"
              style={{ fontFamily: "ui-monospace, monospace", fontSize: "0.74rem", fontWeight: 700, padding: "6px 14px", borderRadius: 8,
                cursor: "pointer", whiteSpace: "nowrap", border: "1px solid #60a5fa", background: "#0e1116", color: "#60a5fa" }}>
              📤 Versand
            </button>
          </div>
        </Field>
        <Field label="Stil-Kit · Kombination">
          <select style={selectStyle} value={kitId} onChange={(e) => setKitId(e.target.value)}>
            <option value="auto">Auto · {plan.kitId}</option>
            {kits.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select>
        </Field>
        <Field label="Palette · Farben">
          <select style={selectStyle} value={lookId} onChange={(e) => setLookId(e.target.value)}>
            <option value="auto">Auto · {plan.lookId}{firm.meta.look ? " (brand)" : ""}</option>
            {presetList.map((p) => <option key={p.meta.id} value={p.meta.id}>{p.meta.name}</option>)}
          </select>
        </Field>
        <Field label="Akzentfarbe · exakt">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" aria-label="Akzentfarbe wählen"
              value={/^#[0-9a-fA-F]{6}$/.test(accent) ? accent : (firm.meta.look?.color?.primary || "#1E3A5F")}
              onChange={(e) => setAccent(e.target.value.toUpperCase())}
              style={{ width: 40, height: 30, padding: 0, border: "1px solid #d4d8dd", borderRadius: 6, background: "none", cursor: "pointer", flex: "0 0 auto" }} />
            <input type="text" value={accent} placeholder={`Auto · ${firm.meta.look?.color?.primary || "#…"}`}
              onChange={(e) => { const v = e.target.value.trim(); setAccent(v && !v.startsWith("#") ? "#" + v : v); }}
              style={{ ...selectStyle, flex: 1, textTransform: "uppercase" }} />
            {accent && <button onClick={() => setAccent("")} title="Zurück zu Auto/Logo-Farbe"
              style={{ ...selectStyle, width: "auto", padding: "0 10px", cursor: "pointer" }}>Auto</button>}
          </div>
        </Field>
        <Field label="Hero">
          <select style={selectStyle} value={heroId} onChange={(e) => setHeroId(e.target.value)}>
            <option value="auto">Auto · {plan.heroId.replace("hero/", "")}</option>
            {heroVariants.map((h) => <option key={h.id} value={h.id}>{h.id.replace("hero/", "")}</option>)}
          </select>
        </Field>
        <Field label="Button-Stil">
          <select style={selectStyle} value={btn} onChange={(e) => setBtn(e.target.value)}>
            <option value="auto">Auto · {plan.primaryStyle}</option>
            {primaryStyleVariants.map((b) => <option key={b.id} value={b.id}>{b.id}</option>)}
          </select>
        </Field>
        <Field label="Page-Header">
          <select style={selectStyle} value={phId} onChange={(e) => setPhId(e.target.value)}>
            <option value="auto">Auto · {(plan.pageHeaderId ?? "").replace("page-header/", "")}</option>
            {pageHeaderVariants.map((v) => <option key={v.id} value={v.id}>{v.id.replace("page-header/", "")}</option>)}
          </select>
        </Field>
        <Field label="Icon-Set">
          <select style={selectStyle} value={iconId} onChange={(e) => setIconId(e.target.value)}>
            <option value="auto">Auto · {plan.iconSetId}</option>
            {ICON_SETS.map((s) => <option key={s.id} value={s.id}>{s.id}</option>)}
          </select>
        </Field>
        <Field label="Verweis-Link">
          <select style={selectStyle} value={moreId} onChange={(e) => setMoreId(e.target.value)}>
            <option value="auto">Auto · {plan.moreStyle}</option>
            {MORE_STYLE_IDS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Motion">
          <select style={selectStyle} value={motionId} onChange={(e) => setMotionId(e.target.value)}>
            <option value="auto">Auto</option>
            {MOTION_STYLE_IDS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        {sectionSlots.map((slot) => (
          <Field key={slot} label={slot}>
            <select style={selectStyle} value={secs[slot] ?? "auto"} onChange={(e) => setSecs((m) => ({ ...m, [slot]: e.target.value }))}>
              <option value="auto">Auto · {(plan.sections[slot] ?? "").replace(`${slot}/`, "")}</option>
              {sectionVariants[slot].map((v) => <option key={v.id} value={v.id}>{v.id.replace(`${slot}/`, "")}</option>)}
            </select>
          </Field>
        ))}
        <Field label={`Seed · ${seed}`}>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ ...btnStyle, background: "#fff", color: "#0b0b0c", fontWeight: 700 }} onClick={randomize}>🎲 Würfeln</button>
            <button style={btnStyle} onClick={() => setSeed((s) => s + 1)} title="nächster Seed">＋</button>
            <button style={btnStyle} onClick={() => { setSeed(0); setLookId("auto"); setHeroId("auto"); setBtn("auto"); setKitId("auto"); setSecs({}); }}>Reset</button>
          </div>
        </Field>
        <div style={{ marginLeft: "auto", fontFamily: "ui-monospace, monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", maxWidth: 260, lineHeight: 1.5 }}>
          Vollständige Multi-Page-Site · echte Texte · Fotos · Team · Badges · Animationen · Subpages. Jede Auswahl re-skinnt dieselbe generierte Seite.
        </div>
      </div>
      <Bar text={`Generierte Website · ${firm.meta.firm}`} sub={`${rLook} · ${rHero} · button:${rBtn}${pitchOn ? " · KALTAKQUISE" : ""}`} />
      <SiteRouter key={`${firmSlug}|${seed}|${lookId}|${accent}|${heroId}|${btn}|${kitId}|${JSON.stringify(secs)}|${pitchOn}|${imageSeed}|${phId}|${iconId}|${moreId}|${motionId}`} content={firm} seed={seed} lookId={look} accentColor={accent || undefined} heroId={hero} primaryStyle={primary} sectionOverrides={sectionOverrides} kitId={kitSel} pitch={pitchOn} imageSeed={imageSeed} pageHeaderId={ph} iconSetId={icon} moreStyle={more} motionStyle={motion} />
      <ApproveOverlay
        open={approveOpen} onClose={() => setApproveOpen(false)}
        firm={firm} firmSlug={firmSlug} loadingFirm={loadingFirm}
        onRegenerate={() => generateFirm(firmSlug)}
        lookId={lookId} setLookId={setLookId} accentColor={accent} setAccentColor={setAccent} heroId={heroId} setHeroId={setHeroId}
        btn={btn} setBtn={setBtn} kitId={kitId} setKitId={setKitId}
        secs={secs} setSecs={setSecs} seed={seed} setSeed={setSeed}
        phId={phId} setPhId={setPhId} iconId={iconId} setIconId={setIconId}
        moreId={moreId} setMoreId={setMoreId} motionId={motionId} setMotionId={setMotionId}
        pitchOn={pitchOn} setPitchOn={setPitchOn}
        imageSeed={imageSeed} setImageSeed={setImageSeed}
        firmSlugs={firmSlugs} onPick={pickFirm} />
      <SendOverlay
        open={sendOpen} onClose={() => setSendOpen(false)}
        loadFirmBySlug={loadFirmBySlug} />
    </div>
  );
};

const ReskinDemo = () => (
  <div style={{ fontFamily: "system-ui, sans-serif" }}>
    <Bar text={`Same generated site · re-skinned`} sub={`look: ${pickedLook}`} />
    <SiteRouter content={content} lookId={pickedLook} />
    <Bar text="Same generated site · re-skinned" sub={`look: ${contrastLook}`} />
    <SiteRouter content={content} lookId={contrastLook} />
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
            <SiteRouter content={content} seed={s} />
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

type View = "site" | "inventory" | "variants" | "sitemap";

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
      <button style={tab(view === "sitemap")} onClick={() => setView("sitemap")}>Sitemap</button>
      <button style={tab(view === "variants")} onClick={() => setView("variants")}>Variants</button>
      <button style={tab(view === "inventory")} onClick={() => setView("inventory")}>Inventory specs</button>
    </div>
  );
};

const App = () => {
  const [view, setView] = useState<View>("site");
  return (
    <div>
      <Tabs view={view} setView={setView} />
      {view === "site" ? <VariantStudio /> : view === "sitemap" ? <SitemapDemo /> : view === "variants" ? <VariantsDemo /> : <InventoryBrowser />}
    </div>
  );
};

// Chrome-free render of ONE generated site, for clean visual review / manual
// screenshots at localhost:3010/?bare (open in a real browser). Params:
//   ?firm=<slug>  ?look=<presetId>  ?hero=<id>  ?primary=<style>  ?kit=<id>  ?seed=<n>
//   ?still        freeze CSS animation/transition so a capture settles
const params = new URLSearchParams(location.search);
const isBare = params.has("bare");

const BareSite = () => {
  const firmSlug = params.get("firm") || DEFAULT_SLUG;
  const [firm, setFirm] = useState<SiteContent>(content);
  useEffect(() => {
    if (firmSlug === DEFAULT_SLUG) return;
    const entry = firmList.find((f) => f.slug === firmSlug);
    if (entry) loadFirm(entry.path).then(setFirm).catch(() => {});
  }, [firmSlug]);
  const seed = Number(params.get("seed")) || 0;
  const look = params.get("look") || undefined;
  const hero = params.get("hero") || undefined;
  const primary = (params.get("primary") as PrimaryStyle) || undefined;
  const kitSel = params.get("kit") || undefined;
  // Per-slot variant overrides via URL (e.g. ?services=services/magic-decorator&cta=cta/magic-masked)
  // so a full site can be assembled from chosen variants for testing.
  const OVERRIDE_SLOTS = ["services", "feature", "process", "about", "stats", "testimonials", "values", "cta", "gallery", "partners", "faq", "team", "pricing", "audience"];
  const sectionOverrides = Object.fromEntries(
    OVERRIDE_SLOTS.map((s) => [s, params.get(s)]).filter(([, v]) => !!v) as [string, string][],
  );
  return (
    <>
      {params.has("still") && (
        <style>{`*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}`}</style>
      )}
      <SiteRouter content={firm} seed={seed} lookId={look} heroId={hero} primaryStyle={primary} kitId={kitSel} sectionOverrides={sectionOverrides} pitch={params.has("pitch")} imageSeed={Number(params.get("imageSeed")) || 0} />
    </>
  );
};

// --- PUBLIC PROTOTYPE ROUTE: /p/<slug> ------------------------------------------
// The link that goes into the outreach e-mail. Renders ONE approved firm in its
// frozen plan (read from /published.json, written on "Durchwinken"), chrome-free.
// One Vercel deploy serves every prototype this way. In dev the same path works
// via Vite's SPA fallback. Falls back to an auto-plan pitch render if no record
// exists yet, and to a 404-style notice if the firm is unknown.
const protoMatch = location.pathname.match(/^\/p\/([a-z0-9._-]+)\/?$/i);

const Centered: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "ui-monospace, monospace", color: "#555", fontSize: "0.85rem", padding: 24, textAlign: "center" }}>{children}</div>
);

const PrototypeSite: React.FC<{ slug: string }> = ({ slug }) => {
  const entry = firmList.find((f) => f.slug === slug);
  const [firm, setFirm] = useState<SiteContent | null>(slug === DEFAULT_SLUG ? content : null);
  const [rec, setRec] = useState<PublishedManifest[string] | null | undefined>(undefined);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    fetch("/published.json").then((r) => (r.ok ? r.json() : {})).then((m: PublishedManifest) => setRec(m[slug] ?? null)).catch(() => setRec(null));
    if (slug === DEFAULT_SLUG) return;
    if (!entry) { setMissing(true); return; }
    loadFirm(entry.path).then(setFirm).catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <Centered>Kein Prototyp für „{slug}".</Centered>;
  if (!firm || rec === undefined) return <Centered>Prototyp wird geladen …</Centered>;
  // No frozen record → render a sensible default (pitch on; auto plan from seed 0).
  const p = rec ?? { seed: 0, pitch: true } as PublishedManifest[string];
  return (
    <SiteRouter content={firm} seed={p.seed} lookId={p.lookId} heroId={p.heroId}
      primaryStyle={p.primaryStyle} kitId={p.kitId} sectionOverrides={p.sectionOverrides}
      pageHeaderId={p.pageHeaderId} iconSetId={p.iconSetId} moreStyle={p.moreStyle} motionStyle={p.motionStyle}
      pitch={p.pitch !== false} imageSeed={p.imageSeed} />
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(protoMatch ? <PrototypeSite slug={protoMatch[1]} /> : isBare ? <BareSite /> : <App />);
