/* 비식별 테스트 — 아래 식별자는 전부 **명백한 더미값**입니다.
   (홍길동 / 900101-1234567 / 010-1234-5678 / a@b.com / 00123456)
   실제 환자 정보가 아니며, 한눈에 가짜로 보이는 값만 사용합니다. */
import { describe, it, expect } from 'vitest';
import { detect, mask } from './index';

describe('de-id detect', () => {
  it('detects structured identifiers with correct spans', () => {
    const t = 'RRN 900101-1234567 / 010-1234-5678 / a@b.com / 2026-06-18 / MRN: 00123456';
    const kinds = detect(t).map((i) => i.kind);
    expect(kinds).toEqual(expect.arrayContaining(['rrn', 'phone', 'email', 'date', 'mrn']));
    const rrn = detect(t).find((i) => i.kind === 'rrn')!;
    expect(t.slice(rrn.start, rrn.end)).toBe('900101-1234567');
    const mrn = detect(t).find((i) => i.kind === 'mrn')!;
    expect(mrn.text).toBe('00123456'); // value only, not the "MRN:" label
  });

  it('does not false-positive rrn/phone on a plain clinical line', () => {
    const kinds = detect('Vitals: BP 168/94, HR 104, RR 22, SpO2 91% room air').map((i) => i.kind);
    expect(kinds).not.toContain('rrn');
    expect(kinds).not.toContain('phone');
  });
});

describe('de-id mask', () => {
  it('blocks identifiers and preserves date intervals under a consistent shift', () => {
    const t = 'Name: 홍길동 admitted 2026-06-18, discharged 2026-06-21';
    const { masked } = mask(t, detect(t), { shiftDays: 5 });
    expect(masked).not.toContain('홍길동');
    expect(masked).toContain('███');
    const dates = masked.match(/\d{4}-\d{2}-\d{2}/g)!;
    expect(dates[0]).toBe('2026-06-23'); // 18 + 5
    const days = (Date.parse(dates[1]) - Date.parse(dates[0])) / 86_400_000;
    expect(days).toBe(3); // interval preserved
  });
});

describe('de-id — codex-review regressions', () => {
  it('detects full English name, slash date, spaced phone, unhyphenated RRN', () => {
    const t = 'Name: John Smith DOB: 1970/01/02 Tel: 010 1234 5678 RRN: 9001011234567';
    const ids = detect(t);
    expect(ids.find((i) => i.kind === 'name')?.text).toContain('John Smith');
    expect(ids.some((i) => i.kind === 'date' && i.text === '1970/01/02')).toBe(true);
    expect(ids.some((i) => i.kind === 'phone' && i.text === '010 1234 5678')).toBe(true);
    expect(ids.some((i) => i.kind === 'rrn' && i.text === '9001011234567')).toBe(true);
    const { masked } = mask(t, ids, { shiftDays: 0 });
    expect(masked).not.toContain('Smith');
    expect(masked).not.toContain('9001011234567');
  });

  it('detects Korean EMR identifier labels (환자명·등록번호)', () => {
    const t = '환자명: 홍길동  등록번호: 00123456  67세';
    const ids = detect(t);
    expect(ids.find((i) => i.kind === 'name')?.text).toBe('홍길동');
    expect(ids.some((i) => i.kind === 'mrn' && i.text === '00123456')).toBe(true);
    const { masked } = mask(t, ids, { shiftDays: 0 });
    expect(masked).not.toContain('홍길동');
    expect(masked).not.toContain('00123456');
  });

  it('detects 주소(address) and 피보험자(insured) — labelled and bare address', () => {
    const t = '주소: 서울특별시 강남구 테헤란로 123  피보험자: 김보험  피보험자번호: 12-345678\n경기도 성남시 분당구 정자로 45번지';
    const ids = detect(t);
    expect(ids.some((i) => i.kind === 'insured' && i.text === '김보험')).toBe(true);
    expect(ids.some((i) => i.kind === 'insured' && i.text.includes('12-345678'))).toBe(true);
    expect(ids.some((i) => i.kind === 'address')).toBe(true);
    const { masked } = mask(t, ids, { shiftDays: 0 });
    expect(masked).not.toContain('테헤란로');
    expect(masked).not.toContain('김보험');
    expect(masked).not.toContain('정자로');
  });

  it('masks an invalid calendar date as a block instead of shifting to a wrong date', () => {
    const t = 'admit 2026-02-31';
    const { masked } = mask(t, detect(t), { shiftDays: 0 });
    expect(masked).toContain('███');
    expect(masked).not.toContain('2026-02-31');
    expect(masked).not.toContain('2026-03-03'); // Date() would have rolled over to this
  });
});

/**
 * 병원 발급 의무기록에서 실측한 *구조*에 대한 회귀 테스트.
 *
 * ⚠️ 이 블록의 모든 식별자 값은 명백한 더미다(홍길동 / 000-00-00-0 / 000000 / 00-000000 /
 * 테헤란로 123). 실제 환자 값은 어떤 형태로도 이 저장소에 두지 않는다 — 재현해야 하는 것은
 * 값이 아니라 배치 구조(라벨과 값이 떨어져 나오고, 같은 값이 여러 번 재등장하는 것)다.
 */
describe('de-id — 실차트 회귀 (2026-07-19 병원 발급 의무기록 실측)', () => {
  // 표 형태 PDF 추출본: 라벨이 모여 나오고 값은 그 뒤에 몰려 나온다 →
  // 라벨-값 인접 패턴은 첫 등장만 잡고, 나머지는 놓치면서 detect(masked)는 "잔여 0"이라 보고했다.
  const chart = [
    '등록번호 :', '000-00-00-0', '환자성명 :', '홍길동', '주민번호 :', '000000 - *******',
    '발행번호 : 00-000000',
    '', '등록번호:', '성    명:', '주민번호:', '000-00-00-0', 'F', '홍길동', '000000-*******',
    '외과 유방암 수술후 정기적검진, 홍길동 환자 추적관찰',
  ].join('\n');

  it('라벨로 확인된 이름·번호를 문서 전역에서 마스킹한다(표 셀 재등장 포함)', () => {
    const { masked } = mask(chart, detect(chart), { shiftDays: 0 });
    expect(masked).not.toContain('홍길동');      // 라벨 없는 재등장 2회 포함
    expect(masked).not.toContain('000-00-00-0'); // 하이픈 구획 등록번호
  });

  it('뒷자리가 가려진 주민번호의 앞 6자리(=생년월일)도 마스킹한다', () => {
    const { masked } = mask(chart, detect(chart), { shiftDays: 0 });
    expect(masked).not.toContain('000000');
  });

  it('발행번호도 마스킹한다', () => {
    const { masked } = mask(chart, detect(chart), { shiftDays: 0 });
    expect(masked).not.toContain('00-000000');
  });

  it('"주소"가 主訴(chief complaint)일 때는 마스킹하지 않고, 실제 주소일 때만 마스킹한다', () => {
    // 실측: 의무기록의 "주소:"는 절반이 主訴다 — 통째로 가리면 임상 정보가 사라진다.
    const cc = '주 소 : 복통 3일째, 오심 동반';
    expect(mask(cc, detect(cc), { shiftDays: 0 }).masked).toBe(cc);

    const addr = '주 소 : 서울특별시 강남구 테헤란로 123';
    const maskedAddr = mask(addr, detect(addr), { shiftDays: 0 }).masked;
    expect(maskedAddr).not.toContain('테헤란로');

    // 뜻이 하나뿐인 라벨은 값 검증 없이 마스킹
    const home = '현주소: 대구 어딘가';
    expect(mask(home, detect(home), { shiftDays: 0 }).masked).not.toContain('대구 어딘가');
  });

  it('전역 확산이 임상어를 부분 매칭하지 않는다(단어 경계)', () => {
    const t = '환자명: 정민\n정민감도 검사 결과 정상, 정민 환자 상태 안정';
    const { masked } = mask(t, detect(t), { shiftDays: 0 });
    expect(masked).toContain('정민감도');  // 임상어는 보존(원문 무교정)
    expect(masked).not.toContain('정민 환자'); // 단독 이름은 마스킹
  });
});
