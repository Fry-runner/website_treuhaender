/**
 * Proof: a mini-page (Hero + TrustBar + Testimonials) rendered in ALL FOUR looks
 * on one page. Each look is just a wrapper carrying applyLook(preset) CSS vars —
 * the structure markup is identical across all four. Demonstrates the
 * Structure × Look split AND the briefing's social-proof + trust-bar additions.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { presetList } from "./tokens";
import { applyLook } from "./looks/applyLook";
import { HeroSplit, type HeroContent } from "./structures/HeroSplit";
import { TrustBar } from "./structures/TrustBar";
import { Testimonials, type TestimonialsContent } from "./structures/Testimonials";
import { chCertifications } from "./content/ch";

const hero: HeroContent = {
  eyebrow: "Treuhand · Zürich",
  titleLead: "Sie führen Ihr Unternehmen.",
  titleAccent: "Wir den Rest.",
  lede: "Buchhaltung, Steuern und Beratung für KMU und Privatpersonen. Persönlich, präzise und vorausschauend an Ihrer Seite.",
  primaryCta: "Termin buchen",
  secondaryCta: "Leistungen",
  asideLabel: "5.0 ★ · 93 Bewertungen",
  asideQuote: "Endlich ein Treuhänder, der mitdenkt statt nur abzurechnen.",
  asideAttribution: "— Geschäftsführerin, KMU Zürich",
};

const testimonials: TestimonialsContent = {
  eyebrow: "Mandantenstimmen",
  heading: "Über 1000 KMU vertrauen uns.",
  rating: "5.0",
  reviewCount: "93 Bewertungen",
  items: [
    { quote: "Schneller Onboarding, klare Zahlen in Echtzeit. Wir würden nie zurückwechseln.", person: "M. Keller", company: "Keller Bau GmbH", city: "Winterthur" },
    { quote: "Transparente Preise und ein fester Ansprechpartner. Genau das hat gefehlt.", person: "S. Brunner", company: "Brunner Consulting", city: "Zürich" },
    { quote: "Digital, aber persönlich. Steuern sind endlich kein Stress mehr.", person: "L. Frei", company: "Frei Architektur", city: "Uster" },
  ],
};

const certs = chCertifications.map((c) => c.name);

const App = () => (
  <div style={{ fontFamily: "system-ui, sans-serif" }}>
    {presetList.map((preset) => (
      <section key={preset.meta.id}>
        <div style={{
          padding: "0.6rem 1.5rem", background: "#0b0b0c", color: "#fff",
          fontFamily: "ui-monospace, monospace", fontSize: "0.72rem", letterSpacing: "0.1em",
          textTransform: "uppercase", display: "flex", justifyContent: "space-between",
        }}>
          <span>{preset.meta.name}</span>
          <span style={{ opacity: 0.6 }}>{preset.meta.id} · from {preset.meta.source}</span>
        </div>
        {/* The ONLY thing that changes per look is this wrapper's CSS variables. */}
        <div style={applyLook(preset)}>
          <HeroSplit content={hero} />
          <TrustBar label="Mitglied · Zertifiziert" items={certs} />
          <Testimonials content={testimonials} />
        </div>
      </section>
    ))}
  </div>
);

createRoot(document.getElementById("root")!).render(<App />);
