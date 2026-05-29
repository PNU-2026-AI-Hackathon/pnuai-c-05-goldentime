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

const leftMetrics: MetricConfig[] = [
  {
    end: 5,
    duration: 1000,
    prefix: '< ',
    suffix: 's',
    label: 'EMR 분석 속도',
    desc: '의사 25분 → 5초',
    badge: '90% 시간 단축 효과',
  },
  {
    end: 9,
    duration: 900,
    prefix: '',
    suffix: ' → 1',
    label: '차수 통합',
    desc: '9차 외래/입원을 1장 시계열 카드로',
    badge: '89% 정보 압축',
  },
];

const rightMetrics: MetricConfig[] = [
  {
    end: 100,
    duration: 1400,
    prefix: '',
    suffix: '%',
    label: '폐쇄망 운영',
    desc: '외부 송신 0건 · 온프레미스',
    badge: '임상 신뢰도 극대화',
  },
  {
    end: 27,
    duration: 800,
    prefix: '',
    suffix: 'B+α',
    label: 'MedGemma 27B 한국 임상 특화',
    desc: 'MedGemma 27B + 독점 데이터',
    badge: '지속 성장하는 의료 AI',
  },
];

function MetricItem({ metric }: { metric: MetricConfig }) {
  const { value, ref } = useCountUp(metric.end, metric.duration);

  return (
    <div ref={ref} className="text-center flex flex-col items-center px-2">
      {/* Number — single line guaranteed */}
      <div
        className="font-mono font-extrabold tabular-nums tracking-tight leading-none text-gray-100 whitespace-nowrap"
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
      <div className="text-sm md:text-base text-gray-100 mt-4 font-semibold tracking-tight whitespace-nowrap">
        {metric.label}
      </div>

      {/* Description */}
      <div className="text-[11px] md:text-xs text-gray-400 mt-1.5 font-light">
        {metric.desc}
      </div>

      {/* Pill badge */}
      <div
        className="mt-4 px-3.5 py-1.5 rounded-full text-[10px] md:text-[11px] font-medium tracking-wide whitespace-nowrap"
        style={{
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.30)',
          color: '#93c5fd',
          boxShadow:
            'inset 0 0 12px rgba(59,130,246,0.10), 0 0 16px rgba(59,130,246,0.08)',
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
          'linear-gradient(180deg, #030712 0%, #050a18 50%, #030712 100%)',
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
            'radial-gradient(ellipse, rgba(37, 99, 235, 0.12) 0%, rgba(59,130,246,0) 70%)',
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
                alt="차트의샷 임상 데이터 통합 시각화"
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
      </div>
    </section>
  );
}