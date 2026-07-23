import { useState, useEffect, useRef } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(end: number, duration: number = 1200, decimals: number = 0) {
  // Start at the FINAL value so SSR / no-JS / crawlers / reduced-motion see the real
  // number (not 0) — the metric is a core claim ("100% 원문 인용"), showing 0 was inverting it.
  const [value, setValue] = useState(end);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced-motion: keep the final value, skip the count-up entirely.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Drop to 0 only now, batched with the start flag — SSR/no-JS keep the real
          // value, and the climb still begins from 0 in the same painted frame.
          setValue(0);
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration, decimals]);

  return { value, ref };
}
