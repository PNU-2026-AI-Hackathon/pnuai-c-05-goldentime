'use client';

import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SpotlightCard from '@/components/SpotlightCard';
import Image from 'next/image';

/* ─── Mini extras (4 cards × visual element) ─── */

function SplitViewExtra() {
  return (
    <div className="mt-5 flex items-center gap-2">
      <div
        className="flex-1 rounded-lg px-2.5 py-2"
        style={{
          background: 'transparent',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--color-text-body)] mb-1.5">
          원본
        </div>
        <div className="space-y-1">
          <div className="h-[3px] rounded-full w-full" style={{ background: 'rgba(24,74,255,0.25)' }} />
          <div className="h-[3px] rounded-full w-5/6" style={{ background: 'rgba(24,74,255,0.25)' }} />
          <div className="h-[3px] rounded-full w-3/4" style={{ background: 'rgba(24,74,255,0.25)' }} />
        </div>
      </div>
      <ArrowRight size={14} className="text-[color:var(--color-text-primary)] flex-shrink-0" strokeWidth={2} />
      <div
        className="flex-1 rounded-lg px-2.5 py-2"
        style={{
          background: 'transparent',
          border: '1px solid var(--color-border-strong)',
        }}
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--color-text-primary)] mb-1.5">
          요약
        </div>
        <div className="space-y-1">
          <div className="h-[3px] rounded-full w-2/3" style={{ background: 'var(--color-accent)' }} />
          <div className="h-[3px] rounded-full w-1/2" style={{ background: 'var(--color-accent)' }} />
        </div>
      </div>
    </div>
  );
}

function TimelineMiniExtra() {
  const dots = [
    { layer: 'p' as const },
    { layer: 'i' as const },
    { layer: 'p' as const },
    { layer: 'p' as const },
    { layer: 'i' as const },
    { layer: 'p' as const },
  ];
  return (
    <div className="relative mt-6 pt-3 pb-3">
      <div
        className="absolute left-1 right-3 top-1/2 -translate-y-1/2 h-px"
        style={{
          background:
            'linear-gradient(90deg, rgba(24,74,255,0.2), rgba(24,74,255,0.6))',
        }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid rgba(24,74,255,0.6)',
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
        }}
      />
      <div className="relative flex justify-between items-center">
        {dots.map((d, i) => {
          const isPrimary = d.layer === 'p';
          return (
            <div key={i} className="relative flex items-center justify-center">
              <div
                className={`rounded-full ${isPrimary ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'}`}
                style={{
                  background: isPrimary ? 'var(--color-accent)' : 'rgba(24,74,255,0.4)',
                  boxShadow: isPrimary
                    ? '0 0 8px rgba(24,74,255,0.5), 0 0 2px rgba(24,74,255,0.4)'
                    : '0 0 4px rgba(24,74,255,0.3)',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AbbrevMiniExtra() {
  return (
    <div className="mt-5 space-y-1.5">
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle2 size={12} className="text-[color:var(--color-text-primary)] flex-shrink-0" strokeWidth={2.25} />
        <code className="text-[color:var(--color-text-primary)] font-mono font-semibold">s/p</code>
        <span className="text-[color:var(--color-text-dim)]">→</span>
        <span className="text-[color:var(--color-text-body)] truncate">status post · 사전 lookup</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle2 size={12} className="text-[color:var(--color-text-primary)] flex-shrink-0" strokeWidth={2.25} />
        <code className="text-[color:var(--color-text-primary)] font-mono font-semibold">분과 은어</code>
        <span className="text-[color:var(--color-text-dim)]">→</span>
        <span className="text-[color:var(--color-text-body)] truncate">풀이 + 은어 추정 표시</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <AlertCircle size={12} className="text-[color:var(--color-text-body)] flex-shrink-0" strokeWidth={2.25} />
        <code className="text-[color:var(--color-text-body)] font-mono font-semibold">사전에 없음</code>
        <span className="text-[color:var(--color-text-dim)]">→</span>
        <span className="text-[color:var(--color-text-body)] italic truncate">원문 유지 · LLM 추측 금지</span>
      </div>
    </div>
  );
}

function SovereigntyExtra() {
  return (
    <div className="mt-5 flex items-center gap-2 flex-wrap">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: 'transparent',
          border: '1px solid var(--color-border)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-accent-pulse"
          style={{ background: 'var(--color-accent)', boxShadow: '0 0 6px rgba(24,74,255,0.6)' }}
        />
        <span className="text-[11px] font-mono font-medium text-[color:var(--color-text-primary)]">
          폐쇄망 온프렘 설계
        </span>
      </div>
      <div className="text-[10px] font-mono text-[color:var(--color-text-body)] whitespace-nowrap">
        데이터·가중치 외부 반출:{' '}
        <span className="text-[color:var(--color-text-primary)] font-semibold">설계상 없음</span>
      </div>
    </div>
  );
}

/* ─── Features array ─── */

const features = [
  {
    iconSrc: '/icons/feature-split-view.svg',
    title: 'Split View 비교',
    description: '원본 EMR과 AI 요약을 한 화면에서 대조해 신뢰성을 검증합니다. 길고 반복되는 차트가 핵심 trend로 압축되는 과정을 한 눈에.',
    extra: <SplitViewExtra />,
  },
  {
    iconSrc: '/icons/feature-timeline-summary.svg',
    title: '환자 단위 시계열 요약',
    description: '여러 차수의 외래·입원 기록 중 핵심 질환만 추출. 주요 trend는 화살표 위, 부수 이슈는 아래에 분리해 보여줍니다.',
    extra: <TimelineMiniExtra />,
  },
  {
    iconSrc: '/icons/feature-abbrev-resolver.svg',
    title: '약어·은어 풀이·정리',
    description: '분과별 약어·은어 사전을 참고해 풀이합니다. 사전에 없는 항목은 임의로 추측하지 않고 원문 그대로 두어, 원문에 없는 표현을 만들지 않도록 합니다.',
    extra: <AbbrevMiniExtra />,
  },
  {
    iconSrc: '/icons/feature-data-sovereignty.svg',
    title: '데이터 주권',
    description: 'MedGemma 27B 기반으로 분과별 특화 어댑터를 구축해 나갑니다(목표 스택). 병원 배포 시 환자 데이터와 가중치는 폐쇄망(온프레미스) 안에서 다뤄지도록 설계했습니다.',
    extra: <SovereigntyExtra />,
  },
];

/* ─── Feature card ─── */

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  return (
    <div className="group h-[345px] [perspective:1200px]">
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl [backface-visibility:hidden]"
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border-strong)',
          }}
        >
          <Image
            src={feature.iconSrc}
            alt=""
            width={120}
            height={120}
            className="object-contain mb-8"
          />

          <h3 className="text-[color:var(--color-text-primary)] text-[24px] font-semibold tracking-[-0.03em] text-center">
            {feature.title}
          </h3>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl p-6 flex flex-col [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border-strong)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
          }}
        >
          <div className="font-display text-lg font-semibold text-[color:var(--color-text-primary)] mb-3 tracking-[-0.01em]">
            {feature.title}
          </div>

          <p className="text-[13px] text-[color:var(--color-text-body)] leading-[1.65] flex-1 font-light">
            {feature.description}
          </p>

          {feature.extra}
        </div>
      </div>
    </div>
  );
}

/* ─── Section ─── */

export default function Features() {
  const ref = useScrollAnimation();
  const animateClasses = ['fade-up-1', 'fade-up-2', 'fade-up-3', 'fade-up-4'] as const;

  return (
    <section
      id="features"
      className="relative py-20 lg:py-28 overflow-hidden bg-transparent"
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '500px',
          background:
            'radial-gradient(ellipse, rgba(24,74,255,0.05) 0%, rgba(24,74,255,0) 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            data-animate="fade-up"
            className="section-label inline-flex items-center gap-2 mb-5 text-[color:var(--color-accent-hover)]"
          >
            <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] shadow-[0_0_8px_rgba(24,74,255,0.5)]" />
            Capabilities
          </span>
          <h2
            data-animate="fade-up"
            className="font-display text-[2.25rem] lg:text-[2.5rem] font-semibold text-[color:var(--color-text-primary)] mb-4 tracking-[-0.025em]"
          >
            Features
          </h2>
          <p data-animate="fade-up-1" className="text-[color:var(--color-text-body)] text-[15px] font-light">
            긴 EMR을 정확하게 압축하는 4가지 핵심 기능
          </p>
        </div>

        {/* 단일 반응형 그리드 — DOM에 카드 1벌만(중복 렌더 제거: SEO 중복 헤딩·HTML 중량 해소).
            SpotlightCard는 마우스 없으면 inert(glow opacity 0)라 모바일 레이아웃 영향 없음. */}
        <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {features.map((feature, i) => (
            <SpotlightCard
              key={i}
              className="h-full transition-transform duration-300 hover:-translate-y-1"
            >
              <div data-animate={animateClasses[i]} className="h-full">
                <FeatureCard feature={feature} />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}