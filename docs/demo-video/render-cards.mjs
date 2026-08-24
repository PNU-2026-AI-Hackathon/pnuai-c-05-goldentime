// 카드 PNG 렌더 — cards/card.html 에 URL 파라미터를 넘겨 1440x810 스크린샷.
// 사용: node render-cards.mjs   (playwright 필요: ~/.claude/tools/headless)
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const HERE = dirname(fileURLToPath(import.meta.url));

// 00~06 은 초기 제작분(PNG 로만 보존). 아래는 2026-08-25 추가된 창업플랜 카드.
const CARDS = [
  { out:'07-track.png', p:{
    dark:'1', num:'06', kicker:'TRACK RECORD',
    t:'지어낸 실적 대신<br><em>기록을 공개합니다</em>',
    p:'실제 차트 20개 코퍼스 구축 — 텍스트 추출은 전량 로컬에서<br>3모델 피어리뷰 실행 기록을 비용까지 공개, 비식별 사고 리포트도 그대로<br>오류 시나리오는 교수 co-design — AI가 지어내지 않습니다',
    foot:'2026.07 – 08 · 커밋 204건 · chartoneshot.com/evidence' }},
  { out:'08-peer.png', p:{
    dark:'1', num:'07', kicker:'NEXT STEPS',
    t:'온프렘에서도<br><em>3개 모델이 서로를 검증합니다</em>',
    p:'Qwen3.8-27B · MedGemma 27B · Mistral 계열 — 서로 다른 개발사를 씁니다<br>같은 계열은 같이 틀리기 때문입니다<br>단일 A6000(48GB)에서 동작하는 구성을 목표로 합니다',
    badge:'계획' }},
  { out:'09-adapt.png', p:{
    dark:'1', num:'08', kicker:'NEXT STEPS',
    t:'모델이 어디서 틀리는지<br><em>먼저 측정합니다</em>',
    p:'오픈 모델의 언어·의학 체계 편향을 측정해 공개하고,<br>QLoRA로 분과별 어휘·약어를 적응시킵니다<br>가중치도 환자 데이터도 병원 밖으로 나가지 않습니다',
    badge:'계획' }},
  { out:'10-gov.png', p:{
    dark:'1', num:'09', kicker:'GOVERNANCE',
    t:'실데이터는<br><em>IRB 승인 후에만 다룹니다</em>',
    p:'공개 데모는 합성·MIMIC 데이터만 씁니다<br>실데이터 경로는 IRB 승인을 전제로 설계했습니다<br>사용자 제출물은 공개 화면에 절대 오르지 않습니다',
    badge:'계획' }},
];

const b = await chromium.launch();
const pg = await b.newPage({ viewport:{width:1440,height:810}, deviceScaleFactor:1 });
for (const c of CARDS){
  await pg.goto('file://' + join(HERE,'cards','card.html') + '?' + new URLSearchParams(c.p));
  await pg.waitForTimeout(700);
  await pg.screenshot({ path: join(HERE,'cards',c.out) });
  // 넘침 검사 — 1440x810 을 넘으면 문구가 잘린다
  const o = await pg.evaluate(()=>({W:document.body.scrollWidth,H:document.body.scrollHeight}));
  console.log(c.out, o.W>1440||o.H>810 ? '⚠ 넘침' : 'ok');
}
await b.close();
