/**
 * Runtime realization of the motion system (references/motion.ts).
 * Reveal = the universal scroll-in entrance (fade + rise), with distance/duration
 * driven by the active look's intensity (--ds-reveal-* set in applyLook) and
 * gated by prefers-reduced-motion.
 */
import React, { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** Fade + rise into view once. `index` adds a small stagger for grids. */
export const Reveal: React.FC<React.PropsWithChildren<{ index?: number }>> = ({ children, index = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) { setShown(true); return; }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || !window.innerHeight) { setShown(true); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    // safety net: never leave content invisible if the observer never fires
    const fallback = setTimeout(() => setShown(true), 1600);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, [reduced]);

  const delay = `${Math.min(index, 8) * 70}ms`;
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(var(--ds-reveal-dist, 18px))",
        transition: reduced ? "none"
          : `opacity var(--ds-reveal-dur, 560ms) var(--ds-ease, ease-out) ${delay}, transform var(--ds-reveal-dur, 560ms) var(--ds-ease, ease-out) ${delay}`,
        willChange: shown ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
};
