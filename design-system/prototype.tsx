/**
 * Single-firm prototype entry — the ONLY thing that ships to a customer.
 *
 * Renders just this one firm's complete website at "/" (its in-page navigation is
 * state-based, not URL-based, so the whole multi-page site lives at the root). It
 * imports exactly ONE firm's data from prototype.data.json, which scripts/publish.mjs
 * writes per deploy. Crucially this entry pulls in NO studio, NO firm glob, and NO
 * manifest — so a deployed prototype exposes only that customer's site and nothing else.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { SiteRouter } from "./compose/SiteRouter";
import type { SiteContent } from "./content/types";
import type { PublishedPlan } from "./compose/outreach";
import payload from "./prototype.data.json";

const { content, plan } = (payload ?? {}) as unknown as { content: SiteContent; plan: PublishedPlan };

const root = createRoot(document.getElementById("root")!);
if (!content) {
  // Only happens if the build ran without publish.mjs writing real data.
  root.render(<div style={{ fontFamily: "system-ui", padding: 40, color: "#555" }}>Kein Prototyp geladen.</div>);
} else {
  if (content.meta?.firm && typeof document !== "undefined") document.title = content.meta.firm;
  root.render(
    <SiteRouter
      content={content}
      seed={plan?.seed}
      lookId={plan?.lookId}
      heroId={plan?.heroId}
      primaryStyle={plan?.primaryStyle}
      sectionOverrides={plan?.sectionOverrides}
      kitId={plan?.kitId}
      pitch={plan?.pitch !== false}
      imageSeed={plan?.imageSeed}
    />
  );
}
