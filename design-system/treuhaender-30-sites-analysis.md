# 30 Treuhänder / Accounting Websites — Structure & Visual Analysis

**Purpose:** A diverse reference catalog feeding the design-element inventory (`enrichment.ts` → every `components/**/meta.json`). Focus: *where elements are placed* (buttons, cards) and *how they look* (visual design), each tied to a design language.

**Design languages (the 4 presets in `tokens.ts`):**
`editorial` = serif / navy / airy (Boost) · `swiss` = grotesk / sharp / signal red-green (Rürup) · `soft` = geometric / rounded / vibrant (Tureva) · `warm` = paper / sharp / ink-blue+rose (UdS) · `any` = neutral.

**Method & honesty caveat:** structure and element *placement* are read reliably from page markup; exact hex values, shadow and hover specifics are **inferred** from markup + curated design knowledge (no pixel measurement). For token-exact values, a screenshot/browser pass would confirm. Sites flagged *(thin)* returned limited content.

---

## Tier 1 — Built reference presets (the 4 in-repo templates)
| # | Site | Lang | Buttons | Cards | Hero |
|---|------|------|---------|-------|------|
| 1 | **Boost-Consulting** | editorial | Navy solid + outline; nav-right CTA; mono uppercase + arrow | Hairline divided tiles, icon-in-box, sharp | Serif H1 + decorative SVG panel right |
| 2 | **Steuerberatung Andreas Rürup** | swiss | Signal-red/anthracite solid, rounded-sm; pulse-dot badge | Sharp flat, corner badge + CheckCircle checklist | Left text, pulse-dot, masked grid |
| 3 | **Tureva** | soft | Lime **bloom** pill, scroll-driven highlight; centered hero pair | Rounded-2xl, soft shadow, hover-lift, clickable | Centered max-w-4xl + 2 buttons |
| 4 | **Unter dem Strich** | warm | Ink-blue solid + underline-anim link; signature bar | Sharp hairline cards on paper; telemetry plate | 8/4 text + rose pull-quote aside |

## Tier 2 — Swiss digital fiduciaries
| # | Site | URL | Lang | Buttons (placement + look) | Cards | Hero / standout |
|---|------|-----|------|----------------------------|-------|-----------------|
| 5 | **Nexova** | nexova.ch | soft→editorial | Emerald CTA nav-right + hero "Termin buchen" + "Preisrechner" | 6 service cards w/ **inline 'ab CHF X'**, icon top | Left copy + 3 claim chips + 5.0★/93 badge; interactive 8-city map |
| 6 | **Findea** | findea.ch | soft | Blue CTAs; nav-right + hero "Book consultation"/"Explore" | Expandable service cards; modular testimonial cards | "You run your business. We take care of the rest." DE/FR/IT/EN |
| 7 | **Numarics** *(thin – brand transition)* | numarics.com | soft | Rounded pill solid, nav top-right + hero pair | (transition page) | Mobile-app-first; flag DE/EN toggle |
| 8 | **Accounto** | accounto.ch | soft | **Green** pill, nav-right + hero + per-section repeat | ~8–16px radius, flat+subtle shadow, 3–4 col | ALL-CAPS hero; SVG section-divider patterns; non-sticky nav |
| 9 | **bexio** | bexio.com | soft | **Teal** pill solid, hero primary+secondary + footer | ~8–12px radius, flat w/ **hover-shadow lift**, 4-col, icon top-left, clickable | Two-tier audience nav (Unternehmer/Treuhänder); "100,000+ KMU" |
| 10 | **Run my Accounts** | runmyaccounts.ch | swiss/classic | Navy pill "Offerte" nav-right; hero **dual** ("Grobofferte"+"Gespräch") | 3-col text-heavy service blocks, link-driven | Media logos (NZZ) + award **badge wall** (Best of Swiss Web, Kununu) |

## Tier 3 — Swiss boutique / classic
| # | Site | URL | Lang | Buttons | Cards | Hero / standout |
|---|------|-----|------|---------|-------|-----------------|
| 11 | **Controva** | controva.ch | swiss-minimal | Minimal inline blue links, **no hero button**; clickable email/phone | **No cards** — divided 7-item text list | "Addition, Subtraction, Success."; named-partner quote (Damiana Campagna) |
| 12 | **LPS Treuhand** | lps-treuhand.ch | editorial | **Text "Learn more" links**, not boxes | 3-col value cards, icon-above-centered, flat | Numbered **01/02/03** value system w/ SVG icons |
| 13 | **Magic Heidi** | magicheidi.ch | soft | **Teal pill** "Start Free" + outlined "Watch Demo →"; hero pair, repeated | ~8–12px radius, flat, 3-col, icon top, clickable | Realistic Swiss **QR-bill invoice mockup**; "5,000+ freelancers / 4.9★" |
| 14 | **Fineac Treuhand** *(thin)* | fineac.ch | classic | Minimal; services as text links; "Newsletter abonnieren" | Weak — text-link services, no styled grid | Morison Intl / Treuhand Suisse network logos; "35+ years" |
| 15 | **STG Zürich** | stg.zuerich | classic-heritage | Inline blue text links, no filled CTA | Text-based partner/team sections, no radius/shadow | "Uns vertrauen Generationen. **Seit 1906**" — heritage-as-authority |

## Tier 4 — DACH Steuerberater (DE / AT)
| # | Site | URL | Lang | Buttons | Cards | Hero / standout |
|---|------|-----|------|---------|-------|-----------------|
| 16 | **Gruber Renger** (DE) | gruber-renger.de | bold (navy + **neon-lime**) | Solid **lime** rounded "Erstgespräch buchen", nav-right + 2 in hero + **5+ repeats** | Flat white, subtle shadow, 3-col **photo cards**, whole-card clickable | "Verwaltung vs. Gestaltung" **comparison table**; DATEV "Digitale Kanzlei 2026" |
| 17 | **PMPG** (DE) | pmpg.de | clean-blue corporate | Rectangular solid fill, sentence-case "Mehr erfahren"; hero+sections+footer | Flat/minimal-shadow, 3-col, icon top | Centered "Wir machen's einfach"; star branding motif; "330+ colleagues" |
| 18 | **Warringsholz** (DE) | warringsholz.de | navy editorial | Minimal — linked numbered section headers, text links | 6 flat service cards, **numbered 01–06**, clickable | Split copy + founder portrait; "Kompetent. Persönlich. Digital." |
| 19 | **Statzinger** (AT) | statzinger.at | conversion-blue | Solid blue rounded "Kostenfreies Erstgespräch", nav-right + hero + **6+ repeats** | Rounded soft-shadow 2-col testimonials (photo+text); flat service cards | "herkömmlich vs. spezialisiert" **comparison table** + carousel; Google 4.9/50 |

## Tier 5 — International (great design, diverse)
| # | Site | URL | Lang | Buttons | Cards | Hero / standout |
|---|------|-----|------|---------|-------|-----------------|
| 20 | **Osome** | osome.com | playful (teal+**yellow**) | Teal **pill** "Get started" + "Schedule a call"; nav-right + hero pair + per-section | 3-col, icon top-left + link, moderate radius, clickable; photo+quote testimonials | **Yellow cdx-marker** pricing highlights; 3-persona rotating carousel |
| 21 | **Avalon** | avalonaccounting.ca | warm (**red** accent) | Red "Let's Get Started" + "Explore services"; hero pair + repeats | Service cards icon + hover; **testimonial carousel** w/ company+city + case-study links | "We've got your books and your back."; witty voice; Xero Platinum badges |
| 22 | **Seal + Co** | sealco.ca | warm-editorial | All-caps "GET IN TOUCH"; nav-right + hero + footer | **No card grid** — full-bleed alternating image+text editorial blocks | Oversized **serif** headlines; parenthetical **(01)–(04)** numbered eyebrows |
| 23 | **London Accountants** | londonaccountants.co | corporate (navy+teal) | Teal solid "Book a meeting", subtle-rounded; hero + cards + footer | Service cards icon-top + "Read More", 3–4 col, shadow-lift hover | Slider Revolution carousel hero; dropdown **mega-menu** (11 services) |
| 24 | **Pilot** | pilot.com | soft (**purple**) | **Purple pill** solid; nav-right (Sign In / Get Started); arrow text-link secondaries | 2-col icon-left growth cards; CFO testimonial + case-study image cards ~8–12px | Illustration-heavy **.avif** system; cycling CFO carousel; "3,000+ startups" |
| 25 | **Bench** | bench.co | friendly-blue | Filled rounded title-case; nav (Log in / Free Trial / Schedule Call); hero **dual** + "Learn More →" | Feature cards icon-top; **testimonial cards w/ faces** + subtle shadow | "Confidence in your numbers"; Trustpilot tiles; "35,000+ owners / $200M+" |
| 26 | **Karbon** | karbonhq.com | bold (cyan→teal **gradient** + amber) | Rounded ~8–12px **gradient** solid "Book a Demo" + outlined "Take a Tour"; nav-right + hero pair + section ends | ~8–12px radius, flat + subtle shadow, 3–4 col, icon top-left, whole-card clickable, lift hover | Horizontal-scroll feature carousel; **clustered G2/Capterra badges** + "18 Consecutive Quarters" |
| 27 | **Collective** | collective.com | monochrome (black/white) | Solid **dark** fill "Get started" + "Book a free consult"; nav-right; hero pair + 3+ repeats | Card styling minimal/thin in markup; press + G2 trust row | Dominant "**$10,000/yr savings**" conversion anchor; Bloomberg/TechCrunch logos |

## Tier 6 — Real-world Swiss baseline (scraped, in-repo) — the honest middle of the market
| # | Site | URL | Notes (from `scraper/` analysis) |
|---|------|-----|----------------------------------|
| 28 | **Divisia Treuhand** | divisia-treuhand.ch | Single-language DE; "Termin buchen" CTA; canonical CH service set; modeled to `tureva-soft` |
| 29 | **Sebona Treuhand** | sebona-treuhand.ch | Typical KMU structure; certifications cited as text (EXPERTsuisse/RAB) |
| 30 | **Treuhandgraf** | treuhandgraf.ch | WordPress; services + team + contact; minimal styling — the "generic" benchmark we beat |

> **Real-world prevalence** (from 50 scraped CH sites, `scraped_analysis.json`): blog/news ~64%, certifications cited ~70% (eidg. Diplom) / ~68% (RAB), jobs ~34%, client portal/login ~16%, multilingual minority, cookie-consent tooling ~6% (but legally required for all). Most use text for trust signals — a **styled logo trust-bar is a cheap differentiator.**

---

## Cross-cutting findings (these drove `enrichment.ts`)

### Buttons — placement is near-universal, look is language-dependent
- **Primary CTA lives top-right of the nav** on essentially all 30 sites ("Termin buchen" / "Get started" / "Book a demo"). The **hero carries a dual-CTA pair** (solid primary + outline/"text →" secondary), and the primary **repeats** at section ends + final CTA band + footer. Conversion sites repeat it 5–6× (Gruber Renger, Statzinger).
- **Shape by language:** `soft`/SaaS → **pill solid** (teal/green/lime/purple): Magic Heidi, bexio, Accounto, Pilot, Osome, Karbon, Tureva. `swiss`/corporate → **rounded-md solid** (Run my Accounts, Statzinger, Collective-dark). `editorial`/boutique → **text-link / underline / all-caps**, often *no filled hero button at all* (Controva, LPS, STG, Seal+Co, Warringsholz, Fineac).
- **Secondary** is reliably an **outline** or a **"label + arrow →"** text link. **Client-portal "Log in"** sits separate from the marketing CTA (bexio, Pilot, Bench, Collective).

### Cards — 3-col grid is the default; boutiques drop cards entirely
- **Services:** 3-col dominant (4-col for feature/SaaS, 2-col for big pillars). **Icon top-center** (LPS, Magic Heidi, PMPG) or **top-left** (bexio, Karbon, Osome). **Whole card clickable** is the norm (Gruber Renger, bexio, Karbon, Osome, Warringsholz).
- **Look by language:** `soft` → rounded-2xl, soft shadow, **hover-lift**. `swiss`/`editorial` → sharp/flat **bordered**, hover **border→accent**. `warm` → hairline cards on paper. **Boutiques use NO cards** — divided text lists (Controva, STG, Seal+Co, Fineac).
- **Testimonial cards:** quote + person + **company + city** (never anonymous), 2–3 col or **carousel** (Statzinger, Bench, Pilot, Avalon). **Pricing cards:** tiered, one "recommended" ringed/elevated, sometimes calculator-driven (Boost, Osome).

### Sections / IduA
- Numbered eyebrows are a strong recurring motif (LPS 01/02/03, Warringsholz 01–06, Seal+Co (01)–(04), Gruber Renger 01–04).
- **Comparison tables** ("Verwaltung vs Gestaltung", "herkömmlich vs spezialisiert") are a high-converting boutique/conversion pattern worth adding.
- In-hero trust nibble is universal: Google/Trustpilot rating, client count, media/award/G2 logos.

### Navigation
- Logo **left**, primary CTA **right** — invariant. Links centered (soft/editorial) or right-clustered (corporate). **Sticky + blur** on the SaaS tier; **non-sticky/opaque** on the classic tier (STG, Controva, Accounto, Fineac). **Mega-menus** on service-heavy firms (bexio, Pilot, Osome, London, Karbon). **Language switch top-right** (CH: DE/FR/IT/EN) or **region switch in footer** (intl).

### Footer
- 3–4 column multi-col (brand · sitemap · offices · trust/social) + legal bar (Impressum/Datenschutz) + dynamic © year. Region/language switch and newsletter often live here. Locality cues add warmth (Findea "Made with ❤️ in Winterthur", UdS live Zürich clock).

### Animation & motion (per design language)
Every inventory item carries an `animation` spec (`enrichment.ts` → `animationEnrichment` → `meta.animation`). The recurring choreography across the 30 sites:
- **Entrance/reveal:** on-scroll fade + slide-up (translateY ~16px), **staggered** for grids and the hero stack (~60–80ms/item); numbers **count-up**; accent bars and dividers **grow/draw**. All gated by `prefers-reduced-motion`.
- **Interaction:** cards lift+shadow (soft) or border→accent (swiss/editorial/warm); buttons brightness-lift or arrow-translate; underline links scaleX from the left; accordions spring open one-at-a-time; carousels auto-rotate with cross-fade.
- **Per-look intensity (from the `motion` tokens in `tokens.ts`):** `soft` (Tureva, bexio, Pilot, Karbon, Osome) = **expressive** — spring easing `cubic-bezier(0.16,1,0.3,1)`, scroll-driven CTA **bloom/glow**, mockup float. `editorial`/`swiss` (Boost, Rürup) = **subtle**, ~300ms `cubic-bezier(0.4,0,0.2,1)`. `warm` (UdS) = **snappy**, ~200ms ease-out (e.g. the underline-anim link). Classic CH boutiques (STG, Controva, Fineac) use almost no motion at all — restraint *is* the language.
- **Signature motions worth stealing:** Tureva's nearest-CTA scroll bloom · Magic Heidi's live QR-bill mockup · UdS's FinanceSimulator SVG sine-wave · Rürup's animated DE-CH map nodes · the "Verwaltung vs Gestaltung" / "herkömmlich vs spezialisiert" reveal-on-scroll comparison tables.

---

## How this maps into the inventory
Every observation above is encoded in **`design-system/enrichment.ts`** and merged by `generate_scaffold.ts` into all 89 `components/**/meta.json`, adding to each element:
`visual` (how it looks) · `placement` (where on page + within section) · `states` (hover/active/scroll) · `animation` (motion choreography + per-look intensity) · `realWorld` (which of these 30 sites show it) · `designLanguage` (how it manifests in editorial / swiss / soft / warm).

Run `node generate_scaffold.ts` to regenerate after editing `enrichment.ts`.

## Sources (live sites)
nexova.ch · findea.ch · numarics.com · accounto.ch · bexio.com · runmyaccounts.ch · controva.ch · lps-treuhand.ch · magicheidi.ch · fineac.ch · stg.zuerich · gruber-renger.de · pmpg.de · warringsholz.de · statzinger.at · osome.com · avalonaccounting.ca · sealco.ca · londonaccountants.co · pilot.com · bench.co · karbonhq.com · collective.com — plus the in-repo `scraper/` dataset (50 CH firms).
