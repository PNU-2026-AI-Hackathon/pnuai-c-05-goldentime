import { runRecognizers, type RawMatch } from './rules';

export type Identifier = RawMatch;
export type { IdentifierKind } from './rules';

const BLOCK = '███';

/**
 * Detect identifier candidates. Sorted by start; overlapping matches are
 * de-duplicated (keep the earliest, then the longest). Detection is an ASSIST
 * only — the user always previews and confirms the masked text before it is
 * sent to OpenAI or persisted.
 */
/**
 * 라벨로 한 번 확인된 이름·번호는 문서 전역에서 같은 문자열을 전부 마스킹한다.
 *
 * 실측(2026-07-19, 병원 발급 의무기록): 표 형태 PDF는 텍스트 추출 시 라벨이 모여 나오고
 * (`등록번호:` `성 명:` `주민번호:`) 값이 그 뒤에 몰려 나와서, 라벨-값 인접 패턴은
 * 첫 등장만 잡고 나머지 수십 회는 놓친다 — 그런데 detect(masked)는 "잔여 0"이라 보고했다
 * (놓친 값 옆엔 라벨이 없으므로). 라벨 근거가 이미 있는 값이므로 전역 확산은 오탐이 아니다.
 */
function spreadConfirmed(text: string, found: RawMatch[]): RawMatch[] {
  const SPREAD_KINDS = new Set(['name', 'insured', 'mrn', 'rrn']);
  const spreadable = found.filter((m) => SPREAD_KINDS.has(m.kind) && m.text.trim().length >= 2);
  const isWordChar = (ch: string | undefined) => ch !== undefined && /[A-Za-z0-9가-힣]/.test(ch);
  const extra: RawMatch[] = [];
  for (const value of new Set(spreadable.map((m) => m.text.trim()))) {
    const kind = spreadable.find((m) => m.text.trim() === value)!.kind;
    let from = 0;
    for (;;) {
      const i = text.indexOf(value, from);
      if (i < 0) break;
      from = i + value.length;
      // 단어 경계 확인 — 한글엔 \b가 없으므로 앞뒤 문자를 직접 본다("정민" 이름이
      // "정민감도" 같은 임상어를 부분 매칭하는 오탐 차단).
      if (isWordChar(text[i - 1]) || isWordChar(text[i + value.length])) continue;
      extra.push({ kind, start: i, end: i + value.length, text: value });
    }
  }
  return extra;
}

export function detect(text: string): Identifier[] {
  const raw = runRecognizers(text);
  const matches = [...raw, ...spreadConfirmed(text, raw)].sort(
    (a, b) => a.start - b.start || b.end - a.end,
  );
  const kept: Identifier[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  }
  return kept;
}

/** Shift an ISO/slash/dot date by `days`, preserving intervals. Returns null for
 * anything that isn't a valid calendar date (e.g. 2026-02-31, Korean-format) so
 * the caller masks it as a block instead of emitting a wrong shifted date. */
function shiftDate(value: string, days: number): string | null {
  const m = value.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})$/);
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return null; // invalid calendar date (Date silently rolled over)
  }
  dt.setUTCDate(dt.getUTCDate() + days);
  const sep = value.includes('/') ? '/' : value.includes('.') ? '.' : '-';
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}${sep}${mm}${sep}${dd}`;
}

/**
 * Produce de-identified text: identifiers become ███; dates are shifted by a
 * single consistent offset so intervals between dates are preserved. Returns
 * the shift used (so it can be reused across a multi-document case).
 */
export function mask(
  text: string,
  identifiers: Identifier[],
  opts?: { shiftDays?: number },
): { masked: string; shiftDays: number } {
  const shiftDays = opts?.shiftDays ?? Math.floor(Math.random() * 21) - 10;
  // Replace right-to-left so earlier offsets stay valid while we edit.
  const sorted = [...identifiers].sort((a, b) => b.start - a.start);
  let masked = text;
  for (const id of sorted) {
    const replacement = id.kind === 'date' ? (shiftDate(id.text, shiftDays) ?? BLOCK) : BLOCK;
    masked = masked.slice(0, id.start) + replacement + masked.slice(id.end);
  }
  return { masked, shiftDays };
}
