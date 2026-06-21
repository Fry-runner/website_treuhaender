/**
 * Ten additional Team STRUCTURES. Same TeamContent ({name, role, initials, bio,
 * photo?}[]) + optional `more` as the original two (cards / rows); token-only.
 * Each renders the firm's real portrait (member.photo) or an initials monogram.
 */
import React from "react";
import { Container, PORTRAIT_FOCUS } from "./primitives";
import { SectionHead, type MoreLink } from "./SectionHead";
import type { TeamContent, TeamMember } from "../content/types";

type Props = { content: TeamContent; more?: MoreLink };
const sectionBase: React.CSSProperties = { background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)", borderBottom: "1px solid var(--ds-border)" };
const name: React.CSSProperties = { fontFamily: "var(--ds-font-heading)", fontWeight: 600, fontSize: "1.05rem", color: "var(--ds-text)", margin: 0 };
const role: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.68rem",   color: "var(--ds-primary-ink, var(--ds-primary))" };
const bio: React.CSSProperties = { fontFamily: "var(--ds-font-body)", fontSize: "0.9rem", lineHeight: 1.5, color: "var(--ds-text-muted)", margin: 0 };
const photoBg = (m: TeamMember, extra?: React.CSSProperties): React.CSSProperties => ({
  background: "var(--ds-primary-soft)", color: "var(--ds-primary-ink, var(--ds-primary))", display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "var(--ds-font-heading)", fontWeight: 700, overflow: "hidden",
  ...(m.photo ? { backgroundImage: `url("${m.photo}")`, backgroundSize: "cover", backgroundPosition: PORTRAIT_FOCUS } : {}), ...extra,
});

/** 1) Centered round avatars, name/role below. */
export const TeamCircles: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} center />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.members.length, 4)}, minmax(0,1fr))`, gap: "1.6rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "6.5rem", height: "6.5rem", borderRadius: "9999px", fontSize: "1.6rem" })}>{m.photo ? "" : m.initials}</div>
            <h3 style={name}>{m.name}</h3>
            <span style={role}>{m.role}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Compact minimal grid — avatar + name + role, no bio. */
export const TeamMinimalGrid: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.members.length, 4)}, minmax(0,1fr))`, gap: "1.4rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.9rem", borderTop: "2px solid var(--ds-text)", paddingTop: "1rem" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "3rem", height: "3rem", borderRadius: "var(--ds-radius)", flexShrink: 0, fontSize: "0.9rem" })}>{m.photo ? "" : m.initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}><h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) First member featured large, rest compact. */
export const TeamSpotlight: React.FC<Props> = ({ content, more }) => {
  const [first, ...rest] = content.members;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)", gap: "2rem", alignItems: "center" }}>
          <div className="ds-card" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4rem", alignItems: "center", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem" }}>
            <div role="img" aria-label={first.name} style={photoBg(first, { width: "7rem", height: "7rem", borderRadius: "var(--ds-radius)", flexShrink: 0, fontSize: "1.8rem" })}>{first.photo ? "" : first.initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}><h3 style={{ ...name, fontSize: "1.3rem" }}>{first.name}</h3><span style={role}>{first.role}</span><p style={bio}>{first.bio}</p></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(rest.length, 2) || 1}, minmax(0,1fr))`, gap: "1rem" }}>
            {rest.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div role="img" aria-label={m.name} style={photoBg(m, { width: "3rem", height: "3rem", borderRadius: "9999px", fontSize: "0.85rem" })}>{m.photo ? "" : m.initials}</div>
                <h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 4) Zero-gap hairline grid. */
export const TeamBordered: React.FC<Props> = ({ content, more }) => {
  const cols = Math.min(content.members.length, 3);
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden" }}>
          {content.members.map((m, i) => (
            <div key={i} style={{ padding: "1.6rem", display: "flex", flexDirection: "column", gap: "0.6rem", borderLeft: i % cols === 0 ? "none" : "1px solid var(--ds-border)", borderTop: i >= cols ? "1px solid var(--ds-border)" : "none" }}>
              <div role="img" aria-label={m.name} style={photoBg(m, { width: "3.4rem", height: "3.4rem", borderRadius: "9999px", fontSize: "0.95rem" })}>{m.photo ? "" : m.initials}</div>
              <h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span><p style={bio}>{m.bio}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

/** 5) Photo cards with name/role overlaid on a bottom scrim. */
export const TeamOverlay: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.members.length, 4)}, minmax(0,1fr))`, gap: "1.2rem" }}>
        {content.members.map((m, i) => (
          <div key={i} className="ds-card" role="img" aria-label={m.name} style={{ position: "relative", aspectRatio: "4 / 5", borderRadius: "var(--ds-radius)", overflow: "hidden", border: "1px solid var(--ds-border)", ...photoBg(m, { alignItems: "center", justifyContent: "center", fontSize: "2.4rem" }) }}>
            {!m.photo && <span>{m.initials}</span>}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "1rem", background: "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0))" }}>
              <h3 style={{ ...name, color: "#fff" }}>{m.name}</h3>
              <span style={{ ...role, color: "#fff", opacity: 0.85 }}>{m.role}</span>
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Two-column larger cards with photo + bio. */
export const TeamTwoCol: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "1.4rem" }}>
        {content.members.map((m, i) => (
          <div key={i} className="ds-card" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.4rem", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", alignItems: "center" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "5.5rem", height: "5.5rem", borderRadius: "var(--ds-radius)", flexShrink: 0, fontSize: "1.4rem" })}>{m.photo ? "" : m.initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}><h3 style={{ ...name, fontSize: "1.15rem" }}>{m.name}</h3><span style={role}>{m.role}</span><p style={bio}>{m.bio}</p></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Full-width rows, avatar right, text left. */
export const TeamListRight: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.4rem", alignItems: "center", padding: "1.3rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              <div style={{ display: "flex", gap: "0.7rem", alignItems: "baseline", flexWrap: "wrap" }}><h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span></div>
              <p style={bio}>{m.bio}</p>
            </div>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "3.6rem", height: "3.6rem", borderRadius: "9999px", flexShrink: 0, fontSize: "0.95rem" })}>{m.photo ? "" : m.initials}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 8) Alternating large rows, photo left/right. */
export const TeamAlternating: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 880px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
        {content.members.map((m, i) => {
          const right = i % 2 === 1;
          const avatar = <div key="a" role="img" aria-label={m.name} style={photoBg(m, { width: "6rem", height: "6rem", borderRadius: "var(--ds-radius)", flexShrink: 0, fontSize: "1.5rem" })}>{m.photo ? "" : m.initials}</div>;
          const text = <div key="t" style={{ display: "flex", flexDirection: "column", gap: "0.4rem", textAlign: right ? "right" : "left" }}><h3 style={{ ...name, fontSize: "1.2rem" }}>{m.name}</h3><span style={role}>{m.role}</span><p style={bio}>{m.bio}</p></div>;
          return <div key={i} style={{ display: "grid", gridTemplateColumns: right ? "1fr auto" : "auto 1fr", gap: "1.6rem", alignItems: "center" }}>{right ? [text, avatar] : [avatar, text]}</div>;
        })}
      </div>
    </Container>
  </section>
);

/** 9) Four-column compact cards. */
export const TeamCompact4: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        {content.members.map((m, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.2rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.5rem" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "4rem", height: "4rem", borderRadius: "9999px", fontSize: "1.1rem" })}>{m.photo ? "" : m.initials}</div>
            <h3 style={{ ...name, fontSize: "0.98rem" }}>{m.name}</h3><span style={{ ...role, fontSize: "0.62rem" }}>{m.role}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 10) Bio-as-quote cards with avatar footer. */
export const TeamQuoteCard: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(content.members.length, 3)}, minmax(0,1fr))`, gap: "1.2rem" }}>
        {content.members.map((m, i) => (
          <figure key={i} className="ds-card" style={{ margin: 0, background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", padding: "1.6rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <span style={{ color: "var(--ds-primary-ink, var(--ds-primary))", fontSize: "1.8rem", lineHeight: 1 }}>“</span>
            <p style={{ ...bio, fontFamily: "var(--ds-font-heading)", fontStyle: "italic", color: "var(--ds-text)", flex: 1 }}>{m.bio}</p>
            <figcaption style={{ display: "flex", alignItems: "center", gap: "0.8rem", borderTop: "1px solid var(--ds-border)", paddingTop: "0.9rem" }}>
              <div role="img" aria-label={m.name} style={photoBg(m, { width: "2.6rem", height: "2.6rem", borderRadius: "9999px", flexShrink: 0, fontSize: "0.75rem" })}>{m.photo ? "" : m.initials}</div>
              <div style={{ display: "flex", flexDirection: "column" }}><span style={{ ...name, fontSize: "0.95rem" }}>{m.name}</span><span style={role}>{m.role}</span></div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Container>
  </section>
);
