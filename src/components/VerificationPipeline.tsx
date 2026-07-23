'use client';

/* 검증 파이프라인 다이어그램 — 하이브리드 B(뷰포트 진입 시 1회 자동 재생, 완료 유지).
   노드 = 글 없이 읽히는 미니 장면 픽토그램(56 그리드·스트로크 2·round — lucide 규율).
   로고 = 공식 벡터·단색·소형(nominative use, 파트너십 암시 금지).
   스타일은 globals.css의 .vp-* 블록. reduced-motion = 완성 정적 다이어그램. */

import { useEffect, useId, useRef, useState } from 'react';
import { Manrope, Lora, Poppins } from 'next/font/google';
import {
  motion, useMotionValue, useInView, useReducedMotion, useTransform, animate,
  type MotionValue,
} from 'framer-motion';

const manrope = Manrope({ subsets: ['latin'], weight: '800', preload: false });
const lora = Lora({ subsets: ['latin'], weight: '600', preload: false });
const poppins = Poppins({ subsets: ['latin'], weight: '600', preload: false });

type BrandKey = 'openai' | 'anthropic' | 'google';
type Brand = { key: BrandKey; vendor: string; model: string; color: string; vtext: string; tint: string; bd: string };

const BRANDS: Brand[] = [
  { key: 'openai', vendor: 'OpenAI', model: 'GPT-5.6 Sol', color: '#0D0D0D', vtext: '#3a3a3a', tint: 'rgba(13,13,13,0.05)', bd: 'rgba(13,13,13,0.26)' },
  { key: 'anthropic', vendor: 'Anthropic', model: 'Claude Fable 5', color: '#D97757', vtext: '#D97757', tint: 'rgba(217,119,87,0.10)', bd: 'rgba(217,119,87,0.38)' },
  { key: 'google', vendor: 'Google', model: 'MedGemma 27B', color: '#4285F4', vtext: '#4285F4', tint: 'rgba(66,133,244,0.08)', bd: 'rgba(66,133,244,0.34)' },
];

const OPENAI_PETAL = 'M1107.3 299.1c-197.999 0-373.9 127.3-435.2 315.3L650 743.5v427.9c0 21.4 11 40.4 29.4 51.4l344.5 198.515V833.3h.1v-27.9L1372.7 604c33.715-19.52 70.44-32.857 108.47-39.828L1447.6 450.3C1361 353.5 1237.1 298.5 1107.3 299.1zm0 117.5-.6.6c79.699 0 156.3 27.5 217.6 78.4-2.5 1.2-7.4 4.3-11 6.1L952.8 709.3c-18.4 10.4-29.4 30-29.4 51.4V1248l-155.1-89.4V755.8c-.1-187.099 151.601-338.9 339-339.2z';
const ANTHROPIC_PATH = 'M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z';
const UPSTAGE_PATH = 'M29.5239 0L28.7246 2.5751H24.1122L24.8907 0H29.5239ZM27.5091 6.77995L28.2584 4.20485H19.4249L18.6964 6.77995H27.5091ZM26.9929 8.40537L26.2436 10.9805H2.47402L3.20668 8.40537H26.9929ZM24.9989 15.1852L25.7482 12.6101H5.17569L4.44304 15.1852H24.9989ZM27.1636 16.8149L26.4143 19.39H5.8917L6.62435 16.8149H27.1636ZM28.3125 23.5948L29.0618 21.0197H5.35883L4.62618 23.5948H28.3125ZM13.2182 25.2203L12.4689 27.7954H3.3607L4.09335 25.2203H13.2182ZM7.50685 29.4251L6.70759 32.0002H2.09521L2.87366 29.4251H7.50685Z';

function OpenAiMark({ size, uid }: { size: number; uid: string }) {
  const id = `oai-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 2406 2406" fill="currentColor" style={{ color: '#0D0D0D' }} aria-label="OpenAI">
      <path id={id} d={OPENAI_PETAL} />
      {[60, 120, 180, 240, 300].map((r) => <use key={r} href={`#${id}`} transform={`rotate(${r} 1203 1203)`} />)}
    </svg>
  );
}

function AnthropicMark({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="#141413" aria-label="Anthropic"><path d={ANTHROPIC_PATH} /></svg>;
}

/* Google 공식 4색 G — 색 변경·수정 금지 규정 준수(원색 그대로, 흰 배경) */
function GoogleColorG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/* Upstage 공식 심볼(upstage.ai) — 공식 그라데이션 유지 */
function UpstageMark({ size, uid }: { size: number; uid: string }) {
  const gradId = `upstage-grad-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="Upstage">
      <defs>
        <linearGradient id={gradId} x1="15.8" y1="0" x2="15.8" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B0BFFF" /><stop offset="1" stopColor="#805CFB" />
        </linearGradient>
      </defs>
      <path fillRule="evenodd" clipRule="evenodd" d={UPSTAGE_PATH} fill={`url(#${gradId})`} />
    </svg>
  );
}

/* ── 미니 장면 픽토그램 ── */
const SLATE = 'rgba(16,24,34,0.52)';
const BLUE = '#184AFF';

function EmrScene() {
  return (
    <svg className="vp-scene" viewBox="0 0 56 56" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="EMR 차트 문서">
      <rect x="12" y="5" width="32" height="46" rx="4" stroke={SLATE} strokeWidth="2" />
      <rect x="17" y="10" width="13" height="4" rx="2" fill={SLATE} opacity="0.5" />
      <rect x="33" y="10" width="6" height="4" rx="2" fill={SLATE} opacity="0.3" />
      <path d="M16 25h6l3-6 4 12 3-6h7" stroke={BLUE} strokeWidth="2" />
      <path d="M17 34h22v12h-22z" stroke={SLATE} strokeWidth="1.6" opacity="0.75" />
      <path d="M17 40h22M28 34v12" stroke={SLATE} strokeWidth="1.6" opacity="0.75" />
    </svg>
  );
}

function OcrScene({ lit }: { lit: boolean }) {
  return (
    <svg className="vp-scene" viewBox="0 0 56 56" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="문서 스캔 디지털화">
      <rect x="14" y="5" width="28" height="46" rx="4" stroke={SLATE} strokeWidth="2" />
      <path d="M20 14h16M20 20h12" stroke={SLATE} strokeWidth="2" />
      <g className={`vp-beam ${lit ? 'on' : ''}`}>
        <path d="M9 29h38" stroke="#805CFB" strokeWidth="2.4" />
        <path d="M9 29h38" stroke="#B0BFFF" strokeWidth="6" opacity="0.35" />
      </g>
      <path d="M20 38h16M20 44h10" stroke={SLATE} strokeWidth="2" opacity="0.3" />
    </svg>
  );
}

function CrossScene() {
  const W = 'rgba(255,255,255,0.85)';
  return (
    <svg className="vp-scene" viewBox="0 0 56 56" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="요약 3건 교차 대조">
      <g transform="translate(0 1.5)">
        <rect x="8" y="12" width="22" height="30" rx="3" stroke={W} strokeWidth="2" opacity="0.45" />
        <rect x="17" y="9" width="22" height="30" rx="3" stroke={W} strokeWidth="2" opacity="0.7" />
        <rect x="26" y="14" width="22" height="30" rx="3" stroke={W} strokeWidth="2" />
        <path d="M31 22h12M31 28h8" stroke={W} strokeWidth="2" />
        <path d="M31 35h12" stroke="#FF6E7E" strokeWidth="3" />
      </g>
    </svg>
  );
}

function ProfScene({ reviewing }: { reviewing: boolean }) {
  /* human-in-the-loop: 점선 루프 링 안에 의사 — 사용자 레퍼런스 구도(큰 머리·라운드 어깨·V칼라·
     청진기 드레이프)를 사이트 스트로크 규격으로 작화. 파티클이 링 궤도를 1바퀴 돌고 통과. */
  return (
    <svg className="vp-scene" viewBox="0 0 56 56" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="의대 교수(사람)가 루프 안에서 최종 검토">
      <circle cx="28" cy="28" r="24.5" stroke={SLATE} strokeWidth="1.8" strokeDasharray="0.1 6" opacity="0.8" />
      {/* 의사 아이콘 — Flaticon 469466 원본 그대로(사용자 확정). Freepik–Flaticon 무료 라이선스,
         출처표기는 푸터 크레딧. 원본이 래스터(PNG)라 확대 시 한계 있음(사용자 인지 하 선택). */}
      <image href="/icons/doctor-flaticon.png" x="11" y="11" width="34" height="34" />
      {reviewing && (
        <g className="vp-orbit">
          <circle cx="28" cy="3.5" r="3" fill={BLUE} style={{ filter: `drop-shadow(0 0 6px ${BLUE})` }} />
        </g>
      )}
    </svg>
  );
}

function DbScene() {
  /* 단순화(Codex 재설계): 클래식 실린더만 — 디스크 라인 2개, 하단 라인만 포인트. */
  return (
    <svg className="vp-scene" viewBox="0 0 56 56" fill="none" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="감사 기록 데이터베이스 저장">
      <path d="M16 18c0-4 5.4-7 12-7s12 3 12 7v20c0 4-5.4 7-12 7s-12-3-12-7V18Zm0 0c0 4 5.4 7 12 7s12-3 12-7" stroke={SLATE} strokeWidth="2" />
      <path d="M16 28c0 4 5.4 7 12 7s12-3 12-7" stroke={SLATE} strokeWidth="2" />
      <path d="M16 38c0 4 5.4 7 12 7s12-3 12-7" stroke={BLUE} strokeWidth="2" />
    </svg>
  );
}

/* ── 커넥터(점선 드로잉 + 파티클 + 트레일) ── */
type ConnPath = { d: string; color: string };

function useDotPos(getEl: () => SVGPathElement | null, progress: MotionValue<number>, lag = 0) {
  const at = (v: number) => {
    const el = getEl(); if (!el) return { x: -20, y: -20 };
    const c = Math.min(Math.max(v - lag, 0), 1);
    const p = el.getPointAtLength(c * el.getTotalLength());
    return { x: p.x, y: p.y };
  };
  const cx = useTransform(progress, (v) => at(v).x);
  const cy = useTransform(progress, (v) => at(v).y);
  return { cx, cy };
}

function TravelDot({ getEl, progress, color }: { getEl: () => SVGPathElement | null; progress: MotionValue<number>; color: string }) {
  const head = useDotPos(getEl, progress);
  const tail = useDotPos(getEl, progress, 0.09);
  const opacity = useTransform(progress, [0, 0.04, 0.92, 1], [0, 1, 1, 0]);
  const tailOpacity = useTransform(progress, [0, 0.08, 0.92, 1], [0, 0.45, 0.45, 0]);
  return (
    <>
      <motion.circle r={3.4} fill={color} style={{ cx: tail.cx, cy: tail.cy, opacity: tailOpacity, filter: `blur(1.5px)` }} />
      <motion.circle r={5} fill={color} style={{ cx: head.cx, cy: head.cy, opacity, filter: `drop-shadow(0 0 7px ${color})` }} />
    </>
  );
}

function Connector({ id, paths, viewBox, height, progress, fan }: {
  id: string; paths: ConnPath[]; viewBox: string; height: number; progress: MotionValue<number>; fan?: boolean;
}) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  return (
    <svg className={`vp-conn ${fan ? 'vp-fan' : ''}`} viewBox={viewBox} preserveAspectRatio="none" style={{ height }} aria-hidden>
      <defs>
        {paths.map((p, i) => (
          <mask key={i} id={`${id}-m${i}`} maskUnits="userSpaceOnUse">
            <motion.path d={p.d} stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" style={{ pathLength: progress }} />
          </mask>
        ))}
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke={p.color} strokeOpacity={0.12} strokeWidth={1.6} strokeDasharray="0.1 8" strokeLinecap="round" />
          <path
            ref={(el) => { refs.current[i] = el; }}
            d={p.d} fill="none" stroke={p.color} strokeOpacity={0.85} strokeWidth={2}
            strokeDasharray="0.1 8" strokeLinecap="round" mask={`url(#${id}-m${i})`}
          />
          <TravelDot getEl={() => refs.current[i]} progress={progress} color={p.color} />
        </g>
      ))}
    </svg>
  );
}

function Node({ scene, k, t, ink, lit }: {
  scene: React.ReactNode; k: React.ReactNode; t: string; ink?: boolean; lit: boolean;
}) {
  return (
    <div className={`vp-nd vp-io ${ink ? 'vp-ink' : ''} ${lit ? 'lit' : ''}`}>
      {scene}
      <div className="vp-tx">
        <div className="vp-k">{k}</div>
        <div className="vp-t">{t}</div>
      </div>
    </div>
  );
}

/* 브랜드 타이포 모델명 — OpenAI Sans→Manrope·블랙 / Anthropic Serif·Tiempos→Lora·클레이 /
   Google Sans→Poppins·공식 4색 그라데이션 (공식 폰트는 전용 라이선스라 근사체) */
function BrandModelName({ k, model, size }: { k: BrandKey; model: string; size: number }) {
  const base = { fontSize: size, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 } as const;
  if (k === 'openai') return <span className={manrope.className} style={{ ...base, color: '#0D0D0D' }}>{model}</span>;
  if (k === 'anthropic') return <span className={lora.className} style={{ ...base, color: '#D97757' }}>{model}</span>;
  return (
    <span
      className={poppins.className}
      style={{
        ...base,
        background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 33%, #F29900 60%, #34A853 100%)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {model}
    </span>
  );
}

function Logo({ k, size, uid }: { k: BrandKey; size: number; uid: string }) {
  if (k === 'openai') return <OpenAiMark size={size} uid={uid} />;
  if (k === 'anthropic') return <AnthropicMark size={size - 2} />;
  return <GoogleColorG size={size - 1} />;
}

function ModelNode({ b, lit, uid }: { b: Brand; lit: boolean; uid: string }) {
  /* 1B 미니 슬롯(사용자 확정): 브랜드 틴트 + 로고칩 + 브랜드 타이포 모델명 */
  return (
    <div className={`vp-nd vp-slot ${lit ? 'lit' : ''}`}
      style={{ background: b.tint, borderColor: b.bd, ['--glow' as string]: `${b.color}38` }}>
      <span className="vp-slot-chip"><Logo k={b.key} size={22} uid={`${uid}-${b.key}`} /></span>
      <span className="vp-slot-tx">
        <span className="vp-vname" style={{ color: b.vtext }}>{b.vendor}</span>
        <BrandModelName k={b.key} model={b.model} size={15.5} />
      </span>
    </div>
  );
}

/* ── 파이프라인 본체 ── */
const W = 760;
const V_SEG = { viewBox: `0 0 ${W} 44`, height: 44, d: `M${W / 2} 0 L${W / 2} 44` };
const FAN_Y = 58;
const XS = [W / 6, W / 2, (5 * W) / 6];
const FAN_OUT = XS.map((x) => `M${W / 2} 0 C${W / 2} ${FAN_Y * 0.55}, ${x} ${FAN_Y * 0.45}, ${x} ${FAN_Y}`);
const FAN_IN = XS.map((x) => `M${x} 0 C${x} ${FAN_Y * 0.55}, ${W / 2} ${FAN_Y * 0.45}, ${W / 2} ${FAN_Y}`);
const BRANCH_COLORS = ['#5a5a5a', '#D97757', '#4285F4'];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function VerificationPipeline() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [litCount, setLitCount] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  const s0 = useMotionValue(0);
  const s1 = useMotionValue(0);
  const s2 = useMotionValue(0);
  const s3 = useMotionValue(0);
  const s4 = useMotionValue(0);
  const segs = [s0, s1, s2, s3, s4];

  const inView = useInView(containerRef, { once: true, margin: '-12% 0px' });
  useEffect(() => {
    if (!inView || reduced) return;
    let cancelled = false;
    (async () => {
      setLitCount(1);
      for (let i = 0; i < segs.length; i++) {
        if (cancelled) return;
        await animate(segs[i], 1, { duration: i === 1 || i === 2 ? 0.9 : 0.6, ease: 'easeInOut' }).finished;
        if (cancelled) return;
        setLitCount(i + 2);
        if (i === 3) {
          setReviewing(true);
          await delay(1050);
          if (cancelled) return;
          setReviewing(false);
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  useEffect(() => {
    if (!reduced) return;
    segs.forEach((s) => s.set(1));
    setLitCount(6);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div ref={containerRef} className="vp" aria-label="검증 파이프라인: EMR 차트가 Upstage OCR로 디지털화되고, 서로 다른 3사 모델이 병렬 요약한 뒤 불일치를 추출, 의대 교수가 최종 검토하여 감사 원장 DB에 저장">
      <Node scene={<EmrScene />} k="INPUT · 원문 무교정" t="EMR 차트" lit={litCount > 0} />
      <Connector id={`vp-c0-${uid}`} paths={[{ d: V_SEG.d, color: BLUE }]} viewBox={V_SEG.viewBox} height={V_SEG.height} progress={s0} />
      <Node
        scene={<OcrScene lit={litCount > 1} />}
        k={<span className="vp-krow"><UpstageMark size={13} uid={uid} /> UPSTAGE OCR</span>}
        t="문서 디지털화" lit={litCount > 1}
      />
      <Connector id={`vp-c1-${uid}`} fan paths={FAN_OUT.map((d, i) => ({ d, color: BRANCH_COLORS[i] }))} viewBox={`0 0 ${W} ${FAN_Y}`} height={FAN_Y} progress={s1} />
      <div className="vp-models">
        {BRANDS.map((b) => <ModelNode key={b.key} b={b} lit={litCount > 2} uid={uid} />)}
      </div>
      <Connector id={`vp-c2-${uid}`} fan paths={FAN_IN.map((d, i) => ({ d, color: BRANCH_COLORS[i] }))} viewBox={`0 0 ${W} ${FAN_Y}`} height={FAN_Y} progress={s2} />
      <Node scene={<CrossScene />} k="CROSS-CHECK" t="불일치 추출" ink lit={litCount > 3} />
      <Connector id={`vp-c3-${uid}`} paths={[{ d: V_SEG.d, color: BLUE }]} viewBox={V_SEG.viewBox} height={V_SEG.height} progress={s3} />
      <Node scene={<ProfScene reviewing={reviewing} />} k="HUMAN-IN-THE-LOOP" t="의대 교수 검토" lit={litCount > 4} />
      <Connector id={`vp-c4-${uid}`} paths={[{ d: V_SEG.d, color: BLUE }]} viewBox={V_SEG.viewBox} height={V_SEG.height} progress={s4} />
      <Node scene={<DbScene />} k="AUDIT LEDGER · 폐쇄 보관" t="DB 저장" lit={litCount > 5} />
    </div>
  );
}
