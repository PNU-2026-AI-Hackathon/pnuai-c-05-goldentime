'use client';

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { FileUp, Brain, LayoutDashboard, Network, X, Check } from 'lucide-react';

const steps = [
  {
    icon: FileUp,
    title: 'EMR 업로드 · 비식별',
    desc: '텍스트·PDF·이미지·HWP·DOCX 등 여러 형식을 올리면, 성명·주민번호·전화·병록번호 같은 식별정보를 먼저 가립니다. 원문은 저장하지 않고 비식별본만 처리합니다.',
  },
  {
    icon: Brain,
    title: 'AI 분석',
    desc: '선택한 분과의 관점(가장 먼저 봐야 할 것·핵심 블록)으로 비식별 텍스트를 요약합니다. 검사값은 방향·속도가 드러나는 시계열로 정리하고, 각 문장은 원문 근거 구절을 인용합니다.',
  },
  {
    icon: LayoutDashboard,
    title: '결과 대시보드',
    desc: '원문과 요약을 나란히 보는 Split View로 반환합니다. 요약 문장을 클릭하면 원문 근거 위치로 이동·하이라이트되고, 인용이 확인되지 않은 문장은 표시되지 않습니다.',
  },
];

type WorkflowNode = {
  id: string;
  label: string;
  stepIndex: number;
  badges: string[];
};

const workflowNodes: WorkflowNode[] = [
  { id: 'input', label: '입력 파싱', stepIndex: 0, badges: ['텍스트·PDF·이미지·HWP·DOCX'] },
  { id: 'deid', label: '비식별 마스킹', stepIndex: 0, badges: ['성명·주민번호·전화·병록번호', '이중 마스킹'] },
  { id: 'chunk', label: '문서 청킹', stepIndex: 0, badges: ['청크별 인용 id'] },
  { id: 'summarize', label: '분과 관점 요약', stepIndex: 1, badges: ['분과 렌즈·cannotMiss', '시계열 추이'] },
  { id: 'enforce', label: '인용 검증', stepIndex: 2, badges: ['문장마다 원문 인용', '미인용 문장 제거'] },
  { id: 'respond', label: '결과 반환', stepIndex: 2, badges: ['원문↔요약 Split View'] },
];

const infraSpec = [
  { key: '입력', value: '멀티포맷 OCR' },
  { key: '비식별', value: 'regex 8종 마스킹' },
  { key: '청킹', value: '인용 id 부여' },
  { key: '요약', value: '분과별 렌즈' },
  { key: '인용', value: '문장마다 원문' },
  { key: '라벨', value: '원문·추론·불확실' },
  { key: '시계열', value: '값 추이 추적' },
  { key: '저장', value: '비식별본만' },
];

function WorkflowNodeBox({ node, active }: { node: WorkflowNode; active: boolean }) {
  return (
    <div
      className="w-full rounded-2xl px-4 py-3 border transition-all duration-300"
      style={
        active
          ? {
              background: 'rgba(24,74,255,0.12)',
              borderColor: 'rgba(24,74,255,0.45)',
              boxShadow:
                '0 0 24px rgba(24,74,255,0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
            }
          : {
              background: 'var(--color-card-bg)',
              borderColor: 'var(--color-border)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }
      }
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[12px] font-mono font-medium transition-colors duration-300 ${
            active ? 'text-[#4A6FFF]' : 'text-[color:var(--color-text-body)]'
          }`}
        >
          {node.label}
        </span>
        {active && (
          <span
            className="w-1.5 h-1.5 rounded-full animate-accent-pulse"
            style={{ background: '#184AFF', boxShadow: '0 0 8px #184AFF' }}
          />
        )}
      </div>
      {node.badges.length > 0 && (
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          {node.badges.map((b, bi) => (
            <span
              key={bi}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded-full transition-colors duration-300"
              style={
                active
                  ? {
                      color: '#4A6FFF',
                      background: 'rgba(24,74,255,0.10)',
                      border: '1px solid rgba(24,74,255,0.28)',
                    }
                  : {
                      color: 'var(--color-text-body)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
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
      <svg width="10" height="14" viewBox="0 0 10 14" fill="none" className="text-[color:var(--color-text-dim)]">
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
      className="rounded-3xl overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(24,74,255,0.14) 0%, rgba(24,74,255,0.04) 100%)',
        border: '1px solid rgba(24,74,255,0.32)',
        boxShadow:
          '0 0 28px rgba(24,74,255,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      }}
    >
      <div className="px-5 py-4 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <X size={14} className="text-[color:var(--color-text-dim)] flex-shrink-0" strokeWidth={2.25} />
          <span className="text-[12px] text-[color:var(--color-text-muted)] line-through">
            차트를 순서대로 요약하는 범용 LLM
          </span>
        </div>
        <div className="flex items-start gap-2.5">
          <Check
            size={14}
            className="text-[#4A6FFF] flex-shrink-0 mt-0.5"
            strokeWidth={2.25}
          />
          <div>
            <p className="text-sm text-[color:var(--color-text-primary)] font-semibold leading-snug">
              분과 관점으로 재정렬 · 시계열 추이 중심
            </p>
            <p className="text-[11px] text-[color:var(--color-text-muted)] font-mono mt-1">
              모든 문장 원문 인용 강제 · 미인용 문장 제거
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 기술 상세 아코디언 — 교수진 피드백: "기술적인 부분은 간소화하고, 궁금한 사람만 열어보게".
   지우는 게 아니라 접는다(양은 그대로 보존, 1층은 쉬운 말·2층은 원래 기술 내용). */
function TechDetails({ plain, children }: { plain: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="px-5 pb-5">
      <p className="text-[12.5px] leading-relaxed text-[color:var(--color-text-body)]">
        {plain}
      </p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-semibold"
        style={{ color: '#4A6FFF', fontFamily: 'var(--font-mono)' }}
      >
        {open ? '기술 상세 접기' : '기술 상세 보기'}
        <span style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>⌄</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function InfraSpecCard() {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.35), 0 0 28px rgba(24,74,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
      }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <Network size={13} className="text-[#4A6FFF]" strokeWidth={1.75} />
          <span className="text-[10px] font-medium uppercase tracking-[0.20em] text-[color:var(--color-text-body)] font-mono">
            Summarization Pipeline
          </span>
        </div>
        <span
          className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] rounded-full font-mono"
          style={{
            color: '#4A6FFF',
            background: 'rgba(24,74,255,0.12)',
            border: '1px solid rgba(24, 74, 255, 1)',
          }}
        >
          Ready
        </span>
      </div>

      <TechDetails plain="쉽게 말하면 — 이름·주민번호 같은 개인정보를 먼저 지우고, 차트를 조각으로 나눈 뒤, 요약한 문장마다 ‘원문 어디서 나왔는지’를 붙입니다. 근거를 못 붙인 문장은 화면에 내보내지 않습니다.">
      <div className="pb-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {infraSpec.map((item) => (
            <div key={item.key} className="flex flex-col">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-text-muted)] font-mono">
                {item.key}
              </span>
              <span className="text-[12px] font-mono font-medium text-[color:var(--color-text-primary)] mt-1">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <p className="text-xs text-[color:var(--color-text-muted)] text-center leading-relaxed font-light">
          비식별 → 청킹 → 분과 요약 → 인용 검증까지 단계가 분리된 파이프라인
        </p>
        <p className="text-[11px] text-[color:var(--color-text-muted)] text-center font-mono leading-relaxed pt-3 border-t border-[color:var(--color-border)]">
          처리 흐름 ·{' '}
          <span className="text-[#4A6FFF]">비식별</span>
          <span className="text-[color:var(--color-text-dim)]"> (1) </span>
          →{' '}
          <span className="text-[#4A6FFF]">분과 요약</span>
          <span className="text-[color:var(--color-text-dim)]"> (2) </span>
          →{' '}
          <span className="text-[#4A6FFF]">인용 검증</span>
          <span className="text-[color:var(--color-text-dim)]"> (3)</span>
        </p>
      </div>
      </TechDetails>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useScrollAnimation();
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefsMobile = useRef<(HTMLDivElement | null)[]>([]);

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
    // 데스크탑·모바일 step 둘 다 observe.
    // display:none element는 isIntersecting false라 자동 무시 → 충돌 X
    stepRefs.current.forEach(attach);
    stepRefsMobile.current.forEach(attach);
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const isNodeActive = (node: WorkflowNode) => node.stepIndex === activeStep;

  return (
    <section
      id="how-it-works"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: '#EAF1FF' }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          right: '-10%',
          width: '600px',
          height: '600px',
          background:
            'radial-gradient(circle, rgba(24,74,255,0.12) 0%, rgba(24,74,255,0) 65%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          left: '-8%',
          width: '500px',
          height: '500px',
          background:
            'radial-gradient(circle, rgba(74,111,255,0.10) 0%, rgba(74,111,255,0) 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div ref={sectionRef} className="relative mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            data-animate="fade-up"
            className="section-label inline-flex items-center gap-2 mb-5"
          >
            <span className="w-1 h-1 rounded-full bg-[#4A6FFF] shadow-[0_0_8px_#184AFF]" />
            Pipeline
          </span>
          <h2
            data-animate="fade-up"
            className="font-display text-[2.25rem] lg:text-[2.5rem] font-semibold tracking-[-0.025em] text-[color:var(--color-text-primary)] mb-4"
          >
            How It Works
          </h2>
          <p data-animate="fade-up-1" className="text-[color:var(--color-text-body)] text-[15px] font-light">
            데이터가 인사이트로 변하는 과정 — 비식별부터 인용 검증까지
          </p>
        </div>

        {/* Desktop: Sticky left + scrolling right */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column: Sticky pipeline diagram + spec */}
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

            {/* Differentiation strip — '범용 LLM X, 분과 관점 + 인용 강제' 강조 */}
            <div className="mb-3" data-animate="fade-up-1">
              <DifferentiationStrip />
            </div>

            {/* Summarization pipeline — spec card */}
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
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border transition-all duration-300"
                      style={
                        active
                          ? {
                              background: 'rgba(24,74,255,0.14)',
                              borderColor: 'rgba(24,74,255,0.35)',
                              boxShadow: '0 0 20px rgba(24,74,255,0.30)',
                            }
                          : {
                              background: 'var(--color-card-bg)',
                              borderColor: 'var(--color-border)',
                            }
                      }
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className={`transition-colors duration-300 ${
                          active ? 'text-[#4A6FFF]' : 'text-[color:var(--color-text-muted)]'
                        }`}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-medium uppercase tracking-[0.20em] text-[color:var(--color-text-muted)] font-mono">
                        Step {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3
                        className={`text-xl font-semibold mt-1.5 mb-3 tracking-[-0.01em] transition-colors duration-300 ${
                          active ? 'text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-body)]'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-[15px] text-[color:var(--color-text-body)] leading-[1.7] max-w-md font-light">
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
          {/* Pipeline nodes — vertical stack */}
          <div className="space-y-0 mb-10 max-w-md mx-auto" data-animate="fade-up">
            {workflowNodes.map((node, i) => (
              <div key={node.id} className="flex flex-col items-stretch">
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
                            background: 'rgba(24,74,255,0.15)',
                            borderColor: 'rgba(24,74,255,0.45)',
                            boxShadow: '0 0 22px rgba(24,74,255,0.35)',
                          }
                        : {
                            background: 'var(--color-card-bg)',
                            borderColor: 'var(--color-border)',
                            boxShadow: '0 0 14px rgba(24,74,255,0.08)',
                          }
                    }
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      className={`transition-colors duration-300 ${
                        active ? 'text-[#4A6FFF]' : 'text-[color:var(--color-text-body)]'
                      }`}
                    />
                  </div>
                  <div className="pt-0.5">
                    <span className="text-[10px] font-medium text-[color:var(--color-text-muted)] uppercase tracking-[0.20em] font-mono">
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3
                      className={`font-display text-lg font-semibold mt-1 mb-1.5 tracking-[-0.01em] transition-colors duration-300 ${
                        active ? 'text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-body)]'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-[color:var(--color-text-body)] leading-[1.7] font-light">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Differentiation strip (mobile) */}
          <div className="mt-12 max-w-md mx-auto mb-3" data-animate="fade-up-1">
            <DifferentiationStrip />
          </div>

          {/* Pipeline spec (mobile) */}
          <div className="max-w-md mx-auto" data-animate="scale-up">
            <InfraSpecCard />
          </div>
        </div>
      </div>
    </section>
  );
}