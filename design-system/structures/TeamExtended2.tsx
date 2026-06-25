/**
 * Team STRUCTURES — batch 2. Same TeamContent + optional more; token-only.
 * Real portrait (member.photo) or initials monogram.
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

/** 1) Square photo grid, caption below. */
export const TeamGridPhoto: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1.45rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { aspectRatio: "1 / 1", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", fontSize: "1.6rem" })}>{m.photo ? "" : m.initials}</div>
            <div><h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 2) Tilted polaroid frames. */
export const TeamPolaroid: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} center />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.8rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", boxShadow: "var(--ds-shadow-card)", padding: "0.7rem 0.7rem 1rem", width: "190px", transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "100%", height: "190px", fontSize: "1.6rem" })}>{m.photo ? "" : m.initials}</div>
            <div style={{ textAlign: "center", marginTop: "0.7rem" }}><h3 style={{ ...name, fontSize: "0.98rem" }}>{m.name}</h3><span style={role}>{m.role}</span></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 3) Two-column big portrait + bio. */
export const TeamDuo: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: "1.85rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.65rem", alignItems: "center" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "8rem", height: "9rem", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", flexShrink: 0, fontSize: "2rem" })}>{m.photo ? "" : m.initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}><h3 style={{ ...name, fontSize: "1.2rem" }}>{m.name}</h3><span style={role}>{m.role}</span>{m.bio && <p style={bio}>{m.bio}</p>}</div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 4) Horizontal photo strip. */
export const TeamStrip: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container><SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} /></Container>
    <div style={{ display: "flex", gap: "1.05rem", overflowX: "auto", paddingInline: "var(--ds-gutter)", scrollSnapType: "x mandatory" }}>
      {content.members.map((m, i) => (
        <div key={i} style={{ flex: "0 0 200px", scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div role="img" aria-label={m.name} style={photoBg(m, { height: "230px", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", fontSize: "1.6rem" })}>{m.photo ? "" : m.initials}</div>
          <div><h3 style={{ ...name, fontSize: "0.98rem" }}>{m.name}</h3><span style={role}>{m.role}</span></div>
        </div>
      ))}
    </div>
  </section>
);

/** 5) Cards with the role as a pill badge. */
export const TeamBadgeRole: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "1.45rem" }}>
        {content.members.map((m, i) => (
          <div key={i} className="ds-card" style={{ background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", boxShadow: "var(--ds-shadow-card)", padding: "1.6rem", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.95rem" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "5rem", height: "5rem", borderRadius: "9999px", fontSize: "1.3rem" })}>{m.photo ? "" : m.initials}</div>
            <h3 style={name}>{m.name}</h3>
            <span style={{ display: "inline-block", padding: "0.3rem 0.8rem", borderRadius: "9999px", background: "var(--ds-primary-soft)", color: "var(--ds-primary-ink, var(--ds-primary))", fontFamily: "var(--ds-font-body)", fontSize: "0.64rem" }}>{m.role}</span>
            {m.bio && <p style={{ ...bio, fontSize: "0.85rem" }}>{m.bio}</p>}
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 6) Centered avatar + bio, single-column list. */
export const TeamCenteredBio: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 700px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} center />
      <div style={{ display: "flex", flexDirection: "column", gap: "1.8rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.6rem", paddingTop: i ? "1.6rem" : 0, borderTop: i ? "1px solid var(--ds-border)" : "none" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "4.5rem", height: "4.5rem", borderRadius: "9999px", fontSize: "1.2rem" })}>{m.photo ? "" : m.initials}</div>
            <h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span>{m.bio && <p style={bio}>{m.bio}</p>}
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 7) Avatar list rows. */
export const TeamNumbered: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container style={{ maxWidth: "min(var(--ds-container), 820px)" }}>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.45rem", alignItems: "center", padding: "1.2rem 0", borderTop: "1px solid var(--ds-border)" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "3rem", height: "3rem", borderRadius: "9999px", fontSize: "0.85rem" })}>{m.photo ? "" : m.initials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <div style={{ display: "flex", gap: "0.95rem", alignItems: "baseline", flexWrap: "wrap" }}><h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span></div>
              {m.bio && <p style={{ ...bio, fontSize: "0.85rem" }}>{m.bio}</p>}
            </div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 8) Masonry columns of member cards. */
export const TeamMasonry: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
      <div style={{ columnCount: 3, columnGap: "1.2rem" }}>
        {content.members.map((m, i) => (
          <div key={i} className={m.photo ? "ds-card ds-img-zoom" : "ds-card"} style={{ margin: "0 0 1.2rem", breakInside: "avoid", background: "var(--ds-surface)", border: "1px solid var(--ds-border)", borderRadius: "var(--ds-radius)", overflow: "hidden", display: "inline-block", width: "100%" }}>
            <div role="img" aria-label={m.name} className={m.photo ? "ds-zoom" : undefined} style={photoBg(m, { aspectRatio: i % 3 === 1 ? "3 / 4" : "4 / 5", fontSize: "1.5rem" })}>{m.photo ? "" : m.initials}</div>
            <div style={{ padding: "1rem 1.2rem" }}><h3 style={name}>{m.name}</h3><span style={role}>{m.role}</span></div>
          </div>
        ))}
      </div>
    </Container>
  </section>
);

/** 9) First member large left, rest as a grid right. */
export const TeamSplitLead: React.FC<Props> = ({ content, more }) => {
  const [first, ...rest] = content.members;
  if (!first) return null;
  return (
    <section style={sectionBase}>
      <Container>
        <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} />
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.4fr)", gap: "2rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}>
            <div role="img" aria-label={first.name} style={photoBg(first, { width: "100%", aspectRatio: "4 / 5", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", fontSize: "2.6rem" })}>{first.photo ? "" : first.initials}</div>
            <h3 style={{ ...name, fontSize: "1.3rem" }}>{first.name}</h3><span style={role}>{first.role}</span>{first.bio && <p style={bio}>{first.bio}</p>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "1.25rem", alignContent: "start" }}>
            {rest.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div role="img" aria-label={m.name} style={photoBg(m, { width: "100%", aspectRatio: "4 / 5", borderRadius: "var(--ds-radius)", border: "1px solid var(--ds-border)", fontSize: "1.2rem" })}>{m.photo ? "" : m.initials}</div>
                <h3 style={{ ...name, fontSize: "0.95rem" }}>{m.name}</h3><span style={{ ...role, fontSize: "0.62rem" }}>{m.role}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

/** 10) Compact horizontal row of circle avatars. */
export const TeamCircleRow: React.FC<Props> = ({ content, more }) => (
  <section style={sectionBase}>
    <Container>
      <SectionHead eyebrow={content.eyebrow} heading={content.heading} more={more} center />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem" }}>
        {content.members.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "0.5rem", width: "120px" }}>
            <div role="img" aria-label={m.name} style={photoBg(m, { width: "4.5rem", height: "4.5rem", borderRadius: "9999px", fontSize: "1.1rem" })}>{m.photo ? "" : m.initials}</div>
            <h3 style={{ ...name, fontSize: "0.92rem" }}>{m.name}</h3><span style={{ ...role, fontSize: "0.6rem" }}>{m.role}</span>
          </div>
        ))}
      </div>
    </Container>
  </section>
);
