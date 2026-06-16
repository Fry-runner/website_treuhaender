/**
 * Reference sites — 20 outstanding NON-Treuhänder sites with an overlapping
 * audience/message (bookkeeping & accounting SaaS, SME fintech, trust/compliance,
 * wealth, and UI-craft benchmarks). Analyzed for structure + visuals (Jun 2026)
 * to seed the patterns library. designLanguage maps to references/design-languages.ts.
 */
export interface ReferenceSite {
  name: string;
  url: string;
  category: string;
  designLanguage: string;
  structure: {
    nav: string;
    hero: string;
    sectionOrder: string;
    cards: string;
    buttons: string;
    footer: string;
  };
  visuals: { palette: string; type: string; cornersElevation: string; motion: string; imagery: string };
  signatures: string[];
}

export const referenceSites: ReferenceSite[] = [
  { name: "Pilot", url: "https://pilot.com", category: "bookkeeping/CFO for startups", designLanguage: "fintech-clean",
    structure: { nav: "logo-L · mega-menu-C · Sign in + Get Started-R, sticky", hero: "split (text-L / dashboard UI-R), provocative-question headline, 1 primary, '3,000+ startups' + logos", sectionOrder: "hero → logos → service overview → 3-col features → problem/solution → CFO creds → 4-col use-cases → full-width case studies → resources → 3-path CTA → footer", cards: "features 3-col icon+headline+desc; case studies full-width alternating; prefers 1px pin-lines over boxes", buttons: "PILL (999px), Space Mono UPPERCASE, purple fill / white outline", footer: "5 columns + legal" },
    visuals: { palette: "white/lavender #F6F3FF + purple #5931DC", type: "Euclid Circular B 600 + Space Mono labels", cornersElevation: "4→8→999px radius; purple-only soft shadows", motion: "0.2s hover translateY(-4px)", imagery: "real UI + photography breaking frame + ledger-grid texture" },
    signatures: ["warm↔cool section bg spectrum signals topic shifts", "monospace uppercase pill CTAs", "ledger/chart texture overlays @8–20%"] },

  { name: "Pennylane", url: "https://www.pennylane.com", category: "accounting + business account (FR)", designLanguage: "soft-friendly",
    structure: { nav: "sticky, audience sub-nav (Independents/PME/Expert-Comptable), CTA repeated", hero: "centered, benefit headline, 1 primary, dual review badges + '1,000,000 dirigeants' + logos", sectionOrder: "hero+ratings → logo carousel → features → integrations → rotating spotlights → video testimonials → 6-card grid → footer", cards: "image+headline+desc; testimonials headshot+name+title+logo", buttons: "green solid primary, text-link secondary", footer: "6 columns + legal/social" },
    visuals: { palette: "white/beige + teal-green", type: "clean sans, display heads", cornersElevation: "moderate radius, minimal shadow", motion: "autoplay carousels", imagery: "product UI + headshots + gradient dividers" },
    signatures: ["dense above-the-fold trust stack (dual badges + 7-figure metric)", "audience-segment sub-nav", "video-testimonial carousel"] },

  { name: "Puzzle", url: "https://puzzle.io", category: "AI-native accounting/GL", designLanguage: "fintech-clean",
    structure: { nav: "sticky, dropdowns, Book-a-demo + Get-started-free", hero: "centered, 'Accurate Books. At AI Speed.', 3 CTAs (intent split), '7,000+ firms' + carousel", sectionOrder: "hero → problem → case carousel → 3-way features → deep-dives → migration → FAQ accordion → CTA → footer", cards: "case carousel; feature icon+headline; TIME-based timeline cards; FAQ chevrons", buttons: "solid rounded primary, outline/text secondary", footer: "6 cols + social" },
    visuals: { palette: "light + blue/teal gradients", type: "modern sans, large display heads", cornersElevation: "8–12px, subtle shadow", motion: "carousels, accordion", imagery: "product UI + photos + gradient + icons" },
    signatures: ["time-based 'now→5min→month-end' speed cards", "explicit competitor-migration section", "three-CTA hero for distinct intents"] },

  { name: "Digits", url: "https://digits.com", category: "AI-native general ledger", designLanguage: "dark-premium",
    structure: { nav: "sticky mega-menus, green get-started", hero: "centered over ANIMATED GRADIENT VIDEO, benefit headline, 1 green CTA, no hero badges", sectionOrder: "hero(video) → interactive 13-tab product console → partner banner → proof → footer", cards: "tabbed screenshots in MacBook mockup", buttons: "green fill black text", footer: "contacts + 9 social + SOC2/AICPA certs" },
    visuals: { palette: "black/white/gray + single bright green", type: "custom StabilGrotesk 300–700", cornersElevation: "minimal radius, flat", motion: "highest: bg video, slide transitions; respects reduced-motion", imagery: "pure product UI, device mockups" },
    signatures: ["interactive product console as hero — product IS the marketing", "animated gradient video hero", "single saturated green on neutral = premium AI"] },

  { name: "Gusto", url: "https://gusto.com", category: "payroll/HR/benefits for SMBs", designLanguage: "editorial-trust",
    structure: { nav: "sticky, product menus, Get started-R", hero: "headline + yellow accent + audience self-segmentation ('Tell us about yourself')", sectionOrder: "hero+segmentation → product pillars → G2 social proof → features → testimonials → CTA → footer", cards: "product-pillar + feature + testimonial cards", buttons: "rounded primary in brand red (Guava), outline/text secondary", footer: "large multi-column" },
    visuals: { palette: ">50% whitespace + Guava red, Kale green, yellow accents", type: "ITC Clearface SERIF heads + Centra sans + hand-drawn signatures", cornersElevation: "rounded, soft", motion: "light", imagery: "bold hand-drawn line illustration + people photography" },
    signatures: ["serif display headline (warmth where rivals use sans)", "hand-drawn human illustration system", "audience self-segmentation as hero interaction"] },

  { name: "Qonto", url: "https://qonto.com", category: "SME business banking (EU)", designLanguage: "fintech-clean",
    structure: { nav: "sticky mega-menu, Sign in + Open account, country selector", hero: "centered benefit-triad headline, 2 CTAs, Trustpilot 4.8 + 'Made in France'", sectionOrder: "hero → 3 feature cards → financing/cards → e-invoicing multi-card → integrations → company-creation 3-col → AI → testimonials → 3 security badges → final CTA → footer", cards: "icon-left → headline → text, 2–3 col; testimonials photo+logo+quote carousel", buttons: "solid primary, outline secondary, pair repeats hero+final", footer: "6+ product cols + app badges" },
    visuals: { palette: "purple #6b5aed + mint #63ebe4 on off-white", type: "PolySans (playful-utilitarian)", cornersElevation: "minimal rounding, flat, light borders", motion: "moderate carousel", imagery: "bento product UI + photography + color blocks" },
    signatures: ["benefit-triad headline", "purple+warm-pastel breaks fintech-navy convention", "Trustpilot + Made-in-France in hero"] },

  { name: "Mercury", url: "https://mercury.com", category: "startup banking / finance ops", designLanguage: "editorial-trust",
    structure: { nav: "sticky, menu-C, Log in + Open account-R", hero: "centered, 'Radically different banking', inline email + primary, product screenshots behind, no hero logo wall", sectionOrder: "hero → 4-col 'everything with money' → 3 testimonials → 4 features → founder quote → 3 get-started → 3 fees → 3 'run like a pro' → trust metrics (300K+, 1-in-3, $20B/mo, 4.9) → 3 security → 3 press → dual final CTA → footer", cards: "image/illustration-top → bold headline → text, 3–4 col; testimonials portrait+blockquote", buttons: "primary solid indigo (only saturated color), text-link secondary", footer: "multi-column + disclaimers" },
    visuals: { palette: "cream/light + single indigo; dusty pastels + coral", type: "custom Arcadia ~480-weight heads (broadsheet)", cornersElevation: "moderate radius, light borders, subtle shadow", motion: "subtle/premium", imagery: "cinematic commissioned color-graded photography + product UI" },
    signatures: ["editorial broadsheet tone via custom 480 type", "one-indigo restraint on cream", "cinematic commissioned photography"] },

  { name: "Ramp", url: "https://ramp.com", category: "corporate cards + spend mgmt", designLanguage: "dark-premium",
    structure: { nav: "logo-L, product/pricing links, Sign in + demo-R", hero: "bold benefit headline (time + money saved), demo + start CTAs", sectionOrder: "promo → product overview → core products → benefits → pricing → implementation checklist", cards: "product/benefit cards with metrics; savings in lime", buttons: "high-contrast solid (lime/white on black), outline secondary", footer: "multi-column" },
    visuals: { palette: "black marketing canvas + clean white product + lime #B5FF4D 'savings' accent", type: "Ramp Grotesk (precise, slightly condensed)", cornersElevation: "low radius, flat, crisp", motion: "bold, modern", imagery: "real product UI on dark, number-forward" },
    signatures: ["lime 'savings' accent makes frugality exciting", "black marketing vs white product split", "metric/number-led storytelling"] },

  { name: "Wise", url: "https://wise.com", category: "international money transfer", designLanguage: "data-precise",
    structure: { nav: "sticky, dropdowns w/ imagery, region selector + Log in + Sign up", hero: "centered, 'Send money globally for less', live FX CALCULATOR + competitor comparison, 'billions moved' + Trustpilot 4.3 (292k)", sectionOrder: "hero+calc → trust metrics → comparison table → 3 features → business promo → security → alternating features → testimonials → mission → app QR → destinations grid → footer", cards: "3-col icon-left → headline → metric → text-CTA; borderless, typography-driven", buttons: "primary solid, underlined-text secondary", footer: "7-column + FCA regulatory bar" },
    visuals: { palette: "white + bright teal/turquoise + flag color pops", type: "Wise Sans, display heads vs light metric numbers", cornersElevation: "minimal rounding, flat/near-shadowless", motion: "light (calc + carousel)", imagery: "real app/card UI + flags + comparison charts w/ competitor logos" },
    signatures: ["interactive FX calculator as hero", "explicit competitor price comparison (radical transparency)", "flag-driven color amid flat white"] },

  { name: "Stripe", url: "https://stripe.com", category: "payments / financial infrastructure", designLanguage: "fintech-clean",
    structure: { nav: "logo-L, menu, Sign in + Get started-R", hero: "centered, 'Financial infrastructure for more revenue', 2 CTAs, signature gradient wave", sectionOrder: "hero → customer logo carousel → metrics (135+ currencies, $1.9T) → product cards → enterprise stories → support → startup carousel → platform → dev tools → news → CTA → footer", cards: "product cards UI screenshot + gradient overlay, minimal text; testimonial 'read story'", buttons: "primary solid, underlined-text secondary", footer: "many columns 8–15 links + region selector" },
    visuals: { palette: "cool-white/deep-navy near-mono + electric violet #533afd + controlled gradient set", type: "sohne-var light 300–400, tight negative tracking, gradient hero text", cornersElevation: "low radius 4–6px, flat, 8px grid", motion: "refined gradient motion + animated dev UI", imagery: "product UI + architectural photography + gradient halos" },
    signatures: ["flowing orange→pink→purple gradient signature", "gradient hero text on near-mono canvas", "light-weight type + tight tracking = authority via restraint"] },

  { name: "Vanta", url: "https://vanta.com", category: "trust/compliance (SOC 2)", designLanguage: "fintech-clean",
    structure: { nav: "logo-L, dropdowns, Get a demo-R, sticky", hero: "centered, TRUST-statement headline ('Trust is everything'), 1 primary, 7 logos + '16,000+ customers' + animated UI", sectionOrder: "hero → logo/metrics → 6-card features → agent → testimonial → 9 framework cards → audience segments → 4 testimonials → Forrester recognition → resources → final CTA → footer", cards: "icon-top + headline + desc + screenshot, 6-col; framework 9-grid; testimonial quote+logo+headshot", buttons: "primary solid navy 'Get a demo' (×5), text+arrow secondary", footer: "6 columns + compliance badges (SOC2/ISO/GDPR)" },
    visuals: { palette: "white/off-white + Vanta purple #AC55FF + green checks", type: "geometric sans, corporate-clean", cornersElevation: "rounded 8–12px, subtle shadows", motion: "moderate, scroll reveals", imagery: "real product UI + headshots/logos" },
    signatures: ["headline literally sells 'trust'", "compliance badges baked into footer as permanent credibility", "analyst recognition + 16k-customer count"] },

  { name: "Carta", url: "https://carta.com", category: "equity / cap-table", designLanguage: "editorial-trust",
    structure: { nav: "logo-L, product dropdowns, Log in + Get started-R", hero: "split, platform-positioning headline, 'trusted by 50,000+ companies / 2.5M shareholders'", sectionOrder: "hero → logo proof → product pillars → segment solutions → testimonials/stats → resources → CTA → footer", cards: "product-pillar cards w/ isometric illustrations", buttons: "primary solid, outline/text secondary", footer: "large multi-column + legal/compliance" },
    visuals: { palette: "warm neutral + warm accent (coral/pink-leaning)", type: "editorial serif heads + sans body", cornersElevation: "rounded, soft shadows; flat illustration", motion: "moderate scroll", imagery: "signature isometric line illustrations (300+ component lib)" },
    signatures: ["big quantified scale (50,000+ companies)", "custom isometric illustration = organizational maturity", "serif headlines = institutional gravitas"] },

  { name: "Betterment", url: "https://betterment.com", category: "robo-advisor (wealth)", designLanguage: "soft-friendly",
    structure: { nav: "fixed, mega-menu, Log In + CTA-R", hero: "split (text-L / lifestyle photo-R), 'Build your wealth in the background', 2 stacked primaries, WSJ/NerdWallet/4.8(78.1K) badges", sectionOrder: "hero+badges → 3-card accounts → self-directed → automated → cash → IRA → testimonial carousel → FAQ accordion → final CTA", cards: "3-col account cards icon+headline+desc+arrow", buttons: "primary solid rounded, blue link+arrow secondary", footer: "5–6 columns + disclosures + app badges" },
    visuals: { palette: "white/light + blue + gray bands", type: "clean sans, uppercase section labels", cornersElevation: "6–8px rounded, flat", motion: "minimal, reduced-motion-friendly", imagery: "lifestyle photography + dashboard UI + award badges" },
    signatures: ["third-party awards/ratings stacked in hero", "FAQ accordion preempts objections", "'in the background' reassurance framing"] },

  { name: "Wealthfront", url: "https://wealthfront.com", category: "automated investing/banking", designLanguage: "fintech-clean",
    structure: { nav: "sticky, center links, Log in + Get started-R", hero: "split (text-L / product or photo-R), benefit headline, 1 primary", sectionOrder: "hero → cash APY → trust metrics (1.4M+ clients, $95B+) → automated investing + perf graph → award logos → stock investing → life-stages → Forbes quote → FAQ → footer", cards: "modular full-width product blocks headline+copy+screenshot+CTA; collapsible life-stage", buttons: "primary solid rounded, 'Learn more' text secondary", footer: "multi-column" },
    visuals: { palette: "white/neutral + soft pastel gradient circles + blue", type: "clean sans, display heads", cornersElevation: "8–12px rounded, subtle/flat", motion: "light", imagery: "mobile dashboard UI + photography + gradients" },
    signatures: ["hard metrics as headline proof ($95B+/1.4M+)", "'zero sales pressure' anti-pushy positioning", "named press/award logos"] },

  { name: "Selma", url: "https://selma.com", category: "Swiss robo-advisor (FINMA)", designLanguage: "swiss-clean",
    structure: { nav: "sticky, links, Sign up + Log in, generous whitespace", hero: "split (text-L / phone mockup-R), 'Make your money work for you', 1 primary, 4.6 / 350+ reviews / '+15,000 happy clients'", sectionOrder: "hero → press logos (HZ/FuW/SRF) → 3 feature cards → tier comparison → Selma-vs-Bank-vs-Robo table → investor logos → awards → 5-step how-it-works → testimonials → FAQ → app badges → footer", cards: "3-col illustration + headline + Learn-more", buttons: "primary 'Get started free' repeated, teal 'Learn more' secondary", footer: "multi-column + FINMA/OSFIN regulatory badges + Impressum" },
    visuals: { palette: "white/light + teal/cyan", type: "clean display sans, high contrast", cornersElevation: "8–12px rounded, subtle shadow", motion: "mostly static + testimonial carousel", imagery: "phone UI mockups + friendly step illustrations + headshots" },
    signatures: ["FINMA regulatory badges in footer (direct Treuhänder analog)", "comparison table positioning (vs Bank vs Robo)", "Swiss press logos + rating count = localized credibility"] },

  { name: "bexio", url: "https://www.bexio.com", category: "Swiss SME admin/accounting", designLanguage: "swiss-clean",
    structure: { nav: "audience split (Für Unternehmer / Für Treuhänder) + mega-menus, language + Login, sticky, Kostenlos testen", hero: "centered benefit headline, 2 CTAs (trial + 1-min video), '4.0 / 1930+ reviews' + '100,000+ KMU' + logos IN hero", sectionOrder: "hero → logos → 4 benefit pillars (Zeit/Swiss-Made/Support) → 4 feature cards w/ screenshots → testimonial carousel → bexio Pay → success stories → 4 blog cards → partner logos → final CTA → footer", cards: "feature 4-col screenshot+label; blog 4-col image+tag+headline; testimonial carousel; success image+logo overlay", buttons: "primary solid teal, arrow/underline text secondary, repeated 3×", footer: "6 cols (Unternehmer/Treuhänder/Über uns/News/Hilfe/Legal)" },
    visuals: { palette: "white + teal/turquoise", type: "clean sans, sparing all-caps", cornersElevation: "subtle rounding, light card shadows", motion: "moderate carousels/hover/video", imagery: "real product UI + customer photography + logos" },
    signatures: ["dual-audience nav split (SME vs fiduciary) — directly relevant", "review-score + customer-count inside hero", "Swiss-Made trust pillar as explicit section"] },

  { name: "Numarics", url: "https://www.numarics.com", category: "Swiss fiduciary/accounting platform", designLanguage: "swiss-clean",
    structure: { nav: "logo-L, Solutions/Services/Platform/API menus, language toggle, demo CTA", hero: "centered benefit headline, product + Demo CTAs, illustrative graphics", sectionOrder: "hero → 4 audience solution cards (Founding/Freelancer/Start-up/Enterprise) → services grid (Payroll/Bookkeeping/Statements/Tax/VAT) → 7 platform-module cards → testimonials → footer", cards: "audience cards clickable; service grid text+arrow; platform modules icon+label; ~16px radius subtle shadow", buttons: "rounded 8–12px icon+text, teal primary", footer: "multi-column + newsletter + app badges + awards + 6 social" },
    visuals: { palette: "deep navy + bright teal/turquoise on white", type: "modern sans", cornersElevation: "rounded 8–16px, subtle shadow", motion: "light/moderate", imagery: "custom SVG icons + product UI + geometric illustration + photography" },
    signatures: ["audience-segmented entry cards (life-stage founding→enterprise)", "service-catalogue grid mapping to fiduciary deliverables (payroll/VAT/tax)", "navy+teal = closest direct Treuhänder template"] },

  { name: "Linear", url: "https://linear.app", category: "UI-craft benchmark (project mgmt)", designLanguage: "dark-premium",
    structure: { nav: "logo-L, links, Docs/Open app/Log in/Sign up-R, sticky", hero: "centered, 'product development system for teams and agents', dual CTA (dark primary + → link), 3 staggered product screenshots", sectionOrder: "hero → Intake → Plan → Build → Diffs → Monitor → changelog → 3 testimonials → '33,000 teams' → final CTA → footer", cards: "issue cards (charcoal #0f1011 + hairline borders), testimonial quote blocks, changelog", buttons: "primary dark bg/white text + →, link-style secondary", footer: "6 columns" },
    visuals: { palette: "near-black #010102 + light-gray text + single lavender-blue #5e6ad2 accent", type: "custom geometric sans 500–700, negative tracking", cornersElevation: "subtle 4–8px; HAIRLINE BORDERS carry structure; multi-layer shadow on floating UI", motion: "high craft: ambient gradient blobs, mouse-tracking spotlights", imagery: "real product UI in dark panels only" },
    signatures: ["single restrained accent on near-monochrome", "hairline borders instead of shadows", "sequential feature sections each anchored by one screenshot"] },

  { name: "Notion", url: "https://www.notion.com", category: "UI-craft benchmark (workspace)", designLanguage: "soft-friendly",
    structure: { nav: "sticky dark, menus-C, Get Notion free + Log in-R", hero: "split, 'Meet the night shift', dual CTA (light primary + → secondary), 'Trusted by 98% Forbes Cloud 100' + 15 logos", sectionOrder: "hero → agent feature cards → use-case thumbnails → Agent → Enterprise Search → AI Notes → Docs/KB/Projects → testimonials w/ logos → stats → footer", cards: "feature icon + headline + desc columns; case studies image + overlay + Read-story", buttons: "primary white/light bg dark text rounded, text+→ secondary", footer: "4 columns + language + 5 social" },
    visuals: { palette: "black/dark-gray bg + white UI, high contrast", type: "clean sans, hierarchical", cornersElevation: "moderate rounding, flat minimal shadow", motion: "hero video + logo carousel", imagery: "product screenshots + logos + brand photography + illustrated icons" },
    signatures: ["Forbes-100 social proof in hero", "mixed media (illustration + UI + photography) under one warm voice", "icon-led feature-card grid"] },

  { name: "Vercel", url: "https://vercel.com", category: "UI-craft benchmark (dev cloud)", designLanguage: "data-precise",
    structure: { nav: "sticky dark, dropdowns, Ask-AI search + Log in/Sign up-R, event callout", hero: "centered, 'Build and deploy on the AI Cloud', 2 CTAs (Deploy + Demo), logos + perf metrics (7m→40s)", sectionOrder: "hero → use-case tabs → product cards → framework showcase → infra → AI Gateway w/ code → templates → CTA cluster → footer", cards: "product cards icon+title+desc; tabbed use-cases; dot-indicator grids", buttons: "primary solid + arrow, text+→ secondary", footer: "dense multi-column + social" },
    visuals: { palette: "off-white #fafafa / near-black #171717 (never pure black) + hairline borders + one mesh gradient at hero", type: "Geist geometric grotesque, aggressive negative tracking -0.06em, Geist Mono", cornersElevation: "moderate radius; HAIRLINE BORDERS over shadows; flat", motion: "pulsing status dots, smooth theme transition, interactive code", imagery: "real product UI + code blocks + abstract triangles" },
    signatures: ["hard performance metrics as hero trust", "hairline-border structure + single mesh-gradient moment", "Geist tight-tracked headlines = engineered precision"] },
];

export const referenceByLanguage = (lang: string) => referenceSites.filter((s) => s.designLanguage === lang);
