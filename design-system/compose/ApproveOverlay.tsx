/**
 * ApproveOverlay — the full-screen "Durchwinken & Versenden"-COCKPIT für EINE Firma.
 *
 * Opens from the Variant Studio over the currently-previewed prototype and is a
 * self-contained review surface with three columns:
 *   • LINKS  — the variant controls (kit · palette · hero · button · sections · seed ·
 *              Kaltakquise) plus "🔄 Neu generieren" (re-runs extract.ts for the firm).
 *   • MITTE  — a LIVE preview of the COMPLETE multi-page website (the same SiteRouter
 *              the public prototype renders), reflecting every control instantly.
 *   • RECHTS — Durchwinken: publish the frozen plan to Vercel (/p/<slug>) + draft and
 *              send the DE outreach mail with the live link.
 *
 * The control state is OWNED by the studio and shared in via props, so edits here and
 * in the studio toolbar stay in sync, and the plan that goes live is exactly what is
 * previewed.
 */
import React, { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../content/types";
import type { PrimaryStyle } from "../structures/primitives";
import { SiteRouter } from "./SiteRouter";
import { planSite } from "../variants/select";
import { presetList } from "../tokens";
import { heroVariants, primaryStyleVariants, sectionVariants } from "../variants/registry";
import { kits } from "../variants/kits";
import {
  buildOutreachEmail, emlContent, mailtoHref, recipientFor,
  type OutreachEmail, type PublishedPlan,
} from "./outreach";

interface DeployResult {
  ok: boolean;
  deployed?: boolean;
  prototypeUrl?: string;
  deploymentUrl?: string;
  productionUrl?: string;
  instructions?: string[];
  error?: string;
}

export interface ApproveOverlayProps {
  open: boolean;
  onClose: () => void;
  firm: SiteContent;
  firmSlug: string;
  loadingFirm: boolean;
  /** Re-run extract.ts for this firm (the studio owns the fetch + state update). */
  onRegenerate: () => void;
  // shared control state + setters (owned by the studio)
  lookId: string; setLookId: (v: string) => void;
  heroId: string; setHeroId: (v: string) => void;
  btn: string; setBtn: (v: string) => void;
  kitId: string; setKitId: (v: string) => void;
  secs: Record<string, string>; setSecs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  seed: number; setSeed: React.Dispatch<React.SetStateAction<number>>;
  pitchOn: boolean; setPitchOn: (v: boolean) => void;
  imageSeed: number; setImageSeed: React.Dispatch<React.SetStateAction<number>>;
}

const C = {
  scrim: "rgba(8,9,11,0.82)",
  card: "#121316",
  panel: "#0e0f12",
  line: "rgba(255,255,255,0.12)",
  text: "#f3f4f6",
  dim: "rgba(255,255,255,0.55)",
  accent: "#f5b301",
  ok: "#34d399",
  bad: "#f87171",
  field: "#1b1d22",
};
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

const btn = (variant: "primary" | "ghost" | "accent" | "ok" = "ghost"): React.CSSProperties => ({
  fontFamily: mono, fontSize: "0.76rem", fontWeight: 700, padding: "9px 14px", borderRadius: 9,
  cursor: "pointer", whiteSpace: "nowrap", border: "1px solid",
  borderColor: variant === "accent" ? C.accent : variant === "ok" ? C.ok : variant === "primary" ? "#fff" : C.line,
  background: variant === "accent" ? C.accent : variant === "ok" ? C.ok : variant === "primary" ? "#fff" : "transparent",
  color: variant === "accent" || variant === "primary" || variant === "ok" ? "#0b0b0c" : C.text,
});
const inputStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: "0.78rem", padding: "9px 11px", borderRadius: 8,
  border: `1px solid ${C.line}`, background: C.field, color: C.text, width: "100%",
};
const selectStyle: React.CSSProperties = {
  fontFamily: mono, fontSize: "0.72rem", padding: "7px 9px", borderRadius: 7,
  border: `1px solid ${C.line}`, background: C.field, color: C.text, width: "100%", cursor: "pointer",
};
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontFamily: mono, fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.dim }}>{label}</span>
    {children}
  </label>
);
const StepLabel: React.FC<{ n: number; title: string; done?: boolean }> = ({ n, title, done }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0 12px" }}>
    <span style={{ width: 22, height: 22, borderRadius: 999, display: "grid", placeItems: "center",
      fontFamily: mono, fontSize: "0.7rem", fontWeight: 700,
      background: done ? C.ok : "transparent", color: done ? "#0b0b0c" : C.text,
      border: `1px solid ${done ? C.ok : C.line}` }}>{done ? "✓" : n}</span>
    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{title}</span>
  </div>
);

const sectionSlots = Object.keys(sectionVariants);

export const ApproveOverlay: React.FC<ApproveOverlayProps> = ({
  open, onClose, firm, firmSlug, loadingFirm, onRegenerate,
  lookId, setLookId, heroId, setHeroId, btn: btnId, setBtn, kitId, setKitId,
  secs, setSecs, seed, setSeed, pitchOn, setPitchOn, imageSeed, setImageSeed,
}) => {
  const [phase, setPhase] = useState<"idle" | "deploying" | "done" | "error">("idle");
  const [result, setResult] = useState<DeployResult | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState<OutreachEmail | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendInfo, setSendInfo] = useState<{ error?: string; hint?: string; messageId?: string } | null>(null);
  // ETH login — entered once here, kept ONLY in this browser (localStorage), never in
  // the repo. Lets the send button work without editing any .env file.
  const ls = (k: string) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
  const [smtpUser, setSmtpUser] = useState<string>(() => ls("ethSmtpUser"));
  const [smtpPass, setSmtpPass] = useState<string>(() => ls("ethSmtpPass"));
  const saveCred = (k: string, v: string, set: (v: string) => void) => { set(v); try { localStorage.setItem(k, v); } catch { /* storage blocked */ } };
  const autoBody = useRef<string>("");

  // --- resolved controls → plan (mirrors the studio derivation) ---
  const look = lookId === "auto" ? undefined : lookId;
  const hero = heroId === "auto" ? undefined : heroId;
  const primary = btnId === "auto" ? undefined : (btnId as PrimaryStyle);
  const kitSel = kitId === "auto" ? undefined : kitId;
  const sectionOverrides = Object.fromEntries(Object.entries(secs).filter(([, v]) => v && v !== "auto"));
  const baseId = firm.meta.basePresetId ?? firm.meta.lookId;
  const plan = planSite(firm, { seed, lookId: look ?? baseId, kitId: kitSel });
  const rLook = (look ?? plan.lookId) + (!look && firm.meta.look ? " (brand)" : "");
  const rHero = hero ?? plan.heroId, rBtn = primary ?? plan.primaryStyle;

  const approvedPlan: PublishedPlan = {
    seed, lookId: look, heroId: hero, primaryStyle: primary, kitId: kitSel,
    sectionOverrides: Object.keys(sectionOverrides).length ? sectionOverrides : undefined,
    pitch: pitchOn,
    imageSeed: imageSeed || undefined,
  };

  const liveUrl = result?.prototypeUrl || manualUrl.trim() || "";

  useEffect(() => {
    if (!open) return;
    setPhase("idle"); setResult(null); setManualUrl(""); setCopied(false);
    setSendState("idle"); setSendInfo(null);
    setRecipient(recipientFor(firm) ?? ""); setEmail(null); autoBody.current = "";
  }, [open, firmSlug, firm]);

  useEffect(() => {
    if (!liveUrl) return;
    const fresh = buildOutreachEmail(firm, liveUrl);
    setEmail((prev) => (!prev || prev.body === autoBody.current ? (autoBody.current = fresh.body, fresh) : prev));
  }, [liveUrl, firm]);

  if (!open) return null;

  const effEmail: OutreachEmail | null = email ? { ...email, to: recipient.trim() } : null;

  const deploy = async () => {
    setPhase("deploying"); setResult(null);
    try {
      const res = await fetch("/__deploy", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: firmSlug, plan: approvedPlan }),
      });
      const json: DeployResult = await res.json();
      setResult(json); setPhase(json.ok ? "done" : "error");
    } catch (e: any) {
      setResult({ ok: false, error: String(e?.message || e) }); setPhase("error");
    }
  };
  const resetDraft = () => { if (!liveUrl) return; const f = buildOutreachEmail(firm, liveUrl); autoBody.current = f.body; setEmail(f); };
  const copyBody = async () => {
    if (!effEmail) return;
    try { await navigator.clipboard.writeText(`An: ${effEmail.to}\nBetreff: ${effEmail.subject}\n\n${effEmail.body}`); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };
  const downloadEml = () => {
    if (!effEmail) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([emlContent(effEmail)], { type: "message/rfc822" }));
    a.download = `${firmSlug}.eml`; a.click(); URL.revokeObjectURL(a.href);
  };
  // Opt-in: relay the draft straight through the ETH mailbox (authenticated SMTP).
  const sendViaEth = async () => {
    if (!effEmail || !effEmail.to) return;
    setSendState("sending"); setSendInfo(null);
    try {
      const auth = (smtpUser.trim() && smtpPass) ? { user: smtpUser.trim(), pass: smtpPass } : undefined;
      const res = await fetch("/__send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: effEmail.to, subject: effEmail.subject, body: effEmail.body, auth }),
      });
      const json = await res.json();
      if (json.ok && json.sent) { setSendState("sent"); setSendInfo({ messageId: json.messageId }); }
      else { setSendState("error"); setSendInfo({ error: json.error, hint: json.hint }); }
    } catch (e: any) {
      setSendState("error"); setSendInfo({ error: String(e?.message || e) });
    }
  };

  const deployed = phase === "done" && result?.deployed;
  const builtOnly = phase === "done" && result?.ok && !result?.deployed;
  const planRow = (label: string, value: string) => (
    <div style={{ display: "flex", gap: 10, fontSize: "0.72rem", padding: "2px 0" }}>
      <span style={{ width: 72, color: C.dim, fontFamily: mono, flex: "0 0 auto" }}>{label}</span>
      <span style={{ color: C.text, fontFamily: mono, wordBreak: "break-word" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.scrim, padding: 0, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ position: "absolute", inset: 16, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14,
        color: C.text, boxShadow: "0 24px 80px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "12px 18px", borderBottom: `1px solid ${C.line}`, background: C.panel, flex: "0 0 auto" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.98rem" }}>Durchwinken &amp; Versenden — Cockpit</div>
            <div style={{ fontFamily: mono, fontSize: "0.72rem", color: C.dim, marginTop: 2 }}>
              {firm.meta.firm} · <span style={{ color: C.text }}>{firmSlug}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPitchOn(!pitchOn)} title="Kaltakquise: Logo→Wortmarke · keine Fremdlogos · Stock-Fotos · noindex"
              style={{ ...btn(pitchOn ? "accent" : "ghost") }}>{pitchOn ? "🛡 Kaltakquise: AN" : "🛡 Kaltakquise: AUS"}</button>
            <button onClick={onRegenerate} disabled={loadingFirm} title="Diese Firma komplett neu generieren (extract.ts)"
              style={{ ...btn("ghost"), opacity: loadingFirm ? 0.6 : 1 }}>{loadingFirm ? "⏳ generiert …" : "🔄 Neu generieren"}</button>
            <button onClick={onClose} style={{ ...btn("ghost"), padding: "8px 10px" }}>Schliessen ✕</button>
          </div>
        </div>

        {/* ── BODY: controls | preview | publish ─────────────────── */}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

          {/* LEFT — controls */}
          <div style={{ width: 248, flex: "0 0 auto", borderRight: `1px solid ${C.line}`, background: C.panel,
            overflowY: "auto", padding: "14px 14px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontFamily: mono, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.dim }}>Elemente auswechseln</div>
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
            <Field label="Hero">
              <select style={selectStyle} value={heroId} onChange={(e) => setHeroId(e.target.value)}>
                <option value="auto">Auto · {plan.heroId.replace("hero/", "")}</option>
                {heroVariants.map((h) => <option key={h.id} value={h.id}>{h.id.replace("hero/", "")}</option>)}
              </select>
            </Field>
            <Field label="Button-Stil">
              <select style={selectStyle} value={btnId} onChange={(e) => setBtn(e.target.value)}>
                <option value="auto">Auto · {plan.primaryStyle}</option>
                {primaryStyleVariants.map((b) => <option key={b.id} value={b.id}>{b.id}</option>)}
              </select>
            </Field>
            <Field label={`Seed · ${seed}`}>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...btn("primary"), flex: 1 }} onClick={() => { setSeed(Math.floor(Math.random() * 1e6)); setLookId("auto"); setHeroId("auto"); setBtn("auto"); setKitId("auto"); setSecs({}); }}>🎲 Würfeln</button>
                <button style={btn("ghost")} onClick={() => setSeed((s) => s + 1)} title="nächster Seed">＋</button>
                <button style={btn("ghost")} onClick={() => { setSeed(0); setLookId("auto"); setHeroId("auto"); setBtn("auto"); setKitId("auto"); setSecs({}); }}>↺</button>
              </div>
            </Field>
            <Field label={`Bilder · ${imageSeed === 0 ? "Standard" : "#" + imageSeed}`}>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...btn("primary"), flex: 1 }} onClick={() => setImageSeed((s) => s + 1)}
                  title={pitchOn ? "Andere Stock-Bilder würfeln — Layout & Varianten bleiben" : "Eigene Fotos neu anordnen — Layout & Varianten bleiben"}>
                  🎲 Bilder neu würfeln
                </button>
                <button style={btn("ghost")} onClick={() => setImageSeed(0)} title="Bilder auf Standard zurücksetzen">↺</button>
              </div>
            </Field>
            <div style={{ height: 1, background: C.line, margin: "4px 0" }} />
            <div style={{ fontFamily: mono, fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: C.dim }}>Sektions-Varianten</div>
            {sectionSlots.map((slot) => (
              <Field key={slot} label={slot}>
                <select style={selectStyle} value={secs[slot] ?? "auto"} onChange={(e) => setSecs((m) => ({ ...m, [slot]: e.target.value }))}>
                  <option value="auto">Auto · {(plan.sections[slot] ?? "").replace(`${slot}/`, "")}</option>
                  {sectionVariants[slot].map((v) => <option key={v.id} value={v.id}>{v.id.replace(`${slot}/`, "")}</option>)}
                </select>
              </Field>
            ))}
          </div>

          {/* CENTER — live preview of the complete website */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#1a1c20" }}>
            <div style={{ flex: "0 0 auto", padding: "7px 14px", borderBottom: `1px solid ${C.line}`, fontFamily: mono, fontSize: "0.68rem", color: C.dim, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>Live-Vorschau · komplette Website {pitchOn ? "· 🛡 Kaltakquise" : ""}</span>
              <span style={{ color: C.text }}>{rLook} · {rHero} · button:{rBtn}</span>
            </div>
            <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
              {loadingFirm
                ? <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#888", fontFamily: mono, fontSize: "0.8rem" }}>Firma wird neu generiert …</div>
                : <SiteRouter key={`${firmSlug}|${seed}|${lookId}|${heroId}|${btnId}|${kitId}|${JSON.stringify(secs)}|${pitchOn}|${imageSeed}`}
                    content={firm} seed={seed} lookId={look} heroId={hero} primaryStyle={primary}
                    sectionOverrides={sectionOverrides} kitId={kitSel} pitch={pitchOn} imageSeed={imageSeed} />}
            </div>
          </div>

          {/* RIGHT — publish + send */}
          <div style={{ width: 380, flex: "0 0 auto", borderLeft: `1px solid ${C.line}`, background: C.panel,
            overflowY: "auto", padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 22 }}>

            {/* STEP 1 — frozen plan summary (reflects the live controls) */}
            <section>
              <StepLabel n={1} title="Plan" done />
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", background: C.field }}>
                {planRow("Palette", rLook)}
                {planRow("Hero", rHero)}
                {planRow("Button", rBtn)}
                {planRow("Stil-Kit", kitSel ?? `auto · ${plan.kitId}`)}
                {planRow("Seed", String(seed))}
                {planRow("Sektionen", Object.keys(sectionOverrides).length ? Object.entries(sectionOverrides).map(([s, v]) => `${s}:${v.replace(`${s}/`, "")}`).join(", ") : "auto")}
                <div style={{ display: "flex", gap: 10, fontSize: "0.72rem", padding: "6px 0 2px", marginTop: 6, borderTop: `1px solid ${C.line}` }}>
                  <span style={{ width: 72, color: C.dim, fontFamily: mono, flex: "0 0 auto" }}>Modus</span>
                  <span style={{ fontFamily: mono, fontWeight: 700, color: pitchOn ? C.accent : C.text }}>
                    {pitchOn ? "🛡 Kaltakquise" : "⚠ Echtmodus (echte Logos/Fotos öffentlich)"}
                  </span>
                </div>
              </div>
              {!pitchOn && (
                <div style={{ fontSize: "0.7rem", color: C.accent, marginTop: 8, lineHeight: 1.5 }}>
                  Empfehlung für unaufgeforderte Prototypen: oben „Kaltakquise: AN" schalten.
                </div>
              )}
            </section>

            {/* STEP 2 — publish */}
            <section>
              <StepLabel n={2} title="Auf Vercel veröffentlichen" done={!!deployed} />
              {!deployed && (
                <button onClick={deploy} disabled={phase === "deploying"} style={{ ...btn("accent"), width: "100%", opacity: phase === "deploying" ? 0.6 : 1 }}>
                  {phase === "deploying" ? "Baut & deployt …" : "🚀 Durchwinken & veröffentlichen"}
                </button>
              )}
              {phase === "deploying" && <div style={{ fontSize: "0.72rem", color: C.dim, marginTop: 8 }}>vite build → Vercel-Deploy. Einen Moment …</div>}
              {deployed && (
                <div style={{ border: `1px solid ${C.ok}`, borderRadius: 10, padding: "10px 12px", background: "rgba(52,211,153,0.08)" }}>
                  <div style={{ color: C.ok, fontWeight: 700, fontSize: "0.8rem", marginBottom: 6 }}>✓ Live auf Vercel</div>
                  <a href={result?.prototypeUrl} target="_blank" rel="noreferrer" style={{ fontFamily: mono, fontSize: "0.76rem", color: C.text, wordBreak: "break-all" }}>{result?.prototypeUrl}</a>
                </div>
              )}
              {builtOnly && (
                <div style={{ border: `1px solid ${C.accent}`, borderRadius: 10, padding: "10px 12px", background: "rgba(245,179,1,0.08)" }}>
                  <div style={{ color: C.accent, fontWeight: 700, fontSize: "0.8rem", marginBottom: 6 }}>Build bereit — Token fehlt für Auto-Deploy</div>
                  <ul style={{ margin: "0 0 8px", paddingLeft: 16, fontSize: "0.72rem", color: C.text, lineHeight: 1.55 }}>
                    {(result?.instructions ?? []).map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                  <input value={manualUrl} onChange={(e) => setManualUrl(e.target.value)} placeholder={result?.prototypeUrl || "https://…/p/" + firmSlug} style={inputStyle} />
                </div>
              )}
              {phase === "error" && (
                <div style={{ border: `1px solid ${C.bad}`, borderRadius: 10, padding: "10px 12px", background: "rgba(248,113,113,0.08)" }}>
                  <div style={{ color: C.bad, fontWeight: 700, fontSize: "0.8rem", marginBottom: 6 }}>Deploy fehlgeschlagen</div>
                  <pre style={{ margin: 0, fontFamily: mono, fontSize: "0.68rem", color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result?.error}</pre>
                  <button onClick={deploy} style={{ ...btn("ghost"), marginTop: 8 }}>Erneut versuchen</button>
                </div>
              )}
            </section>

            {/* STEP 3 — email */}
            <section style={{ opacity: liveUrl ? 1 : 0.5, pointerEvents: liveUrl ? "auto" : "none" }}>
              <StepLabel n={3} title="E-Mail & senden" />
              {!liveUrl && <div style={{ fontSize: "0.72rem", color: C.dim }}>Zuerst veröffentlichen — der Link wird automatisch eingesetzt.</div>}
              {liveUrl && effEmail && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>Empfänger {recipientFor(firm) ? "(aus Scrape)" : "(bitte eintragen)"}</span>
                    <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="kontakt@firma.ch" style={{ ...inputStyle, borderColor: recipient ? C.line : C.bad }} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>Betreff</span>
                    <input value={email!.subject} onChange={(e) => setEmail({ ...email!, subject: e.target.value })} style={inputStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>Text</span>
                    <textarea value={email!.body} onChange={(e) => setEmail({ ...email!, body: e.target.value })} rows={12} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />
                  </label>
                  {/* ETH login — once, kept only in this browser; then the button just sends */}
                  <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", background: C.field, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>ETH-Zugang (nur in diesem Browser gespeichert)</span>
                      {(smtpUser || smtpPass) && <span style={{ fontSize: "0.62rem", color: C.ok, fontFamily: mono }}>✓ gemerkt</span>}
                    </div>
                    <input value={smtpUser} onChange={(e) => saveCred("ethSmtpUser", e.target.value, setSmtpUser)} placeholder="vorname.name@…ethz.ch" autoComplete="username" style={inputStyle} />
                    <input value={smtpPass} onChange={(e) => saveCred("ethSmtpPass", e.target.value, setSmtpPass)} placeholder="ETH-Passwort / App-Passwort" type="password" autoComplete="current-password" style={inputStyle} />
                  </div>
                  {/* Primary: relay through the ETH mailbox (SMTP) */}
                  {sendState !== "sent" && (
                    <button onClick={sendViaEth} disabled={!recipient || !smtpUser.trim() || !smtpPass || sendState === "sending"}
                      style={{ ...btn("ok"), width: "100%", opacity: (!recipient || !smtpUser.trim() || !smtpPass || sendState === "sending") ? 0.6 : 1 }}>
                      {sendState === "sending" ? "📤 Sendet über ETH …" : "📤 Über ETH-Postfach senden"}
                    </button>
                  )}
                  {sendState === "sent" && (
                    <div style={{ border: `1px solid ${C.ok}`, borderRadius: 10, padding: "10px 12px", background: "rgba(52,211,153,0.08)" }}>
                      <div style={{ color: C.ok, fontWeight: 700, fontSize: "0.8rem" }}>✓ Gesendet an {effEmail.to}</div>
                      {sendInfo?.messageId && <div style={{ fontFamily: mono, fontSize: "0.64rem", color: C.dim, marginTop: 4, wordBreak: "break-all" }}>{sendInfo.messageId}</div>}
                    </div>
                  )}
                  {sendState === "error" && (
                    <div style={{ border: `1px solid ${C.bad}`, borderRadius: 10, padding: "10px 12px", background: "rgba(248,113,113,0.08)" }}>
                      <div style={{ color: C.bad, fontWeight: 700, fontSize: "0.8rem", marginBottom: 4 }}>Versand fehlgeschlagen</div>
                      <pre style={{ margin: 0, fontFamily: mono, fontSize: "0.66rem", color: C.text, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{sendInfo?.error}</pre>
                      {sendInfo?.hint && <div style={{ fontSize: "0.68rem", color: C.accent, marginTop: 6, lineHeight: 1.5 }}>{sendInfo.hint}</div>}
                    </div>
                  )}
                  <div style={{ fontSize: "0.64rem", color: C.dim, fontFamily: mono }}>oder manuell:</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <a href={mailtoHref(effEmail)} style={{ ...btn("ghost"), textDecoration: "none" }}>✉ In Mail-App</a>
                    <button onClick={copyBody} style={btn("ghost")}>{copied ? "✓ Kopiert" : "Kopieren"}</button>
                    <button onClick={downloadEml} style={btn("ghost")}>.eml</button>
                    <button onClick={resetDraft} style={{ ...btn("ghost"), marginLeft: "auto" }} title="Entwurf neu aus dem Live-Link erzeugen">↺</button>
                  </div>
                  {!recipient && <div style={{ fontSize: "0.68rem", color: C.bad }}>Ohne Empfänger lässt sich die Mail nicht adressieren.</div>}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
