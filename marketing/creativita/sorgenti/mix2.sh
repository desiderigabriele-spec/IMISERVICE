#!/bin/bash
# mix generico: $1 video muto, $2 effetti, $3 inizio nel brano (s), $4 durata, $5 uscita
M=/root/.claude/uploads/a5dc31a6-f306-58bf-8a7b-878b8eb884a9/e22ad007-pumpupthemind-groovy-moves-346818.mp3
D=$4; FO=$(python3 -c "print($D-0.8)")
ffmpeg -v error -y -i "$1" -ss $3 -t $D -i "$M" -i "$2" -filter_complex "\
[1:a]aresample=48000,volume=0.42,afade=t=in:st=0:d=0.015,afade=t=out:st=$FO:d=0.8[mus];\
[2:a]aresample=48000,asplit=2[fx][key];\
[mus][key]sidechaincompress=threshold=0.08:ratio=2:attack=10:release=200[duck];\
[duck][fx]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=9[a]" \
-map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t $D -movflags +faststart "$5"
