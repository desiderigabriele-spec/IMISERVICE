#!/bin/bash
# mix: musica (da M0, a tempo con il video) + effetti sonori, musica abbassata quando suonano gli effetti
M=/root/.claude/uploads/a5dc31a6-f306-58bf-8a7b-878b8eb884a9/e22ad007-pumpupthemind-groovy-moves-346818.mp3
M0=9.997
mix() { # $1 video muto, $2 traccia effetti, $3 durata, $4 inizio dissolvenza, $5 durata dissolvenza, $6 uscita
  ffmpeg -v error -y -i "$1" -ss $M0 -t $3 -i "$M" -i "$2" -filter_complex "\
[1:a]aresample=48000,volume=0.42,afade=t=in:st=0:d=0.015,afade=t=out:st=$4:d=$5[mus];\
[2:a]aresample=48000,asplit=2[fx][key];\
[mus][key]sidechaincompress=threshold=0.08:ratio=2:attack=10:release=200[duck];\
[duck][fx]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=9[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t $3 -movflags +faststart "$6"
}
mkdir -p finali
for f in out/spot15-*-muto.mp4; do b=$(basename $f -muto.mp4); mix $f out/sfx-spot15.wav 15 14.2 0.8 finali/$b.mp4; done
for f in out/bumper6-*-muto.mp4; do b=$(basename $f -muto.mp4); mix $f out/sfx-bumper6.wav 6 5.6 0.4 finali/$b.mp4; done
# solo audio per controllo
ffmpeg -v error -y -i finali/spot15-verticale-9x16.mp4 -vn -c:a copy finali/audio-spot15.m4a
