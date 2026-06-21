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
import type { PrimaryStyle } from "../structures/primitives";

/** The frozen variant choices for one approved lead. `undefined` = "auto" (the
 *  selector picks deterministically from the seed), mirroring the studio controls. */
export interface PublishedPlan {
  seed: number;
  lookId?: string;
  heroId?: string;
  primaryStyle?: PrimaryStyle;
  kitId?: string;
  sectionOverrides?: Record<string, string>;
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

/**
 * Draft the cold-outreach mail (German, Swiss orthography — "ss", not "ß").
 * Variante 1: this is the operator's real template (Oliver Gläser) with the live
 * prototype link templated in — still a STARTING POINT to personalise per firm
 * (the niche line + recipient are edited in the overlay before sending).
 */
export function buildOutreachEmail(content: SiteContent, prototypeUrl: string): OutreachEmail {
  const firm = content.meta.firm || content.meta.domain || "Ihr Unternehmen";
  const to = recipientFor(content) ?? "";
  const subject = `Moderner Website-Entwurf für ${firm}`;
  const body = [
    `Guten Tag,`,
    ``,
    `Mein Name ist Oliver Gläser, ich studiere an der ETH Zürich und entwickle nebenbei Webauftritte für lokale Unternehmen.`,
    ``,
    `Auf Ihre Website bin ich im Zuge einer Recherche zu spezialisierter Steuerberatung im Bereich Deutschland-Schweiz gestossen. Dabei habe ich aus eigener Initiative einen Prototypen für eine modernisierte Website Ihrer Kanzlei erstellt – mit einem frischen, professionellen und vertrauenswürdigen Erscheinungsbild, das die Kompetenz Ihrer Beratung widerspiegelt. Sie finden den Entwurf hier:`,
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
