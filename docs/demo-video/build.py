import subprocess, os, json, shlex
FF="/home/click/.claude/tools/headless/node_modules/ffmpeg-static/ffmpeg"
RAW="/tmp/video/raw"; CARD="/tmp/video/cards"; SEG="/tmp/video/seg"
os.makedirs(SEG, exist_ok=True)
V="-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -ar 48000 -shortest"
SCALE="scale=1920:1080:flags=lanczos,setsar=1"

# (id, kind, src, in, dur, extra_vf, subtitles[(rel_start,rel_end,text)])
PLAN=[
 ("A","card","00-intro",None,5.0,None,[]),
 ("B","card","01-problem",None,3.2,None,[]),
 ("C","clip","submit",2.5,16.0,None,[
   (0.4,4.6,"25개 진료과 중 하나를 고릅니다 — 요약 관점이 분과마다 다르기 때문입니다"),
   (5.0,9.6,"합성 차트를 불러옵니다. 공개 데모는 실제 환자 기록을 쓰지 않습니다"),
   (10.0,15.6,"응급실 초진기록 2,085자 — 의사는 이걸 전부 읽고 판단해야 합니다")]),
 ("D","card","02-solve",None,3.2,None,[]),
 ("E","clip","submit",18.5,15.3,None,[
   (0.6,6.4,"먼저 비식별 — 식별자 후보를 자동으로 가리고 날짜를 시프트합니다"),
   (6.9,11.4,"자동 처리 결과를 사람이 눈으로 확인합니다. 더 가릴 부분은 직접 지정할 수 있습니다"),
   (11.9,15.1,"원문은 저장하지 않습니다. 비식별본만 요약 단계로 넘어갑니다")]),
 ("F","clip","submit",33.8,42.7,"setpts=PTS/8",[
   (0.2,5.2,"실제 요약 소요 42초 — 8배속. 속도보다 정확도를 택한 설정입니다")]),
 ("G","clip","submit",76.5,18.5,None,[
   (0.4,5.2,"분과 관점 요약. 맨 위는 지금 당장 확인해야 할 항목입니다"),
   (5.6,11.2,"모든 문장에 원문 / 추론 배지가 붙습니다 — 클릭하면 근거 위치로 이동합니다"),
   (11.6,18.2,"핵심 문제와 투약·치료 변경이 시계열로 정리됩니다")]),
 ("H","clip","submit",96.3,4.5,"crop=660:371:700:95,scale=1920:1080:flags=lanczos,unsharp=5:5:0.8",[
   (0.15,4.35,"그리고 여기 — 기록에 없는 것은 지어내지 않고 '없다'고 적습니다")]),
 ("I","card","03-trust",None,3.5,None,[]),
 ("J","clip","validation",6.0,20.5,None,[
   (1.4,6.6,"요약은 3개 백본이 각각 독립으로 만듭니다 — GPT-5.6 Sol · Claude Fable 5 · MedGemma 27B"),
   (7.0,12.6,"세 결과의 불일치만 기계가 뽑아내 자문 교수 검토 대상으로 넘깁니다"),
   (13.0,20.3,"합성 케이스 실행 기록 — 불일치 건수와 비용까지 그대로 적어둡니다")]),
 ("K","card","04-evidence",None,3.2,None,[]),
 ("L","clip","evidence",3.5,21.5,None,[
   (0.5,8.6,"합성 4케이스를 3개 모델로 각각 돌린 실행 기록을 그대로 공개합니다"),
   (9.1,13.3,"문장 수 · 비용 · 인용 검증 통과율 · 놓친 항목 — MedGemma는 한 케이스에서 실행 실패했습니다"),
   (13.8,18.4,"지난 판단이 틀렸으면 정정 기록을 남깁니다. 이것이 우리가 신뢰를 쌓는 방식입니다"),
   (18.9,21.3,"각 모델이 실제로 출력한 문장을 그대로 붙였습니다 — 오탈자도 고치지 않았습니다")]),
 ("M","card","05-sovereign",None,3.2,None,[]),
 ("N","clip","metrics",6.5,13.0,None,[
   (2.8,8.0,"MedGemma 27B 기반으로 폐쇄망 온프레미스 구성을 목표로 합니다"),
   (8.4,12.8,"환자 데이터도 모델 가중치도 병원 밖으로 나가지 않는 구조입니다")]),
 ("O","card","06-outro",None,6.0,None,[]),
]

def run(cmd):
    r=subprocess.run(cmd,shell=True,capture_output=True,text=True)
    if r.returncode: print("FAIL:",cmd[:160]); print(r.stderr[-900:]); raise SystemExit(1)

subs=[]; t=0.0; files=[]
for sid,kind,src,tin,dur,vf,sl in PLAN:
    out=f"{SEG}/{sid}.mp4"
    if kind=="card":
        chain=SCALE if not vf else vf
        run(f'{FF} -hide_banner -loglevel error -loop 1 -t {dur} -i {CARD}/{src}.png '
            f'-f lavfi -t {dur} -i anullsrc=r=48000:cl=stereo -vf "{chain}" {V} -y {out}')
        seg_dur=dur
    else:
        chain=vf if vf else SCALE
        if vf and "scale=" not in vf: chain=vf+","+SCALE
        if vf and vf.startswith("setpts"): chain=SCALE+","+vf
        run(f'{FF} -hide_banner -loglevel error -ss {tin} -t {dur} -i {RAW}/{src}.webm '
            f'-f lavfi -i anullsrc=r=48000:cl=stereo -vf "{chain}" {V} -y {out}')
        seg_dur=dur/8 if (vf and "PTS/8" in vf) else dur
    files.append(out)
    for a,b_,txt in sl: subs.append((t+a,t+b_,txt))
    print(f"  {sid} {kind:5} {src:11} dur={seg_dur:6.2f}  cum={t+seg_dur:7.2f}")
    t+=seg_dur

print(f"\nTOTAL {t:.2f}s = {int(t//60)}:{t%60:04.1f}")
json.dump({"total":t,"subs":subs},open("/tmp/video/timeline.json","w"),ensure_ascii=False,indent=1)
with open(f"{SEG}/list.txt","w") as f:
    for p in files: f.write(f"file '{p}'\n")
print("segments built:",len(files))
