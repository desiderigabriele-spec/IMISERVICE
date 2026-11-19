# Google Ads per IMI Service — sintesi

19/11/2026 · Account: **nuovo, intestato a IMI** · Budget **10 €/giorno** (~304 €/mese) · Obiettivo: contatti via chiamata, WhatsApp e modulo.

## Decisioni
- **Una campagna Search attiva** su pulizia uffici, pulizie condominiali e "impresa di pulizie", in 6 comuni: Sesto, Cinisello, Cologno, Bresso, Monza, Brugherio. Milano esclusa all'avvio.
- **Seconda campagna pronta ma in pausa** per fine cantiere, sgomberi, vetrate, pavimenti e sanificazione, da accendere con budget in più.
- **Offerte:** "Massimizza i clic" con CPC massimo 2,50 € per 4 settimane, poi "Massimizza le conversioni" quando ci sono almeno 15 conversioni al mese.
- **Niente Performance Max** (mancano tracciamento e asset reali). Gli annunci di Servizi locali si valutano dopo il lancio.
- **Contenuti pronti:**
  - 70 parole chiave (frase/esatta) e 81 escluse;
  - 10 annunci, con 2 varianti A/B per uffici e per condomini;
  - 6 sitelink, 7 callout, uno snippet strutturato e l'asset chiamata.
  - Il controllo automatico (`validate_ads.py`) passa senza errori.

## Numeri chiave [STIMA]
- CPC 1,50–3,50 € → 87–203 clic al mese → **3–20 contatti al mese**, nello scenario centrale ~8 a ~36 € l'uno.
- **CPA massimo sostenibile per IMI: ~144 € a contatto**. Lo scenario pessimista (~87 €) resta sotto: **sostenibile**.
- La provvigione del 20% assorbe circa 2/3 del margine lordo stimato di IMI (30% → 10%). Va considerato quando IMI decide quanto spendere.

## Rischi
1. **Niente tracciamento oggi.** Senza conversioni misurate gli annunci si ottimizzano al buio. Va fatto prima di spendere.
2. **Volume basso.** Con 10 €/giorno Google impara lentamente; la campagna resta stretta di proposito.
3. **Atterraggio sulla home.** Senza pagine per servizio il punteggio di qualità è più basso e i clic costano di più.
4. **Nessuna recensione.** Manca la riprova sociale, sia negli annunci sia nella scheda Google.
5. **Intestazioni CSV non provate** su un Editor reale. Controllare l'anteprima all'import.

## Stime e ipotesi da validare

| Voce | Come validarla |
|---|---|
| Volumi e CPC delle keyword | Keyword Planner nel nuovo account, primo giorno |
| Canoni medi uffici/condomini, durata contratti, margine 30%, chiusura 20% | chiedere a IMI i dati degli ultimi 2 anni |
| Conversione del sito 4–10% | primi 30 giorni di dati |
| Chi dei competitor fa annunci e con che messaggi | Centro trasparenza annunci Google, 10 minuti a mano |
| Annunci di Servizi locali per uffici/condomini in Italia | provare a registrarsi da business.google.com |
| Orari migliori (lun–sab 7–21) | rapporto orari dopo 30 giorni |
| Soglie di Consent Mode e Smart Bidding | documentazione Google aggiornata |

**Confidenza complessiva della strategia: 6/10.**
- Solide: struttura, keyword, annunci e controllo dei testi.
- Deboli: volumi, CPC e valore del cliente sono stime.
- Sale a 8/10 con Keyword Planner, i numeri reali di IMI e 30 giorni di conversioni misurate.

## Domande aperte per IMI
1. Canone medio di un condominio e di un ufficio, e durata media dei contratti?
2. Su 10 preventivi, quanti diventano lavori?
3. In quali orari si risponde davvero al telefono e su WhatsApp?
4. Si può garantire il preventivo entro 48 ore dal sopralluogo? Un primo mese di prova con disdetta libera?
5. Come si gestiscono chiavi e allarmi negli uffici (per rispondere all'obiezione)?
6. Ci sono foto reali di lavori, squadra e furgone da usare negli annunci e nella scheda Google?
