import { Activity, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer>
      {/* Dark footer */}
      <div
        className="relative noise-bg border-t"
        style={{
          background: '#0A1B34',
          borderColor: 'rgba(24,74,255,0.20)',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Logo + copyright */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-lg border"
                style={{
                  background: 'rgba(24,74,255,0.15)',
                  borderColor: 'rgba(24,74,255,0.30)',
                  boxShadow: '0 0 12px rgba(24,74,255,0.30)',
                }}
              >
                <Activity size={14} strokeWidth={2.25} className="text-[color:var(--color-accent)]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-sm font-bold text-gray-100">
                    차트원샷
                  </span>
                  <span
                    className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded"
                    style={{
                      color: '#60A5FA',           // 밝은 블루
                      background: 'rgba(24,74,255,0.10)',
                      border: '1px solid rgba(24,74,255,0.30)',
                    }}
                  >
                    Team Golden Time
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-mono mt-1">
                  &copy; 2026 Team Golden Time
                </p>
                <p className="text-[11px] text-gray-500 font-mono mt-1.5">
                  <span className="text-gray-600">Members:</span>{' '}
                  조호영 · 박보은 · 김용하
                </p>
                {/* Flaticon 무료 라이선스 출처표기(의사 아이콘) */}
                <p className="mt-1 text-[10px] text-gray-600">
                  Doctor icon by{' '}
                  <a href="https://www.flaticon.com/free-icon/doctor_469466" className="underline-offset-2 hover:underline hover:text-gray-400" rel="noopener noreferrer" target="_blank">
                    Freepik — Flaticon
                  </a>
                </p>
              </div>
            </div>

            {/* Right: Contact + links */}
            <div className="flex flex-col items-center gap-3 md:items-end">
              <div className="flex items-center gap-3">
                <a
                  href="mailto:Goldentime119119@gmail.com"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110"
                  style={{ background: '#184AFF', boxShadow: '0 2px 12px rgba(24,74,255,0.35)' }}
                >
                  <Mail size={13} strokeWidth={2.2} /> Contact Us
                </a>
                <a
                  href="mailto:Goldentime119119@gmail.com"
                  className="text-[11px] font-mono text-gray-500 transition-colors hover:text-gray-300"
                >
                  Goldentime119119@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className="text-xs text-gray-600 opacity-50 cursor-not-allowed select-none"
                  title="준비 중"
                  aria-disabled="true"
                >
                  Privacy Policy
                </span>
                <span
                  className="text-xs text-gray-600 opacity-50 cursor-not-allowed select-none"
                  title="준비 중"
                  aria-disabled="true"
                >
                  Terms of Service
                </span>
                <span
                  className="text-xs text-gray-600 opacity-50 cursor-not-allowed select-none"
                  title="준비 중"
                  aria-disabled="true"
                >
                  Clinical Documentation
                </span>
                {/* 운영자용 — 방문자 동선이 아니라 푸터 유틸리티로만 노출 */}
                <a
                  href="/admin"
                  className="text-xs text-gray-500 transition-colors hover:text-gray-300"
                  aria-label="관리자 콘솔"
                >
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}