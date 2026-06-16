import React, { useEffect, useState } from "react";
import { Container, Eyebrow } from "./primitives";
import type { TestimonialsContent } from "../content/types";

/** Testimonials variant: a SLIDER — one quote at a time, auto-advancing, with
 *  prev/next + dots. Token-only. (soft/friendly element.) */
export const TestimonialsCarousel: React.FC<{ content: TestimonialsContent }> = ({ content }) => {
  const items = content.items;
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);
  const go = (n: number) => setIdx((n + items.length) % items.length);
  const t = items[idx];

  return (
    <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.4rem", textAlign: "center" }}>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--ds-primary)", fontWeight: 700 }}>
            ★ {content.rating} <span style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ds-text-muted)" }}>{content.reviewCount}</span>
          </div>
          <blockquote style={{ margin: 0, fontFamily: "var(--ds-font-heading)", fontSize: "1.45rem", lineHeight: 1.4, color: "var(--ds-text)", minHeight: "4.2em", transition: "opacity var(--ds-duration) var(--ds-ease)" }}>
            “{t.quote}”
          </blockquote>
          <div style={{ fontFamily: "var(--ds-font-mono)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ds-text-muted)" }}>
            <strong style={{ color: "var(--ds-text)" }}>{t.person}</strong> · {t.company} · {t.city}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.4rem" }}>
            <button onClick={() => go(idx - 1)} aria-label="prev" style={navBtn}>‹</button>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {items.map((_, i) => (
                <button key={i} onClick={() => go(i)} aria-label={`slide ${i + 1}`} style={{ width: 8, height: 8, borderRadius: 9999, border: "none", cursor: "pointer", padding: 0, background: i === idx ? "var(--ds-primary)" : "var(--ds-border)" }} />
              ))}
            </div>
            <button onClick={() => go(idx + 1)} aria-label="next" style={navBtn}>›</button>
          </div>
        </div>
      </Container>
    </section>
  );
};

const navBtn: React.CSSProperties = {
  width: 36, height: 36, borderRadius: "var(--ds-radius-pill)", border: "1px solid var(--ds-border)",
  background: "var(--ds-bg)", color: "var(--ds-text)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1,
};
