import React from "react";
import { Container } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { ValuesContent } from "../content/types";

/** Why-us pillars in a divided column band (briefing §3 values). */
export const Values: React.FC<{ content: ValuesContent; more?: MoreLink }> = ({ content, more }) => (
  <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} center more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.items.length, 4)}, minmax(0,1fr))`, gap: 0, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", background: "var(--ds-bg)" }}>
        {content.items.map((v, i) => (
          <div key={i} style={{ padding: "1.6rem", borderLeft: i === 0 ? "none" : "1px solid var(--ds-border)", display: "flex", flexDirection: "column", gap: "0.95rem" }}>
            <div style={{ width: "0.55rem", height: "0.55rem", borderRadius: "9999px", background: "var(--ds-primary)" }} />
            <h4 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 }}>{v.title}</h4>
            <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{v.body}</p>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** Image-bearing values: the pillars beside a framed scene photo. The image-rhythm
 *  pass promotes THIS already-needed section to carry the picture, instead of inserting
 *  a filler band. Falls back to the divided-column band when no image is supplied. */
export const ValuesPhotoSplit: React.FC<{ content: ValuesContent; more?: MoreLink }> = ({ content, more }) =>
  content.image ? (
    <section style={{ background: "var(--ds-surface)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" }}>
      <Container>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.95fr) minmax(0,1.05fr)", gap: "clamp(1.8rem, 4vw, 3.4rem)", alignItems: "center" }}>
          <div aria-hidden style={{ minHeight: "clamp(260px, 32vw, 420px)", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", backgroundImage: `url("${content.image}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1.45rem" }}>
            <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {content.items.map((v, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.15rem", alignItems: "start" }}>
                  <span style={{ marginTop: "0.45rem", width: "0.55rem", height: "0.55rem", borderRadius: "9999px", background: "var(--ds-primary)", flex: "0 0 auto" }} />
                  <div>
                    <h4 style={{ fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.02rem", color: "var(--ds-text)", margin: "0 0 0.2rem" }}>{v.title}</h4>
                    <p style={{ fontFamily: "var(--ds-font-body)", fontSize: "0.88rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 }}>{v.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  ) : <Values content={content} more={more} />;
