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

Logo "IMI ✦ service. / PULIZIE": il simbolo col tergivetro; sulla prima riga "IMI" in Archivo nero, una stellina gialla (il luccichio del pulito), "service" in Archivo normale e il punto giallo finale, che sporge fuori dalla centratura; sotto, una lama gialla inclinata che porta a "PULIZIE" spaziato, allineato alla fine di "service". Il blocco della scritta è centrato in verticale sul quadrato del simbolo. Le lettere sono tracciati vettoriali: non serve nessun font.

| File | Dove si usa |
|---|---|
| `assets/img/logo/logo.svg` | intestazione, privacy, etichetta del tergivetro nell'apertura |
| `assets/img/logo/logo-negativo.svg` | footer e fondi scuri (scritta crema, bordo sottile del riquadro) |
| `assets/img/logo/scritta.svg`, `scritta-negativo.svg` | solo la scritta, per impaginazioni verticali (simbolo sopra, scritta sotto) |
| `assets/img/logo/simbolo.svg` | favicon e icone |
| `docs/brand/social/` | foto profilo (2160×2160) e copertina (1920×1080) per WhatsApp e social |
| `docs/brand/vecchio-logo/` | il logo precedente "IMI Service", conservato |

In `assets/img/` ci sono anche `apple-touch-icon.png`, `icon-32.png`, `icon-192.png` e `og-image.png` (anteprima 1200×630 dei link condivisi su WhatsApp e social, con il nuovo logo).

## Da completare

Tutti i contatti si cambiano in **un solo file**: `assets/js/config.js`. Telefono e WhatsApp sono il numero riservato al sito, 344 770 1121 (non va usato su altri canali, serve a riconoscere i clienti arrivati dal sito). Email unica: info@imiservicepulizie.it; i messaggi partiti dal sito hanno "(dal sito)" nell'oggetto.

Poi:
1. Aggiorna telefono ed email anche nel blocco `application/ld+json` di `index.html` (serve a Google).
2. Dominio: **imiservicepulizie.it** (principale). `www.imiservicepulizie.it`, `imiservicepulizie.com` e `www.imiservicepulizie.com` rimandano lì (redirect 308 su Vercel). DNS su Register.it: record A `@` → `216.198.79.1` (e `64.29.17.1`), CNAME `www` → `8777df89f44ded9f.vercel-dns-017.com.`, per entrambi i domini.
3. Completa `privacy.html`.

## Video di presentazione

La pagina usa `assets/video/presentazione.mp4` (1080×1080, 81 s, 16 MB): parte muto quando arriva sullo schermo (non si scarica all'apertura della pagina, `preload="none"`), con i comandi che compaiono toccando il video, come su YouTube (pausa, avanti/indietro di 10 secondi, barra di avanzamento, audio, schermo intero). Copertina: `assets/video/copertina.jpg`.

Il video è montato dagli spezzoni di Stefano: sfondo sfocato in base alla profondità, colori corretti, voce isolata con ElevenLabs e rifinita (equalizzazione, compressione, un filo di ambiente), musica di sottofondo ("Acoustic Corporate Business Background" di Alex Morgan, Pixabay) e sottotitoli.

## Provarlo in locale

```bash
python3 -m http.server 8000
```

Poi apri http://localhost:8000 (serve un server: aprendo il file direttamente i moduli JS non si caricano).

## Velocità

- Foto dei servizi in WebP (`assets/img/servizi/*.webp`, ~560 KB in tutto) e copertina del video in WebP.
- Ordine di caricamento: prima foto (uffici) e immagini dell'apertura → le altre foto della prima schermata → le foto "prima" (solo vicino ai servizi o quando le altre sono arrivate). Il furgone si scarica solo vicino alla sezione Zone.
- Se le immagini dell'apertura non arrivano entro 1,8 s, l'apertura si salta.
- `vercel.json`: cache di una settimana per `assets/` (se si sostituisce un file tenendo lo stesso nome, chi è già passato può vedere la vecchia versione fino a 7 giorni: meglio cambiare nome al file).

## Pagine legali

- `note-legali.html`, `privacy.html`, `cookie.html` (stile comune in `assets/css/legale.css`), linkate dal piè di pagina.
- Nelle pagine compare solo il nome **IMI Service** (non la denominazione completa della ditta individuale), con sede e P. IVA.
- Banner cookie in `assets/js/consenso.js` (Accetta / Rifiuta / Personalizza, scelta salvata 6 mesi, link "Preferenze cookie" nel piè di pagina). Gli script di statistiche o pubblicità vanno scritti con `type="text/plain" data-consenso="statistiche"` (o `"marketing"`): partono solo dopo il consenso.
- Il sito non usa cookie né servizi esterni: anche il carattere Manrope è ospitato in `assets/fonts/` (licenza OFL). **Se si aggiungono Google Analytics, Google Ads, Meta Pixel, mappe o video YouTube incorporati, serve un banner cookie e vanno aggiornate privacy e cookie policy.**

## SEO

- Report completo e checklist in `SEO-AUDIT.md` (non pubblicato: è in `.vercelignore` insieme a `docs/` e a questo README).
- URL senza `.html` (`/privacy`, `/cookie`, `/note-legali`) grazie a `cleanUrls` in `vercel.json`; `www.imiservicepulizie.com` reindirizza al `.it` dallo stesso file.
- Il testo di servizi, "Per chi lavoriamo" e comuni è scritto nell'HTML: **se cambi un testo di un servizio, cambialo sia nella sezione `#services` dell'HTML sia nell'elenco `SERVICES` dello script** (lo script lo usa per l'hero e come riserva).
- Dati strutturati (JSON-LD) in testa a `index.html`: telefono, indirizzo, servizi e FAQ devono restare **identici** a quelli visibili in pagina e alla scheda Google. Se aggiungi o cambi una FAQ, aggiornala anche lì.
- `404.html`: pagina "non trovata" con `noindex`.
