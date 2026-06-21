# Outreach-Pipeline — Architektur

> Vom Generator zur Outreach-Maschine: 50 Treuhänder-Leads → je ein generierter
> Website-Prototyp → Review/Freigabe → Veröffentlichung auf Vercel → (optional)
> E-Mail an die Kontaktadresse der Originalseite mit Link zum Prototyp.

**Status dieses Dokuments:** Architektur/Plan. Die Next-App (§3.7/§8) ist weiterhin
offen; **Durchwinken + Veröffentlichen + E-Mail-Entwurf laufen bereits**, aber als
pragmatische Stufe 1 direkt im **Vite-Variant-Studio** statt im Next-Cockpit
(siehe „§12 — Implementiert (Stufe 1)"). Entscheidungen bisher:
- **Hosting:** **ein** Multi-Tenant-Vercel-Projekt bedient alle Prototypen unter
  `/p/<slug>` (nicht 50 Einzelprojekte). Stufe 1 deployt das gebaute Vite-`dist/`
  per Vercel-REST-API; der Renderer-Split auf Next bleibt der spätere Schritt.
- **E-Mail:** **Variante 1 umgesetzt** — System erzeugt den Entwurf, Versand aus
  dem eigenen Postfach (Vor-/Nachteile + Auto-Send-Option §7).
- **Reihenfolge:** dieses Doc, dann Stufe-1-Studio-Overlay, dann (offen) Next-Cockpit.

---

## 1. Ziel

Pro Client-Lead einen **produktionsfertigen Website-Prototyp** präsentieren. Der
Mensch (Reviewer) entscheidet je Lead:

1. **Durchwinken** → veröffentlichen + (später) Mail an Kontaktadresse.
2. **Neu generieren** → frische Variante (neuer Seed oder Re-Extract).
3. **Mit Prompt bearbeiten** → natürlichsprachliche Anpassung (Texte/Look).

---

## 2. End-to-End-Fluss

```
scraper/output/<slug>/site.json        (vorhanden, 50 Leads)
        │  extract.ts (vorhanden)
        ▼
design-system/content/examples/<slug>.json   = SiteContent + MediaLibrary (vorhanden, 50)
        │
        ▼
┌─────────────────────────  web/ (Next.js, ein Vercel-Deploy)  ─────────────────────────┐
│                                                                                        │
│  /cockpit            (Admin, auth)        │  /p/<slug>        (öffentlicher Prototyp)   │
│  ─ Grid aller Leads                       │  ─ <SiteRouter content plan/>              │
│  ─ Vorschau + Status-Chip                 │  ─ SSG/ISR, OG-Bild                        │
│  ─ Aktionen: ✅ 🔄 ✏️                       │                                            │
│        │ Server Actions / Route Handlers                                               │
│        ▼                                                                                │
│  Lead-Store (Vercel KV / Postgres)  ◀─ Status, freigegebener Plan, Edit-Overrides      │
│        │ approve                                                                        │
│        ├─ revalidatePath('/p/<slug>')   → Prototyp wird live (kein Full-Build)         │
│        └─ E-Mail (PENDING §7): Entwurf  oder  Resend-Auto-Send                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
   geteilter Renderer  (heute: design-system/compose + structures + tokens)
```

Der bestehende **Vite-Playground** (`design-system/playground.tsx`, „Variant Studio")
bleibt als Design-Sandbox erhalten. Die Produktions-Oberfläche ist das `/cockpit`
der Next-App; beide nutzen denselben Renderer.

---

## 3. Komponenten & Verträge

### 3.1 Scrape — *vorhanden*
`scraper/output/<slug>/site.json` (+ `raw_html/`, `assets/`). Enthält u.a.
`contact.emails`, `contact.phones`, `assets.manifest`, `pages[]`.

### 3.2 `extract.ts` — *vorhanden*
`scraper/output/<slug>` → `design-system/content/examples/<slug>.json`
(Typ `SiteContent`, inkl. `media: MediaLibrary` mit Logo/Badges/Fotos im
`public/images/<slug>/pool/`). **Wichtig:** liefert auch die echte Kontakt-Mail
(`contact.info.email`) — das ist der spätere E-Mail-Empfänger.

### 3.3 Batch-Extract — *vorhanden*
Alle 50 JSONs liegen bereits unter `design-system/content/examples/`. Ein
`extract-all`-Skript (Schleife über `scraper/output/*`) macht das reproduzierbar.

### 3.4 Variant-Plan / Kits — *vorhanden*
`design-system/variants/select.ts` `planSite(content, {seed, lookId, kitId})` →
`SitePlan {lookId, heroId, primaryStyle, kitId, sections}`. `variants/kits.ts`,
`registry.ts` liefern die Auswahlmengen. **Ein freigegebener Lead = SiteContent +
genau ein eingefrorener `SitePlan`.**

### 3.5 Lead-Store — *neu*
Laufzeit-Datenspeicher (kein Repo-Commit pro Freigabe nötig). Empfehlung **Vercel KV**
(klein, schnell) oder **Vercel Postgres** (wenn relationale Auswertung gewünscht).
Hält pro Lead: Status, eingefrorenen Plan, Edit-Overrides, Prototyp-URL,
Mail-Status, Timestamps. Schema → §4.

### 3.6 Renderer (geteilt) — *Refactor*
Heute in `design-system/` (Vite). Ziel: als Workspace-Package
`packages/renderer` (npm/pnpm workspaces), importiert von **beiden** —
Vite-Playground und Next-App. Übergangslösung ohne Monorepo: Next importiert via
`tsconfig` path-alias direkt aus `design-system/{compose,structures,tokens,...}`.
Der Renderer ist framework-agnostisches React + CSS-Variablen; `SiteRouter`
nutzt `useState`/IntersectionObserver → in Next eine **Client Component**
(`"use client"`), Daten kommen vom Server-Wrapper.

### 3.7 `web/` Next-App (Multi-Tenant) — *neu*
- `app/p/[slug]/page.tsx` → lädt SiteContent + freigegebenen Plan (Store) →
  `<SiteRouter content plan/>`. `generateStaticParams()` = alle **freigegebenen**
  Slugs → SSG; neue Freigaben via **ISR / on-demand `revalidatePath`**.
- `app/p/[slug]/opengraph-image.tsx` → automatisches OG-Vorschaubild (`@vercel/og`)
  fürs Mail-/Link-Embedding.
- Ein einziges Deployment bedient alle Leads. URLs: `https://<domain>/p/<slug>`
  (Wildcard-Subdomains `slug.<domain>` optional später).

### 3.8 Lead-Cockpit (Admin) — *neu*
`app/cockpit` (auth-geschützt). Grid aller Leads mit Vorschau (iframe auf
`/p/<slug>?preview=1` oder inline-Renderer) + Status-Chip. Pro Lead die drei
Aktionen als **Server Actions**:
- **approve** → Status `approved`, `revalidatePath`, Mail-Trigger (§7).
- **regenerate** → neuer `seed` (sofort) oder Re-Extract (frische Inhalte/Bilder).
- **edit(prompt)** → §3.9.
Der Per-Lead-Editor kann die Studio-Controls (Palette/Hero/Button/Kit/Sektionen)
aus dem Playground wiederverwenden (geteilter Renderer).

### 3.9 Prompt-Edit (Claude API) — *neu*
Server-Route nimmt `{slug, prompt}`, lädt SiteContent, ruft Anthropic-API:
- **Look-Prompt** („wärmer, blaue Palette, kürzere Hero") → Patch auf den `SitePlan`
  (deterministisches Mapping wo möglich, LLM wo nötig).
- **Content-Prompt** → LLM liefert gepatchtes `SiteContent` (Texte) zurück, validiert
  gegen das Schema, als `overrides` im Store gespeichert (Original bleibt unangetastet).

### 3.10 Publish/Deploy (Vercel) — *neu*
Da Lead-Status/Overrides im **Store** liegen (nicht im Repo), ist „veröffentlichen"
= `status=approved` + `revalidatePath('/p/<slug>')`. Kein Full-Rebuild, keine 50
Projekte. Domain-/SSL-Verwaltung zentral über das eine Vercel-Projekt.

### 3.11 E-Mail — *PENDING, siehe §7*
Empfänger = `content.contact.info.email` (aus Scrape). Inhalt = kurze DE-Mail +
Prototyp-Link + OG-Bild. Implementierung erst nach Entscheidung Variante 1/2.

---

## 4. Datenmodell

```ts
type LeadStatus =
  | "new"          // extrahiert, noch nicht angesehen
  | "in_review"    // im Cockpit geöffnet
  | "editing"      // Prompt-Edit / Variantenwahl läuft
  | "approved"     // durchgewunken → live
  | "published"    // /p/<slug> live + (optional) Mail raus
  | "rejected";    // verworfen

interface LeadRecord {
  slug: string;
  firm: string;
  domain: string;
  contactEmail?: string;        // aus Scrape; Empfänger
  status: LeadStatus;
  plan: SitePlan;               // eingefrorener Variant-Plan
  overrides?: Partial<SiteContent>; // Ergebnis von Prompt-Edits
  seed: number;
  prototypeUrl?: string;        // https://<domain>/p/<slug>
  email?: {
    mode: "draft" | "auto";
    status: "none" | "drafted" | "sent" | "bounced" | "failed";
    sentAt?: string;
    messageId?: string;
  };
  history: { at: string; action: string; by?: string; note?: string }[];
  updatedAt: string;
}
```

Base-`SiteContent` bleibt die committete `examples/<slug>.json`; **Overrides** und
Status liegen ausschließlich im Store → reproduzierbar und ohne Repo-Schreibzugriff
zur Laufzeit.

---

## 5. Status-State-Machine

```
new ──open──▶ in_review ──edit──▶ editing ──┐
  ▲                │                         │
  │            regenerate                    │ (zurück zu in_review nach Apply)
  │                ▼                         │
  └──────────  in_review ◀──────────────────┘
                   │ approve
                   ▼
               approved ──revalidate──▶ published ──(mail)──▶ published(sent)
                   │ reject
                   ▼
               rejected
```

---

## 6. Publish-Flow (Detail)

1. Reviewer klickt **Durchwinken**.
2. Server Action: `store.update(slug, {status:"approved", plan, prototypeUrl})`.
3. `revalidatePath('/p/'+slug)` → Next baut die Seite on-demand neu (ISR).
4. `prototypeUrl` ist sofort öffentlich erreichbar.
5. E-Mail-Schritt (§7) — je nach gewählter Variante Entwurf oder Auto-Send.
6. `status:"published"`, History-Eintrag.

Unpublish = `status` zurücksetzen + `revalidatePath` (Seite liefert 404/Platzhalter).

---

## 7. E-Mail — Variante 1 vs. 2 (Vor-/Nachteile)

> ⚠️ Querschnittsrisiko beider Varianten: **Kalt-Mail an gescrapte Adressen** ist in
> CH/EU sensibel — **UWG Art. 3 lit. o** (unaufgeforderte Massenwerbung, CH) sowie
> **DSG/DSGVO**. Pflicht in jedem Fall: klare Absenderidentität, sachlicher Bezug,
> einfache Abmeldung, kein „Massen"-Charakter.

### Variante 1 — „Entwurf erzeugen, du sendest selbst"  *(empfohlen zum Start)*
**Ablauf:** Approve → System erzeugt fertige Mail (Empfänger, Betreff, Body mit
Prototyp-Link + OG-Bild) als **Entwurf**: als `.eml`/Vorschau im Cockpit, „In Mail-App
öffnen" (`mailto:`/Copy) oder als Gmail-/Outlook-**Draft** via deren API. Du prüfst,
personalisierst und sendest aus **deinem eigenen Postfach**.

**Vorteile**
- **Rechtlich am sichersten:** finale menschliche Kontrolle, 1:1-Charakter statt
  automatischem Massenversand; du kannst pro Fall abbrechen/anpassen.
- **Zustellbarkeit:** echte Mails aus echtem Postfach landen seltener im Spam.
- **Reputation:** deine Hauptdomain bleibt unberührt; **kein** separates Sending-Setup
  (Resend, DKIM, Warm-up) nötig.
- **Kein Zusatzdienst/keine Kosten** zum Start.

**Nachteile**
- **Nicht skalierbar/automatisch:** bei vielen Leads manuelles Senden.
- **Kein zentrales Tracking** (Öffnungen/Klicks/Bounces) out-of-the-box.
- **Status-Rückmeldung** „gesendet" muss manuell erfolgen (außer Gmail-Draft+Send-API).

### Variante 2 — „Auto-Send via Resend"
**Ablauf:** Approve → Server-Action ruft Resend mit **verifizierter Absende-Domain**
(SPF/DKIM/DMARC) → Mail geht automatisch an die Scrape-Adresse inkl. Opt-out; Webhooks
für Delivery/Bounce/Open.

**Vorteile**
- **Voll automatisch & skalierbar:** ein Klick „Durchwinken" erledigt alles.
- **Zentrales Logging/Tracking** (Delivery, Bounce, Open/Click) → Status automatisch.
- **Konsistente Templates**, steuerbares Reply-To, OG-Bild eingebettet.

**Nachteile**
- **Rechtlich heikelste Variante:** automatischer Kaltversand an gescrapte B2B-Adressen
  erhöht das Abmahn-/Bußgeldrisiko (UWG/DSGVO) deutlich.
- **Reputationsrisiko:** neue Sending-Domain ohne Warm-up + Spam-Beschwerden →
  Blacklisting; **separate (Sub-)Domain** statt Hauptdomain zwingend.
- **Setup-Aufwand:** Domain verifizieren, DKIM/SPF/DMARC, Warm-up, Suppression-/
  Opt-out-Liste, Bounce-Handling.
- **Kosten** ab Volumen.

### Empfehlung
**Mit Variante 1 starten.** Architektur so bauen, dass das System **immer** den Entwurf
erzeugt; ein Feature-Flag `EMAIL_MODE=auto` schaltet später auf Resend, **wenn** sauberes
Sending-Setup + rechtliche Absicherung stehen. So bleibt der Wechsel ein Schalter, keine
Umbaute.

---

## 8. Repo-Layout (Ziel)

```
/ (Monorepo, npm/pnpm workspaces)
├─ packages/renderer/        # geteilt: SiteRouter, structures, tokens, variants
│                            # (heutiges design-system/{compose,structures,...})
├─ design-system/            # bleibt: Vite-Playground/Sandbox (importiert renderer)
├─ web/                      # NEU: Next.js-App auf Vercel
│  ├─ app/p/[slug]/page.tsx
│  ├─ app/p/[slug]/opengraph-image.tsx
│  ├─ app/cockpit/…          # Admin-Review (auth)
│  ├─ app/api/…              # regenerate / edit / approve / mail
│  └─ lib/{store,plan,email}.ts
├─ scraper/                  # bleibt
└─ docs/outreach-pipeline.md # dieses Dokument
```

Übergangsweise (vor dem Package-Split) importiert `web/` per path-alias direkt aus
`design-system/`.

---

## 9. Secrets / Env (web/)

| Var | Zweck | Ab Phase |
|-----|-------|----------|
| `ANTHROPIC_API_KEY` | Prompt-Edit | 4 |
| `KV_*` / `POSTGRES_*` | Lead-Store | 2 |
| `VERCEL_*` (optional) | falls Deploy-Hook statt ISR | 3 |
| `RESEND_API_KEY` | nur Variante 2 | später |
| `EMAIL_MODE` | `draft` (default) \| `auto` | später |
| `COCKPIT_AUTH_*` | Admin-Schutz | 2 |

---

## 10. Phasenplan

1. **Renderer entkoppeln** — `packages/renderer` (oder path-alias) so, dass Next ihn nutzen kann.
2. **Next-App-Gerüst + `/p/[slug]`** — eine Lead-Seite live (statisch, ein Slug), OG-Bild.
3. **Lead-Store + Cockpit-Grid** — Status-Modell, alle 50 als Karten, Vorschau, Status-Chips.
4. **Aktionen** — regenerate (Seed/Re-Extract), approve (+revalidate), edit(prompt) via Claude-API.
5. **Publish** — approve → live unter `/p/<slug>`; Unpublish.
6. **E-Mail Variante 1** — Entwurf erzeugen (Empfänger/Body/Link/OG), Cockpit-Vorschau.
7. **(optional) E-Mail Variante 2** — Resend-Auto-Send hinter `EMAIL_MODE=auto`.

---

## 11. Offene Entscheidungen

- **Store:** Vercel KV (einfacher) vs. Postgres (auswertbar)?
- **Domain:** unter welcher Domain laufen die Prototypen (`/p/<slug>` vs. `slug.<domain>`)?
- **Auth fürs Cockpit:** einfacher Passwortschutz vs. richtige Auth (z.B. Auth.js)?
- **Renderer-Split:** echtes Workspace-Package jetzt oder erst später (path-alias-Übergang)?
- **E-Mail:** Start mit Variante 1 bestätigt? Auto-Send (V2) überhaupt gewünscht?
```

---

## 12. Implementiert (Stufe 1 — Studio-Overlay)

Statt der vollen Next-App ist der Durchwinken→Veröffentlichen→E-Mail-Fluss zuerst
direkt ins bestehende **Vite-Variant-Studio** gebaut (sofort nutzbar, geteilter
Renderer). Die Next-Migration (§3.7/§8/§10) bleibt der spätere Schritt.

**Bedienung:** Im Studio eine Firma + Variante einstellen (Kaltakquise i.d.R. AN) →
Knopf **„✅ Durchwinken & Versenden"** → Overlay:
1. *Plan einfrieren* — zeigt die exakten Variant-Entscheidungen.
2. *Auf Vercel veröffentlichen* — ein Klick baut + deployt auf das **eine**
   Vercel-Projekt; der Prototyp ist live unter `/p/<slug>`.
3. *E-Mail formulieren* — DE-Entwurf (Variante 1) mit Live-Link, Empfänger aus dem
   Scrape (editierbar); **„Über ETH-Postfach senden"** (direkter SMTP-Versand) plus
   manuelle Optionen „In Mail-App öffnen" (`mailto:`), „Text kopieren", „.eml".

**Bausteine:**
| Datei | Rolle |
|-------|-------|
| `design-system/compose/outreach.ts` | Typen (`PublishedRecord`/`Plan`), E-Mail-Builder, `mailto:`/`.eml` |
| `design-system/compose/ApproveOverlay.tsx` | das 3-Schritte-Overlay |
| `design-system/playground.tsx` | „Durchwinken"-Knopf + öffentliche Route `/p/<slug>` |
| `design-system/public/published.json` | Manifest `slug → Record` (eingefrorener Plan); von der Route gelesen |
| `design-system/scripts/publish.mjs` | Manifest mergen → `vite build` → Vercel-REST-Deploy |
| `design-system/scripts/send-mail.mjs` | Versand über ETH-Postfach (authentifiziertes SMTP, Nodemailer) |
| `design-system/vite.config.ts` | Dev-Endpoints `POST /__deploy` + `POST /__send` |
| `design-system/vercel.json` | SPA-Rewrite `/p/:slug` → `index.html`, `noindex`-Header |

**Deploy (ein Projekt, REST-API, kein CLI nötig):** `scripts/publish.mjs` lädt
`dist/` mit Datei-Digests hoch (lädt nur fehlende Blobs) und erstellt ein
Production-Deployment auf dem festen Projekt → stabile URL
`https://<projekt>.vercel.app/p/<slug>`.

**Env / Secrets** (in env ODER `design-system/.env`, gitignored — Vorlage:
`.env.example`. Alles optional: ohne Vercel-Token → Build + manuelle Deploy-Anleitung;
ohne ETH-SMTP → nur manueller Mailversand):
| Var | Zweck | Default |
|-----|-------|---------|
| `VERCEL_TOKEN` *(oder `design-system/.vercel-token`)* | Deploy-Auth | — (sonst Fallback) |
| `VERCEL_PROJECT_NAME` | das eine Zielprojekt | `treuhand-prototypes` |
| `VERCEL_TEAM_ID` / `VERCEL_ORG_ID` | bei Team-Account | — |
| `ETH_SMTP_USER` / `ETH_SMTP_PASS` | ETH-Versand (Login) | — (sonst manuell) |
| `ETH_SMTP_FROM` / `ETH_SMTP_HOST` / `ETH_SMTP_PORT` / `ETH_SMTP_REPLYTO` | Versand-Feintuning | `=USER` / `smtp.office365.com` / `587` / — |

**E-Mail-Versand (Stufe 1.5):** statt Resend-Sendedomain (V2) geht die Mail direkt
über das **eigene ETH-Postfach** (authentifiziertes SMTP, Nodemailer) — rechtlich/
zustellungstechnisch wie Variante 1 (echtes 1:1-Postfach), nur ohne manuelles
Copy-Paste. **Zugang:** ETH-Adresse + Passwort werden **direkt im Overlay** eingegeben
(nur im Browser via localStorage gespeichert, nie im Repo) ODER aus env/`.env`
(`ETH_SMTP_*`) gelesen — Request-Eingabe gewinnt. Danach sendet der Knopf „Über
ETH-Postfach senden" direkt. ⚠ M365 hat SMTP-AUTH oft deaktiviert + ETH erzwingt MFA:
schlägt der Versand mit 535/"SMTP AUTH disabled" fehl, muss ETH-IT „Authenticated SMTP"
fürs Postfach aktivieren (oder App-/Geräte-Passwort) — sonst greift der manuelle Fallback.

**Bewusste Grenzen ggü. Vollausbau:** kein Lead-Store/Status-Machine (§4/§5) — der
Record IST der Status; kein Auth (Studio ist lokal); Re-Deploy baut komplett neu
statt ISR-`revalidatePath`; Prompt-Edit (§3.9) und Resend-Auto-Send mit eigener
Sendedomain + Tracking/Webhooks (§7 V2) weiterhin offen.
