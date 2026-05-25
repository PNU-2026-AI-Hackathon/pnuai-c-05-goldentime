# 차트원샷 · ChartOneShot

> **길고 긴 EMR, 5초 안에 차트원샷이 읽습니다.**

복잡한 한국어 EMR을 **환자 단위 시계열 요약**으로 정리하는 의료 AI 서비스의 소개·데모 사이트입니다.
의사가 복잡한 케이스를 검토하는 데 걸리는 **25분**을 **5초**로 단축해 골든타임을 지키는 것을 목표로 합니다.

🔗 **Live: [chartoneshot.com](https://chartoneshot.com)**

<sub>Team Golden Time · 양산부산대학교병원 임상 연구 · Synthea™ Powered</sub>

---

## 무엇을 하는 서비스인가

여러 차수의 외래·입원 기록이 누적된 길고 반복적인 EMR에서, **이 환자에서 의사가 진짜 봐야 할 trend**만 뽑아 한 장의 시계열 카드로 압축합니다.

- **주요 질환(Primary Concern)** 을 가장 먼저 강조하고
- 시계열 타임라인을 **주요(화살표 위) / 부수 이슈(화살표 아래)** 로 분리해 보여주며
- 모든 요약 항목에 **원문 인용(citation)** 을 강제로 부착해 환각을 차단합니다.

> 이 저장소는 **제품 소개 + 인터랙티브 데모 프론트엔드**입니다. 데모 데이터는 100% MITRE Synthea™로 합성한 가상 데이터이며 실제 환자 정보(PHI)를 포함하지 않습니다.

---

## 핵심 기능

| 기능 | 설명 |
| --- | --- |
| **Split View 비교** | 원본 EMR과 AI 요약을 한 화면에서 대조해 신뢰성을 검증 |
| **환자 단위 시계열 요약** | 여러 차수 기록 중 핵심 질환만 추출, 주요/부수 이슈를 레이어로 분리 |
| **약어·은어 결정론적 해소** | 분과별 사전 lookup으로 풀이. 미등재 항목은 LLM 추측 없이 원문 유지 + "은어 추정" 표시 |
| **데이터 주권** | 환자 데이터·모델 가중치 모두 폐쇄망 온프레미스에 lock-in, 외부 송신 0건 |

페이지에는 직접 EMR 케이스를 분석해보는 **인터랙티브 데모**와, 사용자가 의사 입장에서 케이스를 읽고 AI와 속도를 겨루는 **Doctor Challenge** 가 포함되어 있습니다.

---

## 추론 파이프라인 (LangGraph)

```
Webhook In → Document Chunker → Abbreviation Lookup → RAG Retriever
           → MedGemma 27B → Citation Verifier → Webhook Response
```

| 항목 | 스택 |
| --- | --- |
| Runtime | vLLM |
| Base Model | MedGemma 27B |
| Adapter | QLoRA (PEFT) r=16 |
| Quantize | 4-bit NF4 |
| Vector DB | pgvector |
| Embedding | EmbeddingGemma 300M |
| GPU | RTX A6000 48GB |
| Network | 폐쇄망 온프레미스 |

**적응 로드맵:** RAG + Few-shot (1) → + QLoRA SFT (2) → + DPO (3, 옵션)
노드 교체만으로 모델·검색·청크 전략을 유연하게 변경할 수 있습니다.

---

## 기술 스택

- **Next.js 16** (App Router) · **React 19** · **TypeScript 5**
- **Tailwind CSS v4**
- **Framer Motion** (인터랙션 애니메이션)
- **lucide-react** (아이콘)
- 동적 OpenGraph 이미지 생성 (`next/og`)
- 라이트/다크 테마 토글
- 백엔드 연동: **Server Action** → n8n Webhook (미설정 시 mock 데이터로 폴백)
- 배포: **Vercel**

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버
npm run dev
# → http://localhost:3000

# 프로덕션 빌드 / 실행
npm run build
npm run start

# 린트
npm run lint
```

### 환경 변수

| 변수 | 설명 |
| --- | --- |
| `N8N_WEBHOOK_URL` | 실제 추론 파이프라인(n8n) 엔드포인트. **미설정 시** 데모는 내장 mock 요약 데이터로 동작합니다. |

서버 전용 변수이므로 클라이언트 번들에 노출되지 않습니다.

---

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx           # 메타데이터, 폰트, 테마 부트스트랩
│   ├── page.tsx             # 섹션 조립
│   ├── opengraph-image.tsx  # 동적 OG 이미지
│   └── globals.css          # 테마 토큰 / Tailwind
├── components/              # Hero, HowItWorks, Features, Metrics,
│                            # InteractiveDemo, DoctorChallenge, Footer ...
├── data/patients.ts         # Synthea 기반 데모 케이스 (pt-01 ~ pt-05)
├── hooks/                   # useScrollAnimation, useCountUp, useTypingEffect ...
├── lib/api.ts               # n8n Webhook Server Action (+ mock 폴백)
└── types/index.ts           # 환자 단위 시계열 요약 도메인 타입
```

---

## Team Golden Time

조호영 · 박보은 · 박준이 · 김용하

양산부산대학교병원 임상 연구 · © 2026 Team Golden Time

<sub>All patient data in this demo is 100% synthetically generated via MITRE Synthea™ and does not contain any real Protected Health Information (PHI).</sub>
