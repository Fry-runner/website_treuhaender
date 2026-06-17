/** Animates the numeric part of a stat value (e.g. "500+") from 0 when in view. */
import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./Reveal";

export const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const match = value.match(/\d[\d'.,]*/);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // The real value is the always-visible default. The count-up only enhances it
  // when the stat scrolls into view — never gate the number behind the animation,
  // or a headless render / paused tab / reduced-motion user sees "0".
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!match || reduced) { setDisplay(value); return; }
    const target = parseInt(match[0].replace(/[^\d]/g, ""), 10);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setDisplay(value); return; }
    // If the stat is already on screen at mount, leave the real value (no flash).
    const r = el.getBoundingClientRect();
    if (r.top <= window.innerHeight && r.bottom >= 0) return;
    // Otherwise keep the real value rendered and reset to 0 ONLY at the moment it
    // scrolls into view — so a headless render / paused tab that never scrolls
    // keeps showing the real number instead of being stuck at 0.
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        setDisplay(value.replace(match[0], "0"));
        const t0 = performance.now();
        const dur = 1100;
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const n = Math.round(target * (1 - Math.pow(1 - p, 3)));
          setDisplay(value.replace(match[0], String(n)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, reduced]);

  return <span ref={ref}>{display}</span>;
};
