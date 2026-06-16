"""
Structural / content analysis across all 50 scraped Treuhänder sites.
Reads each output/<slug>/site.json and profiles it: page types, sections,
trust signals, tech, languages, interactivity, media. Writes scraped_analysis.json
and prints an aggregate briefing table.
"""
import os, re, json, glob
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "output")

# --- page-type classifiers (match against URL path + title, lowercased) ---
PAGE_TYPES = {
    "services":   ["leistung", "dienstleistung", "angebot", "service", "kompetenz",
                   "fachgebiet", "buchhaltung", "steuerberatung", "treuhand-dienst", "was-wir"],
    "about":      ["ueber-uns", "uber-uns", "über-uns", "about", "kanzlei", "unternehmen",
                   "philosophie", "portrait", "wer-wir", "geschichte", "ueberuns"],
    "team":       ["team", "mitarbeiter", "people", "partner", "berater", "kader"],
    "contact":    ["kontakt", "contact", "anfahrt", "standort", "anfrage"],
    "pricing":    ["preis", "tarif", "kosten", "honorar", "pricing", "pauschal", "abo"],
    "blog_news":  ["blog", "news", "aktuell", "neuigkeit", "fachbeitr", "wissen", "ratgeber",
                   "publikation", "magazin", "insight", "wissenswert", "downloads", "merkblatt"],
    "jobs":       ["job", "karriere", "stellen", "offene-stelle", "career", "lehrstelle"],
    "references": ["referenz", "kundenstimmen", "testimonial", "bewertung", "kunden-sagen", "feedback"],
    "faq":        ["faq", "haeufige", "häufige", "fragen-und-antworten"],
    "legal":      ["impressum", "datenschutz", "agb", "rechtlich", "privacy", "disclaimer", "cookie"],
    "portal":     ["login", "portal", "kundenportal", "kundenlogin", "abaweb", "mein-konto", "client-login"],
}
CERT_KEYS = {
    "TREUHAND|SUISSE": ["treuhand suisse", "treuhand|suisse", "treuhandsuisse"],
    "EXPERTsuisse": ["expertsuisse", "expert suisse"],
    "RAB/zugel. Revisor": ["zugelassen", "rab ", "revisionsaufsicht", "staatlich beaufsichtigt"],
    "eidg. Diplom/Fachausweis": ["eidg. dipl", "eidg. fachausweis", "mit eidgenöss", "dipl. treuhand",
                                  "dipl. steuerexpert", "fachmann im finanz", "fachfrau im finanz"],
    "ISO": ["iso 9001", "iso-zertifi"],
    "swissaccounting": ["swissaccounting", "veb.ch", "veb "],
}
SOFTWARE_KEYS = ["bexio", "abacus", "abaweb", "abaninja", "sage", "klara", "topal", "banana",
                 "run my accounts", "milkee", "accto", "winbiz", "infoniqa"]
SOCIAL_KEYS = {"linkedin": "linkedin.com", "facebook": "facebook.com", "instagram": "instagram.com",
               "xing": "xing.com", "youtube": "youtube.", "twitter": "twitter.com", "x": "x.com"}
BOOKING_KEYS = ["calendly", "termin buchen", "termin vereinbaren", "online termin", "book a", "meeting buchen", "calendar"]
CONSENT_KEYS = ["cookiebot", "borlabs", "usercentrics", "cookie-consent", "cookieconsent", "complianz", "klaro"]
CMS_PATTERNS = {
    "WordPress": ["wp-content", "wp-json", "wordpress"],
    "Wix": ["wix.com", "wixstatic", "_wix"],
    "Jimdo": ["jimdo", "jimstatic"],
    "Webflow": ["webflow"],
    "TYPO3": ["typo3"],
    "Joomla": ["joomla"],
    "Squarespace": ["squarespace"],
    "Drupal": ["drupal"],
    "HubSpot": ["hubspot", "hs-sites"],
    "Webnode": ["webnode"],
}
TESTIMONIAL_TEXT = ["das sagen unsere kunden", "kundenstimmen", "was unsere kunden",
                    "google bewertung", "5 sterne", "★", "kundenfeedback", "erfahrungsberichte"]
HERO_CTA_TEXT = ["kontakt", "termin", "offerte", "angebot anfordern", "jetzt anfragen",
                 "beratung", "kennenlernen", "erstgespräch", "gratis"]


def classify_pages(pages):
    found = Counter()
    for p in pages:
        path = re.sub(r"^https?://[^/]+", "", p.get("url", "")).lower()
        title = (p.get("title") or "").lower()
        hay = path + " " + title
        for t, keys in PAGE_TYPES.items():
            if any(k in hay for k in keys):
                found[t] += 1
    return found


def analyze_site(sj):
    s = json.load(open(sj, encoding="utf-8"))
    pages = s.get("pages", [])
    home = pages[0] if pages else {}
    alltext = " ".join(p.get("text", "") for p in pages).lower()
    home_text = (home.get("text") or "").lower()
    home_h = home.get("headings", {})

    page_types = classify_pages(pages)
    # languages: distinct lang attrs + /en /fr /it path presence + hreflang meta
    langs = set(filter(None, (p.get("lang") for p in pages)))
    paths = " ".join(re.sub(r"^https?://[^/]+", "", p.get("url", "")).lower() for p in pages)
    for code in ["/en", "/fr", "/it"]:
        if code + "/" in paths or paths.endswith(code):
            langs.add(code.strip("/"))
    # tech / cms
    cms = []
    blob = alltext + " " + " ".join(
        (img.get("src", "") for p in pages for img in p.get("images", []))).lower()
    gen = " ".join((p.get("meta", {}).get("generator", "") for p in pages)).lower()
    for name, pats in CMS_PATTERNS.items():
        if any(pp in blob or pp in gen for pp in pats):
            cms.append(name)
    # jsonld types
    jsonld_types = set()
    for p in pages:
        for b in p.get("jsonld", []):
            items = b if isinstance(b, list) else [b]
            for it in items:
                if isinstance(it, dict) and it.get("@type"):
                    t = it["@type"]
                    jsonld_types.update(t if isinstance(t, list) else [t])
    # signals
    certs = [name for name, keys in CERT_KEYS.items() if any(k in alltext for k in keys)]
    software = sorted({k for k in SOFTWARE_KEYS if k in alltext})
    socials = sorted({name for name, dom in SOCIAL_KEYS.items()
                      if any(dom in l.get("href", "") for p in pages for l in p.get("links", []))})
    booking = any(k in alltext for k in BOOKING_KEYS)
    consent = [name for name in CONSENT_KEYS if name in blob]
    testimonials = any(k in alltext for k in TESTIMONIAL_TEXT) or page_types.get("references", 0) > 0
    has_forms = any(p.get("forms") for p in pages)
    total_images = sum(len(p.get("images", [])) for p in pages)
    total_words = sum(len(re.findall(r"\w+", p.get("text", ""))) for p in pages)
    nav_items = [l.get("text", "").strip() for l in home.get("links", [])
                 if l.get("internal") and l.get("text", "").strip()]
    nav_top = [t for t in dict.fromkeys(nav_items) if 1 < len(t) < 24][:12]

    return {
        "name": s.get("name"), "domain": s.get("domain"),
        "pages": len(pages),
        "page_types": {k: v for k, v in page_types.items()},
        "has": {
            "services": page_types.get("services", 0) > 0,
            "about": page_types.get("about", 0) > 0,
            "team": page_types.get("team", 0) > 0,
            "contact_form": has_forms,
            "pricing": page_types.get("pricing", 0) > 0,
            "blog_news": page_types.get("blog_news", 0) > 0,
            "jobs": page_types.get("jobs", 0) > 0,
            "faq": page_types.get("faq", 0) > 0,
            "testimonials": testimonials,
            "client_portal": page_types.get("portal", 0) > 0,
            "online_booking": booking,
            "multilingual": len(langs) > 1,
            "cookie_consent": bool(consent),
            "social": bool(socials),
            "schema_org": bool(jsonld_types),
        },
        "trust": {"certifications": certs, "software": software},
        "languages": sorted(langs), "cms": cms, "jsonld_types": sorted(jsonld_types),
        "socials": socials, "total_images": total_images, "total_words": total_words,
        "hero_h1": home_h.get("h1", [None])[0] if home_h.get("h1") else None,
        "home_h2_count": len(home_h.get("h2", [])),
        "nav_top": nav_top,
    }


def main():
    sites = []
    for sj in sorted(glob.glob(os.path.join(OUT, "*", "site.json"))):
        try:
            sites.append(analyze_site(sj))
        except Exception as e:
            print("ERR", sj, e)
    json.dump(sites, open(os.path.join(HERE, "scraped_analysis.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)

    n = len(sites)
    print(f"\n=== ANALYZED {n} SITES ===\n")
    feats = ["services", "about", "team", "contact_form", "pricing", "blog_news", "jobs",
             "faq", "testimonials", "client_portal", "online_booking", "multilingual",
             "cookie_consent", "social", "schema_org"]
    print("FEATURE PREVALENCE (% of sites):")
    for f in feats:
        c = sum(1 for s in sites if s["has"][f])
        bar = "█" * round(c / n * 30)
        print(f"  {f:16} {c:3}/{n}  {round(c/n*100):3}%  {bar}")

    print("\nTRUST / CERTIFICATIONS (sites mentioning):")
    cert_ct = Counter(c for s in sites for c in s["trust"]["certifications"])
    for c, ct in cert_ct.most_common():
        print(f"  {c:28} {ct}")
    print("\nACCOUNTING SOFTWARE MENTIONED:")
    sw_ct = Counter(w for s in sites for w in s["trust"]["software"])
    for w, ct in sw_ct.most_common(12):
        print(f"  {w:18} {ct}")
    print("\nCMS / BUILDER DETECTED:")
    cms_ct = Counter(c for s in sites for c in s["cms"])
    for c, ct in cms_ct.most_common():
        print(f"  {c:14} {ct}")
    print("\nSITE SIZE:")
    pgs = sorted(s["pages"] for s in sites)
    imgs = sorted(s["total_images"] for s in sites)
    print(f"  pages   median={pgs[n//2]:4}  min={pgs[0]}  max={pgs[-1]}")
    print(f"  images  median={imgs[n//2]:4}  min={imgs[0]}  max={imgs[-1]}")
    multi = [s for s in sites if s["has"]["multilingual"]]
    print(f"\nMULTILINGUAL: {len(multi)}/{n} -> langs seen:",
          Counter(l for s in sites for l in s["languages"]).most_common())


if __name__ == "__main__":
    main()
