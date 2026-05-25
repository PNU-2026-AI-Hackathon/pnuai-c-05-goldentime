// 환자 단위 시계열 요약 도메인 타입
// 파이프라인: 약어 사전 lookup → RAG(pgvector + EmbeddingGemma 300M)
//           → MedGemma 27B(QLoRA 분과 어댑터, vLLM 서빙) → 원문 인용 검증

export type CaseCategory =
  | 'chronic'      // 만성질환 추적
  | 'multidrug'    // 다약제 복용
  | 'multispec'    // 다분과 협진
  | 'postop'       // 수술 후 추적
  | 'oncology'     // 종양 추적
  | 'observation'; // 일반 외래 관찰

// 타임라인 이벤트 레이어 — primary(주요 질환, 화살표 위) vs incidental(부수 이슈, 화살표 아래 hover expand)
export type TimelineLayer = 'primary' | 'incidental';

export interface TimelineEvent {
  date: string;          // "2026.01.23"
  event: string;
  sourceChunkId: string; // 환각 방지 인용 (RAG 청크 ID)
  layer: TimelineLayer;  // 시각화 레이어
}

export interface ResolvedIssue {
  issue: string;
  duration: string;      // "2023.1 발생 → 2023.3 호전"
  note?: string;
  sourceChunkId: string;
}

export interface CurrentState {
  diagnoses: string[];                 // 시점·용량 포함
  complaint: string;
  recent_labs: Record<string, string>; // key-value (BP, HbA1c, Cr 등)
  medications: string[];
}

export interface AbbreviationEntry {
  abbrev: string;                     // "f/u"
  expansion: string | null;           // "follow-up" — null이면 미등재
  status: 'resolved' | 'unregistered';
}

// 환자의 핵심 질환 — 차트원샷이 잡아야 할 핵심 신호
// 반복되는 EMR noise 속에서 "이 환자에서 의사가 진짜 봐야 할 trend"
export interface PrimaryConcern {
  title: string;          // "간 이식 후 추적"
  summary: string;        // 한 줄 요약
  key_trends: string[];   // 핵심 trend (AST/ALT 정상→이상→정상 같은 시계열 변화)
}

export interface PatientTimelineSummary {
  patient_label: string;              // "65세 여성 · 만성질환 외래"
  primary_concern: PrimaryConcern;    // ⭐ 주요 질환 — 차트원샷이 잡아야 할 핵심
  case_summary: string;               // 한 줄 케이스 (typing effect용)
  current_state: CurrentState;
  resolved_issues: ResolvedIssue[];
  timeline: TimelineEvent[];          // layer로 primary/incidental 분리
  abbreviations: AbbreviationEntry[];
  citations_count: number;            // 원문 인용 청크 총 개수
}

export interface Patient {
  id: string;
  caseSummary: string;       // 카드용 ("간이식 추적 + 외상·알레르기 episode")
  caseCategory: CaseCategory;
  demographics: string;      // "52세 남성"
  emrText: string;           // 한 환자의 다수 외래/입원 차수 원본 (S/O/A/P)
  fileName?: string;
  expectedResult: PatientTimelineSummary;
}

export interface N8NResponse {
  success: boolean;
  data?: PatientTimelineSummary;
  error?: string;
  message?: string;
}

export type WorkflowStep = {
  label: string;
  status: 'pending' | 'in_progress' | 'completed';
};
