'use client';

/* 공개 저장소 버전 — 대체 구현.
   실제 Peer Review(다중 모델 교차 검증) 화면은 검증 파이프라인과 직접 연결돼 있어
   이 저장소에서는 제외했습니다. 여기서는 동일한 인터페이스를 유지하되, 라이브
   사이트의 해당 화면으로 안내합니다. 실제 동작은 라이브 사이트에서 확인하실 수 있습니다. */

export const OPEN_EVENT = 'cos:peer-review-open';

const LIVE_URL = 'https://chartoneshot-demo.vercel.app/peer-review';

export function openPeerReview() {
  if (typeof window !== 'undefined') window.open(LIVE_URL, '_blank', 'noopener');
}

export default function PeerReviewModal() {
  return null;
}
