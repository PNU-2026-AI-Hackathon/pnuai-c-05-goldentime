import type { ResolvedItem } from './summarize';

/* 요약 문장에서 검사 수치를 뽑아 타일로 보여주기 위한 순수 추출기.
   배경: 교수진 실측 피드백 — 데모의 "고정 슬롯 + 타일" 화면은 가독성이 좋다고 했고,
   같은 내용을 문장 나열로 준 요약 화면은 읽기 어렵다고 했다. 양이 아니라 구조 문제다.

   [규율 — 이 파일이 지켜야 하는 것]
   1) 구조화는 **추가 레이어**다. 타일을 만들었다고 원래 문장을 없애지 않는다.
   2) 타일은 반드시 출처 항목을 물고 있어야 한다(클릭 → 원문 이동). 근거 없는 타일 금지.
   3) 억지 파싱 금지 — 아는 검사명만 뽑고, 못 뽑으면 타일을 만들지 않는다.
      그래서 일반 정규식(숫자 아무거나)이 아니라 **화이트리스트**를 쓴다.
      "DES 1개", "c33" 같은 것이 수치로 둔갑하면 그게 더 큰 사고다. */

/** 임상에서 반복 측정되는 검사·활력징후 이름만 — 모르는 건 안 뽑는다. */
const KNOWN = [
  'AST', 'ALT', 'ALP', 'GGT', 'TB', 'Bil', 'Albumin',
  'WBC', 'Hb', 'Hct', 'PLT', 'ANC',
  'BUN', 'Cr', 'eGFR', 'Na', 'K', 'Cl', 'Ca', 'P',
  'Glucose', 'HbA1c', 'CRP', 'ESR', 'Lactate', 'Procalcitonin',
  'LDL', 'HDL', 'TG', 'TC',
  'BP', 'HR', 'RR', 'BT', 'SpO2',
  'LVEF', 'EF', 'INR', 'PT', 'aPTT', 'Tacrolimus', 'Troponin', 'BNP', 'NT-proBNP',
  'T-score', 'PSA', 'TSH', 'CEA', 'CA19-9',
] as const;

export type Vital = {
  name: string;
  value: string;      // "58", "118/74", "55%" — 원문 표기 그대로
  item: ResolvedItem; // 출처 항목(클릭 시 이 항목의 span으로 이동)
};

/** 이름 뒤에 오는 값만 인정. 콜론·공백 허용, 값은 숫자(소수·분수·백분율)까지. */
const VALUE = String.raw`([0-9]+(?:\.[0-9]+)?(?:\s*/\s*[0-9]+(?:\.[0-9]+)?)?\s*%?)`;

function patternFor(name: string): RegExp {
  // 이름 경계: 앞은 시작/비문자, 뒤는 콜론·공백. 대소문자 무시.
  const esc = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  return new RegExp(String.raw`(?:^|[^A-Za-z0-9-])${esc}\s*[:=]?\s*${VALUE}`, 'i');
}

/**
 * 요약 항목들에서 검사 수치를 뽑는다. 같은 검사가 여러 번 나오면 **첫 항목만** 채택한다
 * (요약은 보통 최신값을 앞에 쓰고, 타일이 같은 이름으로 중복되면 오히려 혼란).
 */
export function extractVitals(items: ResolvedItem[]): Vital[] {
  const out: Vital[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    for (const name of KNOWN) {
      const key = name.toUpperCase();
      if (seen.has(key)) continue;
      const m = patternFor(name).exec(item.text);
      if (!m) continue;
      const value = m[1].replace(/\s+/g, '');
      // 값이 비었거나 비정상적으로 길면 버린다(파싱 사고 방어).
      if (!value || value.length > 12) continue;
      seen.add(key);
      out.push({ name, value, item });
    }
  }
  return out;
}
