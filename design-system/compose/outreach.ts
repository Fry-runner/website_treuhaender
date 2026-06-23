/**
 * Outreach plumbing for the "Durchwinken & Versenden" flow.
 *
 * A reviewer approves the currently-previewed firm in the Variant Studio; the
 * frozen variant choices become a `PublishedRecord`, the single Vercel project is
 * (re)deployed, and the prototype goes live under `/p/<slug>`. This module is the
 * framework-agnostic core shared by the overlay (writes the record, drafts the
 * mail) and the prototype route (reads the record to render the frozen plan).
 *
 * E-Mail policy = Variante 1 from docs/outreach-pipeline.md: we only ever DRAFT
 * the message; the operator personalises and sends it from their own mailbox.
 * Cold mail to scraped CH/EU addresses is sensitive (UWG Art. 3 lit. o, DSG/DSGVO)
 * — the draft therefore stays factual, 1:1 in character, and carries a one-line
 * opt-out, never a mass-mailing tone.
 */
import type { SiteContent } from "../content/types";
import type { PrimaryStyle, MoreStyle } from "../structures/primitives";
import type { MotionStyleId } from "../motion/motionStyle";

/** The frozen variant choices for one approved lead. `undefined` = "auto" (the
 *  selector picks deterministically from the seed), mirroring the studio controls. */
export interface PublishedPlan {
  seed: number;
  lookId?: string;
  heroId?: string;
  primaryStyle?: PrimaryStyle;
  kitId?: string;
  sectionOverrides?: Record<string, string>;
  /** Per-element variant picks (else auto): subpage header · icon set · forward-link
   *  style · motion family. */
  pageHeaderId?: string;
  iconSetId?: string;
  moreStyle?: MoreStyle;
  motionStyle?: MotionStyleId;
  /** Cold-acquisition mode — strips logo/badges/portraits/real photos before hosting. */
  pitch: boolean;
  /** Re-rolls the imagery only (stock picks in pitch, photo-pool rotation in real mode). */
  imageSeed?: number;
}

export interface OutreachEmail {
  to: string;
  subject: string;
  body: string;
}

export interface PublishedRecord extends PublishedPlan {
  slug: string;
  firm: string;
  domain: string;
  sourceUrl?: string;
  contactEmail?: string;
  /** Full public URL of the prototype, e.g. https://<project>.vercel.app/p/<slug>. */
  prototypeUrl?: string;
  approvedAt: string;
  email?: OutreachEmail & { status: "drafted" | "sent"; sentAt?: string };
}

/** slug → record. Lives at design-system/public/published.json (served at /published.json). */
export type PublishedManifest = Record<string, PublishedRecord>;

/** Pull the frozen plan back out of a record (drops the bookkeeping fields). */
export function planFromRecord(r: PublishedRecord): PublishedPlan {
  return {
    seed: r.seed,
    lookId: r.lookId,
    heroId: r.heroId,
    primaryStyle: r.primaryStyle,
    kitId: r.kitId,
    sectionOverrides: r.sectionOverrides,
    pitch: r.pitch,
  };
}

/** Best-effort recipient: the contact mail recovered by the scrape/extract. */
export function recipientFor(content: SiteContent): string | undefined {
  return content.contact?.info?.email?.trim() || undefined;
}

/** Deterministic per-firm hash (FNV-1a) → stable phrasing picks; same firm always
 *  yields the same mail, different firms differ. */
const genHash = (s: string): number => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
// Callers seed the rotation with signed shifts (`h >> 5`), which go NEGATIVE when the
// hash's top bit is set — a raw `h % len` would then index out of range and yield
// `undefined` (the "…Website undefined erstellt – undefined" bug). Normalise to a
// non-negative index so every caller is safe regardless of sign.
const pick = <T>(arr: T[], h: number): T => arr[((h % arr.length) + arr.length) % arr.length];

/** Best-effort city from the scraped contact address ("8000 Zürich", "Zürich-Glattbrugg"
 *  → "Zürich"). Returns undefined when nothing clean is recoverable (then no city is named). */
function cityFrom(content: SiteContent): string | undefined {
  const a = content.contact?.info?.address?.trim();
  if (!a) return undefined;
  const plz = a.match(/\b\d{4}\s+([A-Za-zÄÖÜäöü.\-\s]+)$/);
  let city = (plz ? plz[1] : a.split(",").pop() || a).replace(/^\d{4}\s+/, "").trim();
  if (city.includes("-")) city = city.split("-")[0].trim();
  if (!city || /\d/.test(city) || city.length < 2 || city.length > 24) return undefined;
  return city;
}

/**
 * Draft the cold-outreach mail (German, Swiss orthography — "ss", not "ß").
 * Variante 1: the operator's real template (Oliver Gläser) with the live link
 * templated in AND lightly personalised per firm from REAL scrape data — city,
 * firm wording, and a deterministic phrasing rotation so two mails never read
 * identically (less "mass mail", which is also the safer 1:1 character). The
 * Deutschland-Schweiz angle appears ONLY when the scrape actually mentions it;
 * otherwise a neutral, true-for-any-Treuhänder line is used. Still a STARTING
 * POINT — recipient and wording stay editable in the overlay before sending.
 */
export function buildOutreachEmail(content: SiteContent, prototypeUrl: string): OutreachEmail {
  const firm = content.meta.firm || content.meta.domain || "Ihr Unternehmen";
  const to = recipientFor(content) ?? "";
  const subject = `Moderner Website-Entwurf für ${firm}`;

  const h = genHash(content.meta.domain || firm);
  const city = cityFrom(content);
  const cityPhrase = city ? ` in ${city}` : "";
  // Scan only the copy fields (not the media pool) for a real cross-border focus.
  const corpus = JSON.stringify({ h: content.hero, a: content.about, s: content.services, f: content.faq, m: content.meta?.brief }).toLowerCase();
  const crossBorder = /deutschland|grenzüberschreit|grenzgänger|wegzug|zuzug|d-a-ch|deutsch-schweiz/.test(corpus);
  // "Kanzlei" only for firms that actually position as a tax/law practice — judged by
  // NAME/domain, not by having "Steuerberatung" in the (universal) service list.
  const lawish = /steuerberat|kanzlei|anwalt|advoka|rechtsber/.test((firm + " " + (content.meta.domain || "")).toLowerCase());

  const context = crossBorder
    ? `Auf Ihre Website bin ich im Zuge einer Recherche zu Steuer- und Treuhandberatung im Bereich Deutschland-Schweiz gestossen.`
    : pick([
        `Auf Ihre Website bin ich bei einer Recherche zu Treuhand- und Steuerdienstleistungen${cityPhrase} gestossen.`,
        `Auf der Suche nach Treuhandbüros${cityPhrase} ist mir Ihre Website aufgefallen.`,
        `Bei einer Recherche zu Treuhand- und Steuerberatung${cityPhrase} bin ich auf Ihren Auftritt gestossen.`,
      ], h);
  // Accusative forms — the template reads "… Website für ${firmRef} …" (für + Akkusativ).
  const firmRef = lawish ? "Ihre Kanzlei" : pick(["Ihr Treuhandbüro", "Ihr Unternehmen", "Ihre Firma"], h >> 5);
  const descriptor = pick([
    `mit einem frischen, professionellen und vertrauenswürdigen Erscheinungsbild, das die Kompetenz Ihrer Arbeit widerspiegelt`,
    `modern, klar und vertrauenswürdig gestaltet`,
    `mit einem ruhigen, hochwertigen Auftritt, der Seriosität ausstrahlt`,
  ], h >> 3);

  const body = [
    `Guten Tag,`,
    ``,
    `Mein Name ist Oliver Gläser, ich studiere an der ETH Zürich und entwickle nebenbei Webauftritte für lokale Unternehmen.`,
    ``,
    `${context} Dabei habe ich aus eigener Initiative einen Prototypen für eine modernisierte Website für ${firmRef} erstellt – ${descriptor}. Sie finden den Entwurf hier:`,
    ``,
    prototypeUrl,
    ``,
    `Als Student kann ich Ihnen eine solche Website zu einem Bruchteil der üblichen Agenturpreise anbieten – selbstverständlich ohne Abstriche bei der Qualität. Gerne stelle ich Ihnen bei Interesse auch den Kontakt zu früheren Kunden her, für die ich bereits Projekte umgesetzt habe.`,
    ``,
    `Ich würde mich freuen, den Prototypen kurz ganz unverbindlich mit Ihnen zu besprechen – per Telefon, Video-Call oder persönlich in Zürich.`,
    ``,
    `Mit freundlichen Grüssen`,
    `Oliver Gläser`,
    `+41 78 447 51 75`,
    `oliver@fam-glaeser.de`,
  ].join("\n");
  return { to, subject, body };
}

/** A `mailto:` URI that opens the draft in the operator's own mail client. */
export function mailtoHref(mail: OutreachEmail): string {
  const q = new URLSearchParams({ subject: mail.subject, body: mail.body });
  return `mailto:${encodeURIComponent(mail.to)}?${q.toString()}`;
}

/** RFC-822 .eml so the draft can be saved / dragged into any mail app. */
export function emlContent(mail: OutreachEmail): string {
  // Encode the (likely UTF-8, multi-line) body as base64 so umlauts and newlines
  // survive any mail client. Subject is RFC-2047 encoded-word for the same reason.
  const b64 = (s: string): string => {
    const bytes = new TextEncoder().encode(s);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    const raw = (typeof btoa !== "undefined" ? btoa(bin) : Buffer.from(s, "utf-8").toString("base64"));
    return raw.replace(/.{1,76}/g, "$&\r\n").trimEnd();
  };
  const subj = `=?UTF-8?B?${(typeof btoa !== "undefined" ? btoa(unescape(encodeURIComponent(mail.subject))) : Buffer.from(mail.subject, "utf-8").toString("base64"))}?=`;
  return [
    `To: ${mail.to}`,
    `Subject: ${subj}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
    ``,
    b64(mail.body),
    ``,
  ].join("\r\n");
}
