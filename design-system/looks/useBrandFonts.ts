/**
 * useBrandFonts — lazily load the Google-font families a brand-tinted look needs.
 * The preset fonts (Inter, Space Grotesk, …) are loaded in index.html; this adds
 * any face adopted from a firm's scrape (Montserrat, Faustina, Be Vietnam Pro, …).
 * Dedupes by a per-family <link id>, so multiple composers on one page are fine.
 */
import { useEffect } from "react";

export function useBrandFonts(families: string[] = []): void {
  const key = families.join(",");
  useEffect(() => {
    if (typeof document === "undefined") return;
    for (const fam of families) {
      if (!fam) continue;
      const id = "gf-" + fam.replace(/\s+/g, "-").toLowerCase();
      if (document.getElementById(id)) continue;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fam).replace(/%20/g, "+")}:wght@300;400;500;600;700;800&display=swap`;
      document.head.appendChild(link);
    }
  }, [key]);
}
