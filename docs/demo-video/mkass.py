import json
d=json.load(open("/tmp/video/timeline.json"))
def ts(s):
    h=int(s//3600); m=int((s%3600)//60); sec=s%60
    return f"{h}:{m:02d}:{sec:05.2f}"
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Sub,Malgun Gothic,44,&H00FFFFFF,&H00FFFFFF,&HC8140D06,&H00000000,0,0,0,0,100,100,0.4,0,3,7,0,2,180,180,56,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
lines=[head]
for a,b,txt in d["subs"]:
    t=txt.replace("\n","\\N")
    lines.append(f"Dialogue: 0,{ts(a)},{ts(b)},Sub,,0,0,0,,{t}\n")
open("/tmp/video/subs.ass","w",encoding="utf-8").writelines(lines)
print("cues:",len(d["subs"]),"total:",round(d["total"],1),"s")
