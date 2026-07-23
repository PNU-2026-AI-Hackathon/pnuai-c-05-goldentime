import { useEffect, useRef } from 'react';

export function useScrollAnimation(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  // 옵션은 마운트 시점 값으로 고정 — 호출부 객체 리터럴 재생성으로 옵저버가 재설치되지 않게.
  const optionsRef = useRef(options);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...optionsRef.current }
    );
    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}
