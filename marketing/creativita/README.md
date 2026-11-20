# Creatività per gli annunci di IMI Service

Non pubblicate sul sito (cartella `marketing` esclusa in `.vercelignore`).

## Video (musica + effetti sonori)
| File | Formato | Uso |
|---|---|---|
| `spot15-verticale-9x16.mp4` | 1080×1920, 15 s | YouTube Shorts, Reels, Storie, Demand Gen |
| `spot15-quadrato-1x1.mp4` | 1080×1080, 15 s | feed Facebook/Instagram, Demand Gen |
| `spot15-orizzontale-16x9.mp4` | 1920×1080, 15 s | YouTube, Performance Max |
| `bumper6-uffici-*.mp4`, `bumper6-condomini-*.mp4` | 16:9 e 9:16, 6 s | annunci bumper YouTube, Storie |

Musica: **"Groovy Moves" di Pumpupthemind** (Pixabay, https://pixabay.com/music/upbeat-groovy-moves-346818/), 120 BPM, dal secondo 9,997 del brano (primo tempo forte con il groove pieno). Licenza: Pixabay Content License, da riconfermare sulla pagina del brano. Montaggio a tempo: 5 scene da 6 battiti (3 s); passate del tergivetro, tagli, etichette, timbro e scintilla cadono sui battiti. La musica si abbassa leggermente quando suonano gli effetti. Volume finale −14 LUFS (adatto a YouTube e social).

Montaggio dello spot da 15 s (tempi a 120 BPM):
1. 0–3 s: ufficio, passata del tergivetro IMI ("Il tuo ufficio, ogni mattina… pulito prima che arrivi tu.");
2. 3–6 s: condominio ("Scale e androni… in ordine, con calendario fisso.");
3. 6–9 s: vetri, pavimenti, fine cantiere con etichette "Anche di sera e di notte", "Sopralluogo gratuito", "Preventivo scritto";
4. 9–12 s: "Impresa di pulizie a Sesto San Giovanni" con timbro "Dal 2008";
5. 12–15 s: logo, "Sopralluogo gratuito, preventivo scritto", WhatsApp 344 770 1121, sito.

## Immagini
- `immagini-google/`: foto **senza testo** nei formati per gli asset immagine di Google Ads: orizzontale 1,91:1 (1200×628), quadrato (1200×1200), verticale 4:5 (960×1200), più logo quadrato e orizzontale 4:1. Le regole di Google sulle immagini scoraggiano o rifiutano testi e loghi sovrapposti: da riconfermare nella guida "Requisiti degli asset immagine".
- `immagini-social/`: versioni **con testo** (titolo, etichette, WhatsApp) per Facebook/Instagram/Meta: 1080×1080, 1080×1350, 1080×1920.

Le foto sono immagini illustrative, generate per il sito, non lavori reali: non usarle come "prima/dopo" di un cliente vero. Appena ci sono foto reali di lavori e squadra, si sostituiscono.

## Effetti sonori
Sintetizzati da `sorgenti/sfx.py` (nessun campione esterno, nessuna licenza da gestire): tergivetro, fruscio, pop, colpo del timbro, scintilla. `effetti-sonori/sfx-spot15.wav` e `sfx-bumper6.wav` sono le tracce complete, da mixare con la musica.

## Rigenerare
In `sorgenti/`: `engine.html` disegna le scene; `render.js` registra i video; `stills.js` le immagini; `sfx.py` gli effetti; `mix.sh` unisce musica ed effetti (serve il file MP3 del brano). Servono le foto originali 1536×1024 in una cartella `src/` accanto a `engine.html` (non nel repository).
