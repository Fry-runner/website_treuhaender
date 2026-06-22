# Inhalts-Audit: 50 generierte Websites vs. Scrape-Daten

**Stand:** 2026-06-22 · **Methode:** Pro Firma `scraper/output/<slug>/site.json` (Kontakt, JSON-LD,
Headings, Seitentexte, Seiten-Coverage) gegen `design-system/content/examples/<slug>.json`
(generierter Inhalt) verglichen. 50 Firmen, 8 parallele Audit-Pässe, jeder Befund mit Scrape-Beleg.
Fokus = **Inhalt** (nicht Layout/Design). Gewollte Designregeln (DE-only, generisches
faq/process/about-Scaffold wenn der Scrape nichts hatte, Knowledge/News kein Marketing-Inhalt)
wurden NICHT als Fehler gewertet.

> **Headline-Risiko:** Die gefährlichste Klasse sind **fabrizierte Fakten, die als `meta.real`
> markiert sind** (erfundene Stats, erfundene Testimonials, nicht belegte Zertifikate). Genau diese
> Seiten werden als „Redesign deines Auftritts" an echte Firmen versendet — falsche Zahlen/Logos im
> Namen der Firma sind sachlich UND rechtlich heikel (UWG/Lauterkeit) und untergraben das Projektziel
> „Social Proof nur mit echten Daten".

---

## Teil A — Systemische Muster (priorisiert, das sind die Generator-Fixes)

### A1 · Strassenadresse → nur Ort  *(quasi ALLE Firmen)*
`contact.info.address` wird auf den blossen Ort reduziert, obwohl Strasse + PLZ im Scrape vorliegen
(meist `PostalAddress` im JSON-LD oder im Footer/Kontakt). Beispiele: onetreuhand „Zürich-Glattbrugg"
statt **Europa-Strasse 19, 8152**; accuratus „Zürich" statt **Norastrasse 7, 8004**; idp „Zürich"
statt **Bahnhaldenstrasse 6, 8052**; latreuhand statt **Badenerstrasse 745, 8048**; mueller-schuhmacher
sogar ein kaputtes Fragment **„Durchschnittliche"** statt Bürglistrasse 29, 8401.
→ Adress-Extraktion soll die volle `streetAddress`+`postalCode` aus dem JSON-LD übernehmen.

### A2 · E-Mail-Auswahl falsch / kaputt  *(~20 Firmen)*
Statt der `info@`-Sammeladresse der EIGENEN Domain wird eine schlechtere Quelle gewählt:
- **Persönliche Mitarbeiter-Mail** statt `info@`: rebex (`a.g.florian@`), sbt (`a.bosshard@`),
  maurer (`k.murtezi@`), taxalis (`andrea.vettiger@`), suter (`contact@` statt `info@`), TZZ
  (`albana.jetishi@`), treuhand-zuerich (`amir.hanna@`), zurichtax (`fo@`), kmutreuhand
  (`anna.reinhard@`), hmr (`karin.baumgartner@`), stm (`d.weber@`).
- **Fremddomain** (Webdesigner/Agentur/andere Firma): langhart → **`info@hingucker.ch`** (Webdesigner!),
  accuratus → **`info@campfire.ch`**, treuhandgraf → **`info@haugag.ch`**, turicum → **`adrian.meier@accurata.ch`**.
- **Kaputt/Encoding**: onetreuhand **`elcome@…`** (führendes „w" abgeschnitten), idp/spp/urania/zh
  **`%20info@…`** (URL-Encoding `%20`/Leerzeichen nicht gefiltert).
- **Leer trotz vorhandener Mail**: budliger (`""`), treuhandsiegrist (`""`).
→ Regel: bevorzuge `info@`/`kontakt@` der eigenen Domain; filtere `%20`/Leerzeichen/abgeschnittene
Local-Parts; ignoriere Fremddomains; Mitarbeiter-Mail nur als letzter Fallback.

### A3 · Echte Teams verworfen / namensgebender Inhaber fehlt  *(~20 Firmen)*
`team.members` ist trotz namentlich gescrapter Personen **leer** bei: aawi, accuratus (4 Personen),
aurora, divisia, global, hermann, hmr (5), interconsulta, kmu-trex, langhart (5), kmutreuhand, stm,
taxalis (16+!), turicum (7), zh, zurichtax, treuhandmitherz, steuervogt. Besonders gravierend:
**der Namensgeber/Inhaber wird gedroppt** — treuhandgraf (Manuel **Graf** fehlt), treuhandschmid
(Catherine **Schmid** fehlt), treuhandmitherz (Marco Gartwyl), wuerth (Urs Ritschard), hermann
(Thomas Hermann). Andere nur Teilmenge: onetreuhand (1 statt „10 Experten"), TZZ (1), stg-zuerich
(6 statt 9), idp (4 statt 6, lässt Co-GF Iten weg), spp, urania (2 statt 8), treuhandgraf (3 statt 6).

### A4 · Fabrizierte / falsche Stats — als `meta.real` markiert  *(~10 Firmen — gefährlichste Klasse)*
- budliger: **„2024+ KMU"** (Jahreszahl als KMU-Zahl), **„450+ Mitarbeitende"** (vermutlich OBT-Gruppe).
- hermann: **„1997+ Kunden"** (1997 = Gründungsjahr!), **„8+ Jahre"** (real ~28).
- mrg: **„3800+ KMU"** (Scrape: „38+ KMU" → Faktor 100), **„18+ Jahre"** (Scrape: 15+).
- adea: **„15+ Mitarbeitende"** — obwohl **Einzel-Treuhänderin** (durchgehend „ich/mir").
- treuhand-zentrum-zuerich: **„250+ Mitarbeitende"** (Zahl stammt aus einem Asset-Dateinamen-Hash!),
  **„19+ Jahre"** (Scrape UND eigener About-Text: „über 17 Jahre").
- treuhandbuero24: **„123+ Jahre Erfahrung"** (unmöglich), **„950+ Unternehmen"**.
- stg-revision: **„33+ Mitarbeitende"** — Zahl aus dem Geschichtstext von **2009**, als aktuell dargestellt.

### A5 · Fabrizierte Testimonials / echte Reviews ignoriert
- **onetreuhand**: 3 Testimonials „Sarah K. / Thomas H. / Alex S." (Zürich-Glattbrugg) + Hero-Aside-Zitat
  — **komplett erfunden**; der Scrape hat nur anonym „4.8/5 bei 21 Bewertungen" (Google, kein Wortlaut).
- Echte Reviews/`AggregateRating` im Scrape, aber `testimonials` LEER: mrg (5.0/5, 14), mkfiduciaire
  (4.9★ Google), TZZ (Reviews-Block), maurer, langhart (ganze Referenzseite), divisia, aawi.
- Positiv: bei der grossen Mehrheit sind Testimonials leer (kein Fabrikat) — onetreuhand ist die Ausnahme;
  treuhandsiegrist-Testimonials sind echt (per `/bewertungen/` belegt).

### A6 · `values` mit Fremdinhalt gefüllt  *(~12 Firmen)*
Als „Werte/Ihr Vorteil" gerendert werden in Wahrheit: **Teammitglieder-Namen** (maurer: Lea Hofer/Yanik
Kunz; sebona: Gian-Carlo Fossa/Mayra Guarin; wespi: Huyen Nguyen; zurichtax: Inhaber Fatih Özonar),
**Leistungs-/Navi-Labels** (steuervogt, suter, divisia, urania-nah), **Sektionsüberschriften** (rebex,
treuhandsiegrist, treuhaender-zuerich-Slogans), ein **falsch zugeordnetes Personen-Zitat** (idp: Dudlis
Zitat als „Immobilien"-Audience) und sogar **Cookie-Banner-Text** (budliger: „…Wir verwenden Cookies…").

### A7 · Echte FAQ (FAQPage-JSON-LD) ignoriert  *(~8 Firmen)*
onetreuhand, adea, idp, mrg, sebona, stm, taxalis, TZZ haben **echte FAQ** im Scrape; generiert ist
`faq` leer — oder (mrg) mit **generischen Fremd-FAQ** befüllt. `meta.placeholders` führt „faq" als
scaffolded, obwohl reale Daten existierten (Widerspruch). Beispiel adea: echte Frage „Was kostet eine
Steuererklärung im Kanton Zürich? → ab CHF 150.–" geht verloren.

### A8 · Zweit-/Mehrfachstandorte verloren  *(~14 Firmen)*
Nur EIN Standort übernommen, oft sogar der zweitrangige: interconsulta (Zürich-HQ **+ Zug** → nur
„Zug"!), kmu-trex (Thalwil+Urdorf), sebona (Kloten/Zürich/Zug/Schwyz), rebex (Dietikon+Zürich), suter
(Luzern+Zürich), taxalis (Winterthur+Wetzikon), TZZ (Zürich+Lachen), stg-revision (Bern/Zürich/Baar),
stg-zuerich (Zürich+Chur), urania (3), v-buchhaltung (5), zh (Warth+Dübendorf), zurichtax (2 Regionen),
treuhandmitherz (Rafz **+ Winterthur**, dabei Winterthur der Hauptsitz), adea (Zürich+Bremgarten).

### A9 · Generisches 6er-Leistungsraster überschreibt das echte Profil  *(~15 Firmen)*
Das Standard-Set (Buchhaltung/Steuern/Lohn/Jahresabschluss/MWST/Unternehmensberatung) verdrängt die
firmenspezifische Spezialisierung — teils werden **Leistungen erfunden, die die Firma gar nicht anbietet**:
- **mueller-schuhmacher** ist primär **Immobilien** (Verkauf/Bewirtschaftung/STWEG/Bauleitung) → Treuhand-Generik.
- **taxalis**: Immobilien + Erbrecht/Nachlassplanung → generisch.
- **aurora**: „spezialisiert auf Privatpersonen" (Steuern + **Erbrecht**) → bekommt Buchhaltungs-Services,
  die sie laut Scrape NICHT anbietet.
- Revision/Wirtschaftsprüfung als Kernleistung fehlt: interconsulta, rebex, turicum, accuratus, wuerth.
- Verlorene USPs: treuhand-zuerich (**Reisebüro-Treuhand**), treuhandmitherz (**Senioren/Spitex**),
  zh (**KMU vs. Ärzte**), stg-zuerich (**Trust & Gestion/Family Office**), kmu-trex (**Coaching, „Für Treuhänder"**).

### A10 · Service-Texte mit Blog-/News-/EN-Fremdtext
Service-Summaries/Bodies tragen Ratgeber-/News-/SEO-Fragmente statt Leistungsbeschreibungen: sebona
(Blog-Teaser), mkfiduciaire (Ratgeber-Artikel), **monere (englische SEO-Texte!**, „Discover tailored
solutions…" — widerspricht DE-only), suter (News-Spam „Trinkgelder fliessen in die Bemessungsgrundlage…"),
treuhaender-zuerich (News-Floskeln), wespi (Payroll-Text unter „Buchhaltung"), v-buchhaltung (Standort-SEO),
aurora (Navi-Fragment). Hinweis: Quellen mit Mojibake (`Ã¼`) werden meist sauber rekonstruiert — gut.

### A11 · Öffnungszeiten verloren oder ERFUNDEN
Verloren (im Scrape vorhanden): balbiani, adea, kmu-trex, sbt, latreuhand, treuhandschmid, interconsulta,
steuerberater365, zurichtax. **Erfunden** (im Scrape NICHT belegt): langhart **„Mo–So 09–17"**,
mueller-schuhmacher **„Mo–So"**, treuhandbuero24 **„Mo–So 00:00–23:59"** (24/7 als Bürozeit). `contact.hours`
teils fälschlich als `meta.real` markiert.

### A12 · Echte Preise / Offer verloren  *(~10 Firmen)*  ·  `pricing: 0 tiers`
adea (ab CHF 150), global (Einzel ab CHF 121 / Doppel ab CHF 150), sebona (ab CHF 160/Mt., HR ab CHF 351/MA/J.),
steuerberater365 (ab CHF 49), v-buchhaltung (ab CHF 49), zurichtax (ab CHF 60), suter (Firmengründung ab CHF 450),
kmutreuhand. Das sind oft die zentralen Verkaufsargumente der Quellseite.

### A13 · Echte History / Gründungsjahr verloren  *(~15 Firmen)*  ·  `HISTORY: NONE`
balbiani (1960), accuratus (Ende 2001), interconsulta (1964), rebex (1997 GmbH → 2000 AG), **stg (1906 —
ältestes Treuhandunternehmen der CH!)**, langhart (30 J./Jubiläum 2024), urania (1983 + ganze Chronik),
treuhandgraf (1989 → 2002 AG), treuhandsiegrist (1993, ehem. „MCS, Siegrist & Partner"), taxalis (20+ J.),
hermann (1997), kmutreuhand (2014). Teils inkonsistente Gründungsjahre (idp Hero „bald 30 J." vs. About „seit 1992";
treuhandsiegrist About „seit 1995" vs. Scrape „1993").

### A14 · Trust-Badges ohne Scrape-Beleg
Nicht belegte Zertifikat-/Software-Badges: mrg (EXPERTsuisse), rebex (klara/sage), sbt (abaweb), sebona
(abacus/banana/swissaccounting), monere (TREUHAND|SUISSE), kmutreuhand (RAB/Revisor), wuerth (abaninja/abaweb/bexio),
zh (klara), v-buchhaltung (klara), langhart (abacus — real beworben ist **Comatic**).

### A15 · Falsche Identität / Plattform als „Firma"

> **Umsetzung (2026-06-22, Commit `0800d15`):** Die 3 Plattformen (steuerberater365-zuerich,
> steuerberatung-schweiz, treuhandbuero24) und die Freiburger mkfiduciaire wurden komplett aus
> dem Projekt entfernt (Set jetzt 46 Firmen). **turicum** wurde behalten und korrigiert
> (Scrape lieferte die ACCURATA-Holding-Seite): Kontakt, Hero und ein echtes 9-köpfiges Team.

- **steuerberater365-zuerich** & **steuerberatung-schweiz**: Lead-Vermittlungs-Plattformen (Impressum:
  „Web Vermarktung GmbH", Metzerlen/Reinach BL) — als „Zürcher Treuhänder vor Ort" dargestellt; Telefonnummern
  und Stadt frei zusammengesetzt.
- **treuhandbuero24**: Offerten-/Vermittlungs-Portal (Doorway-Site) — als normales Büro dargestellt; Sitz Aargau,
  Name trägt „Zürich".
- **turicum**: ist Tochter der **ACCURATA Holding AG**; Hero beschreibt die Holding, Telefon gehört zur
  „Aerzte Treuhand med AG" → widersprüchliche Identität.
- **mkfiduciaire**: **Freiburger** Firma (Vorwahl 026) — als „in Zürich" dargestellt (falscher Kanton).
- **spp**: Name verkürzt auf „SPP Treuhand AG" statt „SPP **Schlunegger Park & Partner** Treuhand AG".

### A16 · Encoding/Korruption durchgerutscht
treuhandmitherz: Telefon **`+41\n52 551 50 00`** (Zeilenumbruch im Feld); treuhandsiegrist: **`�`** statt
Umlauten in about/testimonials; mueller-schuhmacher: address-Fragment „Durchschnittliche"; diverse `%20`
in E-Mails (A2).

### A17 · CMS-Boilerplate als sichtbarer Text  *(stg-zuerich)*
`about.paragraphs` enthält internen CMS-Müll: *„Dieses Element braucht es für die Definition der Reihenfolge
der Filter-Elemente."* / *„Es ist nur in eingeloggtem Zustand sichtbar und darf nicht gelöscht werden."* —
plus abgeschnittener Lead, der mitten im Satz beginnt („**sind** die prägenden Gesichter…", Subjekt fehlt).

---

## Teil B — Befunde pro Firma

Legende: **[FALSCH]** = falsch/kaputt dargestellt · **[MANGEL]** = echter Inhalt verschlechtert ·
**[FEHLT]** = echter Scrape-Inhalt fehlt komplett.

### aawi-ch — mittel
- [FEHLT] team 0 — Scrape: Christa Stürmer, Marco Krähenbühl, Astrid Scherrer (Geschäftsleitung/Das Team).
- [FEHLT] testimonials — Scrape-Homepage „Das sagen unsere Kunden über uns".
- [FEHLT] history/about — Hero „Seit 1989 – Ihr Treuhand-Partner im Zürcher Oberland"; generiertes About generisch.
- [MANGEL] address nur „Wetzikon" (Strasse+PLZ im Impressum).
- [MANGEL] services: „Mehrwertsteuer" erfunden, echte Leistung „Firmengründung" fehlt.

### accuratus-treuhand-ch — hoch
- [FALSCH] email `info@campfire.ch` (Agentur-Fremddomain) — echt: `mail@accuratus-treuhand.ch`.
- [FALSCH] values = Navi-/Firmenname-Fragmente („Accuratus-Treuhand GmbH", „Live Support", …) als `meta.real`.
- [FEHLT] team 0 — Scrape: Theo Herger (GF), Rupa Herger, Andrea Jenzer-Schoch (Treuhänderin eidg. FA), Kerstin Moeri (Dipl. Treuhandexpertin).
- [FEHLT] about/history — „gegründet Ende 2001 … ‚Accuratus' steht für genaue Arbeitsweise … seit >20 Jahren", Mitglied TREUHAND SUISSE.
- [FEHLT] testimonials — echtes Zitat „Beat Eschmann, Bildhaueratelier".
- [FALSCH] services: Lohn/Jahresabschluss/MWST/Unternehmensberatung erfunden; echte Kernleistung Wirtschaftsprüfung/**Revision (RAB Nr. 501246)** fehlt.
- [MANGEL] contact: address nur „Zürich", phone Handy statt Festnetz 044 404 70 16 (Norastrasse 7, 8004 Zürich).

### adea-treuhand-ch — hoch
- [FALSCH] stats „15+ Mitarbeitende" / „15+ Jahre" — Scrape: selbständige **Einzel**-Treuhänderin (Alexandra Ivanova).
- [FEHLT] faq — echte FAQPage (u.a. „Steuererklärung ab CHF 150.–"; Lohnbuchhaltung; Online-Beratung).
- [FEHLT] pricing — transparente Preise/Kostenkalkulator „ab CHF 150.–".
- [FEHLT] standorte/hours — 2 Standorte (Zürich Kalkbreitestr. 59 / Bremgarten Ringstr. 8) + Öffnungszeiten.
- [MANGEL] phone „062…" (= Bremgarten) statt Zürich „044 515 56 35"; values grammatikfehlerhaft/Fragmente.

### aurora-treuhand-ch — hoch
- [FALSCH] email `aurora.ag@bluewin.ch` (private Nebenadresse) — echt `info@aurora-treuhand.ch`.
- [FALSCH] phone „044 492 41 75" — Hauptnummer ist „044 492 41 92".
- [FEHLT] team/about 0 — Inhaberin Karin Stierli-Welti (eidg. FA) + Werdegang komplett weg.
- [FALSCH] services erfunden (Buchhaltung/Jahresabschluss/Unternehmensberatung) — Firma macht nur Steuern + **Erbrecht**; Erbrecht fehlt.
- [MANGEL] hero „Region Meilen" nicht belegt (Sitz Zumikon/Küsnacht); Service-Summary = Navi-Fragment.

### balbiani-ch — mittel
- [FEHLT] history — „1960 von Fernand Balbiani in Dietikon gegründet, 1980 Sohn Jean-Pierre", „seit über 60 Jahren".
- [FEHLT] hours — Mo–Do 8:30–12/14–17:30, Fr 8:30–15.
- [FEHLT] Revisor-Detail — RAB Jean-Pierre Balbiani, Zulassungs-Nr. 106 509 (nur generisches Badge).
- [MANGEL] about generisch; services „MWST/Jahresabschluss" erfunden, echte „eingeschränkte Revision"/„Erbschaft" fehlen.
- [MANGEL] email `jean-pierre@balbiani.ch` statt Firmenadresse `treuhand@balbiani.ch`.

### budliger-ch — hoch
- [FALSCH] stats „2024+ KMU" (Jahreszahl), „450+ Mitarbeitende" (vermutlich OBT-Gruppe) als `meta.real`.
- [FALSCH] email leer — Scrape hat dutzende `@budliger.ch` inkl. `mail@budliger.ch`.
- [FALSCH] team-bios generisch-identisch; zwei „Mitglieder" ohne Namen (nur Rolle).
- [FALSCH] values enthält Cookie-Banner-Text „…Wir verwenden Cookies…".

### divisia-treuhand-ch — mittel
- [FALSCH] Kontaktnummer „044 811 00 99" — Scrape kennt nur „…90"/„…91".
- [FEHLT] testimonials — Homepage-Sektion „Testimonials".
- [FEHLT] team/about — /team, /firma, JSON-LD Person „Patrick Sonderegger, Dipl. Treuhänder MAS FH".
- [MANGEL] services „Jahresabschluss/MWST" erfunden; echte Revision + Unternehmensberatungs-Struktur nur teils; values = Leistungs-Labels.

### global-treuhand-ch — mittel
- [FEHLT] team — Zojë Osmani, Geschäftsführerin, Eidg. dipl. Fachfrau Rechnungswesen (mit Bio).
- [FEHLT] pricing — Steuererklärung Einzel ab CHF 121 / Doppel ab CHF 150.
- [FALSCH] hero/footer „in Kloten & Umgebung" — Sitz ist **Wallisellen** (Grindelstrasse 6, 8304).
- [FALSCH] Handy „076 302 72 08" nicht übernommen; [MANGEL] address nur „Wallisellen"; Jahresabschluss „Swiss GAAP FER" generisch (Scrape nur OR).

### hermanntreuhand-ch — hoch
- [FALSCH] stats „1997+ Kunden" (1997 = Gründungsjahr), „8+ Jahre" (real ~28).
- [FEHLT] team — Thomas Hermann (Treuhandexperte, Inhaber).
- [FEHLT] services „Firmengründung" (eigene Seite), Cloud-Buchhaltung/Bexio.
- [MANGEL] address nur „Winterthur" (Schaffhauserstr. 37); email generisch statt `t.hermann@`; History = persönlicher Werdegang als Firmengeschichte gerahmt.

### hmrpartner-ch — hoch
- [FEHLT] team — Karin Baumgartner, Sandro Zatti, Andrina Löhle, Patrizia Fleischmann, Lara Walker.
- [FALSCH] hero.lede/footer = roher abgeschnittener SEO-String „HMR PARTNER … Neue Jonastrasse 79 … Treuhand Rapper…".
- [MANGEL] email = persönliche `karin.baumgartner@`; address nur „Rapperswil" (Neue Jonastrasse 79, 8640).
- [FEHLT] about/Portrait-Text; [MANGEL] Kernleistung „Finanzcontrolling" verflacht.

### idp-treuhand-ch — hoch
- [FALSCH] email `%20info@idp-treuhand.ch%20` (URL-encoded, kaputt).
- [FALSCH] audience „Immobilien"-Body = Mathias Dudlis Team-Zitat (falsch zugeordnet).
- [FALSCH] about.heading „Mitgliedschaften" (echter Über-uns-Text „seit 1992 …" existiert).
- [FEHLT] faq — echte FAQPage (Erbvorbezugsgemeinschaft, Erbschaftssteuern, AG/GmbH/Einzelfirma).
- [MANGEL] team 4 von 6+ (Co-GF Iten + Greter fehlen); address nur „Zürich" (Bahnhaldenstr. 6, 8052); Mitgliedschaften unvollständig (HEV/Successio/Dein Adieu fehlen).

### interconsulta-ch — hoch
- [FALSCH] address „Zug" als primär — Hauptsitz ist **Zürich** (Waaggasse 5, 8001); Zug nur Zweigstelle.
- [FEHLT] zweiter Standort (Zürich + Zug), history (gegründet 1964), team (zwei geschäftsführende Inhaber).
- [FALSCH] services Lohn/MWST als Kern — Firma ist Revisions-/Wirtschaftsprüfungshaus (OR-Revision, Konzern, Due Diligence …).
- [FEHLT] hours „täglich 08–17".

### kmu-trex-ch — hoch
- [FEHLT] team — Meriton Krasniqi, Jovica Granula, Dr. Burim Pavataj.
- [FEHLT] zweite Filiale (Thalwil Zürcherstr. 100 **+ Urdorf Im Spitzler 7**); hours (Mo–Do 8–12/13:30–17 …).
- [FEHLT] Spezial-Angebote „Individuelles Coaching" und „Für Treuhänder" (USP).
- [MANGEL] address nur „Thalwil"; Steuerberatung generisch (echte Kompetenzliste fehlt); Immobilien/Versicherung aus About fehlen.

### kmutreuhand-com — mittel
- [FALSCH] email `anna.reinhard@` (persönlich) — echt `info@kmutreuhand.com`.
- [FALSCH] trust „RAB/zugel. Revisor" ohne Beleg.
- [FEHLT] team (Monika Manco-Hostettler/Gründerin, Anna Reinhard), history (2014 gegründet als Einzelfirma → GmbH).
- [MANGEL] address „Steffisburg" (Bernstrasse 134, 3613).

### langhart-partner-ch — hoch
- [FALSCH] email `info@hingucker.ch` (Webdesigner!) — echt `info@langhart-partner.ch`.
- [FALSCH] hours „Mo–So 09–17" erfunden (als `meta.real`); trust „abacus" — real beworben ist **Comatic**.
- [FEHLT] team (Urs Langhart, Sabrina Schäfer-Langhart, Lidia Cerra, Lukas Manser, Nathalie Wittausch), Referenzen/Testimonials (Bau Pfister, Restaurant Millenium …), history („Über 30 Jahre", Jubiläum 2024).
- [MANGEL] address „Wetzikon" (Bahnhofstrasse 156, 8620).

### latreuhand-ch — niedrig
- [MANGEL] address nur „Zürich" (Badenerstrasse 745, 8048).
- [FEHLT] hours; Spezial-Leistungen Immobilien/Erbrecht/Vermögensverwaltung auf Standard-Set eingedampft.
- (Team 4 + Gründung 1981 sind echt belegt — kein Fabrikat.)

### maurer-treuhand-ch — hoch
- [FALSCH] values = Teammitglieder „Lea Hofer"/„Yanik Kunz" (mit Mitarbeiterzitaten).
- [FALSCH] email `k.murtezi@` — echt `willkommen@maurer-treuhand.ch`.
- [MANGEL] address „Zürich" falsch — Sitz **Dübendorf** (Th. Maurer Treuhand AG, Neugutstr. 52, 8600); „seit 1980" nicht als History.
- [FEHLT] testimonials („Das sagen unsere Kunden"); 2 echte Personen fehlen im Team (in values gelandet).

### mkfiduciaire-ch — hoch
- [FALSCH] Standort „Zürich" — Firma ist **Freiburg** (026er Vorwahl, Bulle/Morat/Romont …).
- [FALSCH] services-Summaries = Blog-/Ratgeber-Artikel statt Leistungen.
- [FEHLT] Reviews („4.9★ Google"), Multi-Standort (zahlreiche Stadtseiten).

### monere-ch — hoch
- [FALSCH] services-Summaries **englisch** („Discover tailored solutions…", „treuhänder zürich kmu in Limmatfeld, Dietikon") — verstösst gegen DE-only.
- [FALSCH] Ortsbezug „Dietikon" (alte Adresse) — aktuell „Richtistrasse 7, 8304 Wallisellen" (JSON-LD).
- [FALSCH] trust „TREUHAND|SUISSE" ohne Beleg; [FEHLT] Inhaberin „Monika Baumann"; values 0 trotz echtem Leitbild (Vertraulichkeit/Objektivität/Fairness/Kompetenz).

### mrg-treuhand-ch — mittel
- [FALSCH] stats „3800+ KMU" (Scrape: 38+), „18+ Jahre" (Scrape: 15+).
- [FALSCH] trust „EXPERTsuisse" ohne Beleg (real: Swissdec + Swiss Accounting).
- [FEHLT] faq (echte FAQPage: „Was kostet ein Treuhänder", Swissdec, Firmengründung …), testimonials (5.0/5, 14 reviews).
- [MANGEL] address nur „Aadorf" (Heidelbergstrasse 9, 8355).

### mueller-schuhmacher-ch — hoch
- [FALSCH] address „Durchschnittliche" (kaputtes Wortfragment) — echt Bürglistrasse 29, 8401 Winterthur.
- [FALSCH] email `andrin.baumann@` — echt `info@`.
- [FALSCH] hours „Mo–So 09–17" erfunden.
- [FALSCH/FEHLT] Branche verfehlt: primär **Immobilien** (Verkauf/Bewirtschaftung/STWEG/Erstvermietung/Bauleitung/Erbschaften) → generische Treuhand-Services; CEO Dominic Schuhmacher nicht als Kopf.

### onetreuhand-ch — hoch
- [FALSCH] email `elcome@onetreuhand.ch` (führendes „w" weg) — echt `welcome@`.
- [FALSCH] testimonials „Sarah K./Thomas H./Alex S." + Hero-Aside-Zitat **erfunden** (Scrape: nur „4.8/5, 21 Bewertungen").
- [FEHLT] faq (mehrere echte FAQPage), about (Gründer Rodolfo Intaglietta, eidg. dipl. Experte).
- [MANGEL] address „Zürich-Glattbrugg" (Europa-Strasse 19, 8152); team 1 statt „10 Experten".

### rebex-ch — hoch
- [FALSCH] email `a.g.florian@` — echt `rebex@rebex.ch`; trust „klara"/„sage" ohne Beleg; values = Sektionsüberschriften.
- [FEHLT] team (6 Personen inkl. Dipl. Wirtschaftsprüfer/RAB), zweiter Standort (Dietikon + Zürich Baumackerstr. 24), history (1997 GmbH → 2000 AG).
- [MANGEL] address „Dietikon" (Zentralstrasse 19, 8953); Revision/Wirtschaftsprüfung als Kernleistung fehlt.

### sbt-treuhand-ch — hoch
- [FALSCH] email `a.bosshard@` — echt `info@sbt-treuhand.ch`; trust „abaweb" als Badge (nur Software).
- [FEHLT] team (Bosshard, Schneider, Ott, De Carlo), values („Unsere Werte und Leitgedanken"), hours (Mo–Do 8–17, Fr 8–16).
- [MANGEL] address „Zürich" (Lavaterstrasse 65, 8002); about NONE trotz „Über uns"-Sektion.

### sebona-treuhand-ch — hoch
- [FALSCH] services = Blog-Teaser; values = Teammitglieder (Fossa/Guarin); trust „abacus/banana/swissaccounting" (real: Bexio Platinum).
- [FEHLT] faq (umfangreiche echte FAQPage), pricing (ab CHF 160/Mt. etc. + Preisrechner), Leistungen Domizil/VR-Mandat/Gründung, 4 Standorte (Kloten/Zürich/Zug/Schwyz).
- [MANGEL] team 2 statt 4; stats „6+ Jahre" (Scrape „150 Firmen-/250 Privatkunden", „75 Jahre Erfahrung"); address nur „Kloten".

### spp-treuhand-ch — hoch
- [FALSCH] email `%20kontakt@spp-treuhand.ch` (URL-Müll); Firmenname verkürzt (echt „SPP Schlunegger Park & Partner Treuhand AG").
- [MANGEL] address nur „Zürich"; team 6 von 7+ (Campos/Poloni fehlen); bexio-Partner-USP verloren.

### steuerberater365-zuerich-ch — hoch
- [FALSCH] phone „043 259 40 50" — beworben ist „044 508 75 30"; Identität: Betreiber „Web Vermarktung GmbH, Metzerlen" (Lead-Portal), nicht Zürcher Treuhänder.
- [FEHLT] pricing („Steuererklärung ab CHF 49"), hours (Mo–Fr 08–18:30), about (echter Text trotz placeholder).
- [MANGEL] 6 generische Leistungen — Firma bietet faktisch nur Steuererklärung/-beratung.

### steuerberatung-schweiz-ch — hoch
- [FALSCH] phone „+41 58 345 30 30" — Impressum „061 508 72 04"; Identität: **Vermittlungsplattform** (Web Vermarktung GmbH, Reinach BL) als „Treuhänder in Zürich".
- [FALSCH] hero „… in Zürich" (real „Günstige Steuerberatung in der Schweiz").
- [FEHLT] about (echter Text), echtes Leistungsspektrum (Vermögen/Vorsorge/Recht/Versicherung) durch Generik ersetzt; address (Christoph Merian-Ring 23, 4153 Reinach BL).

### steuervogt-ch — mittel
- [MANGEL] address nur „Zürich" (Erismannstrasse 52, 8004); values = Leistungs-Menüpunkte; hero-aside = Seitentitel.
- [FEHLT] team/about — Inhaberin Laura Vogt (Treuhänderin eidg. FA), „Ich"-geführt.

### stg-revision-ch — mittel
- [FALSCH] stats „33+ Mitarbeitende" — Zahl von 2009 als aktuell.
- [FEHLT] 3 Standorte (Bern/Zürich/Baar), History („seit 1906" + Zeitleiste).
- [MANGEL] team 2 von 3 (Schläfli fehlt); about generisch trotz Echttext.

### stg-zuerich — hoch
- [FALSCH] about.paragraphs = **CMS-Boilerplate** („Dieses Element braucht es für die Definition der Reihenfolge der Filter-Elemente…").
- [MANGEL] about.lead abgeschnitten („**sind** die prägenden Gesichter…", Subjekt fehlt).
- [FEHLT] History (1906, ältestes Treuhandunternehmen CH), zweiter Standort (Zürich + Chur).
- [MANGEL] team 6 von ~9; „Trust & Gestion/Family Office" durch Generik ersetzt.

### stmtreuhand-ch — hoch
- [FALSCH] email (meta.real) `d.weber@` (persönlich) — echt `info@stmtreuhand.ch`.
- [FEHLT] faq (echte FAQPage), team (Peter Mettler u.a.).
- [MANGEL] address „Zürich" (Wiesenstrasse 17, 8034); hero generisch (echt „Ihr Experte für Steuerberatung, Buchhaltung und Wirtschaftsprüfung").

### sutertreuhand-ch — hoch
- [FALSCH] email `contact@` — JSON-LD: `info@sutertreuhand.ch`.
- [FEHLT] zweiter Standort (Luzern Seeburgstr. 39 + Zürich), Inhaberin Patricia Suter („ich"-Form), Leistung Firmengründung (ab CHF 450)/Domizil.
- [MANGEL] address „Luzern"; values = Leistungsnamen; MWST-Body = News-Spam „Trinkgelder…".

### taxalis-ch — hoch
- [FALSCH] email `andrea.vettiger@` — echt `info@taxalis.ch`.
- [FEHLT] Kernprofil **Immobilien + Erbrecht/Nachlass/Willensvollstreckung + Revision** → generisch; team 16+ Personen → 0; zweiter Standort (Winterthur + Wetzikon); History („seit über 20 Jahren"); FAQPage.
- [MANGEL] address „Winterthur" (Merkurstrasse 23, 8400).

### treuhaender-zuerich-com — mittel
- [MANGEL] address „Zürich" (Holbeinstrasse 31, 8008); zwei Service-Bodies mit Fremdtext; values = Slogans.
- (Team Reto Leemann / Marc Waldburger sind echt — kein Fabrikat.)

### treuhand-service-zh-ch — niedrig
- Keine wesentlichen Befunde — Scrape lieferte 0 Inhaltsseiten (nur Mail+Tel). Generisch zulässig; Kontakt korrekt.

### treuhand-zentrum-zuerich-ch — hoch
- [FALSCH] stats „250+ Mitarbeitende" (Zahl aus Asset-Hash!), „19+ Jahre" (Scrape/About: 17).
- [FALSCH] email `albana.jetishi@` — echt `info@tz-zuerich.ch`.
- [FEHLT] Testimonials (echter Reviews-Block), zweiter Standort (Zürich + Lachen), FAQ.
- [MANGEL] team mehrere → 1; address „Zürich" (Brandschenkestrasse 178, 8002); Startups/Firmengründung & Immobilien als Hauptbereiche fehlen.

### treuhand-zuerich-com — hoch
- [FALSCH] email `amir.hanna@` — echt `info@treuhand-zuerich.com`.
- [FEHLT] **Reisebüro-Treuhand-USP** (Gründer „28 Jahre in der Reisebranche", /reise-treuhand/), about-Text.
- [MANGEL] address „Zürich" (Brandschenkestrasse 178, 8002); hero generisch (echt „Exakt arbeiten – genau hinschauen").

### treuhandbuero24-ch — hoch
- [FALSCH] stats „123+ Jahre" (unmöglich), „950+ Unternehmen" (als `meta.real`).
- [FALSCH] hours „Mo–So 00:00–23:59" (24/7).
- [MANGEL] Name trägt „Zürich", Sitz ist Aargau; Geschäftsmodell (Offerten-/Vermittlungsportal) als normales Büro dargestellt. (Lorem-ipsum-Testimonials korrekt NICHT übernommen.)

### treuhandgraf-ch — hoch
- [FALSCH] email `info@haugag.ch` (Fremddomain) — echt `info@treuhandgraf.ch`.
- [MANGEL] team 3 — Inhaber **Manuel Graf/Direktor** fehlt (+ Atilgan, Abou Mjahed); address „Zürich" (Josefstrasse 92, 8005).
- [FEHLT] Leistungen Liegenschaftsverwaltung + Consulting/Rechtsberatung; history (1989 → 2002 AG).

### treuhandmitherz-ch — hoch
- [FALSCH] phone `+41\n52 551 50 00` (Zeilenumbruch im Feld).
- [FALSCH] Hauptstandort „Rafz" — Fokus ist **Winterthur** (Barbara-Reinhart-Str. 10, 8404) + Rafz.
- [FEHLT] Spezial-Angebote „Treuhand für Senioren/Spitex/Start-ups"; **Soziales Engagement „20 % des Gewinns gespendet"** (Markenmerkmal); team (Inhaber Marco Gartwyl).

### treuhandschmid-ch — mittel
- [MANGEL] address „Zürich" (Gubelstrasse 19, 8050; USP „Oerlikon" weg); hours (Mo–Fr 08–17:30) fehlen.
- [MANGEL] team 2 — Inhaberin **Catherine Schmid/GF** fehlt (+ Lernende Walker); hero.lede abgeschnitten/garbled.

### treuhandsiegrist-ch — mittel
- [FALSCH] Zeichenkorruption `�` in testimonials/about. (Testimonials selbst echt.)
- [MANGEL] email leer (`info@treuhandsiegrist.ch` vorhanden); address „Zürich" (Badenerstrasse 551, 8048).
- [FEHLT] history (1993, ehem. „MCS, Siegrist & Partner") — About sagt abweichend „seit 1995"; values = Service-Namen + Section-Überschrift.

### turicum-treuhand-ch — hoch
- [FALSCH] Identität — Site ist **ACCURATA Holding AG** mit 5 Töchtern; Turicum nur eine davon; Hero beschreibt die Holding.
- [FALSCH] email `adrian.meier@accurata.ch` (Fremddomain/persönlich); phone „…34 10" gehört zur „Aerzte Treuhand med AG" (Turicum: „…34 68").
- [FEHLT] team (Badertscher/VR-Präsident u.a.), about, echte Leistungen (Wirtschaftsprüfung/Revision/Due Diligence …).
- [MANGEL] address „Zürich" (Baumackerstrasse 24, 8050).

### urania-treuhand-ch — hoch
- [FALSCH] email `%20info@urania-treuhand.ch` (URL-Müll); phone „744 09 71" (= Berneck) dem Hauptort Uzwil zugeordnet (Uzwil: 929 30 00).
- [FEHLT] 3 Standorte (Uzwil/Niederwil/Berneck mit eigenen Strassen+Tel), History (1983 → … „42 Jahre").
- [MANGEL] team 2 statt 8; hero/footer abgeschnitten („…Verein oder").

### v-buchhaltung-ch — hoch
- [FEHLT] pricing („ab CHF 49", „Neukunden 10 %"), 5 Standorte (Bassersdorf/Dietlikon/Oerlikon/Wallisellen/Winterthur), address (Oberer Deutweg 16e, 8400 Winterthur).
- [FALSCH] services-Summary = Standort-SEO-Text; trust „klara" ohne Beleg (nur „Sage Schweiz"); Name „V-Buchhaltung" vs. Scrape „VBuchhaltung".

### wespipartner-ch — mittel
- [FALSCH] values „Huyen Nguyen" = Teammitglied; team „Kurt Tenger" taucht im Scrape nicht auf (prüfen/ggf. fabriziert); Buchhaltung-Summary = Payroll-Text (Mismatch).
- [FEHLT] history (seit 2013), address (Glatt Tower, Neue Winterthurerstr. 99, 8304 Wallisellen), konkrete Download-Titel (Steuercheckliste 2025, Kennzahlen 2026).

### wuerth-treuhand-ch — hoch
- [FALSCH] team: „Zugelassene Revisorin"/„Freier Mitarbeiter" als Namen (Funktion statt Name); **Inhaber Urs Ritschard** (Dipl. Steuerexperte, seit 1990, VR-Präsident) fehlt.
- [FEHLT] history („über 40 Jahre", seit 1990); trust „abaninja/abaweb/bexio" ohne Beleg.
- [MANGEL] address nur „Zürich" (Norastrasse 7, 8004); Vorsorgeberatung fehlt.

### zhtreuhand-ch — hoch
- [FALSCH] email `%20info@zhtreuhand.ch` (URL-Müll); address „Warth" ohne Strasse, zweiter Standort Dübendorf fehlt (Warth Uesslingerstr. 1, 8532 + Überlandstr. 1, 8600).
- [FEHLT] team (Simon & Benjamin Mösch), audience-Trennung **KMU vs. Ärzte/Arztpraxen** (zentraler USP).
- [MANGEL] services generisch (Revision/M&A/Firmengründung/Vorsorge fehlen); trust „klara" ohne Beleg.

### zurichtaxtreuhand-ch — hoch
- [FALSCH] values „Fatih Özonar" = Inhaber; email `fo@` (persönlich) — echt `info@`; phone/address: Büro Regensdorf (Althardstr. 146, 8105) → nur „Zürich".
- [FEHLT] pricing („ab CHF 60"), hours (Mo–Fr 10–18), audience/standorte (2 Regionen ZH/AG), team (Lorenz + Fatih).

---

## Empfohlene Reihenfolge der Fixes (höchster Hebel zuerst)

1. **Fabrikat-Stopp** (A4/A5/A14): keine Stats/Testimonials/Badges ohne harten Scrape-Beleg; Jahreszahlen,
   Asset-Hash-Zahlen, Gründungsjahre NIE als Kunden-/Mitarbeiterzahl. → betrifft das Projekt-Versprechen direkt.
2. **E-Mail-Pipeline** (A2): `info@eigene-domain` bevorzugen, `%20`/Whitespace/abgeschnittene Local-Parts
   filtern, Fremddomains verwerfen.
3. **Adresse + Standorte** (A1/A8): volle `PostalAddress` aus JSON-LD; mehrere Standorte zulassen, Hauptsitz
   korrekt wählen.
4. **Team-Extraktion** (A3): namentliche Personen (inkl. Inhaber/Namensgeber) zuverlässig übernehmen.
5. **values-/Quelle-Reinheit** (A6/A10/A17): keine Teamnamen/Navi-Labels/Section-Headings/CMS-Boilerplate/
   EN-Texte als Werte/Service-Texte.
6. **Echte FAQ/Preise/History/Hours** (A7/A11/A12/A13) statt Scaffold, wenn die Quelle sie hat.
7. **Identitäts-Check** (A15): Vermittlungsplattformen / Holdings / falscher Kanton erkennen.
