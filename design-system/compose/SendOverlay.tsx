/**
 * SendOverlay — the "Versand"-COCKPIT, the second half of the outreach flow.
 *
 * Deployment is slow, so the studio's Durchwinken overlay only PUBLISHES a lead
 * (kick off the Vercel deploy, write the record into public/published.json) and the
 * operator moves straight on to the next firm. Every published prototype then shows
 * up HERE — a gallery over public/published.json — where the operator goes through
 * them one by one and sends the outreach mail (same gallery model: ←/→ between leads,
 * mark each done). Nothing here re-deploys; it only reads the frozen records and the
 * firm content to draft + send.
 */
import React, { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../content/types";
import { buildOutreachEmail, emlContent, mailtoHref, recipientFor, type OutreachEmail } from "./outreach";

interface PublishedRecord {
  firm?: string;
  domain?: string;
  contactEmail?: string;
  prototypeUrl?: string;
  approvedAt?: string;
}
type Manifest = Record<string, PublishedRecord>;

export interface SendOverlayProps {
  open: boolean;
  onClose: () => void;
  /** Load the full SiteContent for a slug (the studio owns the example glob). */
  loadFirmBySlug: (slug: string) => Promise<SiteContent | null>;
}

const C = {
  scrim: "rgba(17,18,20,0.32)", card: "#ffffff", panel: "#f7f8fa", line: "#e5e7eb",
  text: "#111827", dim: "#6b7280", accent: "#f5b301", ok: "#16a34a", bad: "#dc2626", field: "#ffffff",
};
const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
// Test-Versand: solange aktiv, gehen ALLE Mails an die eigene Adresse statt an den Kunden.
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

export const SendOverlay: React.FC<SendOverlayProps> = ({ open, onClose, loadFirmBySlug }) => {
  const [manifest, setManifest] = useState<Manifest>({});
  const [idx, setIdx] = useState(0);
  const [firm, setFirm] = useState<SiteContent | null>(null);
  const [loadingFirm, setLoadingFirm] = useState(false);
  const [email, setEmail] = useState<OutreachEmail | null>(null);
  const [recipient, setRecipient] = useState("");
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [sendInfo, setSendInfo] = useState<{ error?: string; hint?: string; messageId?: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [sentSlugs, setSentSlugs] = useState<Set<string>>(new Set());
  const ls = (k: string) => { try { return localStorage.getItem(k) || ""; } catch { return ""; } };
  const [smtpUser, setSmtpUser] = useState<string>(() => ls("ethSmtpUser"));
  const [smtpPass, setSmtpPass] = useState<string>(() => ls("ethSmtpPass"));
  // SMTP server is configurable so the operator can route AROUND ETH/M365's basic-auth
  // block (MFA/Conditional Access → 535) via Gmail (app password) or their own domain.
  const [smtpHost, setSmtpHost] = useState<string>(() => ls("smtpHost") || "smtp.office365.com");
  const [smtpPort, setSmtpPort] = useState<string>(() => ls("smtpPort") || "587");
  const [smtpFrom, setSmtpFrom] = useState<string>(() => ls("smtpFrom"));
  const [smtpReplyTo, setSmtpReplyTo] = useState<string>(() => ls("smtpReplyTo"));
  const saveCred = (k: string, v: string, set: (v: string) => void) => { set(v); try { localStorage.setItem(k, v); } catch { /* blocked */ } };
  const PROVIDERS: { label: string; host: string; port: string }[] = [
    { label: "Office 365 / ETH", host: "smtp.office365.com", port: "587" },
    { label: "Gmail (App-Passwort)", host: "smtp.gmail.com", port: "587" },
  ];
  const applyProvider = (host: string, port: string) => { saveCred("smtpHost", host, setSmtpHost); saveCred("smtpPort", port, setSmtpPort); };
  // Default send path = the LOCAL classic Outlook (modern auth, no password, bypasses the
  // M365 SMTP 535 block). SMTP stays as the fallback.
  const [sendMethod, setSendMethod] = useState<"outlook" | "smtp">(() => (ls("sendMethod") === "smtp" ? "smtp" : "outlook"));
  const setMethod = (m: "outlook" | "smtp") => { setSendMethod(m); try { localStorage.setItem("sendMethod", m); } catch { /* blocked */ } };
  const [outlookFrom, setOutlookFrom] = useState<string>(() => ls("outlookFrom"));
  const [testMode, setTestMode] = useState<boolean>(() => ls("outreachTestMode") !== "0");
  const toggleTest = () => setTestMode((v) => { const n = !v; try { localStorage.setItem("outreachTestMode", n ? "1" : "0"); } catch { /* blocked */ } return n; });
  const autoBody = useRef<string>("");

  // Only PUBLISHED leads with a live link are sendable — sort newest-approved first.
  const refresh = () => fetch("/published.json").then((r) => (r.ok ? r.json() : {}))
    .then((m: Manifest) => setManifest(m || {})).catch(() => setManifest({}));
  useEffect(() => { if (open) refresh(); }, [open]);

  const slugs = Object.keys(manifest)
    .filter((s) => manifest[s]?.prototypeUrl)
    .sort((a, b) => (manifest[b].approvedAt || "").localeCompare(manifest[a].approvedAt || ""));
  const slug = slugs[idx];
  const rec = slug ? manifest[slug] : undefined;
  const liveUrl = rec?.prototypeUrl || "";

  // Keep the index in range as the queue grows/shrinks on refresh.
  useEffect(() => { if (idx >= slugs.length && slugs.length) setIdx(slugs.length - 1); }, [slugs.length, idx]);

  // Load firm content + draft the mail whenever the current lead changes.
  useEffect(() => {
    if (!open || !slug) { setFirm(null); setEmail(null); return; }
    setLoadingFirm(true); setSendState("idle"); setSendInfo(null); setCopied(false); autoBody.current = "";
    loadFirmBySlug(slug).then((c) => {
      setFirm(c);
      setRecipient(rec?.contactEmail || (c ? recipientFor(c) ?? "" : ""));
      if (c && liveUrl) { const f = buildOutreachEmail(c, liveUrl); autoBody.current = f.body; setEmail(f); }
      else setEmail(null);
    }).catch(() => setFirm(null)).finally(() => setLoadingFirm(false));
  }, [open, slug, liveUrl]);

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(slugs.length - 1, i + 1));

  // Gallery keys: ←/→ between leads (ignored while typing), Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, slugs.length]);

  // A successful send marks the lead done and glides to the next after a beat.
  useEffect(() => {
    if (sendState !== "sent" || !slug) return;
    setSentSlugs((p) => (p.has(slug) ? p : new Set(p).add(slug)));
    if (idx + 1 >= slugs.length) return;
    const t = setTimeout(() => setIdx((i) => i + 1), 1800);
    return () => clearTimeout(t);
  }, [sendState, slug]);

  if (!open) return null;

  const effectiveTo = testMode ? TEST_RECIPIENT : recipient.trim();
  const effEmail: OutreachEmail | null = email ? { ...email, to: effectiveTo } : null;

  const resetDraft = () => { if (firm && liveUrl) { const f = buildOutreachEmail(firm, liveUrl); autoBody.current = f.body; setEmail(f); } };
  const copyBody = async () => {
    if (!effEmail) return;
    try { await navigator.clipboard.writeText(`An: ${effEmail.to}\nBetreff: ${effEmail.subject}\n\n${effEmail.body}`); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* blocked */ }
  };
  const downloadEml = () => {
    if (!effEmail) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([emlContent(effEmail)], { type: "message/rfc822" }));
    a.download = `${slug}.eml`; a.click(); URL.revokeObjectURL(a.href);
  };
  const sendViaEth = async () => {
    if (!effEmail || !effEmail.to) return;
    setSendState("sending"); setSendInfo(null);
    try {
      const auth = (smtpUser.trim() && smtpPass) ? {
        user: smtpUser.trim(), pass: smtpPass,
        host: smtpHost.trim() || undefined, port: smtpPort.trim() || undefined,
        from: smtpFrom.trim() || undefined, replyTo: smtpReplyTo.trim() || undefined,
      } : undefined;
      const res = await fetch("/__send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: effEmail.to, subject: effEmail.subject, body: effEmail.body, auth }),
      });
      const json = await res.json();
      if (json.ok && json.sent) { setSendState("sent"); setSendInfo({ messageId: json.messageId }); }
      else { setSendState("error"); setSendInfo({ error: json.error, hint: json.hint }); }
    } catch (e: any) { setSendState("error"); setSendInfo({ error: String(e?.message || e) }); }
  };
  // Send through the LOCAL classic Outlook (COM) — no SMTP, no password; uses Outlook's
  // signed-in ETH session, so the M365 basic-auth 535 block doesn't apply.
  const sendViaOutlook = async () => {
    if (!effEmail || !effEmail.to) return;
    setSendState("sending"); setSendInfo(null);
    try {
      const res = await fetch("/__send-outlook", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: effEmail.to, subject: effEmail.subject, body: effEmail.body, from: outlookFrom.trim() || undefined }),
      });
      const json = await res.json();
      if (json.ok && json.sent) { setSendState("sent"); setSendInfo({ messageId: json.from ? `via Outlook · ${json.from}` : "via Outlook" }); }
      else { setSendState("error"); setSendInfo({ error: json.error, hint: json.hint }); }
    } catch (e: any) { setSendState("error"); setSendInfo({ error: String(e?.message || e) }); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: C.scrim, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ position: "absolute", inset: 16, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14,
        color: C.text, boxShadow: "0 12px 48px rgba(17,18,20,0.18)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* HEADER — gallery nav over the published queue */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          padding: "12px 18px", borderBottom: `1px solid ${C.line}`, background: C.panel, flex: "0 0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontWeight: 800, fontSize: "0.98rem" }}>📤 Versand</span>
            <span style={{ fontFamily: mono, fontSize: "0.68rem", color: C.dim }}>
              {slugs.length ? idx + 1 : 0} / {slugs.length} veröffentlicht · {sentSlugs.size} versendet
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={prev} disabled={idx <= 0} style={{ ...btn("ghost"), padding: "7px 12px", opacity: idx <= 0 ? 0.4 : 1 }} title="Vorheriger (←)">‹</button>
            <button onClick={next} disabled={idx + 1 >= slugs.length} style={{ ...btn("ghost"), padding: "7px 12px", opacity: idx + 1 >= slugs.length ? 0.4 : 1 }} title="Nächster (→)">›</button>
            <button onClick={refresh} style={btn("ghost")} title="Liste neu laden (für gerade fertig deployte Sites)">↻ Aktualisieren</button>
            <button onClick={onClose} style={{ ...btn("ghost"), padding: "8px 10px" }}>Schliessen ✕</button>
          </div>
        </div>

        {slugs.length === 0 ? (
          <div style={{ flex: 1, display: "grid", placeItems: "center", color: C.dim, fontFamily: mono, fontSize: "0.85rem", textAlign: "center", padding: 24 }}>
            Noch keine veröffentlichten Sites.<br />Im „Durchwinken & Veröffentlichen"-Cockpit eine Site veröffentlichen — sie erscheint hier, sobald das Deploy fertig ist (↻ Aktualisieren).
          </div>
        ) : (
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

            {/* LEFT — the published queue */}
            <div style={{ width: 240, flex: "0 0 auto", borderRight: `1px solid ${C.line}`, background: C.panel, overflowY: "auto", padding: "10px 8px" }}>
              {slugs.map((s, i) => (
                <button key={s} onClick={() => setIdx(i)} style={{
                  width: "100%", textAlign: "left", border: "none", cursor: "pointer", borderRadius: 8,
                  padding: "9px 10px", marginBottom: 2, fontFamily: mono, fontSize: "0.74rem",
                  background: i === idx ? "#eef2ff" : "transparent", color: C.text,
                  display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: sentSlugs.has(s) ? C.ok : C.dim }}>{sentSlugs.has(s) ? "✓" : "•"}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{manifest[s].firm || s}</span>
                </button>
              ))}
            </div>

            {/* CENTER — live preview of the deployed prototype */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "#1a1c20" }}>
              <div style={{ flex: "0 0 auto", padding: "7px 14px", borderBottom: `1px solid ${C.line}`, fontFamily: mono, fontSize: "0.68rem", color: "#cbd5e1", display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span>{rec?.firm || slug}</span>
                <a href={liveUrl} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", wordBreak: "break-all" }}>{liveUrl} ↗</a>
              </div>
              <div style={{ flex: 1, background: "#fff" }}>
                {liveUrl && <iframe key={liveUrl} src={liveUrl} title={slug} style={{ width: "100%", height: "100%", border: "none" }} />}
              </div>
            </div>

            {/* RIGHT — draft + send */}
            <div style={{ width: 380, flex: "0 0 auto", borderLeft: `1px solid ${C.line}`, background: C.panel, overflowY: "auto", padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {loadingFirm || !effEmail ? (
                <div style={{ color: C.dim, fontFamily: mono, fontSize: "0.78rem", paddingTop: 8 }}>Entwurf wird geladen …</div>
              ) : (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>Empfänger</span>
                      <button type="button" onClick={toggleTest} title="Solange AN gehen alle Mails an dich, nicht an den Kunden"
                        style={{ ...btn(testMode ? "accent" : "ghost"), padding: "5px 10px", fontSize: "0.66rem" }}>
                        {testMode ? "🧪 Test: an mich" : "An Kunde senden"}
                      </button>
                    </div>
                    {testMode ? (
                      <div style={{ border: `1px solid ${C.accent}`, borderRadius: 8, padding: "8px 10px", background: "rgba(245,179,1,0.10)", fontFamily: mono }}>
                        <div style={{ fontSize: "0.74rem", color: C.text }}>→ Versand an <b>{TEST_RECIPIENT}</b></div>
                        <div style={{ fontSize: "0.64rem", color: C.dim, marginTop: 2 }}>Kunde wäre: {recipient || "—"}</div>
                      </div>
                    ) : (
                      <input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="kontakt@firma.ch" style={{ ...inputStyle, borderColor: recipient ? C.line : C.bad }} />
                    )}
                  </div>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>Betreff</span>
                    <input value={email!.subject} onChange={(e) => setEmail({ ...email!, subject: e.target.value })} style={inputStyle} />
                  </label>
                  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>Text</span>
                    <textarea value={email!.body} onChange={(e) => setEmail({ ...email!, body: e.target.value })} rows={11} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.55 }} />
                  </label>
                  {/* Versandart: lokales Outlook (Default) vs SMTP */}
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => setMethod("outlook")} style={{ ...btn(sendMethod === "outlook" ? "primary" : "ghost"), flex: 1, fontSize: "0.7rem", padding: "7px 8px" }}>📧 Outlook (lokal)</button>
                    <button type="button" onClick={() => setMethod("smtp")} style={{ ...btn(sendMethod === "smtp" ? "primary" : "ghost"), flex: 1, fontSize: "0.7rem", padding: "7px 8px" }}>SMTP</button>
                  </div>
                  {sendMethod === "outlook" && (
                    <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", background: C.field, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ fontSize: "0.66rem", color: C.text, fontFamily: mono, lineHeight: 1.5 }}>
                        Sendet über dein lokales <b>klassisches Outlook</b> — moderne Auth, kein Passwort. Umgeht die SMTP-535-Sperre.
                      </div>
                      <input value={outlookFrom} onChange={(e) => saveCred("outlookFrom", e.target.value, setOutlookFrom)} placeholder="Absender-Konto (leer = Outlook-Standardkonto)" autoComplete="off" style={inputStyle} />
                      <div style={{ fontSize: "0.62rem", color: C.dim, fontFamily: mono, lineHeight: 1.5 }}>
                        Outlook muss geöffnet & beim ETH-Konto angemeldet sein. Evtl. einmalige Sicherheitsabfrage in Outlook bestätigen.
                      </div>
                    </div>
                  )}
                  {sendMethod === "smtp" && (
                  <div style={{ border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", background: C.field, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "0.66rem", color: C.dim, fontFamily: mono }}>SMTP-Zugang (nur in diesem Browser)</span>
                      {(smtpUser || smtpPass) && <span style={{ fontSize: "0.62rem", color: C.ok, fontFamily: mono }}>✓ gemerkt</span>}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {PROVIDERS.map((p) => (
                        <button key={p.label} type="button" onClick={() => applyProvider(p.host, p.port)}
                          style={{ ...btn(smtpHost === p.host ? "primary" : "ghost"), padding: "5px 9px", fontSize: "0.64rem" }}>{p.label}</button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input value={smtpHost} onChange={(e) => saveCred("smtpHost", e.target.value, setSmtpHost)} placeholder="smtp.server.ch" autoComplete="off" style={{ ...inputStyle, flex: 1 }} />
                      <input value={smtpPort} onChange={(e) => saveCred("smtpPort", e.target.value, setSmtpPort)} placeholder="587" inputMode="numeric" style={{ ...inputStyle, width: 64, flex: "0 0 auto" }} />
                    </div>
                    <input value={smtpUser} onChange={(e) => saveCred("ethSmtpUser", e.target.value, setSmtpUser)} placeholder="Login (z.B. name@ethz.ch / name@gmail.com)" autoComplete="username" style={inputStyle} />
                    <input value={smtpPass} onChange={(e) => saveCred("ethSmtpPass", e.target.value, setSmtpPass)} placeholder="Passwort / App-Passwort" type="password" autoComplete="current-password" style={inputStyle} />
                    <input value={smtpFrom} onChange={(e) => saveCred("smtpFrom", e.target.value, setSmtpFrom)} placeholder="Absender (leer = Login-Adresse)" autoComplete="off" style={inputStyle} />
                    <input value={smtpReplyTo} onChange={(e) => saveCred("smtpReplyTo", e.target.value, setSmtpReplyTo)} placeholder="Antwort-an (optional, z.B. oliver@fam-glaeser.de)" autoComplete="off" style={inputStyle} />
                    <div style={{ fontSize: "0.62rem", color: C.dim, fontFamily: mono, lineHeight: 1.5 }}>
                      ETH/M365 blockt Basic-Auth (535) → App-Passwort nutzen oder auf Gmail/eigene Domain wechseln.
                    </div>
                  </div>
                  )}
                  {sendState !== "sent" && (() => {
                    const smtpReady = !!smtpUser.trim() && !!smtpPass;
                    const disabled = !effectiveTo || sendState === "sending" || (sendMethod === "smtp" && !smtpReady);
                    const label = sendState === "sending" ? "📤 Sendet …"
                      : sendMethod === "outlook" ? (testMode ? "🧪 Test an mich über Outlook" : "📧 Über Outlook senden")
                      : (testMode ? "🧪 Test an mich (SMTP)" : "📤 Über SMTP senden");
                    return (
                      <button onClick={sendMethod === "outlook" ? sendViaOutlook : sendViaEth} disabled={disabled}
                        style={{ ...btn("ok"), width: "100%", opacity: disabled ? 0.6 : 1 }}>
                        {label}
                      </button>
                    );
                  })()}
                  {sendState === "sent" && (
                    <div style={{ border: `1px solid ${C.ok}`, borderRadius: 10, padding: "10px 12px", background: "rgba(22,163,74,0.08)" }}>
                      <div style={{ color: C.ok, fontWeight: 700, fontSize: "0.8rem" }}>✓ Gesendet an {effEmail.to}</div>
                      {sendInfo?.messageId && <div style={{ fontFamily: mono, fontSize: "0.64rem", color: C.dim, marginTop: 4, wordBreak: "break-all" }}>{sendInfo.messageId}</div>}
                      {idx + 1 < slugs.length && <button onClick={next} autoFocus style={{ ...btn("primary"), width: "100%", marginTop: 10 }}>→ Nächste Site · {manifest[slugs[idx + 1]].firm || slugs[idx + 1]}</button>}
                    </div>
                  )}
                  {sendState === "error" && (
                    <div style={{ border: `1px solid ${C.bad}`, borderRadius: 10, padding: "10px 12px", background: "rgba(220,38,38,0.06)" }}>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
