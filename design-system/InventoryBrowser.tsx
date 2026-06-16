/**
 * Inventory spec browser
 * ======================
 * Renders every design-element's merged meta (structure + visual + placement +
 * states + ANIMATION + realWorld + designLanguage) from the generator's
 * components/_manifest.json. Filter by design language and by category, or
 * search across names/specs. Pure inline styles — no Tailwind dependency.
 */
import React, { useMemo, useState } from "react";
import manifest from "./components/_manifest.json";

type Look = "any" | "editorial" | "swiss" | "soft" | "warm";

interface Meta {
  id?: string;
  slot?: string;
  category: string;
  name: string;
  variants?: string[];
  structure?: string;
  fromBuiltSites?: string[];
  styleAffinity?: Look[];
  priority?: "core" | "common" | "optional";
  notes?: string | null;
  entryIds?: string[];
  prevalence?: string | null;
  visual?: string;
  placement?: string;
  states?: string;
  animation?: string;
  realWorld?: string[];
  designLanguage?: Partial<Record<Look, string>>;
}

const ENTRIES: Array<[string, Meta]> = Object.entries(manifest as Record<string, Meta>);

const CATEGORY_ORDER = [
  "section", "navigation", "footer", "button", "card",
  "form", "widget", "decoration", "layout",
];

const LOOKS: Look[] = ["any", "editorial", "swiss", "soft", "warm"];
const LOOK_COLOR: Record<Look, string> = {
  any: "#64748b",
  editorial: "#2563EB",
  swiss: "#C8102E",
  soft: "#1Fa30a", // darkened tureva lime for legible chips
  warm: "#2C3E91",
};
const PRIORITY_COLOR: Record<string, string> = {
  core: "#16a34a", common: "#d97706", optional: "#64748b",
};

const ink = "#1c1c1a";
const muted = "#71717a";
const line = "#e7e4dd";
const paper = "#faf9f6";
const mono = '"JetBrains Mono", ui-monospace, Menlo, monospace';
const sans = '"Inter", ui-sans-serif, system-ui, sans-serif';

const Chip: React.FC<{ color: string; children: React.ReactNode; solid?: boolean }> = ({ color, children, solid }) => (
  <span style={{
    fontFamily: mono, fontSize: "0.62rem", letterSpacing: "0.04em", textTransform: "uppercase",
    padding: "2px 7px", borderRadius: 999, lineHeight: 1.6,
    color: solid ? "#fff" : color, background: solid ? color : `${color}14`,
    border: `1px solid ${solid ? color : color + "55"}`, whiteSpace: "nowrap",
  }}>{children}</span>
);

const Field: React.FC<{ label: string; children: React.ReactNode; accent?: string }> = ({ label, children, accent }) => (
  <div style={{ marginTop: 10 }}>
    <div style={{
      fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase",
      color: accent ?? muted, marginBottom: 3, display: "flex", alignItems: "center", gap: 6,
    }}>
      {accent && <span style={{ width: 6, height: 6, borderRadius: 999, background: accent, display: "inline-block" }} />}
      {label}
    </div>
    <div style={{ fontSize: "0.82rem", lineHeight: 1.5, color: ink }}>{children}</div>
  </div>
);

const SpecCard: React.FC<{ k: string; m: Meta }> = ({ k, m }) => {
  const affinities = m.styleAffinity ?? [];
  return (
    <div style={{
      border: `1px solid ${line}`, borderRadius: 12, background: "#fff",
      padding: "16px 16px 18px", display: "flex", flexDirection: "column",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: ink }}>{m.name}</div>
        {m.priority && <Chip color={PRIORITY_COLOR[m.priority]} solid>{m.priority}</Chip>}
      </div>
      <div style={{ fontFamily: mono, fontSize: "0.66rem", color: muted, marginTop: 2 }}>{m.id ?? `slot · ${m.slot}`} · {k}</div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
        {affinities.map((a) => <Chip key={a} color={LOOK_COLOR[a] ?? muted}>{a}</Chip>)}
      </div>

      {m.structure && <Field label="Structure">{m.structure}</Field>}
      {m.visual && <Field label="Visual">{m.visual}</Field>}
      {m.placement && <Field label="Placement">{m.placement}</Field>}
      {m.states && <Field label="States">{m.states}</Field>}

      {m.animation && (
        <div style={{
          marginTop: 12, padding: "10px 12px", borderRadius: 10,
          background: "#0b0b0c", color: "#e7ffe2",
        }}>
          <div style={{ fontFamily: mono, fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#7CFB6B", marginBottom: 4 }}>
            ▸ Animation
          </div>
          <div style={{ fontSize: "0.8rem", lineHeight: 1.5 }}>{m.animation}</div>
        </div>
      )}

      {m.designLanguage && Object.keys(m.designLanguage).length > 0 && (
        <Field label="Per design language">
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
            {(Object.entries(m.designLanguage) as Array<[Look, string]>).map(([look, note]) => (
              <div key={look} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0, marginTop: 1 }}><Chip color={LOOK_COLOR[look] ?? muted}>{look}</Chip></span>
                <span style={{ fontSize: "0.78rem", lineHeight: 1.45, color: ink }}>{note}</span>
              </div>
            ))}
          </div>
        </Field>
      )}

      {m.realWorld && m.realWorld.length > 0 && (
        <Field label="Seen on (of the 30)">
          <ul style={{ margin: "2px 0 0", paddingLeft: 16 }}>
            {m.realWorld.map((r, i) => <li key={i} style={{ fontSize: "0.76rem", lineHeight: 1.5, color: muted }}>{r}</li>)}
          </ul>
        </Field>
      )}

      {m.prevalence && <Field label="Prevalence (scraped CH)">{m.prevalence}</Field>}
    </div>
  );
};

export const InventoryBrowser: React.FC = () => {
  const [q, setQ] = useState("");
  const [look, setLook] = useState<Look | "all">("all");
  const [cat, setCat] = useState<string | "all">("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ENTRIES.filter(([k, m]) => {
      if (cat !== "all" && m.category !== cat) return false;
      if (look !== "all") {
        const aff = m.styleAffinity ?? [];
        const inLook = aff.includes(look as Look) || aff.includes("any") || !!m.designLanguage?.[look as Look];
        if (!inLook) return false;
      }
      if (needle) {
        const hay = [k, m.name, m.id, m.structure, m.visual, m.placement, m.states, m.animation,
          ...(m.realWorld ?? []), ...Object.values(m.designLanguage ?? {})].join(" ").toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [q, look, cat]);

  const byCat = useMemo(() => {
    const map = new Map<string, Array<[string, Meta]>>();
    for (const e of filtered) {
      const c = e[1].category;
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(e);
    }
    return [...map.entries()].sort((a, b) => CATEGORY_ORDER.indexOf(a[0]) - CATEGORY_ORDER.indexOf(b[0]));
  }, [filtered]);

  const btn = (active: boolean): React.CSSProperties => ({
    fontFamily: mono, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em",
    padding: "5px 11px", borderRadius: 999, cursor: "pointer",
    border: `1px solid ${active ? ink : line}`, background: active ? ink : "#fff",
    color: active ? "#fff" : ink,
  });

  const cats = ["all", ...CATEGORY_ORDER.filter((c) => ENTRIES.some(([, m]) => m.category === c))];

  return (
    <div style={{ background: paper, minHeight: "100vh", fontFamily: sans, color: ink }}>
      <div style={{
        position: "sticky", top: 0, zIndex: 10, background: "rgba(250,249,246,0.92)",
        backdropFilter: "blur(8px)", borderBottom: `1px solid ${line}`, padding: "16px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>Design-element inventory</div>
            <div style={{ fontFamily: mono, fontSize: "0.7rem", color: muted, marginTop: 2 }}>
              {filtered.length} / {ENTRIES.length} elements · from 30-site analysis
            </div>
          </div>
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search specs, animation, sites…"
            style={{
              fontFamily: sans, fontSize: "0.82rem", padding: "8px 12px", minWidth: 240,
              border: `1px solid ${line}`, borderRadius: 8, outline: "none", background: "#fff",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12, alignItems: "center" }}>
          <span style={{ fontFamily: mono, fontSize: "0.6rem", color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 2 }}>Look</span>
          <button style={btn(look === "all")} onClick={() => setLook("all")}>all</button>
          {LOOKS.map((l) => (
            <button key={l} style={{ ...btn(look === l), ...(look === l ? { background: LOOK_COLOR[l], borderColor: LOOK_COLOR[l] } : {}) }} onClick={() => setLook(l)}>{l}</button>
          ))}
          <span style={{ width: 1, height: 18, background: line, margin: "0 4px" }} />
          <span style={{ fontFamily: mono, fontSize: "0.6rem", color: muted, textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 2 }}>Type</span>
          {cats.map((c) => (
            <button key={c} style={btn(cat === c)} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "8px 24px 64px" }}>
        {byCat.map(([c, items]) => (
          <section key={c} style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: "0.9rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: muted, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
              {c}s <span style={{ fontFamily: mono, fontSize: "0.7rem", fontWeight: 400 }}>({items.length})</span>
              <span style={{ flex: 1, height: 1, background: line }} />
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
              {items.map(([k, m]) => <SpecCard key={k} k={k} m={m} />)}
            </div>
          </section>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: muted, padding: "64px 0", fontFamily: mono }}>No elements match.</div>
        )}
      </div>
    </div>
  );
};
