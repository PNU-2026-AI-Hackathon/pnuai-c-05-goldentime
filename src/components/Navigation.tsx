'use client';

import { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 ${
        scrolled ? 'shadow-[0_4px_24px_rgb(var(--black-rgb)_/_0.5)]' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-accent-border)]"
              style={{
                background: 'rgb(var(--accent-rgb) / 0.15)',
                boxShadow: '0 0 14px rgb(var(--accent-rgb) / 0.35)',
              }}
            >
              <Activity size={16} strokeWidth={1.75} className="text-[color:var(--color-accent)]" />
            </div>
            <span className="font-display text-base font-bold text-[color:var(--c-text)] tracking-tight">
              차트원샷
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[color:var(--c-text-body)] hover:text-[color:var(--color-accent)] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + theme */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href="#demo" className="btn-primary inline-flex items-center text-[13px]">
              Try Now
            </a>
          </div>

          {/* Mobile: theme + menu */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[color:var(--c-text-body)] hover:text-[color:var(--c-text)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={24} strokeWidth={1.5} />
              ) : (
                <Menu size={24} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[color:var(--c-text-body)] hover:text-[color:var(--color-accent)] rounded-lg hover:bg-[color:var(--color-surface)] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#demo"
              onClick={() => setMobileOpen(false)}
              className="btn-primary block text-center mt-2"
            >
              Try Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
