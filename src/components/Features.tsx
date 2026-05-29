'use client';

import {
  Columns2,
  Activity,
  BookOpen,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SpotlightCard from '@/components/SpotlightCard';

/* ─── Mini extras (4 cards × visual element) ─── */

function SplitViewExtra() {
  return (
    <div className="mt-5 flex items-center gap-2">
      <div
        className="flex-1 rounded-lg px-2.5 py-2"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-white/50 mb-1.5">
          원본
        </div>
        <div className="space-y-1">
          <div className="h-[3px] rounded-full w-full" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <div className="h-[3px] rounded-full w-5/6" style={{ background: 'rgba(255,255,255,0.3)' }} />
          <div className="h-[3px] rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>
      <ArrowRight size={14} className="text-white flex-shrink-0" strokeWidth={2} />
      <div
        className="flex-1 rounded-lg px-2.5 py-2"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.4)',
        }}
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-white mb-1.5">
          요약
        </div>
        <div className="space-y-1">
          <div className="h-[3px] rounded-full w-2/3" style={{ background: 'rgba(255,255,255,0.8)' }} />
          <div className="h-[3px] rounded-full w-1/2" style={{ background: 'rgba(255,255,255,0.8)' }} />
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
            'linear-gradient(90deg, rgba(255,255,255,0.20), rgba(255,255,255,0.6))',
        }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid rgba(255,255,255,0.6)',
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
                  background: isPrimary ? '#FFFFFF' : 'rgba(255,255,255,0.40)',
                  boxShadow: isPrimary
                    ? '0 0 8px rgba(255,255,255,0.7), 0 0 2px rgba(255,255,255,0.5)'
                    : '0 0 4px rgba(255,255,255,0.3)',
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
        <CheckCircle2 size={12} className="text-white flex-shrink-0" strokeWidth={2.25} />
        <code className="text-white font-mono font-semibold">f/u</code>
        <span className="text-white/30">→</span>
        <span className="text-white/70 truncate">follow-up</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle2 size={12} className="text-white flex-shrink-0" strokeWidth={2.25} />
        <code className="text-white font-mono font-semibold">BID</code>
        <span className="text-white/30">→</span>
        <span className="text-white/70 truncate">1일 2회</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <AlertCircle size={12} className="text-white/80 flex-shrink-0" strokeWidth={2.25} />
        <code className="text-white/80 font-mono font-semibold">HLD</code>
        <span className="text-white/30">→</span>
        <span className="text-white/80 italic truncate">미등재 · 은어 추정</span>
      </div>
    </div>
  );
}

function DataSovereigntyExtra() {
  return (
    <div className="mt-5 flex items-center gap-2 flex-wrap">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-accent-pulse"
          style={{ background: '#FFFFFF', boxShadow: '0 0 6px rgba(255,255,255,0.8)' }}
        />
        <span className="text-[11px] font-mono font-medium text-white">
          폐쇄망 · LIVE
        </span>
      </div>
      <div className="text-[10px] font-mono text-white/50 whitespace-nowrap">
        외부 송신:{' '}
        <span className="text-white font-semibold tabular-nums">0건</span>
      </div>
    </div>
  );
}

/* ─── Features array ─── */

const features = [
  {
    iconSrc: '/icons/feature-split-view.svg',
    title: 'Split View 비교',
    description: '원본 EMR과 AI 요약을 한 화면에서 대조해 신뢰성을 검증합니다.',
    extra: <SplitViewExtra />,
  },
  {
    iconSrc: '/icons/feature-timeline-summary.svg',
    title: '환자 단위 시계열 요약',
    description: '여러 차수의 외래·입원 기록 중 핵심 질환만 추출합니다.',
    extra: <TimelineMiniExtra />,
  },
  {
    iconSrc: '/icons/feature-abbrev-resolver.svg',
    title: '약어·은어 결정론적 해소',
    description: '약어/은어 사전을 lookup해 환각 없이 풀이합니다.',
    extra: <AbbrevMiniExtra />,
  },
  {
    iconSrc: '/icons/feature-data-sovereignty.svg',
    title: '데이터 주권',
    description: '환자 데이터와 모델 가중치를 모두 폐쇄망 안에서 보호합니다.',
    extra: <DataSovereigntyExtra />,
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
            border: '1px solid rgba(255,255,255,0.4)',
          }}
        >
          <img
            src={feature.iconSrc}
            alt=""
            className="w-[120px] h-[120px] object-contain mb-8"
          />

          <h3 className="text-white text-[24px] font-semibold tracking-[-0.03em] text-center">
            {feature.title}
          </h3>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-3xl p-6 flex flex-col [transform:rotateY(180deg)] [backface-visibility:hidden]"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(30px)',
            WebkitBackdropFilter: 'blur(30px)',
          }}
        >
          <h3 className="font-display text-lg font-semibold text-white mb-3 tracking-[-0.01em]">
            {feature.title}
          </h3>

          <p className="text-[13px] text-white/70 leading-[1.65] flex-1 font-light">
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
            'radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            data-animate="fade-up"
            className="section-label inline-flex items-center gap-2 mb-5 text-white/80"
          >
            <span className="w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            Capabilities
          </span>
          <h2
            data-animate="fade-up"
            className="font-display text-[2.25rem] lg:text-[2.5rem] font-semibold text-white mb-4 tracking-[-0.025em]"
          >
            Features
          </h2>
          <p data-animate="fade-up-1" className="text-white/60 text-[15px] font-light">
            긴 EMR을 정확하게 압축하는 4가지 핵심 기능
          </p>
        </div>

        {/* Desktop: 4-column grid (pt-2로 카드 hover lift 영역 확보) */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 pt-2">
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

        {/* Tablet: 2-column grid */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-5 pt-2">
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

        {/* Mobile: 1-column stack without SpotlightCard */}
        <div className="grid grid-cols-1 gap-5 md:hidden">
          {features.map((feature, i) => (
            <div key={i} data-animate={animateClasses[i]}>
              <FeatureCard feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}