# Kritik-Briefing — Generierte Treuhand-Websites

**Datum:** 2026-06-21 · **Branch:** fix-buttons-image-rhythm
**Methode:** Live-Inspektion im Playground (`?bare`-Modus), gerendertes DOM ausgelesen
(Screenshots timen auf dieser Seite aus → Text/Struktur/Links/Bilder via `preview_eval`).
Wo möglich Ursache im Code/Daten verifiziert.

## Untersuchter Querschnitt

Repräsentative Stichprobe statt aller 50×2×2 Permutationen — die Befunde sind **ganz
überwiegend systemisch** (Generator-/Extraktions-Logik) und treten bei jeder Firma
identisch auf. Tief geprüft:

| Firma | Profil | Modi/Varianten |
|---|---|---|
| onetreuhand-ch | Zürich, echte Marke (rot), datenreich | normal seed 0+1, Pitch seed 0 |
| mkfiduciaire-ch | Freiburg/Wallis, **französisch** | normal |
| taxalis-ch | Winterthur, generierter Akzent, datenarm | normal |
| steuerberatung-schweiz-ch | generischer SEO-Name, dünn | normal |
| mrg-treuhand-ch | Aadorf, **Pricing+Team**, datenreich | normal + Subpages (Leistungen/Kontakt/Impressum), Pitch |
| aawi-ch | Wetzikon, echte Marke (grün), seit 1989 | normal |

**Schweregrade:** 🔴 kritisch (kaputt / Logik / rechtlich) · 🟠 hoch (sichtbare
Inhalts-/Redundanzprobleme) · 🟡 mittel (Formatierung / Politur).

---

## ✅ Umsetzungsstatus (2026-06-21)

Alle Befunde unten wurden behoben und verifiziert. Alle **50 Firmen neu generiert**
(50/50 OK). Datei-Scan über alle 50 JSONs: **0** Pipe-/Dup-Service-Texte, **0**
Rechts-/Cookie-FAQ, **0** Fake-Team, **0** unplausible Stats, **0** falsch sortierte
Preise, **0** firmen ohne Impressum-Adresse.

| Fix | Ebene | Datei(en) | Status |
|---|---|---|---|
| A1 Footer `tel:`/`mailto:`/Ort=Text | Render | `structures/Footer.tsx` | ✅ verifiziert |
| A2 Contact-Daten klickbar + `infoOnly`-Prop | Render | `structures/Contact.tsx` | ✅ |
| A3 Impressum-Adresse = echte Stadt | Extrakt | `content/extract.ts` | ✅ (addr 50/50) |
| A4 Service-Texte nicht aus SEO-Meta + Dedup | Extrakt | `content/extract.ts` | ✅ (pipe/dup 0) |
| A5 FAQ ohne Datenschutz/Cookie/Blog/Dubletten | Extrakt | `content/extract.ts` | ✅ (legalFaq 0) |
| A6 Fake-Team verhindert | Extrakt | `content/extract.ts` | ✅ (fakeTeam 0) |
| A7 Person-Dedup (Werte vs. Team) | Extrakt | `content/extract.ts` | ✅ |
| A8 Testimonials: leere Felder gefiltert | Render | `structures/Testimonials*.tsx` (4) | ✅ (kein „· ·") |
| A9 Generische Feature-Bänder auf max. 2 | Render | `content/sectionDefaults.ts` | ✅ |
| A10 „Ihr Vorteil"-Eyebrow/Heading entkollidiert | Render | `sectionDefaults.ts` + `sectionHeads.ts` + `extract.ts` | ✅ |
| A11 Home-Kontakt info-only (kein Formular) | Render | `compose/SiteRouter.tsx` | ✅ (`formsHome:0`) |
| A12 Page-Header-Eyebrow ≠ Titel | Render | `compose/SiteRouter.tsx` | ✅ (kein 3×-Wort) |
| A14 Stats-Plausibilität | Extrakt | `content/extract.ts` | ✅ (bigStat 0) |
| A15 Preise aufsteigend sortiert | Extrakt | `content/extract.ts` | ✅ (mrg 49<240<590<790) |
| B1 Pitch: Text-Trust-Items gestrippt | Render | `compose/SiteRouter.tsx` | ✅ (`partnersLeak:false`) |
| Standort-Regex: alle CH-PLZ statt nur 8xxx | Extrakt | `content/extract.ts` | ✅ |
| Kontakt-Seite: kein eingeschobenes Feature-Band unter dem Formular | Render | `compose/SiteRouter.tsx` | ✅ (leere `map`/`downloads`-Slots gegatet) |
| **Eine Kontakt-Aufforderung pro Seite**: hat die Seite ein CTA-Band, entfällt die separate „Sprechen wir"-Kontaktsektion (Home); `/kontakt`-Formular bleibt | Render | `compose/SiteRouter.tsx` | ✅ (Home contactSection weg, CTA bleibt) |

**Bewusst nicht/teilweise umgesetzt (dokumentiert):**
- **Volles FR/IT-i18n** (mkfiduciaire): 47/50 Firmen sind DE, nur 1 primär FR (+2 EN).
  Ein vollständiges Übersetzungssystem für 1 Firma ist unverhältnismäßig. Der konkrete
  Standort-Bug ist gefixt (CH-weite PLZ); die Framing-Copy-Übersetzung ist ein separater
  Pass, falls mehrsprachige Firmen ein echtes Segment werden.
- **A17** (Stray-`„` vor Audience-Titeln): ✅ behoben — `AudienceQuote`-Variante nutzt
  jetzt das Initial-Badge statt eines Zitat-Glyphs ([AudienceExtended.tsx](structures/AudienceExtended.tsx)).
- **A18** (Stepper-Schritte 2–4 „leer"): ✅ kein Bug — es ist ein zugängliches Single-Open-
  Akkordeon ([ProcessExtended.tsx:166](structures/ProcessExtended.tsx:166), `aria-expanded`/`role=region`);
  statisch ist nur Schritt 1 offen, Klick öffnet die übrigen.
- **„Geschäftsführer | CEO"-Pipe** (Rollen-Dublette): ✅ render-seitig normalisiert
  (`cleanRole` in `compose/SiteRouter.tsx`, splittet nur auf `" | "`).
- **A16** (Partner-Block): leerer Block ist bereits per `slotHasContent` gegated; das Label
  „Mitglied · Zertifiziert" bleibt — bexio-/Abacus-**Partner-Zertifizierungen** sind real, also vertretbar.
- **A13** (Home-Sektionen auf Subpages): durch R3 (Owner-Page-Previews) + R7 (Feature-Bänder
  nur Home) weitgehend erledigt; FAQ auf /leistungen ist eine bewusste Template-Entscheidung.
- Mojibake-„�" (z.B. treuhand-zentrum-zuerich Body): nicht behebbar — das Ersetzungszeichen
  bedeutet bereits Datenverlust beim Scrape.

---

---

## A. Systemische Fehler (betreffen alle bzw. viele Firmen)

### A1 · 🔴 Telefon, E-Mail & Ort im Footer sind tote Slug-Routen statt `tel:`/`mailto:`
Jede Firma. Der Footer macht aus **jedem** Spalten-Link einen internen Routen-Slug:
- `+41 (0)44 931 35 35` → `href="/41-0-44-931-35-35"`
- `a.scherrer@aawi.ch` → `href="/a-scherrer-aawi-ch"`
- `Wetzikon` / `Aadorf` / `Zürich` → `href="/wetzikon"` …

Klick landet (über den Router-Fallback) wieder auf der Startseite. Telefon/E-Mail müssen
`tel:`/`mailto:` sein; der Ort sollte gar kein Link sein (oder Kartenlink).
**Ursache:** `structures/Footer.tsx:8` (`toSlug`) wird auf alle `c.links` angewandt (Zeile 28-29).

### A2 · 🟠 Kontaktdaten in der Kontakt-Karte sind gar nicht klickbar
Telefon/E-Mail in der Contact-Sektion werden als reiner `<span>`-Text gerendert — kein
`tel:`/`mailto:`. **Ursache:** `structures/Contact.tsx:44-51` (`InfoRow` → nackter `<span>{value}</span>`).

### A3 · 🔴 Impressum-Adresse hartkodiert „Zürich, Schweiz" — auch bei Nicht-Zürcher Firmen
mrg (Aadorf) zeigt im Impressum „MRG Treuhand · **Zürich, Schweiz**", während überall sonst
„Standort Aadorf" steht. Rechtlich falsche Impressums-Adresse.
**Ursache:** `structures/LegalBody.tsx:16` → `contact.info.address ?? "Zürich, Schweiz"`.
Fix: Ort aus der tatsächlichen Firmen-Location ableiten, nicht auf Zürich defaulten.

### A4 · 🟠 Leistungs-Beschreibungen sind rohe SEO-Meta-Descriptions / Blog-Teaser / fremd­sprachig / dupliziert
Der Service-`summary` übernimmt offenbar die SEO-Meta-Description der jeweiligen Unterseite. Folgen:
- **Keyword-Stuffing mit Pipes:** onetreuhand „Buchhaltung — Optimieren Sie Ihre Finanzen … **| 17 Jahre Erfahrung | 10-köpfiges Team | 300 zufriedene Kunden | Jetzt mehr erfahren!**"
- **Falsches Thema (Blog statt Leistung):** onetreuhand „Steuerberatung — Diese **Steuererklärung-Checkliste** zeigt …"; taxalis „Steuerberatung — Die Abschaffung des **Eigenmietwerts** …"
- **Fremdsprache:** onetreuhand „Lohnadministration — **Outsource your payroll: We handle payroll processing …**" (Englisch auf deutscher Seite)
- **Identischer Text für mehrere Leistungen:** mrg zeigt bei 4 von 6 Leistungen exakt dieselbe Meta-Zeile „MRG Treuhand Aadorf: Digitale Buchhaltung … Ab CHF 240/Monat." — und diese ist **zusätzlich** mit dem Hero-Subtitle identisch (gleicher Absatz 5×).
Fix: kurze, eigenständige Leistungs-Sätze generieren bzw. Meta-Descriptions als summary verbieten; bei Mehrfach-Identität entdoppeln.

### A5 · 🔴 FAQ enthält fremdthematische / rechtliche / abgeschnittene Inhalte
Die FAQ-Extraktion greift sich beliebige Q&A-/nummerierte/Akkordeon-Blöcke — oft das Falsche:
- **aawi:** komplette **Datenschutzerklärung** als FAQ („1. Worum geht es in dieser Datenschutzerklärung?" … „10. Online-Tracking") — und die Nummerierung springt **1, 2, 3, 5, 6, 8, 9, 10** (4 und 7 fehlen).
- **taxalis:** Fragen zum **Immobilien-/Hypothekenmarkt** (Saron-Hypothek, Festhypothek), und als letzte „Antwort" ein **Cookie-Banner-Text** („… wir mit Ihrem Einverständnis nur funktionelle Cookies einsetzen …").
- **steuerberatung-schweiz:** Antworten mitten im Satz **abgeschnitten** („… Für einfache Steuererklärungen von Privatpersonen" / „… aber auch an Lehrlinge,"); eine Frage-Antwort passt nicht zueinander („Wie es funktioniert?" → „Unsere Partner beraten in Deutsch, Englisch und Französisch").
- **mrg:** reine MWST-Blog-Serie inkl. **Dublette** („Lohnt sich die freiwillige MWST-Anmeldung?" vs. „Freiwillige MWST-Anmeldung: Wann lohnt es sich?").
Fix: FAQ-Quellen auf echte FAQ-Sektionen beschränken; Rechtstexte/Cookie/Blog ausschließen; abgeschnittene Antworten und Frage-Dubletten filtern.

### A6 · 🔴 Team-Block wird mit SEO-Schlagwörtern / Leistungen als Fake-„Personen" gefüllt
Wenn keine echten Personen erkannt werden, landen Seiten-/Keyword-Titel im Team-Slot:
- **steuerberatung-schweiz:** vier „Teammitglieder" „Steuerberater Kosten", „Steuererklärung Preise", „Steuerberatung Preise", „Steuererklärung Familien" — alle mit **identischer** Bio „Begleitet Unternehmen und Privatpersonen bei Steuererklärungen …".
- **onetreuhand:** „Steuerberatung Privat" (Rolle: „Steuern Kryptowährungen") als Person — bestätigt in den Daten (`onetreuhand-ch.json:699`: `"name":"Steuerberatung Privat"`).
Fix: Extraktion muss echte Personen (Vor-/Nachname, Foto/Funktion) von Service-/SEO-Titeln trennen; ohne echtes Team den Slot weglassen statt mit Müll zu füllen.

### A7 · 🟠 Dieselben Personen erscheinen doppelt (Werte-Block **und** Team-Block) mit unterschiedlichen Bios
mrg: Roger Gloor & Melanie Kapusta erscheinen einmal im „Mehr über uns"-Block mit **echten,
persönlichen** Bios („IT-Enthusiast mit Leidenschaft für Zahlen" / „Die Zahlenflüsterin im Team")
und ein zweites Mal im Team-Block mit **generischer** Schablonen-Bio („Verantwortlich für
Mandatsführung und Strategie – Ihre erste Adresse …"). Die schlechtere Version verdrängt die gute.
Fix: Personen nur einmal zeigen; echte Bio bevorzugen.

### A8 · 🟡 Testimonials: leeres Rollen-Feld erzeugt „Name · · Ort"
Alle Firmen mit Testimonials. Daten haben nur `person` + `city`, **kein** `role`
(`onetreuhand-ch.json:716-731`), die Komponente setzt trotzdem den Trenner →
„Sarah K. **· ·** Zürich" (leeres Mittelsegment). Zusätzlich: Stadt überall pauschal „Zürich"
(bei mkfiduciaire steht „· Zürich" unter französischen Stimmen einer Freiburger Kanzlei).
Fix: leere Segmente nicht rendern; Stadt nur wenn plausibel.

### A9 · 🟠 Redundante Benefit-/Feature-Bänder — bis zu vier fast gleiche Aussagen
Auf einer Seite stapeln sich generische Bänder mit Eyebrow + 3 Bullets + CTA, die alle
dasselbe sagen (persönlicher Ansprechpartner, digitale Prozesse, mehr Zeit):
`WARUM WIR – Persönliche Beratung, digital gedacht` · `IHR VORTEIL – Klare Zahlen, bessere
Entscheidungen` · `ARBEITSWEISE – Lokal verankert, effizient organisiert` · `FOKUS – Mehr Zeit
fürs Wesentliche`. Im Pitch-Modus werden es noch mehr (siehe B3).
Fix: max. 1–2 generische Benefit-Bänder pro Seite, Rest droppen/zusammenführen.

### A10 · 🟡 „Ihr Vorteil" doppelt als Heading und als Eyebrow
Der Werte-Block trägt die Überschrift „**Ihr Vorteil.**", während ein anderes Band den Eyebrow
„**IHR VORTEIL**" über „Klare Zahlen, bessere Entscheidungen" führt — gleiche Wortmarke zweimal,
wirkt wie ein Fehler.

### A11 · 🟠 CTA-Band „Bereit …?" direkt gefolgt von Kontaktformular (verstößt gegen die eigene Regel)
onetreuhand & taxalis: „**Bereit, Ihre Finanzen abzugeben?**" (CTA-Band) steht unmittelbar vor der
Kontakt-Sektion **mit Formular** (Name/E-Mail/Nachricht). Laut Vorgabe darf direkt unter einem
„Bereit?"-Band kein Formular stehen (Kontakt = nur Infos).
Fix: auf der Home nach dem CTA-Band die Kontaktsektion form-los (Info-only) rendern.

### A12 · 🟡 Subpage-Titel == Sektions-Eyebrow → dreifach gestapeltes Wort
Auf Unterseiten steht das gleiche Wort drei Mal untereinander: `/leistungen` → „**Leistungen
Leistungen Leistungen** Alles aus einer Hand."; `/kontakt` → „**Kontakt Kontakt Kontakt**
Sprechen wir." (Page-Header-Titel + Sektions-Eyebrow + ggf. Nav).
Fix: bei Gleichheit Eyebrow oder Page-Header-Titel unterdrücken.

### A13 · 🟠 Subpages wiederholen Home-Sektionen 1:1
`/leistungen` zeigt erneut die kompletten Benefit-Bänder **und** die identische FAQ von der Home;
`/kontakt` wiederholt das „Persönliche Beratung"-Band. Viel Doppelung über Seiten hinweg.
Fix: generische Bänder/FAQ nicht auf jeder Unterseite wiederholen.

### A14 · 🟠 Stats werden ungeprüft übernommen — unplausible & widersprüchliche Zahlen
mrg (laut `meta.real` echte Scrape-Werte, also mis-extrahiert, nicht erfunden):
„18+ Jahre Erfahrung · 38+ KMU · 15+ Mitarbeitende · **80000+ Unternehmen**".
- „80000+ Unternehmen" ist für eine Aadorfer Kanzlei absurd.
- „38+ KMU" **und** „80000+ Unternehmen" sind dasselbe Maß, widersprechen sich.
- „15+ Mitarbeitende", obwohl das Team nur 2 Personen zeigt.
onetreuhand: „300+ KMU" / „25+ Unternehmen" — wieder KMU/Unternehmen-Überschneidung.
Fix: Plausibilitäts-/Dedupe-Filter für Stats (`SiteRouter` filtert bisher nur Nullwerte, `:124-127`).

### A15 · 🟠 Preis-Logikfehler in den Paketen
mrg-Pricing: „Starter ab CHF 240" → „KMU (Empfohlen) ab CHF 590" → „**Komplett ab CHF 49**".
Das Komplett-Paket (Top-Stufe) ist mit CHF 49 das **billigste** — unglaubwürdig, sofort sichtbar.
Fix: Tiers nach Preis sortieren / Ausreißer prüfen; „auf Anfrage" und Frankenbeträge nicht mischen.

### A16 · 🟡 „Mitglied · Zertifiziert"-Block: Drittsoftware als Mitgliedschaft/Zertifikat, oft leer
Der Partner-/Zertifizierungs-Block listet Software-Marken (abacus, bexio, klara, sage, banana,
topal, swiss21) unter dem Label „**Mitglied · Zertifiziert**" — Software ist weder Mitgliedschaft
noch Zertifikat. Bei mehreren Firmen erscheint außerdem nur die Überschrift „Mitglied · Zertifiziert"
**ohne** Inhalt darunter.
Fix: Software-Tools von Verbänden/Zertifikaten trennen, Label korrekt vergeben, leeren Block droppen.

### A17 · 🟡 Stray-Anführungszeichen „ als Deko vor Audience-Titeln
„Für wen wir arbeiten" zeigt vor jeder Karte ein einzelnes öffnendes „ („**„** KMU & Unternehmen"),
das wie ein Tippfehler wirkt (onetreuhand, aawi).

### A18 · 🟡 Prozess-Schritte 2–4 ohne Text (nur in der Stepper/Tab-Variante) — verifizieren
In der Variante, in der die Schritte als Buttons/Tabs rendern (mk, mrg), zeigt statisch nur
Schritt 01 einen Beschreibungstext; 02–04 wirken leer. Prüfen, ob die Texte beim Umschalten
erscheinen — sonst Body fehlt.

---

## B. Kaltakquise-(Pitch-)Modus

Funktioniert grundsätzlich: Logo→Wortmarke, echte Fotos→Stock-Hintergründe, Bild-Badges entfernt
(`realImgCount: 0` bestätigt). Aber:

### B1 · 🔴 Text-Trust-Items leaken — unbelegte Mitgliedschafts-/Zulassungs-Claims auf fremder Mock-Seite
Pitch entfernt nur die **Bild**-Badges, der **Text** des Trust-Blocks bleibt. mrg Pitch zeigt:
„Mitglied · Zertifiziert · **TREUHAND|SUISSE · EXPERTsuisse · RAB/zugel. Revisor · eidg.
Diplom/Fachausweis · abacus · banana · bexio**". onetreuhand Pitch ebenso (TREUHAND|SUISSE,
abacus, bexio, klara). Auf einer unaufgefordert gehosteten Fremd-Mockup werden damit
**unverifizierte Verbands-Mitgliedschaften und Revisions-Zulassungen** im Namen der Zielfirma
behauptet — genau das, was Pitch eigentlich strippen soll.
**Ursache:** `SiteRouter.tsx:90-100` nullt nur `media.badges`, lässt `content.trust.items` stehen.
Fix: im Pitch auch `trust.items` (Verbände/Zulassungen) und das „Mitglied · Zertifiziert"-Label entfernen.

### B2 · 🟠 Entfernen echter Bilder bläht die Seite mit zusätzlichen generischen Bändern auf
Weil im Pitch die echten Fotos wegfallen, fügt der Bild-Rhythmus mehr Feature-Bänder ein.
onetreuhand Pitch hat dadurch zusätzlich „ARBEITSWEISE …" und „FOKUS …" → vier fast gleiche
Benefit-Bänder (vgl. A9). Pitch-Seiten werden länger und redundanter als die Normalversion.

### B3 · 🟡 Alle Inhaltsfehler aus Abschnitt A bleiben im Pitch sichtbar
Kaputte E-Mail/Telefon-Links, SEO-Service-Texte, falsche FAQ, Fake-Team usw. sind im Pitch
unverändert — der Modus kaschiert sie nicht.

> Zur Bestätigung: Im Pitch bleiben die **echten Klarnamen** des Teams stehen (Foto→Monogramm).
> Das ist laut Tooltip so gewollt („Recognition über Name"). Falls für Kaltakquise unerwünscht,
> hier markieren.

---

## C. Firmenspezifische Beispiele (zur Reproduktion)

- **onetreuhand-ch:** E-Mail „**elcome**@onetreuhand.ch" (führendes „w" fehlt — schon in den Daten kaputt, `:812`); Rolle „Geschäftsführer **|** CEO" (DE/EN-Dublette mit Pipe); FAQ-01 „Sie wollen mehr Gewinn …? – **ein einfaches Finanzsystem …**" (Antwort beginnt mitten im Satz); Werte-Block zieht generischen **CFO-Outsourcing-Blogtext** („Die Einstellung eines Vollzeit-CFOs …").
- **mkfiduciaire-ch:** **FR/DE-Sprachsalat** (französischer Hero/Content + deutsche Nav + deutsche generische Bänder); Wortmarke „**MK Treuhand**" ≠ echter Name „MK Fiduciaire"; Standort fälschlich „**Zürich**" (Kanzlei in Freiburg/Wallis); „**à Suisse**" (falsches Französisch) 3× wiederholt; Keyword-Liste „Fribourg, Valais, Zürich, Basel, Bern" auch im Testimonial.
- **taxalis-ch:** FAQ = Immobilien-/Hypotheken-Blog + Cookie-Text; Service „Steuerberatung" = Eigenmietwert-Blogabschnitt.
- **steuerberatung-schweiz-ch:** 4 Keyword-Fake-Teammitglieder (identische Bio); abgeschnittene FAQ-Antworten; klein­geschriebenes „**buchhaltung**" mitten im Satz; E-Mail rendert als „**info@…**" (abgeschnitten/ungültig, auch als Link `/info`).
- **mrg-treuhand-ch:** Preis-Logik (Komplett 49 < Starter 240 < KMU 590); Service-Meta 4×/Hero-Dublette; Stats „80000+ Unternehmen"; Team-Duo doppelt; Impressum „Zürich" statt Aadorf; FAQ-Dublette.
- **aawi-ch:** FAQ = vollständige Datenschutzerklärung (Nummerierung springt 1-2-3-5-6-8-9-10); „bexio" als „Mitglied · Zertifiziert".

---

## D. Empfohlene Reihenfolge (Impact × Aufwand)

1. **A1 / A3 / B1** — kaputte/rechtlich heikle Links & Claims (klein, hoher Impact).
2. **A6 / A5 / A4** — Extraktions-Qualität: Fake-Team, FAQ-Quellen, Service-Summaries (Kern der Inhaltsglaubwürdigkeit).
3. **A14 / A15** — Stats-/Preis-Plausibilität.
4. **A7 / A9 / A11 / A12 / A13** — Doppelungen & Redundanz (Struktur/Render).
5. **A2 / A8 / A10 / A16 / A17 / A18 / B2** — Formatierungs-/Politur-Punkte.

> Coverage-Hinweis: 6 Firmen tief geprüft. Wenn gewünscht, prüfe ich gezielt weitere Firmen
> (z. B. alle französischen/mehrsprachigen, oder alle mit Pricing/Stats) auf zusätzliche
> Daten-Einzelfälle — die obigen Punkte gelten aber generatorweit.
