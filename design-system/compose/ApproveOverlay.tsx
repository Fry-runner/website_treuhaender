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
import type { PrimaryStyle, MoreStyle } from "../structures/primitives";
import { SiteRouter } from "./SiteRouter";
import { planSite } from "../variants/select";
import { presetList } from "../tokens";
import { heroVariants, primaryStyleVariants, sectionVariants, pageHeaderVariants } from "../variants/registry";
import { kits } from "../variants/kits";
import { ICON_SETS } from "../icons/iconSets";
import { MOTION_STYLE_IDS, type MotionStyleId } from "../motion/motionStyle";
const MORE_STYLE_IDS: MoreStyle[] = ["underline", "arrow", "chip", "ghost", "boxed", "chevron", "arrow-up", "dot", "arrow-box", "bracket", "pill-arrow"];
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
  phId: string; setPhId: (v: string) => void;
  iconId: string; setIconId: (v: string) => void;
  moreId: string; setMoreId: (v: string) => void;
  motionId: string; setMotionId: (v: string) => void;
  secs: Record<string, string>; setSecs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  seed: number; setSeed: React.Dispatch<React.SetStateAction<number>>;
  pitchOn: boolean; setPitchOn: (v: boolean) => void;
  imageSeed: number; setImageSeed: React.Dispatch<React.SetStateAction<number>>;
  /** Gallery navigation: the ordered lead slugs + a callback that switches the
   *  studio's active firm (same handler the studio's firm picker uses). */
  firmSlugs: string[];
  onPick: (slug: string) => void;
}

// Light, plain cockpit — white surfaces, hairline borders, dark text. The soft
// scrim only dims the page behind so the white panel reads as the focus.
const C = {
  scrim: "rgba(17,18,20,0.32)",
  card: "#ffffff",
  panel: "#f7f8fa",
  line: "#e5e7eb",
  text: "#111827",
  dim: "#6b7280",
  accent: "#f5b301",
  ok: "#16a34a",
  bad: "#dc2626",
  field: "#ffffff",
};
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

// Test-Versand: solange aktiv, gehen ALLE Mails an die eigene Adresse statt an den
// Kunden — damit lässt sich der ganze Durchwink-Loop gefahrlos proben.
const TEST_RECIPIENT = "oliver@fam-glaeser.de";

const btn = (variant: "primary" | "ghost" | "accent" | "ok" = "ghost"): React.CSSProperties => ({
  fontFamily: mono, fontSize: "0.76rem", fontWeight: 700, padding: "9px 14px", borderRadius: 9,
  cursor: "pointer", whiteSpace: "nowrap", border: "1px solid",
  borderColor: variant === "accent" ? C.accent : variant === "ok" ? C.ok : variant === "primary" ? C.text : C.line,
  background: variant === "accent" ? C.accent : variant === "ok" ? C.ok : variant === "primary" ? C.text : "#ffffff",
  color: variant === "accent" ? "#1a1a1a" : variant === "primary" || variant === "ok" ? "#ffffff" : C.text,
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
      background: done ? C.ok : "transparent", color: done ? "#ffffff" : C.text,
      border: `1px solid ${done ? C.ok : C.line}` }}>{done ? "✓" : n}</span>
    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{title}</span>
  </div>
);

const sectionSlots = Object.keys(sectionVariants);

export const ApproveOverlay: React.FC<ApproveOverlayProps> = ({
  open, onClose, firm, firmSlug, loadingFirm, onRegenerate,
  lookId, setLookId, heroId, setHeroId, btn: btnId, setBtn, kitId, setKitId,
  phId, setPhId, iconId, setIconId, moreId, setMoreId, motionId, setMotionId,
  secs, setSecs, seed, setSeed, pitchOn, setPitchOn, imageSeed, setImageSeed,
  firmSlugs, onPick,
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
  // Test-Versand an die eigene Adresse statt an den Kunden — default AN, in diesem
  // Browser gemerkt, damit ein Reload nicht versehentlich an einen Kunden sendet.
  const [testMode, setTestMode] = useState<boolean>(() => ls("outreachTestMode") !== "0");
  const toggleTest = () => setTestMode((v) => { const n = !v; try { localStorage.setItem("outreachTestMode", n ? "1" : "0"); } catch { /* storage blocked */ } return n; });
  const autoBody = useRef<string>("");

  // --- gallery position + progress marks ---------------------------------------
  // sentSlugs survives firm switches (the overlay stays mounted while navigating);
  // publishedSlugs is seeded from the live manifest each time the cockpit opens.
  const [sentSlugs, setSentSlugs] = useState<Set<string>>(new Set());
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const onPickRef = useRef(onPick); onPickRef.current = onPick;
  const idx = firmSlugs.indexOf(firmSlug);
  const prevSlug = idx > 0 ? firmSlugs[idx - 1] : undefined;
  const nextSlug = idx >= 0 && idx + 1 < firmSlugs.length ? firmSlugs[idx + 1] : undefined;
  const goPrev = () => { if (prevSlug) onPick(prevSlug); };
  const goNext = () => { if (nextSlug) onPick(nextSlug); };

  // --- resolved controls → plan (mirrors the studio derivation) ---
  const look = lookId === "auto" ? undefined : lookId;
  const hero = heroId === "auto" ? undefined : heroId;
  const primary = btnId === "auto" ? undefined : (btnId as PrimaryStyle);
  const kitSel = kitId === "auto" ? undefined : kitId;
  const ph = phId === "auto" ? undefined : phId;
  const icon = iconId === "auto" ? undefined : iconId;
  const more = moreId === "auto" ? undefined : (moreId as MoreStyle);
  const motion = motionId === "auto" ? undefined : (motionId as MotionStyleId);
  const sectionOverrides = Object.fromEntries(Object.entries(secs).filter(([, v]) => v && v !== "auto"));
  const baseId = firm.meta.basePresetId ?? firm.meta.lookId;
  const plan = planSite(firm, { seed, lookId: look ?? baseId, kitId: kitSel });
  const rLook = (look ?? plan.lookId) + (!look && firm.meta.look ? " (brand)" : "");
  const rHero = hero ?? plan.heroId, rBtn = primary ?? plan.primaryStyle;

  const approvedPlan: PublishedPlan = {
    seed, lookId: look, heroId: hero, primaryStyle: primary, kitId: kitSel,
    sectionOverrides: Object.keys(sectionOverrides).length ? sectionOverrides : undefined,
    pageHeaderId: ph, iconSetId: icon, moreStyle: more, motionStyle: motion,
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

  // Seed the "already published" marks from the live manifest each time we open.
  useEffect(() => {
    if (!open) return;
    fetch("/published.json").then((r) => (r.ok ? r.json() : {}))
      .then((m: Record<string, unknown>) => setPublishedSlugs(new Set(Object.keys(m || {}))))
      .catch(() => { /* no manifest yet */ });
  }, [open]);

  // The "am Stück durchwinken" loop: a successful send marks this lead done and —
  // after a beat to read the confirmation — glides to the next firm. Last firm
  // stays put (nothing left to advance to).
  useEffect(() => {
    if (sendState !== "sent") return;
    setSentSlugs((prev) => (prev.has(firmSlug) ? prev : new Set(prev).add(firmSlug)));
    if (!nextSlug) return;
    const t = setTimeout(() => onPickRef.current(nextSlug), 1800);
    return () => clearTimeout(t);
  }, [sendState, firmSlug, nextSlug]);

  // Gallery keys: ←/→ switch leads (ignored while typing in a field), Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowLeft" && prevSlug) { e.preventDefault(); onPick(prevSlug); }
      else if (e.key === "ArrowRight" && nextSlug) { e.preventDefault(); onPick(nextSlug); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prevSlug, nextSlug, onClose, onPick]);

  if (!open) return null;

  // In test mode every channel (SMTP, mailto, copy, .eml) goes to the operator.
  const effectiveTo = testMode ? TEST_RECIPIENT : recipient.trim();
  const effEmail: OutreachEmail | null = email ? { ...email, to: effectiveTo } : null;

  // Source-less leads can't be regenerated → their content is stale and uncorrected,
  // so publishing is blocked. The AUTHORITATIVE guard lives server-side in
  // scripts/publish.mjs (rejects any slug without scraper/output/<slug>/site.json);
  // this list only drives the UI affordance. Keep in sync if a lead is re-scraped.
  const UNPUBLISHABLE = new Set(["mkfiduciaire-ch", "steuerberater365-zuerich-ch", "steuerberatung-schweiz-ch", "treuhandbuero24-ch"]);
  const publishable = !UNPUBLISHABLE.has(firmSlug);
  const deploy = async () => {
    if (!publishable) { setResult({ ok: false, error: "Diese Firma ist nicht veröffentlichbar – keine Scrape-Quelle vorhanden." }); setPhase("error"); return; }
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
  const navBusy = loadingFirm || phase === "deploying" || sendState === "sending";
  const planRow = (label: string, value: string) => (
    <div style={{ display: "flex", gap: 10, fontSize: "0.72rem", padding: "2px 0" }}>
      <span style={{ width: 72, color: C.dim, fontFamily: mono, flex: "0 0 auto" }}>{label}</span>
      <span style={{ color: C.text, fontFamily: mono, wordBreak: "break-word" }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.scrim, padding: 0, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ position: "absolute", inset: 16, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14,
        color: C.text, boxShadow: "0 12px 48px rgba(17,18,20,0.18)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "12px 18px", borderBottom: `1px solid ${C.line}`, background: C.panel, flex: "0 0 auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <span style={{ fontWeight: 800, fontSize: "0.98rem" }}>Durchwinken &amp; Veröffentlichen</span>
              <span style={{ fontFamily: mono, fontSize: "0.68rem", color: C.dim }}>
                {idx >= 0 ? idx + 1 : "–"} / {firmSlugs.length} · {sentSlugs.size} versendet
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <button onClick={goPrev} disabled={!prevSlug || navBusy} title="Vorheriger Kunde (←)"
                style={{ ...btn("ghost"), padding: "7px 12px", opacity: (!prevSlug || navBusy) ? 0.4 : 1 }}>‹</button>
              <select value={firmSlug} onChange={(e) => onPick(e.target.value)} disabled={navBusy}
                title="Kunde direkt anspringen — ✓ versendet · • veröffentlicht"
                style={{ fontFamily: mono, fontSize: "0.74rem", padding: "7px 9px", borderRadius: 7,
                  border: `1px solid ${C.line}`, background: C.field, color: C.text, cursor: "pointer",
                  maxWidth: 320, opacity: navBusy ? 0.5 : 1 }}>
                {firmSlugs.map((s, i) => (
                  <option key={s} value={s}>{sentSlugs.has(s) ? "✓ " : publishedSlugs.has(s) ? "• " : ""}{i + 1}. {s}</option>
                ))}
              </select>
              <button onClick={goNext} disabled={!nextSlug || navBusy} title="Nächster Kunde (→)"
                style={{ ...btn("ghost"), padding: "7px 12px", opacity: (!nextSlug || navBusy) ? 0.4 : 1 }}>›</button>
              <span style={{ fontFamily: mono, fontSize: "0.72rem", color: C.text, fontWeight: 700,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>
                {loadingFirm ? "lädt …" : firm.meta.firm}
              </span>
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
            <Field label="Page-Header (Subpages)">
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
            <Field label="Verweis-Link-Stil">
              <select style={selectStyle} value={moreId} onChange={(e) => setMoreId(e.target.value)}>
                <option value="auto">Auto · {plan.moreStyle}</option>
                {MORE_STYLE_IDS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Motion / Animation">
              <select style={selectStyle} value={motionId} onChange={(e) => setMotionId(e.target.value)}>
                <option value="auto">Auto</option>
                {MOTION_STYLE_IDS.map((m) => <option key={m} value={m}>{m}</option>)}
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
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#eef0f3" }}>
            <div style={{ flex: "0 0 auto", padding: "7px 14px", borderBottom: `1px solid ${C.line}`, fontFamily: mono, fontSize: "0.68rem", color: C.dim, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span>Live-Vorschau · komplette Website {pitchOn ? "· 🛡 Kaltakquise" : ""}</span>
              <span style={{ color: C.text }}>{rLook} · {rHero} · button:{rBtn}</span>
            </div>
            <div style={{ flex: 1, overflow: "auto", background: "#fff" }}>
              {loadingFirm
                ? <div style={{ height: "100%", display: "grid", placeItems: "center", color: "#888", fontFamily: mono, fontSize: "0.8rem" }}>Firma wird neu generiert …</div>
                : <SiteRouter key={`${firmSlug}|${seed}|${lookId}|${heroId}|${btnId}|${kitId}|${JSON.stringify(secs)}|${pitchOn}|${imageSeed}|${phId}|${iconId}|${moreId}|${motionId}`}
                    content={firm} seed={seed} lookId={look} heroId={hero} primaryStyle={primary}
                    sectionOverrides={sectionOverrides} kitId={kitSel} pitch={pitchOn} imageSeed={imageSeed}
                    pageHeaderId={ph} iconSetId={icon} moreStyle={more} motionStyle={motion} />}
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
                <button onClick={deploy} disabled={phase === "deploying" || !publishable}
                  title={!publishable ? "Keine Scrape-Quelle – diese Firma kann nicht veröffentlicht werden." : undefined}
                  style={{ ...btn("accent"), width: "100%", opacity: (phase === "deploying" || !publishable) ? 0.5 : 1, cursor: !publishable ? "not-allowed" : undefined }}>
                  {!publishable ? "🔒 Nicht veröffentlichbar (keine Quelle)" : phase === "deploying" ? "Baut & deployt …" : "🚀 Durchwinken & veröffentlichen"}
                </button>
              )}
              {!deployed && !publishable && (
                <div style={{ fontSize: "0.72rem", color: C.dim, marginTop: 8 }}>Für diese Firma fehlt die Scrape-Quelle (<code style={{ fontFamily: mono }}>scraper/output/{firmSlug}/site.json</code>) – erst neu scrapen, dann veröffentlichen.</div>
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

            {/* STEP 3 — sending lives in the separate "Versand" cockpit */}
            <section style={{ opacity: deployed ? 1 : 0.55 }}>
              <StepLabel n={3} title="Versenden" done={!!deployed} />
              <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", background: C.field, fontSize: "0.74rem", color: C.text, lineHeight: 1.6 }}>
                {deployed ? "✓ Veröffentlicht." : "Nach dem Veröffentlichen"} landet diese Site in der <b>📤 Versand</b>-Umgebung — dort gehst du alle veröffentlichten Prototypen per Galerie durch und versendest jeden einzeln. Das Deploy läuft im Hintergrund weiter; du kannst dieses Cockpit schon schliessen und die nächste Firma durchwinken.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
