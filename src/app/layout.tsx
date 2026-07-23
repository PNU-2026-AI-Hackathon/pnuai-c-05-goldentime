import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_KR, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PeerReviewModal from '@/components/PeerReviewModal';

// gatherEMR와 동일한 IBM Plex 폰트 계열
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
});

const plexSansKR = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-kr',
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
});

const SITE_TITLE = '차트원샷 — 한국어 EMR 환자 단위 시계열 요약';
const SITE_DESCRIPTION =
  '복잡한 한국어 EMR을 분과 관점으로 요약합니다. 식별정보를 가린 비식별본만 처리하고(원문 미저장), 문장마다 원문 인용을 강제해 환각을 억제합니다. 25개 진료과 · 멀티포맷 입력. Team Golden Time.';

export const viewport = { themeColor: '#EAF1FF' };

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
    '비식별',
    '분과별 요약',
    '원문 인용',
    '환각 억제',
    '멀티포맷 OCR',
    '환자 단위 시계열 요약',
    '의료 AI',
  ],
  authors: [{ name: 'Team Golden Time' }],
  creator: 'Team Golden Time',
  publisher: 'Team Golden Time',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: SITE_TITLE,
    description:
      '복잡한 한국어 EMR을 분과 관점으로 요약. 비식별본만 처리(원문 미저장) · 문장마다 원문 인용으로 환각 억제. Team Golden Time.',
    siteName: '차트원샷',
  },
  twitter: {
    card: 'summary_large_image',
    title: '차트원샷 — 한국어 EMR 환자 단위 시계열 요약',
    description: '복잡한 EMR을 분과 관점으로 요약. 비식별 처리 · 문장마다 원문 인용으로 환각 억제.',
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
    <html lang="ko" className={`${plexSans.variable} ${plexSansKR.variable} ${plexMono.variable}`}>
      {/*
        bg-[#EAF1FF]  → Base: Ice Blue White (라이트모드 · 디자인 시스템 v2)
        text ink      → Neutral Ink #101822 (globals.css body에서 정의)
        font-sans     → Pretendard + Outfit 합쳐서 사용 (globals.css에서 정의)
      */}
      <body
        className="min-h-screen bg-[#EAF1FF] text-[color:var(--color-text-primary)] antialiased"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        <Navigation />
        <main className="pt-[96px]">{children}</main>
        <Footer />
        {/* 전역 Peer Review 모달 — 네비/검증 CTA에서 페이지 이동 없이 오픈 */}
        <PeerReviewModal />
      </body>
    </html>
  );
}