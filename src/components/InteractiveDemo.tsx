'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Loader2,
  FileText,
  Search,
  ZoomIn,
  Share2,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { patients } from '@/data/patients';
import { callN8NWebhook } from '@/lib/api';
import type {
  Patient,
  PatientTimelineSummary,
  PrimaryConcern,
  TimelineEvent,
  N8NResponse,
  WorkflowStep,
  CaseCategory,
} from '@/types';

/* ════════════════════════════════════════════════════════════════
   DESIGN TOKENS — Soft UI · Glassmorphism · Neumorphism (Light Blue)
   ════════════════════════════════════════════════════════════════ */
const ui = {
  /* page atmosphere */
  pageBg:
    'radial-gradient(1200px 600px at 20% -10%, #f3f7ff 0%, rgba(243,247,255,0) 60%), radial-gradient(1000px 500px at 100% 0%, #e2ecff 0%, rgba(226,236,255,0) 55%), linear-gradient(180deg, #eaf1ff 0%, #dde9ff 55%, #eef4ff 100%)',

  /* glass white card */
  card: 'rgba(255,255,255,0.72)',
  cardBorder: '1px solid rgba(255,255,255,0.9)',
  blur: 'blur(16px)',

  /* soft shadows */
  shadowRest:
    '0 14px 34px -16px rgba(56,103,214,0.30), 0 2px 6px rgba(56,103,214,0.05)',
  shadowHover:
    '0 26px 50px -18px rgba(56,103,214,0.42), 0 6px 14px rgba(56,103,214,0.08)',
  shadowSoft: '0 16px 40px -18px rgba(56,103,214,0.26)',

  /* neumorphism */
  neuRaised:
    '7px 7px 18px rgba(163,184,225,0.50), -7px -7px 18px rgba(255,255,255,0.95)',
  neuInset:
    'inset 5px 5px 12px rgba(163,184,225,0.45), inset -5px -5px 12px rgba(255,255,255,0.92)',
  neuInsetSm:
    'inset 3px 3px 7px rgba(163,184,225,0.40), inset -3px -3px 7px rgba(255,255,255,0.9)',

  /* blue gradient CTA */
  cta: 'linear-gradient(135deg, #6aa0ff 0%, #2f6bff 52%, #1d4fff 100%)',
  ctaShadow:
    '0 14px 28px -8px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.45)',

  divider: 'rgba(148,163,184,0.22)',
  accent: '#2563ff',
  accentSoft: '#3b82f6',
};

const transition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const };

/* ─── Workflow steps reflect the real de-id → summary → citation pipeline ─── */
const initialSteps: WorkflowStep[] = [
  { label: '비식별 마스킹 (성명·주민번호·전화·병록번호 등)', status: 'pending' },
  { label: 'EMR 텍스트 청킹 (청크별 인용 id 부여)', status: 'pending' },
  { label: '분과 관점 요약 (렌즈·cannotMiss·시계열 추이)', status: 'pending' },
  { label: '문장별 원문 인용 검증 (미인용 문장 제거)', status: 'pending' },
  { label: 'JSON 구조화 및 Split View 반환', status: 'pending' },
];

/* ─── Pick 3 patients with category diversity ─── */
function pickThree(exclude: string[]): Patient[] {
  let pool = patients.filter((p) => !exclude.includes(p.id));
  if (pool.length < 3) pool = patients;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/* ─── Reusable button styles ─── */
function PrimaryButton({
  children,
  disabled,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${className}`}
      style={{
        background: ui.cta,
        boxShadow: disabled ? '0 4px 12px -6px rgba(37,99,235,0.35)' : ui.ctaShadow,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:text-[#2563ff] ${className}`}
      style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 8px 20px -12px rgba(56,103,214,0.45)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </button>
  );
}

/* ─── Glass card shell ─── */
function glassStyle(extraShadow?: string): React.CSSProperties {
  return {
    background: ui.card,
    border: ui.cardBorder,
    boxShadow: extraShadow ?? ui.shadowRest,
    backdropFilter: ui.blur,
  };
}

/* ─── AI Patient Generator UI ─── */
function AiPatientGenerator({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const genSteps = [
    'Demographics generated',
    'Longitudinal records synthesized',
    'Abbreviation patterns injected',
    'Clinical notes rendering',
  ];
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      setCompletedSteps(Math.min(Math.floor(p * 4.5), 4));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(onComplete, 300);
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <div className="rounded-3xl p-7 max-w-lg mx-auto" style={glassStyle(ui.shadowSoft)}>
      <div className="flex items-center gap-2 mb-4">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-xl text-sm text-white"
          style={{ background: ui.cta, boxShadow: '0 6px 14px -6px rgba(37,99,235,0.6)' }}
        >
          ⚕
        </span>
        <span className="font-display text-sm font-semibold text-slate-800">
          AI 기반 시계열 환자 생성기
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Generating synthetic multi-visit patient record...
      </p>

      <div
        className="h-3 rounded-full mb-5 overflow-hidden"
        style={{ background: '#e3ecfb', boxShadow: ui.neuInsetSm }}
      >
        <div
          className="h-full rounded-full transition-all duration-100 ease-out"
          style={{
            width: `${progress}%`,
            background: ui.cta,
            boxShadow: '0 0 14px rgba(47,107,255,0.45)',
          }}
        />
      </div>

      <div className="space-y-2.5 mb-5">
        {genSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            {i < completedSteps ? (
              <span className="text-[#10b981] font-bold">✓</span>
            ) : i === completedSteps ? (
              <span className="text-[#2563ff] animate-accent-pulse font-bold">◉</span>
            ) : (
              <span className="text-slate-300">○</span>
            )}
            <span className={i <= completedSteps ? 'text-slate-600' : 'text-slate-400'}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-slate-400 font-mono">
        AI로 생성 · 시계열 합성 엔진
      </p>
    </div>
  );
}

/* ─── Case category visual config (light theme) ─── */
const categoryConfig: Record<
  CaseCategory,
  { label: string; dot: string; bg: string; hoverBg: string; border: string; glow: string; text: string }
> = {
  chronic: {
    label: '만성질환',
    dot: '#3b6fff',
    bg: 'rgba(59,111,255,0.10)',
    hoverBg: 'rgba(59,111,255,0.06)',
    border: 'rgba(59,111,255,0.40)',
    glow: '0 0 0 1.5px rgba(59,111,255,0.40), 0 20px 40px -14px rgba(59,111,255,0.45)',
    text: '#2456e6',
  },
  multidrug: {
    label: '다약제',
    dot: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    hoverBg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.45)',
    glow: '0 0 0 1.5px rgba(245,158,11,0.45), 0 20px 40px -14px rgba(245,158,11,0.42)',
    text: '#b45309',
  },
  multispec: {
    label: '다분과 협진',
    dot: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    hoverBg: 'rgba(139,92,246,0.07)',
    border: 'rgba(139,92,246,0.42)',
    glow: '0 0 0 1.5px rgba(139,92,246,0.42), 0 20px 40px -14px rgba(139,92,246,0.42)',
    text: '#6d28d9',
  },
  postop: {
    label: '수술 후 추적',
    dot: '#fb7185',
    bg: 'rgba(244,63,94,0.10)',
    hoverBg: 'rgba(244,63,94,0.06)',
    border: 'rgba(244,63,94,0.40)',
    glow: '0 0 0 1.5px rgba(244,63,94,0.40), 0 20px 40px -14px rgba(244,63,94,0.42)',
    text: '#e11d48',
  },
  oncology: {
    label: '종양 추적',
    dot: '#ec4899',
    bg: 'rgba(236,72,153,0.10)',
    hoverBg: 'rgba(236,72,153,0.06)',
    border: 'rgba(236,72,153,0.40)',
    glow: '0 0 0 1.5px rgba(236,72,153,0.40), 0 20px 40px -14px rgba(236,72,153,0.42)',
    text: '#be185d',
  },
  observation: {
    label: '일반 외래',
    dot: '#10b981',
    bg: 'rgba(16,185,129,0.10)',
    hoverBg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.40)',
    glow: '0 0 0 1.5px rgba(16,185,129,0.40), 0 20px 40px -14px rgba(16,185,129,0.40)',
    text: '#047857',
  },
};

const restShadow = ui.shadowRest;
const hoverShadow = ui.shadowHover;

/* ─── Patient Card — Option B interaction (per project memory) ─── */
function PatientCard({
  patient,
  selected,
  onClick,
}: {
  patient: Patient;
  selected: boolean;
  onClick: () => void;
}) {
  const cat = categoryConfig[patient.caseCategory];
  const strongerGlow = cat.glow.replace('0.45)', '0.60)').replace('0.42)', '0.58)').replace('0.40)', '0.56)');

  return (
    <motion.button
      onClick={onClick}
      initial={false}
      animate={{
        y: selected ? -4 : 0,
        boxShadow: selected ? cat.glow : restShadow,
        borderColor: selected ? cat.border : 'rgba(255,255,255,0.9)',
        backgroundColor: selected ? cat.bg : 'rgba(255,255,255,0.78)',
      }}
      whileHover={
        selected
          ? {
              // 선택된 카드도 hover 시 lift — 미선택과 같은 방향(위)으로
              y: -6,
              boxShadow: strongerGlow,
            }
          : {
              y: -4,
              boxShadow: hoverShadow,
              borderColor: 'rgba(255,255,255,1)',
              backgroundColor: cat.hoverBg,
            }
      }
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="w-full text-left p-5 rounded-3xl cursor-pointer min-w-[260px] snap-center flex-shrink-0 md:min-w-0 md:flex-shrink relative overflow-hidden border"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono mb-3"
        style={{ color: cat.text, background: cat.bg, border: `1px solid ${cat.border}` }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: cat.dot, boxShadow: `0 0 6px ${cat.dot}` }}
        />
        {cat.label}
      </span>
      <h4 className="font-display text-base font-semibold text-slate-800">
        {patient.demographics}
      </h4>
      <p className="text-sm text-slate-600 mt-1">{patient.caseSummary}</p>
      <p className="text-[11px] text-slate-400 mt-3 font-mono">
        {patient.expectedResult.timeline.length}회 차수 · 약어{' '}
        {patient.expectedResult.abbreviations.length}건
      </p>
    </motion.button>
  );
}

/* ─── Workflow progress ─── */
function WorkflowProgress({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="space-y-3 py-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          {step.status === 'completed' && (
            <span
              className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
              style={{
                background: 'rgba(16,185,129,0.14)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.35)',
              }}
            >
              ✓
            </span>
          )}
          {step.status === 'in_progress' && (
            <span
              className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold animate-accent-pulse flex-shrink-0 text-white"
              style={{
                background: ui.cta,
                boxShadow: '0 0 14px rgba(47,107,255,0.55)',
              }}
            >
              ◉
            </span>
          )}
          {step.status === 'pending' && (
            <span
              className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs flex-shrink-0"
              style={{
                background: '#eef3fb',
                color: '#94a3b8',
                boxShadow: ui.neuInsetSm,
              }}
            >
              ○
            </span>
          )}
          <span className={`text-sm ${step.status === 'pending' ? 'text-slate-400' : 'text-slate-700'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── EMR Viewer ─── */
function EMRViewer({ patient }: { patient: Patient }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomLevel, setZoomLevel] = useState<0 | 1 | 2>(0);

  const zoomClass = (['text-xs', 'text-sm', 'text-base'] as const)[zoomLevel];

  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matchCount =
    searchTerm.trim().length > 0
      ? (patient.emrText.match(new RegExp(escapedTerm, 'gi')) || []).length
      : 0;

  const renderedText = !searchTerm.trim()
    ? patient.emrText
    : patient.emrText.split(new RegExp(`(${escapedTerm})`, 'gi')).map((part, i) =>
        part && part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={i}
            style={{
              background: 'rgba(37,99,235,0.18)',
              color: '#1d4ed8',
              padding: '0 2px',
              borderRadius: '3px',
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      );

  return (
    <div className="rounded-3xl overflow-hidden min-h-[640px] flex flex-col" style={glassStyle()}>
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'rgba(255,255,255,0.5)', borderColor: ui.divider }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-slate-400 flex-shrink-0" strokeWidth={1.75} />
          <span className="text-xs font-medium text-slate-600 truncate">
            {patient.demographics} · {patient.caseSummary}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="EMR 텍스트 검색"
            aria-pressed={searchOpen}
            className="flex h-7 w-7 items-center justify-center rounded-xl transition-all"
            style={
              searchOpen
                ? { background: 'rgba(37,99,235,0.12)', color: '#2563ff', boxShadow: ui.neuInsetSm }
                : { color: '#94a3b8' }
            }
          >
            <Search size={14} strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => ((z + 1) % 3) as 0 | 1 | 2)}
            aria-label={`글자 크기 변경 (현재 ${zoomLevel + 1}/3)`}
            className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:text-[#2563ff] transition-colors"
          >
            <ZoomIn size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="px-4 py-2 border-b" style={{ borderColor: ui.divider, background: 'rgba(255,255,255,0.45)' }}>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-1.5"
            style={{ background: '#eef3fb', boxShadow: ui.neuInsetSm }}
          >
            <Search size={12} className="text-slate-400 flex-shrink-0" strokeWidth={1.75} />
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="EMR 텍스트 검색..."
              className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none"
            />
            {searchTerm && (
              <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{matchCount}건</span>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <pre className={`${zoomClass} leading-[1.7] text-slate-600 whitespace-pre-wrap font-body`}>
          {renderedText}
        </pre>
        <div className="mt-6 pt-4 border-t" style={{ borderColor: ui.divider }}>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest font-mono">
            비식별 마스킹 → 문서 청킹 → 청크별 인용 id 부여
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Chunk citation chip ─── */
function ChunkChip({ id }: { id: string }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono rounded-md"
      style={{
        background: 'rgba(37,99,235,0.08)',
        border: '1px solid rgba(37,99,235,0.22)',
        color: '#1d4ed8',
      }}
      title="원문 인용 청크 ID"
    >
      {id}
    </span>
  );
}

/* ─── Primary Concern (주요 질환) ─── */
function PrimaryConcernCard({ concern }: { concern: PrimaryConcern }) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(106,160,255,0.16) 0%, rgba(255,255,255,0.55) 100%)',
        border: '1px solid rgba(47,107,255,0.30)',
        boxShadow: '0 18px 40px -18px rgba(47,107,255,0.40)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* accent glow blob */}
      <div
        className="absolute -top-12 -right-12 w-36 h-36 rounded-full pointer-events-none opacity-60 blur-2xl"
        style={{ background: 'rgba(106,160,255,0.45)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} className="text-[#2563ff]" strokeWidth={2.25} fill="#2563ff" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2456e6] font-mono">
            주요 질환 (Primary Concern)
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-slate-800 mb-2 tracking-tight">
          {concern.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{concern.summary}</p>

        <div className="border-t pt-3" style={{ borderColor: 'rgba(47,107,255,0.18)' }}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono">
            Key Trends
          </span>
          <ul className="mt-2.5 space-y-2">
            {concern.key_trends.map((t, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2.5 leading-relaxed">
                <span
                  className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#2563ff', boxShadow: '0 0 6px rgba(37,99,235,0.6)' }}
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ─── Horizontal swimlane timeline ─── */
function compareDates(a: string, b: string): number {
  const aa = a.split('-')[0].trim();
  const bb = b.split('-')[0].trim();
  return aa.localeCompare(bb);
}

function shortLabel(event: string, max = 18): string {
  const cut = event.split(/[·,—\-]|, /)[0];
  return cut.length > max ? cut.slice(0, max).trim() + '…' : cut;
}

function HorizontalTimeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => compareDates(a.date, b.date));
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div>
      <div className="overflow-x-auto -mx-5 px-5 pb-3">
        <div
          className="relative pt-36 pb-36"
          style={{ minWidth: `${Math.max(sorted.length * 110, 600)}px` }}
        >
          {/* axis line */}
          <div
            className="absolute left-0 right-7 top-1/2 -translate-y-1/2 h-[3px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(59,130,246,0.30) 0%, rgba(37,99,235,0.75) 100%)',
            }}
          />
          {/* arrow head */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '10px solid rgba(37,99,235,0.75)',
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
            }}
          />

          {/* event columns */}
          <div className="relative flex">
            {sorted.map((ev, i) => {
              const isPrimary = ev.layer === 'primary';
              const isHov = hovered === i;
              return (
                <div
                  key={`${ev.date}-${i}`}
                  className="flex-1 relative flex items-center justify-center"
                  style={{ minWidth: '110px', height: '6px' }}
                >
                  {/* connector line (dot ↔ label) */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-px"
                    style={{
                      top: isPrimary ? '-86px' : '6px',
                      height: '86px',
                      background: isPrimary ? 'rgba(37,99,235,0.30)' : 'rgba(245,158,11,0.35)',
                    }}
                  />

                  {/* date + short label */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 text-center px-1 cursor-pointer ${
                      isPrimary ? 'bottom-full mb-[88px]' : 'top-full mt-[88px]'
                    }`}
                    style={{ minWidth: '92px' }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setHovered((prev) => (prev === i ? null : i))}
                  >
                    <div
                      className="text-[10px] font-mono font-bold whitespace-nowrap"
                      style={{ color: isPrimary ? '#2563ff' : '#d97706' }}
                    >
                      {ev.date}
                    </div>
                    {isPrimary ? (
                      <div className="text-[10px] mt-0.5 leading-tight text-slate-600">
                        {shortLabel(ev.event, 16)}
                      </div>
                    ) : (
                      <div className="text-[9px] mt-0.5 text-slate-400 italic">[부수]</div>
                    )}
                  </div>

                  {/* dot at axis */}
                  <motion.div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setHovered((prev) => (prev === i ? null : i))}
                    animate={{ scale: isHov ? 1.3 : 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div
                      className={`rounded-full ${isPrimary ? 'w-4 h-4' : 'w-2.5 h-2.5'}`}
                      style={{
                        background: isPrimary ? '#2563ff' : '#f59e0b',
                        border: '2px solid rgba(255,255,255,0.9)',
                        boxShadow: isHov
                          ? `0 0 16px ${isPrimary ? '#2563ff' : '#f59e0b'}`
                          : `0 4px 10px ${isPrimary ? 'rgba(37,99,235,0.45)' : 'rgba(245,158,11,0.45)'}`,
                      }}
                    />
                  </motion.div>

                  {/* hover popover */}
                  <AnimatePresence>
                    {isHov && (
                      <motion.div
                        initial={{ opacity: 0, y: isPrimary ? 6 : -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: isPrimary ? 6 : -6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none ${
                          isPrimary ? 'bottom-full mb-2' : 'top-full mt-2'
                        }`}
                        style={{ width: '240px' }}
                      >
                        <div
                          className="rounded-2xl p-3"
                          style={{
                            background: 'rgba(255,255,255,0.92)',
                            border: `1px solid ${
                              isPrimary ? 'rgba(37,99,235,0.35)' : 'rgba(245,158,11,0.40)'
                            }`,
                            boxShadow: `0 18px 40px -14px rgba(56,103,214,0.45), 0 0 0 1px rgba(255,255,255,0.6)`,
                            backdropFilter: 'blur(12px)',
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-bold uppercase tracking-widest font-mono"
                              style={{ color: isPrimary ? '#2456e6' : '#b45309' }}
                            >
                              {isPrimary ? '주요 · Primary' : '부수 · Incidental'}
                            </span>
                            <ChunkChip id={ev.sourceChunkId} />
                          </div>
                          <div className="text-[11px] font-mono font-bold text-slate-400 mb-1">
                            {ev.date}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed">{ev.event}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* legend */}
      <div className="flex items-center justify-end gap-3 text-[10px] font-mono mt-2 pr-1">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: '#2563ff', boxShadow: '0 0 6px rgba(37,99,235,0.6)' }}
          />
          <span className="text-slate-500">주요 (always shown)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: '#f59e0b', boxShadow: '0 0 6px rgba(245,158,11,0.6)' }}
          />
          <span className="text-slate-500">부수 (hover)</span>
        </div>
      </div>
    </div>
  );
}


/* ─── 검사 추이 스파크라인 ───
   의사가 차트에서 실제로 보는 건 "지금 AST 27"이 아니라 "22→58→26→27로 튀었다 돌아왔다"다.
   [규율] 값은 데이터(lab_series)에 있는 것만 그린다 — 보간·추정 없음. 정상범위를 넘은
   시점은 색으로 구분하고, 그 시점의 임상 해석은 원문에 있던 표현만 붙인다. */
function LabSparkline({ series }: { series: import('@/types').LabSeries }) {
  const pts = series.points;
  if (pts.length < 2) return null;
  const vals = pts.map((p) => p.value);
  const hi = Math.max(...vals, series.refHigh ?? -Infinity);
  const lo = Math.min(...vals, series.refLow ?? Infinity);
  const pad = (hi - lo) * 0.18 || 1;
  const top = hi + pad, bot = lo - pad;
  const W = 100, H = 34;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  const y = (v: number) => H - ((v - bot) / (top - bot)) * H;
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const abnormal = (v: number) =>
    (series.refHigh !== undefined && v > series.refHigh) || (series.refLow !== undefined && v < series.refLow);
  const last = pts[pts.length - 1];
  const first = pts[0];
  const dir = last.value === first.value ? '유지' : last.value > first.value ? '상승' : '하락';

  return (
    <div className="rounded-2xl p-3" style={{ background: '#eef3fb', boxShadow: ui.neuInsetSm }}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 font-mono">
          {series.name}{series.unit ? ` (${series.unit})` : ''}
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          {first.value} → {last.value} · {dir}
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1.5 h-[38px] w-full" preserveAspectRatio="none" aria-hidden>
        {/* 정상범위 밴드 — 넘었는지 한눈에 */}
        {series.refHigh !== undefined && (
          <rect x="0" y={y(series.refHigh)} width={W} height={Math.max(0, H - y(series.refHigh))}
            fill="rgba(16,185,129,0.10)" />
        )}
        {series.refLow !== undefined && (
          <rect x="0" y="0" width={W} height={Math.max(0, y(series.refLow))} fill="rgba(16,185,129,0.10)" />
        )}
        <path d={path} fill="none" stroke="#2563ff" strokeWidth="1.6" vectorEffect="non-scaling-stroke"
          strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={x(i)} cy={y(p.value)} r="2.2" vectorEffect="non-scaling-stroke"
            fill={abnormal(p.value) ? '#e11d48' : '#2563ff'} />
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
        {pts.map((p, i) => (
          <span key={i} className="text-[9.5px] font-mono" style={{ color: abnormal(p.value) ? '#e11d48' : '#64748b' }}>
            {p.date.slice(5)} {p.value}
          </span>
        ))}
      </div>
      {last.note && <div className="mt-1 text-[10.5px] text-slate-500">{last.note}</div>}
    </div>
  );
}

/* ─── Timeline Summary Card ─── */
function TimelineSummaryCard({
  patient,
  data,
  analysisTime,
}: {
  patient: Patient;
  data: PatientTimelineSummary;
  analysisTime: number;
}) {
  const cat = categoryConfig[patient.caseCategory];
  const { displayed, done } = useTypingEffect(data.case_summary, 25, true);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      // clipboard 권한 X / non-secure context — silent
    }
  };

  return (
    <div
      className="rounded-3xl overflow-hidden min-h-[640px] flex flex-col"
      style={glassStyle('0 22px 50px -20px rgba(47,107,255,0.30)')}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: ui.divider }}>
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono"
          style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.border}` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: cat.dot, boxShadow: `0 0 6px ${cat.dot}` }}
          />
          {cat.label}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">Analysis: {analysisTime.toFixed(1)}s</span>
          {shareCopied ? (
            <span className="text-[10px] text-[#2563ff] font-mono whitespace-nowrap">URL 복사됨</span>
          ) : (
            <button
              onClick={handleShare}
              className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 hover:text-[#2563ff] transition-colors"
              aria-label="현재 페이지 URL 복사"
            >
              <Share2 size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Patient label */}
        <div>
          <h3 className="font-display text-lg font-semibold text-slate-800">{data.patient_label}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            {displayed}
            {!done && (
              <span
                className="inline-block w-px h-4 ml-0.5 align-middle"
                style={{
                  background: '#2563ff',
                  boxShadow: '0 0 6px rgba(37,99,235,0.7)',
                  animation: 'blink-cursor 0.8s infinite',
                }}
              />
            )}
          </p>
        </div>

        {/* ⭐ PRIMARY CONCERN — 최상단 강조 */}
        <PrimaryConcernCard concern={data.primary_concern} />

        {/* Horizontal swimlane timeline */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#2563ff] mb-2 font-mono">
            타임라인 (가로축: 시간 / 위: 주요, 아래: 부수 호버)
          </p>
          <HorizontalTimeline events={data.timeline} />
        </div>

        {/* Current state */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#2563ff] mb-3 font-mono">
            현재 상태
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                주요 진단
              </p>
              <ul className="space-y-1">
                {data.current_state.diagnoses.map((dx, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-[#2563ff] mt-1 opacity-70">•</span>
                    {dx}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                현재 호소
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{data.current_state.complaint}</p>
            </div>
            {/* 검사 추이 — "지금 값"보다 먼저 온다. 추이 데이터가 없는 케이스는 표시하지 않고,
                대신 아래 '최근 검사'만 남는다(없는 걸 만들어 그리지 않는다). */}
            {data.lab_series && data.lab_series.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                  검사 추이
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {data.lab_series.map((ls) => <LabSparkline key={ls.name} series={ls} />)}
                </div>
              </div>
            )}

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                최근 검사
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(data.current_state.recent_labs).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-2xl p-2.5"
                    style={{ background: '#eef3fb', boxShadow: ui.neuInsetSm }}
                  >
                    <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 font-mono">
                      {k}
                    </div>
                    <div className="text-sm font-bold mt-0.5 tabular-nums font-mono text-slate-800">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
                복약 중
              </p>
              <ul className="space-y-1">
                {data.current_state.medications.map((m, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-[#2563ff] mt-1 opacity-70">•</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Resolved past issues */}
        {data.resolved_issues.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#2563ff] mb-3 font-mono">
              해결된 과거 이슈
            </p>
            <div className="space-y-2.5">
              {data.resolved_issues.map((iss, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl"
                  style={{
                    background: 'rgba(16,185,129,0.08)',
                    borderLeft: '3px solid rgba(16,185,129,0.55)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-sm font-semibold text-slate-800">{iss.issue}</h5>
                    <ChunkChip id={iss.sourceChunkId} />
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{iss.duration}</p>
                  {iss.note && (
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{iss.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abbreviation resolution */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#2563ff] mb-3 font-mono">
            약어 및 은어 풀이 (미확인 시 원문 유지)
          </p>
          <div className="space-y-1.5">
            {data.abbreviations.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-2xl"
                style={
                  a.status === 'resolved'
                    ? { background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.20)' }
                    : { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.32)' }
                }
              >
                {a.status === 'resolved' ? (
                  <CheckCircle2 size={14} className="text-[#2563ff] flex-shrink-0" strokeWidth={2} />
                ) : (
                  <AlertCircle size={14} className="text-[#d97706] flex-shrink-0" strokeWidth={2} />
                )}
                <code
                  className="text-xs font-mono font-bold flex-shrink-0"
                  style={{ color: a.status === 'resolved' ? '#1d4ed8' : '#b45309' }}
                >
                  {a.abbrev}
                </code>
                <span className="text-slate-300">→</span>
                {a.status === 'resolved' ? (
                  <span className="text-xs text-slate-600">{a.expansion}</span>
                ) : (
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-[#b45309] font-medium">
                      미등재 · 원문 유지
                    </span>
                    <span className="text-[10px] text-[#d97706] opacity-90 italic">
                      &quot;은어 추정&quot; 확인 바람
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t" style={{ borderColor: ui.divider }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-slate-400 font-mono">
            원문 인용 {data.citations_count}건 부착 · 문장마다 근거 청크 인용
          </span>
        </div>
        <PrimaryButton className="w-full">
          전문의 승인 및 차트 전송 <ArrowRight size={14} strokeWidth={1.75} />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ─── Error ─── */
function ErrorDisplay({ error, message }: { error: string; message?: string }) {
  const msgs: Record<string, string> = {
    EMR_EMPTY: 'EMR 텍스트를 읽을 수 없습니다.',
    JSON_PARSE_FAILED: 'LLM 응답을 구조화할 수 없습니다.',
    TIMEOUT: '처리 시간이 초과되었습니다.',
    LLM_ERROR: 'AI 분석 중 오류가 발생했습니다.',
  };
  return (
    <div
      className="rounded-3xl p-8 text-center"
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(244,63,94,0.30)',
        boxShadow: '0 18px 40px -18px rgba(244,63,94,0.30)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="text-sm text-slate-700 font-medium">
        {msgs[error] || message || '오류가 발생했습니다.'}
      </p>
    </div>
  );
}

/* ─── Split View ─── */
function SplitViewResult({
  patient,
  data,
  analysisTime,
}: {
  patient: Patient;
  data: PatientTimelineSummary;
  analysisTime: number;
}) {
  const [tab, setTab] = useState<'original' | 'summary'>('summary');
  return (
    <>
      <div
        className="lg:hidden flex rounded-2xl p-1.5 mb-4"
        style={{ background: '#e6eefb', boxShadow: ui.neuInset }}
      >
        {(['original', 'summary'] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                active ? 'text-[#2563ff]' : 'text-slate-400'
              }`}
              style={
                active
                  ? { background: 'rgba(255,255,255,0.95)', boxShadow: ui.neuRaised }
                  : undefined
              }
            >
              {t === 'original' ? '원본 EMR' : '시계열 요약'}
            </button>
          );
        })}
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 gap-5">
        <EMRViewer patient={patient} />
        <TimelineSummaryCard patient={patient} data={data} analysisTime={analysisTime} />
      </div>
      <div className="lg:hidden">
        {tab === 'original' ? (
          <EMRViewer patient={patient} />
        ) : (
          <TimelineSummaryCard patient={patient} data={data} analysisTime={analysisTime} />
        )}
      </div>
    </>
  );
}

/* ─── Main ─── */
export default function InteractiveDemo() {
  const ref = useScrollAnimation();
  const [displayedPatients, setDisplayedPatients] = useState<Patient[]>([]);
  const [usedIds, setUsedIds] = useState<string[]>([]);

  useEffect(() => {
    const initial = pickThree([]);
    setDisplayedPatients(initial);
    setUsedIds(initial.map((p) => p.id));
  }, []);

  const [selected, setSelected] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<N8NResponse | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [analysisTime, setAnalysisTime] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [generating, setGenerating] = useState(false);

  const simulateWorkflow = useCallback(async () => {
    const delays = [300, 500, 600, 800, 400];
    for (let i = 0; i < initialSteps.length; i++) {
      setSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? 'completed' : idx === i ? 'in_progress' : 'pending',
        })),
      );
      await new Promise((r) => setTimeout(r, delays[i]));
    }
    setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' as const })));
  }, []);

  const handleRun = async () => {
    if (!selected || loading) return;
    setLoading(true);
    setResult(null);
    setShowResult(false);
    setSteps(initialSteps);
    const t0 = Date.now();
    const [response] = await Promise.all([
      callN8NWebhook(
        selected.emrText,
        selected.fileName || `${selected.id}.pdf`,
        selected.expectedResult,
      ),
      simulateWorkflow(),
    ]);
    setAnalysisTime((Date.now() - t0) / 1000);
    setResult(response);
    setLoading(false);
    setTimeout(() => setShowResult(true), 200);
  };

  const handleReset = () => {
    setSelected(null);
    setResult(null);
    setShowResult(false);
    setSteps(initialSteps);
    setLoading(false);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setSelected(null);
  };

  const handleGenerateComplete = useCallback(() => {
    const newThree = pickThree(usedIds.length >= patients.length - 2 ? [] : usedIds);
    setDisplayedPatients(newThree);
    setUsedIds((prev) => [...prev, ...newThree.map((p) => p.id)]);
    setGenerating(false);
  }, [usedIds]);

  return (
    <section id="demo" className="relative py-20 lg:py-28" style={{ background: ui.pageBg }}>
      {/* soft decorative blobs for atmosphere */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, rgba(106,160,255,0.35) 0%, rgba(106,160,255,0) 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.4) 0%, rgba(147,197,253,0) 70%)' }}
      />

      <div ref={ref} className="relative mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4"
          data-animate="fade-up"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono"
              style={{
                color: '#2456e6',
                background: 'rgba(37,99,235,0.10)',
                border: '1px solid rgba(37,99,235,0.28)',
              }}
            >
              AI 생성
            </span>
            <h2 className="font-display text-[2rem] font-bold tracking-[-0.02em] text-slate-800">
              Interactive Demo
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {!loading && !result && !generating && (
              <GhostButton onClick={handleGenerate}>
                <RefreshCw size={14} strokeWidth={1.75} /> 새 환자 생성
              </GhostButton>
            )}
            {(result || loading) && (
              <GhostButton onClick={handleReset}>
                <RotateCcw size={14} strokeWidth={1.75} /> 다시 선택
              </GhostButton>
            )}
            <PrimaryButton onClick={handleRun} disabled={!selected || loading || generating}>
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" strokeWidth={1.75} /> 시계열 요약 생성 중...
                </>
              ) : selected ? (
                <>
                  <Play size={14} strokeWidth={1.75} />
                  시계열 요약 실행
                  <span
                    className="w-2 h-2 rounded-full ml-1"
                    style={{
                      background: '#fff',
                      boxShadow: `0 0 8px rgba(255,255,255,0.9)`,
                    }}
                  />
                </>
              ) : (
                <>
                  <Play size={14} strokeWidth={1.75} /> 환자를 선택하세요
                </>
              )}
            </PrimaryButton>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-10" data-animate="fade-up-1">
          AI로 생성된 가상 환자 데이터입니다. 실제 환자 정보가 아닙니다.
        </p>

        <AnimatePresence mode="wait">
          {/* AI Patient Generator */}
          {generating && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <AiPatientGenerator onComplete={handleGenerateComplete} />
            </motion.div>
          )}

          {/* Patient cards */}
          {!loading && !result && !generating && (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={transition}
            >
              <div className="hidden md:grid md:grid-cols-3 gap-5 mb-8">
                {displayedPatients.map((p) => (
                  <PatientCard
                    key={p.id}
                    patient={p}
                    selected={selected?.id === p.id}
                    onClick={() => setSelected((prev) => (prev?.id === p.id ? null : p))}
                  />
                ))}
              </div>
              <div className="md:hidden mb-8">
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pt-3 pb-4 -mx-5 px-5">
                  {displayedPatients.map((p) => (
                    <PatientCard
                      key={p.id}
                      patient={p}
                      selected={selected?.id === p.id}
                      onClick={() => setSelected((prev) => (prev?.id === p.id ? null : p))}
                    />
                  ))}
                </div>
                <div className="flex justify-center gap-1.5 mt-2">
                  {displayedPatients.map((p) => (
                    <div
                      key={p.id}
                      className="w-1.5 h-1.5 rounded-full transition-colors"
                      style={{
                        background: selected?.id === p.id ? '#2563ff' : '#cbd5e1',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Workflow */}
          {loading && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="rounded-3xl p-6 mb-6"
              style={glassStyle(ui.shadowSoft)}
            >
              <h3 className="font-display text-sm font-semibold text-[#2563ff] mb-2 uppercase tracking-widest font-mono">
                비식별 → 요약 → 인용 검증 파이프라인
              </h3>
              <WorkflowProgress steps={steps} />
            </motion.div>
          )}

          {/* Result */}
          {showResult && result && selected && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={transition}
            >
              {result.success && result.data ? (
                <SplitViewResult patient={selected} data={result.data} analysisTime={analysisTime} />
              ) : (
                <ErrorDisplay error={result.error || 'UNKNOWN'} message={result.message} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}