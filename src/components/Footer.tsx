import { Shield, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      {/* Data ethics banner */}
      <div
        className="py-5 border-t"
        style={{
          background: 'var(--c-page)',
          borderColor: 'rgb(var(--surface-rgb) / 0.6)',
        }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-center gap-3">
          <Shield size={16} strokeWidth={1.5} className="text-[color:var(--c-text-muted)] flex-shrink-0" />
          <p className="text-center text-xs text-[color:var(--c-text-muted)] leading-relaxed">
            All patient data in this demo is 100% synthetically generated via
            MITRE Synthea&trade; and does not contain any real Protected Health
            Information (PHI).
          </p>
        </div>
      </div>

      {/* Dark footer */}
      <div
        className="relative noise-bg border-t"
        style={{
          background: 'var(--c-page)',
          borderColor: 'rgb(var(--surface-rgb) / 0.6)',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Logo + copyright */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg border"
                style={{
                  background: 'rgb(var(--accent-rgb) / 0.15)',
                  borderColor: 'rgb(var(--accent-rgb) / 0.30)',
                  boxShadow: '0 0 12px rgb(var(--accent-rgb) / 0.30)',
                }}
              >
                <Activity size={14} strokeWidth={2.25} className="text-[color:var(--color-accent)]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm font-bold text-[color:var(--c-text)]">
                    차트원샷
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded"
                    style={{
                      color: 'var(--c-accent-bright)',
                      background: 'rgb(var(--accent-rgb) / 0.10)',
                      border: '1px solid rgb(var(--accent-rgb) / 0.30)',
                    }}
                  >
                    Team Golden Time
                  </span>
                </div>
                <p className="text-xs text-[color:var(--c-text-dim)] font-mono mt-1">
                  &copy; 2026 Team Golden Time · 양산부산대학교병원 임상 연구
                  · Synthea&trade; Powered
                </p>
                <p className="text-[11px] text-[color:var(--c-text-muted)] font-mono mt-1.5">
                  <span className="text-[color:var(--c-text-dim)]">Members:</span>{' '}
                  조호영 · 박보은 · 박준이 · 김용하
                </p>
              </div>
            </div>

            {/* Right: Links */}
            <div className="flex items-center gap-6">
              <span
                className="text-xs text-[color:var(--c-text-dim)] opacity-50 cursor-not-allowed select-none"
                title="준비 중"
                aria-disabled="true"
              >
                Privacy Policy
              </span>
              <span
                className="text-xs text-[color:var(--c-text-dim)] opacity-50 cursor-not-allowed select-none"
                title="준비 중"
                aria-disabled="true"
              >
                Terms of Service
              </span>
              <span
                className="text-xs text-[color:var(--c-text-dim)] opacity-50 cursor-not-allowed select-none"
                title="준비 중"
                aria-disabled="true"
              >
                Clinical Documentation
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
