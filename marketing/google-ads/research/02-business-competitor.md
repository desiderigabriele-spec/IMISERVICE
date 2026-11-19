# 02 — Business e competitor

## Dati certi del cliente [DATO: visura camerale 23/09/2025, salvo dove indicato]

- Impresa individuale artigiana, attiva dal 28/07/2008, REA MI-1877404, sede Via Bergomi 25, Sesto San Giovanni.
- Abilitata alle attività di pulizia (D.M. 274/1997, lettera a). ATECO 81.21.00.
- Addetti INPS al 31/03/2025: 1 indipendente, 0 dipendenti.
- Dichiarati dal cliente (non verificabili da fonti esterne): turni anche notturni e festivi, H24, sopralluogo gratuito, preventivo scritto, sanificazioni [DATO cliente].

## Audit del sito imiservicepulizie.it rispetto agli annunci

| Area | Stato | Impatto Ads | Fix |
|---|---|---|---|
| Titolo e H1 con "impresa di pulizie" + città | ok (dal 13/11) | positivo sul punteggio di qualità | — |
| Telefono e WhatsApp sempre visibili su mobile | ok (barra fissa) | positivo | — |
| Pagine dedicate per servizio | **mancano**: tutti gli annunci atterrano in home | punteggio di qualità e conversione più bassi su "pulizia uffici" / "pulizie condominiali" | creare /pulizie-uffici e /pulizie-condomini (piano SEO, Gruppo 7) prima di alzare il budget |
| Modulo di richiesta | **manca** | perso chi non vuole chiamare (richiesto test 3 canali) | aggiungere modulo breve (nome, telefono, servizio, comune) |
| Animazione d'apertura (~3–4 s) | presente | chi arriva da annuncio aspetta prima di vedere il contenuto: rischio uscita | saltarla quando l'URL contiene `gclid` o `utm_source=google` |
| Recensioni visibili | **nessuna** | manca la riprova sociale | collegare la scheda Google appena ha recensioni reali |
| Tracciamento conversioni | **assente** | senza, Google non può ottimizzare: si spreca budget | vedi checklist in `ads/launch-checklist.md` |
| Velocità | Lighthouse mobile 90–91, LCP 1,7–2,3 s (misura 13/11) | buona | — |

## Competitor (zona Sesto / Nord Milano / Monza)

Fonti: risultati di ricerca e directory ([DATO] dove citato). **Chi fa annunci non è verificato**: il Centro trasparenza annunci (adstransparency.google.com) non è raggiungibile da questa sessione → da controllare a mano (10 minuti) prima del lancio.

| Competitor | Zona | Cosa si sa | Recensioni | Fonte |
|---|---|---|---|---|
| Ciemmezeta | Sesto San Giovanni | pagina dedicata "impresa di pulizie Sesto San Giovanni"; citata anche la pulizia post ristrutturazione | "Eccellente", 47 recensioni Google (data da verificare) | [DATO] ciemmezeta.it |
| Carriero Srl | Sesto San Giovanni | dichiara ~40 anni di esperienza in pulizia e sanificazione | media ~4,6 su ProntoPro (aggregata) | [DATO] prontopro.it |
| Astra Service, Pulivittoria, Diamante Multiservice, Universal Service | Sesto San Giovanni | listati per post ristrutturazione, pulizie generali, pavimenti, sanificazione | aggregate ProntoPro | [DATO] prontopro.it |
| Cleanthech | Sesto San Giovanni | presente su Cronoshare | n.d. | [DATO] cronoshare.it |
| Brianza-Clean | Monza, Brianza, Milano nord | "preventivi e sopralluoghi gratuiti" | n.d. | [DATO] edilizia.com |
| Paracas Group | Milano | uffici e condomini, preventivo gratuito al telefono | Trustpilot (8 recensioni) | [DATO] trustpilot.com |
| ProntoPro, Cronoshare | portali | catturano le ricerche "impresa di pulizie + città" con preventivi multipli | — | [DATO] |

Osservazioni:
- Il "sopralluogo gratuito" è già usato da altri (Brianza-Clean): **non è un differenziatore**, è un requisito minimo [DATO].
- Nelle fonti trovate nessun competitor locale comunica **turni notturni/H24** o **sanificazione + pulizia dallo stesso fornitore con preventivo scritto** in modo evidente [IPOTESI: da confermare guardando i loro annunci].
- I portali di preventivi occupano i primi risultati organici: per chi cerca un fornitore subito, l'annuncio è il modo per comparire sopra [IPOTESI].

## Posizionamento (prezzo × qualità percepita × velocità × garanzia)

| | Prezzo | Qualità percepita | Velocità risposta | Garanzia |
|---|---|---|---|---|
| Grandi imprese / storiche (Carriero) | medio-alto | alta (anni) | media | n.d. |
| Piccole ditte da portale | basso | variabile | alta | nessuna |
| Portali (ProntoPro, Cronoshare) | — | dipende | alta | — |
| **IMI Service** | da definire | "dal 2008", regolare in Camera di Commercio | alta (WhatsApp diretto) | preventivo scritto |

**Spazio libero** [IPOTESI, confidenza 6/10]: *l'impresa di quartiere regolare e reperibile*. Titolare raggiungibile direttamente su WhatsApp, turni fuori orario, dal 2008, per uffici piccoli e condomini di Sesto e comuni vicini, dove le grandi imprese sono meno interessate e le ditte da portale non danno garanzie. Per alzare la confidenza servono recensioni reali e 2–3 casi cliente.

## Unit economics

Tutti i valori sono [STIMA], da confermare con IMI.

| Voce | Valore | Metodo |
|---|---|---|
| Canone condominio | 300 €/mese | fonte di settore: 250–500 €/mese per condominio medio con pulizia settimanale [DATO businessonline]; preso il valore basso-medio |
| Canone ufficio piccolo | 400 €/mese | ~20 ore/mese (3 passaggi/settimana × 1,5 h) × ~20 €/h [STIMA, nessuna fonte di prezzo per Milano trovata] |
| Durata media contratto | 18–24 mesi | [IPOTESI] |
| Valore cliente (LTV) | ~7.200 € | 300 €/mese × 24 mesi oppure 400 €/mese × 18 mesi |
| Margine lordo IMI | 30% | [STIMA] settore ad alta intensità di manodopera |
| Provvigione al Segnalatore | 20% del fatturato del cliente | [DATO] contratto |
| **Margine IMI dopo provvigione** | **10%** | 30% − 20% |
| Tasso di chiusura lead → contratto | 20% | [STIMA] |

**CPA massimo sostenibile per IMI** = LTV × margine dopo provvigione × tasso di chiusura = 7.200 × 0,10 × 0,20 = **144 € per contatto**.
Senza provvigione sarebbe 7.200 × 0,30 × 0,20 = 432 €.

Punto da far notare a IMI: **la provvigione del 20% assorbe due terzi del margine lordo stimato** sui clienti portati. Per il cliente resta comunque sostenibile se il costo per contatto resta sotto ~144 €; il costo atteso è 15–60 € (vedi `ads/strategy.md`). Confidenza 5/10: servono il margine reale e il tasso di chiusura reale di IMI.
