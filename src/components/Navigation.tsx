'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Menu, X, ShieldCheck } from 'lucide-react';
import { openPeerReview } from './PeerReviewModal';

const TABS: { label: string; href: string; cta?: boolean }[] = [
  { label: '홈', href: '/' },
  { label: '제품소개', href: '/product' },
  { label: '실측 리포트', href: '/evidence' },
  { label: 'About us', href: '/team' },
  { label: 'Start', href: '/submit', cta: true },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // close the mobile menu whenever the route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'pt-3' : 'pt-5'}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div
          className="relative flex h-[64px] items-center justify-between rounded-[20px] border px-4 md:px-5"
          style={{
            borderColor: 'var(--color-border)',
            background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Logo → 홈 */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="차트원샷 홈">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{
                borderColor: 'var(--color-accent-border)',
                background: 'var(--color-accent-subtle)',
                boxShadow: '0 0 10px rgba(24,74,255,0.20)',
              }}
            >
              <Activity size={18} className="text-[color:var(--color-accent)]" strokeWidth={2.4} />
            </span>
            <span className="text-[17px] font-bold tracking-tight text-[color:var(--color-text-primary)]">차트원샷</span>
          </Link>

          {/* Desktop tabs */}
          <div className="hidden md:flex items-center gap-1">
            {TABS.map((t) => {
              const active = isActive(pathname, t.href);
              if (t.cta) {
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="ml-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-200 hover:-translate-y-px"
                    style={{
                      background: active ? 'var(--color-accent)' : 'var(--color-accent-soft)',
                      color: active ? '#fff' : 'var(--color-accent-hover)',
                      border: '1px solid var(--color-accent-border)',
                    }}
                  >
                    {t.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="relative rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors"
                  style={{ color: active ? 'var(--color-accent)' : 'var(--color-text-body)' }}
                >
                  {t.label}
                  {active && (
                    <span
                      className="absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] rounded-full"
                      style={{ background: 'var(--color-accent)' }}
                    />
                  )}
                </Link>
              );
            })}
            {/* Peer Review — 슈퍼 프라이머리: 페이지 이동 없이 즉시 실행 모달. Liquid Prism C 확정안. */}
            <button type="button" onClick={openPeerReview} className="peer-cta peer-cta--nav ml-1.5" aria-label="Peer Review 실행">
              <ShieldCheck size={15} strokeWidth={2.4} /> Peer Review
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[color:var(--color-text-body)]"
            aria-label="메뉴"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden mt-2 rounded-2xl border p-2"
            style={{
              borderColor: 'var(--color-border)',
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {TABS.map((t) => {
              const active = isActive(pathname, t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium"
                  style={{
                    color: active ? 'var(--color-accent)' : 'var(--color-text-body)',
                    background: active ? 'var(--color-accent-subtle)' : 'transparent',
                  }}
                >
                  {t.label}
                  {t.cta && <span className="text-[color:var(--color-accent-hover)]">→</span>}
                </Link>
              );
            })}
            <button type="button" onClick={() => { setMobileOpen(false); openPeerReview(); }} className="peer-cta mt-1 w-full">
              <ShieldCheck size={16} strokeWidth={2.4} /> Peer Review
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
