import React from "react";
import { Container } from "./primitives";
import type { ContactContent } from "../content/types";

/** Impressum / Datenschutz boilerplate, filled from the firm's real contact data. */
export const LegalBody: React.FC<{ doc: string; firm: string; contact: ContactContent }> = ({ doc, firm, contact }) => {
  const p: React.CSSProperties = { fontFamily: "var(--ds-font-body)", lineHeight: 1.7, color: "var(--ds-text-muted)", margin: 0 };
  return (
    <section style={{ background: "var(--ds-bg)", paddingBlock: "var(--ds-section-y)" }}>
      <Container style={{ maxWidth: "min(var(--ds-container), 760px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
          {doc === "Impressum" ? (
            <>
              <p style={p}>
                <b style={{ color: "var(--ds-text)" }}>{firm}</b><br />
                {contact.info.address ?? "Zürich, Schweiz"}<br />
                {contact.info.phone}<br />{contact.info.email}
              </p>
              <p style={p}>Verantwortlich für den Inhalt dieser Website ist {firm}. Alle Angaben erfolgen ohne Gewähr.</p>
              <p style={p}>Für den Inhalt externer Links wird keine Haftung übernommen; verantwortlich sind ausschliesslich deren Betreiber.</p>
            </>
          ) : (
            <>
              <p style={p}>Der Schutz Ihrer Personendaten ist uns wichtig. Wir bearbeiten Daten im Einklang mit dem revidierten Schweizer Datenschutzgesetz (nDSG) sowie – wo anwendbar – der DSGVO.</p>
              <p style={p}>Personendaten werden nur erhoben, soweit dies für die Erbringung unserer Treuhand-Dienstleistungen erforderlich ist. Die Übertragung erfolgt verschlüsselt; das Hosting findet in der Schweiz statt.</p>
              <p style={p}>Bei Fragen zum Datenschutz erreichen Sie uns unter {contact.info.email}.</p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
};
