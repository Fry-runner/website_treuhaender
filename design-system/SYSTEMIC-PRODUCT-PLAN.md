# Umbauplan: vom Treuhand-Generator zum systemischen Produkt

> Stand: 2026-06-23 · Status: **nur Plan, nichts umgesetzt**
> Ziel: Operator wählt nur **Branche + Standort** → Discovery, Scrape, Stock-Footage,
> Studio-Overlay, Publishing und Versand laufen automatisch und pro neuer Charge angepasst.

---

## 1. Ausgangslage

Der gesamte Maschinenraum existiert bereits — er ist nur fest auf **„Treuhänder / Zürich / diese 50 Firmen“** verdrahtet. Es fehlt **eine** echte neue Fähigkeit (automatische Discovery), und es braucht **zwei Abstraktionen**, die alles Hartcodierte aufsaugen. Der Rest ist Parametrisieren, kein Neubau.

### Was schon branchenneutral ist (bleibt unangetastet)
Layout/Sektionen, Look-Ableitung (`looks/deriveLook.ts`), Varianten-Registry (`variants/registry.ts`), Bild-Qualitätsscoring (`content/imageQuality.ts`), Dedup (`content/uniqueImages.ts`), Single-Firm-Build (`vite.prototype.config.ts`), Studio-Mechanik (Swaps, Re-Roll), Scrape-Crawler-Logik (`scraper/deep_scrape.py` BFS), strukturelle Verifikation (`scraper/verify_candidates.py`).

### Was heute fest verdrahtet ist

| Stufe | Hartcodiert | Datei:Zeile |
|---|---|---|
| Discovery | **Existiert nicht** – 64 Firmen als Hand-Tupelliste | `scraper/candidates_raw.py` |
| Scrape | `Accept-Language: de-CH`; Telefon-Regex nur `+41/0041/0` | `scraper/deep_scrape.py:29`, `:49`; `scraper/verify_candidates.py:10` |
| Generierung | `SERVICE_CANON`/`SERVICE_DETAIL`, Sprach-Gates (DE/FR/EN_MARK), City-Fallback „Zürich“, `roleBio()` | `content/extract.ts:93`, `:38–66`, `:80–90`, `:464` |
| Generierung | Zertifikate, FAQ, „warum wir“, Software, Sprachen | `content/ch.ts` (gesamt) |
| Generierung | Prozess-/Audience-/Feature-Defaults, About | `content/sectionDefaults.ts` |
| Generierung | Sektions-Überschriften-Pools, CTA-Headings | `content/sectionHeads.ts:26–54` |
| Generierung | Archetypen, kanonische Home-Reihenfolge, Home-Budget=8 | `blueprints.ts:26–83`, `ia-rules.ts:15,24` |
| Stock | 19 Topics mit Suchbegriffen („Zurich…“, „tax documents…“) | `content/stock_fetch.ts`; `compose/pitchStock.ts:31` |
| Stock | Fallback-Topic-Liste hartcodiert | `content/extract.ts:1243` |
| Studio | Glob `./content/examples/*.json` (flach, eine Charge) | `playground.tsx:36–45` |
| Publishing | **ein** Vercel-Projekt `treuhand-prototypes`; Alias `treuhand-<slug>` | `scripts/publish.mjs:51`, `:232`; Scrape-Guard `:246` |
| Versand | Absender „Oliver Gläser, ETH“ + Pitch-Text hart im Code | `compose/outreach.ts:139–152` |
| Versand | Test-Empfänger, SMTP-Provider hart | `compose/SendOverlay.tsx:38,73`; `scripts/send-mail.mjs:84` |

---

## 2. Die zwei tragenden Abstraktionen

### A) Branchen-Pack — `industries/<branche>.json`
Ein **Wissensgerüst**, KEIN fertiges Prosa-Wörterbuch. Saugt die Konstanten aus `ch.ts`, `extract.ts`, `sectionDefaults.ts`, `sectionHeads.ts`, `blueprints.ts`, `ia-rules.ts` auf:

```jsonc
{
  "id": "treuhand-ch",
  "serviceTaxonomy": [                 // key-Wörter zum ERKENNEN im Scrape
    { "key": ["buchhalt","rechnungswesen"], "title": "Buchhaltung" },
    { "key": ["steuer"], "title": "Steuerberatung" }
    // ... statt SERVICE_CANON
  ],
  "sectionStructure": {               // statt blueprints.ts / ia-rules.ts
    "canonicalHomepage": ["services","values","audience","testimonials","stats","process","team","pricing","partners","faq"],
    "homeBudget": 8,
    "dropOrder": ["stats","process","audience","testimonials","gallery","partners","faq"],
    "archetypes": ["swiss-digital","boutique","intl-conversion"]
  },
  "locale": {                         // statt hardcodierter CH-Annahmen
    "language": "de",
    "languages": ["de","en","fr","it"],
    "phoneRegex": "(?:\\+41|0041|0)\\s?...",
    "postalRange": [1000, 9999],
    "defaultCity": "Zürich",
    "langMarkers": { "de": "...", "fr": "...", "en": "..." }  // statt DE/FR/EN_MARK
  },
  "stockTopics": {                    // statt pitchStock.ts STOCK_TOPICS + stock_fetch.ts queries
    "hero":  { "city": ["Zurich skyline aerial", "..."], "office": ["..."] },
    "scene": { "...": ["..."] }
  },
  "llmGuardrails": "Branche=Schweizer Treuhänder. Erlaubt: ... Verboten: erfundene Mandantenzahlen, Zertifikate, Preise ..."
}
```

`ch.ts` von heute = exakt der erste Pack `treuhand-ch.json`. Nichts wird wertlos, nur umgezogen.

### B) Kampagnen-Kontext — `campaigns/<branche>-<ort>/campaign.json`
Die **Identität einer Charge**. Macht aus Single-Tenant ein Mehrkampagnen-System:

```jsonc
{
  "industry": "treuhand-ch",          // → lädt industries/treuhand-ch.json
  "location": "Zürich",
  "country": "CH",
  "sender": {
    "name": "Oliver Gläser",
    "mail": "oliver@fam-glaeser.de",
    "phone": "+41 78 447 51 75",
    "pitchTemplate": "Guten Tag, mein Name ist {sender.name} ..."
  },
  "deploy": { "vercelProject": "treuhand-prototypes", "aliasPrefix": "treuhand" },
  "smtp":   { "host": "smtp.office365.com", "from": "...", "replyTo": "...", "testRecipient": "..." }
}
```

---

## 3. Verzeichnis-/Datenmodell

Heute liegt alles flach. Ziel — alles pro Kampagne gebündelt:

```
campaigns/
  treuhand-zuerich/
    campaign.json
    candidates.json            # aus Discovery
    scraper-output/<slug>/site.json
    content/<slug>.json        # ehem. design-system/content/examples/*
    stock/<topic>/*.jpg        # branchen-spezifisch gefetcht
    published.json             # PRO Kampagne, nicht global
  marketing-bern/
    ...
industries/
  treuhand-ch.json
  marketing-de.json
  ...
```

Konkret: die Pfade in `content/extract.ts:25` (`scraper/output/...`), `playground.tsx:36` (Glob), `scripts/publish.mjs:266` (`published.json`) bekommen ein `campaignDir`-Präfix.

---

## 4. Ziel-Pipeline

```
   Branche + Standort           ← einziger manueller Input
            │
            ▼
   Kampagnen-Kontext  ───────────────┐  (treibt JEDE Stufe)
   (Branchen-Pack + Identität)       │
            │                        │
   ┌────────┴─────────┐              │
   ▼                                 │
 1 Discovery     LLM schlägt Firmen+Domains vor → HTTP-Verify  [NEU]
   ▼                                 │
 2 Scrape        deep_scrape.py, locale-parametrisiert         [✎]
   ▼                                 │
 3 Generierung   extract.ts + Branchen-Pack + LLM-Veredelung   [✎/NEU]
   ▼                                 │
 4 Stock         Topics aus Pack → Pexels-Fetch                [✎]
   ▼                                 │
 5 Studio        Vorschau · Swaps · Re-Roll                    [✓ fast fertig]
   ▼                                 │
 6 Publishing    Vercel-Projekt pro Kampagne                   [✎]
   ▼                                 │
 7 Versand       Absender + SMTP pro Kampagne                  [✎]
```

Legende: **NEU** = neu bauen · **✎** = Vorhandenes parametrisieren · **✓** = bleibt.

---

## 5. Umbau pro Stufe

### Stufe 1 — Discovery (Entscheidung: **LLM-generiert**)
Ersetzt die Handliste in `scraper/candidates_raw.py`:

```
(industry, location)
  → LLM-Prompt: "Nenne reale <Branche>-Firmen in <Ort> mit Domain"
  → Roh-Kandidaten {name, domain-Vermutung}
  → verify_candidates.py (existiert, rein strukturell):
       HTTP-200? Titel? ≥4 Unterseiten? >800 Zeichen Text?
       + Dedup nach Domain + Portal/Aggregator-Filter
  → Loop: nachgenerieren bis ~50 VERIFIZIERTE übrig
  → candidates.json   (identisches Schema → deep_scrape.py unverändert)
```

**Wichtig:** Der LLM-Schritt ist nur ein Vorschlagsgenerator — die Wahrheit entsteht durch die HTTP-Verifikation. Halluzinierte/dünne Domains fallen raus.

### Stufe 2 — Scrape
`deep_scrape.py` / `verify_candidates.py`: `Accept-Language` und Telefon-Regex (`:49`) aus `campaign.json`/Pack ziehen. Sonst branchenneutral.

### Stufe 3 — Generierung (Entscheidung: **scrape-first, LLM nur als Lückenfüller**)
Deckt sich mit der Projekt-Philosophie („Scrape DRIVES“, „kein Filler, entdoppeln“).
Neuer **LLM-Veredelungs-Layer** (erweitert `enrichment.ts`); `extract.ts` ruft ihn pro Service/Sektion mit `(scrapedText, pack.guardrails)` statt aus festem `SERVICE_DETAIL` zu lesen:

| Priorität | Quelle | Aktion |
|---|---|---|
| 1 | Scrape hat echten Text | übernehmen, nur entdoppeln/glätten (LLM-Politur) |
| 2 | Scrape dünn/generisch | scraped Text als Vorlage → LLM verbessert |
| 3 | Scrape leer | LLM **generiert** unter `llmGuardrails` (branchenwahr, keine Fakten erfinden) |

Zusätzlich aus Pack lesen statt hartcodiert: `SERVICE_CANON`, `DE/FR/EN_MARK`, City-Fallback, `roleBio()`, `*_VARIANTS`-Defaults, `SECTION_POOLS`, `CTA_HEADINGS`, Archetypen, Home-Budget.

### Stufe 4 — Stock
`stock_fetch.ts` liest Topics+Suchbegriffe aus `pack.stockTopics` statt der 19 hartcodierten. Pro Kampagne einmal fetchen → `campaigns/<x>/stock/`. `pitchStock.ts`/`SiteRouter.tsx` bekommen den Topic-Satz durchgereicht. Picking/Dedup/Quality bleiben.

### Stufe 5 — Studio
`playground.tsx`: **Kampagnen-Wähler** vor dem Firmen-Wähler; Glob auf `campaigns/<aktiv>/content/*.json`. Overlays sind sonst fertig.

### Stufe 6 — Publishing
`publish.mjs`: `PROJECT`, `aliasHostFor()`, Scrape-Guard-Pfad, `published.json`-Pfad aus `campaign.json`. Pro Branche eigenes Vercel-Projekt (saubere Domains, getrennte Statistik).

### Stufe 7 — Versand
`outreach.ts`: Absenderblock + Pitch-Text werden Template mit Platzhaltern aus `campaign.json`. `send-mail.mjs`/`SendOverlay.tsx`: SMTP/Reply-To/Test-Empfänger aus dem Kontext.

---

## 6. Phasenplan (Treuhand bleibt nach JEDER Phase lauffähig)

1. **Branchen-Pack abspalten** — `ch.ts`/`extract.ts`-Konstanten → `industries/treuhand-ch.json` (nur Taxonomie + Leitplanken + Locale + Stock-Topics). `extract.ts` liest den Pack. *Anker: Treuhand kommt identisch raus.*
2. **LLM-Veredelungs-Layer** — scrape-first → verbessern → generieren, mit Wahrheits-Guardrails. Ersetzt `SERVICE_DETAIL` & `*_VARIANTS`-Defaults.
3. **Kampagnen-Kontext + Verzeichnis** — `campaigns/<branche>-<ort>/…`; bestehende 50 nach `campaigns/treuhand-zuerich/` migrieren. Pfade in `extract.ts`, `playground.tsx`, `publish.mjs` präfixieren.
4. **LLM-Discovery** — Generator + `verify_candidates.py`-Loop → `candidates.json`. Ab hier läuft „Branche+Ort → 50 Kandidaten“ end-to-end.
5. **Stock / Publishing / Versand parametrisieren** — Topics aus Pack; Vercel-Projekt + Absender + SMTP aus `campaign.json`.
6. **Studio: Kampagnen-Wähler** vor dem Firmen-Wähler; Glob auf aktive Kampagne.
7. **Zweite Branche** (z. B. Marketing-Agenturen Bern) als Härtetest → härtet alle Annahmen.

Reihenfolge so gewählt, dass die teuren/riskanten LLM-Teile (2, 4) erst kommen, wenn das Gerüst steht.

---

## 7. Offene Punkte / Risiken

- **LLM-Discovery-Qualität**: Halluzinierte Domains müssen zuverlässig durch die HTTP-Verifikation fallen; ggf. Web-Suche als Cross-Check ergänzen, falls Trefferquote zu niedrig.
- **Wahrheits-Guardrails**: generierter Text darf keine Fakten erfinden (Mandantenzahlen, Zertifikate, Preise) — entspricht der bestehenden Projekt-Regel „social-proof only with real data“.
- **Recht/Impressum**: pro Land/Branche unterschiedliche Compliance-Boilerplate (DSG/DSGVO/…); gehört in `pack.locale` bzw. `campaign.json`.
- **Vercel/Domains**: pro Kampagne eigenes Projekt → eigener `VERCEL_TOKEN`/Team-Scope klären.
- **SMTP-Block (M365 Basic-Auth 535)**: bleibt bestehen; Outlook-COM-Pfad und App-Passwort-Fallback pro Kampagne abbilden.
- **`content/examples` ist flüchtig** (wird extern auf HEAD zurückgesetzt): Migration nach `campaigns/.../content/` committen.
