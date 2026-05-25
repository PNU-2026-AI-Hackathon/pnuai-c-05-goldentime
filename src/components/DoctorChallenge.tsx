'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, RotateCcw, FileText, Timer, Star, Check, X } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useStopwatch } from '@/hooks/useStopwatch';
import { patients } from '@/data/patients';
import type { Patient } from '@/types';

type Phase = 'idle' | 'loading' | 'active' | 'result';

const transition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const };
const AI_ANALYSIS_TIME = 5.0; // 차트원샷 평균 처리 시간 (초)

function getRandomPatient(excludeIds: string[]): Patient {
  const pool = patients.filter((p) => !excludeIds.includes(p.id));
  return pool.length > 0
    ? pool[Math.floor(Math.random() * pool.length)]
    : patients[Math.floor(Math.random() * patients.length)];
}

type Choice = { title: string; isCorrect: boolean };

// 정답 1 + 다른 환자 3명의 primary_concern.title 오답 → 4지선다
function buildChoices(target: Patient): Choice[] {
  const correct: Choice = {
    title: target.expectedResult.primary_concern.title,
    isCorrect: true,
  };
  const others = patients.filter((p) => p.id !== target.id);
  const wrongs: Choice[] = [...others]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((p) => ({ title: p.expectedResult.primary_concern.title, isCorrect: false }));
  return [correct, ...wrongs].sort(() => Math.random() - 0.5);
}

/* ─── Mini Synthea Loader ─── */
function MiniSyntheaLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const miniSteps = ['Patient profile loaded', 'Longitudinal records ready'];
  const [completedSteps, setCompletedSteps] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(Math.round(p * 100));
      setCompletedSteps(Math.min(Math.floor(p * 2.5), 2));
      if (p < 1) requestAnimationFrame(tick);
      else setTimeout(onComplete, 200);
    };
    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <div
      className="rounded-2xl p-5 max-w-sm mx-auto"
      style={{
        background: 'rgb(var(--card-rgb) / 0.6)',
        border: '1px solid rgb(var(--surface-rgb) / 0.7)',
        boxShadow: 'var(--glow-card-soft)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-[color:var(--color-accent)]">⚕</span>
        <span className="text-xs font-semibold text-[color:var(--c-text)] font-mono uppercase tracking-widest">
          Synthea&trade; Quick Load
        </span>
      </div>
      <div
        className="h-1.5 rounded-full mb-3 overflow-hidden"
        style={{ background: 'rgb(var(--surface-rgb) / 0.7)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--c-accent-strong), var(--c-accent))',
            boxShadow: '0 0 10px rgb(var(--accent-rgb) / 0.5)',
          }}
        />
      </div>
      <div className="space-y-1.5">
        {miniSteps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
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
    </div>
  );
}

/* ─── Choice card (4지선다 옵션) ─── */
function ChoiceCard({
  choice,
  index,
  onClick,
  revealed,
  picked,
}: {
  choice: Choice;
  index: number;
  onClick: () => void;
  revealed: boolean;
  picked: boolean;
}) {
  const letter = String.fromCharCode(65 + index); // A, B, C, D

  // Color logic based on reveal state
  let bg = 'rgb(var(--card-rgb) / 0.55)';
  let border = 'rgb(var(--border-rgb) / 0.55)';
  let textColor = 'var(--c-text)';
  let dotColor = 'var(--c-text-body)';
  let glow = 'none';

  if (revealed) {
    if (choice.isCorrect) {
      bg = 'rgb(var(--stable-rgb) / 0.15)';
      border = 'rgb(var(--stable-rgb) / 0.55)';
      textColor = 'var(--c-stable)';
      dotColor = 'var(--c-stable)';
      glow = '0 0 22px rgb(var(--stable-rgb) / 0.40)';
    } else if (picked) {
      bg = 'rgb(var(--critical-rgb) / 0.15)';
      border = 'rgb(var(--critical-rgb) / 0.55)';
      textColor = 'var(--c-critical)';
      dotColor = 'var(--c-critical)';
      glow = '0 0 22px rgb(var(--critical-rgb) / 0.40)';
    } else {
      bg = 'rgb(var(--card-rgb) / 0.35)';
      border = 'rgb(var(--border-rgb) / 0.30)';
      textColor = 'var(--c-text-muted)';
      dotColor = 'var(--c-text-dim)';
    }
  }

  return (
    <motion.button
      onClick={revealed ? undefined : onClick}
      initial={false}
      animate={{
        backgroundColor: bg,
        borderColor: border,
        boxShadow: glow,
      }}
      whileHover={
        revealed
          ? {}
          : {
              y: -2,
              borderColor: 'rgb(var(--accent-rgb) / 0.60)',
              backgroundColor: 'rgb(var(--accent-rgb) / 0.08)',
              boxShadow: '0 6px 20px rgb(var(--black-rgb) / 0.45), 0 0 18px rgb(var(--accent-rgb) / 0.20)',
            }
      }
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className="w-full text-left px-5 py-4 rounded-xl border flex items-center gap-4 cursor-pointer disabled:cursor-default"
      disabled={revealed}
    >
      <span
        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono font-bold"
        style={{
          background: revealed && choice.isCorrect
            ? 'rgb(var(--stable-rgb) / 0.25)'
            : revealed && picked
            ? 'rgb(var(--critical-rgb) / 0.25)'
            : 'rgb(var(--surface-rgb) / 0.7)',
          color: dotColor,
          border: `1px solid ${border}`,
        }}
      >
        {letter}
      </span>
      <span
        className="flex-1 text-sm font-medium leading-relaxed"
        style={{ color: textColor }}
      >
        {choice.title}
      </span>
      {revealed && choice.isCorrect && (
        <Check size={18} className="text-[color:var(--c-stable)] flex-shrink-0" strokeWidth={2.5} />
      )}
      {revealed && picked && !choice.isCorrect && (
        <X size={18} className="text-[color:var(--c-critical)] flex-shrink-0" strokeWidth={2.5} />
      )}
    </motion.button>
  );
}

/* ─── Main ─── */
export default function DoctorChallenge() {
  const ref = useScrollAnimation();
  const stopwatch = useStopwatch();
  const stopwatchRef = useRef(stopwatch);
  stopwatchRef.current = stopwatch;

  const [phase, setPhase] = useState<Phase>('idle');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [usedIds, setUsedIds] = useState<string[]>([]);
  const [aiTimeDisplay, setAiTimeDisplay] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const startChallenge = useCallback(() => {
    const p = getRandomPatient(usedIds);
    setPatient(p);
    setChoices(buildChoices(p));
    setUsedIds((prev) => [...prev, p.id]);
    setUserChoice(null);
    setPhase('loading');
  }, [usedIds]);

  const handleAnswer = useCallback(
    (choice: string) => {
      stopwatch.stop();
      setUserChoice(choice);
      setPhase('result');
    },
    [stopwatch],
  );

  const handleRetry = useCallback(() => {
    setPhase('idle');
    setPatient(null);
    setChoices([]);
    setUserChoice(null);
    setTypingDone(false);
    setDisplayedText('');
    stopwatch.reset();
    setAiTimeDisplay(0);
  }, [stopwatch]);

  // Typing effect for EMR text (긴 차트 대응)
  useEffect(() => {
    if (phase !== 'active' || !patient) return;
    setTypingDone(false);
    setDisplayedText('');
    let i = 0;
    const fullText = patient.emrText;
    // EMR 길이에 따라 청크 크기 조절 — 약 2초 정도에 다 출력
    const chunkSize = Math.max(Math.ceil(fullText.length / 200), 8);
    const interval = setInterval(() => {
      i += chunkSize;
      if (i >= fullText.length) {
        setDisplayedText(fullText);
        setTypingDone(true);
        clearInterval(interval);
        stopwatchRef.current.start();
      } else {
        setDisplayedText(fullText.slice(0, i));
      }
    }, 10);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, patient]);

  // AI time count-up animation
  useEffect(() => {
    if (phase !== 'result') return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 800, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAiTimeDisplay(parseFloat((eased * AI_ANALYSIS_TIME).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [phase]);

  const correctAnswer = patient?.expectedResult.primary_concern.title ?? null;
  const isCorrect = patient && userChoice === correctAnswer;
  const speedMultiple = stopwatch.time > 0 ? (stopwatch.time / AI_ANALYSIS_TIME).toFixed(1) : '0';

  return (
    <section className="relative py-20 lg:py-28" style={{ background: 'var(--c-page)' }}>
      <div ref={ref} className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-12" data-animate="fade-up">
          <span className="inline-block mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-accent)]">
            Challenge
          </span>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-[color:var(--c-text)] mb-4">
            당신이 의사라면, AI보다 빠를까요?
          </h2>
          <p className="text-[color:var(--c-text-body)] text-base max-w-xl mx-auto leading-relaxed">
            긴 외래 차트를 읽고 환자의{' '}
            <strong className="text-[color:var(--color-accent)] font-semibold">주요 질환</strong>을
            판단해보세요. 차트원샷이 같은 작업을{' '}
            <strong className="text-[color:var(--color-accent)] font-mono">5초</strong>에
            끝내는 동안, 당신은 몇 초가 걸리는지 비교합니다.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Idle */}
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="text-center"
              data-animate="fade-up-1"
            >
              <button
                onClick={startChallenge}
                className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4"
                style={{ boxShadow: '0 0 22px rgb(var(--accent-rgb) / 0.35)' }}
              >
                <Stethoscope size={18} strokeWidth={1.75} /> 도전하기
              </button>
            </motion.div>
          )}

          {/* Loading */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
            >
              <MiniSyntheaLoader onComplete={() => setPhase('active')} />
            </motion.div>
          )}

          {/* Active — EMR + choices */}
          {phase === 'active' && patient && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={transition}
            >
              {/* EMR Card */}
              <div
                className="rounded-2xl overflow-hidden max-w-3xl mx-auto"
                style={{
                  background: 'rgb(var(--card-rgb) / 0.6)',
                  border: '1px solid rgb(var(--surface-rgb) / 0.7)',
                  boxShadow: 'var(--glow-card-soft)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="flex items-center justify-between px-5 py-3 border-b"
                  style={{ background: 'rgb(var(--surface-rgb) / 0.4)', borderColor: 'rgb(var(--surface-rgb) / 0.7)' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={14} strokeWidth={1.5} className="text-[color:var(--c-text-muted)] flex-shrink-0" />
                    <span className="text-xs font-medium text-[color:var(--c-text-body)] truncate">
                      {patient.demographics} · {patient.caseSummary}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!typingDone ? (
                      <span className="text-xs text-[color:var(--color-accent)] font-medium animate-accent-pulse font-mono">
                        EMR 로딩 중...
                      </span>
                    ) : (
                      <>
                        <Timer size={14} strokeWidth={1.5} className="text-[color:var(--c-critical)]" />
                        <span
                          className="text-sm font-mono font-bold text-[color:var(--c-critical)] tabular-nums"
                          style={{ textShadow: '0 0 8px rgb(var(--critical-rgb) / 0.4)' }}
                        >
                          {stopwatch.time.toFixed(1)}초
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="max-h-[420px] overflow-y-auto px-5 py-4">
                  <pre className="text-xs leading-[1.7] text-[color:var(--c-text-body)] whitespace-pre-wrap font-body">
                    {typingDone ? patient.emrText : displayedText}
                    {!typingDone && (
                      <span
                        className="inline-block w-0.5 h-3.5 animate-blink ml-0.5 align-middle"
                        style={{ background: 'var(--c-accent)', boxShadow: '0 0 6px rgb(var(--accent-rgb) / 0.7)' }}
                      />
                    )}
                  </pre>
                </div>
              </div>

              {/* Choices */}
              <AnimatePresence>
                {typingDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="max-w-2xl mx-auto mt-8"
                  >
                    <div className="flex items-center justify-center gap-2 mb-5">
                      <Star size={16} className="text-[color:var(--c-accent-bright)]" strokeWidth={2} />
                      <h3 className="text-lg md:text-xl font-bold text-[color:var(--c-text)]">
                        이 환자의 주요 질환은?
                      </h3>
                    </div>
                    <div className="grid gap-2.5">
                      {choices.map((c, i) => (
                        <ChoiceCard
                          key={`${c.title}-${i}`}
                          choice={c}
                          index={i}
                          onClick={() => handleAnswer(c.title)}
                          revealed={false}
                          picked={false}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Result */}
          {phase === 'result' && patient && userChoice && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={transition}
              className="max-w-2xl mx-auto"
            >
              <div
                className="rounded-2xl p-8"
                style={{
                  background: 'rgb(var(--card-rgb) / 0.6)',
                  border: '1px solid rgb(var(--surface-rgb) / 0.7)',
                  boxShadow: '0 0 32px rgb(var(--accent-rgb) / 0.10)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Time comparison */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--c-text-muted)] mb-2 font-mono">
                      당신
                    </p>
                    <p
                      className={`text-3xl font-bold tabular-nums font-mono ${
                        isCorrect ? 'text-[color:var(--c-text)]' : 'text-[color:var(--c-critical)]'
                      }`}
                    >
                      {stopwatch.time.toFixed(1)}초
                    </p>
                    <p className="text-[11px] text-[color:var(--c-text-muted)] mt-1 font-mono">
                      {isCorrect ? '✓ 정답' : '✗ 오답'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-accent)] mb-2 font-mono">
                      차트원샷
                    </p>
                    <p
                      className="text-3xl font-bold tabular-nums font-mono text-[color:var(--color-accent)]"
                      style={{ textShadow: '0 0 14px rgb(var(--accent-rgb) / 0.4)' }}
                    >
                      {aiTimeDisplay}초
                    </p>
                    <p className="text-[11px] text-[color:var(--c-accent-bright)] mt-1 font-mono">✓ 정답</p>
                  </div>
                </div>

                {/* Verdict */}
                <div className="border-t border-[color:var(--color-divider)] pt-6 mb-6 text-center">
                  {isCorrect ? (
                    <p className="text-base md:text-lg font-bold text-[color:var(--c-stable)] leading-relaxed">
                      정확합니다. 하지만 차트원샷은 같은 작업을{' '}
                      <span className="font-mono">{AI_ANALYSIS_TIME}초</span>에 끝냈습니다.
                    </p>
                  ) : (
                    <p className="text-base md:text-lg font-bold text-[color:var(--c-text)] leading-relaxed">
                      차트원샷이 당신보다{' '}
                      <span
                        className="text-[color:var(--color-accent)] font-mono"
                        style={{ textShadow: '0 0 12px rgb(var(--accent-rgb) / 0.4)' }}
                      >
                        {speedMultiple}배
                      </span>{' '}
                      빠르게 정확한 판단을 내렸습니다.
                    </p>
                  )}
                </div>

                {/* Choices revealed */}
                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--c-text-muted)] mb-3 font-mono">
                    선택지
                  </p>
                  <div className="grid gap-2">
                    {choices.map((c, i) => (
                      <ChoiceCard
                        key={`r-${c.title}-${i}`}
                        choice={c}
                        index={i}
                        onClick={() => {}}
                        revealed={true}
                        picked={c.title === userChoice}
                      />
                    ))}
                  </div>
                </div>

                {/* Why this primary concern */}
                <div className="mb-6">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-accent)] mb-2 font-mono">
                    왜 주요 질환인가
                  </p>
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      background: 'rgb(var(--accent-rgb) / 0.06)',
                      borderLeft: '2px solid var(--c-accent)',
                    }}
                  >
                    <p className="text-sm font-semibold text-[color:var(--c-text)] mb-2">
                      {patient.expectedResult.primary_concern.title}
                    </p>
                    <p className="text-sm text-[color:var(--c-text-body)] leading-relaxed mb-3">
                      {patient.expectedResult.primary_concern.summary}
                    </p>
                    <ul className="space-y-1.5">
                      {patient.expectedResult.primary_concern.key_trends.map((t, i) => (
                        <li key={i} className="text-xs text-[color:var(--c-text-body)] flex items-start gap-2 leading-relaxed">
                          <span
                            className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full"
                            style={{ background: 'var(--c-accent-bright)', boxShadow: '0 0 4px var(--c-accent-bright)' }}
                          />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Retry + next preview */}
                <div className="text-center">
                  <button onClick={handleRetry} className="btn-ghost inline-flex items-center gap-2 text-sm">
                    <RotateCcw size={14} strokeWidth={1.5} /> 다시 도전하기
                  </button>
                  {(() => {
                    const nextPool = patients.filter(
                      (p) => !usedIds.includes(p.id) && p.id !== patient.id,
                    );
                    if (nextPool.length === 0) return null;
                    const next = nextPool[0];
                    return (
                      <p className="text-xs text-[color:var(--c-text-dim)] mt-4 font-mono">
                        다음 환자:{' '}
                        <span className="font-medium text-[color:var(--c-text-body)]">{next.demographics}</span> ·{' '}
                        {next.caseSummary}
                      </p>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
