"""Verify candidate Treuhänder sites: reachable, real, multi-page ('decent')."""
import json, re, sys, concurrent.futures as cf
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from candidates_raw import CANDIDATES

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
           "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
           "Accept-Language": "de-CH,de;q=0.9,en;q=0.8"}

def reg_domain(netloc):
    netloc = netloc.split(":")[0].lower()
    if netloc.startswith("www."):
        netloc = netloc[4:]
    return netloc

def check(name, url):
    out = {"name": name, "input_url": url, "ok": False}
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, allow_redirects=True)
        out["status"] = r.status_code
        out["final_url"] = r.url
        if r.status_code >= 400:
            out["error"] = f"HTTP {r.status_code}"
            return out
        html = r.text
        out["html_len"] = len(html)
        soup = BeautifulSoup(html, "lxml")
        title = soup.title.string.strip() if soup.title and soup.title.string else ""
        out["title"] = title
        base_dom = reg_domain(urlparse(r.url).netloc)
        out["domain"] = base_dom
        # collect internal links
        internal = set()
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            if href.startswith(("mailto:", "tel:", "javascript:", "#")):
                continue
            full = urljoin(r.url, href)
            p = urlparse(full)
            if p.scheme not in ("http", "https"):
                continue
            if reg_domain(p.netloc) == base_dom:
                path = p.path.rstrip("/") or "/"
                internal.add(path)
        out["internal_pages"] = len(internal)
        out["sample_paths"] = sorted(internal)[:15]
        out["n_images"] = len(soup.find_all("img"))
        text_len = len(soup.get_text(" ", strip=True))
        out["text_len"] = text_len
        # 'decent' heuristic: reachable + has a title + several internal pages + real text
        out["decent"] = (text_len > 800 and len(internal) >= 4 and len(html) > 3000)
        out["ok"] = True
    except Exception as e:
        out["error"] = f"{type(e).__name__}: {e}"
    return out

def main():
    results = []
    with cf.ThreadPoolExecutor(max_workers=12) as ex:
        futs = {ex.submit(check, n, u): (n, u) for n, u in CANDIDATES}
        for f in cf.as_completed(futs):
            res = f.result()
            results.append(res)
            flag = "OK  " if res.get("decent") else ("up  " if res.get("ok") else "FAIL")
            print(f"[{flag}] {res['name'][:38]:38} pages={res.get('internal_pages','-')} "
                  f"txt={res.get('text_len','-')} {res.get('error','')}")
    # dedupe by final domain, keep decent first
    results.sort(key=lambda r: (not r.get("decent"), not r.get("ok")))
    seen, deduped = set(), []
    for r in results:
        dom = r.get("domain") or r.get("input_url")
        if dom in seen:
            continue
        seen.add(dom)
        deduped.append(r)
    with open("verification.json", "w", encoding="utf-8") as f:
        json.dump(deduped, f, ensure_ascii=False, indent=2)
    decent = [r for r in deduped if r.get("decent")]
    up = [r for r in deduped if r.get("ok") and not r.get("decent")]
    print("\n=== SUMMARY ===")
    print("total candidates:", len(CANDIDATES), "| unique domains:", len(deduped))
    print("decent:", len(decent), "| up-but-thin:", len(up),
          "| failed:", len(deduped) - len(decent) - len(up))

if __name__ == "__main__":
    main()
