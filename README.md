# IMI Service – sito web

Sito statico (HTML, CSS, JS) per IMI Service, impresa di pulizie, sanificazioni e manutenzioni di Sesto San Giovanni.
Non serve nessuna build: su Vercel basta collegare il repository (Framework preset: **Other**, nessun comando di build, cartella di output: la radice).

- `index.html`: la pagina (CSS e JS sono dentro il file)
- `privacy.html`: bozza dell'informativa privacy, **da completare** con i dati societari

## Cosa c'è nella pagina

- **Apertura**: lo schermo parte bagnato. Le gocce vengono da una foto di gocce su grigio neutro (`assets/img/intro/gocce.jpg` verticale per il telefono, `gocce-pc.jpg` orizzontale per il computer): dove c'è acqua il sito si deforma e prende i riflessi e le ombre della foto, il resto resta nitido. Poi il tergivetro con il logo IMI pulisce con la passata a "S" dei vetristi (circa 4 secondi; un tocco la salta). Per deformare il sito dentro le gocce si usa un'immagine della prima schermata (`assets/img/intro/telefono-360/375/390/412/430.jpg`, una per larghezza di telefono, e `computer-1024/1152/1280.jpg`): **va rifatta se cambia la prima schermata**. Non viene mostrata a chi ha attivato la riduzione del movimento.
- **Computer** (da 1000 px): menu in alto, sezioni su due colonne, servizi con la foto a fianco del testo alternata destra/sinistra, quattro passi in fila.
- **Hero**: "Puliamo uffici, condomini e cantieri. Anche di notte.", con le città sopra il titolo, le foto dei sei servizi che si alternano e il timbro "Dal 2008" sulla foto.
- **Video di Stefano**: parte muto in automatico, con il pulsante "Attiva l'audio" al centro.
- **Sei servizi con prima/dopo**: scorrendo, la lama gialla passa da sinistra a destra e scopre il "dopo" sopra il "prima". Le foto sono in `assets/img/servizi/` (`<servizio>-prima.jpg` e `<servizio>.jpg`, 1080×720, stessa inquadratura).
- **Per chi** (aziende, amministratori, privati), **come lavoriamo** (schede da scorrere), **zone** (un furgone parte da Sesto e percorre la strada mentre scorri; il comune raggiunto si illumina e compare il pulsante WhatsApp), **preventivo in 3 domande** che apre WhatsApp col messaggio già scritto, **FAQ** e footer con i contatti.
- **Barra fissa in basso sul telefono** con Chiama, WhatsApp ed Email (presi da `config.js`).

## Furgone 3D

Il furgone della sezione zone è un modello 3D vero (`docs/brand/furgone-imi.glb`, fatto in Blender, 32.000 triangoli) con il logo applicato sui fianchi. Per non appesantire la pagina non viene caricato in 3D: è stato fotografato da 16 direzioni e le immagini sono in un unico file, `assets/img/furgone.webp` (78 KB). Il sito mostra quella giusta in base alla curva della strada.
Il modello si può riusare per altre immagini (social, preventivi, biglietti da visita).

## Logo

I file del logo sono in `assets/img/logo/` (kit originale e istruzioni in `docs/brand/`):

| File | Dove si usa |
|---|---|
| `logo.svg` | header (fondo crema) |
| `logo-negativo.svg` | footer e fondi scuri: stessa forma, scritta crema e bordo sottile del riquadro |
| `logo-animato.svg` | apertura del sito (una sola animazione, rispetta la riduzione del movimento) |
| `simbolo.svg` | favicon, filigrana nell'hero, etichetta dello spruzzino 3D |
| `logo-crema.svg`, `logo-monocromatico.svg` | stampa e materiali esterni |

In `assets/img/` ci sono anche `apple-touch-icon.png`, `icon-32.png`, `icon-192.png` e `og-image.png` (anteprima 1200×630 dei link condivisi su WhatsApp e social).
Quando il sito avrà il dominio definitivo, aggiorna l'indirizzo di `og:image` nelle due pagine.

## Da completare

Tutti i contatti si cambiano in **un solo file**: `assets/js/config.js`. Telefono e WhatsApp sono il numero riservato al sito, 344 770 1121 (non va usato su altri canali, serve a riconoscere i clienti arrivati dal sito); manca ancora l'email.

Poi:
1. Aggiorna telefono ed email anche nel blocco `application/ld+json` di `index.html` (serve a Google).
2. Se il dominio non è `www.imiservice.it`, sostituiscilo nei tag `canonical` e `og:url`.
3. Completa `privacy.html`.

## Video di presentazione

La pagina usa `assets/video/presentazione.mp4` (1080×1080, 81 s, 16 MB): parte muto in automatico, con i comandi che compaiono toccando il video, come su YouTube (pausa, avanti/indietro di 10 secondi, barra di avanzamento, audio, schermo intero). Copertina: `assets/video/copertina.jpg`.

Il video è montato dagli spezzoni di Stefano: sfondo sfocato in base alla profondità, colori corretti, voce ripulita dal rumore, musica di sottofondo ("Acoustic Corporate Business Background" di Alex Morgan, Pixabay) e sottotitoli.

## Provarlo in locale

```bash
python3 -m http.server 8000
```

Poi apri http://localhost:8000 (serve un server: aprendo il file direttamente i moduli JS non si caricano).
