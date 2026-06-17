# Product

## Register

brand

<!-- The default surface Impeccable optimizes is the *generated Treuhänder
marketing site* (design IS the product). The generator/playground itself
(design-system/) is a secondary product surface; when working on Variant Studio
or tooling UI, treat that as `product`. Default register for design output: brand. -->

## Users

- **Primary (the audience the generated sites serve):** Swiss SME owners (KMU), self-employed and freelancers, private individuals, associations & foundations looking for a Treuhänder. They arrive wanting to trust a firm with their accounting, taxes, payroll and audits — the site's job is to earn that trust fast.
- **Customers of the generator (site owners):** Swiss Treuhand / fiduciary firms whose real website was scraped and re-built as a modern multi-page site.
- **Operator/builder:** the developer running the generator (solo). Works in German; iterates on the design-system that turns one scraped firm into a full composed site.

## Product Purpose

A generator that turns a **real, scraped** Treuhänder website into a fully composed, modern multi-page marketing site. The scrape **drives both structure and look**: archetype, page set, copy, photos, team, colours and type are grounded in the actual firm — not poured into a fixed template. A clean modern preset supplies the design language; the firm's real brand colour is tinted in with proper contrast. Success = a generated site that looks bespoke to that firm, reads as trustworthy, and could not be mistaken for a generic AI landing page.

## Brand Personality

There is **no single fixed personality** — it is calibrated per firm from the scrape. The shared floor every generated site must hit, mixed by context:

- **Trustworthy · Swiss-precise · modern-restrained** — the baseline for finance/Treuhand.
- **Warm · personal · approachable** — dialled up for boutique/owner-led firms.
- **Premium · high-quality · exclusive** — dialled up for high-end positioning.

Voice across all: confident, clear, Swiss-precise; never generic, never shouty. The *aspects* shift per firm; the *coherence* never does.

## Anti-references

What a generated site must NEVER look like:

- **Incoherent mishmash** — many styles thrown together with no single design language. One site = one coherent voice.
- **KI-Editorial-Lane** — display serif + mono micro-labels + magazine affectation (Klim/Notion-clone). It's one lane, not the default; keep it a minority.
- **Muted-grey, barely-readable text** — light grey supporting copy on near-white. (Fixed centrally; keep it fixed.)
- **Generic SaaS cream/sand** — the warm near-white body as the 2026 AI default.
- **Fake social proof** — testimonials, stats, client logos that aren't real scraped data.

## Design Principles

1. **Scrape drives structure AND look.** Every site is grounded in the real firm; extraction decides the pool, selection decides what renders.
2. **One coherent design language per site.** The chosen preset/kit governs the whole site; never a per-section mishmash. Consistency of voice over novelty.
3. **Real data only for social proof.** No invented testimonials, metrics, or logos — show proof only when the scrape supplies it.
4. **Legibility is craft, not compliance.** Even with no formal WCAG mandate, supporting text stays readable; "muted-grey on white" is a banned look.
5. **Differentiate across firms.** Two generated sites should not converge — type, colour and structure vary deterministically per firm so the output never feels mass-produced.

## Accessibility & Inclusion

No formal WCAG conformance target. Contrast/legibility is nonetheless treated as baseline craft: supporting text is enforced to ≥4.5:1 against its background in `design-system/looks/applyLook.ts`, because illegible muted text is an explicit anti-reference. Reduced-motion alternatives for entrance/scroll motion are an aspiration, not a guarantee.
