import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px -15% 0px', // Activated when roughly in our active sweet-spot
        ...options,
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, isInView] as const;
}
