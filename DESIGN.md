# Design

Visual system for the Treuhänder site generator (`design-system/`). The system is **multi-preset by design**: one scraped firm is dressed in a coherent modern look, never a single global skin. Source of truth: `design-system/tokens.ts` (presets), `design-system/looks/*` (derivation), `design-system/variants/*` (selection).

## Theme

Modern Swiss professional. Light neutral systems carry 7 of 8 presets; one dark preset (`dark-premium`) for bold positioning. The mood per site is set by the chosen **preset** (design language) + **kit** (palette × type × shape combo) + the firm's **scraped or generated accent**. Coherence within a site is absolute; variety lives *across* firms.

## Color

**Strategy:** Restrained-to-Committed. A light neutral system from the preset + one (sometimes two) saturated accents. The accent comes from the **scrape** when it's clearly the brand (sufficient saturation, not near-white, confidence ≥ medium); otherwise it's **generated** deterministically per firm from a curated Treuhand-appropriate palette (finance navy/blue/steel, petrol/teal/emerald/forest, plus heritage burgundy/wine/bronze/terracotta). Accents are tinted in with `ensureContrast` (≥3.2:1 vs bg).

**Neutral systems (per preset, bg / surface / text / textMuted):**

| Preset | bg | surface | text | textMuted (raw) |
|---|---|---|---|---|
| boost-editorial | `#FFFFFF` | `#F8FAFC` | `#0F172A` | `#94A3B8` |
| ruerup-swiss | `#FFFFFF` | `#E5E7EB` | `#1C1C1A` | `#71717A` |
| tureva-soft | `#FFFFFF` | `#F0F2F4` | `#2D3136` | `#828E99` |
| uds-warm-editorial | `#FAF9F6` | `#FFFFFF` | `#1C1C1A` | `#8A8782` |
| swiss-clean | `#FFFFFF` | `#F2F7F8` | `#0E2A33` | `#5B7682` |
| quabba-editorial | `#FFFFFF` | `#F7F8F8` | `#22272B` | `#7C868C` |
| zueri-swiss | `#FFFFFF` | `#F9FAFB` | `#333333` | `#737373` |
| dark-premium | `#0B0C0E` | `#15171A` | `#F3F5F7` | `#9BA3AE` |

**Contrast rule (enforced):** `applyLook` raises `--ds-text-muted` to **≥4.5:1** against the harder of bg/surface at render time. The raw `textMuted` values above are inputs; the emitted variable is always AA-legible (e.g. boost `#94A3B8` → `#5C6F8A`). Do not hand-pick muted greys that assume the raw value ships verbatim.

## Typography

**Inventory-driven, deterministic per firm.** A firm's real faces are adopted only when the scrape recovers a recognised quality web font; otherwise `pickPairing` (`looks/fontPairings.ts`) picks a varied pairing so two firms don't collapse onto the same type. Mono is never a brand signal — always from the inventory, used for micro-labels.

**Heading roles (measured across 50 generated firms):**

- `display-grotesk` — 66% (Familjen Grotesk, Sora, Space Grotesk, Hanken/Schibsted Grotesk, Bricolage, …)
- `display-geometric` — 22%
- `serif-editorial` — 12% (deliberately a minority; the editorial lane is one option, not the default)

**Scale:** fluid `clamp()` display headings, `displayMax` 5xl–7xl per preset; headline weight medium–bold; body weight light–medium; eyebrow = uppercase, wide/widest tracking. Pair on a contrast axis (grotesk/geometric body vs serif headline); never two near-identical sans.

## Layout & Spacing

- Container max `1200–1280px`; gutter `1.5rem`.
- Vertical rhythm `sectionY` `py-12` → `py-28` per preset; airy by default. Vary spacing for rhythm, not a uniform stride.
- Responsive grids: `repeat(auto-fit, minmax(280px, 1fr))` where cards are the right affordance.
- Hero `image-full` (overlaid headline on a real photo) is a canonical strong move; 27 hero variants total.

## Shape & Elevation

- Radius `base` ranges `sm` (sharp/Swiss) → `2xl` (soft/friendly) per preset; pill = `9999px`.
- Elevation flat → soft; card shadows `none`/`sm`/`md`. Sharp+flat reads Swiss-corporate; soft+shadow reads friendly-premium.

## Motion

- `durationMs` 200–600, easing per preset (mostly ease-out cubic-beziers), `intensity` subtle/expressive.
- Scroll-reveal distance/duration scale with intensity (`--ds-reveal-dist`, `--ds-reveal-dur`). Reveals must enhance already-visible content, never gate it.

## Components (structure layer)

Token-only React structures that re-skin purely from `--ds-*` vars: Nav, Hero (×27 variants), Services (×23), Testimonials (×22), CTA, Values, Stats, Team, FAQ, Pricing, TrustBar, Contact, Footer, SectionHead, PageHeader, ServiceBody. `kits` bundle coherent palette×type×shape combinations; `planSite` (`variants/select.ts`) picks one coherent combo (palette × hero × button × per-section variant) per seed. Sections carry their own forward/CTA link internally (no separate CTA band).

## Token Contract

`applyLook(tokens)` emits a flat `--ds-*` map onto a wrapper; every structure beneath reads from it, so multiple looks coexist on one page (the playground proof). Key variables: `--ds-bg`, `--ds-surface`, `--ds-text`, `--ds-text-muted` (AA-enforced), `--ds-border`, `--ds-primary` / `-fg` / `-soft`, `--ds-secondary`, `--ds-font-body` / `-heading` / `-mono`, `--ds-display`, `--ds-headline-weight` / `-tracking`, `--ds-eyebrow-*`, `--ds-radius` / `-pill`, `--ds-shadow-card`, `--ds-section-y`, `--ds-container`, `--ds-gutter`, `--ds-duration`, `--ds-ease`, `--ds-reveal-dist` / `-dur`.
