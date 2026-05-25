import type { Patient } from '@/types';

// 데모용 가상 환자 5명 (Synthea 컨셉)
// 모든 환자가 S/O/A/P 형식 + 6-9 visit + 반복 차트 + 미세 변화
// 분과명·기관 IRB 정보 비공개, 카테고리/케이스만 노출

export const patients: Patient[] = [
  /* ────────────────────────── 1. 간이식 추적 (핵심 데모) ────────────────────────── */
  {
    id: 'pt-01',
    caseSummary: '간이식 추적 + 외상·알레르기 episode 동반',
    caseCategory: 'multispec',
    demographics: '52세 남성',
    fileName: 'pt-01_liver_transplant.pdf',
    emrText: `외래 의무기록 — 간이식 외래 / 응급실 / 정형외과
환자: ㅇㅇㄷ / 남 / 52세 | 등록번호: PT-2026-LT0001
이식 종류: 생체 간이식 (2024.08.15, 우측 간엽 공여 — 아들)
면역억제 protocol: Tacrolimus + Mycophenolate + Prednisolone 3제 요법

══════════════════════════════════════════════════════════════
[2026.01.23 외래 — 간이식 정기 검진 (12개월차)]

S (주관적 호소): 컨디션 양호, 특이 호소 없음.
  식욕 정상, 수면 양호. 일상 활동 정상화. 운동 시 호흡곤란 없음.

O (객관적 검사):
  V/S: BP 124/78, HR 72, RR 16, BT 36.6, SpO2 99%
  Lab: AST 28, ALT 31, T-Bil 0.9, ALP 78, GGT 32
       Cr 1.0, BUN 14, K+ 4.2, Na 140
       Tacrolimus trough 6.2 ng/mL (목표 5-8)
  CBC: WBC 5.8, Hb 13.4, PLT 192k
  Doppler US: 간 이식편 perfusion 정상, portal vein flow 정상

PMHx: HBV-related LC → 생체 간이식 (2024.08.15, 우측 간 공여)
       HTN (2018경, Amlodipine 5mg qd)
       DM type 2 (2020경, Metformin 500mg BID)
       HLD (2021경, Atorvastatin 10mg qd)

수술력: 생체 간이식 (2024.08.15, 우측 간엽)
       충수절제술 (1998)

알레르기: NKDA (no known drug allergy)

복용약: Tacrolimus 2mg BID, Mycophenolate 1g BID, Prednisolone 5mg qd,
       Amlodipine 5mg qd, Metformin 500mg BID, Atorvastatin 10mg qd

특이사항: Tacrolimus trough 목표 범위(5-8 ng/mL) 안정 유지.
         거부반응(rejection) 소견 없음. Doppler US 정상.

A (판정): 간 이식 안정 상태 유지. 약물성 부작용 없음.

P (계획): 4주 후 정기 검진 (2026.02.20). 면역억제제 동일 용량 유지.
         혈당·혈압 자가 측정 일지 지참.

══════════════════════════════════════════════════════════════
[2026.01.30 외래 — 간이식 정기 검진 (보조 추적)]

S: 1.23과 동일. 특이 변화 없음. 약물 순응도 양호.

O: 1.23과 거의 동일.
  V/S: BP 122/76, HR 70, RR 16, BT 36.5, SpO2 99%
  Lab: AST 27, ALT 30, T-Bil 0.9, Tacrolimus trough 6.4 ng/mL
  CBC: WBC 5.6, Hb 13.5, PLT 198k

PMHx: 동일 (HBV-LC s/p 간이식, HTN, DM, HLD)
수술력: 동일 (간이식 2024.08, 충수절제 1998)
알레르기: NKDA
복용약: Tacrolimus 2mg BID, Mycophenolate 1g BID, Prednisolone 5mg qd,
       Amlodipine 5mg qd, Metformin 500mg BID, Atorvastatin 10mg qd

특이사항: 안정 유지. 외래 간격 조정 검토 (4주→6주 가능성).

A: 안정.

P: 다음 정기 검진 2026.02.20 (4주 후 동일).

══════════════════════════════════════════════════════════════
[2026.02.10 응급실 — 교통사고 (TA)]

내원경위: 119 이송. 자차 운전 중 교차로 측면 추돌.

S: 골반·우측 둔부 통증 NRS 7. 보행 불능.
   두부 외상 없음. 흉부 압박감 없음. LOC 없음.

O:
  V/S: BP 142/88, HR 102, RR 22, BT 36.8, SpO2 97%
  Lab: AST 32, ALT 35 (안정 범위), Hb 12.8, Cr 1.0, PLT 188k
  Imaging:
    Pelvic CT: Right superior pubic ramus fracture (stable, non-displaced)
    Chest X-ray: 정상
    Head CT: 정상
  Neurovascular exam: 우측 하지 distal pulse 정상, sensation 정상

PMHx: 간이식 (2024.08), HTN, DM, HLD — 동일
수술력: 동일
알레르기: NKDA
복용약: 동일 (Tacrolimus 등 면역억제 유지)

특이사항: 안정성 골절. 신경혈관 손상 없음.
         면역억제 환자라 감염·창상 치유 지연 위험 — 모니터링.

A: Right superior pubic ramus fracture, stable, non-displaced.
   Acute musculoskeletal trauma.

P: 보존적 치료 (체중 부하 제한 2주, 보행 보조구).
   APAP 500mg PRN for pain. NSAIDs 금기 (이식 후 신독성·GI 위험).
   정형외과 외래 추적 1주 후. 간 이식 약물 변동 없이 유지.
   이식센터에 외상 보고.

══════════════════════════════════════════════════════════════
[2026.02.20 외래 — 간이식 정기 검진 (TA 10일 후)]

S: 컨디션 회복 중. 골반 통증 NRS 3, 보행 보조구 사용 중.
   APAP로 통증 조절 양호. 식욕·수면 정상.

O:
  V/S: BP 126/80, HR 74, RR 16, BT 36.7, SpO2 99%
  Lab: AST 58 ↑, ALT 64 ↑ (정상 상한 초과 — 약간 상승),
       T-Bil 1.1, ALP 82, GGT 38
       Cr 1.0, Tacrolimus trough 6.8 ng/mL (목표 내)
  CBC: WBC 6.4, Hb 12.6, PLT 195k
  Doppler US: 간 이식편 perfusion 정상

PMHx: 동일 + 우측 치골 골절 (2026.02.10, TA)
수술력: 동일
알레르기: NKDA
복용약: 동일 + APAP 500mg PRN

특이사항: AST/ALT 경미한 상승 (정상 상한의 ~1.5배).
         감별 진단:
           1. 외상 후 근육 손상 (CK 추가 검사 권장)
           2. 약물 영향 (APAP 과량 사용 X — 사용량 확인)
           3. 거부반응 (Tacrolimus trough 정상, Doppler 정상 — 가능성 낮음)
           4. 감염 (발열/임상 증상 없음 — 가능성 낮음)

A: AST/ALT 일시적 상승 — 외상 후 근육 손상 가능성 가장 높음.
   거부반응·감염·약물 영향 가능성 낮음.

P: 2주 후 재검 (2026.03.02).
   CK 추가 검사. APAP 사용량 일지 확인.
   호전 없거나 추가 상승 시 간 생검 고려.
   골반 통증: APAP 유지, NSAIDs 절대 금기.

══════════════════════════════════════════════════════════════
[2026.03.02 외래 — 간이식 정기 검진 (재검)]

S: 골반 통증 NRS 1, 보행 정상화. 컨디션 양호.

O:
  V/S: BP 122/78, HR 70, RR 16, BT 36.6, SpO2 99%
  Lab: AST 26 ✓, ALT 29 ✓ (정상 범위로 복귀),
       T-Bil 0.9, Tacrolimus trough 6.4 ng/mL
       CK 320 (정상 상한 약간 상회 — 외상 회복 흔적)
  CBC: WBC 5.9, Hb 13.0, PLT 198k

PMHx: 동일 (간이식 + 우측 치골 골절 회복 중)
수술력: 동일
알레르기: NKDA
복용약: 동일

특이사항: AST/ALT 정상화 — 외상 관련 일시적 상승으로 확정.
         CK 정상 상한 약간 상회 (외상 회복 흔적, 임상적 의미 미미).
         거부반응 아님.

A: 간 기능 안정 유지. 거부반응 없음. 골절 회복 정상.

P: 4주 후 정기 검진 (2026.03.30). 면역억제제 유지.

══════════════════════════════════════════════════════════════
[2026.03.30 외래 — 간이식 정기 검진]

S: 안정. 골반 통증 없음. 일상 활동 정상화 (보조구 사용 X).

O:
  V/S: BP 120/76, HR 72, RR 16, BT 36.6, SpO2 99%
  Lab: AST 28, ALT 30, T-Bil 0.9, Tacrolimus trough 6.2 ng/mL. 모두 안정.
  CBC: WBC 5.7, Hb 13.4, PLT 200k

PMHx: 동일 + 우측 치골 골절 임상적 치유 (2026.02.10 → 2026.03.30)
수술력: 동일
알레르기: NKDA
복용약: 동일

특이사항: 골절 임상적 치유 완료. 정형외과 외래 종결.

A: 간 이식 안정 유지. 골절 회복 완료.

P: 4주 후 정기 검진 (2026.04.27 예정).

══════════════════════════════════════════════════════════════
[2026.04.10 응급실 — 꿀벌 자상 후 아나필락시스]

내원경위: 캠핑 중 우측 상완 꿀벌 자상 약 20분 후
         전신 발진 + 호흡곤란 발생. 119 이송.

S: 우측 상완 부종, 전신 두드러기, 호흡 답답함, 어지러움.
   의식 명료. NRS (불편감) 5.

O:
  V/S: BP 92/56 (저혈압), HR 118 (빈맥), RR 26, BT 36.8,
       SpO2 92% → 산소 5L 투여 후 97%
  PE: Diffuse urticaria, mild lip swelling, expiratory wheezing
      Right arm sting site — local erythema (~3cm)

PMHx: 간이식 (2024.08), HTN, DM, HLD — 동일
수술력: 동일
알레르기: 신규 알레르기 — 꿀벌 독 (이전 노출 없음, 첫 episode)
복용약: 면역억제제 등 동일 (변동 없음)

응급 처치:
  - Epinephrine 0.3mg IM (외측 대퇴) × 1회
  - Diphenhydramine 50mg IV
  - Methylprednisolone 125mg IV
  - IV NS 1L bolus
  - Albuterol nebulizer

특이사항: Grade 2 아나필락시스 (피부+호흡+순환 침범).
         면역억제 상태로 일반인보다 회복 모니터링 강화 필요.
         24시간 ICU 관찰 후 호전.

A: Anaphylaxis to bee venom, Grade 2 (Mueller classification).

P: 자가 EpiPen 처방 (0.3mg, 2개 — 항상 휴대).
   알레르기내과 외래 의뢰 (specific venom immunotherapy 평가).
   간 이식 면역억제제 영향 평가 — 이식센터에 보고.
   약물 조정 없음. 환자·가족에 응급 처치 교육.

══════════════════════════════════════════════════════════════
[2026.04.25 외래 — 간이식 정기 검진 (아나필락시스 후)]

S: 안정. 꿀벌 알레르기 후 회복 완전. EpiPen 휴대 중.
   특이 호소 없음. 식욕·수면·운동 모두 정상.

O:
  V/S: BP 124/76, HR 72, RR 16, BT 36.5, SpO2 99%
  Lab: AST 27, ALT 30, T-Bil 0.9, Tacrolimus trough 6.3 ng/mL (안정)
  CBC: WBC 5.8, Hb 13.4, PLT 196k

PMHx: 간이식 (2024.08), HTN, DM, HLD, 우측 치골 골절 치유,
      꿀벌 독 알레르기 (2026.04.10 신규)
수술력: 동일
알레르기: 꿀벌 독 추가
복용약: 동일 + EpiPen 0.3mg PRN (자가 휴대)

특이사항: 알레르기내과 평가 결과 venom immunotherapy 후보 — 환자 결정 보류 중.
         간 이식 약물 영향 없음.

A: 안정 유지.

P: 4주 후 정기 검진 (2026.05.23 예정). EpiPen 항상 휴대 교육 재강조.`,
    expectedResult: {
      patient_label: '52세 남성 · 생체 간이식 추적 외래',
      primary_concern: {
        title: '생체 간이식 후 추적 (12~17개월차)',
        summary:
          '2024.08 생체 간이식 후 7회 외래. 외상·아나필락시스 등 부수 episode 발생 속에서도 이식 간 기능 안정 유지.',
        key_trends: [
          'AST/ALT: 안정(1.23~1.30) → 외상 후 일시 상승(2.20, AST 58·ALT 64 ↑) → 2주 만에 정상 복귀(3.02, AST 26·ALT 29) → 안정 유지(3.30~4.25)',
          'Tacrolimus trough: 6.2~6.8 ng/mL 목표 범위(5-8) 일관 유지 — 거부반응 소견 없음',
          '면역억제 3제 요법(Tacrolimus + Mycophenolate + Prednisolone) 용량 변동 없이 18주 유지',
        ],
      },
      case_summary:
        '간이식 환자 — 7개월간 외래 7회 + 응급 2회. 골절·아나필락시스 등 부수 이슈 발생 속에서도 핵심 지표(LFT, Tacrolimus trough) 안정 유지.',
      current_state: {
        diagnoses: [
          'HBV-related LC s/p 생체 간이식 (2024.08.15, 우측 간엽 공여)',
          'HTN (Amlodipine 5mg qd)',
          'DM type 2 (Metformin 500mg BID)',
          'HLD (Atorvastatin 10mg qd)',
        ],
        complaint: '안정. 일상 활동 정상. 특이 호소 없음.',
        recent_labs: {
          AST: '27',
          ALT: '30',
          'T-Bil': '0.9',
          Tacrolimus: '6.3 ng/mL',
          Cr: '1.0',
          BP: '124/76',
        },
        medications: [
          'Tacrolimus 2mg BID',
          'Mycophenolate 1g BID',
          'Prednisolone 5mg qd',
          'Amlodipine 5mg qd',
          'Metformin 500mg BID',
          'Atorvastatin 10mg qd',
          'EpiPen 0.3mg PRN (꿀벌 자상 시)',
        ],
      },
      resolved_issues: [
        {
          issue: 'AST/ALT 일시 상승 (외상 관련 추정)',
          duration: '2026.02.20 발견 (AST 58·ALT 64) → 2026.03.02 정상 복귀',
          note: '외상 후 근육 손상 가능성. 거부반응·감염·약물 영향 배제.',
          sourceChunkId: 'chunk-pt01-04',
        },
        {
          issue: '우측 치골 골절 (TA)',
          duration: '2026.02.10 TA로 발생 → 보존적 치료 → 2026.03.30 임상적 치유',
          note: '안정성 골절. 신경혈관 손상 없음. NSAIDs 금기로 APAP만 사용.',
          sourceChunkId: 'chunk-pt01-02',
        },
        {
          issue: '꿀벌 독 아나필락시스 (Grade 2)',
          duration: '2026.04.10 첫 episode → ICU 24시간 관찰 → 회복',
          note: 'EpiPen 휴대 시작. 알레르기내과 venom immunotherapy 평가 중. 이식 약물 영향 없음.',
          sourceChunkId: 'chunk-pt01-06',
        },
      ],
      timeline: [
        { date: '2024.08', event: '생체 간이식 시행 (HBV-LC, 우측 간엽 공여)', sourceChunkId: 'chunk-pt01-bl', layer: 'primary' },
        { date: '2026.01.23', event: '간이식 정기 검진 — LFT 정상, Tacrolimus 6.2', sourceChunkId: 'chunk-pt01-00', layer: 'primary' },
        { date: '2026.01.30', event: '간이식 정기 검진 — 안정 유지', sourceChunkId: 'chunk-pt01-01', layer: 'primary' },
        { date: '2026.02.10', event: 'TA로 우측 치골 골절 — 응급실 보존적 치료', sourceChunkId: 'chunk-pt01-02', layer: 'incidental' },
        { date: '2026.02.20', event: 'AST 58·ALT 64로 일시 상승 ↑ (TA 10일 후, 외상 추정)', sourceChunkId: 'chunk-pt01-03', layer: 'primary' },
        { date: '2026.03.02', event: 'AST 26·ALT 29로 정상 복귀 ✓ — 거부반응 배제', sourceChunkId: 'chunk-pt01-04', layer: 'primary' },
        { date: '2026.03.30', event: '간 기능 안정 + 골절 임상적 치유', sourceChunkId: 'chunk-pt01-05', layer: 'primary' },
        { date: '2026.04.10', event: '꿀벌 자상 후 Grade 2 아나필락시스 — EpiPen 1회', sourceChunkId: 'chunk-pt01-06', layer: 'incidental' },
        { date: '2026.04.25', event: '간 기능 안정 (AST 27·ALT 30) + 알레르기 회복', sourceChunkId: 'chunk-pt01-07', layer: 'primary' },
      ],
      abbreviations: [
        { abbrev: 'LC', expansion: 'Liver Cirrhosis (간경변)', status: 'resolved' },
        { abbrev: 'HBV', expansion: 'Hepatitis B Virus (B형 간염)', status: 'resolved' },
        { abbrev: 'LFT', expansion: 'Liver Function Test (간기능검사)', status: 'resolved' },
        { abbrev: 'AST', expansion: 'Aspartate Aminotransferase', status: 'resolved' },
        { abbrev: 'ALT', expansion: 'Alanine Aminotransferase', status: 'resolved' },
        { abbrev: 'T-Bil', expansion: 'Total Bilirubin (총 빌리루빈)', status: 'resolved' },
        { abbrev: 'Tacrolimus trough', expansion: '타크롤리무스 최저혈중농도 (목표 5-8 ng/mL)', status: 'resolved' },
        { abbrev: 'BID', expansion: 'bis in die (1일 2회)', status: 'resolved' },
        { abbrev: 'qd', expansion: 'quaque die (1일 1회)', status: 'resolved' },
        { abbrev: 'NSAIDs', expansion: 'Non-Steroidal Anti-Inflammatory Drugs (비스테로이드 소염제)', status: 'resolved' },
        { abbrev: 'APAP', expansion: 'Acetaminophen (아세트아미노펜)', status: 'resolved' },
        { abbrev: 'TA', expansion: 'Traffic Accident (교통사고)', status: 'resolved' },
        { abbrev: 'IM', expansion: 'Intramuscular (근육주사)', status: 'resolved' },
        { abbrev: 'PRN', expansion: 'pro re nata (필요 시)', status: 'resolved' },
        { abbrev: 'LOC', expansion: 'Loss of Consciousness (의식 소실)', status: 'resolved' },
        { abbrev: 'HLD', expansion: null, status: 'unregistered' },
      ],
      citations_count: 9,
    },
  },

  /* ────────────────────────── 2. 담낭절제술 후 추적 (8 visit) ────────────────────────── */
  {
    id: 'pt-02',
    caseSummary: '담낭절제술 전후 7개월 추적',
    caseCategory: 'postop',
    demographics: '52세 남성',
    fileName: 'pt-02_postop_chole.pdf',
    emrText: `외래 의무기록 — 외과 외래 / 내과 만성 외래
환자: ㅈㅎㅎ / 남 / 52세 | 등록번호: PT-2026-0002

══════════════════════════════════════════════════════════════
[2025.10.05 외래 — 외과 술전 평가]

S: 우상복부 통증 3개월, 식후 악화. NRS 4. 발열 없음, 황달 없음.
   식이 조절(저지방)로 빈도 약간 감소 중. 체중 변화 없음.

O:
  V/S: BP 134/82, HR 76, RR 16, BT 36.5, SpO2 99%, BMI 26.4
  US: 다발성 GB stones (largest 1.8cm), GB wall normal thickness.
       Common bile duct: not dilated.
  Lab: WBC 6.4, AST/ALT 24/28, T-Bil 0.7, ALP 65, GGT 28
  PE: RUQ tenderness mild, Murphy's sign negative.

PMHx: HTN (2020경 진단, Amlodipine 5mg qd 5년)
       HLD (2022경 진단, Atorvastatin 20mg qd 3년)
수술력: 없음
알레르기: NKDA
복용약: Amlodipine 5mg qd, Atorvastatin 20mg qd

특이사항: 무증상 결석 아닌 증상성 결석 → 수술 적응증.
         담관 확장 없음 → 단순 담낭결석.

A: Symptomatic cholelithiasis.

P: 복강경 담낭절제술 예정 (2026.01 일정 예약).
   술전 ECG, CXR, basic lab 의뢰. NPO 8h 교육.
   증상 악화(고열, 황달, NRS 7 이상) 시 즉시 응급실 내원.

══════════════════════════════════════════════════════════════
[2025.12.15 외래 — 외과 술전 점검]

S: 통증 episode 2회 추가 (지난 2개월). NRS 5. 식이 조절 중.
   야간 통증 1회 — 1시간 후 자연 호전. 발열 없음.

O:
  V/S: BP 130/80, HR 74, RR 16, BT 36.4, SpO2 99%
  PE: RUQ tenderness mild. Murphy's sign neg. No jaundice.
  Lab: WBC 6.8, AST/ALT 26/30, T-Bil 0.8 (안정 범위)

PMHx, 수술력, 알레르기, 복용약: 동일.

특이사항: 통증 빈도 증가 — 수술 일정 앞당김 고려 (안 함).
         NSAIDs 처방 X (담낭염 우려).

A: Symptomatic cholelithiasis, 통증 빈도 증가.

P: 2026.01.19 수술 예정 (변동 없음). APAP PRN 처방.

══════════════════════════════════════════════════════════════
[2026.01.18 입원 — 술전]

S: 입원 전 무통증. 식이 정상. 컨디션 양호.

O:
  Pre-op lab: WBC 6.8, Hb 14.2, PLT 240k, INR 1.0, BUN 14, Cr 0.85
              AST/ALT 26/30, T-Bil 0.8, Na/K 140/4.2
  ECG: NSR, no acute change
  CXR: clear lung field, normal cardiac silhouette
  Anesthesia: ASA II
  Consent obtained.

A: Pre-op evaluation complete. Ready for surgery.

P: 익일 복강경 담낭절제술. NPO from midnight.

══════════════════════════════════════════════════════════════
[2026.01.19 수술]

Procedure: Laparoscopic cholecystectomy.
OP time: 65min. EBL: 50mL.
Pathology: Chronic cholecystitis with cholelithiasis. No malignancy.
Intraop complications: None.
Discharge planning: POD #2-3 expected.

══════════════════════════════════════════════════════════════
[2026.01.21 퇴원 — POD #2]

S: 통증 NRS 2 (창상부). Mild incisional discomfort.
   Diet 양호 (regular diet 진행). No nausea/vomiting.

O:
  V/S: stable. BP 130/82, HR 76, BT 36.6, SpO2 99%
  PE: Wound clean & dry, no signs of infection. Bowel sounds normal.
  No fever.

A: Uncomplicated post-op course. POD #2.

P: Discharge with:
   - Cefaclor 250mg tid × 5d
   - APAP 500mg q6h PRN
   외과 외래 2주 후 (2026.02.03).
   드레싱 자가 관리 교육.

══════════════════════════════════════════════════════════════
[2026.02.03 외래 — 술후 2주 f/u]

S: 통증 NRS 2/10, 점진 호전 중. 식이 정상화.
   배변 정상. 활동량 회복 중.

O:
  V/S: BP 128/78, HR 74. Wound healed (small incision scars).
  PE: 복부 정상, no tenderness.
  Lab: AST/ALT 28/32 정상, no anemia (Hb 13.5).

PMHx: 동일 + 담낭결석 s/p 절제 (2026.01.19).
수술력: 복강경 담낭절제술 추가.
알레르기: NKDA.
복용약: 동일 + 술후 항생제 종료.

특이사항: 술후 회복 정상.

A: 술후 회복 정상.

P: 6주 후 외래 (2026.03.17).

══════════════════════════════════════════════════════════════
[2026.03.17 외래 — 술후 7주]

S: 무증상. 식이 정상. 운동 복귀 (조깅 시작).

O:
  V/S: BP 130/80, HR 74. Wound completely healed.
  PE: 복부 정상.

PMHx, 수술력, 알레르기, 복용약: 동일.

특이사항: 술후 종결 시점 도달.

A: 술후 종결. 합병증 없음.

P: 외과 외래 종결. 만성외래에서 HTN/HLD 추적.
   다음 만성외래 6주 후.

══════════════════════════════════════════════════════════════
[2026.04.28 외래 — 내과 만성 외래 (금일)]

S: 식후 더부룩함 가끔 (NRS 3/10), 주 1-2회 빈도.
   특히 기름진 음식 후 발생. 통증·발열·황달 없음.

O:
  V/S: BP 128/78, HR 72, RR 16, BT 36.5, SpO2 99%
  PE: abdomen soft, 정상 BS, no tenderness.
  Lab: AST/ALT 28/32 정상, Bili 0.8 정상,
       LDL 95 (Atorvastatin 효과), HbA1c 5.6 정상

PMHx: HTN, HLD, 담낭결석 s/p 절제.
수술력: 복강경 담낭절제술 (2026.01.19).
알레르기: NKDA.
복용약: Amlodipine 5mg qd, Atorvastatin 20mg qd.

특이사항: 술후 적응 단계 (담즙 흐름 변화 적응 중).
         NRS 5 이상 또는 발열 동반 시 GI consult.

A: Post-cholecystectomy 적응 단계, otherwise stable.

P: 저지방 식이 교육. HTN/HLD 약 유지.
   증상 악화 시 GI consult. 다음 외래 3개월 후.`,
    expectedResult: {
      patient_label: '52세 남성 · 수술 후 추적 외래',
      primary_concern: {
        title: '담낭절제술 후 추적 (7개월)',
        summary:
          '2025.10 증상성 담낭결석 진단 → 2026.01 복강경 절제 → 합병증 없이 외과 종결. 만성외래에서 HTN/HLD 유지.',
        key_trends: [
          '술후 통증 NRS: 술후 2주 NRS 2 → 7주 무증상 → 4개월 식후 더부룩 NRS 3 (술후 적응)',
          'LFT 정상 일관 유지 (AST/ALT 28/32, Bili 0.8) — 수술 합병증 없음',
          'HTN/HLD 약물 변동 없이 안정 (BP 128/78, LDL 95)',
        ],
      },
      case_summary:
        '담낭절제술(2026.01) 전후 7개월. 합병증 없이 외과 종결, 만성질환 만성외래에서 유지.',
      current_state: {
        diagnoses: [
          '담낭결석 + 만성 담낭염, 복강경 담낭절제술 완료 (2026.01.19)',
          '고혈압 (Amlodipine 5mg qd)',
          '이상지질혈증 (Atorvastatin 20mg qd)',
        ],
        complaint:
          '식후 더부룩함 간헐적(NRS 3) — 술후 적응 단계. 저지방 식이 교육 진행.',
        recent_labs: { BP: '128/78', LDL: '95', 'AST/ALT': '28/32', Bili: '0.8' },
        medications: ['Amlodipine 5mg qd', 'Atorvastatin 20mg qd'],
      },
      resolved_issues: [
        {
          issue: '담낭결석 + 만성 담낭염',
          duration: '2025.10 진단 → 2026.01.19 복강경 절제 → 2026.03.17 외과 종결',
          note: '병리: 만성 담낭염. 합병증 없이 7주차 완치.',
          sourceChunkId: 'chunk-pt02-04',
        },
      ],
      timeline: [
        { date: '2025.10.05', event: '증상성 담낭결석 진단(US), 술전 평가', sourceChunkId: 'chunk-pt02-00', layer: 'primary' },
        { date: '2025.12.15', event: '술전 점검 — 통증 빈도 증가, 일정 유지', sourceChunkId: 'chunk-pt02-01', layer: 'primary' },
        { date: '2026.01.18', event: '술전 입원, ASA II 평가 완료', sourceChunkId: 'chunk-pt02-02', layer: 'primary' },
        { date: '2026.01.19', event: '복강경 담낭절제술 (EBL 50mL, 합병증 없음)', sourceChunkId: 'chunk-pt02-03', layer: 'primary' },
        { date: '2026.01.21', event: 'POD #2 퇴원', sourceChunkId: 'chunk-pt02-04', layer: 'primary' },
        { date: '2026.02.03', event: '술후 2주: 통증 NRS 2 호전, 정상 식이', sourceChunkId: 'chunk-pt02-05', layer: 'primary' },
        { date: '2026.03.17', event: '술후 7주 — 외과 종결 (합병증 없음)', sourceChunkId: 'chunk-pt02-06', layer: 'primary' },
        { date: '2026.04.28', event: '내과 외래: 식후 더부룩 NRS 3, 식이 교육', sourceChunkId: 'chunk-pt02-07', layer: 'primary' },
      ],
      abbreviations: [
        { abbrev: 'GB stones', expansion: 'gallbladder stones (담낭결석)', status: 'resolved' },
        { abbrev: 'POD', expansion: 'post-operative day (수술 후 일수)', status: 'resolved' },
        { abbrev: 'EBL', expansion: 'estimated blood loss (예상 출혈량)', status: 'resolved' },
        { abbrev: 'NSR', expansion: 'normal sinus rhythm (정상 동조율)', status: 'resolved' },
        { abbrev: 'ASA II', expansion: 'American Society of Anesthesiologists 분류 II', status: 'resolved' },
        { abbrev: 'APAP', expansion: 'acetaminophen', status: 'resolved' },
        { abbrev: 'CXR', expansion: 'Chest X-Ray (흉부 방사선)', status: 'resolved' },
        { abbrev: 'BS', expansion: 'Bowel Sounds (장음)', status: 'resolved' },
        { abbrev: 'HLD', expansion: null, status: 'unregistered' },
      ],
      citations_count: 8,
    },
  },

  /* ────────────────────────── 3. 다약제 노인 다분과 협진 (8 visit) ────────────────────────── */
  {
    id: 'pt-03',
    caseSummary: '다약제 복용 75세 · HF/AFib/CKD/우울',
    caseCategory: 'multidrug',
    demographics: '75세 남성',
    fileName: 'pt-03_multidrug.pdf',
    emrText: `외래 의무기록 — 순환기 → 정신과 → 신장내과 협진
환자: ㄱㅇㄴ / 남 / 75세 | 등록번호: PT-2026-0003

══════════════════════════════════════════════════════════════
[2022.06.10 외래 — 순환기 초진]

S: 운동 시 호흡곤란 6개월 진행 (NYHA II). 부종 양측 발목.
   가벼운 가사일에도 숨참. PND, orthopnea 동반.

O:
  V/S: BP 142/88, HR 88 (irregular), RR 18, BT 36.5, SpO2 96%
  PE: 양측 발목 1+ pitting edema, JVD mild. S3 gallop (+).
  Echo: LVEF 38%, mild LAD, mitral regurgitation mild.
        AFib (chronic, rate-controlled).
  Lab: BNP 480 (elevated), Cr 1.1, K+ 4.2, Hb 13.6
  ECG: AFib, ventricular rate 88.

PMHx: HTN (2015경 진단)
       AFib (2020 발견, 자가 무증상)
수술력: 없음
알레르기: NKDA
복용약: 없음 (HTN은 비약물 관리 중)

특이사항: HFrEF + 만성 AFib. 항응고 필요.

A: HFrEF (LVEF 38%) with chronic AFib.

P:
   - Carvedilol 6.25mg BID (베타차단제)
   - Apixaban 5mg BID (항응고 — CHA2DS2-VASc 4점)
   - Furosemide 20mg qd (이뇨)
   - 4주 후 외래 재평가. 저염식 교육.

══════════════════════════════════════════════════════════════
[2023.02.18 외래 — 순환기 추적]

S: 호흡곤란 호전 NYHA I-II. 부종 호전. 약물 순응도 양호.

O:
  V/S: BP 128/76, HR 72 (irregular), RR 16, BT 36.5, SpO2 98%
  PE: 부종 trace, JVD 없음, S3 gone.
  Lab: BNP 280 (호전), Cr 1.4 ↑ (기저 1.1 대비 상승), K+ 4.5
  Echo: LVEF 38% (no change)

PMHx, 수술력, 알레르기: 동일.
복용약: Carvedilol 6.25mg BID, Apixaban 5mg BID, Furosemide 20mg qd

특이사항: Cr 1.4로 상승 — Furosemide 영향 가능성.
         과도한 이뇨 회피 필요.

A: HFrEF/AFib 안정. 신기능 경미 악화 (Furosemide 영향).

P: Furosemide 20→10mg qd 감량. Cr 2주 후 재검.
   다음 외래 6주 후.

══════════════════════════════════════════════════════════════
[2023.09.05 외래 — 순환기 추적]

S: 호흡곤란 안정. 환자 신규 호소: 우울감, 흥미 상실 (3개월).
   수면 단절, 식욕 감소, 체중 3kg 감소. PHQ-9 14점 (중등도).

O:
  V/S: BP 124/74, HR 70, RR 16, BT 36.6, SpO2 98%
  PE: 부종 없음. Lab: BNP 220, Cr 1.3 (안정).

PMHx, 수술력, 알레르기: 동일.
복용약: Carvedilol 6.25mg BID, Apixaban 5mg BID, Furosemide 10mg qd

특이사항: 우울 신호 — 심부전 환자의 흔한 합병증.

A: HF/AFib stable. Major depressive symptoms — 정신과 평가 필요.

P: 정신과 협진 의뢰. 심부전 약물 유지.

══════════════════════════════════════════════════════════════
[2023.11.20 정신과 협진]

S: 우울감 지속. PHQ-9 14점. GAD-7 8점.
   특이 자살 사고 없음. 일상 기능 저하 mild.

O: MMSE 28/30 (정상). 약물성 우울 가능성 평가:
   Carvedilol — 우울 보고 있음. 그러나 심부전 효과 우선.

PMHx: + Major Depressive Disorder 진단.

A: Major Depressive Disorder, 중등도.

P: Sertraline 50mg qd 시작 (간 대사 안전).
   2-4주 후 효과 평가. 인지행동치료 권유.

══════════════════════════════════════════════════════════════
[2024.04.12 외래 — 순환기 추적]

S: 우울 호전 (PHQ-9 6점). 호흡곤란 NYHA I.
   복약 순응도 양호.

O:
  V/S: BP 122/72, HR 68 (irregular), RR 16, BT 36.5, SpO2 98%
  Echo: LVEF 42% (호전)
  Lab: BNP 180, Cr 1.4, K+ 4.4

PMHx: HFrEF, AFib, MDD.
수술력: 없음. 알레르기: NKDA.
복용약: Carvedilol 6.25mg BID, Apixaban 5mg BID, Furosemide 10mg qd,
       Sertraline 50mg qd

특이사항: LVEF 38→42% 호전. GDMT 효과.

A: HF/AFib 호전, 우울 호전.

P: 동일 약물 유지. 다음 외래 6개월 후.

══════════════════════════════════════════════════════════════
[2025.04.20 외래 — 욕실 낙상 후 follow-up]

내원경위: 일주일 전 욕실 낙상, 우측 상지 타박. 골절 없음(X-ray).

S: 통증 NRS 3, 호전 중. Apixaban 복용 중 출혈 우려.

O:
  V/S: BP 126/76, HR 72, SpO2 98%
  PE: 우측 상완 멍 (resolving), 신경학적 정상.
  Lab: Hb 13.0 (안정, 출혈 sign 없음).

PMHx, 복용약: 동일.

특이사항: Apixaban 출혈 sign 모니터링.

A: 단순 타박. 항응고제 출혈 위험 X.

P: 외래 관찰. 출혈 sign(흑색변, 혈뇨, 점상출혈) 교육.

══════════════════════════════════════════════════════════════
[2025.08.10 외래 — 순환기 추적]

S: 호흡곤란 NYHA I. 우울 안정 (PHQ-9 5점).
   환자 호소: 야뇨 빈도 증가 (3회/night).

O:
  V/S: BP 124/74, HR 70, RR 16
  Lab: Cr 1.7 ↑ (1.4→1.7), eGFR 38 (G3b),
       BUN 32 (mildly elevated), K+ 4.6

PMHx: + CKD G3b 신규.
복용약: 동일.

특이사항: 신기능 추가 악화. CKD G3b 진입.
         Apixaban 용량 조정 필요 (CKD).

A: CKD G3b 신규 진단. 신장내과 협진 필요.

P: 신장내과 협진 의뢰. 야뇨 — 이뇨제 복용 시점 조정.

══════════════════════════════════════════════════════════════
[2025.10.05 신장내과 협진]

S: 신기능 추적 평가.

O:
  Lab: Cr 1.7, eGFR 38, urine ACR 45 (microalbuminuria mild)
  Renal US: 정상 크기, no obstruction.

A: CKD G3b 확진. 항응고제 dose 조정 필요.

P: Apixaban 5mg → 2.5mg BID 감량 (CrCl < 50 기준).
   3개월 후 Cr 재검. 단백 제한식 교육.

══════════════════════════════════════════════════════════════
[2026.04.15 외래 — 금일 순환기 추적]

S: NYHA I 안정. 우울 안정 (PHQ-9 5점).
   복약 6종 유지 — 자가 복약 관리 양호.
   신규 호소: 야뇨 4회/night (증가).

O:
  V/S: BP 122/74, HR 70 (irregular), RR 16, BT 36.5, SpO2 98%
  Lab: BNP 180, Cr 1.7 (안정), eGFR 38, K+ 4.5
  Echo: LVEF 42% (안정)

PMHx: HFrEF, AFib, MDD, CKD G3b.
수술력: 없음. 알레르기: NKDA.
복용약: Carvedilol 6.25mg BID, Apixaban 2.5mg BID (CKD 감량),
       Furosemide 10mg qd, Sertraline 50mg qd

특이사항: 야뇨 증가 — 전립선 비대증 가능성 (75세 남성 흔함).
         이뇨제 복용 시점 조정 (저녁 복용 회피).

A: HF/AFib/CKD/우울 안정. 야뇨 추가 평가 필요.

P:
   - Furosemide 복용 시점 아침으로 변경
   - 비뇨기과 협진 의뢰 (전립선 평가, PSA/IPSS)
   - 다음 외래 3개월 후.`,
    expectedResult: {
      patient_label: '75세 남성 · 다약제 복용 외래',
      primary_concern: {
        title: 'HF/AFib/CKD 다질환 통합 관리 (4년)',
        summary:
          'HFrEF + 만성 AFib 기반. LVEF 38→42% 호전, 신기능 점진 악화로 Apixaban 감량. 다분과 협진(정신과/신장내과)으로 안정.',
        key_trends: [
          'LVEF: 38(2022) → 42(2024) 호전 — Carvedilol 기반 GDMT 효과',
          'Cr: 1.1(기저) → 1.4(2023) → 1.7(2025) 점진 악화 → CKD G3b, Apixaban 감량(5→2.5mg)',
          'PHQ-9: 14(2023.09) → 5(2026) 호전 — Sertraline 유지로 안정',
        ],
      },
      case_summary:
        'HF/AFib/CKD/우울 4질환 동반, 다분과 협진 4년 진행. 안정 — 신규 야뇨 호소(비뇨기 평가 예정).',
      current_state: {
        diagnoses: [
          'HFrEF (2022.06 진단, LVEF 38→42% 호전)',
          'Chronic AFib (Apixaban 항응고)',
          'CKD G3b (2025.08, Cr 1.7, eGFR 38)',
          'Major Depressive Disorder (2023.11 진단, Sertraline)',
        ],
        complaint:
          'NYHA I 안정. 신규 야뇨 4회/night — 이뇨제 시점 조정 + 전립선 평가 예정.',
        recent_labs: { LVEF: '42%', Cr: '1.7', eGFR: '38', 'PHQ-9': '5' },
        medications: [
          'Carvedilol 6.25mg BID',
          'Apixaban 2.5mg BID (CKD 감량)',
          'Furosemide 10mg qd',
          'Sertraline 50mg qd',
        ],
      },
      resolved_issues: [
        {
          issue: '주요 우울장애 (MDD)',
          duration: '2023.09 호소 → 2023.11 진단 → 2024.04 호전 (PHQ-9 14→5)',
          note: '정신과 협진 1회, Sertraline 50mg 유지로 안정.',
          sourceChunkId: 'chunk-pt03-03',
        },
      ],
      timeline: [
        { date: '2022.06', event: 'HFrEF + AFib 진단, Carvedilol + Apixaban + Furosemide 시작', sourceChunkId: 'chunk-pt03-00', layer: 'primary' },
        { date: '2023.02', event: 'Cr 1.4 상승으로 Furosemide 감량', sourceChunkId: 'chunk-pt03-01', layer: 'primary' },
        { date: '2023.09', event: '우울감 호소 (PHQ-9 14) — 정신과 협진 의뢰', sourceChunkId: 'chunk-pt03-02', layer: 'primary' },
        { date: '2023.11', event: '정신과 협진: MDD 진단, Sertraline 시작', sourceChunkId: 'chunk-pt03-03', layer: 'primary' },
        { date: '2024.04', event: 'LVEF 42% 호전, 우울 호전', sourceChunkId: 'chunk-pt03-04', layer: 'primary' },
        { date: '2025.04', event: '욕실 낙상 후 우측 상지 타박 — 골절 없음', sourceChunkId: 'chunk-pt03-05', layer: 'incidental' },
        { date: '2025.10', event: '신장내과 협진: CKD G3b 확진, Apixaban 감량', sourceChunkId: 'chunk-pt03-06', layer: 'primary' },
        { date: '2026.04', event: '신규 야뇨 호소 — 이뇨제 조정 + 전립선 평가 예정', sourceChunkId: 'chunk-pt03-07', layer: 'primary' },
      ],
      abbreviations: [
        { abbrev: 'NYHA', expansion: 'New York Heart Association 심부전 분류', status: 'resolved' },
        { abbrev: 'HFrEF', expansion: 'Heart Failure with reduced Ejection Fraction (수축기 심부전)', status: 'resolved' },
        { abbrev: 'LVEF', expansion: 'Left Ventricular Ejection Fraction (좌심실 박출률)', status: 'resolved' },
        { abbrev: 'AFib', expansion: 'Atrial Fibrillation (심방세동)', status: 'resolved' },
        { abbrev: 'CKD G3b', expansion: 'Chronic Kidney Disease stage 3b (eGFR 30-44)', status: 'resolved' },
        { abbrev: 'PHQ-9', expansion: 'Patient Health Questionnaire-9 (우울 척도)', status: 'resolved' },
        { abbrev: 'MDD', expansion: 'Major Depressive Disorder (주요 우울장애)', status: 'resolved' },
        { abbrev: 'GDMT', expansion: 'Guideline-Directed Medical Therapy (가이드라인 표준 치료)', status: 'resolved' },
        { abbrev: 'BNP', expansion: 'B-type Natriuretic Peptide (심부전 표지자)', status: 'resolved' },
        { abbrev: 'JVD', expansion: 'Jugular Venous Distension (경정맥 팽창)', status: 'resolved' },
        { abbrev: 'CHA2DS2-VASc', expansion: 'AFib 뇌졸중 위험 점수', status: 'resolved' },
        { abbrev: 'LAD', expansion: null, status: 'unregistered' },
      ],
      citations_count: 8,
    },
  },

  /* ────────────────────────── 4. NSTEMI 후 PCI 추적 (7 visit) ────────────────────────── */
  {
    id: 'pt-04',
    caseSummary: 'NSTEMI 후 6개월 추적',
    caseCategory: 'observation',
    demographics: '58세 남성',
    fileName: 'pt-04_postacs.pdf',
    emrText: `외래 의무기록 — 순환기 외래 / 응급실 / 심혈관조영실
환자: ㅂㅇㅎ / 남 / 58세 | 등록번호: PT-2026-0004

══════════════════════════════════════════════════════════════
[2025.10.12 응급실 — ER 경유 입원]

내원경위: 자가 내원. 흉부 압박감 2시간 지속.

S: 흉부 압박감 NRS 7, 좌측 상지 방사통.
   발한 동반. 호흡곤란 mild. 어지러움 없음.
   심혈관 위험인자: 흡연 30갑년, HTN 5년, HLD 3년, 가족력(+).

O:
  V/S: BP 152/96, HR 92, RR 20, BT 36.6, SpO2 97%
  PE: 안면 창백, 발한(+). 흉부 청진 정상. S3/S4 (-).
  ECG: ST depression V4-V6 (1.5mm). No Q wave.
  Lab: Troponin-I 2.4 → 4.8 ng/mL (1h 후, 상승),
       CK-MB 12 (elevated), BNP 120 (mildly elevated)
       Lab: WBC 8.4, Hb 14.8, Cr 1.0, K+ 4.3

PMHx: HTN (Losartan 50mg qd 5년), HLD (Atorvastatin 20mg qd 3년)
수술력: 없음
알레르기: NKDA
복용약: Losartan 50mg qd, Atorvastatin 20mg qd, ASA 100mg qd (자가 복용)

A: NSTEMI (Non-ST-Elevation Myocardial Infarction).

P:
   - Cath lab 활성화 (urgent coronary angiography within 24h).
   - DAPT loading: ASA 300mg + Clopidogrel 600mg loading.
   - Heparin IV.
   - Atorvastatin 40mg loading.
   - 입원 (CCU).

[2025.10.12 같은 날 수술]
Coronary angio: LAD proximal 90% stenosis. RCA mild, LCx mild.
PCI to LAD: DES 1개 삽입 (3.0×24mm). TIMI flow grade 3 restored.
No complications.

══════════════════════════════════════════════════════════════
[2025.10.15 퇴원 (POD #3)]

S: 무증상. NRS 0. 식이 정상. 보행 자립.

O: V/S stable. PCI site clean.
   Echo (pre-discharge): LVEF 50%, mild anterior hypokinesis.

A: s/p PCI to LAD with DES, Day 3.

P (Discharge meds):
   - ASA 100mg qd (영구)
   - Clopidogrel 75mg qd (DAPT, 1년)
   - Atorvastatin 40mg qhs (고강도 스타틴)
   - Bisoprolol 2.5mg qd (베타차단)
   - Lisinopril 5mg qd (ACEi)
   금연 강력 권고. 심장재활 의뢰. f/u 5주 후.

══════════════════════════════════════════════════════════════
[2025.11.20 외래 — 술후 5주 f/u]

S: 무증상. NRS 0. 걷기 30분/day 가능. 금연 유지.

O:
  V/S: BP 124/76, HR 64, RR 16, SpO2 99%
  PE: 정상. Wound healed (PCI site).
  Lab: LDL 78 (목표 < 70 도달 임박), HbA1c 5.7 정상,
       AST/ALT 22/24, Cr 1.0, K+ 4.2

PMHx: + NSTEMI s/p PCI to LAD (2025.10.12).
수술력: PCI 1회.
알레르기: NKDA.
복용약: ASA, Clopidogrel, Atorvastatin 40mg, Bisoprolol, Lisinopril.

특이사항: DAPT 양호. 출혈 sign 없음. 심장재활 시작.

A: Post-PCI 회복 정상, secondary prevention 진행.

P: 약물 동일. 심장재활 8주 프로그램 시작.
   다음 외래 8주 후.

══════════════════════════════════════════════════════════════
[2026.01.18 외래 — 술후 3개월]

S: 무증상. 운동 능력 개선 — 빠른 걷기 40분/day, 자전거 시작.
   금연 유지 (3개월차).

O:
  V/S: BP 120/74, HR 60, RR 16
  Echo: LVEF 55% (정상화)
  Lab: LDL 70, HbA1c 5.7, AST/ALT 24/26, CPK 90

PMHx, 수술력, 알레르기: 동일.
복용약: 동일.

특이사항: LVEF 50→55% 정상화. DAPT 출혈 없음.

A: Post-PCI 안정, LVEF 회복.

P: DAPT 6개월 더 (총 1년). 약물 유지.
   다음 외래 3개월 후.

══════════════════════════════════════════════════════════════
[2026.04.20 외래 — 술후 6개월 (금일)]

S: 무증상. NRS 0. 운동 능력 30-40분/day 안정.
   금연 6개월 유지. 식이 조절 양호.

O:
  V/S: BP 118/72, HR 62, RR 16, BT 36.5, SpO2 99%
  PE: 정상. PCI site 흔적 minimal.
  Lab: LDL 65 (목표 도달), HbA1c 5.8, AST/ALT 22/24,
       Cr 1.0, K+ 4.3

PMHx: HTN, HLD, NSTEMI s/p PCI.
수술력: PCI (2025.10.12).
알레르기: NKDA.
복용약: ASA 100mg qd, Clopidogrel 75mg qd (DAPT),
       Atorvastatin 40mg qhs, Bisoprolol 2.5mg qd, Lisinopril 5mg qd.

특이사항: 6개월 무 event. LDL 65 — secondary prevention 목표 도달.

A: Post-PCI 안정, secondary prevention 효과적.

P: DAPT 6개월 추가 유지 (총 1년).
   ASA 평생 유지. Clopidogrel은 1년에 단독 ASA로 전환 검토.
   다음 외래 3개월 후. 1년 시점 stress test 고려.`,
    expectedResult: {
      patient_label: '58세 남성 · 관상동맥 시술 후 추적',
      primary_concern: {
        title: 'NSTEMI 후 PCI 추적 (6개월)',
        summary:
          '2025.10 LAD에 DES 1개 삽입 후 6개월 무 event. DAPT 유지, secondary prevention 목표 도달.',
        key_trends: [
          'LDL: 78(2개월) → 70(3개월) → 65(6개월) 안정 강하 — 고강도 스타틴 효과',
          'LVEF: 50(퇴원) → 55%(3개월) 정상화 — 좌심실 기능 회복',
          '운동 능력: 술후 5주 30분/day → 6개월 40분/day + 자전거 — 점진적 회복',
        ],
      },
      case_summary:
        'NSTEMI 후 PCI 완료(2025.10), 6개월 추적 — 무증상 안정, DAPT 유지 중.',
      current_state: {
        diagnoses: [
          'NSTEMI s/p PCI to LAD (DES 1개, 2025.10.12)',
          '이상지질혈증 (Atorvastatin 40mg qhs)',
          '고혈압 (Lisinopril 5mg qd)',
        ],
        complaint:
          '무증상. NRS 0. 운동 능력 40분/day. 금연 6개월 유지. DAPT 6개월 추가 결정.',
        recent_labs: { LDL: '65', HbA1c: '5.8', LVEF: '55%', BP: '118/72' },
        medications: [
          'ASA 100mg qd',
          'Clopidogrel 75mg qd (DAPT)',
          'Atorvastatin 40mg qhs',
          'Bisoprolol 2.5mg qd',
          'Lisinopril 5mg qd',
        ],
      },
      resolved_issues: [
        {
          issue: '급성 흉통 / NSTEMI',
          duration: '2025.10.12 발현 → 같은 날 PCI → 2025.11.20 무증상 회복',
          note: 'LAD proximal 90% → DES 1개. 합병증 없이 술후 5주차 운동 가능.',
          sourceChunkId: 'chunk-pt04-00',
        },
      ],
      timeline: [
        { date: '2025.10.12', event: 'NSTEMI 진단, LAD에 DES 1개 삽입 (PCI)', sourceChunkId: 'chunk-pt04-00', layer: 'primary' },
        { date: '2025.10.15', event: '퇴원, DAPT + 스타틴 + 베타블로커 + ACEi 시작', sourceChunkId: 'chunk-pt04-01', layer: 'primary' },
        { date: '2025.11.20', event: '술후 5주: 심장재활 시작, LDL 78', sourceChunkId: 'chunk-pt04-02', layer: 'primary' },
        { date: '2026.01.18', event: '술후 3개월 Echo: LVEF 50→55% 정상화', sourceChunkId: 'chunk-pt04-03', layer: 'primary' },
        { date: '2026.04.20', event: '술후 6개월: LDL 65 목표 도달, 무증상 — DAPT 6개월 추가', sourceChunkId: 'chunk-pt04-04', layer: 'primary' },
      ],
      abbreviations: [
        { abbrev: 'NSTEMI', expansion: 'Non-ST-Elevation Myocardial Infarction (비ST상승 심근경색)', status: 'resolved' },
        { abbrev: 'PCI', expansion: 'Percutaneous Coronary Intervention (관상동맥 중재시술)', status: 'resolved' },
        { abbrev: 'LAD', expansion: 'Left Anterior Descending coronary artery (좌전하행 관상동맥)', status: 'resolved' },
        { abbrev: 'DES', expansion: 'Drug-Eluting Stent (약물용출 스텐트)', status: 'resolved' },
        { abbrev: 'DAPT', expansion: 'Dual Antiplatelet Therapy (이중 항혈소판요법)', status: 'resolved' },
        { abbrev: 'ASA', expansion: 'Acetylsalicylic Acid (아스피린)', status: 'resolved' },
        { abbrev: 'qhs', expansion: 'quaque hora somni (취침 시)', status: 'resolved' },
        { abbrev: 'ACEi', expansion: 'Angiotensin-Converting Enzyme inhibitor', status: 'resolved' },
        { abbrev: 'CK-MB', expansion: 'Creatine Kinase MB isoenzyme', status: 'resolved' },
        { abbrev: 'TIMI', expansion: 'Thrombolysis In Myocardial Infarction flow grade', status: 'resolved' },
        { abbrev: 's/p', expansion: null, status: 'unregistered' },
      ],
      citations_count: 5,
    },
  },

  /* ────────────────────────── 5. 항암 치료 후 추적 (9 visit) ────────────────────────── */
  {
    id: 'pt-05',
    caseSummary: '유방암 수술 후 항암·내분비요법 18개월',
    caseCategory: 'oncology',
    demographics: '47세 여성',
    fileName: 'pt-05_oncology.pdf',
    emrText: `외래 의무기록 — 외과 → 종양내과 → 산부인과 협진
환자: ㅎㅈㅁ / 여 / 47세 | 등록번호: PT-2026-0005

══════════════════════════════════════════════════════════════
[2024.09.10 외래 — 외과 초진]

S: 자가 검진에서 좌측 유방 종괴 발견 (2주 전).
   유두 분비물 없음. 통증 없음.

O:
  PE: 좌측 유방 외상사분면 2cm 종괴, 단단함, 가동성 감소.
      유두 정상, 액와 림프절 촉지 안 됨.
  Mammography: 좌측 유방 spiculated mass, BI-RADS 5.
  US: 21mm hypoechoic mass, hypervascular.

PMHx: 없음 (건강 검진 정상)
       생리력: 12세 menarche, G2P2, 첫 출산 28세, 가족력(-)
수술력: 제왕절개 2회
알레르기: NKDA
복용약: 없음

A: Suspicious breast mass, BI-RADS 5. Core needle bx 시행.

[2024.09.18 조직검사 결과]
Pathology: Invasive ductal carcinoma, grade 2.
ER+ (90%), PR+ (80%), HER2- (IHC 1+), Ki-67 28%.
Staging workup: chest CT, abdomen CT, bone scan — no metastasis.
Final stage: cT2N0M0 (Stage IIA).

══════════════════════════════════════════════════════════════
[2024.10.21 수술]

Procedure: Left breast-conserving surgery (BCS) + sentinel lymph node biopsy (SLNB).
Specimen: Mass 2.2cm, margins clear (>2mm).
SLN: 0/3 positive.
Final pathology: IDC, grade 2, 22mm, LVI(-), SLN 0/3.
pStage IIA → 보조요법 계획.

══════════════════════════════════════════════════════════════
[2024.12.05 종양내과 — 보조 항암 시작]

S: 수술 회복 양호. 무증상.

O: ECOG 0. Lab: 정상. Echo (pre-chemo): LVEF 62% (정상).

PMHx: + Stage IIA breast cancer (IDC, ER+/PR+/HER2-).
수술력: BCS + SLNB (2024.10).
복용약: 없음.

A: Eligible for adjuvant chemotherapy.

P: AC×4 → T×4 regimen 시작 (3주 간격, 12주 코스).
   - AC: Doxorubicin 60mg/m² + Cyclophosphamide 600mg/m²
   - T: Paclitaxel 175mg/m²
   G-CSF prophylactic 적용 (1차 후).
   부작용 교육: 탈모, 오심, 피로, 호중구 감소.

══════════════════════════════════════════════════════════════
[2025.02.15 종양내과 — 항암 4 cycle 완료 (AC 종료)]

S: 피로, 탈모. 오심·구토 조절됨. 두 번의 G3 호중구 감소(2회) — G-CSF prophylactic 효과.

O:
  V/S: BP 110/68, HR 72, BT 36.4, SpO2 99%
  Lab: WBC 4.2 (G-CSF), Hb 11.2 (anemia mild), PLT 180k
       Cr 0.7, AST/ALT 24/26
  Echo (mid-chemo): LVEF 60% (안정 — Doxorubicin 심독성 모니터링).

PMHx, 수술력: 동일.
복용약: 항암 cycle, G-CSF, Ondansetron PRN.

특이사항: AC 완료, T 4 cycle 진행 예정.

A: AC 완료, 심독성 없음. T regimen 시작.

P: T×4 (Paclitaxel) 시작. 매주 cycle.
   부작용: 신경병증 모니터링.

══════════════════════════════════════════════════════════════
[2025.04.20 종양내과 — 항암 8 cycle 완주]

S: 피로 회복 중. 손끝 저림 mild (T 부작용).
   탈모 회복 시작 (1cm 머리 자라기 시작).

O:
  V/S: BP 114/70, HR 76
  Lab: WBC 5.6 (정상화), Hb 12.4 (호전), PLT 200k
  PE: peripheral neuropathy Grade 1 (손끝).

A: 보조 항암 완주. Neuropathy mild (회복 예상).

P: RT (방사선 치료) 시작 예정. Gabapentin 100mg tid (신경병증).

══════════════════════════════════════════════════════════════
[2025.05.10 ~ 2025.05.30 방사선 치료]

Procedure: Whole breast RT 50Gy in 25 fractions + boost 10Gy in 5 fractions.
Total: 15회 시행 (hypofractionated).
부작용: 좌측 유방 grade 1 dermatitis. 피로 mild.
Complete: 2025.05.30.

══════════════════════════════════════════════════════════════
[2025.06.15 종양내과 — Endocrine therapy 시작]

S: RT 완료. Dermatitis 호전. 신경병증 NRS 1 호전.
   Menstruation: 항암 중단 후 미복귀 (premature ovarian failure 가능).

O: Lab: AST/ALT 28/30, total bili 0.6, BMD 정상.
   FSH/LH 상승 (premature menopause).

A: Adjuvant therapy → Endocrine therapy 진입.
   ER+ premenopausal → Tamoxifen 선택 (vs ovarian suppression + AI).

P: Tamoxifen 20mg qd 시작 (5년 예정).
   부작용 교육: hot flashes, DVT 위험.

══════════════════════════════════════════════════════════════
[2025.09.18 외래 — 1회성 URI episode]
S: 콧물·인후통 3일, 미열 37.6°C. 기침 없음.
O: V/S: BP 110/68, BT 37.6, SpO2 98%. 인후 발적, 경부 림프절 무.
A: 단순 URI (viral). 항암 종료 5개월 — 면역 회복 단계.
P: 보존 치료 (수분·휴식). 39°C 이상 또는 화농성 가래 시 재방문.

══════════════════════════════════════════════════════════════
[2025.11.05 종양내과 — 6개월 추적]

S: 무증상. 일상 회복.
   호소: hot flashes 빈번 (하루 5-6회), 수면 방해.

O:
  V/S: BP 116/72, HR 72
  Mammography & US: NED (No Evidence of Disease).
  CA15-3: 12 (정상 < 30).
  Lab: AST/ALT 28/30, BMD 정상.

PMHx: + Premature menopause (chemo-induced).
수술력: 동일.
복용약: Tamoxifen 20mg qd.

특이사항: NED 유지. Hot flashes 일상 지장.
         호르몬 대체요법 금기 → SSRI/SNRI 비호르몬 옵션.

A: NED 유지. Hot flashes 치료 필요.

P: 산부인과 협진 의뢰 (vasomotor sx 관리).

══════════════════════════════════════════════════════════════
[2026.02.10 산부인과 협진]

S: Hot flashes 하루 5-6회. NRS 7 (불편감).
   수면 단절. 일상 지장 mild.

O: PE: 정상. Lab: 동일.

A: Vasomotor symptoms, chemo-induced menopause.

P: Venlafaxine 37.5mg qd 시작 (4주 후 평가).
   비호르몬 옵션 — Tamoxifen interaction 없음.
   생활 관리: 카페인 제한, 시원한 환경 교육.

══════════════════════════════════════════════════════════════
[2026.04.18 종양내과 — 금일 외래]

S: hot flashes NRS 7→3 호전 (Venlafaxine 효과).
   수면 호전. 일상 활동 정상.
   Tamoxifen 순응도 양호.

O:
  V/S: BP 114/70, HR 70, BT 36.5
  Mammography: NED (1년차 정기 검진).
  US: NED.
  CA15-3: 11 (안정 정상).
  Lab: AST/ALT 26/28, BMD 정상.

PMHx: Breast cancer Stage IIA s/p BCS+SLNB+AC-T+RT+Tamoxifen.
수술력: BCS + SLNB (2024.10).
알레르기: NKDA.
복용약: Tamoxifen 20mg qd, Venlafaxine 37.5mg qd.

특이사항: 18개월차 NED 유지. 부작용 관리 효과적.

A: NED at 18 months post-diagnosis. Hot flashes 관리됨.

P: Tamoxifen 유지 (5년 코스 중 10개월차).
   다음 추적 6개월 후. 매년 mammography.
   Hot flashes 호전 유지 시 Venlafaxine 유지.`,
    expectedResult: {
      patient_label: '47세 여성 · 종양 추적 외래',
      primary_concern: {
        title: '유방암 수술 후 추적 (18개월)',
        summary:
          'Stage IIA, ER+/HER2- 유방암. BCS + 보조 항암·방사선·내분비요법 완료. NED 유지 중.',
        key_trends: [
          'CA15-3: 12(2025.11) → 11(2026.04) 정상 범위 안정',
          'Hot flashes NRS: 7(2025.11) → 3(2026.04) 호전 — Venlafaxine 효과 (비호르몬)',
          'Tamoxifen 유지 — 5년 코스 중 10개월차, 부작용 관리하며 완주 진행',
        ],
      },
      case_summary:
        '유방암(Stage IIA, ER+/HER2-) 수술 후 보조 항암·방사선·내분비요법 18개월. NED 유지 중.',
      current_state: {
        diagnoses: [
          'Invasive ductal carcinoma, ER+/PR+/HER2- (Stage IIA, 2024.09 진단)',
          's/p 좌측 BCS + SLNB (2024.10), AC-T 보조항암 (2024.12~2025.04), RT 15회 (2025.05)',
          '내분비요법: Tamoxifen 20mg qd (2025.06 시작, 5y 예정)',
          '항호르몬 부작용성 hot flashes (2025.11~)',
          'Premature menopause (chemo-induced, 2025)',
        ],
        complaint:
          'NED 유지. hot flashes NRS 7→3 호전 (Venlafaxine 효과). 수면 호전.',
        recent_labs: { 'CA15-3': '11', Mammography: 'NED', LVEF: '60%' },
        medications: ['Tamoxifen 20mg qd', 'Venlafaxine 37.5mg qd'],
      },
      resolved_issues: [
        {
          issue: '보조 항암 — AC-T regimen',
          duration: '2024.12 시작 → 2025.04 종료 (8 cycles 완료)',
          note: 'G3 neutropenia 2회 — G-CSF prophylactic 적용으로 완주. 심독성 없음.',
          sourceChunkId: 'chunk-pt05-02',
        },
        {
          issue: 'Hot flashes 일상 지장 수준',
          duration: '2025.11 호소 → 2026.02 Venlafaxine 시작 → 2026.04 NRS 7→3',
          note: '비호르몬 옵션(SSRI/SNRI) 채택 — Tamoxifen 유지하면서 부작용 관리.',
          sourceChunkId: 'chunk-pt05-05',
        },
      ],
      timeline: [
        { date: '2024.09', event: '좌측 유방 종괴 IDC 진단 (Stage IIA, ER+/HER2-)', sourceChunkId: 'chunk-pt05-00', layer: 'primary' },
        { date: '2024.10.21', event: '좌측 BCS + SLNB (margin clear, SLN 0/3)', sourceChunkId: 'chunk-pt05-01', layer: 'primary' },
        { date: '2024.12-2025.04', event: '보조 항암 AC×4 → T×4 (8 cycles 완주)', sourceChunkId: 'chunk-pt05-02', layer: 'primary' },
        { date: '2025.05', event: '방사선 치료 RT 15회 완료', sourceChunkId: 'chunk-pt05-03', layer: 'primary' },
        { date: '2025.06', event: 'Tamoxifen 시작 (5y 예정)', sourceChunkId: 'chunk-pt05-04', layer: 'primary' },
        { date: '2025.09', event: '경증 URI episode — 외래 보존 치료', sourceChunkId: 'chunk-pt05-uri', layer: 'incidental' },
        { date: '2025.11', event: 'NED 확인 + hot flashes 호소 → 산부인과 협진', sourceChunkId: 'chunk-pt05-05', layer: 'primary' },
        { date: '2026.02', event: 'Venlafaxine 시작', sourceChunkId: 'chunk-pt05-06', layer: 'primary' },
        { date: '2026.04', event: 'NED 유지, hot flashes NRS 3 호전', sourceChunkId: 'chunk-pt05-07', layer: 'primary' },
      ],
      abbreviations: [
        { abbrev: 'IDC', expansion: 'Invasive Ductal Carcinoma (침윤성 관암종)', status: 'resolved' },
        { abbrev: 'BCS', expansion: 'Breast-Conserving Surgery (유방 보존술)', status: 'resolved' },
        { abbrev: 'SLNB', expansion: 'Sentinel Lymph Node Biopsy (감시림프절 생검)', status: 'resolved' },
        { abbrev: 'AC-T', expansion: 'Doxorubicin + Cyclophosphamide → Taxane regimen', status: 'resolved' },
        { abbrev: 'G-CSF', expansion: 'Granulocyte Colony-Stimulating Factor (호중구 자극인자)', status: 'resolved' },
        { abbrev: 'NED', expansion: 'No Evidence of Disease (질병 증거 없음)', status: 'resolved' },
        { abbrev: 'RT', expansion: 'Radiation Therapy (방사선 치료)', status: 'resolved' },
        { abbrev: 'CA15-3', expansion: 'Cancer Antigen 15-3 (유방암 종양표지자)', status: 'resolved' },
        { abbrev: 'URI', expansion: 'Upper Respiratory Infection (상기도 감염)', status: 'resolved' },
        { abbrev: 'ECOG', expansion: 'Eastern Cooperative Oncology Group performance status', status: 'resolved' },
        { abbrev: 'BI-RADS', expansion: 'Breast Imaging-Reporting and Data System', status: 'resolved' },
        { abbrev: 'LVI', expansion: 'Lymphovascular Invasion (림프혈관 침윤)', status: 'resolved' },
        { abbrev: 'Ki-67', expansion: null, status: 'unregistered' },
      ],
      citations_count: 9,
    },
  },
];
