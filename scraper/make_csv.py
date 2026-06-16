"""Build a human-readable CSV summary from all scraped site.json files."""
import os, json, csv, glob

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "output")


def jsonld_address(pages):
    for p in pages:
        for block in p.get("jsonld", []):
            items = block if isinstance(block, list) else [block]
            for it in items:
                if isinstance(it, dict) and "address" in it:
                    a = it["address"]
                    if isinstance(a, dict):
                        parts = [a.get("streetAddress"), a.get("postalCode"),
                                 a.get("addressLocality")]
                        s = " ".join(x for x in parts if x)
                        if s.strip():
                            return s.strip()
    return ""


def top_services(pages):
    """Collect distinct H2/H3 from homepage as a proxy for offered services."""
    if not pages:
        return ""
    home = pages[0]
    hs = home.get("headings", {})
    cand = (hs.get("h2", []) + hs.get("h3", []))
    seen, out = set(), []
    for h in cand:
        h = h.strip()
        if 3 < len(h) < 60 and h.lower() not in seen:
            seen.add(h.lower()); out.append(h)
        if len(out) >= 6:
            break
    return " | ".join(out)


def main():
    rows = []
    for sj in sorted(glob.glob(os.path.join(OUT, "*", "site.json"))):
        s = json.load(open(sj, encoding="utf-8"))
        pages = s.get("pages", [])
        crawl = s.get("crawl", {})
        assets = s.get("assets", {})
        contact = s.get("contact", {})
        home = pages[0] if pages else {}
        total_text = sum(p.get("text_len", 0) for p in pages)
        total_imgs = sum(len(p.get("images", [])) for p in pages)
        rows.append({
            "name": s.get("name", ""),
            "domain": s.get("domain", ""),
            "url": s.get("start_url", ""),
            "home_title": home.get("title", ""),
            "description": home.get("meta", {}).get("description", ""),
            "services_guess": top_services(pages),
            "address_guess": jsonld_address(pages),
            "emails": ", ".join(contact.get("emails", [])),
            "phones": ", ".join(contact.get("phones", [])),
            "pages_crawled": crawl.get("pages_crawled", 0),
            "total_text_chars": total_text,
            "images_referenced": total_imgs,
            "assets_downloaded": assets.get("downloaded", 0),
            "asset_size_mb": round(assets.get("total_bytes", 0) / 1048576, 2),
            "crawl_errors": len(crawl.get("errors", [])),
            "crawl_seconds": crawl.get("duration_sec", 0),
        })
    rows.sort(key=lambda r: r["name"].lower())
    cols = ["name", "domain", "url", "home_title", "description", "services_guess",
            "address_guess", "emails", "phones", "pages_crawled", "total_text_chars",
            "images_referenced", "assets_downloaded", "asset_size_mb", "crawl_errors",
            "crawl_seconds"]
    path = os.path.join(HERE, "treuhaender_zurich.csv")
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)
    print(f"Wrote {len(rows)} rows -> {path}")


if __name__ == "__main__":
    main()
