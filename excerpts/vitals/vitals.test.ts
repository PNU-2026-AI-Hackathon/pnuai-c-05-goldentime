import { describe, it, expect } from 'vitest';
import { extractVitals } from './vitals';
import type { ResolvedItem } from './summarize';

const mk = (text: string): ResolvedItem => ({
  text, label: 'explicit', citations: ['c1'], span: { start: 0, end: 1 },
});

describe('extractVitals — 요약 문장에서 검사 수치 뽑기', () => {
  it('아는 검사명 뒤의 값을 뽑는다', () => {
    const v = extractVitals([mk('AST 24 / ALT 21로 간기능 정상')]);
    expect(v.map((x) => [x.name, x.value])).toEqual([['AST', '24'], ['ALT', '21']]);
  });

  it('혈압처럼 분수 표기와 백분율도 원문 표기 그대로 살린다', () => {
    const v = extractVitals([mk('BP 118/74, LVEF 55% 정상화')]);
    expect(v.find((x) => x.name === 'BP')!.value).toBe('118/74');
    expect(v.find((x) => x.name === 'LVEF')!.value).toBe('55%');
  });

  it('모르는 이름은 뽑지 않는다 — 억지 파싱 금지', () => {
    expect(extractVitals([mk('LAD에 DES 1개 삽입, 스텐트 2개')])).toEqual([]);
  });

  it('인용 표기(c33)를 수치로 오인하지 않는다', () => {
    expect(extractVitals([mk('복수 소량 [c44], 근위부 확장 [c41]')])).toEqual([]);
  });

  it('같은 검사가 여러 번 나오면 첫 항목만 채택한다', () => {
    const v = extractVitals([mk('Cr 1.32로 상승'), mk('Cr 0.86이었음')]);
    expect(v.filter((x) => x.name === 'Cr')).toHaveLength(1);
    expect(v[0].value).toBe('1.32');
  });

  it('타일은 출처 항목을 물고 있다 — 클릭 시 원문으로 갈 수 있어야 하므로', () => {
    const item = mk('HbA1c 5.8로 조절 양호');
    const v = extractVitals([item]);
    expect(v[0].item).toBe(item);
  });

  it('이름 일부가 다른 단어에 섞인 경우는 뽑지 않는다', () => {
    expect(extractVitals([mk('WBCX 12000')])).toEqual([]);
  });

  it('수치가 없으면 빈 배열 — 타일을 만들지 않는다', () => {
    expect(extractVitals([mk('특이 증상 없음, 경과 관찰')])).toEqual([]);
  });
});
