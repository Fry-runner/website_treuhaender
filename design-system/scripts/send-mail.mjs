/**
 * send-mail.mjs — sends ONE outreach mail through the operator's ETH mailbox.
 *
 * Called by the dev endpoint POST /__send (see vite.config.ts). Reads the draft on
 * stdin and relays it via authenticated SMTP (ETH = Microsoft 365 / Exchange Online,
 * smtp.office365.com:587 STARTTLS). Variante 1 stays the default elsewhere; this is
 * the opt-in "Direkt über ETH senden" path the operator explicitly enabled.
 *
 * ⚠ Microsoft disables SMTP AUTH by default in M365 and ETH enforces MFA. If the
 * mailbox does not permit SMTP AUTH this fails with a 535 auth error — the overlay
 * then falls back to the manual draft. To make it work either ETH-IT must enable
 * "Authenticated SMTP" for the mailbox, or an app/device password must be used.
 *
 * Credentials come from (in order): the request's `auth` object (entered once in
 * the overlay, kept only in the operator's browser) → env → design-system/.env
 * (gitignored), never the repo:
 *   ETH_SMTP_USER   login (usually the full ETH address)         [required]
 *   ETH_SMTP_PASS   ETH password or app-/device-password         [required]
 *   ETH_SMTP_FROM   From address (default = ETH_SMTP_USER)
 *   ETH_SMTP_HOST   default smtp.office365.com
 *   ETH_SMTP_PORT   default 587 (STARTTLS)
 *   ETH_SMTP_REPLYTO optional Reply-To (e.g. oliver@fam-glaeser.de)
 *
 * Input  (stdin JSON): { to, subject, body, auth?: { user, pass, from?, host?, port?, replyTo? } }
 * Output (stdout JSON): { ok, sent?, messageId?, accepted?, error?, hint? }
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** process.env wins; otherwise pull the key out of design-system/.env (KEY=VALUE). */
function envFile() {
  const f = join(ROOT, ".env");
  if (!existsSync(f)) return {};
  const out = {};
  for (const line of readFileSync(f, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}
const FILE = envFile();
const cfg = (k) => (process.env[k] ?? FILE[k] ?? "").trim();

function readStdin() {
  return new Promise((resolve) => {
    let d = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (c) => (d += c));
    process.stdin.on("end", () => resolve(d));
    if (process.stdin.isTTY) resolve("");
  });
}

async function main() {
  const raw = await readStdin();
  let input;
  try { input = JSON.parse(raw || "{}"); } catch { input = {}; }
  const to = String(input.to || "").trim();
  const subject = String(input.subject || "").trim();
  const body = String(input.body || "");
  if (!to || !subject || !body) { console.log(JSON.stringify({ ok: false, error: "to, subject und body sind erforderlich" })); return; }

  // Credentials: request `auth` (entered in the overlay) wins, else env/.env.
  const a = input.auth && typeof input.auth === "object" ? input.auth : {};
  const pick = (reqVal, envKey) => (String(reqVal ?? "").trim() || cfg(envKey));
  const user = pick(a.user, "ETH_SMTP_USER");
  const pass = String(a.pass ?? "").trim() || cfg("ETH_SMTP_PASS");
  if (!user || !pass) {
    console.log(JSON.stringify({
      ok: false,
      error: "Keine ETH-Zugangsdaten.",
      hint: "ETH-Adresse + Passwort im Overlay eintragen (werden nur in deinem Browser gespeichert) — oder design-system/.env mit ETH_SMTP_USER/ETH_SMTP_PASS.",
    }));
    return;
  }

  const host = pick(a.host, "ETH_SMTP_HOST") || "smtp.office365.com";
  const port = Number(pick(a.port, "ETH_SMTP_PORT") || "587");
  const from = pick(a.from, "ETH_SMTP_FROM") || user;
  const replyTo = pick(a.replyTo, "ETH_SMTP_REPLYTO") || undefined;

  const transport = nodemailer.createTransport({
    host, port,
    secure: port === 465,   // 465 = implicit TLS; 587 = STARTTLS
    requireTLS: port !== 465,
    auth: { user, pass },
  });

  try {
    const info = await transport.sendMail({ from, to, subject, text: body, replyTo });
    console.log(JSON.stringify({ ok: true, sent: true, messageId: info.messageId, accepted: info.accepted, from, to }));
  } catch (e) {
    // Surface the most common M365 cause so the overlay can guide the operator.
    const msg = String(e?.message || e);
    const authBlocked = /SmtpClientAuthentication is disabled|5\.7\.139|535|SMTP AUTH|basic authentication is disabled/i.test(msg);
    console.log(JSON.stringify({
      ok: false, sent: false, error: msg,
      hint: authBlocked
        ? "ETH/M365 blockiert Basic-SMTP-Auth (MFA/Conditional Access) für dieses Postfach. Optionen: (1) App-Passwort unter https://mysignins.microsoft.com/security-info erstellen und hier statt des Passworts eintragen; (2) im Overlay einen anderen SMTP-Server wählen — Gmail mit App-Passwort (smtp.gmail.com) oder dein eigenes fam-glaeser.de-Postfach; (3) ETH-IT bitten, „Authenticated SMTP\" zu aktivieren. Bis dahin: manueller Versand (.eml/Mail-App)."
        : "Versand fehlgeschlagen. SMTP-Server/Port/Login im Overlay prüfen (Gmail & Co. brauchen ein App-Passwort, nicht das normale Passwort).",
    }));
  }
}

main();
