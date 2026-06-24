/**
 * Icon sets — a style axis, exactly like button styles or the colour/font tokens.
 * =============================================================================
 * The generator picks ONE icon set per firm (compatible with the brand's look
 * affinity / style kit), supplies it via React context, and any structure draws
 * icons through <Icon name="…"/> or useIconSet() — so every icon on a site shares
 * one coherent visual language, and two firms get different icon styling.
 *
 * Design: a single shared library of icon GEOMETRY (ICON_PATHS, 24×24, drawn with
 * `currentColor`) is rendered under the active set's stroke parameters (weight +
 * cap + join). That keeps every icon on-brand and consistent while letting the
 * set vary the personality (hairline editorial · rounded friendly · squared
 * precise · bold). Filled glyphs (star, quote) opt out of stroking so they read
 * the same across sets. Add a new set by adding stroke params; add a new icon by
 * adding one ICON_PATHS entry — every set then renders it.
 *
 * Used like buttons: <IconSetProvider value={set}> at the top of a composed site
 * (mirrors PrimaryStyleProvider); useIconSet() defaults to "line" with no
 * provider, so <Icon> works anywhere.
 */
import React from "react";
import type { StyleAffinity } from "../component-inventory.ts";

/** Semantic icon slots structures can request. Extend as consumers need more. */
export type IconName =
  | "check" | "arrowRight" | "arrowUpRight" | "chevronRight" | "chevronDown"
  | "plus" | "minus" | "star" | "quote" | "phone" | "mail" | "location"
  | "clock" | "document" | "download" | "menu" | "close";

/** Icon geometry (shared across all sets). Strokes inherit the set's params from
 *  the parent <svg>; filled marks set their own fill/stroke so they stay filled. */
export const ICON_PATHS: Record<IconName, React.ReactNode> = {
  check:        <path d="M4 12.5l5 5L20 6.5" />,
  arrowRight:   <path d="M4 12h15M13 5l7 7-7 7" />,
  arrowUpRight: <path d="M7 17L17 7M8.5 7H17v8.5" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  chevronDown:  <path d="M5 9l7 7 7-7" />,
  plus:         <path d="M12 5v14M5 12h14" />,
  minus:        <path d="M5 12h14" />,
  star:         <path fill="currentColor" stroke="none" d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.9 6.1 21l1.1-6.5L2.5 9.4l6.5-.9z" />,
  quote:        <path fill="currentColor" stroke="none" d="M10 7H4v7h4l-2 4h3l2-4V7zm10 0h-6v7h4l-2 4h3l2-4V7z" />,
  phone:        <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 005.5 5.5l1.5-2 4 1.5v3a2 2 0 01-2 2C10.5 22 2 13.5 2 5.5a2 2 0 012-2z" />,
  mail:         <><path d="M3.5 5.5h17v13h-17z" /><path d="M3.5 6.5l8.5 6 8.5-6" /></>,
  location:     <><path d="M12 21s6.5-5.2 6.5-10.5a6.5 6.5 0 10-13 0C5.5 15.8 12 21 12 21z" /><circle cx="12" cy="10.5" r="2.4" /></>,
  clock:        <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5.2l3.3 2" /></>,
  document:     <><path d="M6.5 3.5h8l3.5 3.5V20.5h-11.5z" /><path d="M14 3.5V8h4" /></>,
  download:     <path d="M12 3.5v10M8 10l4 4 4-4M5 19.5h14" />,
  menu:         <path d="M4 7h16M4 12h16M4 17h16" />,
  close:        <path d="M6 6l12 12M6 18L18 6" />,
};

export interface IconSet {
  id: string;
  /** Brand look affinities this set suits — used to pick a set per firm. */
  looks: StyleAffinity[];
  strokeWidth: number;
  linecap: "round" | "butt" | "square";
  linejoin: "round" | "miter" | "bevel";
  /** Optional wider, faint underlay drawn behind the icon — a duotone / soft-glow
   *  effect on the SAME geometry (no extra paths needed). */
  underlay?: { width: number; opacity: number };
  note?: string;
}

/** The inventory. Visually distinct via weight + cap/join (+ optional duotone
 *  underlay), all on one shared geometry. */
export const ICON_SETS: IconSet[] = [
  { id: "hairline",  looks: ["editorial", "warm"],   strokeWidth: 1.25, linecap: "square", linejoin: "miter", note: "very fine, squared — editorial/boutique" },
  { id: "line",      looks: ["swiss", "editorial"],  strokeWidth: 1.75, linecap: "round",  linejoin: "round", note: "neutral default line" },
  { id: "geometric", looks: ["swiss", "soft"],       strokeWidth: 2,    linecap: "square", linejoin: "miter", note: "precise, squared — swiss/tech" },
  { id: "bold",      looks: ["soft", "warm"],        strokeWidth: 2.5,  linecap: "round",  linejoin: "round", note: "chunky, friendly — soft/playful" },
  { id: "duotone",   looks: ["soft", "warm"],        strokeWidth: 1.75, linecap: "round",  linejoin: "round", underlay: { width: 5.5, opacity: 0.16 }, note: "layered soft-glow duotone — premium/playful" },
  { id: "fine-round",looks: ["warm", "soft", "editorial"], strokeWidth: 1.4, linecap: "round", linejoin: "round", note: "delicate but rounded — gentle/boutique" },
  { id: "heavy-square", looks: ["swiss", "soft"],     strokeWidth: 2.75, linecap: "square", linejoin: "miter", note: "heaviest squared — industrial/precise" },
  { id: "beveled",   looks: ["editorial", "swiss"],  strokeWidth: 2,    linecap: "butt",   linejoin: "bevel", note: "cut/beveled joins — technical" },
  { id: "glow",      looks: ["soft", "warm"],        strokeWidth: 2,    linecap: "round",  linejoin: "round", underlay: { width: 7, opacity: 0.2 }, note: "bold soft-glow duotone — premium" },
];

export const iconSetById = (id: string): IconSet => ICON_SETS.find((s) => s.id === id) ?? ICON_SETS[1];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h | 0);
}

/** Pick a set for a firm — within the optional kit-allowed ids, else by affinity.
 *  Deterministic per firm key (+seed); salted so it doesn't track other picks. */
export function pickIconSet(aff: StyleAffinity, firmKey: string, seed = 0, allowed?: string[]): IconSet {
  let pool = ICON_SETS.filter((s) => s.looks.includes(aff) || s.looks.includes("any"));
  if (allowed && allowed.length) {
    const inKit = ICON_SETS.filter((s) => allowed.includes(s.id));
    if (inKit.length) pool = inKit;
  }
  if (!pool.length) pool = ICON_SETS;
  return pool[(hash((firmKey || "x") + "·icons") + (seed | 0)) % pool.length];
}

const IconSetCtx = React.createContext<IconSet>(ICON_SETS[1]); // default: "line"
export const IconSetProvider = IconSetCtx.Provider;
export const useIconSet = (): IconSet => React.useContext(IconSetCtx);

/** Draw a semantic icon in the active set's style. `title` makes it accessible;
 *  otherwise it's decorative (aria-hidden). Colour comes from `currentColor`. */
export const Icon: React.FC<{ name: IconName; size?: number; style?: React.CSSProperties; title?: string }> = ({ name, size = 20, style, title }) => {
  const set = useIconSet();
  const glyph = ICON_PATHS[name];
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={set.strokeWidth} strokeLinecap={set.linecap} strokeLinejoin={set.linejoin}
      style={{ display: "inline-block", flexShrink: 0, ...style }}
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {set.underlay ? <g strokeWidth={set.underlay.width} opacity={set.underlay.opacity}>{glyph}</g> : null}
      {glyph}
    </svg>
  );
};
