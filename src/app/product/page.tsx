import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Metrics from '@/components/Metrics';
import InteractiveDemo from '@/components/InteractiveDemo';
import DoctorChallenge from '@/components/DoctorChallenge';

export const metadata = { title: '제품 — 차트원샷' };

/* 공개 저장소 버전 — 라이브 사이트의 제품 소개 화면 중, 검증 파이프라인과 연결된
   섹션(공개 findings·실행 기록)은 제외했습니다. 해당 섹션의 실제 동작은 라이브
   사이트에서 확인하실 수 있습니다. */
export default function ProductPage() {
  return (
    <>
      <Features />
      <HowItWorks />
      <Metrics />
      <InteractiveDemo />
      <DoctorChallenge />
    </>
  );
}
