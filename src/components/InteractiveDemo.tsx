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

/* ─── Workflow steps reflect LangGraph inference pipeline ─── */
const initialSteps: WorkflowStep[] = [
  { label: 'EMR 텍스트 로드 및 문서 단위 청킹', status: 'pending' },
  { label: '약어 사전 lookup (분과 등재 사전 기반)', status: 'pending' },
  { label: 'RAG 검색 (pgvector + EmbeddingGemma 300M)', status: 'pending' },
  { label: 'MedGemma 27B 시계열 요약 (QLoRA 분과 어댑터)', status: 'pending' },
  { label: '원문 인용 검증 및 JSON 구조화', status: 'pending' },
];

const transition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const };

/* ─── Pick 3 patients with category diversity ─── */
function pickThree(exclude: string[]): Patient[] {
  let pool = patients.filter((p) => !exclude.includes(p.id));
  if (pool.length < 3) pool = patients;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

/* ─── Synthea Generator UI ─── */
function SyntheaGenerator({ onComplete }: { onComplete: () => void }) {
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
    <div
      className="rounded-2xl p-6 max-w-lg mx-auto"
      style={{
        background: 'rgb(var(--card-rgb) / 0.6)',
        border: '1px solid rgb(var(--surface-rgb) / 0.7)',
        boxShadow: 'var(--glow-card-soft)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-[color:var(--color-accent)]">⚕</span>
        <span className="font-display text-sm font-semibold text-[color:var(--c-text)]">
          Synthea&trade; Longitudinal Patient Generator
        </span>
      </div>
      <p className="text-sm text-[color:var(--c-text-body)] mb-4">
        Generating synthetic multi-visit patient record...
      </p>

      <div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: 'rgb(var(--surface-rgb) / 0.7)' }}>
        <div
          className="h-full rounded-full transition-all duration-100 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--c-accent-strong), var(--c-accent))',
            boxShadow: '0 0 12px rgb(var(--accent-rgb) / 0.5)',
          }}
        />
      </div>

      <div className="space-y-2 mb-4">
        {genSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {i < completedSteps ? (
              <span className="text-[color:var(--c-stable)] font-bold">✓</span>
            ) : i === completedSteps ? (
              <span className="text-[color:var(--color-accent)] animate-accent-pulse font-bold">◉</span>
            ) : (
              <span className="text-[color:var(--c-text-faint)]">○</span>
            )}
            <span className={i <= completedSteps ? 'text-[color:var(--c-text-body)]' : 'text-[color:var(--c-text-dim)]'}>{step}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-[color:var(--c-text-dim)] font-mono">
        Powered by MITRE Synthea&trade; · Synthetic Longitudinal Engine
      </p>
    </div>
  );
}

/* ─── Case category visual config ─── */
const categoryConfig: Record<
  CaseCategory,
  { label: string; dot: string; bg: string; hoverBg: string; border: string; glow: string; text: string }
> = {
  chronic: {
    label: '만성질환',
    dot: 'var(--c-accent)',
    bg: 'rgb(var(--accent-rgb) / 0.15)',
    hoverBg: 'rgb(var(--accent-rgb) / 0.10)',
    border: 'rgb(var(--accent-rgb) / 0.45)',
    glow: '0 0 0 1px rgb(var(--accent-rgb) / 0.45), 0 0 28px rgb(var(--accent-rgb) / 0.28)',
    text: 'var(--c-accent-bright)',
  },
  multidrug: {
    label: '다약제',
    dot: 'var(--c-warning)',
    bg: 'rgb(var(--warning-rgb) / 0.15)',
    hoverBg: 'rgb(var(--warning-rgb) / 0.10)',
    border: 'rgb(var(--warning-rgb) / 0.45)',
    glow: '0 0 0 1px rgb(var(--warning-rgb) / 0.45), 0 0 28px rgb(var(--warning-rgb) / 0.28)',
    text: 'var(--c-warning)',
  },
  multispec: {
    label: '다분과 협진',
    dot: 'var(--c-violet)',
    bg: 'rgb(var(--violet-rgb) / 0.15)',
    hoverBg: 'rgb(var(--violet-rgb) / 0.10)',
    border: 'rgb(var(--violet-rgb) / 0.45)',
    glow: '0 0 0 1px rgb(var(--violet-rgb) / 0.45), 0 0 28px rgb(var(--violet-rgb) / 0.28)',
    text: 'var(--c-violet)',
  },
  postop: {
    label: '수술 후 추적',
    dot: 'var(--c-rose)',
    bg: 'rgb(var(--rose-rgb) / 0.15)',
    hoverBg: 'rgb(var(--rose-rgb) / 0.10)',
    border: 'rgb(var(--rose-rgb) / 0.45)',
    glow: '0 0 0 1px rgb(var(--rose-rgb) / 0.45), 0 0 28px rgb(var(--rose-rgb) / 0.28)',
    text: 'var(--c-rose)',
  },
  oncology: {
    label: '종양 추적',
    dot: 'var(--c-pink)',
    bg: 'rgb(var(--pink-rgb) / 0.15)',
    hoverBg: 'rgb(var(--pink-rgb) / 0.10)',
    border: 'rgb(var(--pink-rgb) / 0.45)',
    glow: '0 0 0 1px rgb(var(--pink-rgb) / 0.45), 0 0 28px rgb(var(--pink-rgb) / 0.28)',
    text: 'var(--c-pink)',
  },
  observation: {
    label: '일반 외래',
    dot: 'var(--c-stable)',
    bg: 'rgb(var(--stable-rgb) / 0.15)',
    hoverBg: 'rgb(var(--stable-rgb) / 0.10)',
    border: 'rgb(var(--stable-rgb) / 0.45)',
    glow: '0 0 0 1px rgb(var(--stable-rgb) / 0.45), 0 0 28px rgb(var(--stable-rgb) / 0.28)',
    text: 'var(--c-stable)',
  },
};

const noShadow = '0 0 0 0 rgb(var(--black-rgb) / 0)';
const hoverShadow = '0 6px 20px 0 rgb(var(--black-rgb) / 0.45), 0 0 18px 0 rgb(var(--accent-rgb) / 0.10)';

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
  const strongerGlow = cat.glow.replace('0.28)', '0.45)');

  return (
    <motion.button
      onClick={onClick}
      initial={false}
      animate={{
        y: selected ? -4 : 0,
        boxShadow: selected ? cat.glow : noShadow,
        borderColor: selected ? cat.border : 'rgb(var(--surface-rgb) / 0.65)',
        backgroundColor: selected ? cat.bg : 'rgb(var(--card-rgb) / 0.55)',
      }}
      whileHover={
        selected
          ? {
              // 선택된 카드도 hover 시 lift — 미선택과 같은 방향(위)으로
              // 일관성 + 더 강한 lift(-6) + 강한 glow로 '이미 선택됨'을 강조
              y: -6,
              boxShadow: strongerGlow,
            }
          : {
              y: -4,
              boxShadow: hoverShadow,
              borderColor: 'rgb(var(--border-rgb) / 0.7)',
              backgroundColor: cat.hoverBg,
            }
      }
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="w-full text-left p-5 rounded-2xl cursor-pointer min-w-[260px] snap-center flex-shrink-0 md:min-w-0 md:flex-shrink relative overflow-hidden border"
    >
      <span
        className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded font-mono mb-3"
        style={{ color: cat.text, background: cat.bg, border: `1px solid ${cat.border}` }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: cat.dot, boxShadow: `0 0 6px ${cat.dot}` }}
        />
        {cat.label}
      </span>
      <h4 className="font-display text-base font-semibold text-[color:var(--c-text)]">
        {patient.demographics}
      </h4>
      <p className="text-sm text-[color:var(--c-text-body)] mt-1">{patient.caseSummary}</p>
      <p className="text-[11px] text-[color:var(--c-text-muted)] mt-3 font-mono">
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
                background: 'rgb(var(--stable-rgb) / 0.18)',
                color: 'var(--c-stable)',
                border: '1px solid rgb(var(--stable-rgb) / 0.35)',
              }}
            >
              ✓
            </span>
          )}
          {step.status === 'in_progress' && (
            <span
              className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold animate-accent-pulse flex-shrink-0"
              style={{
                background: 'rgb(var(--accent-rgb) / 0.20)',
                color: 'var(--c-accent)',
                border: '1px solid rgb(var(--accent-rgb) / 0.40)',
                boxShadow: '0 0 12px rgb(var(--accent-rgb) / 0.45)',
              }}
            >
              ◉
            </span>
          )}
          {step.status === 'pending' && (
            <span
              className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs flex-shrink-0"
              style={{
                background: 'rgb(var(--surface-rgb) / 0.6)',
                color: 'var(--c-text-muted)',
                border: '1px solid rgb(var(--border-rgb) / 0.5)',
              }}
            >
              ○
            </span>
          )}
          <span className={`text-sm ${step.status === 'pending' ? 'text-[color:var(--c-text-dim)]' : 'text-[color:var(--c-text-body)]'}`}>
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
              background: 'rgb(var(--accent-rgb) / 0.30)',
              color: 'var(--c-accent-bright)',
              padding: '0 2px',
              borderRadius: '2px',
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      );

  return (
    <div
      className="rounded-2xl overflow-hidden min-h-[640px] flex flex-col"
      style={{
        background: 'rgb(var(--card-rgb) / 0.55)',
        border: '1px solid rgb(var(--surface-rgb) / 0.7)',
        boxShadow: 'var(--glow-card-soft)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'rgb(var(--surface-rgb) / 0.4)', borderColor: 'rgb(var(--surface-rgb) / 0.7)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-[color:var(--c-text-muted)] flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-medium text-[color:var(--c-text-body)] truncate">
            {patient.demographics} · {patient.caseSummary}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setSearchOpen((s) => !s)}
            aria-label="EMR 텍스트 검색"
            aria-pressed={searchOpen}
            className={`p-1 transition-colors ${
              searchOpen
                ? 'text-[color:var(--color-accent)]'
                : 'text-[color:var(--c-text-muted)] hover:text-[color:var(--color-accent)]'
            }`}
          >
            <Search size={14} strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => ((z + 1) % 3) as 0 | 1 | 2)}
            aria-label={`글자 크기 변경 (현재 ${zoomLevel + 1}/3)`}
            className="p-1 text-[color:var(--c-text-muted)] hover:text-[color:var(--color-accent)] transition-colors"
          >
            <ZoomIn size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div
          className="px-4 py-2 border-b"
          style={{
            borderColor: 'rgb(var(--surface-rgb) / 0.7)',
            background: 'rgb(var(--surface-rgb) / 0.3)',
          }}
        >
          <div className="flex items-center gap-2">
            <Search size={12} className="text-[color:var(--c-text-muted)] flex-shrink-0" strokeWidth={1.5} />
            <input
              autoFocus
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="EMR 텍스트 검색..."
              className="flex-1 bg-transparent text-xs text-[color:var(--c-text)] placeholder:text-[color:var(--c-text-dim)] outline-none"
            />
            {searchTerm && (
              <span className="text-[10px] text-[color:var(--c-text-muted)] font-mono flex-shrink-0">
                {matchCount}건
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <pre className={`${zoomClass} leading-[1.7] text-[color:var(--c-text-body)] whitespace-pre-wrap font-body`}>
          {renderedText}
        </pre>
        <div className="mt-6 pt-4 border-t border-[color:var(--color-divider)]">
          <span className="text-[10px] text-[color:var(--c-text-dim)] font-medium uppercase tracking-widest font-mono">
            문서 단위 청킹 → pgvector 저장 → 환자 ID 필터 검색
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
      className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono rounded"
      style={{
        background: 'rgb(var(--accent-rgb) / 0.10)',
        border: '1px solid rgb(var(--accent-rgb) / 0.25)',
        color: 'var(--c-accent-bright)',
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
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgb(var(--accent-rgb) / 0.12) 0%, rgb(var(--accent-rgb) / 0.04) 100%)',
        border: '1px solid rgb(var(--accent-rgb) / 0.40)',
        boxShadow: '0 0 28px rgb(var(--accent-rgb) / 0.18)',
      }}
    >
      {/* accent glow blob */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-50 blur-2xl"
        style={{ background: 'rgb(var(--accent-rgb) / 0.30)' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} className="text-[color:var(--c-accent-bright)]" strokeWidth={2.25} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--c-accent-bright)] font-mono">
            주요 질환 (Primary Concern)
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-[color:var(--c-text)] mb-2 tracking-tight">
          {concern.title}
        </h3>
        <p className="text-sm text-[color:var(--c-text-body)] leading-relaxed mb-4">
          {concern.summary}
        </p>

        <div className="border-t border-[rgb(var(--accent-rgb)_/_0.20)] pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--c-text-muted)] font-mono">
            Key Trends
          </span>
          <ul className="mt-2.5 space-y-2">
            {concern.key_trends.map((t, i) => (
              <li key={i} className="text-sm text-[color:var(--c-text)] flex items-start gap-2.5 leading-relaxed">
                <span
                  className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--c-accent-bright)', boxShadow: '0 0 6px rgb(var(--accent-rgb) / 0.7)' }}
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
  // 첫 줄/첫 구절만
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
          className="absolute left-0 right-7 top-1/2 -translate-y-1/2 h-[2px] rounded-full"
          style={{
            background:
              'linear-gradient(90deg, rgb(var(--accent-rgb) / 0.30) 0%, rgb(var(--accent-rgb) / 0.65) 100%)',
          }}
        />
        {/* arrow head */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: '10px solid rgb(var(--accent-rgb) / 0.65)',
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
                    background: isPrimary
                      ? 'rgb(var(--accent-rgb) / 0.35)'
                      : 'rgb(var(--warning-rgb) / 0.35)',
                  }}
                />

                {/* date + short label (above for primary, below for incidental) */}
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
                    style={{ color: isPrimary ? 'var(--c-accent)' : 'var(--c-warning)' }}
                  >
                    {ev.date}
                  </div>
                  {isPrimary ? (
                    <div className="text-[10px] mt-0.5 leading-tight text-[color:var(--c-text-body)]">
                      {shortLabel(ev.event, 16)}
                    </div>
                  ) : (
                    <div className="text-[9px] mt-0.5 text-[color:var(--c-text-muted)] italic">[부수]</div>
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
                      background: isPrimary ? 'var(--c-accent)' : 'var(--c-warning)',
                      boxShadow: isHov
                        ? `0 0 16px ${isPrimary ? 'var(--c-accent)' : 'var(--c-warning)'}`
                        : `0 0 6px ${isPrimary ? 'rgb(var(--accent-rgb) / 0.6)' : 'rgb(var(--warning-rgb) / 0.55)'}`,
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
                        className="rounded-lg p-3"
                        style={{
                          background: 'rgb(var(--card-rgb) / 0.96)',
                          border: `1px solid ${
                            isPrimary ? 'rgb(var(--accent-rgb) / 0.55)' : 'rgb(var(--warning-rgb) / 0.55)'
                          }`,
                          boxShadow: `0 12px 32px rgb(var(--black-rgb) / 0.7), 0 0 24px ${
                            isPrimary ? 'rgb(var(--accent-rgb) / 0.22)' : 'rgb(var(--warning-rgb) / 0.22)'
                          }`,
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest font-mono"
                            style={{ color: isPrimary ? 'var(--c-accent-bright)' : 'var(--c-warning)' }}
                          >
                            {isPrimary ? '주요 · Primary' : '부수 · Incidental'}
                          </span>
                          <ChunkChip id={ev.sourceChunkId} />
                        </div>
                        <div className="text-[11px] font-mono font-bold text-[color:var(--c-text-body)] mb-1">
                          {ev.date}
                        </div>
                        <p className="text-xs text-[color:var(--c-text)] leading-relaxed">{ev.event}</p>
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
    {/* legend (below timeline) */}
    <div className="flex items-center justify-end gap-3 text-[10px] font-mono mt-2 pr-1">
      <div className="flex items-center gap-1.5">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: 'var(--c-accent)', boxShadow: '0 0 6px rgb(var(--accent-rgb) / 0.7)' }}
        />
        <span className="text-[color:var(--c-text-body)]">주요 (always shown)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--c-warning)', boxShadow: '0 0 6px rgb(var(--warning-rgb) / 0.6)' }}
        />
        <span className="text-[color:var(--c-text-body)]">부수 (hover)</span>
      </div>
    </div>
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
      className="rounded-2xl overflow-hidden min-h-[640px] flex flex-col"
      style={{
        background: 'rgb(var(--card-rgb) / 0.55)',
        border: '1px solid rgb(var(--surface-rgb) / 0.7)',
        boxShadow: '0 0 32px rgb(var(--accent-rgb) / 0.10)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-divider)]">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded font-mono"
          style={{ background: cat.bg, color: cat.text, border: `1px solid ${cat.border}` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: cat.dot, boxShadow: `0 0 6px ${cat.dot}` }}
          />
          {cat.label}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[color:var(--c-text-muted)] font-mono">
            Analysis: {analysisTime.toFixed(1)}s
          </span>
          {shareCopied ? (
            <span className="text-[10px] text-[color:var(--c-accent-bright)] font-mono whitespace-nowrap">
              URL 복사됨
            </span>
          ) : (
            <button
              onClick={handleShare}
              className="p-1 text-[color:var(--c-text-muted)] hover:text-[color:var(--color-accent)] transition-colors"
              aria-label="현재 페이지 URL 복사"
            >
              <Share2 size={14} strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Patient label */}
        <div>
          <h3 className="font-display text-lg font-semibold text-[color:var(--c-text)]">
            {data.patient_label}
          </h3>
          <p className="text-sm text-[color:var(--c-text-body)] leading-relaxed mt-2">
            {displayed}
            {!done && (
              <span
                className="inline-block w-px h-4 ml-0.5 align-middle"
                style={{
                  background: 'var(--c-accent)',
                  boxShadow: '0 0 6px rgb(var(--accent-rgb) / 0.7)',
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
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-accent)] mb-2 font-mono">
            타임라인 (가로축: 시간 / 위: 주요, 아래: 부수 호버)
          </p>
          <HorizontalTimeline events={data.timeline} />
        </div>

        {/* Current state */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-accent)] mb-3 font-mono">
            현재 상태
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--c-text-muted)] mb-1.5 font-mono">
                주요 진단
              </p>
              <ul className="space-y-1">
                {data.current_state.diagnoses.map((dx, i) => (
                  <li key={i} className="text-sm text-[color:var(--c-text)] flex items-start gap-2">
                    <span className="text-[color:var(--color-accent)] mt-1 opacity-60">•</span>
                    {dx}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--c-text-muted)] mb-1.5 font-mono">
                현재 호소
              </p>
              <p className="text-sm text-[color:var(--c-text)] leading-relaxed">
                {data.current_state.complaint}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--c-text-muted)] mb-2 font-mono">
                최근 검사
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(data.current_state.recent_labs).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg p-2.5"
                    style={{
                      background: 'rgb(var(--surface-rgb) / 0.6)',
                      border: '1px solid rgb(var(--border-rgb) / 0.4)',
                    }}
                  >
                    <div className="text-[9px] font-semibold uppercase tracking-widest text-[color:var(--c-text-muted)] font-mono">
                      {k}
                    </div>
                    <div className="text-sm font-bold mt-0.5 tabular-nums font-mono text-[color:var(--c-text)]">
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--c-text-muted)] mb-1.5 font-mono">
                복약 중
              </p>
              <ul className="space-y-1">
                {data.current_state.medications.map((m, i) => (
                  <li key={i} className="text-sm text-[color:var(--c-text-body)] flex items-start gap-2">
                    <span className="text-[color:var(--color-accent)] mt-1 opacity-60">•</span>
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-accent)] mb-3 font-mono">
              해결된 과거 이슈
            </p>
            <div className="space-y-2.5">
              {data.resolved_issues.map((iss, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg"
                  style={{
                    background: 'rgb(var(--stable-rgb) / 0.06)',
                    borderLeft: '2px solid rgb(var(--stable-rgb) / 0.45)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h5 className="text-sm font-semibold text-[color:var(--c-text)]">{iss.issue}</h5>
                    <ChunkChip id={iss.sourceChunkId} />
                  </div>
                  <p className="text-xs text-[color:var(--c-text-body)] font-mono">{iss.duration}</p>
                  {iss.note && (
                    <p className="text-xs text-[color:var(--c-text-body)] mt-1.5 leading-relaxed">{iss.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abbreviation resolution */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-accent)] mb-3 font-mono">
            약어 및 은어 풀이 (사전 결정론적)
          </p>
          <div className="space-y-1.5">
            {data.abbreviations.map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-2.5 rounded-lg"
                style={
                  a.status === 'resolved'
                    ? {
                        background: 'rgb(var(--accent-rgb) / 0.06)',
                        border: '1px solid rgb(var(--accent-rgb) / 0.20)',
                      }
                    : {
                        background: 'rgb(var(--warning-rgb) / 0.08)',
                        border: '1px solid rgb(var(--warning-rgb) / 0.30)',
                      }
                }
              >
                {a.status === 'resolved' ? (
                  <CheckCircle2 size={14} className="text-[color:var(--c-accent)] flex-shrink-0" strokeWidth={2} />
                ) : (
                  <AlertCircle size={14} className="text-[color:var(--c-warning)] flex-shrink-0" strokeWidth={2} />
                )}
                <code
                  className="text-xs font-mono font-bold flex-shrink-0"
                  style={{ color: a.status === 'resolved' ? 'var(--c-accent-bright)' : 'var(--c-warning)' }}
                >
                  {a.abbrev}
                </code>
                <span className="text-[color:var(--c-text-dim)]">→</span>
                {a.status === 'resolved' ? (
                  <span className="text-xs text-[color:var(--c-text-body)]">{a.expansion}</span>
                ) : (
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-[color:var(--c-warning)] font-medium">
                      미등재 · 원문 유지 (환각 방지)
                    </span>
                    <span className="text-[10px] text-[color:var(--c-warning)] opacity-80 italic">
                      &quot;은어 추정&quot; 확인 바람
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-[color:var(--color-divider)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-[color:var(--c-text-muted)] font-mono">
            원문 인용 {data.citations_count}건 부착 · MedGemma 27B + QLoRA
          </span>
        </div>
        <button className="btn-primary w-full flex items-center justify-center gap-2">
          전문의 승인 및 차트 전송 <ArrowRight size={14} strokeWidth={1.75} />
        </button>
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
      className="rounded-2xl p-8 text-center"
      style={{
        background: 'rgb(var(--card-rgb) / 0.55)',
        border: '1px solid rgb(var(--critical-rgb) / 0.30)',
        boxShadow: '0 0 24px rgb(var(--critical-rgb) / 0.10)',
      }}
    >
      <p className="text-sm text-[color:var(--c-text)] font-medium">
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
        className="lg:hidden flex rounded-lg p-1 mb-4"
        style={{ background: 'rgb(var(--surface-rgb) / 0.6)' }}
      >
        <button
          onClick={() => setTab('original')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === 'original' ? 'text-[color:var(--c-text)]' : 'text-[color:var(--c-text-muted)]'
          }`}
          style={
            tab === 'original'
              ? { background: 'rgb(var(--card-rgb) / 0.85)', boxShadow: '0 0 8px rgb(var(--accent-rgb) / 0.15)' }
              : undefined
          }
        >
          원본 EMR
        </button>
        <button
          onClick={() => setTab('summary')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === 'summary' ? 'text-[color:var(--c-text)]' : 'text-[color:var(--c-text-muted)]'
          }`}
          style={
            tab === 'summary'
              ? { background: 'rgb(var(--card-rgb) / 0.85)', boxShadow: '0 0 8px rgb(var(--accent-rgb) / 0.15)' }
              : undefined
          }
        >
          시계열 요약
        </button>
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 gap-4">
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
    <section id="demo" className="relative py-20 lg:py-28" style={{ background: 'var(--c-page)' }}>
      <div ref={ref} className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4"
          data-animate="fade-up"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full font-mono"
              style={{
                color: 'var(--c-accent)',
                background: 'rgb(var(--accent-rgb) / 0.10)',
                border: '1px solid rgb(var(--accent-rgb) / 0.30)',
              }}
            >
              Synthea&trade; Powered
            </span>
            <h2 className="font-display text-[2rem] font-bold tracking-[-0.02em] text-[color:var(--c-text)]">
              Interactive Demo
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {!loading && !result && !generating && (
              <button onClick={handleGenerate} className="btn-ghost text-sm inline-flex items-center gap-1.5">
                <RefreshCw size={14} strokeWidth={1.5} /> 새 환자 생성
              </button>
            )}
            {(result || loading) && (
              <button onClick={handleReset} className="btn-ghost text-sm inline-flex items-center gap-1.5">
                <RotateCcw size={14} strokeWidth={1.5} /> 다시 선택
              </button>
            )}
            <button
              onClick={handleRun}
              disabled={!selected || loading || generating}
              className={`btn-primary inline-flex items-center gap-2 text-sm transition-all duration-300 ${
                !selected || loading || generating ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" strokeWidth={1.5} /> 시계열 요약 생성 중...
                </>
              ) : selected ? (
                <>
                  <Play size={14} strokeWidth={1.5} />
                  시계열 요약 실행
                  <span
                    className="w-2 h-2 rounded-full ml-1"
                    style={{
                      background: categoryConfig[selected.caseCategory].dot,
                      boxShadow: `0 0 8px ${categoryConfig[selected.caseCategory].dot}`,
                    }}
                  />
                </>
              ) : (
                <>
                  <Play size={14} strokeWidth={1.5} /> 환자를 선택하세요
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-sm text-[color:var(--c-text-muted)] mb-10" data-animate="fade-up-1">
          MITRE Synthea&trade;로 생성된 가상 환자 데이터입니다. 실제 환자 정보가 아닙니다.
        </p>

        <AnimatePresence mode="wait">
          {/* Synthea Generator */}
          {generating && (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <SyntheaGenerator onComplete={handleGenerateComplete} />
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
              <div className="hidden md:grid md:grid-cols-3 gap-4 mb-8">
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
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        selected?.id === p.id ? 'bg-[color:var(--color-accent)]' : 'bg-[color:var(--color-surface-strong)]'
                      }`}
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
              className="rounded-2xl p-6 mb-6"
              style={{
                background: 'rgb(var(--card-rgb) / 0.55)',
                border: '1px solid rgb(var(--surface-rgb) / 0.7)',
                boxShadow: 'var(--glow-card-soft)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <h3 className="font-display text-sm font-semibold text-[color:var(--color-accent)] mb-2 uppercase tracking-widest font-mono">
                LangGraph 추론 파이프라인
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
