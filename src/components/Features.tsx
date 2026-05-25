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
          background: 'rgb(var(--surface-rgb) / 0.5)',
          border: '1px solid rgb(var(--border-rgb) / 0.4)',
        }}
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--c-text-muted)] mb-1.5">
          원본
        </div>
        <div className="space-y-1">
          <div className="h-[3px] rounded-full w-full" style={{ background: 'rgb(var(--textbody-rgb) / 0.3)' }} />
          <div className="h-[3px] rounded-full w-5/6" style={{ background: 'rgb(var(--textbody-rgb) / 0.3)' }} />
          <div className="h-[3px] rounded-full w-3/4" style={{ background: 'rgb(var(--textbody-rgb) / 0.3)' }} />
        </div>
      </div>
      <ArrowRight size={14} className="text-[color:var(--color-accent)] flex-shrink-0" strokeWidth={2} />
      <div
        className="flex-1 rounded-lg px-2.5 py-2"
        style={{
          background: 'rgb(var(--accent-rgb) / 0.10)',
          border: '1px solid rgb(var(--accent-rgb) / 0.30)',
        }}
      >
        <div className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--c-accent-bright)] mb-1.5">
          요약
        </div>
        <div className="space-y-1">
          <div className="h-[3px] rounded-full w-2/3" style={{ background: 'rgb(var(--accent-rgb) / 0.5)' }} />
          <div className="h-[3px] rounded-full w-1/2" style={{ background: 'rgb(var(--accent-rgb) / 0.5)' }} />
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
            'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.3), rgb(var(--accent-rgb) / 0.6))',
        }}
      />
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid rgb(var(--accent-rgb) / 0.6)',
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
                  background: isPrimary ? 'var(--c-accent)' : 'var(--c-warning)',
                  boxShadow: `0 0 5px ${
                    isPrimary ? 'rgb(var(--accent-rgb) / 0.7)' : 'rgb(var(--warning-rgb) / 0.6)'
                  }`,
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
        <CheckCircle2 size={12} className="text-[color:var(--c-accent)] flex-shrink-0" strokeWidth={2.5} />
        <code className="text-[color:var(--c-accent-bright)] font-mono font-bold">f/u</code>
        <span className="text-[color:var(--c-text-dim)]">→</span>
        <span className="text-[color:var(--c-text-body)] truncate">follow-up</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle2 size={12} className="text-[color:var(--c-accent)] flex-shrink-0" strokeWidth={2.5} />
        <code className="text-[color:var(--c-accent-bright)] font-mono font-bold">BID</code>
        <span className="text-[color:var(--c-text-dim)]">→</span>
        <span className="text-[color:var(--c-text-body)] truncate">1일 2회</span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <AlertCircle size={12} className="text-[color:var(--c-warning)] flex-shrink-0" strokeWidth={2.5} />
        <code className="text-[color:var(--c-warning)] font-mono font-bold">HLD</code>
        <span className="text-[color:var(--c-text-dim)]">→</span>
        <span className="text-[color:var(--c-warning)] italic truncate">미등재 · 은어 추정</span>
      </div>
    </div>
  );
}

function DataSovereigntyExtra() {
  return (
    <div className="mt-5 flex items-center gap-2 flex-wrap">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style={{
          background: 'rgb(var(--stable-rgb) / 0.10)',
          border: '1px solid rgb(var(--stable-rgb) / 0.30)',
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-accent-pulse"
          style={{ background: 'var(--c-stable)', boxShadow: '0 0 6px var(--c-stable)' }}
        />
        <span className="text-[11px] font-mono font-medium text-[color:var(--c-stable)]">
          폐쇄망 · LIVE
        </span>
      </div>
      <div className="text-[10px] font-mono text-[color:var(--c-text-muted)] whitespace-nowrap">
        외부 송신:{' '}
        <span className="text-[color:var(--c-text-body)] font-bold tabular-nums">0건</span>
      </div>
    </div>
  );
}

/* ─── Features array ─── */

const features = [
  {
    icon: Columns2,
    title: 'Split View 비교',
    description:
      '원본 EMR과 AI 요약을 한 화면에서 대조해 신뢰성을 검증합니다. 길고 반복되는 차트가 핵심 trend로 압축되는 과정을 한눈에.',
    extra: <SplitViewExtra />,
  },
  {
    icon: Activity,
    title: '환자 단위 시계열 요약',
    description:
      '여러 차수의 외래·입원 기록 중 핵심 질환만 추출. 주요 trend는 화살표 위, 부수 이슈는 아래에 분리해 보여줍니다.',
    extra: <TimelineMiniExtra />,
  },
  {
    icon: BookOpen,
    title: '약어 · 은어 결정론적 해소',
    description:
      '분과별 약어/은어 사전을 lookup해 풀이. 사전에 없는 항목은 LLM 추측 없이 원문 그대로 유지하고 "은어 추정" 표시 — 환각 차단.',
    extra: <AbbrevMiniExtra />,
  },
  {
    icon: Shield,
    title: '데이터 주권',
    description:
      'MedGemma 27B + 양산부산대학교병원 자체 데이터로 학습한 분과별 특화 어댑터. 환자 데이터·가중치 모두 폐쇄망 안에 잠금(lock-in)',
    extra: <DataSovereigntyExtra />,
  },
];

/* ─── Feature card ─── */

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const Icon = feature.icon;
  return (
    <div
      className="group relative p-6 rounded-2xl flex flex-col h-full transition-all duration-300"
      style={{
        background: 'rgb(var(--card-rgb) / 0.55)',
        border: '1px solid rgb(var(--surface-rgb) / 0.65)',
        boxShadow: 'var(--glow-card-soft)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
        style={{
          background: 'rgb(var(--accent-rgb) / 0.10)',
          border: '1px solid rgb(var(--accent-rgb) / 0.25)',
          boxShadow: '0 0 12px rgb(var(--accent-rgb) / 0.10)',
        }}
      >
        <Icon size={20} strokeWidth={1.5} className="text-[color:var(--color-accent)]" />
      </div>
      <h3 className="font-display text-base font-semibold text-[color:var(--c-text)] mb-2.5 mt-4 tracking-tight">
        {feature.title}
      </h3>
      <p className="text-[13px] text-[color:var(--c-text-body)] leading-relaxed flex-1">
        {feature.description}
      </p>
      {feature.extra}
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
      className="relative py-20 lg:py-28"
      style={{ background: 'var(--c-page)' }}
    >
      <div ref={ref} className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            data-animate="fade-up"
            className="inline-block mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]"
          >
            Capabilities
          </span>
          <h2
            data-animate="fade-up"
            className="font-display text-[2rem] font-bold text-[color:var(--c-text)] mb-5 tracking-tight"
          >
            Features
          </h2>
          <p data-animate="fade-up-1" className="text-[color:var(--c-text-body)] text-base">
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
