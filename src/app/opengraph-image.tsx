import { ImageResponse } from 'next/og';

// OG image — Vercel deploy 시 동적 생성, root에 자동 매핑
// (Next.js App Router 규칙: app/opengraph-image.tsx → metadata.openGraph.images 자동 inject)
// runtime 명시 X (Next 16 default = Fluid Compute Node.js — edge보다 호환 ↑)

export const alt = '차트원샷 — 길고 긴 EMR, 5초 안에 읽습니다';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // 한글 폰트 fetch — satori(ImageResponse 내부)는 시스템 폰트 없음 → 명시 필요
  // 실패 시 image는 생성하되 한글이 깨질 수 있음
  let pretendardBold: ArrayBuffer | null = null;
  try {
    const res = await fetch(
      // satori는 woff2 미지원 — woff/ttf/otf만 OK
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff',
      { cache: 'force-cache' },
    );
    if (res.ok) pretendardBold = await res.arrayBuffer();
  } catch {
    // swallow — fonts undefined로 fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #030712 0%, #061224 100%)',
          padding: '72px 96px',
          color: '#e5e7eb',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent glow blob — top right (blue) */}
        <div
          style={{
            position: 'absolute',
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: 'rgba(24,74,255,0.45)',
            filter: 'blur(140px)',
            display: 'flex',
          }}
        />
        {/* Accent glow blob — bottom left (blue) */}
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: 'rgba(59,130,246,0.35)',
            filter: 'blur(140px)',
            display: 'flex',
          }}
        />

        {/* Foreground content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: 22,
              color: '#60A5FA',           // 밝은 블루
              letterSpacing: 4,
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: 32,
              display: 'flex',
            }}
          >
            Next-Gen Longitudinal EMR AI
          </div>

          {/* H1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: '#f3f4f6',
              marginBottom: 36,
            }}
          >
            <div style={{ display: 'flex' }}>길고 긴 EMR,</div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: '#184AFF', marginRight: 24 }}>5초 안에</span>
              차트원샷이 읽습니다
            </div>
          </div>

          {/* Sub */}
          <div
            style={{
              fontSize: 28,
              color: '#9ca3af',
              display: 'flex',
              marginBottom: 'auto',
            }}
          >
            의사 25분 → 5초 · MedGemma 27B · 폐쇄망 온프레미스
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              color: '#6b7280',
              fontSize: 22,
              marginTop: 56,
            }}
          >
            <div style={{ display: 'flex' }}>차트원샷 · Team Golden Time</div>
            <div style={{ display: 'flex', color: '#9ca3af' }}>chartoneshot.com</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: pretendardBold
        ? [
            {
              name: 'Pretendard',
              data: pretendardBold,
              style: 'normal',
              weight: 700,
            },
          ]
        : undefined,
    },
  );
}