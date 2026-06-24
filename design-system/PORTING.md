# Übersetzungsprotokoll — externe Komponenten → Inventory-Variante

Verbindliche Anforderungen, damit eine aus einer externen Bibliothek (21st.dev / Magic,
shadcn, Tailwind-Snippets …) **importierte** Komponente exakt dieselbe **Variabilität**
hat wie jede native Inventory-Variante. Eine Portierung ist erst „fertig", wenn ALLE
Punkte erfüllt sind. Referenz-Implementierung: `structures/MagicSite.tsx`.

> Grundsatz: Die externe Komponente liefert nur das **Layout/die Idee**. Look, Inhalt,
> Verhalten und Variabilität kommen aus dem Design-System. Nichts Hartkodiertes überlebt.

---

## 0. Der Firmen-Designsprache unterordnen (Pflicht — der häufigste Fehler)
Token-Re-Skinning (Farbe/Font) reicht NICHT. Externe Bibliotheken bringen eigene
**dekorative Signaturen** mit — maskierte Punkt-Raster hinter Icons/Zahlen, versetzte/
rotierte Cards, floating Overlay-Chips, Glow-/Mesh-Gradients, „bento"-Spielereien. Das ist
SaaS-/Startup-Bildsprache und bricht die zurückhaltende, seriöse Treuhand-Familie.
- Solche Signaturen **entfernen oder auf ein ruhiges Minimum reduzieren** — die Variante
  muss als **dieselbe Familie** wie die NATIVEN Sektionen lesbar sein (eine Site = eine Sprache).
- **Affinität eng** vergeben (Punkt 9): nur die `looks`, zu denen der Charakter wirklich
  passt — nie pauschal alle, sonst steht sie neben unpassenden nativen Sektionen.
- **Test:** rendert man die Variante zwischen zwei nativen Sektionen, darf sie nicht
  „anders"/fremd wirken. Wenn doch → Deko weiter zurücknehmen.

## 1. Farbe & Stil — TOKEN-ONLY (Pflicht, von `audit:design` erzwungen)
Kein einziger Hex-Wert, kein `rgb(...)`, keine Tailwind-Farb-/Spacing-Klasse. Alles über
`var(--ds-*)`. Dadurch re-skint **eine** Komponente pro Firma automatisch.

| extern (Magic/Tailwind) | → Token |
|---|---|
| `bg-*` / Hex als Fläche/Akzent | `var(--ds-primary)` (Text darauf: `var(--ds-primary-fg)`) |
| Primary als **Text/Link** | `var(--ds-primary-ink)` (NICHT `--ds-primary` — Kontrast-gesichert) |
| `text-gray-900` / `-500` | `var(--ds-text)` / `var(--ds-text-muted)` |
| `bg-white` / `bg-gray-50` | `var(--ds-bg)` / `var(--ds-surface)` |
| faint Tint / Highlight-bg | `var(--ds-primary-soft)` |
| `border-*` | `var(--ds-border)` |
| `rounded-*` / `-full` | `var(--ds-radius)` / `var(--ds-radius-pill)` |
| `shadow-*` | `var(--ds-shadow-card)` (Hover: `var(--ds-shadow-hover)`) |
| `p-*`, `gap-*`, `py-20` | `var(--ds-space)` / `var(--ds-gutter)` / Sektion: `var(--ds-section-y)` |
| `font-*` | `var(--ds-font-heading)` / `var(--ds-font-body)` / `var(--ds-font-mono)` |
| Display-Größen | `var(--ds-display)` (h1) / `var(--ds-display-h2)` (h2) |

## 2. Inhalt — typisierter Content-Vertrag (Pflicht)
Props sind **ausschließlich** `{ content: XContent }` (`HeroContent`, `ServicesContent`,
`FeatureContent`, `ProcessContent`, `AboutContent`, `CtaContent`, `StatsContent`,
`TestimonialsContent` …). KEINE eingebauten Strings, Zahlen, Bild-URLs oder Logos. Inhalt
ist Daten, nicht im Component gebacken. Demo-Texte der Vorlage werden vollständig ersetzt.

## 3. Button — pro Firma auswählbar (Pflicht)
Buttons IMMER über `<Button variant="primary|outline">` (liest `usePrimaryStyle()` aus dem
Kontext) oder, wenn kein `<button>` möglich ist, `primaryStyleProps(usePrimaryStyle())`.
NIE einen eigenen Button stylen. Dadurch übernimmt die Komponente automatisch den
firmenweit gewählten Button-Stil und ist in der Variant-Studio auswählbar.

## 4. Pro-Firma-Kontexte mitnutzen (Pflicht)
- **Sektion-Kopf:** `<SectionHead eyebrow heading more />` — respektiert die per-Firma
  `SectionAlign` (links/zentriert) und blendet Eyebrows zentral aus. Kein eigenes `<h2>`,
  außer das Layout braucht es zwingend (dann `var(--ds-display-h2)` + `var(--ds-text)`).
- **Icons:** jedes Glyph über `<Icon name=…>` (per-Firma-Icon-Set). NIE Emoji, NIE rohe
  `✓ → ◆`-Zeichen, NIE `lucide`/Heroicons-Imports.
- **Forward-Link:** „mehr"-Links über `SectionMore` / `useMoreStyle` (per-Firma-Stil).
- **Dunkler/farbiger Grund:** trägt der Block CTAs auf `--ds-text`/`--ds-primary`-Grund,
  MUSS der CTA in `<InvertedTone>` (Button flippt auf `--ds-bg`/`--ds-text`). Sonst
  dunkel-auf-dunkel. Siehe `project_inverted_tone_buttons`.

## 5. Struktur passt sich dem Inhalt an (Pflicht)
- **Variable Item-Zahl:** sauber bei 1 … N (Grid/Flex `auto-fit`/`wrap`, keine fixe
  Spaltenzahl, die bei 2 Items leer aussieht). Sinnvolles `min` in der Registry setzen.
- **Bild optional:** entweder `needsImage:true` (nur wählbar, wenn echtes Bild existiert)
  ODER ein Text-Fallback ohne leere Platzhalter-Kachel (siehe Hero-Fallback in MagicSite).
  NIE ein leeres `<img>`/Box rendern. Nie Fake-Gesichter.
- **Prosa-Maß:** lange Texte (FAQ-Antwort, Body, Lead) auf ~62ch `maxWidth` kappen
  (Lesbarkeit 60–75 Zeichen/Zeile).
- **Keine Echo-/Filler:** Heading, das den Page-Title doppelt, wird weggelassen (SectionHead
  macht das); keine fabrizierten Inhalte.

## 6. Zugänglichkeit / Kontrast (Pflicht)
- Über die Token-Paare laufen automatisch die AA-Garantien aus `applyLook`
  (`--ds-primary-fg`, `--ds-primary-ink`, `--ds-text-muted` ≥ 4.5:1). Deshalb Punkt 1
  strikt einhalten — eigene Farben umgehen den Schutz.
- Tap-Targets ≥ 44px (Buttons/Nav-Links). Überschriften als echte `h2/h3` (Hierarchie).
- `prefers-reduced-motion` wird global respektiert — keine eigene Animation, die das ignoriert.

## 7. Responsive (Pflicht)
Fluider Container (`var(--ds-container)` + `var(--ds-gutter)`), Grids kollabieren mobil
(`auto-fit`/`minmax`/`flex-wrap`). Keine fixen px-Breiten, die mobil überlaufen. Kein
horizontales Scrollen.

## 8. Keine fremden Runtime-Deps
`framer-motion`, `class-variance-authority`, `@radix-ui/*`, `lucide-react`, `next/*` etc.
werden NICHT importiert. Bewegung kommt aus der globalen `MotionStyles`-Schicht
(Klassen `.ds-btn` / `.ds-card` / `.ds-nudge` / `.ds-img-zoom`). Bilder als
`background-image` oder `<img>`, kein `next/image`.

## 9. Registrierung
In `variants/registry.ts` unter der passenden Kategorie:
`{ id: "<kategorie>/<name>", component, looks: StyleAffinity[], min?, needsImage?, note? }`.
`looks` = die Affinitäten, zu denen das Layout passt (`"any"` = überall). Danach wählt der
Selector sie automatisch (Affinität/Kit/Decollision) und sie erscheint in der Variant-Studio.

## 10. Verifikation (Pflicht, vor „fertig")
- `npm run audit:design` grün (Token-Only D1, keine Glyphs D2, Palette D4).
- `npm run audit:ia` grün.
- In der Variant-Studio rendern; testen, dass sie über **≥ 2 Firmen** korrekt re-skint
  (Bare-Route `?bare&firm=<slug>&<slot>=<id>`), inkl. computed-DOM-Kontrast.

---

### Schnell-Checkliste
`[ ] token-only  [ ] Content-Vertrag  [ ] <Button>  [ ] <SectionHead>/<Icon>/InvertedTone`
`[ ] 1..N + Bild-Fallback + 62ch-Cap  [ ] ≥44px/h2-h3  [ ] responsive  [ ] keine Fremd-Deps`
`[ ] registriert  [ ] audit:design+ia grün  [ ] auf ≥2 Firmen geprüft`
