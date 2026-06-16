"""
Deep site scraper for Treuhänder websites.

Per site:
  - BFS-crawls all internal HTML pages (seeded by homepage + sitemap.xml), capped.
  - Saves raw HTML of every page under output/<slug>/raw_html/.
  - Extracts full structured data per page (meta, headings, text, links, images,
    JSON-LD, tables, forms, contact info) into output/<slug>/site.json.
  - Downloads every image / media / document binary into output/<slug>/assets/
    and records a manifest (url -> local file, content-type, bytes).

Usage:
  python deep_scrape.py            # scrape all sites in candidates.json
  python deep_scrape.py 0 10       # scrape candidates [0:10)
  python deep_scrape.py --only domain1.ch domain2.ch
"""
import os, re, sys, json, time, hashlib, traceback
from urllib.parse import urljoin, urlparse, urldefrag
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup

HERE = os.path.dirname(os.path.abspath(__file__))
OUTROOT = os.path.join(HERE, "output")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

# ---- limits / politeness ----
MAX_PAGES = 200          # max HTML pages crawled per site
MAX_ASSETS = 2000        # max binary assets downloaded per site
REQ_TIMEOUT = 25
CRAWL_DELAY = 0.35       # seconds between requests to same host
MAX_ASSET_BYTES = 30 * 1024 * 1024
SITE_WALLCLOCK = 900     # max seconds per site
SITE_WORKERS = 6         # how many sites to scrape concurrently

IMG_EXT = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".ico", ".avif", ".tiff"}
DOC_EXT = {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".csv", ".zip", ".rtf", ".odt"}
MEDIA_EXT = {".mp4", ".webm", ".mp3", ".m4a", ".mov", ".ogg", ".wav"}
ASSET_EXT = IMG_EXT | DOC_EXT | MEDIA_EXT
SKIP_CRAWL_EXT = ASSET_EXT | {".css", ".js", ".json", ".xml", ".woff", ".woff2", ".ttf",
                              ".eot", ".otf", ".rss", ".gz"}
EMAIL_RE = re.compile(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}")
PHONE_RE = re.compile(r"(?:\+41|0041|0)\s?(?:\(0\))?\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}")


def reg_domain(netloc):
    netloc = netloc.split(":")[0].lower()
    return netloc[4:] if netloc.startswith("www.") else netloc


def norm_url(url):
    url, _ = urldefrag(url)
    return url.rstrip("/") if urlparse(url).path not in ("", "/") else url


def canon_key(url):
    """Canonical dedup key: https, host w/o www, path w/o trailing slash, + query.
    Collapses www/non-www and http/https and index.html<->/ variants."""
    url, _ = urldefrag(url)
    p = urlparse(url)
    host = reg_domain(p.netloc)
    path = p.path
    if path in ("/index.html", "/index.htm", "/index.php", "/default.html", "/home"):
        path = ""
    path = path.rstrip("/")
    return f"{host}{path}" + (f"?{p.query}" if p.query else "")


def safe_name(s, maxlen=80):
    s = re.sub(r"[^A-Za-z0-9._\-]+", "_", s).strip("_")
    return (s or "index")[:maxlen]


def path_slug(url):
    p = urlparse(url)
    base = (p.path.strip("/") or "index").replace("/", "__")
    base = re.sub(r"\.(html?|php|aspx?)$", "", base, flags=re.I) or "index"
    if p.query:
        base += "__q_" + hashlib.md5(p.query.encode()).hexdigest()[:8]
    return safe_name(base, 100)


def ext_of(url):
    return os.path.splitext(urlparse(url).path)[1].lower()


def extract_assets_from_page(soup, page_url):
    """Return set of absolute asset URLs (images/media/docs) referenced by a page."""
    urls = set()

    def add(u):
        if not u:
            return
        u = u.strip()
        if u.startswith(("data:", "mailto:", "tel:", "javascript:", "#")):
            return
        full, _ = urldefrag(urljoin(page_url, u))
        if urlparse(full).scheme in ("http", "https"):
            urls.add(full)

    for img in soup.find_all("img"):
        add(img.get("src")); add(img.get("data-src")); add(img.get("data-lazy-src"))
        for srcset_attr in ("srcset", "data-srcset"):
            ss = img.get(srcset_attr)
            if ss:
                for part in ss.split(","):
                    add(part.strip().split(" ")[0])
    for source in soup.find_all("source"):
        ss = source.get("srcset")
        if ss:
            for part in ss.split(","):
                add(part.strip().split(" ")[0])
        add(source.get("src"))
    for tag in soup.find_all(["video", "audio"]):
        add(tag.get("src")); add(tag.get("poster"))
    for link in soup.find_all("link", href=True):
        rel = " ".join(link.get("rel", [])).lower()
        if any(k in rel for k in ("icon", "apple-touch", "mask-icon", "manifest")):
            add(link["href"])
    for meta in soup.find_all("meta"):
        prop = (meta.get("property") or meta.get("name") or "").lower()
        if prop in ("og:image", "twitter:image", "og:image:secure_url"):
            add(meta.get("content"))
    # documents/media linked via <a>
    for a in soup.find_all("a", href=True):
        if ext_of(a["href"]) in (DOC_EXT | MEDIA_EXT):
            add(a["href"])
    # inline background-image urls
    for el in soup.find_all(style=True):
        for m in re.finditer(r"url\(([^)]+)\)", el["style"]):
            add(m.group(1).strip("'\" "))
    return urls


def extract_page(soup, resp):
    """Build structured dict for one page."""
    url = resp.url
    meta = {}
    for m in soup.find_all("meta"):
        key = m.get("name") or m.get("property") or m.get("http-equiv")
        if key and m.get("content"):
            meta[key.lower()] = m["content"]
    headings = {}
    for lvl in range(1, 7):
        hs = [h.get_text(" ", strip=True) for h in soup.find_all(f"h{lvl}")]
        if hs:
            headings[f"h{lvl}"] = hs
    # links
    links = []
    base_dom = reg_domain(urlparse(url).netloc)
    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if href.startswith(("javascript:",)):
            continue
        full = urljoin(url, href)
        d = reg_domain(urlparse(full).netloc) if urlparse(full).scheme.startswith("http") else ""
        links.append({"text": a.get_text(" ", strip=True)[:200], "href": full,
                      "internal": d == base_dom})
    # images (metadata)
    images = []
    for img in soup.find_all("img"):
        images.append({k: img.get(k) for k in ("src", "alt", "title", "width", "height")
                       if img.get(k)})
    # structured data (JSON-LD)
    jsonld = []
    for sc in soup.find_all("script", type="application/ld+json"):
        try:
            jsonld.append(json.loads(sc.string or "{}"))
        except Exception:
            jsonld.append({"_raw": (sc.string or "")[:2000]})
    # tables
    tables = []
    for t in soup.find_all("table"):
        rows = []
        for tr in t.find_all("tr"):
            cells = [c.get_text(" ", strip=True) for c in tr.find_all(["td", "th"])]
            if cells:
                rows.append(cells)
        if rows:
            tables.append(rows)
    # forms
    forms = []
    for fm in soup.find_all("form"):
        fields = []
        for inp in fm.find_all(["input", "textarea", "select"]):
            fields.append({"tag": inp.name, "type": inp.get("type"),
                           "name": inp.get("name"), "placeholder": inp.get("placeholder")})
        forms.append({"action": fm.get("action"), "method": fm.get("method"), "fields": fields})
    # visible text
    for bad in soup(["script", "style", "noscript"]):
        bad.extract()
    text = re.sub(r"\n{3,}", "\n\n", soup.get_text("\n", strip=True))
    emails = sorted(set(EMAIL_RE.findall(text)) |
                    {a["href"][7:].split("?")[0] for a in soup.find_all("a", href=True)
                     if a["href"].lower().startswith("mailto:")})
    phones = sorted(set(PHONE_RE.findall(text)))
    return {
        "url": url,
        "status": resp.status_code,
        "content_type": resp.headers.get("Content-Type", ""),
        "title": (soup.title.string.strip() if soup.title and soup.title.string else ""),
        "lang": (soup.html.get("lang") if soup.html else None),
        "meta": meta,
        "canonical": (soup.find("link", rel="canonical") or {}).get("href")
                     if soup.find("link", rel="canonical") else None,
        "headings": headings,
        "text": text,
        "text_len": len(text),
        "links": links,
        "images": images,
        "jsonld": jsonld,
        "tables": tables,
        "forms": forms,
        "emails": emails,
        "phones": phones,
    }


def fetch_sitemap_urls(session, base_url, base_dom):
    """Try sitemap.xml; return same-domain page URLs."""
    found = set()
    for sm in ("/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"):
        try:
            r = session.get(urljoin(base_url, sm), timeout=REQ_TIMEOUT)
            if r.status_code != 200 or "<" not in r.text:
                continue
            locs = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", r.text)
            # nested sitemaps
            for loc in locs:
                if loc.endswith(".xml"):
                    try:
                        rr = session.get(loc, timeout=REQ_TIMEOUT)
                        locs2 = re.findall(r"<loc>\s*([^<\s]+)\s*</loc>", rr.text)
                        for l2 in locs2:
                            if reg_domain(urlparse(l2).netloc) == base_dom and ext_of(l2) not in SKIP_CRAWL_EXT:
                                found.add(norm_url(l2))
                    except Exception:
                        pass
                elif reg_domain(urlparse(loc).netloc) == base_dom and ext_of(loc) not in SKIP_CRAWL_EXT:
                    found.add(norm_url(loc))
        except Exception:
            pass
    return found


def download_asset(session, url, assets_dir, seen, manifest):
    if url in seen or len(manifest) >= MAX_ASSETS:
        return
    seen.add(url)
    try:
        r = session.get(url, timeout=REQ_TIMEOUT, stream=True)
        if r.status_code != 200:
            manifest.append({"url": url, "ok": False, "status": r.status_code})
            return
        ctype = r.headers.get("Content-Type", "").split(";")[0]
        ext = ext_of(url) or {
            "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
            "image/webp": ".webp", "image/svg+xml": ".svg", "application/pdf": ".pdf",
        }.get(ctype, "")
        h = hashlib.md5(url.encode()).hexdigest()[:10]
        fname = f"{h}__{safe_name(os.path.basename(urlparse(url).path) or 'asset')}{'' if ext_of(url) else ext}"
        fpath = os.path.join(assets_dir, fname)
        size = 0
        with open(fpath, "wb") as fh:
            for chunk in r.iter_content(65536):
                size += len(chunk)
                if size > MAX_ASSET_BYTES:
                    break
                fh.write(chunk)
        manifest.append({"url": url, "ok": True, "file": f"assets/{fname}",
                         "content_type": ctype, "bytes": size})
    except Exception as e:
        manifest.append({"url": url, "ok": False, "error": f"{type(e).__name__}: {e}"})


def crawl_site(cand):
    name, start_url, base_dom, slug = cand["name"], cand["url"], cand["domain"], cand["slug"]
    outdir = os.path.join(OUTROOT, slug)
    done_marker = os.path.join(outdir, "site.json")
    if os.path.exists(done_marker):
        try:
            if json.load(open(done_marker, encoding="utf-8")).get("crawl", {}).get("complete"):
                return slug, "skip(exists)"
        except Exception:
            pass
    raw_dir = os.path.join(outdir, "raw_html")
    assets_dir = os.path.join(outdir, "assets")
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(assets_dir, exist_ok=True)

    session = requests.Session()
    session.headers.update(HEADERS)
    t0 = time.time()

    # robots.txt (record only)
    robots = None
    try:
        rr = session.get(urljoin(start_url, "/robots.txt"), timeout=REQ_TIMEOUT)
        if rr.status_code == 200:
            robots = rr.text[:5000]
    except Exception:
        pass

    frontier = [norm_url(start_url)]
    frontier += sorted(fetch_sitemap_urls(session, start_url, base_dom))
    visited, pages, errors = set(), [], []
    asset_urls_all, asset_seen, asset_manifest = set(), set(), []
    page_index = []

    i = 0
    while frontier and len(pages) < MAX_PAGES:
        if time.time() - t0 > SITE_WALLCLOCK:
            errors.append("site wallclock exceeded")
            break
        url = frontier.pop(0)
        key = canon_key(url)
        if key in visited:
            continue
        visited.add(key)
        try:
            r = session.get(url, timeout=REQ_TIMEOUT, allow_redirects=True)
            ctype = r.headers.get("Content-Type", "").lower()
            if "html" not in ctype:
                continue
            soup = BeautifulSoup(r.text, "lxml")
            i += 1
            raw_name = f"{i:03d}__{path_slug(r.url)}.html"
            with open(os.path.join(raw_dir, raw_name), "w", encoding="utf-8") as fh:
                fh.write(r.text)
            pdata = extract_page(soup, r)
            pdata["raw_html"] = f"raw_html/{raw_name}"
            pages.append(pdata)
            page_index.append({"url": r.url, "title": pdata["title"],
                               "raw_html": pdata["raw_html"], "text_len": pdata["text_len"]})
            # enqueue new internal links
            for lk in pdata["links"]:
                if lk["internal"]:
                    nu = norm_url(lk["href"])
                    if (canon_key(nu) not in visited and ext_of(nu) not in SKIP_CRAWL_EXT
                            and len(visited) + len(frontier) < MAX_PAGES * 3):
                        frontier.append(nu)
            asset_urls_all |= extract_assets_from_page(soup, r.url)
            time.sleep(CRAWL_DELAY)
        except Exception as e:
            errors.append(f"{url} :: {type(e).__name__}: {e}")

    # favicon fallback
    asset_urls_all.add(urljoin(start_url, "/favicon.ico"))
    # download assets
    for au in sorted(asset_urls_all):
        if time.time() - t0 > SITE_WALLCLOCK + 300:
            errors.append("asset wallclock exceeded")
            break
        download_asset(session, au, assets_dir, asset_seen, asset_manifest)

    # aggregate contact info
    all_emails = sorted({e for p in pages for e in p["emails"]})
    all_phones = sorted({ph for p in pages for ph in p["phones"]})
    ok_assets = [a for a in asset_manifest if a.get("ok")]
    site = {
        "name": name,
        "domain": base_dom,
        "start_url": start_url,
        "crawl": {
            "complete": True,
            "started": t0,
            "duration_sec": round(time.time() - t0, 1),
            "pages_crawled": len(pages),
            "pages_capped": len(pages) >= MAX_PAGES,
            "errors": errors,
            "robots_txt": robots,
        },
        "contact": {"emails": all_emails, "phones": all_phones},
        "assets": {
            "downloaded": len(ok_assets),
            "failed": len(asset_manifest) - len(ok_assets),
            "total_bytes": sum(a.get("bytes", 0) for a in ok_assets),
            "manifest": asset_manifest,
        },
        "sitemap": page_index,
        "pages": pages,
    }
    with open(done_marker, "w", encoding="utf-8") as fh:
        json.dump(site, fh, ensure_ascii=False, indent=2)
    return slug, f"pages={len(pages)} assets={len(ok_assets)} {round(time.time()-t0)}s"


def main():
    cands = json.load(open(os.path.join(HERE, "candidates.json"), encoding="utf-8"))
    args = sys.argv[1:]
    if args and args[0] == "--only":
        wanted = set(args[1:])
        cands = [c for c in cands if c["domain"] in wanted]
    elif len(args) == 2:
        cands = cands[int(args[0]):int(args[1])]
    os.makedirs(OUTROOT, exist_ok=True)
    print(f"Scraping {len(cands)} sites with {SITE_WORKERS} workers...")
    results = {}
    with ThreadPoolExecutor(max_workers=SITE_WORKERS) as ex:
        futs = {ex.submit(crawl_site, c): c for c in cands}
        for f in as_completed(futs):
            c = futs[f]
            try:
                slug, msg = f.result()
            except Exception as e:
                slug, msg = c["slug"], f"CRASH: {e}\n{traceback.format_exc()}"
            results[slug] = msg
            print(f"  [done] {c['domain']:32} {msg}")
    json.dump(results, open(os.path.join(HERE, "scrape_results.json"), "w",
              encoding="utf-8"), ensure_ascii=False, indent=2)
    print("All done.")


if __name__ == "__main__":
    main()
