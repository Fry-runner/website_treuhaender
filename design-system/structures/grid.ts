import type { CSSProperties } from "react";

/**
 * Balanced, always-"filled" card grids.
 *
 * Two rules keep every card / person / list grid from showing a sparse last row
 * (the "three on top, one alone underneath" problem):
 *
 *  1. BALANCED COLUMNS — `balancedColumns` picks the column count that splits n into rows
 *     as EQUAL as possible within `cap`: 4 → 2×2 (not 3+1), 5 → 3+2, 6 → 3+3, 7 → 4+3,
 *     9 → 3×3, 10 → 4+4+2. A lone remainder only survives for a prime-ish n at a low cap.
 *  2. CENTRED REMAINDER — the grid is laid out with `fillGrid` + the `ds-fill-grid` class:
 *     a flex-wrap row whose full rows fill the width exactly and whose PARTIAL last row is
 *     CENTRED (so 3+2 reads as a centred pair, not a left-stuck pair). Flexbox keeps this
 *     responsive on its own and never collides with the grid-template string-matching in
 *     Responsive.tsx (ds-fill-grid drops to 2 columns ≤900px and 1 column ≤560px to match
 *     the rest of the site's grids).
 *
 * BORDERED "table" variants (seamless cells divided by hairlines) stay CSS-grid and only
 * take `balancedColumns` for their column count + the usual `i % cols` / `i >= cols` border
 * logic — a centred cell would break a bordered table, so they are left full-width.
 *
 *   const C = balancedColumns(items.length, 3);
 *   <div className="ds-fill-grid" style={fillGrid(C, "1.45rem")}>
 *     {items.map((it, i) => <Card key={i} …>)}   // no per-item style needed
 *   </div>
 */

/** Column count that splits n into rows as EQUAL as possible within `cap` columns — the
 *  classic balanced-grid formula. First fix the (minimum) number of rows needed at `cap`
 *  columns, then spread the items evenly over them: 4→2×2, 5→3+2, 6→3+3, 7→4+3, 9→3×3,
 *  10→4+4+2. `cap` is the most columns the section allows. */
export function balancedColumns(n: number, cap = 4): number {
  if (n <= 1) return 1;
  const rows = Math.ceil(n / cap);
  return Math.ceil(n / rows);                   // ≤ cap by construction, rows kept minimal
}

/** Container style for a centred "always-filled" flex card grid (used with the
 *  `ds-fill-grid` class). Cards size to `basis` so a full row fills the width exactly and
 *  any partial last row sits centred. `gap` is the same value you'd pass to a grid gap. */
export function fillGrid(c: number, gap: string): CSSProperties {
  return {
    gap,
    "--ds-fill-gap": gap,
    "--ds-fill-basis": c <= 1 ? "100%" : `calc((100% - ${c - 1} * ${gap}) / ${c})`,
  } as CSSProperties;
}
