import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '400 800',
});

const SITE_TITLE = '차트원샷 — 한국어 EMR 환자 단위 시계열 요약';
const SITE_DESCRIPTION =
  '복잡한 EMR을 환자 단위 시계열 요약으로 5초 안에 정리합니다. 폐쇄망 온프레미스 LLM(MedGemma 27B) · QLoRA 분과 어댑터 · RAG · 약어 결정론적 해소. 양산부산대학교병원 임상 연구 · Team Golden Time.';

export const metadata: Metadata = {
  metadataBase: new URL('https://chartoneshot.com'),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: '차트원샷',
  keywords: [
    '차트원샷',
    'ChartOneShot',
    '골든타임',
    'Golden Time',
    'EMR 요약',
    'AI 의료',
    'MedGemma 27B',
    'RAG',
    'LangGraph',
    'QLoRA',
    'pgvector',
    'EmbeddingGemma',
    '온프레미스 LLM',
    '환자 단위 시계열 요약',
    '약어 결정론적 해소',
    '의료 AI',
    '양산부산대학교병원',
  ],
  authors: [{ name: 'Team Golden Time' }],
  creator: 'Team Golden Time',
  publisher: 'Team Golden Time',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  themeColor: '#0A1118',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: '차트원샷 — 길고 긴 EMR, 5초 안에 읽습니다',
    description:
      '복잡한 한국어 EMR을 환자 단위 시계열 요약으로 5초에 정리. MedGemma 27B + QLoRA + RAG + 약어 사전, 폐쇄망 온프레미스. Team Golden Time · 양산부산대학교병원 임상 연구.',
    siteName: '차트원샷',
  },
  twitter: {
    card: 'summary_large_image',
    title: '차트원샷 — 한국어 EMR 환자 단위 시계열 요약',
    description: '복잡한 EMR을 5초에 요약. 온프레미스 MedGemma 27B + LangGraph + RAG.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${outfit.variable} ${pretendard.variable}`}>
      {/*
        bg-[#0A1118]  → Base: Ice Blue Navy (디자인 시스템 1번)
        text-white/90 → Neutral 01 기반, 본문은 살짝 낮춰 위계 확보
        font-sans     → Pretendard + Outfit 합쳐서 사용 (globals.css에서 정의)
      */}
      <body 
  className="min-h-screen bg-[#0A1118] text-white/90 antialiased"
  style={{ fontFamily: 'var(--font-body)' }}
  >
  {children}
      </body>
    </html>
  );
}