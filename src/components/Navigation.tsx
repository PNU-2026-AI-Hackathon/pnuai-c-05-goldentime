'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Menu,
  X,
  Lightbulb,
  Sparkles,
  MonitorPlay,
} from 'lucide-react';

const navLinks = [
  {
    label: 'How It Works',
    href: '#how-it-works',
    icon: Lightbulb,
  },
  {
    label: 'Features',
    href: '#features',
    icon: Sparkles,
  },
  {
    label: 'Demo',
    href: '#demo',
    icon: MonitorPlay,
  },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#how-it-works');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const current = navLinks.find((link) => {
        const section = document.querySelector(link.href);
        if (!section) return false;

        const rect = section.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });

      if (current) {
        setActiveSection(current.href);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveSection(href);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'pt-3' : 'pt-5'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="relative flex h-[72px] items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[color:var(--color-accent-border)]"
              style={{
                background: 'rgba(20,184,166,0.15)',
                boxShadow: '0 0 14px rgba(20,184,166,0.35)',
              }}
            >
              <Activity
                size={16}
                strokeWidth={1.75}
                className="text-[color:var(--color-accent)]"
              />
            </div>

            <span className="font-display text-base font-bold text-gray-100 tracking-tight">
              차트원샷
            </span>
          </a>

          {/* Desktop pill navigation */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
            <div
              className="
                flex items-center rounded-full border border-white/70
                bg-white/80 p-1 shadow-[0_18px_45px_rgba(37,99,235,0.22)]
                backdrop-blur-xl
              "
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.href;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={`
                      inline-flex h-11 items-center gap-2 rounded-full px-6
                      text-sm font-medium transition-all duration-300
                      ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.35)]'
                          : 'text-slate-400 hover:text-slate-600'
                      }
                    `}
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.7}
                      className={isActive ? 'text-white' : 'text-slate-300'}
                    />
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <a href="#demo" className="btn-primary inline-flex items-center text-[13px]">
              Try Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-2 rounded-2xl border border-white/10 bg-black/70 p-2 backdrop-blur-xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.href;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={1.7} />
                  {link.label}
                </a>
              );
            })}

            <a
              href="#demo"
              onClick={() => setMobileOpen(false)}
              className="btn-primary mt-2 block text-center"
            >
              Try Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}