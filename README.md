# 차트원샷 · ChartOneShot

> **길고 긴 EMR, 5초 안에 차트원샷이 읽습니다.**

복잡한 한국어 EMR(전자의무기록)을 **환자 단위 시계열 요약**으로 정리하는 의료 AI 서비스입니다.
의사가 복잡한 케이스를 검토하는 데 걸리는 **25분**을 **5초**로 단축해 골든타임을 지키는 것을 목표로 합니다.

🔗 **Live Demo: [chartoneshot.com](https://chartoneshot.com)**

<sub>창업트랙 5조 · Team Golden Time · 양산부산대학교병원 임상 연구 · MITRE Synthea™ Powered</sub>

---

## 1. 프로젝트 소개

### 1.1. 개발배경 및 필요성

- 한 환자의 EMR에는 여러 차수의 외래·입원 기록이 누적되어, 한국어 약어·은어가 뒤섞인 길고 반복적인 텍스트가 쌓입니다.
- 의사가 복잡한 케이스 하나를 검토하는 데 평균 **약 25분**이 소요됩니다. *(근거: Nolan et al., Mayo Clinic 다기관 설문연구, Applied Clinical Informatics, 2017)*
- 특히 PK(임상실습) 의대생·전공의는 차트를 빠르게 읽어내는 경험이 부족해, 핵심 질환과 확인해야 할 trend를 놓치기 쉽습니다.
- 환자 정보(PHI)는 외부로 반출할 수 없어, 일반 상용 클라우드 LLM을 그대로 쓸 수 없는 **데이터 주권** 제약이 존재합니다.

### 1.2. 개발 목표 및 주요 내용

- 길고 반복적인 EMR에서 **이 환자에서 의사가 진짜 봐야 할 핵심 trend**만 뽑아 **한 장의 시계열 카드**로 압축합니다.
- 검토 시간을 **25분 → 5초**로 단축해 임상 의사결정의 골든타임을 확보합니다.
- 모든 요약 항목에 **원문 인용(citation)을 강제 부착**하여 LLM 환각을 차단합니다.
- 환자 데이터와 모델 가중치를 **폐쇄망 온프레미스**에 두어 외부 송신 0건을 보장합니다.

### 1.3. 세부내용

EMR 텍스트를 입력하면 다음과 같이 처리합니다.

- **주요 질환(Primary Concern)** 을 가장 먼저 강조합니다.
- 시계열 타임라인을 **주요 이슈(화살표 위) / 부수 이슈(화살표 아래)** 레이어로 분리해 보여줍니다.
- 분과별 약어·은어 사전을 **결정론적으로 lookup**하여 풀이하고, 미등재 항목은 LLM 추측 없이 원문을 유지한 채 **"은어 추정"** 으로 표시합니다.
- **Split View** 로 원본 EMR과 AI 요약을 한 화면에서 대조해 신뢰성을 검증합니다.
- 의사 입장에서 케이스를 직접 읽고 AI와 속도를 겨루는 **Doctor Challenge**, 그리고 직접 EMR 케이스를 분석해보는 **인터랙티브 데모** 를 제공합니다.

### 1.4. 기존 서비스 대비 차별성

| 구분 | 일반 LLM 요약 서비스 | **차트원샷** |
| --- | --- | --- |
| 환각 방지 | 프롬프트 의존 | **모든 요약에 원문 인용 강제 + Citation Verifier 노드** |
| 약어·은어 처리 | LLM 추측 | **분과 사전 결정론적 lookup**, 미등재는 원문 유지 + "은어 추정" |
| 데이터 보안 | 외부 클라우드 송신 | **폐쇄망 온프레미스 lock-in, 외부 송신 0건** |
| 출력 형태 | 단순 텍스트 요약 | **환자 단위 시계열 카드** (주요/부수 이슈 레이어 분리) |
| 신뢰성 검증 | 불가 | **Split View** 로 원본 ↔ 요약 실시간 대조 |

### 1.5. 사회적가치 도입 계획

- **의료 형평성**: 차트 판독 경험이 적은 의대생·전공의도 핵심 trend를 빠르게 파악하도록 지원합니다.
- **환자 안전**: 검토 시간 단축으로 위급 케이스의 골든타임을 확보하고, 인용 강제로 오판 위험을 줄입니다.
- **개인정보 보호**: 폐쇄망 온프레미스 구조로 환자 정보(PHI) 유출 위험을 원천 차단합니다.
- **공공 의료 적용 가능성**: 합성 데이터(Synthea) 기반 검증을 거쳐, 실제 병원 환경으로 단계적 확장을 계획합니다.

---

## 2. 상세설계

### 2.1. 시스템 구성도

<!-- TODO: 시스템 구성도 이미지를 docs/ 에 추가하고 아래 줄의 주석을 해제하세요.
<img src="docs/system-architecture.png" width="800" alt="시스템 구성도" />
-->

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Vercel)                                          │
│  Next.js 16 · React 19 · Tailwind v4 · Framer Motion        │
│     └─ Server Action ──┐                                    │
└────────────────────────┼────────────────────────────────────┘
                         │ Webhook (HTTPS)
┌────────────────────────┼────────────────────────────────────┐
│  Backend Orchestration  ▼  (n8n / LangGraph)                │
│  Webhook In → Chunker → Abbrev Lookup → RAG Retriever       │
│            → MedGemma 27B → Citation Verifier → Response     │
└────────────────────────┬────────────────────────────────────┘
                         │  (폐쇄망 온프레미스)
┌────────────────────────▼────────────────────────────────────┐
│  Inference Infra (On-prem, RTX A6000 48GB)                  │
│  vLLM · MedGemma 27B (QLoRA r=16, 4-bit NF4)                │
│  pgvector · EmbeddingGemma 300M                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2. 사용 기술

**Frontend**
- Next.js 16.2.3 (App Router) · React 19.2.4 · TypeScript 5
- Tailwind CSS v4
- Framer Motion 12 (인터랙션 애니메이션)
- lucide-react (아이콘) · `next/og` (동적 OpenGraph 이미지)
- 라이트/다크 테마 토글

**Backend / Inference**
- Orchestration: n8n Webhook + LangGraph 노드 파이프라인
- Runtime: vLLM
- Base Model: **MedGemma 27B**
- Adapter: QLoRA (PEFT) r=16 / Quantize: 4-bit NF4
- Vector DB: pgvector / Embedding: EmbeddingGemma 300M
- GPU: RTX A6000 48GB / Network: 폐쇄망 온프레미스
- 적응 로드맵: RAG + Few-shot (1) → + QLoRA SFT (2) → + DPO (3, 옵션)

**Infra / Deploy**
- Frontend 배포: Vercel
- 연동: Server Action → n8n Webhook (`N8N_WEBHOOK_URL` 미설정 시 mock 데이터 폴백)

**활용한 생성형 AI / AI 코딩 도구**
- 제품 추론 엔진: MedGemma 27B (의료 특화 LLM) · EmbeddingGemma 300M
- 개발 도구: <!-- TODO: 실제 사용한 AI 코딩 도구와 버전을 기입하세요 (예: Claude Code, GitHub Copilot, Cursor 등) -->

---

## 3. 개발결과

### 3.1. 전체시스템 흐름도

```
[의사/의대생]
     │  EMR 텍스트 업로드
     ▼
[Frontend · 차트원샷]  ──Server Action──▶  [n8n Webhook In]
                                                │
                                                ▼
                                     [Document Chunker]  문서 단위 청킹
                                                │
                                                ▼
                                  [Abbreviation Lookup]  분과 사전 · 결정론적
                                                │
                                                ▼
                                       [RAG Retriever]   pgvector · EmbeddingGemma 300M
                                                │
                                                ▼
                                       [MedGemma 27B]    vLLM · QLoRA r=16 · 4-bit NF4
                                                │
                                                ▼
                                  [Citation Verifier]    원문 인용 강제 검증
                                                │
                                                ▼
                                  [Webhook Response]     구조화 JSON
                                                │
                                                ▼
[Frontend]  ◀── 30초 이내 ──  Split View 대시보드 (원본 ↔ 시계열 요약 카드)
```

### 3.2. 기능설명

**① EMR 업로드 → AI 분석 → 결과 대시보드 (HowItWorks)**
- 텍스트 형식의 EMR을 별도 전처리 없이 원본 그대로 업로드합니다.
- LLM이 임상적 맥락에서 활력징후·주증상·알레르기 등 핵심 필드를 구조화하고, 현재 질환 위주로 확인해야 할 환자 타임라인을 그립니다.
- 30초 이내에 구조화된 JSON을 반환하며, 이상 수치는 시각적으로 즉시 강조됩니다.

**② Split View 비교**
- 원본 EMR과 AI 요약을 한 화면에서 좌우로 대조하여 신뢰성을 검증합니다.

**③ 환자 단위 시계열 요약**
- 여러 차수의 외래·입원 기록 중 핵심 질환만 추출하고, 주요/부수 이슈를 타임라인 레이어로 분리해 보여줍니다.

**④ 약어·은어 결정론적 해소**
- 예: `f/u → follow-up`, `BID → 1일 2회` 처럼 사전 lookup으로 풀이합니다.
- 미등재 약어(예: `HLD`)는 LLM 추측 없이 원문을 유지하고 **"은어 추정"** 으로 표시합니다.

**⑤ 데이터 주권**
- 폐쇄망 온프레미스에서만 동작하며, 외부 송신 0건을 실시간으로 표시합니다.

**⑥ Doctor Challenge / 인터랙티브 데모**
- 사용자가 의사 입장에서 케이스를 읽고 AI와 검토 속도를 겨루는 체험 기능입니다.
- 데모 데이터는 100% MITRE Synthea™ 합성 데이터(pt-01 ~ pt-05)이며 실제 PHI를 포함하지 않습니다.

> 🎬 기능별 시연 영상: <!-- TODO: 각 기능 시연 영상(GIF/링크)을 삽입하세요 -->

### 3.3. 기능명세서

- 📄 [창업트랙_차트원샷_골든타임 (한글 문서)](docs/창업트랙_차트원샷_골든타임.hwp)

### 3.4. 디렉토리 구조

```
.
├── docs/                       # 보고서·발표자료·기능명세서 (hwp 등)
└── src/
    ├── app/
    │   ├── layout.tsx          # 메타데이터, 폰트, 테마 부트스트랩
    │   ├── page.tsx            # 섹션 조립
    │   ├── opengraph-image.tsx # 동적 OG 이미지
    │   └── globals.css         # 테마 토큰 / Tailwind
    ├── components/             # Hero, HowItWorks, Features, Metrics,
    │                           # InteractiveDemo, DoctorChallenge, Footer ...
    ├── data/patients.ts        # Synthea 기반 데모 케이스 (pt-01 ~ pt-05)
    ├── hooks/                  # useScrollAnimation, useCountUp, useTypingEffect ...
    ├── lib/api.ts              # n8n Webhook Server Action (+ mock 폴백)
    └── types/index.ts          # 환자 단위 시계열 요약 도메인 타입
```

### 3.5. AI 도구 활용

- **제품 핵심 엔진**: 의료 특화 LLM인 MedGemma 27B를 QLoRA(r=16, 4-bit NF4)로 적응시키고, EmbeddingGemma 300M + pgvector 기반 RAG로 근거 검색을 수행했습니다.
- **환각 억제**: Citation Verifier 노드로 모든 요약에 원문 인용을 강제했습니다.
- **개발 단계 활용**: <!-- TODO: 기획·설계·프론트엔드·백엔드 각 단계에서 어떤 AI 코딩 도구를 어떻게 활용했고 어떤 성과가 있었는지 기술하세요 -->

---

## 4. 설치 및 사용 방법

```bash
# 1) 의존성 설치
npm install

# 2) 개발 서버 실행
npm run dev
# → http://localhost:3000

# 3) 프로덕션 빌드 / 실행
npm run build
npm run start

# 4) 린트
npm run lint
```

### 환경 변수

| 변수 | 설명 |
| --- | --- |
| `N8N_WEBHOOK_URL` | 실제 추론 파이프라인(n8n) 엔드포인트. **미설정 시** 데모는 내장 mock 요약 데이터로 동작합니다. |

> 서버 전용 변수이므로 클라이언트 번들에 노출되지 않습니다.

---

## 5. 소개 및 시연 영상

> 프로젝트 소개 동영상을 교육원 메일(swedu@pusan.ac.kr)로 제출한 뒤, 센터에서 부여받은 YouTube URL을 아래에 기입하세요.

- 🎥 소개 및 시연 영상: <!-- TODO: YouTube URL 기입 -->

---

## 6. 팀 소개

**Team Golden Time** · 창업트랙 5조 · 양산부산대학교병원 임상 연구

| 이름 | 역할 | 연락처 |
| --- | --- | --- |
| 조호영 | <!-- TODO --> | <!-- TODO --> |
| 박보은 | <!-- TODO --> | <!-- TODO --> |
| 박준이 | <!-- TODO --> | <!-- TODO --> |
| 김용하 | <!-- TODO --> | <!-- TODO --> |

---

## 7. 해커톤 참여 후기

<!-- TODO: 팀원 별 해커톤 참여 후기를 작성하세요 -->

- 조호영:
- 박보은:
- 박준이:
- 김용하:

---

<sub>All patient data in this demo is 100% synthetically generated via MITRE Synthea™ and does not contain any real Protected Health Information (PHI). © 2026 Team Golden Time</sub>
