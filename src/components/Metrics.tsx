'use client';

import { useCountUp } from '@/hooks/useCountUp';

interface MetricConfig {
  end: number;
  duration: number;
  prefix: string;
  suffix: string;
  label: string;
  desc: string;
}

const metrics: MetricConfig[] = [
  {
    end: 5,
    duration: 1000,
    prefix: '< ',
    suffix: 's',
    label: 'EMR 분석',
    desc: '의사 25분 → 5초',
  },
  {
    end: 9,
    duration: 900,
    prefix: '',
    suffix: ' → 1',
    label: '차수 통합',
    desc: '9차 외래/입원을 1장 시계열 카드로',
  },
  {
    end: 100,
    duration: 1400,
    prefix: '',
    suffix: '%',
    label: '폐쇄망 운영',
    desc: '외부 송신 0건 · 온프레미스',
  },
  {
    end: 27,
    duration: 800,
    prefix: '',
    suffix: 'B+α',
    label: 'MedGemma 27B 한국 임상 특화',
    desc: 'QLoRA PEFT + DPO 로드맵',
  },
];

function MetricItem({ metric, isLast }: { metric: MetricConfig; isLast: boolean }) {
  const { value, ref } = useCountUp(metric.end, metric.duration);

  return (
    <div
      ref={ref}
      className={`text-center ${!isLast ? 'md:border-r md:border-[color:var(--color-divider)]' : ''}`}
    >
      <div
        className="text-4xl md:text-5xl font-extrabold tabular-nums font-mono tracking-tight text-[color:var(--c-text)]"
        style={{
          textShadow: '0 0 24px rgb(var(--accent-rgb) / 0.20)',
        }}
      >
        {metric.prefix}
        <span className="text-[color:var(--color-accent)]">{value}</span>
        {metric.suffix}
      </div>
      <div className="text-sm text-[color:var(--c-text-body)] mt-3 font-medium">{metric.label}</div>
      <div className="text-xs text-[color:var(--c-text-muted)] mt-1">{metric.desc}</div>
    </div>
  );
}

export default function Metrics() {
  return (
    <section
      className="relative noise-bg py-16 lg:py-24"
      style={{
        background:
          'linear-gradient(180deg, var(--c-page) 0%, var(--c-page) 50%, var(--c-page) 100%)',
      }}
    >
      {/* Faint accent glow band */}
      <div
        className="absolute inset-x-0 top-1/2 h-px pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgb(var(--accent-rgb) / 0.4) 50%, transparent 100%)',
          boxShadow: '0 0 60px rgb(var(--accent-rgb) / 0.25)',
          transform: 'translateY(-50%)',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric, i) => (
            <MetricItem
              key={i}
              metric={metric}
              isLast={i === metrics.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
