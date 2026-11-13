# SEO-AUDIT — imiservicepulizie.it

Data: 13 novembre 2026 · Stato: **Fasi 1–4 completate per tutto ciò che non dipende da informazioni mancanti** (pagine servizio, FAQ nuove, orari e scheda Google in attesa)

## Contesto

| | |
|---|---|
| Business | IMI Service, impresa di pulizie (uffici, condomini, fine cantiere, sgomberi, vetrate, pavimenti), dal 2008 |
| Zona | Sesto San Giovanni (sede), Milano, Monza e prima cintura |
| Dominio | https://imiservicepulizie.it (alias: www.imiservicepulizie.it, imiservicepulizie.com, www.imiservicepulizie.com) |
| NAP | IMI Service · Via Bergomi 25, 20099 Sesto San Giovanni (MI) · +39 344 770 1121 (numero da confermare, vedi sotto) |
| Hosting | Vercel, sito statico (HTML + CSS + JS inline, nessuna build) |
| Keyword proposte | primaria: **impresa di pulizie Sesto San Giovanni**; secondarie: pulizie uffici Milano, pulizie condominiali Milano/Monza, pulizia fine cantiere / post ristrutturazione Milano, sgomberi Milano/Sesto, pulizia vetrate Milano, trattamento pavimenti / lucidatura marmo Milano |

Le keyword sono proposte in base ai servizi reali e alla zona servita; non ho dati di volume di ricerca (vanno confermati con il Keyword Planner di Google Ads o Search Console dopo qualche settimana).

---

## FASE 1 — Audit

### 1. Stack e rendering

- **Non è una SPA**: è HTML statico, quindi titolo, meta, H1, testi principali e JSON-LD sono già nell'HTML iniziale. Bene.
- **Però alcune sezioni sono create solo da JavaScript**: le 6 schede servizi (titoli H3 + punti elenco), la sezione "Per chi lavoriamo" e l'elenco dei comuni serviti. Nell'HTML grezzo ci sono **299 parole**, nella pagina renderizzata **606**: metà del contenuto (proprio quello con le keyword dei servizi) è visibile solo a chi esegue JS. Google di solito lo esegue, ma in ritardo; Bing, i crawler AI (ChatGPT, Perplexity, Claude) e le anteprime social spesso no.

### 2. Pagine

| URL | Title (car.) | Description (car.) | H1 | Canonical | Indicizzabile | Parole (grezzo / render) | Img senza alt |
|---|---|---|---|---|---|---|---|
| / | 74 ⚠️ (>60) | 204 ⚠️ (>160) | 1 · "Puliamo uffici, condomini e cantieri. Anche di notte." (senza keyword "impresa di pulizie" né città) | ok | sì | 299 / 606 | 0 |
| /note-legali.html | 25 | 142 | 1 | ok | sì | 560 | 0 |
| /privacy.html | 21 | 139 | 1 | ok | sì | 1058 | 0 |
| /cookie.html | 27 | 122 | 1 | ok | sì | 579 | 0 |
| /qualsiasi-404 | — | — | — | — | 404 | pagina 404 standard di Vercel | — |

### 3. Tecnico

| Controllo | Esito |
|---|---|
| robots.txt | ✅ consente tutto, riferimento alla sitemap, crawler AI non bloccati |
| sitemap.xml | ✅ 4 URL canoniche, tutte 200 (manca `lastmod`, minore) |
| https | ✅ HSTS attivo (`max-age=63072000`); http→https gestito da Vercel (non verificabile da qui) |
| www.imiservicepulizie.it | ✅ 308 → https://imiservicepulizie.it/ |
| imiservicepulizie.com | ✅ 308 → https://imiservicepulizie.it/ |
| **www.imiservicepulizie.com** | ❌ **risponde 200 con una copia del sito** invece di reindirizzare (in Vercel il dominio non ha redirect) → contenuto duplicato su un altro host |
| 404 personalizzata | ❌ assente (pagina standard Vercel, in inglese, senza link al sito) |
| URL senza `.html` | ⚠️ `/privacy` dà 404, funziona solo `/privacy.html` (coerente con canonical e sitemap, quindi non grave) |
| Link interni rotti | ✅ nessuno |
| lang="it", viewport | ✅ su tutte le pagine |
| Landmark HTML | ⚠️ la home non ha `<main>` (header, nav e footer sì) |
| Gerarchia titoli | ⚠️ alcuni H2 contengono istruzioni d'interfaccia ("Scorri.", "Scorri e guarda…", "Scorri e vedi…") invece di descrivere il contenuto |
| File interni pubblicati | ⚠️ la cartella `docs/` è online (es. `/docs/brand/furgone-imi.glb` risponde 200, così come i prompt usati per le immagini): non serve al sito |
| Compressione | ✅ Brotli su HTML/CSS/JS in produzione |
| Cache | ✅ `assets/` 7 giorni + stale-while-revalidate; HTML `max-age=0, must-revalidate` (corretto) |

### 4. Performance (Lighthouse mobile, produzione)

| Pagina | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home | **77** | 92 | 100 | 100 | 1,8 s | **1.030 ms** | 0 |
| Note legali (locale) | 100 | 100 | 100 | 100 | 1,3 s | 0 ms | 0 |
| Privacy (locale) | 100 | 100 | 100 | 100 | 1,3 s | 0 ms | 0 |

- **Unico problema serio: il Total Blocking Time (1,0 s)**, che pesa sull'INP. Dal profilo CPU (telefono simulato, CPU 4×):
  - `draw` (servizi che si puliscono scorrendo): ~1.000 ms. Ridisegna **tutti e 6** i canvas ad alta risoluzione a ogni foto che arriva, anche quelli fuori schermo.
  - Apertura con le gocce (`wet`, `boxBlur`, `cover`): ~770 ms. Pesa solo alla prima apertura.
  - Preparazione hero e servizi (`sizeHero`, `sizeSvcs`): ~170 ms.
- Immagini: già WebP per le foto; LCP = H1 (testo), quindi niente preload extra necessario. I 3 loghi `<img>` non hanno `width`/`height` (CLS oggi 0, ma è fragile).
- Font: Manrope ospitato sul sito, preload + `font-display: swap` ✅. Nessuno script di terze parti ✅.
- Le foto dei servizi sono disegnate su `<canvas>`, quindi Google Immagini non le vede (accettabile: sono illustrative).

### 5. Accessibilità che pesa sulla SEO

- Contrasto insufficiente (4,1:1, serve 4,5:1): bianco su verde `#168F48` (pulsanti WhatsApp, comune selezionato) e verde su chiaro (testo "Ci arriviamo", pulsanti dei comuni).
- Pallini del carosello "Come lavoriamo": area di tocco 8×8 px (serve 24×24).
- Tutte le immagini hanno `alt`; nessun link vuoto.

### 6. Dati strutturati

- Home: un blocco `HomeAndConstructionBusiness` valido (JSON corretto) con nome, url, telefono, email, città, CAP, P.IVA, anno di fondazione, areaServed e catalogo servizi.
- **Mancano**: `streetAddress` (la via è nel footer ma non nello schema → NAP incoerente), `logo`, `image`, `@id`, `openingHoursSpecification`, `sameAs` (scheda Google), `geo`.
- Nessun `WebSite`/`Organization`, nessun `FAQPage` (le FAQ sono visibili in pagina), nessun `BreadcrumbList` sulle pagine interne.
- Coerenza da verificare: title e schema parlano di "sanificazioni", ma tra i servizi del sito la sanificazione non compare.

### 7. Contenuti e SEO locale

- Una sola pagina con contenuto commerciale per 6 servizi e 3+ città: per query come "pulizie condominiali Monza" o "sgombero cantine Milano" il sito ha poco testo dedicato (ogni servizio ha un titolo e 3 punti).
- FAQ: 4 domande, risposte brevi e generiche. Mancano le domande che la gente fa davvero a Google e agli assistenti AI (costi indicativi, tempi, cosa è incluso, assicurazione, fatture, frequenze).

### Problemi ordinati per impatto

| # | Impatto | Problema |
|---|---|---|
| 1 | **Alto** | Contenuto dei servizi, "Per chi lavoriamo" e comuni generato solo da JS (metà del testo invisibile nell'HTML) |
| 2 | **Alto** | Title (74) e description (204) troppo lunghi; H1 senza "impresa di pulizie" e senza città |
| 3 | **Alto** | Una sola pagina per 6 servizi: nessuna pagina dedicata ai servizi principali |
| 4 | **Medio** | www.imiservicepulizie.com risponde 200 (duplicato) invece di 308 |
| 5 | **Medio** | TBT 1,0 s (canvas dei servizi ridisegnati tutti insieme, gocce iniziali) |
| 6 | **Medio** | Schema incompleto (via, logo, immagini, orari, scheda Google) e assenza di WebSite/FAQPage/Breadcrumb |
| 7 | **Medio** | FAQ poche e generiche (conta per Google e per le risposte AI) |
| 8 | Basso | Nessuna pagina 404 personalizzata |
| 9 | Basso | Home senza `<main>`; H2 con "Scorri" |
| 10 | Basso | Contrasto del verde e pallini del carosello troppo piccoli |
| 11 | Basso | Loghi senza width/height |
| 12 | Basso | Cartella `docs/` pubblicata online |
| 13 | Basso | URL senza `.html` danno 404; sitemap senza `lastmod` |

---

## FASE 2 — Piano (in ordine impatto/sforzo)

Legenda: ✏️ = cambia testi o aspetto, serve il tuo ok sul testo · ⚙️ = solo tecnico, nessun cambiamento visibile.

### Gruppo 1 — Tecnico rapido (sforzo basso)
| Modifica | File | |
|---|---|---|
| Redirect 308 di www.imiservicepulizie.com → imiservicepulizie.it | impostazione dominio su Vercel | ⚙️ |
| Pagina 404 in italiano, con logo e link a home e servizi, `noindex` | `404.html` | ⚙️ |
| Escludere dalla pubblicazione `docs/`, `README.md`, `SEO-AUDIT.md` | `.vercelignore` | ⚙️ |
| `cleanUrls` (es. `/privacy`): canonical, sitemap e link aggiornati, `.html` → 308 automatico | `vercel.json`, pagine, `sitemap.xml` | ⚙️ |
| `lastmod` nella sitemap | `sitemap.xml` | ⚙️ |
| `<main>` nella home, width/height sui loghi, area di tocco 24×24 sui pallini (aspetto invariato) | `index.html` | ⚙️ |

### Gruppo 2 — Contenuto nell'HTML (rendering)
| Modifica | File | |
|---|---|---|
| Scrivere nell'HTML le 6 schede servizi, "Per chi lavoriamo" e l'elenco comuni; il JS aggiunge solo canvas e animazioni sopra l'HTML già presente. Stesso aspetto e stessi testi, ma leggibili da tutti i crawler | `index.html` | ⚙️ |

### Gruppo 3 — Meta e H1 della home ✏️
| | Attuale | Proposta |
|---|---|---|
| Title | IMI Service \| Pulizie e sanificazioni a Milano, Monza e Sesto San Giovanni (74) | **Impresa di pulizie a Sesto San Giovanni \| IMI Service** (53) |
| Description | (204 caratteri) | **Impresa di pulizie a Sesto San Giovanni dal 2008: uffici, condomini, fine cantiere, sgomberi e vetrate a Milano e Monza. Anche di notte. Sopralluogo gratuito.** (158) |
| H1 | Puliamo uffici, condomini e cantieri. Anche di notte. | La riga piccola sopra il titolo ("Sesto San Giovanni · Milano · Monza") diventa la prima parte dell'H1: **"Impresa di pulizie a Sesto San Giovanni, Milano e Monza"** in piccolo, poi il titolo grande invariato. Aspetto quasi identico, H1 con keyword e città |
| og:title / og:description | testi diversi dal title | allineati ai nuovi |
| H2 con "Scorri" | "Cosa devi far pulire? Scorri e guarda il prima e il dopo." · "Quattro passi. Scorri." · "Partiamo da Sesto. Scorri e vedi dove arriviamo." | "Cosa devi far pulire? Guarda il prima e il dopo." · "Quattro passi, un lavoro fatto bene." (anche su telefono) · "Partiamo da Sesto e arriviamo fino a Milano e Monza." L'invito a scorrere resta come piccola indicazione fuori dal titolo |

Pagine legali: title e description già nei limiti, nessuna modifica.

### Gruppo 4 — Dati strutturati ⚙️ (solo dati visibili in pagina, nessuna recensione inventata)
- Home: `@graph` con **HomeAndConstructionBusiness** (+ `streetAddress`, `logo`, `image`, `@id`, `areaServed` con i comuni elencati in pagina, `openingHoursSpecification` **solo dopo la tua conferma degli orari**, `sameAs` con la scheda Google quando è attiva), **WebSite**, **Organization**, **Service** per ognuno dei 6 servizi, **FAQPage** con le FAQ visibili.
- Pagine interne: **BreadcrumbList** + `WebPage`.
- `geo` (coordinate) solo quando la scheda Google è verificata, prendendo il punto esatto dalla scheda.
- Togliere "sanificazioni" da title/schema se non è un servizio che fate (da confermare).

### Gruppo 5 — Performance ⚙️ (obiettivo TBT < 200 ms)
- Servizi: disegnare solo i canvas visibili o vicini allo schermo; quando arriva una foto ridisegnare solo quel servizio, non tutti; risoluzione dei canvas limitata a 1,5×.
- Gocce iniziali: calcolo a risoluzione ridotta e spezzato in più passaggi (stesso effetto visivo), così non blocca il telefono.
- Hero: preparazione delle foto spezzata, la prima subito, le altre quando il telefono è libero.

### Gruppo 6 — Accessibilità ✏️
- Verde dei pulsanti da `#168F48` a `#12793D` (appena più scuro, contrasto 5,5:1 sul bianco e 4,9:1 sul crema). Cambia leggermente il colore del pulsante WhatsApp: serve il tuo ok.

### Gruppo 7 — Nuove pagine servizio ✏️ (da approvare, sforzo alto, impatto alto)
Sei pagine con contenuto **unico e reale**, collegate dalla home e tra loro:

| URL proposto | Title (car.) | Description (car.) | H1 |
|---|---|---|---|
| /pulizie-uffici | Pulizie uffici a Milano e Sesto San Giovanni \| IMI Service (58) | Pulizia uffici a Milano, Sesto e Monza, anche di sera e di notte, con turni sui vostri orari. Squadra propria dal 2008. Sopralluogo e preventivo gratuiti. (154) | Pulizie uffici a Milano, Sesto San Giovanni e Monza |
| /pulizie-condomini | Pulizie condominiali a Milano, Sesto e Monza \| IMI Service (58) | Pulizia di scale, androni, vetri e aree comuni per condomini a Milano, Sesto San Giovanni e Monza. Calendario fisso, squadra propria. Sopralluogo gratuito. (155) | Pulizie condominiali a Milano, Sesto San Giovanni e Monza |
| /pulizia-fine-cantiere | Pulizia fine cantiere a Milano e Sesto \| IMI Service (52) | Pulizia post ristrutturazione a Milano, Sesto San Giovanni e Monza: polvere, residui e vetri, casa o ufficio pronti da abitare. Preventivo dopo sopralluogo. (156) | Pulizia fine cantiere e post ristrutturazione |
| /sgomberi | Sgomberi a Milano, Sesto San Giovanni e Monza \| IMI Service (59) | Sgombero di appartamenti, cantine e uffici a Milano, Sesto San Giovanni e Monza: svuotiamo, puliamo e riconsegniamo i locali vuoti. Preventivo gratuito. (152) | Sgomberi di case, cantine e uffici |
| /pulizia-vetrate | Pulizia vetrate e vetri in altezza a Milano \| IMI Service (57) | Pulizia di vetrate, vetrine e finestre anche in altezza per uffici, negozi e condomini a Milano, Sesto San Giovanni e Monza. Sopralluogo gratuito. (146) | Pulizia vetrate e vetri in altezza |
| /trattamento-pavimenti | Trattamento pavimenti e moquette a Milano \| IMI Service (55) | Lucidatura e trattamento di marmo, parquet e gres, lavaggio moquette a Milano, Sesto San Giovanni e Monza. Macchinari professionali. Sopralluogo gratuito. (154) | Trattamento pavimenti e lavaggio moquette |

Ogni pagina: cosa comprende il servizio, come lavorate, frequenze e tempi, per chi è, zone, 4–6 FAQ specifiche, foto prima/dopo, pulsanti di contatto, schema Service + Breadcrumb + FAQPage. Servono pagine così anche per gli annunci Google Ads (qualità dell'annuncio più alta, clic meno cari).
**Per scriverle mi servono informazioni vere** (vedi domande sotto): senza, verrebbero pagine generiche, che Google penalizza.

### Gruppo 8 — Pagine zona (solo proposta, non le creo)
**Sconsigliate per ora.** Pagine "pulizie Monza", "pulizie Cinisello"… con testo cambiato solo nel nome della città sono *doorway page* e Google le penalizza. Hanno senso solo con contenuto reale e diverso per ogni comune (lavori fatti lì, clienti, tempi di arrivo). Si possono rivalutare tra qualche mese, con foto e lavori veri.

### Gruppo 9 — Ricerca AI ✏️
- FAQ in home da 4 a 8–10, con risposte chiare e fattuali (chi siete, dove, cosa è incluso, tempi del sopralluogo e del preventivo, fattura, assicurazione, costi indicativi **solo se reali**).
- robots.txt resta aperto ai crawler AI.

### Video (domanda su YouTube)
Lasciamo il video ospitato sul sito. Non pesa più sull'apertura (si scarica solo quando ci si arriva), mentre un video YouTube incorporato aggiunge circa 1 MB di script di Google, mette cookie (servirebbe il consenso dal banner) e mostra video di altri alla fine.
Caricarlo *anche* su YouTube conviene comunque: compare nella ricerca video e su YouTube, e si può collegare alla scheda Google. Sul sito aggiungerei lo schema `VideoObject` (copertina, durata, data) per farlo apparire nei risultati video di Google.

### Domande per te (bloccanti per alcuni punti)
1. **Numero sulla scheda Google**: 344 770 1121 o il numero storico? Il NAP deve essere identico tra sito, schema e scheda.
2. **Orari** da dichiarare (H24 reale o fasce in cui rispondete?).
3. **Sanificazioni**: le fate? Se no, tolgo la parola da title e schema.
4. **Pagine servizio (Gruppo 7)**: per ognuno dei 6 servizi, cosa include davvero, frequenze tipiche, tempi, tipo di clienti, e se volete indicare **prezzi indicativi** (es. "da X € al mese per un condominio di N scale").
5. Avete un'**assicurazione RC** da poter citare? Emettete fattura elettronica anche ai privati?
6. **Link della scheda Google** e di eventuali profili social (per `sameAs`).

### Ordine di esecuzione proposto (commit separati per area)
1. Tecnico rapido (Gruppo 1) → 2. Rendering (Gruppo 2) → 3. Meta/H1 (Gruppo 3, se approvato) → 4. Schema (Gruppo 4) → 5. Performance (Gruppo 5) → 6. Accessibilità (Gruppo 6, se approvato) → 7. FAQ e pagine servizio (Gruppi 7 e 9, quando ho le informazioni).

---

## FASE 3 — Implementazione (fatto)

Piano approvato il 13/11/2026. Commit separati per area (PR #38 e #39, unite):

| Area | Fatto |
|---|---|
| Tecnico | `vercel.json`: redirect 308 di `www.imiservicepulizie.com` (home e pagine interne) → `.it`, `cleanUrls` (`/privacy`, `/cookie`, `/note-legali`; i vecchi `.html` fanno 308), `trailingSlash: false`, `/index` → `/`. `404.html` in italiano con link ai servizi e `noindex`. `.vercelignore` per `docs/`, `README.md`, `SEO-AUDIT.md`. Sitemap con URL canoniche e `lastmod`. `<main>` in home, width/height sui loghi, area di tocco 24×24 sui pallini del carosello |
| Rendering | Le 6 schede servizi, "Per chi lavoriamo" (tutte e 3 le risposte, quelle chiuse con `hidden`) e i comuni sono nell'HTML; il JS aggiunge solo canvas e animazioni. Aspetto invariato |
| Meta | Title, description, H1, H2 e Open Graph come da piano (Gruppo 3). Immagini della prima schermata per l'apertura rifatte |
| Schema | `@graph` in home: WebSite, WebPage, ImageObject, HomeAndConstructionBusiness (via, logo, comuni serviti come in pagina, P.IVA, anno), 6 Service, FAQPage (le 4 FAQ visibili), VideoObject. Pagine legali: WebPage + BreadcrumbList. Tolto "sanificazione" dai nomi dei servizi perché non compare nei testi visibili |
| Performance | Ridisegno solo del servizio la cui foto è arrivata; canvas delle schede preparati solo vicino allo schermo (max 1,5×); livelli dell'hero creati quando servono; gocce iniziali calcolate a risoluzione ridotta. Profilo CPU: `draw` ~1.000 ms → ~0, apertura ~770 → ~420 ms |
| Accessibilità | Verde `#168F48` → `#12793D` (5,5:1 su bianco). Pulsanti dei servizi "non ancora puliti" da opacità .4 a .65 (contrasto 2,6 → 5,6:1) |

## FASE 4 — Verifica (fatto, sul sito in produzione)

**HTML grezzo** (`curl` con user agent Googlebot, senza JavaScript):

| URL | Title | Description | Canonical | H1 | Parole | JSON-LD |
|---|---|---|---|---|---|---|
| / | 53 car. | 158 car. | https://imiservicepulizie.it/ | 1 | 675 (prima 299) | WebSite, WebPage, ImageObject, HomeAndConstructionBusiness, 6× Service, FAQPage, VideoObject |
| /note-legali | 25 | 142 | …/note-legali | 1 | 582 | WebPage, BreadcrumbList |
| /privacy | 21 | 139 | …/privacy | 1 | 1084 | WebPage, BreadcrumbList |
| /cookie | 27 | 122 | …/cookie | 1 | 601 | WebPage, BreadcrumbList |

**Redirect e risposte:** `www.imiservicepulizie.it`, `imiservicepulizie.com`, `www.imiservicepulizie.com` (anche `/cookie`) → 308 verso `https://imiservicepulizie.it/…`; `/privacy.html` → 308 `/privacy`; `/index.html` → 308 `/`; pagina inesistente → 404 con pagina in italiano e `noindex`; `README.md`, `SEO-AUDIT.md`, `docs/…` → 404; sitemap e robots → 200.
**JSON-LD:** sintassi valida su tutte le pagine, campi principali presenti, `@id` coerenti. **Link interni:** nessuno rotto. **Errori JS:** nessuno (telefono e computer).

**Lighthouse mobile, produzione (home):**

| | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Prima | 77 | 92 | 100 | 100 | 1,8 s | 1.030 ms | 0 |
| Dopo (2 misure) | **90–91** | **100** | 100 | 100 | 1,7–2,3 s | **340–370 ms** | 0 |
| Privacy (dopo) | 100 | 100 | 100 | 100 | 1,1 s | 20 ms | 0 |

Il TBT residuo (~350 ms) è l'apertura con le gocce: per scendere sotto 200 ms bisognerebbe spostare il calcolo in un worker o mostrarla solo alla prima visita (cambia l'esperienza: da decidere).

## Cosa resta

| Cosa | Serve da te |
|---|---|
| 6 pagine servizio (Gruppo 7) | Cosa include ogni servizio, frequenze e tempi tipici, tipo di clienti, eventuali prezzi indicativi |
| FAQ da 4 a 8–10 (Gruppo 9) | Risposte vere su costi indicativi, tempi, fattura, assicurazione RC |
| `openingHoursSpecification` | Orari reali (H24 vero o fasce) |
| `sameAs`, `geo` | Link della scheda Google verificata (e social) |
| Telefono nel NAP | Conferma: 344 770 1121 o numero storico sulla scheda Google |
| Apertura più leggera | Decidere se mostrarla solo alla prima visita |

## Checklist manuale (da fare tu)
- [x] Google Search Console: proprietà di dominio verificata (13/11/2026)
- [x] Search Console → Sitemap → inviata `https://imiservicepulizie.it/sitemap.xml` (il file risponde 200 come XML; se resta "Impossibile recuperare" dopo 2–3 giorni, rimuovila e inviala di nuovo)
- [ ] Search Console → Controllo URL → `https://imiservicepulizie.it/` → "Richiedi indicizzazione"
- [ ] Google Business Profile: verificata, con nome, indirizzo e telefono **identici** al sito
- [ ] Bing Webmaster Tools: accedi con Google e "Importa da Google Search Console" (1 minuto, porta anche ChatGPT/Copilot, che usano Bing)
