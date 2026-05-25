'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FileUp, Brain, LayoutDashboard, Network, X, Check } from 'lucide-react';

const steps = [
  {
    icon: FileUp,
    title: 'EMR 업로드',
    desc: '텍스트 형식의 EMR을 시스템에 업로드합니다. 별도의 전처리 없이 원본 그대로 업로드하면 됩니다.',
  },
  {
    icon: Brain,
    title: 'AI 분석',
    desc: '추출된 텍스트를 LLM이 임상적 맥락에서 해석합니다. 활력징후, 주증상, 알레르기 등 핵심 필드를 구조화하고, 현재 질환을 위주로 반드시 확인해야 할 환자의 타임라인을 그려줍니다.',
  },
  {
    icon: LayoutDashboard,
    title: '결과 대시보드',
    desc: '30초 이내에 구조화된 JSON 응답을 반환합니다. Split View에서 원본과 요약을 대조하며, 이상 수치는 시각적으로 즉시 강조됩니다.',
  },
];

type WorkflowNode = {
  id: string;
  label: string;
  stepIndex: number;
  badges: string[];
};

const workflowNodes: WorkflowNode[] = [
  { id: 'webhook', label: 'Webhook In', stepIndex: 0, badges: [] },
  { id: 'chunker', label: 'Document Chunker', stepIndex: 0, badges: ['문서 단위 청킹'] },
  { id: 'abbrev', label: 'Abbreviation Lookup', stepIndex: 1, badges: ['분과 사전', '결정론적'] },
  { id: 'rag', label: 'RAG Retriever', stepIndex: 1, badges: ['pgvector', 'EmbeddingGemma 300M'] },
  { id: 'medgemma', label: 'MedGemma 27B', stepIndex: 1, badges: ['vLLM', 'QLoRA r=16', '4-bit NF4'] },
  { id: 'verify', label: 'Citation Verifier', stepIndex: 2, badges: ['원문 인용 강제'] },
  { id: 'respond', label: 'Webhook Response', stepIndex: 2, badges: ['JSON 구조화'] },
];

const infraSpec = [
  { key: 'Runtime', value: 'vLLM' },
  { key: 'Base Model', value: 'MedGemma 27B' },
  { key: 'Adapter', value: 'QLoRA (PEFT) r=16' },
  { key: 'Quantize', value: '4-bit NF4' },
  { key: 'Vector DB', value: 'pgvector' },
  { key: 'Embedding', value: 'EmbeddingGemma 300M' },
  { key: 'GPU', value: 'RTX A6000 48GB' },
  { key: 'Network', value: '폐쇄망 온프레미스' },
];

function WorkflowNodeBox({ node, active }: { node: WorkflowNode; active: boolean }) {
  return (
    <div
      className="w-full rounded-xl px-4 py-3 border transition-all duration-300"
      style={
        active
          ? {
              background: 'rgb(var(--accent-rgb) / 0.12)',
              borderColor: 'rgb(var(--accent-rgb) / 0.50)',
              boxShadow: '0 0 18px rgb(var(--accent-rgb) / 0.25)',
            }
          : {
              background: 'rgb(var(--card-rgb) / 0.55)',
              borderColor: 'rgb(var(--border-rgb) / 0.5)',
            }
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[12px] font-mono font-semibold transition-colors duration-300 ${
            active ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--c-text-body)]'
          }`}
        >
          {node.label}
        </span>
        {active && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-accent-pulse"
            style={{ background: 'var(--c-accent)', boxShadow: '0 0 6px var(--c-accent)' }}
          />
        )}
      </div>
      {node.badges.length > 0 && (
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {node.badges.map((b, bi) => (
            <span
              key={bi}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors duration-300"
              style={
                active
                  ? {
                      color: 'var(--c-accent-bright)',
                      background: 'rgb(var(--accent-rgb) / 0.10)',
                      border: '1px solid rgb(var(--accent-rgb) / 0.30)',
                    }
                  : {
                      color: 'var(--c-text-body)',
                      background: 'rgb(var(--surface-rgb) / 0.6)',
                      border: '1px solid rgb(var(--border-rgb) / 0.4)',
                    }
              }
            >
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function NodeArrow() {
  return (
    <div className="flex flex-col items-center my-0.5">
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="text-[color:var(--c-text-faint)]">
        <path
          d="M5 0v10M1.5 7l3.5 4 3.5-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function DifferentiationStrip() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgb(var(--accent-rgb) / 0.15) 0%, rgb(var(--accent-rgb) / 0.04) 100%)',
        border: '1px solid rgb(var(--accent-rgb) / 0.45)',
        boxShadow: '0 0 24px rgb(var(--accent-rgb) / 0.20)',
      }}
    >
      <div className="px-5 py-4 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <X size={14} className="text-[color:var(--c-text-muted)] flex-shrink-0" strokeWidth={2.5} />
          <span className="text-[12px] text-[color:var(--c-text-muted)] line-through">
            Baseline MedGemma 27B 그대로 사용
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <Check
            size={14}
            className="text-[color:var(--c-stable)] flex-shrink-0 mt-0.5"
            strokeWidth={2.5}
          />
          <div>
            <p className="text-sm text-[color:var(--c-text)] font-semibold leading-snug">
              분과별 QLoRA PEFT 어댑터로 한국 임상 특화
            </p>
            <p className="text-[11px] text-[color:var(--c-text-muted)] font-mono mt-1">
              + DPO 후속 적용 (3단계 로드맵)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfraSpecCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgb(var(--card-rgb) / 0.55)',
        border: '1px solid rgb(var(--surface-rgb) / 0.65)',
        boxShadow: 'var(--glow-card-soft)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-[color:var(--color-divider)]">
        <div className="flex items-center gap-2">
          <Network size={13} className="text-[color:var(--color-accent)]" strokeWidth={1.75} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--c-text-body)] font-mono">
            LangGraph Inference Pipeline
          </span>
        </div>
        <span
          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono"
          style={{
            color: 'var(--c-stable)',
            background: 'rgb(var(--stable-rgb) / 0.15)',
            border: '1px solid rgb(var(--stable-rgb) / 0.30)',
          }}
        >
          Ready
        </span>
      </div>

      <div className="px-5 py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {infraSpec.map((item) => (
            <div key={item.key} className="flex flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-widest text-[color:var(--c-text-muted)] font-mono">
                {item.key}
              </span>
              <span className="text-[12px] font-mono font-medium text-[color:var(--c-text)] mt-0.5">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 space-y-2.5">
        <p className="text-xs text-[color:var(--c-text-muted)] text-center leading-relaxed">
          노드 교체만으로 모델·검색·청크 전략을 유연하게 변경 가능
        </p>
        <p className="text-[11px] text-[color:var(--c-text-dim)] text-center font-mono leading-relaxed pt-2.5 border-t border-[color:var(--color-divider)]">
          적응 로드맵 ·{' '}
          <span className="text-[color:var(--c-accent-bright)]">RAG + Few-shot</span>
          <span className="text-[color:var(--c-text-faint)]"> (1) </span>
          →{' '}
          <span className="text-[color:var(--c-accent-bright)]">+ QLoRA SFT</span>
          <span className="text-[color:var(--c-text-faint)]"> (2) </span>
          →{' '}
          <span className="text-[color:var(--c-accent-bright)]">+ DPO</span>
          <span className="text-[color:var(--c-text-faint)]"> (3, 옵션)</span>
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useScrollAnimation();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefsMobile = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefsMobile = useRef<(HTMLDivElement | null)[]>([]);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    [],
  );
  const setStepRefMobile = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefsMobile.current[index] = el;
    },
    [],
  );
  const setNodeRefMobile = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      nodeRefsMobile.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const attach = (el: HTMLDivElement | null, index: number) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(index);
          }
        },
        // viewport 상단 20% 아래, 하단 40% 위 영역만 trigger
        // → 스크롤 역행해도 step이 trigger zone 들어가는 순간 active로 잡힘
        { rootMargin: '-20% 0px -40% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    };
    // 모바일에선 노드 다이어그램이 스텝과 분리 배치(sticky 아님)라, 노드 자체도 관찰해
    // 화면 밴드에 들어온 노드의 stepIndex로 activeStep을 갱신 → 노드 점등이 스크롤을 따라감.
    const attachNode = (el: HTMLDivElement | null, i: number) => {
      if (!el) return;
      const stepIndex = workflowNodes[i]?.stepIndex ?? 0;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveStep(stepIndex);
        },
        { rootMargin: '-20% 0px -40% 0px', threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    };
    // 데스크탑·모바일 step 둘 다 observe.
    // display:none element는 isIntersecting false라 자동 무시 → 충돌 X
    stepRefs.current.forEach(attach);
    stepRefsMobile.current.forEach(attach);
    nodeRefsMobile.current.forEach(attachNode);
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const isNodeActive = (node: WorkflowNode) => node.stepIndex === activeStep;

  return (
    <section
      id="how-it-works"
      className="relative py-20 lg:py-28"
      style={{ background: 'var(--c-page)' }}
    >
      <div ref={sectionRef} className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            data-animate="fade-up"
            className="inline-block mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]"
          >
            Pipeline
          </span>
          <h2
            data-animate="fade-up"
            className="font-display text-[2rem] font-bold tracking-[-0.02em] text-[color:var(--c-text)] mb-5"
          >
            How It Works
          </h2>
          <p data-animate="fade-up-1" className="text-[color:var(--c-text-body)] text-base">
            데이터가 인사이트로 변하는 과정 — LangGraph 추론 파이프라인
          </p>
        </div>

        {/* Desktop: Sticky left + scrolling right */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column: Sticky LangGraph diagram + infra spec */}
          <div className="lg:sticky lg:top-24 self-start">
            {/* Workflow nodes */}
            <div className="mb-6" data-animate="fade-up">
              <div className="flex flex-col items-stretch gap-0">
                {workflowNodes.map((node, i) => (
                  <div key={node.id} className="flex flex-col items-stretch">
                    <WorkflowNodeBox node={node} active={isNodeActive(node)} />
                    {i < workflowNodes.length - 1 && <NodeArrow />}
                  </div>
                ))}
              </div>
            </div>

            {/* Differentiation strip — '오픈소스만 X, 분과별 특화' 강조 */}
            <div className="mb-3" data-animate="fade-up-1">
              <DifferentiationStrip />
            </div>

            {/* LangGraph Inference Pipeline — infra spec card */}
            <div data-animate="scale-up">
              <InfraSpecCard />
            </div>
          </div>

          {/* Right column: Scrolling steps */}
          <div>
            {steps.map((step, i) => {
              const Icon = step.icon;
              const active = activeStep === i;
              return (
                <div key={i} ref={setStepRef(i)} className="py-16 lg:py-20">
                  <div className="flex items-start gap-5">
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border transition-all duration-300"
                      style={
                        active
                          ? {
                              background: 'rgb(var(--accent-rgb) / 0.12)',
                              borderColor: 'rgb(var(--accent-rgb) / 0.35)',
                              boxShadow: '0 0 16px rgb(var(--accent-rgb) / 0.25)',
                            }
                          : {
                              background: 'rgb(var(--card-rgb) / 0.55)',
                              borderColor: 'rgb(var(--border-rgb) / 0.5)',
                            }
                      }
                    >
                      <Icon
                        size={24}
                        strokeWidth={1.5}
                        className={`transition-colors duration-300 ${
                          active ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--c-text-muted)]'
                        }`}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-[color:var(--c-text-muted)] font-mono">
                        Step {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`text-xl font-bold mt-1 mb-3 transition-colors duration-300 ${
                          active ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--c-text)]'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-base text-[color:var(--c-text-body)] leading-relaxed max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical layout */}
        <div className="lg:hidden">
          {/* LangGraph nodes — vertical stack */}
          <div className="space-y-0 mb-10 max-w-md mx-auto" data-animate="fade-up">
            {workflowNodes.map((node, i) => (
              <div key={node.id} ref={setNodeRefMobile(i)} className="flex flex-col items-stretch">
                <WorkflowNodeBox node={node} active={isNodeActive(node)} />
                {i < workflowNodes.length - 1 && <NodeArrow />}
              </div>
            ))}
          </div>

          {/* Vertical timeline steps */}
          <div className="relative pl-1">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const active = activeStep === i;
              return (
                <div
                  key={i}
                  ref={setStepRefMobile(i)}
                  className="relative flex items-start gap-4 pb-10 last:pb-0"
                  data-animate={
                    `fade-up-${i + 1}` as 'fade-up-1' | 'fade-up-2' | 'fade-up-3' | 'fade-up-4'
                  }
                >
                  {i < steps.length - 1 && (
                    <div className="absolute left-[23px] top-[52px] bottom-0 w-px border-l border-dashed border-[color:var(--color-border)]" />
                  )}
                  <div
                    className="relative z-10 flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300"
                    style={
                      active
                        ? {
                            background: 'rgb(var(--accent-rgb) / 0.15)',
                            borderColor: 'rgb(var(--accent-rgb) / 0.50)',
                            boxShadow: '0 0 18px rgb(var(--accent-rgb) / 0.30)',
                          }
                        : {
                            background: 'rgb(var(--card-rgb) / 0.7)',
                            borderColor: 'rgb(var(--border-rgb) / 0.6)',
                            boxShadow: '0 0 12px rgb(var(--accent-rgb) / 0.10)',
                          }
                    }
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className={`transition-colors duration-300 ${
                        active ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--c-text-body)]'
                      }`}
                    />
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[11px] font-semibold text-[color:var(--c-text-muted)] uppercase tracking-widest font-mono">
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`font-display text-lg font-bold mt-1 mb-1.5 transition-colors duration-300 ${
                        active ? 'text-[color:var(--color-accent)]' : 'text-[color:var(--c-text)]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-[color:var(--c-text-body)] leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Differentiation strip (mobile) */}
          <div className="mt-12 max-w-md mx-auto mb-3" data-animate="fade-up-1">
            <DifferentiationStrip />
          </div>

          {/* LangGraph Infra (mobile) */}
          <div className="max-w-md mx-auto" data-animate="scale-up">
            <InfraSpecCard />
          </div>
        </div>
      </div>
    </section>
  );
}
