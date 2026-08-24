#!/usr/bin/env bash
# BGM 믹싱 — 원곡을 영상 길이에 맞춰 잇고 -14 LUFS(소셜 표준)로 정규화해 먹싱한다.
#
# 원곡: alex-morgan "Ambient Lofi Cinematic Background Music" (Pixabay Content License)
#       https://pixabay.com/music/ambient-ambient-lofi-cinematic-background-music-587393/
#       상업 사용 가능 · 출처 표기 불필요.
#
# 사용: ./bgm.sh <원곡.mp3> <자막까지_구운_무음영상.mp4> <결과.mp4> <페이드아웃_시작초>
#   페이드아웃_시작초 = 영상길이 - 4  (예: 2:52.17 영상이면 168.17)
set -euo pipefail
FFBIN="${FFBIN:-$HOME/.claude/tools/headless/node_modules/ffmpeg-static/ffmpeg}"
FF="$FFBIN -nostdin -y -loglevel error"

SRC="${1:?원곡 mp3 경로}"
VID="${2:?무음 영상 mp4 경로}"
OUT="${3:?결과 mp4 경로}"
FOUT="${4:?페이드아웃 시작초 (영상길이-4)}"

# 원곡이 영상보다 짧으면 2카피를 5초 크로스페이드로 이어 붙인다.
$FF -i "$SRC" -i "$SRC" \
    -filter_complex "[0:a][1:a]acrossfade=d=5:c1=tri:c2=tri[a]" -map "[a]" \
    -c:a pcm_s16le /tmp/_bgm_loop.wav

# 페이드 인/아웃 + 라우드니스 정규화.
# apad 로 오디오 꼬리를 늘려 두면 -shortest 가 영상 대신 오디오를 자른다 → 영상 끝이 안 잘림.
$FF -i /tmp/_bgm_loop.wav \
    -af "afade=t=in:st=0:d=1.5,afade=t=out:st=$FOUT:d=4,loudnorm=I=-14:TP=-1.5:LRA=11,apad" \
    -ar 48000 -ac 2 -c:a pcm_s16le /tmp/_bgm_fin.wav

# 비디오는 재인코딩 없이 복사 — 화질 손실 0.
$FF -i "$VID" -i /tmp/_bgm_fin.wav -map 0:v:0 -map 1:a:0 \
    -c:v copy -c:a aac -b:a 192k -shortest "$OUT"

rm -f /tmp/_bgm_loop.wav /tmp/_bgm_fin.wav
echo "완료: $OUT"
