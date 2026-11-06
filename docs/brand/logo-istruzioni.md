# IMI Service — kit vettoriale
Ricostruzione vettoriale del concept 02: riquadro, passata diagonale e tergivetro nella posizione finale. Lettere convertite in tracciati: nessun font da caricare. Non è un ricalco pixel per pixel del bozzetto.

## File
- logo.svg: principale, sfondo trasparente, traccia crema.
- logo-crema.svg: fondo crema incluso.
- simbolo.svg: solo marchio, anche favicon SVG.
- logo-monocromatico.svg: versione navy e bianco, per fondo bianco.
- logo-animato.svg: animazione autonoma CSS, 1,85 secondi totali, una sola esecuzione e fermo finale.
- anteprima.html: aprire con i file nella stessa cartella.

## Prompt da dare a Claude Code
Integra questi SVG senza ridisegnare il logo. Palette navy #0E1A2B, giallo #FFD23C, crema #F6F3EC. Usa logo.svg per header e footer. Per ingresso del sito usa logo-animato.svg inline oppure come img: il riquadro parte pieno, la lama avanza lungo la diagonale, rivela la traccia crema e si ferma nella posizione del logo statico. Non applicare loop. Rispetta prefers-reduced-motion, già gestito nello SVG. Non bloccare caricamento o navigazione con un preloader. Per riavviare solo al primo ingresso monta il componente una volta; non rimontarlo ad ogni navigazione. Se inserisci più copie inline assegna ID unici al clipPath pane e ai riferimenti. Conserva viewBox e proporzioni, dimensiona con width e height:auto. Su sfondi diversi dal crema usa logo-crema.svg o adatta in modo consapevole il colore della passata. Usa simbolo.svg per favicon; sotto 32px verifica la resa del manico. Per header suggerisco larghezza 150–190px. Accessibilità: nome IMI Service, evita doppia lettura di title e testo esterno.

## Nota tecnica
Il marchio usa solo tracciati e forme vettoriali. Versione monocromatica prevista per supporto bianco; per ricamo o taglio concordare dimensione minima e aperture con il fornitore.
