# Strategia Google Ads — IMI Service

Account: **nuovo account Google Ads intestato a IMI Service** (non l'account di Luigi). Budget: **10 €/giorno** (~304 €/mese). Obiettivo: contatti via **chiamata, WhatsApp e modulo** (test dei tre canali). Priorità: **pulizia uffici e pulizie condominiali**, poi gli altri servizi.

## Struttura

| Campagna | Budget | Stato al lancio | Gruppi di annunci |
|---|---|---|---|
| IMI \| Search \| Uffici e condomini \| Nord Milano | 10 €/giorno | attiva | Pulizia uffici (2 annunci A/B) · Pulizie condomini (2 annunci A/B) · Impresa di pulizie (1 annuncio) |
| IMI \| Search \| Altri servizi \| Nord Milano | 5 €/giorno | **in pausa** | Fine cantiere · Sgomberi · Vetrate · Pavimenti · Sanificazione |

Motivo [STIMA, confidenza 7/10]: con 10 €/giorno conviene un'unica campagna su pochi gruppi stretti. Dividere il budget su 8 servizi darebbe 1–2 clic al giorno per gruppo e nessun dato utile. La seconda campagna è pronta nel CSV e si attiva quando c'è budget in più o dopo 30 giorni positivi.

- **Tipo di campagna:** Search. **Performance Max no**: richiede tracciamento conversioni solido e asset (foto e video reali) che oggi mancano. Confidenza 8/10.
- **Annunci di Servizi locali (Local Services Ads):** in Italia la pagina ufficiale elenca categorie di pulizia per la casa (pulizie domestiche, finestre, tappeti) [DATO]. Non è chiaro se coprano la pulizia di uffici e condomini [IPOTESI]. Da valutare **dopo** il lancio: si paga a contatto, ma serve la verifica Google dell'impresa.
- **Reti:** solo Rete di ricerca Google. Disattivare **partner di ricerca** e **Rete Display** (budget piccolo).

## Parole chiave

- 70 keyword in `keywords.csv`: corrispondenza **frase** ed **esatta** sulle ricerche con città (uffici, condomini, impresa di pulizie) e solo **frase** sulle ricerche generiche, limitate dal targeting geografico.
- Niente corrispondenza generica (broad) all'avvio. Si valuta con Smart Bidding e almeno 30 conversioni.
- **Volumi e CPC: non disponibili in questa sessione** (Keyword Planner richiede l'account). Nel CSV sono marcati `[STIMA]`. **Primo compito dopo aver creato l'account:** Strumenti → Keyword Planner → incollare le keyword → scaricare volumi e CPC per i 6 comuni, e togliere quelle con 0 ricerche.
- Classificazione per intento:
  - **transazionale:** con città;
  - **commerciale:** "impresa pulizie uffici" e simili;
  - **transazionale-urgente:** fine cantiere, sgomberi;
  - **informativo:** escluso con le negative "come pulire", "fai da te", "prodotti", "corso".

## Parole escluse

- `negatives.csv`: 35 negative a livello di campagna, cioè lavoro, formazione, prodotti, privati domestici, settori estranei.
- Negative tra gruppi per non sovrapporsi:
  - "Uffici" esclude condominio;
  - "Condomini" esclude uffici;
  - "Impresa di pulizie" esclude entrambi, così le ricerche specifiche vanno al gruppo e all'annuncio più pertinente.
- **Revisione settimanale** del rapporto "Termini di ricerca" per aggiungere nuove negative.

## Località e orari

- **Località:** Sesto San Giovanni, Cinisello Balsamo, Cologno Monzese, Bresso, Monza, Brugherio. Opzione "**Presenza**: persone che si trovano o si trovano regolarmente nelle località". Milano esclusa all'avvio per CPC e budget (vedi `research/01-zona.md`).
- **Orari** [IPOTESI]: lun–sab 7:00–21:00 all'avvio, per concentrare il budget quando amministratori e uffici cercano e quando IMI può rispondere subito. Si allarga se i dati mostrano contatti la sera tardi o la domenica. Gli annunci girano anche di notte solo se qualcuno risponde davvero.
- **Dispositivi:** tutti, senza aggiustamenti all'avvio.

## Offerte (bidding)

| Fase | Strategia | Quando passare alla successiva |
|---|---|---|
| 1. Avvio (settimane 1–4) | **Massimizza i clic** con CPC massimo 2,50 € | quando le conversioni registrano correttamente e ce ne sono almeno 15 in 30 giorni |
| 2. Ottimizzazione | **Massimizza le conversioni** | dopo 30+ conversioni in 30 giorni e CPA stabile |
| 3. Scala | **CPA target** a 1,1–1,2 volte il CPA medio reale | se il CPA resta sotto 144 € (limite sostenibile) |

Le soglie di 15 e 30 conversioni sono pratica comune: **da verificare** sulla guida Google "Strategie di offerta" prima del passaggio.

## Budget: cosa aspettarsi [STIMA]

| Voce | Pessimista | Centrale | Ottimista | Metodo |
|---|---|---|---|---|
| Spesa al mese | 304 € | 304 € | 304 € | 10 € × 30,4 giorni |
| CPC medio | 3,50 € | 2,50 € | 1,50 € | [STIMA]: nessun dato di settore per l'Italia trovato; validare con Keyword Planner |
| Clic al mese | 87 | 122 | 203 | spesa ÷ CPC |
| Conversione sito → contatto | 4% | 7% | 10% | [STIMA] siti di servizi locali con telefono e WhatsApp sempre visibili |
| Contatti al mese | 3–4 | 8–9 | 20 | clic × conversione |
| Costo per contatto | ~87 € | ~36 € | ~15 € | spesa ÷ contatti |
| Contratti al mese (20% chiusura) | 0,7 | 1,7 | 4 | contatti × 20% |

**Confronto con il CPA massimo sostenibile di 144 €** (vedi `research/02-business-competitor.md`): anche nello scenario pessimista il costo per contatto (~87 €) resta sotto il limite. **Sostenibile**, confidenza 6/10.

Il punto debole è il **volume**: con 3–9 contatti al mese Google impara lentamente. Le scelte di conseguenza sono:
- tenere la campagna stretta (6 comuni, 2 servizi);
- restare su "Massimizza i clic" finché non ci sono 15 conversioni al mese;
- se dopo 30 giorni i contatti sono meno di 5, restringere a Sesto + Cinisello + Cologno e al solo gruppo con più conversioni.

## Tracciamento (obbligatorio prima del lancio)

Conversioni **primarie**, tutte "Lead":

| Conversione | Come si misura | Stato |
|---|---|---|
| Clic su "Chiama" (link `tel:`) | tag Google Ads sul sito, evento al clic | da implementare |
| Clic su WhatsApp (link `wa.me`, anche "Continua su WhatsApp" della chat) | tag, evento al clic | da implementare |
| Invio del modulo di preventivo | tag, evento all'invio | **il modulo non esiste**: va creato |
| Chiamate dagli annunci (asset chiamata) | numero di inoltro Google | **verificare disponibilità in Italia** nell'account |

- **Consenso:** Consent Mode v2 per il SEE, dal marzo 2024 [DATO]. Il sito ha già il banner con le categorie Statistiche e Marketing.
  - Il tag Google parte solo dopo il consenso Marketing (modalità **base**). La modalità avanzata, con i dati modellati, richiede volumi che un account così piccolo non raggiunge [DATO, soglie da riconfermare su doc Google].
  - Vanno mappati `ad_storage`, `ad_user_data` e `ad_personalization` sul consenso Marketing.
  - Va aggiornata la cookie policy (oggi dice "nessuno strumento attivo").
- **Conversioni avanzate (enhanced conversions):** solo per il modulo, quando esiste, e solo con consenso.
- **GA4:** non indispensabile all'avvio. Il tag Google Ads basta per le conversioni.

## Annunci e asset

10 annunci adattabili (RSA) in `google-ads-editor-import.csv`:
- da 9 a 15 titoli ciascuno e 2–4 descrizioni;
- 2 varianti con angoli diversi per uffici e condomini: A = risultato e orari, B = fuori orario e locale;
- titolo con parola chiave e città fissato in posizione 1 solo nelle varianti A, per garantire la pertinenza; le varianti B sono libere, così si confronta;
- sitelink, callout, snippet strutturati e asset chiamata in `assets.csv` (livello account);
- asset località: collegare la scheda Google Business quando è verificata.

**Claim usati, tutti veri:**
- "dal 2008" (visura);
- Camera di Commercio e fattura (visura);
- sopralluogo gratuito e preventivo scritto, orari serali, notturni e festivi, sanificazione (dichiarati dal cliente).

**Claim non usati:**
- numeri di recensioni (non ci sono ancora);
- prezzi;
- "migliori" e "n° 1";
- numeri di telefono nel testo (vietati: si usa l'asset chiamata).

Tutti gli annunci atterrano sulla **home** perché non esistono pagine per servizio. Appena si creano `/pulizie-uffici` e `/pulizie-condomini`, si cambia l'URL finale dei rispettivi gruppi: è il miglioramento singolo più utile per il punteggio di qualità.
