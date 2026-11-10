# IMI Service – sito web

Sito statico (HTML, CSS, JS) per IMI Service, impresa di pulizie, sanificazioni e manutenzioni di Sesto San Giovanni.
Non serve nessuna build: su Vercel basta collegare il repository (Framework preset: **Other**, nessun comando di build, cartella di output: la radice).

- `index.html`: versione italiana
- `privacy.html`: bozza dell'informativa privacy, **da completare** con i dati societari

## Cosa c'è nella pagina

- **Intro 3D**: lo schermo parte "sporco" e un tergivetro 3D lo pulisce a passate, con contatore 0–100%. Si può saltare, e non viene mostrata a chi ha attivato la riduzione del movimento.
- **Spruzzino 3D** che accompagna lo scroll: si aggancia alle sezioni, segue il mouse e spruzza quando arriva, quando si modifica il configuratore o si invia un form.
- **Configuratore** "La tua richiesta in 30 secondi": compone un riepilogo da inviare su WhatsApp o da portare nel modulo.
- **Video di presentazione** con riquadro 3D che si raddrizza allo scroll (configurabile, vedi sotto).
- **Form rapido** (hero) e **form completo**, **verifica zona**, FAQ, barra contatti fissa su mobile, pulsante WhatsApp.

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

## Da completare prima della pubblicazione

Tutti i contatti si cambiano in **un solo file**: `assets/js/config.js`.

| Campo | Cosa inserire |
|---|---|
| `phoneDisplay` | numero come deve apparire, es. `+39 02 1234 5678` |
| `phone` | stesso numero senza spazi, es. `+390212345678` |
| `whatsapp` | numero WhatsApp solo cifre con prefisso, es. `393331234567` |
| `email`, `piva` | email aziendale e partita IVA |
| `formEndpoint` | (consigliato) endpoint per ricevere i form via email, vedi sotto |

Poi:
1. Aggiorna telefono ed email anche nel blocco `application/ld+json` di `index.html` e `ar/index.html` (serve a Google).
2. Se il dominio non è `www.imiservice.it`, sostituiscilo nei tag `canonical`, `hreflang` e `og:url` delle due pagine.
3. Completa `privacy.html`.

### Ricevere i form via email

Senza `formEndpoint`, il pulsante "Invia richiesta" apre il programma email dell'utente e il pulsante WhatsApp apre la chat già compilata.
Per ricevere le richieste direttamente in casella, crea un modulo gratuito su [Formspree](https://formspree.io) e incolla l'URL (es. `https://formspree.io/f/abcdwxyz`) in `formEndpoint`.

## Video di presentazione

La sezione "Il pulito che si vede" (subito dopo l'hero) mostra un riquadro con il marchio e la scritta "Video in arrivo" finché il video non c'è.
Per attivarlo compila **uno** dei campi `video` in `assets/js/config.js`:

```js
video: {
  youtube: 'AbCdEf12345',   // ID YouTube (consigliato: non pesa sul sito)
  vimeo: '',                // oppure ID Vimeo
  mp4: '',                  // oppure file nel sito, es. 'assets/video/presentazione.mp4'
  poster: 'assets/video/copertina.jpg', // copertina (consigliata)
  square: true,             // formato quadrato 1:1, con testo e pulsanti accanto
  vertical: false           // true se girato in verticale 9:16
}
```

Il video attuale (`assets/video/presentazione.mp4`, quadrato 1080×1080) è montato dagli spezzoni di Stefano: colori convertiti da HDR, audio uniformato, nome in sovrimpressione, simbolo del logo nell'angolo e schermata finale. Copertina: `assets/video/copertina.jpg`.

Il video si carica solo quando l'utente preme play, così la pagina resta veloce. Per YouTube usa il dominio senza cookie (youtube-nocookie.com).

## Usare il tuo modello 3D (tergivetro / spruzzino)

Il tergivetro e lo spruzzino sono modellati via codice (Three.js, incluso in `assets/vendor/three`). Per sostituirli con modelli tuoi:

1. Esporta il modello in **.glb** (consigliato) o .gltf, possibilmente sotto 2–3 MB.
2. Mettilo in `assets/models/`, es. `assets/models/tergivetro.glb`.
3. In `assets/js/config.js`:
   ```js
   models: {
     squeegee: { url: 'assets/models/tergivetro.glb', rotation: [0, 0, 0] },
     bottle:   { url: 'assets/models/spruzzino.glb',  rotation: [0, 0, 0] }
   }
   ```
   Il modello viene centrato e scalato automaticamente. Per il tergivetro la lama deve essere verticale (asse Y): se arriva ruotato, correggilo con `rotation` (in gradi).

## Provarlo in locale

```bash
python3 -m http.server 8000
```

Poi apri http://localhost:8000 (serve un server: aprendo il file direttamente i moduli JS non si caricano).
