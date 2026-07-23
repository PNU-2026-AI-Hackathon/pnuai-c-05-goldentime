/* 타입 발췌 — 전체 summarize.ts는 비공개 저장소에 있습니다.
   vitals.ts가 참조하는 부분만 그대로 옮겨 발췌가 자립해 읽히도록 했습니다. */
export type Label = 'explicit' | 'derived' | 'uncertain';
export type Span = { start: number; end: number };

export type ResolvedItem = {
  text: string;
  label: Label;
  citations: string[];
  quote?: string;
  span: Span;
  /** 근거 범위의 정밀도. 'chunk' = 모델이 인용 구절을 안 줘서 청크 전체를 범위로 잡은 것. */
  spanKind?: 'chunk';
};
