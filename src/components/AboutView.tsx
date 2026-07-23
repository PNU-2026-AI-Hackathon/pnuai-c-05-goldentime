'use client';

import { useState, useId, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Award, Plus } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useTypingEffect } from '@/hooks/useTypingEffect';

/* ─────────────────────────────────────────────
   About us — Team Golden Time (협력 + 팀 통합)
   병합 배경: 협력(자문단·협력절차)과 팀 소개를 하나의
   "우리를 소개합니다" 서사로 통합. 순서 = 자문·협력 → 팀원.
   디자인 원칙: 전 섹션 좌측정렬 eyebrow(section-label)+헤딩으로
   일관화(배지 제거), 모든 그리드 동일 max-w로 정렬.
   주의: 학위·직함·업적·자문 신원을 임의 창작 금지 — 기존 데이터만 이전.
   지도교수(이선민)만 실명, 그 외 자문은 유형·명수로만(팀 방침).
───────────────────────────────────────────── */

type Entry = string | { text: string; date?: string };
function toEntry(e: Entry): { text: string; date?: string } {
  return typeof e === 'string' ? { text: e } : e;
}

type Member = {
  name: string;
  photo: string;
  role: string;
  affiliation: string;
  history: Entry[];
  awards: Entry[];
  certs?: string[];
};

const members: Member[] = [
  {
    name: '조호영',
    photo: '/team/jo-hoyoung.png',
    role: '대표 · 의학 총괄',
    affiliation: '부산대학교 의학과',
    history: [
      '인천영재고 졸업, 카이스트 중퇴',
      '現 부산의대 23학번 총대',
      '現 대한의과대학생전공의창업회 의료학술국원',
      '現 의학교육논단 학생편집위원',
      '現 이음 펠로우쉽',
      '現 foursummer 앰버서더',
      '前 양산부산대병원 재활병원 학부연구생',
      '前 협성 DT.15 전체대표',
    ],
    awards: ['제9회 메디컬 해커톤 우수상', '제1회 의학교육논단 학생연구자상 대상'],
  },
  {
    name: '김용하',
    photo: '/team/kim-yongha.png',
    role: '데이터 · AI 엔지니어',
    affiliation: '부산대학교 데이터사이언스전공',
    history: [
      { text: '現 부산대 의대 교육혁신 도구 CPX 개발 과제 진행중' },
      '現 2026 국가데이터처 사이트 유지보수 및 피드백 모니터단',
      '前 2025 국가데이터처 사이트 유지보수 및 피드백 모니터단',
    ],
    awards: [
      '학생 창업 유망 경진대회 교육부 장관상',
      '금정 유스콘 경진대회 우수상',
      '창업 아이디어 해커톤 경진대회 부산대학교 총장상',
      '2026 청년창조발전소 4회 경진대회 우수상',
    ],
    certs: ['정보처리기사', '빅데이터분석기사', 'SQLD/ADsP', 'Network Advisor 2', 'Google Data Analytics', 'NVIDIA DLI'],
  },
  {
    name: '박보은',
    photo: '/team/park-boeun.png',
    role: 'UI/UX 디자이너',
    affiliation: '부산대학교 디자인앤테크놀로지전공',
    history: [
      '2028 세계디자인수도 영웨이브 디자인단',
      '다수 외주 진행 및 스튜디오 총괄 디렉터',
      '現 정보컴퓨터공학부 디자이너 학부연구생',
      '前 제36대 부산대 예술대학 학생회 홍보국장',
      '前 제37대 부산대 예술대학 학생회 소통홍보국장',
      '前 블록체인플랫폼연구센터 디자이너',
      "前 2026 부산대 대동제 '피우리오' TF팀 홍보마케팅팀",
    ],
    awards: [
      '부산대학교 디자인학과 국가우수장학생',
      'BNK디지털혁신챌린지 해커톤 최우수상',
      '창업아이디어해커톤 경진대회 대상',
      '부산대학교 PPT 템플릿 공모전 최우수상',
    ],
  },
];

/* 자문을 "분야" 단위로 표시 — 의학·기술·법률·창업 네 축에서 도움받고 있음을 드러내는 게 의도.
   [규율] 신원·직함·유형 임의 창작 금지(팀 방침). 지도교수(이선민)만 실명, 그 외는 유형·명수로만.
   기술 = 별도 전문가가 아니라 타 분야 교수진 피드백(용하 확인). */
/* 자문 4분야 — 닫힘 = 제목 + 한 줄(무엇을 봐주시는지) / 펼침 = 무엇을 누구에게 자문받는지 + 구성.
   [규율] 신원·직함·인원수 임의 창작 금지. 지도교수(이선민)만 실명, 그 외는 유형·명수로만. */
type Field = { domain: string; summary: string; detail: string; members: string[]; count?: string };
const fields: Field[] = [
  {
    domain: '의학 자문',
    summary: '요약이 임상적으로 맞는지, 화면이 실제 진료에서 쓸 만한지 봐주십니다.',
    detail: '임상 관점에서의 요약과 UI/UX 피드백을 의대 교수님·분과별 의사들에게 자문받고 있습니다.',
    members: ['의대 교수 · 분과별 전문의', '지도교수 · 이선민 교수님 (양산부산대병원 빅데이터센터)'],
  },
  {
    domain: '기술 자문',
    summary: '데이터 파이프라인 설계와 모델 검증이 탄탄한지 짚어주십니다.',
    detail: '기술적 파이프라인 설계와 검증을 교수님·박사님·연구원에게 자문받고 있습니다.',
    members: ['교수 · 박사 · 연구원'],
  },
  {
    domain: '법률 자문',
    summary: '개인정보 보호법과 의료 데이터 윤리를 잘 지키고 있는지 검토해주십니다.',
    detail: '개인정보 보호법과 윤리 등 법률적 검토를 변호사들에게 자문받고 있습니다.',
    members: ['자문 변호사'],
    count: '2인',
  },
  {
    domain: '창업 자문',
    summary: 'BM과 창업준비를 조언해주십니다.',
    detail: 'BM 설계와 창업준비를 투자심사역·액셀러레이터·CEO에게 자문받고 있습니다.',
    members: ['투자심사역 · 액셀러레이터 · CEO'],
    count: '6인',
  },
];

/* 팀 공동으로 "진행 중"인 것들 — 개인 수상경력(members[].awards)과 절대 섞지 않는다.
   [규율] 결과가 안 나온 것을 수상으로 적지 않는다. 단계(1차 통과·예선 통과)까지만 사실이고
   그 다음은 미확정이므로, 화면에도 '진행 중'을 못 박아 표시한다. */
type Ongoing = { name: string; stage: string };
const ongoing: Ongoing[] = [
  { name: '모두의 창업', stage: '1차 통과 · 2차 진행 중' },
  { name: '핀넥트', stage: '1차 통과 · 2차 진행 중' },
  { name: '창의융합 AI 해커톤', stage: '예선 통과 · 본선 진행 중' },
  { name: '의대 교육혁신 도구개발 과제', stage: '진행 중' },
];

/* ── 공통 섹션 헤더 — 전 섹션 동일 좌측정렬 eyebrow+heading (일관화 핵심) ── */
function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <span className="section-label" data-animate="fade-up">{eyebrow}</span>
      <h2
        data-animate="fade-up"
        className="font-display mt-3 text-[1.7rem] font-semibold tracking-[-0.025em] text-[color:var(--color-text-primary)] lg:text-[2.1rem]"
      >
        {title}
      </h2>
      {desc && (
        <p data-animate="fade-up-1" className="mt-4 text-[14.5px] leading-[1.7]" style={{ color: 'var(--color-text-body)' }}>
          {desc}
        </p>
      )}
    </div>
  );
}

/** 시제 배지(現/前) 여부 — 점↔배지 경계 간격 판정용. */
export function hasTense(e: Entry): boolean {
  return /^(現|前)/.test(toEntry(e).text);
}

/* 이력 항목 — 現/前 시제 배지 + 날짜. boundary=점↔배지 경계(위 항목과 유형이 다름)면 간격 추가. */
function HistoryItem({ entry, boundary }: { entry: Entry; boundary?: boolean }) {
  const { text, date } = toEntry(entry);
  const m = text.match(/^(現|前)\s*(.*)$/);
  const tense = m ? m[1] : null;
  const rest = m ? m[2] : text;
  const isNow = tense === '現';
  return (
    <li className={`flex items-start gap-2${boundary ? ' mt-1.5' : ''}`}>
      {tense ? (
        <span
          className="mt-[1px] shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
          style={
            isNow
              ? { background: 'var(--color-accent-subtle)', color: 'var(--color-accent)', border: '1px solid var(--color-accent-border)', fontFamily: 'var(--font-mono)' }
              : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-mono)' }
          }
        >
          {tense}
        </span>
      ) : (
        /* 점을 배지(現/前)와 같은 폭 슬롯 중앙에 — 텍스트 시작 열이 배지 행과 정렬되도록 */
        <span className="mt-[7px] flex w-6 shrink-0 justify-center">
          <span className="h-1 w-1 rounded-full" style={{ background: 'var(--color-accent)' }} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[12.5px] leading-[1.55]" style={{ color: 'var(--color-text-body)' }}>{rest}</span>
        {date && (
          <span className="mt-0.5 block text-[10.5px] tracking-wide" style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>{date}</span>
        )}
      </span>
    </li>
  );
}

function DetailLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2.5 inline-block text-[10.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
      {children}
    </span>
  );
}

function MemberCard({ member, delay }: { member: Member; delay: string }) {
  // 상세는 기본 펼침 고정(호버 불필요) — 버튼으로만 접기/펴기.
  const [open, setOpen] = useState(true);
  const reduced = useReducedMotion();
  const panelId = useId();
  return (
    <div data-animate={delay} className="card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #C6D2F0 0%, #B3C3E4 100%)' }}>
        <Image src={member.photo} alt={`${member.name} 프로필 사진`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain object-bottom" priority={false} />
      </div>
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] text-[color:var(--color-text-primary)]">{member.name}</h3>
          <div className="mt-1 text-[13px] font-semibold" style={{ color: 'var(--color-accent)' }}>{member.role}</div>
          <div className="mt-1 text-[12.5px] font-medium" style={{ color: 'var(--color-text-muted)' }}>{member.affiliation}</div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `${member.name} 상세 접기` : `${member.name} 상세 보기`}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all"
          style={{ border: `1px solid ${open ? 'var(--color-accent-border)' : 'var(--color-border)'}`, background: open ? 'var(--color-accent-subtle)' : 'var(--color-surface)', color: 'var(--color-accent)' }}
        >
          <Plus size={18} strokeWidth={2} className="transition-transform duration-300" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }} />
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="detail" id={panelId} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26, mass: 0.9 }} style={{ overflow: 'hidden' }}>
            <div className="border-t px-5 pb-6 pt-5" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <DetailLabel>이력</DetailLabel>
                <ul className="flex flex-col gap-2">
                  {member.history.map((h, i) => (
                    <HistoryItem
                      key={toEntry(h).text}
                      entry={h}
                      boundary={i > 0 && hasTense(h) !== hasTense(member.history[i - 1])}
                    />
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <DetailLabel>수상경력</DetailLabel>
                <ul className="flex flex-col gap-2">
                  {member.awards.map((a) => {
                    const { text, date } = toEntry(a);
                    return (
                      <li key={text} className="flex items-start gap-2">
                        <Award size={13} strokeWidth={2} className="mt-[3px] shrink-0" style={{ color: 'var(--color-accent)' }} />
                        <span className="min-w-0">
                          <span className="block text-[12.5px] leading-[1.55]" style={{ color: 'var(--color-text-body)' }}>{text}</span>
                          {date && <span className="mt-0.5 block text-[10.5px] tracking-wide" style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)' }}>{date}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {member.certs && member.certs.length > 0 && (
                <div className="mt-6">
                  <DetailLabel>자격증</DetailLabel>
                  <ul className="flex flex-col gap-2">
                    {member.certs.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: 'var(--color-accent)' }} />
                        <span className="text-[12.5px] leading-[1.55]" style={{ color: 'var(--color-text-body)' }}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 아코디언 — 마우스는 호버로 열리고, 클릭하면 고정(터치·키보드 대응).
   호버만으로 열면 터치 기기와 키보드 사용자가 상세를 볼 방법이 없어진다. */
function FieldCard({ field }: { field: Field }) {
  const [hover, setHover] = useState(false);
  const [pinned, setPinned] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();
  const open = pinned || hover;
  return (
    <div
      className="card flex h-full flex-col p-5 transition-shadow"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ borderColor: open ? 'var(--color-accent-border)' : undefined }}
    >
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full cursor-pointer items-start justify-between gap-2 text-left"
      >
        <span className="text-[17px] font-bold tracking-[-0.01em] text-[color:var(--color-text-primary)]">{field.domain}</span>
        <Plus
          size={16}
          strokeWidth={2}
          className="mt-1 shrink-0 transition-transform duration-300"
          style={{ color: 'var(--color-accent)', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        />
      </button>
      <p className="mt-2 flex-1 text-[13px] font-light leading-[1.7]" style={{ color: 'var(--color-text-body)' }}>{field.summary}</p>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 340, damping: 28, mass: 0.8 }}
            style={{ overflow: 'hidden' }}
          >
            <p className="mt-3 text-[12.5px] font-light leading-[1.75]" style={{ color: 'var(--color-text-muted)' }}>
              {field.detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-col gap-1 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
        {/* 인원수는 별도 줄로 빼지 않고 마지막 구성 줄에 붙여 같은 색으로 — "자문 변호사 2인". */}
        {field.members.map((m, i) => (
          <span key={m} className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--color-accent-hover)' }}>
            {m}{field.count && i === field.members.length - 1 ? ` ${field.count}` : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 자문 상세 한 줄만 타이핑으로 — 발표장에서 타이핑은 "읽는 경험"이 아니라 "기다리는 시간"이라
   규율을 걸었다: ① 짧은 문장 1개에만(전 섹션 금지) ② 누르면 즉시 전체 표시로 스킵
   ③ 한 번 본 패널은 다시 재생하지 않음 ④ prefers-reduced-motion이면 타이핑 없음. */
function TypedDetail({ text, play, onSkip }: { text: string; play: boolean; onSkip: () => void }) {
  const reduced = useReducedMotion();
  const enabled = play && !reduced;
  const { displayed, done } = useTypingEffect(text, 18, enabled);
  const shown = enabled ? displayed : text;
  return (
    <span
      onClick={(e) => { if (enabled && !done) { e.stopPropagation(); onSkip(); } }}
      className="mt-2 block text-[12.5px] font-light leading-[1.75]"
      style={{ color: 'var(--color-text-muted)' }}
      title={enabled && !done ? '누르면 바로 전체를 봅니다' : undefined}
    >
      {shown}
      {enabled && !done && <span style={{ opacity: 0.5 }}>▌</span>}
    </span>
  );
}

/* 가로 레일 아코디언 — 네 패널이 틈 없이 한 띠로 붙어 있다가, 고른 하나만 넓어지고
   나머지는 좁아진다(용하 선택 1안). 유기성 = 끊기지 않는 하나의 검토 띠.
   좁아져도 제목은 가로로 유지된다(세로로 눕히면 가독성이 무너진다 — 1안의 알려진 위험).
   호버/포커스로 미리보기, 클릭으로 고정. 데스크톱 전용 — 모바일은 세로 아코디언 폴백. */
function CollaboratorRail({ fields }: { fields: Field[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState(0);
  const [typed, setTyped] = useState<Set<number>>(new Set()); // 이미 타이핑을 본 패널
  const reduced = useReducedMotion();
  const activeIdx = hovered ?? pinned;
  const markTyped = (i: number) => setTyped((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));

  return (
    <div className="mt-10 lg:mt-12">
      <div
        className="flex overflow-hidden rounded-[20px] border"
        style={{ borderColor: 'var(--color-border)', background: '#fff', minHeight: 280 }}
        onMouseLeave={() => setHovered(null)}
      >
        {fields.map((f, i) => {
          const on = i === activeIdx;
          return (
            <button
              key={f.domain}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => setPinned(i)}
              aria-expanded={on}
              aria-pressed={i === pinned}
              className="flex cursor-pointer flex-col items-start overflow-hidden p-5 text-left"
              style={{
                flex: on ? '3.4 1 0%' : '1 1 0%',
                minWidth: 0,
                borderLeft: i === 0 ? 'none' : '1px solid var(--color-border)',
                background: on ? 'var(--color-accent-subtle)' : 'transparent',
                transition: reduced ? undefined : 'flex 0.42s cubic-bezier(0.22,0.61,0.36,1), background 0.3s',
              }}
            >
              <span
                className="whitespace-nowrap text-[15px] font-bold tracking-[-0.01em] lg:text-[16px]"
                style={{ color: on ? 'var(--color-accent-hover)' : 'var(--color-text-primary)' }}
              >
                {f.domain}
              </span>

              {/* 펼쳐진 패널에만 내용. 좁은 패널에서 글자가 삐져나오지 않도록 opacity+지연 전이. */}
              <span
                className="mt-3 flex min-w-0 flex-1 flex-col"
                style={{
                  opacity: on ? 1 : 0,
                  visibility: on ? 'visible' : 'hidden',
                  transition: reduced ? undefined : `opacity 0.28s ${on ? '0.14s' : '0s'}`,
                }}
              >
                <span className="text-[13.5px] font-light leading-[1.75]" style={{ color: 'var(--color-text-body)' }}>
                  {f.summary}
                </span>
                {on
                  ? <TypedDetail text={f.detail} play={!typed.has(i)} onSkip={() => markTyped(i)} />
                  : <span className="mt-2 block text-[12.5px] font-light leading-[1.75]" style={{ color: 'var(--color-text-muted)' }}>{f.detail}</span>}
                <span className="mt-auto flex flex-col gap-1 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                  {f.members.map((m, j) => (
                    <span key={m} className="text-[12px] font-medium leading-relaxed" style={{ color: 'var(--color-accent-hover)' }}>
                      {m}{f.count && j === f.members.length - 1 ? ` ${f.count}` : ''}
                    </span>
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-2.5 text-[11.5px]" style={{ color: 'var(--color-text-muted)' }}>
        패널에 올려두면 펼쳐지고, 누르면 고정됩니다.
      </p>
    </div>
  );
}

/* 협력 절차 도식: 문의 ∩ 범위 협의 → 승인된 절차 */
function CoopDiagram() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-6">
      <div className="flex items-center">
        <div className="flex h-32 w-32 items-center justify-center rounded-full text-[14px] font-medium text-[color:var(--color-text-primary)] sm:h-36 sm:w-36" style={{ border: '1px solid var(--color-accent-border)', background: 'rgba(255,255,255,0.45)' }}>문의</div>
        <div className="-ml-8 flex h-32 w-32 items-center justify-center rounded-full text-[14px] font-medium text-[color:var(--color-text-primary)] sm:h-36 sm:w-36" style={{ border: '1px solid var(--color-accent-border)', background: 'rgba(255,255,255,0.45)' }}>범위 협의</div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-px w-8" style={{ background: 'var(--color-accent-border)' }} />
        <span className="h-2 w-2 rounded-full" style={{ background: 'var(--color-accent)' }} />
      </div>
      <div className="flex h-40 w-40 items-center justify-center rounded-full" style={{ background: 'var(--color-accent-subtle)' }}>
        <div className="flex h-32 w-32 items-center justify-center rounded-full" style={{ background: 'var(--color-accent-soft)' }}>
          <div className="flex h-24 w-24 items-center justify-center rounded-full text-center text-[12.5px] font-semibold leading-tight text-white" style={{ background: 'var(--color-accent)' }}>승인된 절차<br />안에서 진행</div>
        </div>
      </div>
    </div>
  );
}

export default function AboutView() {
  const ref = useScrollAnimation();
  return (
    <section ref={ref} className="relative overflow-hidden py-20 lg:py-28">
      {/* 은은한 배경 광원 */}
      <div
        className="pointer-events-none absolute"
        style={{ top: '6%', left: '50%', transform: 'translateX(-50%)', width: '820px', height: '500px', background: 'radial-gradient(ellipse, rgba(24,74,255,0.11) 0%, rgba(24,74,255,0) 70%)', filter: 'blur(56px)' }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        {/* ── Intro (배지 제거, 좌측정렬) ── */}
        <div className="max-w-3xl">
          <span className="section-label" data-animate="fade-up">About us</span>
          <h1 data-animate="fade-up" className="font-display mt-4 text-[2.1rem] font-semibold tracking-[-0.03em] text-[color:var(--color-text-primary)] lg:text-[2.7rem]">
            Team Golden Time
          </h1>
          <p data-animate="fade-up-1" className="mt-5 text-[15px] leading-[1.7]" style={{ color: 'var(--color-text-body)' }}>
            팀 이름은 응급의학의 <span className="text-[color:var(--color-text-primary)]">‘골든타임’</span>에서 왔습니다 — 환자의 운명을 가르는 결정적 시간을 지킨다는 뜻입니다.
            차트원샷은 임상 현장의 조언 위에서, 팀 전원의 신원을 투명하게 공개하며 만들어 갑니다.
          </p>
        </div>

        {/* ── 1) 자문·협력 (Collaborators) ── */}
        <div className="mt-20 lg:mt-28">
          <SectionHeader
            eyebrow="Collaborators"
            title="함께 해주시는 분들"
            desc="차트원샷은 한 분야의 조언만으로 만들 수 없습니다. 의학·기술·법률·창업 네 분야에서 각각 자문을 받으며 진행하고 있습니다."
          />
          {/* 데스크톱 = 코어 궤도 / 모바일 = 아코디언 목록(원형 배치가 좁은 폭에서 무너진다) */}
          <div data-animate="fade-up-1" className="hidden md:block">
            <CollaboratorRail fields={fields} />
          </div>
          <div data-animate="fade-up-1" className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
            {fields.map((f) => <FieldCard key={f.domain} field={f} />)}
          </div>

          {/* 협력 절차 */}
          <div className="mt-20 lg:mt-24">
            <DetailLabel>Cooperation procedure</DetailLabel>
            <h3 data-animate="fade-up" className="font-display text-[1.4rem] font-semibold tracking-[-0.02em] text-[color:var(--color-text-primary)] lg:text-[1.7rem]">
              협력 절차
            </h3>
            <div data-animate="fade-up-1" className="mt-10">
              <CoopDiagram />
            </div>
            <div data-animate="fade-up-1" className="mt-10 max-w-2xl">
              <p className="text-[14.5px] font-semibold text-[color:var(--color-text-primary)]">
                자문은 연구 방향에 대한 조언에 한하며, 전달된 자료의 관리 책임은 골든타임팀에 있습니다.
              </p>
              <p className="mt-1.5 text-[13.5px] font-light" style={{ color: 'var(--color-text-muted)' }}>
                연구 협력 형태의 참여를 환영하며, 관련 절차와 데이터 거버넌스를 갖춰 나가고 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2) 팀원 (Team) ── */}
        <div className="mt-24 lg:mt-32">
          <SectionHeader
            eyebrow="Team"
            title="팀원 소개"
            desc="팀 전원의 역할·소속과 이력·수상경력을 투명하게 공개합니다. 카드를 열면 상세 이력이 펼쳐집니다."
          />
          <div className="mt-10 grid grid-cols-1 items-start gap-5 md:grid-cols-3 lg:mt-12">
            {members.map((member, i) => (
              <MemberCard key={member.name} member={member} delay={['fade-up', 'fade-up-1', 'fade-up-2'][i] ?? 'fade-up'} />
            ))}

            {/* 팀 공동 진행 항목 — 개인 카드가 아니라 팀 전체의 공통 카드라서 한 행을 통째로 쓴다.
                개인 수상경력(members[].awards)과는 계속 분리하고, 결과 미확정임을 문구로 명시. */}
            <div data-animate="fade-up-2" className="card p-5 md:col-span-3">
              <DetailLabel>팀이 함께 진행 중</DetailLabel>
              <div className="mt-1 grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                {ongoing.map((o) => (
                  <div key={o.name} className="flex flex-col gap-0.5 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                    <span className="text-[13px] font-semibold text-[color:var(--color-text-primary)]">{o.name}</span>
                    <span className="text-[11.5px]" style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>{o.stage}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11.5px]" style={{ color: 'var(--color-text-muted)' }}>
                <b>아직 결과가 나오지 않은 진행 중인 활동</b>입니다 — 수상 실적이 아니라 현재 단계 그대로 적었습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
