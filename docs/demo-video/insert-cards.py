import subprocess, json
FF="/home/click/.claude/tools/headless/node_modules/ffmpeg-static/ffmpeg"
CARD="/tmp/video/cards"; SEG="/tmp/video/seg"
V="-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -r 30 -c:a aac -b:a 128k -ar 48000 -shortest"
SCALE="scale=1920:1080:flags=lanczos,setsar=1"
NEW=[("R","07-track",7.5),("P","08-peer",7.5),("Q","09-adapt",7.5),("S","10-gov",7.5)]
def run(c):
    r=subprocess.run(c,shell=True,capture_output=True,text=True)
    if r.returncode: print("FAIL:",c[:200]); print(r.stderr[-800:]); raise SystemExit(1)
for sid,png,dur in NEW:
    run(f'{FF} -nostdin -hide_banner -loglevel error -loop 1 -t {dur} -i {CARD}/{png}.png '
        f'-f lavfi -t {dur} -i anullsrc=r=48000:cl=stereo -vf "{SCALE}" {V} -y {SEG}/{sid}.mp4')
    print(f"  {sid} <- {png}.png  {dur}s")
order=list("ABCDEFGHIJKLMN")+["R","P","Q","S","O"]
with open(f"{SEG}/list.txt","w") as f:
    for s in order: f.write(f"file '{SEG}/{s}.mp4'\n")
base=141.9375; total=base+sum(d for _,_,d in NEW)
print("order:"," ".join(order))
print(f"total: {base:.2f} -> {total:.2f}s  ({int(total//60)}:{total%60:04.1f})")
