#!/bin/bash
# mixa tutti i video: spot15 e bumper con mix.sh, i nuovi concept con mix2.sh (punto diverso del brano)
set -e
cd "$(dirname "$0")"
./mix.sh
for fmt in verticale-9x16 quadrato-1x1 orizzontale-16x9; do
  ./mix2.sh out/notte15-$fmt-muto.mp4 out/sfx-notte15.wav 45.74 15 finali/notte15-$fmt.mp4
  ./mix2.sh out/condominio15-$fmt-muto.mp4 out/sfx-condominio15.wav 59.751 15 finali/condominio15-$fmt.mp4
  ./mix2.sh out/motivi15-$fmt-muto.mp4 out/sfx-motivi15.wav 17.99 15 finali/motivi15-$fmt.mp4
done
ls finali/*.mp4 | wc -l
