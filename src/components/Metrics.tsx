'use client';

import Image from 'next/image';
import { useCountUp } from '@/hooks/useCountUp';

interface MetricConfig {
  end: number;
  duration: number;
  prefix: string;
  suffix: string;
  label: string;
  desc: string;
  badge: string;
}

/* 0707 시안 지표 — 서브카피는 플레이스홀더(시안 래스터 판독 불가), 확정 문구 오면 교체 */
const leftMetrics: MetricConfig[] = [
  {
    end: 25,
    duration: 900,
    prefix: '',
    suffix: '분',
    label: '단축하는 검토 시간',
    // 출처는 주장이 있는 자리에 붙어 있어야 한다 — Hero 문구 교체로 고아가 된 근거를 이리로 옮김.
    desc: '25분 걸리던 케이스 리뷰를 초 단위로',
    badge: '골든타임 확보',
  },
  {
    end: 9,
    duration: 1000,
    prefix: '',
    suffix: '→1',
    label: '여러 차수 → 단일 타임라인',
    desc: '외래·입원 기록을 환자 단위로 통합',
    badge: '환자 단위 시계열',
  },
];

const rightMetrics: MetricConfig[] = [
  {
    end: 100,
    duration: 1200,
    prefix: '',
    suffix: '%',
    label: '표시 문장 원문 인용',
    desc: '원문에서 근거를 찾은 문장을 함께 표시',
    badge: '원문 근거 기반',
  },
  {
    end: 27,
    duration: 1100,
    prefix: '',
    suffix: 'B+α',
    label: 'MedGemma 27B 기반',
    desc: '분과 특화 어댑터·폐쇄망 온프렘 지향(목표)',
    badge: '데이터 주권',
  },
];

function MetricItem({ metric }: { metric: MetricConfig }) {
  const { value, ref } = useCountUp(metric.end, metric.duration);

  return (
    <div ref={ref} className="text-center flex flex-col items-center px-2">
      {/* Number — single line guaranteed */}
      <div
        className="font-mono font-extrabold tabular-nums tracking-tight leading-none text-white whitespace-nowrap"
        style={{
          fontSize: 'clamp(2.5rem, 3.8vw, 4rem)',
          textShadow:
            '0 0 24px rgba(59,130,246,0.40), 0 0 48px rgba(59,130,246,0.18)',
        }}
      >
        {metric.prefix}
        <span
          style={{
            background:
              'linear-gradient(180deg, #93c5fd 0%, #3b82f6 60%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {value}
        </span>
        {metric.suffix}
      </div>

      {/* Label */}
      <div className="text-sm md:text-base text-white/90 mt-4 font-semibold tracking-tight whitespace-nowrap">
        {metric.label}
      </div>

      {/* Description */}
      <div className="text-[11px] md:text-xs text-white/50 mt-1.5 font-light">
        {metric.desc}
      </div>

      {/* Pill badge */}
      <div
        className="mt-4 px-3.5 py-1.5 rounded-full text-[10px] md:text-[11px] font-medium tracking-wide whitespace-nowrap"
        style={{
          background: 'rgba(59,130,246,0.12)',
          border: '1px solid rgba(96,165,250,0.35)',
          color: '#93C5FD',
          boxShadow:
            'inset 0 0 12px rgba(59,130,246,0.12), 0 0 16px rgba(59,130,246,0.10)',
        }}
      >
        {metric.badge}
      </div>
    </div>
  );
}

export default function Metrics() {
  return (
    <section
      className="relative noise-bg py-20 lg:py-28 overflow-hidden"
      style={{
        background:
          'radial-gradient(1200px 500px at 50% 0%, rgba(24,74,255,0.16) 0%, rgba(24,74,255,0) 60%), #060B18',
      }}
    >
      {/* Ambient blue glow — top center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1000px',
          height: '600px',
          background:
            'radial-gradient(ellipse, rgba(37, 99, 235, 0.18) 0%, rgba(59,130,246,0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
        {/* Section caption */}
        

        {/*
          ⚠️ KEY FIX: grid-template-columns 명시적으로 비율 지정
          좌측 2칼럼 : 가운데 이미지 : 우측 2칼럼 = 2 : 1.4 : 2
          이렇게 하면 가운데 이미지가 적당히 작고, 좌우 메트릭 공간 확보됨
        */}
        <div
          className="grid grid-cols-2 gap-x-4 gap-y-12 items-center lg:gap-x-8"
          style={{
            // lg breakpoint 이상에서만 5칼럼 비율 적용
          }}
        >
          {/* mobile: 2x2 grid */}
          <div className="contents lg:hidden">
            {[...leftMetrics, ...rightMetrics].map((m, i) => (
              <MetricItem key={i} metric={m} />
            ))}
          </div>

          {/* desktop: 5-col with explicit ratio */}
          <div
            className="hidden lg:grid lg:col-span-2 items-center"
            style={{
              gridTemplateColumns: '1fr 1fr 1.2fr 1fr 1fr',
              gap: '1.5rem',
            }}
          >
            {leftMetrics.map((m, i) => (
              <MetricItem key={`L-${i}`} metric={m} />
            ))}

            {/* Center hero image */}
            <div className="flex justify-center items-center relative min-h-[360px]">
              <div
                className="absolute pointer-events-none"
                style={{
                  width: '130%',
                  height: '100%',
                  background:
                    'radial-gradient(ellipse at center, rgba(59,130,246,0.30) 0%, rgba(59,130,246,0.10) 40%, transparent 75%)',
                  filter: 'blur(40px)',
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: '8%',
                  width: '70%',
                  height: '30px',
                  background:
                    'radial-gradient(ellipse at center, rgba(59,130,246,0.50) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
              <Image
                src="/hero_hologram.png"
                alt="차트원샷 임상 데이터 통합 시각화"
                width={512}
                height={768}
                priority
                className="relative z-10 w-full max-w-[240px] xl:max-w-[280px] h-auto"
                style={{
                  mixBlendMode: 'screen',
                  maskImage:
                    'radial-gradient(ellipse 75% 90% at center, black 5%, transparent 20%)',
                  WebkitMaskImage:
                    'radial-gradient(ellipse 75% 90% at center, black 5%, transparent 50%)',
                }}
              />
            </div>

            {rightMetrics.map((m, i) => (
              <MetricItem key={`R-${i}`} metric={m} />
            ))}
          </div>
        </div>

        {/* 근거 각주 — 수치를 내세우는 화면에는 출처가 같이 있어야 한다.
            (Hero 문구 교체로 이 출처가 고아가 됐던 것을 주장이 남은 자리로 옮겼다) */}
        <p className="mt-14 text-center text-[11.5px] font-light tracking-[-0.02em] text-white/45">
          검토 시간 근거: Nolan et al., Mayo Clinic 다기관 설문연구, Applied Clinical Informatics (2017)
        </p>
      </div>
    </section>
  );
}