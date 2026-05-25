'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowDown, FileText, Star } from 'lucide-react';

export default function Hero() {
  const ref = useScrollAnimation();

  // 미니 타임라인 데이터 (pt-01 간이식 케이스 발췌)
  const miniTimeline = [
    { date: '1.23', label: '검진', layer: 'p' as const },
    { date: '2.10', label: '골반골절', layer: 'i' as const },
    { date: '2.20', label: 'AST↑', layer: 'p' as const },
    { date: '3.02', label: '정상', layer: 'p' as const },
    { date: '4.10', label: '아나필', layer: 'i' as const },
    { date: '4.25', label: '안정', layer: 'p' as const },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Ambient grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--accent-rgb) / 0.5) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--accent-rgb) / 0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 80%)',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-5 md:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left" data-animate="fade-up">
            {/* Label — DNA section label */}
            <span className="inline-block mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
              Next-Gen Longitudinal EMR AI
            </span>

            {/* H1 */}
            <h1 className="font-display text-5xl sm:text-6xl font-extrabold tracking-[-0.03em] leading-[1.08] text-[color:var(--c-text)] mb-6">
              길고 긴 EMR,{' '}
              <span
                className="text-[color:var(--color-accent)]"
                style={{ filter: 'drop-shadow(0 0 8px rgb(var(--accent-rgb) / 0.4))' }}
              >
                5초 안에
              </span>{' '}
              차트원샷이 읽습니다
            </h1>

            {/* Sub copy */}
            <p className="text-lg leading-relaxed text-[color:var(--c-text-body)] max-w-lg mx-auto lg:mx-0 mb-3">
              의사가 복잡한 케이스를 검토하는 데 걸리는 시간:{' '}
              <strong className="text-[color:var(--c-text)] font-mono">25분</strong>. 차트원샷은
              이 시간을 <strong className="text-[color:var(--color-accent)] font-mono">5초</strong>로
              단축하여 골든타임을 지킵니다.
            </p>
            <p className="text-xs text-[color:var(--c-text-dim)] font-mono mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              근거: Nolan et al., Mayo Clinic 다기관 설문연구,{' '}
              <em className="not-italic text-[color:var(--c-text-muted)]">Applied Clinical Informatics</em> (2017)
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
              data-animate="fade-up-2"
            >
              <a
                href="#demo"
                className="btn-primary inline-flex items-center gap-2"
              >
                지금 체험하기
                <ArrowDown size={14} strokeWidth={1.75} />
              </a>
              <a
                href="#how-it-works"
                className="btn-ghost inline-flex items-center gap-2"
              >
                작동 원리 보기
              </a>
            </div>

            {/* Trust indicators */}
            <div
              className="mt-10 text-xs font-mono text-[color:var(--c-text-dim)]"
              data-animate="fade-up-3"
            >
              Synthea&trade; Powered &middot; 환자 단위 시계열 요약 &middot; 원문 인용 강제
            </div>
          </div>

          {/* Right: Stacked mockup cards */}
          <div
            className="relative flex justify-center lg:justify-end"
            data-animate="slide-right"
          >
            {/* Aura blobs — teal */}
            <div
              className="absolute w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
              style={{
                top: '-18%',
                right: '8%',
                background: 'rgb(var(--accent-rgb) / 0.55)',
                animation: 'aura-drift-1 20s infinite ease-in-out',
              }}
            />
            <div
              className="absolute w-56 h-56 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{
                bottom: '-12%',
                left: '4%',
                background: 'rgb(var(--secondary-rgb) / 0.40)',
                animation: 'aura-drift-2 20s infinite ease-in-out',
              }}
            />

            {/* Back layer: Long longitudinal chart preview (hidden on mobile) */}
            <div className="hidden lg:block absolute left-0 top-8 w-[82%] z-10 rotate-[-2deg]">
              <div
                className="rounded-2xl p-5"
                style={{
                  background: 'rgb(var(--card-rgb) / 0.55)',
                  border: '1px solid rgb(var(--surface-rgb) / 0.65)',
                  boxShadow: 'var(--glow-card-soft)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[color:var(--c-text-muted)]" strokeWidth={1.5} />
                    <span className="text-[11px] font-semibold text-[color:var(--c-text-body)] uppercase tracking-widest">
                      Longitudinal Chart
                    </span>
                  </div>
                  <span className="text-[9px] text-[color:var(--c-text-dim)] font-mono">9 visits · 7개월</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[color:var(--c-text-body)] leading-relaxed">
                  <p>
                    <span className="font-medium text-[color:var(--c-text)]">Patient:</span>{' '}
                    52세 남성 (간이식 외래)
                  </p>
                  <p>
                    <span className="font-mono text-[color:var(--c-text-muted)]">[2026.01.23]</span> 간이식 정기
                    검진 — Tacrolimus 6.2, LFT 정상
                  </p>
                  <p>
                    <span className="font-mono text-[color:var(--c-text-muted)]">[2026.01.30]</span> 1.23과 동일.
                    안정.
                  </p>
                  <p>
                    <span className="font-mono text-[color:var(--c-text-muted)]">[2026.02.10]</span> TA로 우측
                    치골 골절 — 응급실
                  </p>
                  <p>
                    <span className="font-mono text-[color:var(--c-text-muted)]">[2026.02.20]</span>{' '}
                    <span className="text-[color:var(--c-warning)]">AST 58 ↑ ALT 64 ↑</span> ...
                  </p>
                  <p className="opacity-60">
                    <span className="font-mono text-[color:var(--c-text-dim)]">[2026.03.02]</span>{' '}
                    <span className="text-[color:var(--c-stable)]">AST 26 ✓ ALT 29 ✓</span> 정상 복귀
                  </p>
                  <p className="opacity-40">
                    <span className="font-mono text-[color:var(--c-text-dim)]">[2026.03.30]</span> 안정 유지...
                  </p>
                  <p className="opacity-25">
                    <span className="font-mono text-[color:var(--c-text-faint)]">[2026.04.10]</span> 꿀벌
                    아나필락시스...
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[color:var(--color-divider)]">
                  <span className="text-[9px] text-[color:var(--c-text-dim)] uppercase tracking-widest font-mono">
                    문서 단위 청킹 · pgvector · EmbeddingGemma 300M
                  </span>
                </div>
              </div>
            </div>

            {/* Front layer: Timeline summary mini-card */}
            <div className="relative w-full max-w-sm lg:max-w-none lg:w-[82%] lg:ml-auto z-20">
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  background: 'rgb(var(--card-rgb) / 0.72)',
                  border: '1px solid rgb(var(--surface-rgb) / 0.7)',
                  boxShadow:
                    '0 20px 60px rgb(var(--black-rgb) / 0.6), 0 0 32px rgb(var(--accent-rgb) / 0.18), 0 0 0 1px rgb(var(--accent-rgb) / 0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--color-divider)]">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded font-mono"
                    style={{
                      color: 'var(--c-violet)',
                      background: 'rgb(var(--violet-rgb) / 0.15)',
                      border: '1px solid rgb(var(--violet-rgb) / 0.45)',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--c-violet)', boxShadow: '0 0 6px var(--c-violet)' }}
                    />
                    다분과 협진
                  </span>
                  <span className="text-xs text-[color:var(--c-text-muted)] font-mono">5.2s</span>
                </div>

                <div className="px-5 py-5 space-y-4">
                  {/* Primary Concern */}
                  <div
                    className="relative p-3 rounded-lg overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(135deg, rgb(var(--accent-rgb) / 0.12) 0%, rgb(var(--accent-rgb) / 0.04) 100%)',
                      border: '1px solid rgb(var(--accent-rgb) / 0.40)',
                      boxShadow: '0 0 20px rgb(var(--accent-rgb) / 0.15)',
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Star size={11} className="text-[color:var(--c-accent-bright)]" strokeWidth={2.25} />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--c-accent-bright)] font-mono">
                        주요 질환
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[color:var(--c-text)] mb-1">
                      생체 간이식 후 추적 (12~17개월차)
                    </p>
                    <p className="text-[11px] text-[color:var(--c-text-body)] leading-relaxed">
                      AST/ALT 외상 후 일시 상승 → 2주 만에 정상 복귀, Tacrolimus trough
                      안정 유지
                    </p>
                  </div>

                  {/* Mini horizontal timeline */}
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[color:var(--color-accent)] font-mono mb-3">
                      타임라인 (위: 주요 / 아래: 부수)
                    </p>
                    <div className="relative pt-12 pb-12">
                      {/* axis line */}
                      <div
                        className="absolute left-2 right-4 top-1/2 -translate-y-1/2 h-px"
                        style={{
                          background:
                            'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.3), rgb(var(--accent-rgb) / 0.6))',
                        }}
                      />
                      {/* arrow head */}
                      <div
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        style={{
                          width: 0,
                          height: 0,
                          borderLeft: '7px solid rgb(var(--accent-rgb) / 0.6)',
                          borderTop: '5px solid transparent',
                          borderBottom: '5px solid transparent',
                        }}
                      />
                      {/* dots + labels */}
                      <div className="relative flex justify-between items-center">
                        {miniTimeline.map((ev, i) => {
                          const isPrimary = ev.layer === 'p';
                          return (
                            <div key={i} className="relative flex items-center justify-center">
                              {/* connector */}
                              <div
                                className="absolute left-1/2 -translate-x-1/2 w-px"
                                style={{
                                  top: isPrimary ? '-24px' : '6px',
                                  height: '24px',
                                  background: isPrimary
                                    ? 'rgb(var(--accent-rgb) / 0.35)'
                                    : 'rgb(var(--warning-rgb) / 0.35)',
                                }}
                              />
                              {/* label */}
                              <div
                                className={`absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap ${
                                  isPrimary ? '-top-10' : 'top-7'
                                }`}
                              >
                                <span
                                  className="text-[9px] font-mono font-bold"
                                  style={{ color: isPrimary ? 'var(--c-accent)' : 'var(--c-warning)' }}
                                >
                                  {ev.date}
                                </span>
                                <span
                                  className="block text-[8px] leading-tight mt-0.5"
                                  style={{
                                    color: isPrimary ? 'var(--c-text-body)' : 'var(--c-text-muted)',
                                  }}
                                >
                                  {ev.label}
                                </span>
                              </div>
                              {/* dot */}
                              <div
                                className={`rounded-full ${isPrimary ? 'w-3 h-3' : 'w-2 h-2'}`}
                                style={{
                                  background: isPrimary ? 'var(--c-accent)' : 'var(--c-warning)',
                                  boxShadow: `0 0 6px ${
                                    isPrimary
                                      ? 'rgb(var(--accent-rgb) / 0.7)'
                                      : 'rgb(var(--warning-rgb) / 0.6)'
                                  }`,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Abbreviation chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-semibold uppercase tracking-widest text-[color:var(--c-text-muted)] mr-1">
                      약어/은어
                    </span>
                    <span
                      className="px-1.5 py-0.5 text-[9px] rounded font-mono"
                      style={{
                        color: 'var(--c-accent-bright)',
                        background: 'rgb(var(--accent-rgb) / 0.10)',
                        border: '1px solid rgb(var(--accent-rgb) / 0.30)',
                      }}
                    >
                      f/u → follow-up
                    </span>
                    <span
                      className="px-1.5 py-0.5 text-[9px] rounded font-mono"
                      style={{
                        color: 'var(--c-accent-bright)',
                        background: 'rgb(var(--accent-rgb) / 0.10)',
                        border: '1px solid rgb(var(--accent-rgb) / 0.30)',
                      }}
                    >
                      BID → 1일 2회
                    </span>
                    <span
                      className="px-1.5 py-0.5 text-[9px] rounded font-mono"
                      style={{
                        color: 'var(--c-warning)',
                        background: 'rgb(var(--warning-rgb) / 0.10)',
                        border: '1px solid rgb(var(--warning-rgb) / 0.35)',
                      }}
                      title='사전 미등재 — LLM 추측 없이 원문 유지, "은어 추정" 확인 필요'
                    >
                      HLD · 은어?
                    </span>
                  </div>

                  {/* Citation footer */}
                  <div
                    className="p-2.5 rounded-lg"
                    style={{
                      background: 'rgb(var(--accent-rgb) / 0.06)',
                      borderLeft: '2px solid var(--color-accent)',
                    }}
                  >
                    <p className="text-[11px] text-[color:var(--c-text-body)] leading-relaxed">
                      원문 인용{' '}
                      <strong className="text-[color:var(--c-accent-bright)] font-mono">9건</strong> 부착 —
                      각 항목의 출처 청크 ID로 추적 가능.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade-out into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--c-page))',
        }}
      />
    </section>
  );
}
