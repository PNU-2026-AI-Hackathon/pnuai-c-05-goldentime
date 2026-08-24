# 시연영상 빌드 파이프라인

PNU 창의융합AI해커톤 창업트랙 제출용 시연영상(**2분 52초 · 1920×1080 · 30fps**)을 만드는 스크립트 모음입니다.

**핵심은 재촬영 없이 카드만 갈아끼울 수 있다는 것입니다.** 화면 녹화(webm)는 한 번만 하고,
설명 카드는 HTML에 URL 파라미터를 넘겨 PNG로 렌더한 뒤 세그먼트로 이어 붙입니다.
문구를 고치거나 카드를 추가할 때 녹화를 다시 할 필요가 없습니다.

> 산출물 MP4(약 31MB)와 원본 녹화(webm)는 용량 때문에 저장소에 두지 않습니다.
> 작업 디렉터리는 `/tmp/video/`를 씁니다 — **재부팅하면 사라지므로** 완성본은 따로 보관하세요.

---

## 구성

```
raw/*.webm          화면 녹화 원본 (저장소 밖)
   │
   ├─ build.py           녹화 구간을 잘라 세그먼트로, 카드 PNG도 세그먼트로 → seg/*.mp4
   │                     PLAN 리스트가 구성·길이·자막을 전부 정의한다
   ├─ render-cards.mjs   cards/card.html + 파라미터 → cards/*.png (1440×810)
   ├─ insert-cards.py    카드 세그먼트를 만들고 seg/list.txt 순서를 다시 쓴다
   ├─ mkass.py           timeline.json → subs.ass (자막)
   └─ bgm.sh             BGM을 영상 길이에 맞춰 잇고 -14 LUFS로 먹싱
```

## 전체 순서

```bash
V=/tmp/video
FF=~/.claude/tools/headless/node_modules/ffmpeg-static/ffmpeg

# 1) 세그먼트 빌드 (녹화 원본이 $V/raw 에 있어야 함)
python3 build.py

# 2) 카드 렌더 → 카드 세그먼트 생성 + concat 순서 갱신
node render-cards.mjs
python3 insert-cards.py

# 3) 이어 붙이기 (재인코딩 없음)
$FF -nostdin -f concat -safe 0 -i $V/seg/list.txt -c copy -y $V/concat.mp4

# 4) 자막 굽기
python3 mkass.py
$FF -nostdin -i $V/concat.mp4 \
    -vf "subtitles=$V/subs.ass:fontsdir=$HOME/.local/share/fonts" \
    -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 \
    -c:a aac -b:a 128k -ar 48000 -y $V/영상_무음.mp4

# 5) BGM 먹싱 (마지막 인자 = 영상길이 - 4초)
./bgm.sh <원곡.mp3> $V/영상_무음.mp4 $V/영상_최종.mp4 168.17
```

## 현재 구성 (2026-08-25)

| 세그먼트 | 내용 | 길이 |
| --- | --- | --- |
| A–N | 오프닝 · 문제 · 비식별 · 요약 결과 · 교차검증 · 실측 리포트 · 데이터 주권 | 141.9s |
| **R** | `07-track` — 지어낸 실적 대신 기록을 공개합니다 | 7.5s |
| **P** | `08-peer` — 온프렘에서도 3개 모델이 서로를 검증합니다 (단일 A6000) | 7.5s |
| **Q** | `09-adapt` — 모델이 어디서 틀리는지 먼저 측정합니다 (QLoRA) | 7.5s |
| **S** | `10-gov` — 실데이터는 IRB 승인 후에만 다룹니다 | 7.5s |
| O | 아웃트로 (연락처) | 6.0s |

카드 06–09는 전부 **`계획` 뱃지**를 달아 실현된 기능과 시각적으로 분리합니다
(프로젝트 규칙: 미실현 주장은 미래형·"목표"로만).

## 주의사항

- **ffmpeg는 stdin을 먹습니다.** `while read` 루프 안에서 쓸 때 `-nostdin`을 빠뜨리면
  루프가 통째로 깨집니다. 모든 호출에 `-nostdin`을 붙이세요.
- **`-shortest`는 짧은 쪽에 맞춥니다.** BGM이 영상보다 짧으면 영상 끝이 잘립니다.
  `bgm.sh`는 `apad`로 오디오를 길게 만들어 이 문제를 막습니다.
- **자막 타이밍은 절대 시각입니다.** 카드를 중간에 끼우면 뒤쪽 자막이 밀립니다.
  현재 구성은 모든 자막 큐가 삽입 지점(135.94s) 이전이라 안전합니다.
- **BGM 라우드니스는 -14 LUFS로 맞춥니다.** 인스타·유튜브 정규화 기준이라
  업로드 후 음량이 눌리지 않습니다. 후보곡 비교 시에도 반드시 먼저 맞추세요 —
  안 맞추면 큰 쪽이 무조건 좋게 들립니다.
- 폰트는 `~/.local/share/fonts/malgun.ttf`(+`malgunbd.ttf`)를 씁니다.

## 검증

완성 후 다음을 확인합니다.

```bash
# 길이가 원본과 같은가 (잘림 없음)
$FF -nostdin -i 영상_최종.mp4 2>&1 | grep Duration

# 비디오 스트림이 무손실로 복사됐는가 (먹싱 전후 해시 동일)
$FF -nostdin -loglevel error -i 영상_무음.mp4  -map 0:v:0 -c copy -f md5 -
$FF -nostdin -loglevel error -i 영상_최종.mp4 -map 0:v:0 -c copy -f md5 -

# 라우드니스
$FF -nostdin -i 영상_최종.mp4 -af ebur128 -f null - 2>&1 | tail -12

# 카드가 제 위치에 들어갔는지 프레임으로 확인
for t in 139 147 155 162 169; do
  $FF -nostdin -loglevel error -ss $t -i 영상_최종.mp4 -frames:v 1 -y f_$t.png
done
```
