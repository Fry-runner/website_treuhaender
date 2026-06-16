/** Animates the numeric part of a stat value (e.g. "500+") from 0 when in view. */
import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./Reveal";

export const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const match = value.match(/\d[\d'.,]*/);
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(match && !reduced ? value.replace(match[0], "0") : value);

  useEffect(() => {
    if (!match || reduced) { setDisplay(value); return; }
    const target = parseInt(match[0].replace(/[^\d]/g, ""), 10);
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setDisplay(value); return; }
    let raf = 0;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
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
