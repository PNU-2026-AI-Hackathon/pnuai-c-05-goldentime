# ERD — 검증·감사 하네스 데이터 모델 (Draft v0.1 · 2026-07-15)

> ⚠️ **발견/설계 단계 전 초안.** brainstorming → 설계 승인 후 확정. [PRD.md](./PRD.md) 참조.
> 원칙: **공개-safe(합성)** 테이블과 **사용자 제출물(관리자 전용)** 테이블을 명확히 분리한다.

## 기존 (사용자 제출물 — 관리자 전용, 공개 금지)
`documents` → `chunks` / `summaries`. `/submit` 실사용 데이터. PHI 위험 → 절대 공개 화면에 미포함.

## 신규 (검증 레이어 — 합성 = 공개 safe)

```mermaid
erDiagram
    injected_error_cases ||--o{ verification_runs : "돌려짐"
    verification_runs ||--o{ model_outputs : "모델별 출력"
    verification_runs ||--o{ disagreements : "불일치"
    disagreements ||--o{ annotations : "교수 자문"
    disagreements ||--o| public_findings : "큐레이션 공개"

    injected_error_cases {
        uuid id PK
        text base_source "synthetic case"
        text error_type "allergy|contrast|interaction|typo|contradiction"
        text intent "왜 이 오류를 심었나"
        text injection_prompt "생성/변조 프롬프트"
        jsonb changes_diff "원본 대비 변경점"
        text expected_flag "잡아야 하는 것"
        timestamptz created_at
    }
    verification_runs {
        uuid id PK
        uuid case_id FK "injected_error_cases (live면 null)"
        text kind "benchmark|live"
        text source_kind "synthetic|user"
        text triggered_by "system|professor"
        text status
        numeric cost_usd
        timestamptz created_at
    }
    model_outputs {
        uuid id PK
        uuid run_id FK
        text model "cloud_a|cloud_b|local"
        text backbone "openai|anthropic|google-local"
        jsonb summary_json
        boolean caught_injected_error
        int latency_ms
        int tokens
        numeric cost_usd
    }
    disagreements {
        uuid id PK
        uuid run_id FK
        text claim "갈린 항목/문장"
        jsonb values_json "모델별 값"
        text severity
        text status "open|advised|resolved"
        timestamptz created_at
    }
    annotations {
        uuid id PK
        uuid disagreement_id FK
        text advisor_role "교수/자문(익명 기본)"
        text verdict
        text note
        boolean is_public
        timestamptz created_at
    }
    public_findings {
        uuid id PK
        uuid disagreement_id FK
        uuid case_id FK
        text title
        text body "큐레이션된 공개 서술"
        timestamptz published_at
    }
```

## 접근 정책
- **공개 API(비번X):** `public_findings` + 연결된 case/disagreement의 **합성 부분만** 읽기.
- **관리자 API(서버 비번):** 전 테이블 + `documents`(사용자 제출물) + 재실행.
- RLS: 공개 읽기는 `public_findings` 등 화이트리스트만. 사용자 제출물 테이블은 익명 read 차단.

## Open questions (설계에서 확정)
- `model_outputs.caught_injected_error`를 자동 판정 vs 사람 라벨.
- live 실행 결과(교수 데이터)는 `verification_runs`에 남기되 원문은 `documents`처럼 비공개.
