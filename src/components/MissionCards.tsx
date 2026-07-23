/* Mission/Journey/Product — D3 'Unfolding Statement' (/mission-preview 3안 중 사용자 확정 2026-07-18).
   확신에 찬 브랜드 선언(블루 패널)이 섹션을 이끌고, 세 상세는 오른쪽 접힘(details)으로.
   본문 3개는 기존 문구 그대로 — 무창작. JS 불필요(네이티브 details/summary). */

const CARDS = [
  {
    id: 'mission',
    title: ['Our', 'Mission'],
    body:
      '긴 기록을 읽느라 흘려보내는 시간이 환자의 골든타임을 갉아먹지 않게 — 흩어진 EMR을 분과 관점의 한 장으로 정리해, 의료진이 판단과 환자에게 더 오래 집중하도록 만듭니다. 여러 차례 방문한 외래·장기 추적 환자의 기록을 하나의 시계열로 잇는 것이 우리가 푸는 문제입니다.',
  },
  {
    id: 'journey',
    title: ['Our', 'Journey'],
    body:
      '임상 현장의 문제의식에서 출발했습니다. 임상 자문을 반영해 분과별 특화 모델을 다듬어 갈 계획이며, 연구 협력 형태의 참여를 환영합니다.',
  },
  {
    id: 'product',
    title: ['Our', 'Product'],
    body:
      '긴 EMR을 한눈에 하나의 타임라인으로 압축하는 요약 엔진입니다. Split View 대조, 환자 단위 시계열 요약, 약어·은어 풀이, 폐쇄망 데이터 주권 — 4가지 핵심 기능으로 구성됩니다.',
  },
] as const;

export default function MissionCards() {
  return (
    <div className="grid items-stretch gap-[18px] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      {/* 선언 패널 */}
      <div
        className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[32px] p-8 md:p-12 lg:min-h-[520px]"
        style={{ background: 'var(--color-accent)' }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-[34%] left-[18%] -right-[18%] h-[360px] rounded-full blur-[40px]"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.24), rgba(255,255,255,0))' }}
        />
        <h2 className="font-display relative z-[1] max-w-[640px] text-[clamp(34px,4.6vw,64px)] font-extrabold leading-[1.04] tracking-[-0.02em] text-white">
          긴 EMR을,
          <br />판단 가능한
          <br /><span className="whitespace-nowrap">한 장의 흐름으로.</span>
        </h2>
        <p className="relative z-[1] mt-10 max-w-[520px] text-[15px] leading-[1.85] text-white/85">
          흩어진 기록을 하나의 임상 서사로 잇습니다. 우리가 푸는 문제, 걸어온 길, 만들고 있는 제품 —
          세 항목에 담았습니다.
        </p>
      </div>

      {/* 접힘 상세 3 */}
      <div className="grid content-start gap-3">
        {CARDS.map((card, i) => (
          <details
            key={card.id}
            open={i === 0}
            className="card rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-[3px] open:bg-white/95"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
              <h3 className="font-display text-[clamp(24px,3vw,34px)] font-bold leading-[1.12] tracking-[-0.01em] text-[color:var(--color-text-primary)]">
                {card.title[0]}
                <br />
                {card.title[1]}
              </h3>
              <span
                className="shrink-0 rounded-full border px-2.5 py-1.5 text-[11px]"
                style={{
                  borderColor: 'var(--color-accent-border)',
                  color: 'var(--color-accent)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </summary>
            <p className="mt-5 text-[15px] leading-[1.85]" style={{ color: 'var(--color-text-body)' }}>
              {card.body}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
