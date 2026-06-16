# Briefing — What Defines a Great Treuhänder Website

**Purpose:** Distil the structure, patterns and design language of the best fiduciary / accounting / Steuerberater websites into an actionable reference for this repo's Treuhänder template + generator system.
**Method:** Deep structural analysis of 5 reference sites (Nexova, Findea, Controva, Osome, Avalon) plus survey-level review of ~10 more, cross-referenced against the repo's existing `design-system/` (4 presets in `tokens.ts`, slot vocabulary in `component-inventory.ts`).
**Date:** 2026-06-16

---

## 0. Reference set

### Deep-analysed (full structure extracted)
| Site | URL | Archetype | Why it's a reference |
|------|-----|-----------|----------------------|
| Nexova | https://www.nexova.ch | Swiss digital fiduciary | Most complete modern CH fiduciary IA; pricing-forward, industry pages, trust stack |
| Findea | https://www.findea.ch | Swiss digital fiduciary | Hybrid "digital + personal" model, 4-language, transparent pricing, lead funnel |
| Controva | https://controva.ch/en | Swiss boutique | Minimalist relationship-led; credentials over pricing |
| Osome | https://osome.com | Intl. conversion-driven | Best-in-class persona segmentation + social proof clustering |
| Avalon | https://avalonaccounting.ca | Intl. personality-led | Strong brand voice, lead-magnet resources, testimonial-first |

### Survey-level (design inspiration)
Numarics (numarics.com), LPS Treuhand (lps-treuhand.ch), Magic Heidi (magicheidi.ch), Telepski (telepski-treuhand.ch), Accounto (accounto.ch) · Gruber Renger (gruber-renger.de), PMPG (pmpg.de), Warringsholz (warringsholz.de) · Seal+Co (sealco.ca), London Accountants (londonaccountants.co).

---

## 1. Executive summary — the 10 things every great Treuhänder site does

1. **Leads with a benefit, not a service list.** Hero says what the client gets ("You run your business — we handle the rest"), not "We offer accounting, payroll, tax."
2. **Earns trust above the fold and never stops.** Review badge + rating, client count, named testimonials, professional certifications (Expert Suisse / Treuhand Suisse).
3. **Is transparent about price.** The strongest CH sites put `ab CHF X/Monat` directly on service cards. Opacity reads as "expensive and evasive."
4. **Sells the digital + personal hybrid.** The winning 2026 positioning is "modern tools *and* a real person who knows you" — not one or the other.
5. **Segments by audience.** Industry pages (Nexova: 12) or persona cards (Osome: 3) so each visitor sees themselves.
6. **Has one clear, persistent primary action.** "Termin buchen" / "Book a consultation" in the header and repeated down the page.
7. **Uses a calm, professional visual language.** White/light background, one accent colour, generous whitespace, clean sans-serif, modular cards.
8. **Answers objections inline.** A focused FAQ (5–8 questions) handles "what does a Treuhänder do, do I need a contract, what does it cost."
9. **Is bilingual and compliant by default.** DE/EN minimum (CH often DE/FR/IT/EN); visible Impressum + Datenschutz (nDSG/DSGVO).
10. **Is fast and responsive.** <2s load, modern image formats (AVIF/WebP), flawless mobile, accessible contrast.

---

## 2. Canonical information architecture

### 2.1 Homepage section order (the shared backbone)
Nearly every strong site follows this rhythm. Mapped to this repo's `Slot` vocabulary (`component-inventory.ts`):

| # | Section | Repo slot | Always / Often | Notes |
|---|---------|-----------|----------------|-------|
| 1 | Sticky header + lang switch + CTA | `nav.*` | Always | Logo L · nav C · "Termin buchen" R |
| 2 | Hero (benefit headline + 2 CTAs + trust nibble) | `hero` | Always | Review badge or client count *in* the hero |
| 3 | Positioning statement / intro | `intro` | Often | One-line "who we are / why we exist" |
| 4 | Services grid (with inline pricing) | `services` | Always | Cards; price `ab CHF X` is the CH differentiator |
| 5 | Why-us differentiators | `values` | Always | 4–6 pillars: digital, transparent, personal, compliant |
| 6 | Audience / industry segmentation | `audience` | Often | Industry pages (Nexova) or persona cards (Osome) |
| 7 | Social proof — testimonials + metrics | *(gap — see §8)* | Always | Named quotes + company + location; review badge |
| 8 | Stats band | `stats` | Often | "1000+ KMU vertrauen uns", cantons, languages |
| 9 | Process / how it works | `process` | Often | 3 steps; reduces "what happens if I switch" friction |
| 10 | Team / leadership | `team` | Often | Real faces = trust; boutique sites lead with this |
| 11 | Pricing detail / calculator | `pricing` | Often | CH digital firms; calculator is a strong lead tool |
| 12 | Partners / certifications | `partners` | Often | Expert Suisse, Treuhand Suisse, bexio/Xero badges |
| 13 | FAQ | `faq` | Always | 5–8 Q&A, objection-handling |
| 14 | Coverage map | `map` | Optional | Multi-location CH firms (Nexova: 8 cities) |
| 15 | Final CTA band | `cta` | Always | "Bereit? Termin buchen." |
| 16 | Contact (form + office info) | `contact` | Always | Form L · address/phone/hours + map R |
| 17 | Multi-column footer | `footer.*` | Always | Sitemap, offices, legal, social, year |

**Takeaway for the generator:** the existing slot list already covers 16/17. The one missing first-class concept is a dedicated **social-proof / testimonials** section (currently scattered across `quote`, `partners`, `stats`). Recommend adding it — see §8.

### 2.2 Sitemap (typical page set)
`Home` · `Services` (overview + per-service detail) · `Industries/Audience` (optional, per-segment) · `Pricing` · `About` (+ `Team`) · `Blog/Resources` · `Contact` · `Legal` (Impressum, Datenschutz, AGB).
Boutique firms (Controva) collapse to a near-one-pager; digital firms (Nexova, Findea) run deep SEO trees (per-service × per-city pages).

---

## 3. Section-by-section anatomy

### Hero (`hero`)
- **Headline = benefit/outcome.** Client-centric ("Sie führen Ihr Unternehmen. Wir kümmern uns um den Rest." — Findea) beats firm-centric.
- **3 supporting claim chips** are common (Nexova: "Komplett digital · Sicher, präzise, effizient · Transparente Preise").
- **Two CTAs:** primary = book/contact; secondary = explore/price-calculator/watch-video.
- **Trust nibble in-hero:** star rating + review count (Nexova "5.0 ★ | 93"), or "1000+ KMU".
- Repo fit: `hero.split-graphic`, `hero.centered`, `hero.text-left`.

### Services (`services`)
- Card grid, 3–6 services, icon + title + 1-line summary + arrow link to detail.
- **CH differentiator:** transparent price on the card (`ab CHF 150/Monat`). German/boutique sites omit price.
- Expandable accordion variant (Findea "Transparent. Professional. Digital.") works as a compact alternative.
- Repo fit: `services.card-grid`, `services.bordered-tiles`, `services.accordion`, `services.feature-pillars`.

### Why-us / values (`values`)
- 4–6 pillars. The recurring CH four: **100% digital · transparent pricing · personal support · fully compliant** (Nexova adds data protection + custom KMU solutions).
- Repo fit: `values.divided-columns`.

### Audience / industries (`audience`)
- Either deep **industry pages** (Nexova: Startups, IT, R&D, Consulting, Hospitality, Medical, NGOs, Trades, Real estate, Staffing, Finance) — great for SEO and "they understand my world."
- Or **persona cards** (Osome: solo founder / quality-focused owner / scaling company).
- Repo fit: `audience.cards`.

### Social proof (testimonials + metrics) — *recommended new slot, see §8*
- Named quote + person + **company + city** (Avalon: "Curtis Vertefeuille, Moe's Home, Victoria BC"). Anonymous quotes are weak.
- Pair with a metric: "92% recommend" (Osome), "1000+ SMEs" (Findea), "250+ companies" (Nexova).
- Link each testimonial to a case study where possible.

### Stats (`stats`)
- Big number + label + caption. CH-relevant metrics: clients served, cantons covered, languages spoken, years in business.

### Process (`process`)
- 3 numbered steps ("Onboarding → wir übernehmen → Sie sehen Echtzeit-Zahlen"). Directly answers switching anxiety.

### Team (`team` / `profile`)
- Real photos + name + role + short bio. Boutique/owner-led firms (Controva, Rürup) make this central with a `profile` block + credentials + pull-quote.

### Pricing (`pricing`) + calculator
- Transparent tiers or a **price calculator** (slider → recommended package) that doubles as a lead-capture interaction. Repo already inventories `widget.calculator`.

### Partners / certifications (`partners`)
- **CH trust currency:** Expert Suisse, Treuhand Suisse membership, Swiss GAAP FER, bexio/Abacus/KLARA partner, Xero/QuickBooks badges. Display as a logo strip.

### FAQ (`faq`)
- 5–8 questions. Canonical set: *What does a Treuhänder do? · Which services? · What does it cost? · Do I need a contract? · Is it really fully digital? · Which regions? · How is my data protected?*

### Contact (`contact`) + map (`map`)
- Form (name/email/phone/service-select/message) **+** office card (address, phone, hours) **+** map. Offer booking as the primary path, form as fallback.

### Footer (`footer.multicol`)
- Brand+tagline · sitemap · offices/locations · legal (Impressum, Datenschutz, AGB) · social · dynamic © year · trust badges. CH nicety: live local clock / "Made in Winterthur"-style locality cue.

---

## 4. Visual design language (cross-site + repo presets)

The reference sites and this repo's 4 presets agree on a tight visual vocabulary:

- **Background:** white or warm paper (`#FFFFFF` / `#FAF9F6`). Never busy.
- **Accent:** exactly **one** brand colour does the work — navy/blue (Boost, UdS, Nexova, Findea, Osome), or a confident signal colour (Rürup red, Tureva lime, Avalon red). Blue dominates the category because it reads "trust/finance."
- **Typography:** clean sans body (Inter / Plus Jakarta), distinctive display for headlines (serif-editorial *or* geometric/grotesk). **Uppercase tracked "eyebrow" labels** above headlines are a near-universal signal (all 4 repo presets use them).
- **Layout:** 12-col asymmetric splits for hero/about/contact; responsive card grids; **alternating white↔tinted section bands** for rhythm; hairline borders and zero-gap divided grids for the editorial look.
- **Corners & elevation:** pick a lane and hold it — sharp+flat (Rürup, UdS = "precise/Swiss") *or* soft+shadowed (Tureva = "friendly/premium").
- **Whitespace:** airy `py-20`/`py-24` section padding. Density signals confidence; cramped signals amateur.
- **Motion:** subtle by default (200–300ms ease-out), one optional signature flourish (Tureva's scroll-driven CTA bloom, UdS's underline animation). Never gratuitous.
- **Imagery:** real team/office photos > stock; modern formats (AVIF/WebP). Minimalist German sites (Gruber Renger) go near image-free, all type + whitespace.

**Preset → archetype mapping (for picking a look per client):**
| Repo preset | Reads as | Best for |
|-------------|----------|----------|
| `boost-editorial` (serif, navy, airy) | Premium, established | Classic boutique / advisory |
| `ruerup-swiss` (grotesk, sharp, red/green) | Precise, corporate | Owner-led Swiss/German practice |
| `tureva-soft` (geometric, rounded, lime) | Friendly, modern | Startup-focused digital fiduciary |
| `uds-warm-editorial` (paper, ink-blue/rose) | Boutique, human | Small relationship-led firm |

---

## 5. Trust & credibility stack (the category's #1 job)

Fiduciary clients hand over their money and books — **trust is the entire sale.** Layer it:

1. **Aggregate rating** — Google 5★ badge + review count, in hero and repeated.
2. **Named testimonials** — person + company + city + (ideally) case-study link.
3. **Quantified scale** — "1000+ KMU", "250+ companies", "92% recommend", years in business.
4. **Professional credentials** — Expert Suisse, Treuhand Suisse, Swiss GAAP FER, FINMA references; software-partner badges (bexio/Abacus/Xero).
5. **People** — real faces, real names, real qualifications.
6. **Compliance visibility** — explicit data-protection statement (nDSG + DSGVO), secure document upload.
7. **Locality** — Swiss address, local phone, office map, canton coverage.

---

## 6. Conversion & UX patterns

- **One persistent primary CTA** ("Termin buchen") in header + repeated bands; secondary CTAs vary (calculator, demo video, explore).
- **Lead-gen interactions** (this repo already inventories several): price calculator, service quiz, booking wizard, finance simulator. These convert better than a bare contact form and add the "wow."
- **Lead magnets** (intl. pattern): free guides, tools, courses, newsletter — entry points for not-yet-ready visitors (Avalon, Osome).
- **Inline pricing** removes the biggest friction in the CH market.
- **Persona/industry segmentation** routes visitors to relevant content fast.
- **Form UX:** mono uppercase labels, required-field guard, success/error banners, optional localStorage tracker (all already in the repo inventory).
- **Sticky help:** chat/WhatsApp widget or persistent "Schedule a call" (Osome).

---

## 7. Switzerland / DACH-specific requirements

- **Languages:** DE + EN minimum; serious CH firms add FR (and often IT). Pill/segmented switcher in header. (Repo: only Tureva implements `nav.lang-switch` — make it core.)
- **Legal:** Impressum + Datenschutzerklärung mandatory and visible; AGB common. Cookie consent. nDSG (revised Swiss DPA) **and** DSGVO compliance language.
- **Credentials that matter locally:** Treuhand Suisse, Expert Suisse, Swiss GAAP FER; software ecosystem (bexio, Abacus, KLARA, Sage).
- **Geography:** canton/city coverage, Swiss address + `+41` phone, often an interactive CH map.
- **Tone:** "seriös" + "persönlich." Professional and trustworthy, but the 2026 edge is warmth + digital convenience, not stiffness.
- **Currency/format:** `CHF`, Swiss number formatting, local office hours.

---

## 8. Recommendation for this repo's design system

1. **Add a first-class `social-proof` / `testimonials` slot.** It's universal in the references but currently spread across `quote`/`partners`/`stats`. Anatomy: header + 2–4 named quote cards (person·company·city) + an aggregate metric/review badge. Style affinity: `any`.
2. **Promote `nav.lang-switch` to `core`.** Bilingual is table-stakes for CH; only 1 of 4 built sites has it.
3. **Make in-hero trust + in-card pricing default behaviours**, not optional — they're the two strongest category differentiators.
4. **Add a certifications logo-strip variant** under `partners` seeded with CH bodies (Treuhand Suisse, Expert Suisse, Swiss GAAP FER, bexio).
5. **Keep the four presets as the archetype menu** (see §4 mapping) — they already span formal→friendly and cool→warm, matching the real spread of good Treuhänder sites.
6. **Default canonical homepage composition** for the generator = the §2.1 order, with 7/8/11/14 toggled by client type (boutique vs. digital-scale).

---

## 9. Archetype differences (don't blend them blindly)

| Dimension | Swiss digital (Nexova, Findea) | Swiss/DE boutique (Controva, Gruber Renger) | Intl. conversion (Osome, Avalon) |
|-----------|-------------------------------|---------------------------------------------|----------------------------------|
| Pricing | Shown inline, calculators | Hidden ("contact us") | Shown, plan modals |
| Hero | Benefit + price + rating | Restrained statement | Benefit + heavy social proof |
| Depth | Deep SEO trees, industry pages | Near one-pager | Resource/blog/tools heavy |
| Trust lever | Reviews + scale + compliance | Credentials + relationship | Reviews + personality + case studies |
| Voice | Efficient, modern | Calm, understated | Warm, witty, direct |
| Visual | Clean SaaS, blue, cards | Minimal type + whitespace | Lifestyle photography, brand colour |

Pick the archetype that matches the client's actual business model — a 3-person boutique should not cosplay as Nexova, and a digital-scale firm shouldn't hide its pricing.

---

## 10. "Definition of done" checklist for a Treuhänder site

- [ ] Hero leads with a client benefit + 2 CTAs + a trust signal
- [ ] One persistent primary CTA ("Termin buchen") across the page
- [ ] Services as cards; transparent pricing where the model allows
- [ ] 4–6 why-us pillars (digital · transparent · personal · compliant)
- [ ] Named testimonials (person·company·city) + an aggregate metric/rating
- [ ] Professional credentials / partner badges visible
- [ ] Audience or industry segmentation
- [ ] Focused FAQ (5–8, objection-handling)
- [ ] Team with real faces
- [ ] Contact: form + office info + map; booking as primary path
- [ ] Multi-column footer with legal (Impressum/Datenschutz), social, © year
- [ ] DE/EN (+FR/IT) language switch
- [ ] nDSG + DSGVO compliance, cookie consent
- [ ] One accent colour, generous whitespace, clean sans-serif, consistent corner/elevation lane
- [ ] <2s load, AVIF/WebP, fully responsive, accessible contrast
- [ ] Optional signature interaction (calculator / quiz / simulator) for the "wow"

---

## Sources
- Nexova — https://www.nexova.ch/de/treuhand/
- Findea — https://www.findea.ch/en
- Controva — https://controva.ch/en/
- Osome — https://osome.com
- Avalon Accounting — https://avalonaccounting.ca/
- "7 schöne Steuerberater Websites" — https://www.luisaherrmann.de/blog/7-schoene-steuerberater-websites-zur-inspiration-tipps/
- "Top 25 Modern accountant websites" — https://www.makingthatwebsite.com/best-accountant-websites/
- "Accounting Firm Websites: 17+ Design Examples" — https://nanoglobals.com/accounting-firm-websites/
- Webdesign-Trends Schweiz 2025 — https://webartistik.ch/blog/7-webdesign-trends-2025-was-moderne-websites-in-der-schweiz-auszeichnet
- Internal: `design-system/tokens.ts`, `design-system/component-inventory.ts`, `design-system/presets.json`
