/**
 * Variant registry — the "parts bin" the generator chooses from.
 * Each variant declares the looks (styleAffinity) it fits, so the selector only
 * ever picks variants compatible with the active palette. Add a new variant here
 * and the generator can immediately choose it.
 */
import type React from "react";
import type { StyleAffinity } from "../component-inventory";
import type { HeroContent } from "../content/types";
import type { PrimaryStyle } from "../structures/primitives";
import { HeroSplit } from "../structures/HeroSplit";
import { HeroCentered } from "../structures/HeroCentered";
import { HeroTextLeft } from "../structures/HeroTextLeft";
import { HeroGradient } from "../structures/HeroGradient";
import { HeroImageCentered, HeroImageSplit, HeroImageFull } from "../structures/HeroImage";
import {
  HeroFactband, HeroSpotlight, HeroSideMeta, HeroOverline, HeroColumnsDivider,
  HeroFramed, HeroMinimalType, HeroOffsetAside, HeroRibbon, HeroQuoteLead,
} from "../structures/HeroExtended";
import {
  HeroCenteredCard, HeroSplitReverse, HeroTwoLine, HeroStackedCta, HeroBanner,
  HeroPortraitFrame, HeroDarkSplit, HeroGridBg, HeroChapter, HeroAsideStat,
} from "../structures/HeroExtended2";
import {
  type PageHeaderProps,
  PageHeaderBrandBand, PageHeaderEditorial, PageHeaderTintWash, PageHeaderDarkPanel,
  PageHeaderPhotoSignature, PageHeaderPhotoSplit, PageHeaderPhotoCard,
} from "../structures/PageHeaderVariants";
import { Services } from "../structures/Services";
import { ServicesBordered } from "../structures/ServicesBordered";
import { ServicesAccordion } from "../structures/ServicesAccordion";
import {
  ServicesNumberedList, ServicesAlternating, ServicesBento, ServicesSplitList, ServicesChecklist,
  ServicesTabs, ServicesMinimal, ServicesTimeline, ServicesPriceList, ServicesFeatureSplit,
} from "../structures/ServicesExtended";
import {
  ServicesIconCards, ServicesListArrow, ServicesGrid4, ServicesPillTabs, ServicesStepper,
  ServicesMediaCards, ServicesWatermark, ServicesTwoColRows, ServicesBannerList, ServicesZebra,
} from "../structures/ServicesExtended2";
import { CtaBand } from "../structures/CtaBand";
import { CtaSplit } from "../structures/CtaSplit";
import { CtaGradient } from "../structures/CtaGradient";
import {
  CtaBoxed, CtaInverted, CtaOffsetCard, CtaLeftRule, CtaBordered,
  CtaSideline, CtaBig, CtaPanelDark, CtaAsymmetric, CtaSlim,
} from "../structures/CtaExtended";
import {
  CtaGradientSplit, CtaDarkSplit, CtaElevatedCard, CtaMinimalLine, CtaCornerFrame,
  CtaEyebrowBand, CtaBadge, CtaStackedCenter, CtaSidebar, CtaTwoTone,
} from "../structures/CtaExtended2";
import { Testimonials } from "../structures/Testimonials";
import { TestimonialsCarousel } from "../structures/TestimonialsCarousel";
import {
  TestimonialsSpotlight, TestimonialsTwoCol, TestimonialsStacked, TestimonialsBordered, TestimonialsQuoteWall,
  TestimonialsSplitRating, TestimonialsAlternating, TestimonialsRail, TestimonialsNumbered, TestimonialsFeatureSide,
} from "../structures/TestimonialsExtended";
import {
  TestimonialsBigQuote, TestimonialsAvatarCards, TestimonialsMasonry, TestimonialsDark, TestimonialsMinimalList,
  TestimonialsRatingHeader, TestimonialsZigzagAvatar, TestimonialsMarquee, TestimonialsStars, TestimonialsPanel,
} from "../structures/TestimonialsExtended2";
import { Values } from "../structures/Values";
import { ValuesCards } from "../structures/ValuesCards";
import {
  ValuesNumberedRows, ValuesRowsIcon, ValuesAccordion, ValuesAlternating, ValuesSplitIntro,
  ValuesBigIndex, ValuesTiles, ValuesMinimal, ValuesInlineList, ValuesCheckList,
} from "../structures/ValuesExtended";
import {
  ValuesIconCircle, ValuesTimeline, ValuesBorderedGrid, ValuesQuote, ValuesBanner,
  ValuesStepper, ValuesFeature, ValuesZebra, ValuesPillHeaders, ValuesTopAccent,
} from "../structures/ValuesExtended2";
import { Stats } from "../structures/Stats";
import { StatsPanel } from "../structures/StatsPanel";
import {
  StatsBigNumbers, StatsRows, StatsInline, StatsCards, StatsDark,
  StatsLeading, StatsLabelTop, StatsChips, StatsTelemetry, StatsGradientBand,
} from "../structures/StatsExtended";
import {
  StatsRing, StatsBorderedCards, StatsUnderline, StatsProgress, StatsStackedBig,
  StatsTintCards, StatsOutlineNumbers, StatsPlainDivide, StatsBadgePills, StatsHeadlinePair,
} from "../structures/StatsExtended2";
import { Team } from "../structures/Team";
import { TeamRows } from "../structures/TeamRows";
import { TeamPlain } from "../structures/TeamPlain";
import {
  TeamCircles, TeamMinimalGrid, TeamSpotlight, TeamBordered, TeamOverlay,
  TeamTwoCol, TeamListRight, TeamAlternating, TeamCompact4, TeamQuoteCard,
} from "../structures/TeamExtended";
import {
  TeamGridPhoto, TeamPolaroid, TeamDuo, TeamStrip, TeamBadgeRole,
  TeamCenteredBio, TeamNumbered, TeamMasonry, TeamSplitLead, TeamCircleRow,
} from "../structures/TeamExtended2";
import { Faq } from "../structures/Faq";
import { FaqGrid } from "../structures/FaqGrid";
import {
  GalleryGrid, GalleryMosaic, GalleryCarousel, GalleryFullBleed, GallerySplitMedia,
  GalleryStrip, GalleryLogoStrip, GalleryFramed, GalleryDuo, GalleryFeature,
} from "../structures/GalleryExtended";
import {
  GalleryMasonry, GalleryCollage, GalleryCircles, GalleryPolaroid, GalleryTriptych,
  GalleryMarquee, GalleryShowcase, GalleryFrameSingle, GalleryRoundedGrid, GalleryBandOverlay,
} from "../structures/GalleryExtended2";
import {
  FaqNumbered, FaqBordered, FaqSplitIntro, FaqControlled, FaqCards,
  FaqMinimal, FaqInlineDl, FaqBubble, FaqBigQuestions, FaqTwoColAccordion,
} from "../structures/FaqExtended";
import {
  FaqIconQ, FaqTimeline, FaqZebra, FaqThreeCol, FaqCardsBordered,
  FaqQuoteAnswers, FaqNumberedCards, FaqCompact, FaqHighlightFirst, FaqCentered,
} from "../structures/FaqExtended2";
import { Pricing } from "../structures/Pricing";
import {
  PricingRows, PricingMinimal, PricingCenterFeatured, PricingDark, PricingGradientFeatured,
  PricingBordered, PricingPanel, PricingStacked, PricingOutline, PricingRibbon,
  PricingNumbered, PricingHeadlinePrice, PricingSplitFeature, PricingCompact, PricingChecklistRows,
  PricingTwoColFeatures, PricingRail, PricingTabs, PricingPills, PricingSoftCards, PricingTable,
} from "../structures/PricingExtended";
import { Contact } from "../structures/Contact";
import {
  PartnersStrip, PartnersLeftLabel, PartnersStacked, PartnersGrid, PartnersBordered,
  PartnersMarquee, PartnersCards, PartnersDark, PartnersTwoRows, PartnersPills,
  PartnersDivided, PartnersHeading, PartnersInline, PartnersBadgesLarge, PartnersSplit,
  PartnersTinted, PartnersChecklist, PartnersColumns, PartnersScroller, PartnersMinimal,
  PartnersBoxed, PartnersTagLabel,
} from "../structures/PartnersExtended";
import {
  ContactStacked, ContactInfoLeft, ContactCardForm, ContactSplitDark, ContactMinimal,
  ContactBoxed, ContactCentered, ContactInfoGrid, ContactCompact, ContactTinted,
  ContactBigHeading, ContactInfoCards, ContactDarkForm, ContactTwoCol, ContactRail,
  ContactFloatingCard, ContactTopRule, ContactLocation, ContactQuickActions, ContactInlineForm,
  ContactHeadingInfoForm,
} from "../structures/ContactExtended";
import {
  ProcessNumberedRows, ProcessTimeline, ProcessHorizontal, ProcessCards, ProcessConnectedCards,
  ProcessZigzag, ProcessBigIndex, ProcessStepperBar, ProcessArrowFlow, ProcessAccordion,
  ProcessSplitIntro, ProcessMinimal, ProcessDark, ProcessChips, ProcessDottedVertical,
  ProcessTwoCol, ProcessBordered, ProcessTinted, ProcessFeatureFirst, ProcessRail,
  ProcessUnderlineNumbers, ProcessStackedBig,
} from "../structures/ProcessExtended";
import {
  AudienceCards, AudienceBordered, AudienceTiles, AudienceRows, AudienceSplitIntro,
  AudienceBigLetter, AudienceChecklist, AudienceTwoCol, AudienceMinimal, AudienceDark,
  AudienceTinted, AudiencePillHeaders, AudienceFeatureFirst, AudienceColumns, AudienceAccordion,
  AudienceAlternating, AudienceBanner, AudienceRail, AudienceDots, AudienceQuote,
  AudienceTopAccent, AudienceInlineList,
} from "../structures/AudienceExtended";
import {
  AboutSplit, AboutCentered, AboutTwoColParagraphs, AboutHighlightsBar, AboutLeadQuote,
  AboutSidebar, AboutBordered, AboutDark, AboutTinted, AboutMinimal,
  AboutEyebrowRule, AboutColumns, AboutHighlightsCards, AboutFeatureLead, AboutCenteredHighlights,
  AboutOffset, AboutBandHighlights, AboutStackedBig, AboutInlineStats, AboutQuietProse,
  AboutLeadHighlightsSplit, AboutMilestones,
} from "../structures/AboutExtended";
import {
  FeatureSplitLeft, FeatureSplitRight, FeatureWideImage, FeatureOverlapCard, FeatureBordered,
  FeatureTinted, FeatureImageTop, FeatureDark, FeatureOffsetFrame, FeatureRounded,
  FeatureBandFull, FeatureCaption, FeatureTwoThirds, FeatureMinimal, FeatureChipOverlay,
  FeatureStatement,
} from "../structures/FeatureExtended";

export interface VariantDef<P> {
  id: string;
  component: React.FC<{ content: P }>;
  looks: StyleAffinity[]; // "any" = fits every look
  /** Minimum items this layout needs to look full (default 1). */
  min?: number;
  /** Only pick when a real image exists (else the variant shows a placeholder). */
  needsImage?: boolean;
  note?: string;
}

/** Hero section structures. */
export const heroVariants: VariantDef<HeroContent>[] = [
  { id: "hero/split",     component: HeroSplit,    looks: ["editorial", "warm"],          note: "split text + aside quote/credential" },
  { id: "hero/centered",  component: HeroCentered, looks: ["soft", "swiss"],              note: "centered benefit + in-hero rating badge" },
  { id: "hero/text-left", component: HeroTextLeft, looks: ["swiss", "warm", "editorial"], note: "type-only, left-aligned on tinted band" },
  { id: "hero/gradient",  component: HeroGradient, looks: ["soft", "swiss"],              note: "premium animated mesh-gradient (Stripe/Vercel pattern)" },
  { id: "hero/image-centered", component: HeroImageCentered, looks: ["soft", "swiss", "warm"], needsImage: true, note: "centered text over textured image bg" },
  { id: "hero/image-split",    component: HeroImageSplit,    looks: ["editorial", "warm", "soft"], needsImage: true, note: "text left + vivid image block right" },
  { id: "hero/image-full",     component: HeroImageFull,     looks: ["soft", "swiss"],            needsImage: true, note: "full-bleed image + scrim, light text" },
  { id: "hero/factband",       component: HeroFactband,      looks: ["editorial", "swiss"],          note: "centered + attached hairline credential bar" },
  { id: "hero/spotlight",      component: HeroSpotlight,     looks: ["swiss", "soft"],               note: "inverted dark surface, light centered text" },
  { id: "hero/side-meta",      component: HeroSideMeta,      looks: ["warm", "editorial"],           note: "text left + telemetry label→value card right" },
  { id: "hero/overline",       component: HeroOverline,      looks: ["editorial", "warm"],           note: "editorial masthead: rule + big headline + lede/CTA split" },
  { id: "hero/columns",        component: HeroColumnsDivider, looks: ["swiss", "editorial"],         note: "headline | hairline divider | lede+CTA" },
  { id: "hero/framed",         component: HeroFramed,        looks: ["editorial", "swiss"],          note: "content in a bordered box with divided footer strip" },
  { id: "hero/minimal",        component: HeroMinimalType,   looks: ["soft", "swiss"],               note: "type-forward: oversized headline, single CTA" },
  { id: "hero/offset-aside",   component: HeroOffsetAside,   looks: ["soft", "warm"],                note: "text left + layered offset quote panels right" },
  { id: "hero/ribbon",         component: HeroRibbon,        looks: ["soft", "swiss"],               note: "centered + bottom marquee trust ribbon" },
  { id: "hero/quote-lead",     component: HeroQuoteLead,     looks: ["editorial", "warm", "swiss"],  note: "large pull-quote leads, headline/CTA beneath" },
  { id: "hero/centered-card",  component: HeroCenteredCard,  looks: ["soft", "swiss"],               note: "centered content in a floating card on tinted band" },
  { id: "hero/split-reverse",  component: HeroSplitReverse,  looks: ["editorial", "warm", "swiss"],  note: "mirror split: quote left, text right" },
  { id: "hero/two-line",       component: HeroTwoLine,       looks: ["soft", "swiss"],               note: "type-forward, accent word on its own line" },
  { id: "hero/stacked-cta",    component: HeroStackedCta,    looks: ["soft", "warm"],                note: "centered, vertically stacked full-width CTAs" },
  { id: "hero/banner",         component: HeroBanner,        looks: ["swiss", "editorial"],          note: "compact wide banner, headline left + CTA right" },
  { id: "hero/portrait-frame", component: HeroPortraitFrame, looks: ["warm", "soft"],                needsImage: true, note: "text left + offset framed photo right" },
  { id: "hero/dark-split",     component: HeroDarkSplit,     looks: ["swiss", "soft"],               note: "inverted dark split, light text + glass card" },
  { id: "hero/grid-bg",        component: HeroGridBg,        looks: ["swiss", "soft"],               note: "centered over masked dotted-grid background" },
  { id: "hero/chapter",        component: HeroChapter,       looks: ["editorial", "swiss"],          note: "numbered chapter opener with rule" },
  { id: "hero/aside-stat",     component: HeroAsideStat,     looks: ["warm", "editorial"],           note: "text left + single focal credential panel right" },
];

/** Subpage header building blocks — ONE is picked per firm so every subpage shares
 *  the same header (home uses the hero; the contact page has none). Title-only,
 *  brand-forward. `needsImage` photo blocks front the firm's real image and fall
 *  back to a sibling band per page when a given page has none. */
export interface PageHeaderVariant { id: string; component: React.FC<PageHeaderProps>; looks: StyleAffinity[]; needsImage?: boolean; }
export const pageHeaderVariants: PageHeaderVariant[] = [
  { id: "page-header/brand-band",      component: PageHeaderBrandBand,      looks: ["any"] },
  { id: "page-header/editorial",       component: PageHeaderEditorial,      looks: ["editorial", "swiss", "warm"] },
  { id: "page-header/tint-wash",       component: PageHeaderTintWash,       looks: ["soft", "warm", "swiss"] },
  { id: "page-header/dark-panel",      component: PageHeaderDarkPanel,      looks: ["swiss", "editorial", "soft"] },
  { id: "page-header/photo-signature", component: PageHeaderPhotoSignature, looks: ["any"], needsImage: true },
  { id: "page-header/photo-split",     component: PageHeaderPhotoSplit,     looks: ["editorial", "warm", "soft", "swiss"], needsImage: true },
  { id: "page-header/photo-card",      component: PageHeaderPhotoCard,      looks: ["soft", "swiss", "warm"], needsImage: true },
];

/** Primary-button looks (rendered via PrimaryStyle context). */
export interface StyleVariant { id: PrimaryStyle; looks: StyleAffinity[]; }
export const primaryStyleVariants: StyleVariant[] = [
  { id: "solid",    looks: ["any"] },
  { id: "sharp",    looks: ["swiss", "warm"] },
  { id: "pill",     looks: ["soft"] },
  { id: "bloom",    looks: ["soft"] },
  { id: "mono",     looks: ["editorial", "swiss", "warm"] },
  { id: "gradient", looks: ["soft", "swiss"] },
  { id: "soft",     looks: ["soft", "warm"] },
  { id: "ghost",    looks: ["editorial", "warm", "swiss"] },
  { id: "bordered", looks: ["editorial", "swiss"] },
  { id: "link",     looks: ["editorial", "warm"] },
  { id: "outlineBold", looks: ["editorial", "swiss"] },
  { id: "pillOutline", looks: ["soft", "warm"] },
  { id: "offset",      looks: ["soft", "swiss"] },     // hard offset shadow (neo-brutalist)
  { id: "glass",       looks: ["soft", "swiss"] },     // translucent tint + backdrop blur
  { id: "elevated",    looks: ["soft", "warm"] },      // deep neutral drop shadow
  { id: "inset",       looks: ["swiss", "editorial"] }, // pressed inset highlight
  { id: "slab",        looks: ["swiss", "warm", "editorial"] }, // square + thick bottom accent
  { id: "notch",       looks: ["swiss", "soft"] },     // clipped/chamfered corner
  { id: "ring",        looks: ["soft", "editorial"] }, // outline + soft outer ring
  { id: "chip",        looks: ["soft", "warm"] },      // compact soft-tint pill
  { id: "gradientBorder", looks: ["soft", "swiss"] },  // gradient border, transparent fill
  { id: "gradientPill",   looks: ["soft", "swiss"] },  // gradient fill, pill radius
  { id: "dashed",         looks: ["editorial", "warm"] }, // dashed outline
  { id: "bevel",          looks: ["swiss", "soft"] },  // chamfered corners
  { id: "surfaceCard",    looks: ["editorial", "warm", "swiss"] }, // white-card secondary
  { id: "tintBorder",     looks: ["soft", "warm"] },   // tint fill + primary border
  { id: "xl",             looks: ["swiss", "soft"] },  // oversized solid
  { id: "wide",           looks: ["swiss", "editorial"] }, // extreme letter-spacing
  { id: "underlineThick", looks: ["editorial", "warm"] }, // thick underline link
  { id: "raisedPill",     looks: ["soft", "warm"] },   // pill + deep elevation
];

/** Section-level variants — multiple structures per slot, picked by affinity.
 *  All variants for a slot accept the same content slice. */
export interface SectionVariant { id: string; component: React.FC<{ content: any }>; looks: StyleAffinity[]; min?: number; needsImage?: boolean; }
export const sectionVariants: Record<string, SectionVariant[]> = {
  services: [
    { id: "services/cards", component: Services, looks: ["soft"], min: 3 },                 // rounded shadowed cards
    { id: "services/bordered", component: ServicesBordered, looks: ["editorial", "swiss", "warm"] }, // hairline grid
    { id: "services/accordion", component: ServicesAccordion, looks: ["swiss", "editorial"] }, // single-open list
    { id: "services/numbered-list", component: ServicesNumberedList, looks: ["editorial", "swiss"] }, // full-width numbered rows
    { id: "services/alternating", component: ServicesAlternating, looks: ["warm", "editorial"] },     // zig-zag rows
    { id: "services/bento", component: ServicesBento, looks: ["soft", "swiss"], min: 4 },                     // asymmetric featured grid
    { id: "services/split-list", component: ServicesSplitList, looks: ["editorial", "warm"] },         // sticky heading + rows
    { id: "services/checklist", component: ServicesChecklist, looks: ["swiss", "editorial"] },         // large cards + bullets
    { id: "services/tabs", component: ServicesTabs, looks: ["warm", "soft"], min: 2 },                         // vertical tabs + detail
    { id: "services/minimal", component: ServicesMinimal, looks: ["soft", "swiss"] },                  // borderless top-rule grid
    { id: "services/timeline", component: ServicesTimeline, looks: ["swiss", "editorial"], min: 2 },           // vertical timeline
    { id: "services/price-list", component: ServicesPriceList, looks: ["editorial", "swiss"] },        // rate line-items
    { id: "services/feature-split", component: ServicesFeatureSplit, looks: ["soft", "warm"], min: 3 },        // featured panel + list
    { id: "services/icon-cards", component: ServicesIconCards, looks: ["soft", "warm"], min: 3 },              // circular badge cards
    { id: "services/list-arrow", component: ServicesListArrow, looks: ["editorial", "swiss"] },        // link rows + arrow
    { id: "services/grid-4", component: ServicesGrid4, looks: ["soft", "swiss"], min: 4 },                     // 4-col compact tiles
    { id: "services/pill-tabs", component: ServicesPillTabs, looks: ["soft", "warm"], min: 2 },                // horizontal pill tabs
    { id: "services/stepper", component: ServicesStepper, looks: ["swiss", "editorial"], min: 2 },             // numbered stepper
    { id: "services/media-cards", component: ServicesMediaCards, looks: ["warm", "soft"], min: 3, needsImage: true }, // image-top tall cards — only when every service has a photo (real or stock)
    { id: "services/watermark", component: ServicesWatermark, looks: ["editorial", "warm"] },          // faint index watermark
    { id: "services/two-col-rows", component: ServicesTwoColRows, looks: ["editorial", "swiss"], min: 2 },     // 2-col compact rows
    { id: "services/banner-list", component: ServicesBannerList, looks: ["swiss", "soft"] },           // tinted checklist band
    { id: "services/zebra", component: ServicesZebra, looks: ["warm", "editorial"] },                  // striped rows
  ],
  cta: [
    { id: "cta/centered", component: CtaBand, looks: ["any"] },
    { id: "cta/split", component: CtaSplit, looks: ["swiss", "warm", "editorial"] },
    { id: "cta/gradient", component: CtaGradient, looks: ["soft", "swiss"] }, // premium gradient band
    { id: "cta/boxed", component: CtaBoxed, looks: ["editorial", "swiss"] },         // framed bordered box
    { id: "cta/inverted", component: CtaInverted, looks: ["swiss", "soft"] },         // dark full band, light text
    { id: "cta/offset-card", component: CtaOffsetCard, looks: ["soft", "warm"] },     // card + offset block behind
    { id: "cta/left-rule", component: CtaLeftRule, looks: ["editorial", "warm"] },    // left-aligned + top accent rule
    { id: "cta/bordered", component: CtaBordered, looks: ["editorial", "swiss"] },    // hairline-bordered split box
    { id: "cta/sideline", component: CtaSideline, looks: ["swiss", "editorial"] },    // text | divider | button
    { id: "cta/big", component: CtaBig, looks: ["soft", "swiss"] },                   // oversized type, single CTA
    { id: "cta/panel-dark", component: CtaPanelDark, looks: ["soft", "warm"] },       // dark rounded card centered
    { id: "cta/asymmetric", component: CtaAsymmetric, looks: ["warm", "editorial"] }, // big heading left, sub+CTA right
    { id: "cta/slim", component: CtaSlim, looks: ["swiss", "soft"] },                 // slim inline strip
    { id: "cta/gradient-split", component: CtaGradientSplit, looks: ["soft", "swiss"] }, // gradient band split
    { id: "cta/dark-split", component: CtaDarkSplit, looks: ["swiss", "soft"] },         // dark band split
    { id: "cta/elevated-card", component: CtaElevatedCard, looks: ["soft", "warm"] },    // deep-shadow card
    { id: "cta/minimal-line", component: CtaMinimalLine, looks: ["editorial", "swiss"] }, // hairline minimal
    { id: "cta/corner-frame", component: CtaCornerFrame, looks: ["editorial", "warm"] },  // corner brackets
    { id: "cta/eyebrow-band", component: CtaEyebrowBand, looks: ["editorial", "swiss"] }, // eyebrow + rule
    { id: "cta/badge", component: CtaBadge, looks: ["soft", "warm"] },                    // pill badge above
    { id: "cta/stacked-center", component: CtaStackedCenter, looks: ["soft", "swiss"] },  // oversized centered
    { id: "cta/sidebar", component: CtaSidebar, looks: ["swiss", "editorial"] },          // heading + bordered button cell
    { id: "cta/two-tone", component: CtaTwoTone, looks: ["warm", "soft"] },               // two-tone split panels
  ],
  testimonials: [
    { id: "testimonials/grid", component: Testimonials, looks: ["editorial", "swiss", "warm"], min: 3 },
    { id: "testimonials/carousel", component: TestimonialsCarousel, looks: ["soft"], min: 3 }, // slider
    { id: "testimonials/spotlight", component: TestimonialsSpotlight, looks: ["editorial", "warm"] },        // single featured quote
    { id: "testimonials/two-col", component: TestimonialsTwoCol, looks: ["soft", "swiss"], min: 2 },                 // 2 large cards
    { id: "testimonials/stacked", component: TestimonialsStacked, looks: ["editorial", "swiss"], min: 2 },           // hairline rows
    { id: "testimonials/bordered", component: TestimonialsBordered, looks: ["editorial", "swiss", "warm"], min: 2 }, // zero-gap grid
    { id: "testimonials/quote-wall", component: TestimonialsQuoteWall, looks: ["soft", "swiss"], min: 4 },           // dense chips
    { id: "testimonials/split-rating", component: TestimonialsSplitRating, looks: ["swiss", "warm"], min: 2 },       // rating panel + quotes
    { id: "testimonials/alternating", component: TestimonialsAlternating, looks: ["warm", "editorial"], min: 2 },    // zig-zag rows
    { id: "testimonials/rail", component: TestimonialsRail, looks: ["soft", "warm"], min: 3 },                       // horizontal scroll rail
    { id: "testimonials/numbered", component: TestimonialsNumbered, looks: ["editorial", "swiss"], min: 2 },         // numbered list
    { id: "testimonials/feature-side", component: TestimonialsFeatureSide, looks: ["warm", "editorial"], min: 2 },   // featured + mini list
    { id: "testimonials/big-quote", component: TestimonialsBigQuote, looks: ["editorial", "warm"] },         // giant quote + watermark
    { id: "testimonials/avatar-cards", component: TestimonialsAvatarCards, looks: ["soft", "warm"], min: 3 },         // monogram avatar cards
    { id: "testimonials/masonry", component: TestimonialsMasonry, looks: ["soft", "editorial"], min: 4 },             // masonry columns
    { id: "testimonials/dark", component: TestimonialsDark, looks: ["swiss", "soft"], min: 2 },                       // inverted dark band
    { id: "testimonials/minimal-list", component: TestimonialsMinimalList, looks: ["editorial", "swiss"], min: 2 },   // borderless list
    { id: "testimonials/rating-header", component: TestimonialsRatingHeader, looks: ["swiss", "warm"], min: 2 },      // rating banner + cards
    { id: "testimonials/zigzag-avatar", component: TestimonialsZigzagAvatar, looks: ["warm", "soft"], min: 2 },       // zig-zag + avatar
    { id: "testimonials/marquee", component: TestimonialsMarquee, looks: ["soft", "swiss"], min: 4 },                 // auto-scroll marquee
    { id: "testimonials/stars", component: TestimonialsStars, looks: ["soft", "warm"], min: 3 },                      // 5-star cards
    { id: "testimonials/panel", component: TestimonialsPanel, looks: ["swiss", "warm"], min: 2 },                     // tinted panel, divided
  ],
  values: [
    { id: "values/columns", component: Values, looks: ["editorial", "swiss"], min: 2 },     // divided columns band
    { id: "values/cards", component: ValuesCards, looks: ["soft", "warm"], min: 3 },         // card grid
    { id: "values/numbered-rows", component: ValuesNumberedRows, looks: ["editorial", "swiss"], min: 2 }, // full-width numbered rows
    { id: "values/rows-icon", component: ValuesRowsIcon, looks: ["soft", "warm"], min: 2 },               // horizontal row cards
    { id: "values/accordion", component: ValuesAccordion, looks: ["swiss", "editorial"] },         // single-open accordion
    { id: "values/alternating", component: ValuesAlternating, looks: ["warm", "editorial"], min: 2 },      // zig-zag rows
    { id: "values/split-intro", component: ValuesSplitIntro, looks: ["editorial", "warm"] },       // heading + rows
    { id: "values/big-index", component: ValuesBigIndex, looks: ["soft", "swiss"] },               // oversized faint numbers
    { id: "values/tiles", component: ValuesTiles, looks: ["soft", "swiss"], min: 4 },                      // bento tiles
    { id: "values/minimal", component: ValuesMinimal, looks: ["soft", "swiss"], min: 3 },                  // borderless top-rule grid
    { id: "values/inline-list", component: ValuesInlineList, looks: ["editorial", "swiss"] },      // definition list
    { id: "values/checklist", component: ValuesCheckList, looks: ["swiss", "warm"], min: 3 },              // checkmark grid
    { id: "values/icon-circle", component: ValuesIconCircle, looks: ["soft", "warm"], min: 3 },             // circular dot cards
    { id: "values/timeline", component: ValuesTimeline, looks: ["swiss", "editorial"], min: 2 },            // vertical timeline
    { id: "values/bordered-grid", component: ValuesBorderedGrid, looks: ["editorial", "swiss"], min: 3 },   // zero-gap grid
    { id: "values/quote", component: ValuesQuote, looks: ["editorial", "warm"] },                   // italic statements
    { id: "values/banner", component: ValuesBanner, looks: ["swiss", "soft"], min: 2 },                     // tinted inline band
    { id: "values/stepper", component: ValuesStepper, looks: ["swiss", "editorial"], min: 2 },              // numbered stepper
    { id: "values/feature", component: ValuesFeature, looks: ["soft", "warm"], min: 2 },                    // featured + list
    { id: "values/zebra", component: ValuesZebra, looks: ["warm", "editorial"], min: 2 },                   // striped rows
    { id: "values/pill-headers", component: ValuesPillHeaders, looks: ["soft", "warm"], min: 3 },           // pill title + body
    { id: "values/top-accent", component: ValuesTopAccent, looks: ["soft", "swiss"], min: 3 },              // top accent cards
  ],
  stats: [
    { id: "stats/divided", component: Stats, looks: ["editorial", "swiss", "warm"] }, // bordered band
    { id: "stats/panel", component: StatsPanel, looks: ["soft"] },                    // tinted panel
    { id: "stats/big-numbers", component: StatsBigNumbers, looks: ["editorial", "swiss"], min: 2 }, // huge display numbers
    { id: "stats/rows", component: StatsRows, looks: ["editorial", "warm"] },               // value|label rows
    { id: "stats/inline", component: StatsInline, looks: ["swiss", "soft"] },               // compact inline strip
    { id: "stats/cards", component: StatsCards, looks: ["soft", "warm"] },                   // shadowed cards
    { id: "stats/dark", component: StatsDark, looks: ["swiss", "soft"] },                    // inverted dark band
    { id: "stats/leading", component: StatsLeading, looks: ["warm", "editorial"], min: 2 },          // featured + rest
    { id: "stats/label-top", component: StatsLabelTop, looks: ["soft", "editorial"] },       // label above number
    { id: "stats/chips", component: StatsChips, looks: ["soft", "swiss"] },                  // bordered pill chips
    { id: "stats/telemetry", component: StatsTelemetry, looks: ["warm", "editorial"] },      // label→value rows
    { id: "stats/gradient-band", component: StatsGradientBand, looks: ["soft", "swiss"] },   // gradient + light numbers
    { id: "stats/ring", component: StatsRing, looks: ["soft", "swiss"] },                     // circular SVG ring
    { id: "stats/bordered-cards", component: StatsBorderedCards, looks: ["editorial", "swiss"] }, // bordered cards
    { id: "stats/underline", component: StatsUnderline, looks: ["editorial", "warm"] },       // number + accent underline
    { id: "stats/progress", component: StatsProgress, looks: ["soft", "swiss"] },             // number + progress bar
    { id: "stats/stacked-big", component: StatsStackedBig, looks: ["editorial", "swiss"], min: 2 },   // left-aligned huge stack
    { id: "stats/tint-cards", component: StatsTintCards, looks: ["soft", "warm"] },           // primary-soft cards
    { id: "stats/outline-numbers", component: StatsOutlineNumbers, looks: ["swiss", "soft"] }, // stroked numerals
    { id: "stats/plain-divide", component: StatsPlainDivide, looks: ["editorial", "swiss"] }, // vertical hairline cells
    { id: "stats/badge-pills", component: StatsBadgePills, looks: ["soft", "warm"] },         // bordered pills + dot
    { id: "stats/headline-pair", component: StatsHeadlinePair, looks: ["warm", "editorial"], min: 2 }, // number+label pairs
  ],
  team: [
    { id: "team/cards", component: Team, looks: ["soft", "warm"], min: 3 },                  // monogram cards
    { id: "team/rows", component: TeamRows, looks: ["editorial", "swiss"] },         // list rows
    { id: "team/plain", component: TeamPlain, looks: [] },                           // text-only, NO photo tiles — forced by the selector when the firm has no person photos

    { id: "team/circles", component: TeamCircles, looks: ["soft", "warm"], min: 3 },               // round avatars
    { id: "team/minimal-grid", component: TeamMinimalGrid, looks: ["soft", "swiss"], min: 3 },     // compact, no bio
    { id: "team/spotlight", component: TeamSpotlight, looks: ["warm", "editorial"], min: 2 },       // featured + rest
    { id: "team/bordered", component: TeamBordered, looks: ["editorial", "swiss"], min: 3 },        // zero-gap grid
    { id: "team/overlay", component: TeamOverlay, looks: ["soft", "warm"], min: 2 },                // photo + scrim caption
    { id: "team/two-col", component: TeamTwoCol, looks: ["warm", "soft"], min: 2 },                 // 2-col large cards
    { id: "team/list-right", component: TeamListRight, looks: ["editorial", "swiss"] },     // rows, avatar right
    { id: "team/alternating", component: TeamAlternating, looks: ["warm", "editorial"], min: 2 },   // zig-zag large rows
    { id: "team/compact-4", component: TeamCompact4, looks: ["soft", "swiss"], min: 4 },            // 4-col compact
    { id: "team/quote-card", component: TeamQuoteCard, looks: ["editorial", "warm"] },      // bio-as-quote
    { id: "team/grid-photo", component: TeamGridPhoto, looks: ["soft", "swiss"], min: 4 },           // square photo grid
    { id: "team/polaroid", component: TeamPolaroid, looks: ["warm", "soft"], min: 3 },               // tilted polaroid frames
    { id: "team/duo", component: TeamDuo, looks: ["warm", "editorial"], min: 2 },                    // big portrait + bio
    { id: "team/strip", component: TeamStrip, looks: ["swiss", "soft"], min: 4 },                    // horizontal photo strip
    { id: "team/badge-role", component: TeamBadgeRole, looks: ["soft", "warm"], min: 3 },            // role pill cards
    { id: "team/centered-bio", component: TeamCenteredBio, looks: ["editorial", "warm"] },   // centered avatar + bio
    { id: "team/numbered", component: TeamNumbered, looks: ["editorial", "swiss"], min: 2 },         // numbered avatar list
    { id: "team/masonry", component: TeamMasonry, looks: ["soft", "editorial"], min: 4 },            // masonry cards
    { id: "team/split-lead", component: TeamSplitLead, looks: ["warm", "editorial"], min: 2 },       // lead portrait + grid
    { id: "team/circle-row", component: TeamCircleRow, looks: ["soft", "swiss"], min: 4 },           // compact circle row
  ],
  faq: [
    { id: "faq/accordion", component: Faq, looks: ["any"] },                         // single-open accordion
    { id: "faq/grid", component: FaqGrid, looks: ["editorial", "swiss"], min: 2 },           // static 2-col
    { id: "faq/numbered", component: FaqNumbered, looks: ["editorial", "swiss"] },          // numbered rows
    { id: "faq/bordered", component: FaqBordered, looks: ["editorial", "swiss", "warm"], min: 2 },  // zero-gap grid
    { id: "faq/split-intro", component: FaqSplitIntro, looks: ["editorial", "warm"] },      // heading + accordion
    { id: "faq/controlled", component: FaqControlled, looks: ["swiss", "soft"] },           // single-open +/-
    { id: "faq/cards", component: FaqCards, looks: ["soft", "warm"], min: 2 },                       // shadowed cards
    { id: "faq/minimal", component: FaqMinimal, looks: ["soft", "swiss"] },                  // borderless column
    { id: "faq/inline-dl", component: FaqInlineDl, looks: ["editorial", "swiss"] },          // definition list
    { id: "faq/bubble", component: FaqBubble, looks: ["soft", "warm"] },                     // chat bubbles
    { id: "faq/big-questions", component: FaqBigQuestions, looks: ["editorial", "warm"] },   // large question type
    { id: "faq/two-col-accordion", component: FaqTwoColAccordion, looks: ["swiss", "soft"], min: 2 }, // 2-col accordion
    { id: "faq/icon-q", component: FaqIconQ, looks: ["soft", "warm"] },                       // "?" badge rows
    { id: "faq/timeline", component: FaqTimeline, looks: ["swiss", "editorial"] },            // vertical timeline
    { id: "faq/zebra", component: FaqZebra, looks: ["warm", "editorial"] },                   // striped rows
    { id: "faq/three-col", component: FaqThreeCol, looks: ["editorial", "swiss"], min: 3 },           // static 3-col grid
    { id: "faq/cards-bordered", component: FaqCardsBordered, looks: ["swiss", "editorial"], min: 2 }, // bordered cards
    { id: "faq/quote-answers", component: FaqQuoteAnswers, looks: ["editorial", "warm"] },    // answer as quote
    { id: "faq/numbered-cards", component: FaqNumberedCards, looks: ["soft", "swiss"], min: 2 },       // numbered cards
    { id: "faq/compact", component: FaqCompact, looks: ["editorial", "swiss"], min: 2 },              // dense 2-col
    { id: "faq/highlight-first", component: FaqHighlightFirst, looks: ["soft", "warm"] },     // featured + accordion
    { id: "faq/centered", component: FaqCentered, looks: ["soft", "warm"] },                  // centered column
  ],
  pricing: [
    { id: "pricing/tiers", component: Pricing, looks: ["soft", "swiss", "warm"], min: 2 },             // recommended-ring tier cards
    { id: "pricing/rows", component: PricingRows, looks: ["editorial", "swiss"] },                     // horizontal rows
    { id: "pricing/minimal", component: PricingMinimal, looks: ["soft", "swiss"], min: 2 },            // borderless top-rule
    { id: "pricing/center-featured", component: PricingCenterFeatured, looks: ["soft", "warm"], min: 2 }, // centre tier scaled
    { id: "pricing/dark", component: PricingDark, looks: ["swiss", "soft"], min: 2 },                  // inverted dark band
    { id: "pricing/gradient-featured", component: PricingGradientFeatured, looks: ["soft", "swiss"], min: 2 }, // gradient recommended
    { id: "pricing/bordered", component: PricingBordered, looks: ["editorial", "swiss"], min: 2 },     // zero-gap grid
    { id: "pricing/panel", component: PricingPanel, looks: ["soft", "warm"], min: 2 },                 // tinted panel
    { id: "pricing/stacked", component: PricingStacked, looks: ["editorial", "warm"] },                // single-column wide
    { id: "pricing/outline", component: PricingOutline, looks: ["editorial", "swiss"], min: 2 },       // outline, reco filled
    { id: "pricing/ribbon", component: PricingRibbon, looks: ["soft", "warm"], min: 2 },               // corner ribbon
    { id: "pricing/numbered", component: PricingNumbered, looks: ["editorial", "swiss"], min: 2 },     // indexed tiers
    { id: "pricing/headline-price", component: PricingHeadlinePrice, looks: ["editorial", "warm"], min: 2 }, // price-forward
    { id: "pricing/split-feature", component: PricingSplitFeature, looks: ["soft", "warm"], min: 2 },  // featured + rest
    { id: "pricing/compact", component: PricingCompact, looks: ["soft", "swiss"], min: 2 },            // slim cards
    { id: "pricing/checklist-rows", component: PricingChecklistRows, looks: ["swiss", "editorial"] },  // rows + wrap checklist
    { id: "pricing/two-col-features", component: PricingTwoColFeatures, looks: ["soft", "swiss"], min: 2 }, // 2-col features
    { id: "pricing/rail", component: PricingRail, looks: ["soft", "warm"], min: 2 },                   // scroll-snap rail
    { id: "pricing/tabs", component: PricingTabs, looks: ["warm", "soft"] },                           // vertical tabs
    { id: "pricing/pills", component: PricingPills, looks: ["soft", "warm"], min: 2 },                 // price pill, centred
    { id: "pricing/soft-cards", component: PricingSoftCards, looks: ["soft", "warm"], min: 2 },        // soft shadowed cards
    { id: "pricing/table", component: PricingTable, looks: ["editorial", "swiss"], min: 2 },           // table-like columns
  ],
  partners: [
    { id: "partners/strip", component: PartnersStrip, looks: ["any"] },                               // centered chip/logo strip
    { id: "partners/left-label", component: PartnersLeftLabel, looks: ["editorial", "swiss"] },        // label left, marks right
    { id: "partners/stacked", component: PartnersStacked, looks: ["soft", "warm"] },                   // label above marks
    { id: "partners/grid", component: PartnersGrid, looks: ["soft", "swiss"], min: 2 },                // centered marks grid
    { id: "partners/bordered", component: PartnersBordered, looks: ["editorial", "swiss"], min: 3 },   // zero-gap cells
    { id: "partners/marquee", component: PartnersMarquee, looks: ["soft", "swiss"], min: 3 },          // auto-scroll row
    { id: "partners/cards", component: PartnersCards, looks: ["soft", "warm"], min: 2 },               // small bordered cards
    { id: "partners/dark", component: PartnersDark, looks: ["swiss", "soft"] },                        // inverted dark band
    { id: "partners/two-rows", component: PartnersTwoRows, looks: ["editorial", "warm"] },             // label row + marks row
    { id: "partners/pills", component: PartnersPills, looks: ["soft", "warm"] },                       // pills / logos
    { id: "partners/divided", component: PartnersDivided, looks: ["editorial", "swiss"], min: 2 },     // hairline-divided
    { id: "partners/heading", component: PartnersHeading, looks: ["editorial", "warm"], min: 2 },      // section header + grid
    { id: "partners/inline", component: PartnersInline, looks: ["swiss", "soft"] },                    // compact bullet inline
    { id: "partners/badges-large", component: PartnersBadgesLarge, looks: ["soft", "warm"], min: 2 },  // larger logos
    { id: "partners/split", component: PartnersSplit, looks: ["warm", "editorial"], min: 2 },          // heading left, grid right
    { id: "partners/tinted", component: PartnersTinted, looks: ["soft", "swiss"] },                    // tinted band
    { id: "partners/checklist", component: PartnersChecklist, looks: ["swiss", "editorial"], min: 2 }, // checkmark memberships
    { id: "partners/columns", component: PartnersColumns, looks: ["editorial", "swiss"], min: 3 },     // fixed equal columns
    { id: "partners/scroller", component: PartnersScroller, looks: ["soft", "warm"], min: 3 },         // horizontal rail
    { id: "partners/minimal", component: PartnersMinimal, looks: ["editorial", "swiss"] },             // tiny quiet mono
    { id: "partners/boxed", component: PartnersBoxed, looks: ["soft", "warm"], min: 2 },               // bordered box
    { id: "partners/tag-label", component: PartnersTagLabel, looks: ["soft", "warm"] },                // label tag + marks
  ],
  contact: [
    { id: "contact/split", component: Contact, looks: ["soft", "swiss", "warm"] },                     // form + info card
    { id: "contact/stacked", component: ContactStacked, looks: ["soft", "editorial"] },                // form, info beneath
    { id: "contact/info-left", component: ContactInfoLeft, looks: ["editorial", "swiss"] },            // info left, form right
    { id: "contact/card-form", component: ContactCardForm, looks: ["soft", "warm"] },                  // info chips + card form
    { id: "contact/split-dark", component: ContactSplitDark, looks: ["swiss", "soft"] },               // dark info panel + form
    { id: "contact/minimal", component: ContactMinimal, looks: ["soft", "swiss"] },                    // borderless minimal
    { id: "contact/boxed", component: ContactBoxed, looks: ["editorial", "swiss"] },                   // single bordered box
    { id: "contact/centered", component: ContactCentered, looks: ["soft", "warm"] },                   // centered narrow form
    { id: "contact/info-grid", component: ContactInfoGrid, looks: ["soft", "swiss"] },                 // info card grid + form
    { id: "contact/compact", component: ContactCompact, looks: ["editorial", "warm"] },                // compact form + info
    { id: "contact/tinted", component: ContactTinted, looks: ["soft", "warm"] },                       // tinted panel
    { id: "contact/big-heading", component: ContactBigHeading, looks: ["editorial", "warm"] },         // oversized heading + form
    { id: "contact/info-cards", component: ContactInfoCards, looks: ["editorial", "swiss"] },          // info cells + form
    { id: "contact/dark-form", component: ContactDarkForm, looks: ["swiss", "soft"] },                 // dark section, light form
    { id: "contact/two-col", component: ContactTwoCol, looks: ["soft", "swiss"] },                     // equal bordered columns
    { id: "contact/rail", component: ContactRail, looks: ["soft", "warm"] },                           // info chip rail + form
    { id: "contact/floating-card", component: ContactFloatingCard, looks: ["soft", "warm"] },          // elevated floating card
    { id: "contact/top-rule", component: ContactTopRule, looks: ["editorial", "swiss"] },              // top accent rule
    { id: "contact/location", component: ContactLocation, looks: ["warm", "soft"] },                   // location block + form
    { id: "contact/quick-actions", component: ContactQuickActions, looks: ["soft", "swiss"] },         // call/mail buttons + form
    { id: "contact/inline-form", component: ContactInlineForm, looks: ["soft", "editorial"] },         // one-line email + button
    { id: "contact/heading-info-form", component: ContactHeadingInfoForm, looks: ["editorial", "warm"] }, // heading, info, form
  ],
  process: [
    { id: "process/numbered-rows", component: ProcessNumberedRows, looks: ["editorial", "swiss"] },     // full-width numbered rows
    { id: "process/timeline", component: ProcessTimeline, looks: ["swiss", "editorial"] },              // vertical connector timeline
    { id: "process/horizontal", component: ProcessHorizontal, looks: ["soft", "swiss"], min: 3 },       // horizontal steps + connectors
    { id: "process/cards", component: ProcessCards, looks: ["soft", "warm"], min: 3 },                  // numbered cards grid
    { id: "process/connected-cards", component: ProcessConnectedCards, looks: ["soft", "swiss"], min: 2 }, // cards + arrows
    { id: "process/zigzag", component: ProcessZigzag, looks: ["warm", "editorial"] },                   // alternating rows
    { id: "process/big-index", component: ProcessBigIndex, looks: ["soft", "swiss"], min: 3 },          // faint big numbers
    { id: "process/stepper-bar", component: ProcessStepperBar, looks: ["swiss", "soft"], min: 3 },      // stepper + progress rail
    { id: "process/arrow-flow", component: ProcessArrowFlow, looks: ["soft", "warm"], min: 2 },         // inline arrow chips
    { id: "process/accordion", component: ProcessAccordion, looks: ["swiss", "editorial"] },            // single-open steps
    { id: "process/split-intro", component: ProcessSplitIntro, looks: ["editorial", "warm"] },          // heading + steps
    { id: "process/minimal", component: ProcessMinimal, looks: ["soft", "swiss"], min: 3 },             // top-rule grid
    { id: "process/dark", component: ProcessDark, looks: ["swiss", "soft"], min: 3 },                   // inverted dark band
    { id: "process/chips", component: ProcessChips, looks: ["soft", "warm"], min: 3 },                  // numbered chips
    { id: "process/dotted-vertical", component: ProcessDottedVertical, looks: ["editorial", "warm"] },  // dashed vertical line
    { id: "process/two-col", component: ProcessTwoCol, looks: ["editorial", "swiss"], min: 2 },         // two-column list
    { id: "process/bordered", component: ProcessBordered, looks: ["editorial", "swiss"], min: 3 },      // zero-gap cells
    { id: "process/tinted", component: ProcessTinted, looks: ["soft", "warm"], min: 3 },                // soft-tint cards
    { id: "process/feature-first", component: ProcessFeatureFirst, looks: ["soft", "warm"], min: 2 },   // first step featured
    { id: "process/rail", component: ProcessRail, looks: ["soft", "warm"], min: 3 },                    // scroll-snap rail
    { id: "process/underline-numbers", component: ProcessUnderlineNumbers, looks: ["editorial", "swiss"], min: 2 }, // number + underline
    { id: "process/stacked-big", component: ProcessStackedBig, looks: ["editorial", "warm"] },          // big numbered stack
  ],
  audience: [
    { id: "audience/cards", component: AudienceCards, looks: ["soft", "warm"], min: 3 },                // persona card grid
    { id: "audience/bordered", component: AudienceBordered, looks: ["editorial", "swiss"], min: 3 },    // zero-gap grid
    { id: "audience/tiles", component: AudienceTiles, looks: ["soft", "swiss"], min: 3 },               // bento tiles
    { id: "audience/rows", component: AudienceRows, looks: ["soft", "warm"] },                          // row cards + initial
    { id: "audience/split-intro", component: AudienceSplitIntro, looks: ["editorial", "warm"] },        // heading + segments
    { id: "audience/big-letter", component: AudienceBigLetter, looks: ["soft", "swiss"], min: 3 },      // faint initial
    { id: "audience/checklist", component: AudienceChecklist, looks: ["swiss", "editorial"], min: 2 },  // checkmark segments
    { id: "audience/two-col", component: AudienceTwoCol, looks: ["editorial", "swiss"], min: 2 },       // two-column list
    { id: "audience/minimal", component: AudienceMinimal, looks: ["soft", "swiss"], min: 3 },           // top-rule grid
    { id: "audience/dark", component: AudienceDark, looks: ["swiss", "soft"], min: 3 },                 // inverted dark band
    { id: "audience/tinted", component: AudienceTinted, looks: ["soft", "warm"], min: 3 },              // soft-tint cards
    { id: "audience/pill-headers", component: AudiencePillHeaders, looks: ["soft", "warm"], min: 3 },   // pill title + body
    { id: "audience/feature-first", component: AudienceFeatureFirst, looks: ["soft", "warm"], min: 2 }, // first segment featured
    { id: "audience/columns", component: AudienceColumns, looks: ["editorial", "swiss"], min: 3 },      // divided columns band
    { id: "audience/accordion", component: AudienceAccordion, looks: ["swiss", "editorial"] },          // single-open
    { id: "audience/alternating", component: AudienceAlternating, looks: ["warm", "editorial"] },       // zig-zag rows
    { id: "audience/banner", component: AudienceBanner, looks: ["soft", "swiss"], min: 2 },             // tinted band
    { id: "audience/rail", component: AudienceRail, looks: ["soft", "warm"], min: 3 },                  // scroll-snap rail
    { id: "audience/dots", component: AudienceDots, looks: ["soft", "swiss"], min: 3 },                 // dot-marker cards
    { id: "audience/quote", component: AudienceQuote, looks: ["editorial", "warm"] },                   // italic statements
    { id: "audience/top-accent", component: AudienceTopAccent, looks: ["soft", "swiss"], min: 3 },      // top accent cards
    { id: "audience/inline-list", component: AudienceInlineList, looks: ["editorial", "swiss"], min: 2 }, // definition list
  ],
  about: [
    { id: "about/split", component: AboutSplit, looks: ["editorial", "swiss"] },                        // text + highlight panel
    { id: "about/centered", component: AboutCentered, looks: ["soft", "warm"] },                        // centered narrow column
    { id: "about/two-col-paragraphs", component: AboutTwoColParagraphs, looks: ["editorial", "swiss"] }, // lead + 2-col body
    { id: "about/highlights-bar", component: AboutHighlightsBar, looks: ["swiss", "warm"] },            // text + highlights bar
    { id: "about/lead-quote", component: AboutLeadQuote, looks: ["editorial", "warm"] },                // oversized lead
    { id: "about/sidebar", component: AboutSidebar, looks: ["editorial", "swiss"] },                    // sticky heading + body
    { id: "about/bordered", component: AboutBordered, looks: ["editorial", "swiss"] },                  // bordered box
    { id: "about/dark", component: AboutDark, looks: ["swiss", "soft"] },                               // inverted dark band
    { id: "about/tinted", component: AboutTinted, looks: ["soft", "warm"] },                            // soft-tint panel
    { id: "about/minimal", component: AboutMinimal, looks: ["soft", "swiss"] },                         // borderless big lead
    { id: "about/eyebrow-rule", component: AboutEyebrowRule, looks: ["editorial", "swiss"] },           // editorial masthead
    { id: "about/columns", component: AboutColumns, looks: ["editorial", "swiss"] },                    // ruled paragraph columns
    { id: "about/highlights-cards", component: AboutHighlightsCards, looks: ["soft", "swiss"] },        // highlight cards + text
    { id: "about/feature-lead", component: AboutFeatureLead, looks: ["soft", "warm"] },                 // featured lead panel
    { id: "about/centered-highlights", component: AboutCenteredHighlights, looks: ["soft", "warm"] },   // centered + highlights
    { id: "about/offset", component: AboutOffset, looks: ["editorial", "warm"] },                       // offset heading
    { id: "about/band-highlights", component: AboutBandHighlights, looks: ["soft", "swiss"] },          // tinted band + highlights
    { id: "about/stacked-big", component: AboutStackedBig, looks: ["editorial", "warm"] },              // big heading stacked
    { id: "about/inline-stats", component: AboutInlineStats, looks: ["swiss", "editorial"] },           // body + stat chips
    { id: "about/quiet-prose", component: AboutQuietProse, looks: ["soft", "swiss"] },                  // quiet prose column
    { id: "about/lead-highlights-split", component: AboutLeadHighlightsSplit, looks: ["editorial", "warm"] }, // lead+highlights | body
    { id: "about/milestones", component: AboutMilestones, looks: ["swiss", "editorial"] },              // numbered paragraphs
  ],
  feature: [
    { id: "feature/split-left", component: FeatureSplitLeft, looks: ["soft", "warm"], needsImage: true },        // image left, text right
    { id: "feature/split-right", component: FeatureSplitRight, looks: ["editorial", "swiss"], needsImage: true }, // text left, image right
    { id: "feature/wide-image", component: FeatureWideImage, looks: ["soft", "swiss"], needsImage: true },        // narrow text, wide image
    { id: "feature/overlap-card", component: FeatureOverlapCard, looks: ["soft", "warm"], needsImage: true },     // overlapping text card
    { id: "feature/bordered", component: FeatureBordered, looks: ["editorial", "swiss"], needsImage: true },      // bordered frame
    { id: "feature/tinted", component: FeatureTinted, looks: ["soft", "warm"], needsImage: true },                // tinted text panel
    { id: "feature/image-top", component: FeatureImageTop, looks: ["editorial", "swiss"], needsImage: true },     // image top, text below
    { id: "feature/dark", component: FeatureDark, looks: ["swiss", "soft"], needsImage: true },                   // inverted dark band
    { id: "feature/offset-frame", component: FeatureOffsetFrame, looks: ["warm", "editorial"], needsImage: true },// offset framed image
    { id: "feature/rounded", component: FeatureRounded, looks: ["soft", "warm"], needsImage: true },              // extra-rounded image
    { id: "feature/band-full", component: FeatureBandFull, looks: ["swiss", "soft"], needsImage: true },          // full-bleed scrim band
    { id: "feature/caption", component: FeatureCaption, looks: ["editorial", "swiss"], needsImage: true },        // wide image + caption
    { id: "feature/two-thirds", component: FeatureTwoThirds, looks: ["soft", "swiss"], needsImage: true },        // 2/3 image
    { id: "feature/minimal", component: FeatureMinimal, looks: ["soft", "swiss"], needsImage: true },             // minimal split
    { id: "feature/chip-overlay", component: FeatureChipOverlay, looks: ["soft", "warm"], needsImage: true },     // eyebrow chip overlay
    { id: "feature/statement", component: FeatureStatement, looks: ["editorial", "warm"], needsImage: true },     // statement + bullets
  ],
  gallery: [
    { id: "gallery/grid", component: GalleryGrid, looks: ["soft", "swiss"], min: 3 },                // uniform photo grid
    { id: "gallery/mosaic", component: GalleryMosaic, looks: ["soft", "warm"], min: 4 },             // bento mosaic
    { id: "gallery/carousel", component: GalleryCarousel, looks: ["soft", "warm"], min: 3 },         // scroll-snap rail
    { id: "gallery/full-bleed", component: GalleryFullBleed, looks: ["swiss", "soft"] },     // full-bleed banner
    { id: "gallery/split-media", component: GallerySplitMedia, looks: ["editorial", "warm"] }, // text + image split
    { id: "gallery/strip", component: GalleryStrip, looks: ["swiss", "editorial"], min: 4 },         // uniform thin strip
    { id: "gallery/logo-strip", component: GalleryLogoStrip, looks: ["editorial", "swiss", "warm"], min: 2 }, // cert/partner logos
    { id: "gallery/framed", component: GalleryFramed, looks: ["editorial", "warm"], min: 2 },        // offset portrait frames
    { id: "gallery/duo", component: GalleryDuo, looks: ["soft", "editorial"], min: 2 },              // two big images
    { id: "gallery/feature", component: GalleryFeature, looks: ["warm", "soft"], min: 3 },           // feature + thumbnails
    { id: "gallery/masonry", component: GalleryMasonry, looks: ["soft", "editorial"], min: 3 },        // masonry columns
    { id: "gallery/collage", component: GalleryCollage, looks: ["soft", "swiss"], min: 4 },            // varied-span collage
    { id: "gallery/circles", component: GalleryCircles, looks: ["soft", "warm"], min: 3 },             // circular bubbles
    { id: "gallery/polaroid", component: GalleryPolaroid, looks: ["warm", "soft"], min: 3 },           // tilted polaroids
    { id: "gallery/triptych", component: GalleryTriptych, looks: ["editorial", "swiss"], min: 3 },     // three equal images
    { id: "gallery/marquee", component: GalleryMarquee, looks: ["soft", "swiss"], min: 3 },            // auto-scroll marquee
    { id: "gallery/showcase", component: GalleryShowcase, looks: ["warm", "editorial"], min: 3 },      // big + 2 stacked
    { id: "gallery/frame-single", component: GalleryFrameSingle, looks: ["editorial", "warm"] },       // single framed image
    { id: "gallery/rounded-grid", component: GalleryRoundedGrid, looks: ["soft", "warm"], min: 3 },    // extra-rounded tiles
    { id: "gallery/band-overlay", component: GalleryBandOverlay, looks: ["swiss", "soft"], min: 3 },   // wide band + label overlay
  ],
};

/** Which look-affinity each palette (preset) expresses — used to filter variants. */
export const presetAffinity: Record<string, StyleAffinity> = {
  "boost-editorial": "editorial",
  "ruerup-swiss": "swiss",
  "tureva-soft": "soft",
  "uds-warm-editorial": "warm",
  "quabba-editorial": "editorial",
  "zueri-swiss": "swiss",
  "swiss-clean": "swiss",
  "dark-premium": "swiss",
};
