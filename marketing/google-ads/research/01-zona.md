# 01 — Zona

Cliente: IMI Service (impresa di pulizie, Sesto San Giovanni). Data: 19/11/2026.
Legenda: `[DATO]` fonte in `sources.md` · `[STIMA]` con metodo · `[IPOTESI]` da validare.

## Demografia dei comuni serviti (sito: Sesto, Monza, Brugherio, Cologno, Cinisello, Bresso, Segrate, Milano)

| Comune | Residenti | Data | Etichetta |
|---|---|---|---|
| Sesto San Giovanni | 78.792 | 1/1/2025 | [DATO] tuttitalia (ISTAT) e Città metropolitana |
| Cinisello Balsamo | 74.702 | 1/1/2025 | [DATO] tuttitalia (ISTAT) |
| Cologno Monzese | 46.994 | 1/1/2025 | [DATO] tuttitalia (ISTAT) |
| Bresso | 26.513 | 1/1/2025 | [DATO] tuttitalia (ISTAT) |
| Monza | 123.032 | 1/1/2025 | [DATO] Il Giorno su dati ISTAT |
| Brugherio | ~35.400 | 2025 prelim. | [DATO] citypopulation (dato preliminare, da verificare) |
| Segrate | n.d. | — | non trovato: verificare su ISTAT |
| Milano (città metropolitana) | 3.248.000 | 1/1/2025 | [DATO] Camera di Commercio Milano Monza Brianza Lodi |

Bacino a ridosso della sede (Sesto + 3 comuni confinanti senza Milano e Monza): **~227.000 residenti** [STIMA = somma delle righe [DATO] Sesto, Cinisello, Cologno, Bresso].

## Imprese (rilevante: uffici e condomini sono B2B)

- Sesto San Giovanni: **5.522–6.168 imprese** secondo fonti diverse (VareseNews 2020; Assolombarda, 20,2% del Nord Milano) [DATO, date non allineate]. Un aggregatore riporta 7.786 aziende, 1.487 società di capitali [DATO non ufficiale].
- Nord Milano orientato ai servizi: nel gruppo di comuni che comprende Sesto il 73% delle unità locali è nei servizi [DATO Assolombarda].
- Reddito medio per comune (MEF): **non raccolto** in questa sessione → da aggiungere se serve per i privati (sgomberi, fine cantiere). Non incide su uffici/condomini.

## Geografia commerciale [IPOTESI salvo dove indicato]

- Sesto è il polo terziario del Nord Milano (ex aree industriali riconvertite a uffici, ospedali, centri direzionali) [IPOTESI: descrizione qualitativa, da confermare con Assolombarda "Nord Milano: area in forte sviluppo"].
- Milano città: domanda altissima ma CPC e concorrenza più alti; con 10 €/giorno non si copre in modo efficiente [STIMA, vedi strategy.md].
- Monza: secondo capoluogo vicino, buon bacino condomini [IPOTESI].

## Stagionalità e domanda

- Google Trends non consultato in questa sessione (nessun accesso): **da fare prima del lancio** su "impresa di pulizie", "pulizia uffici", "pulizie condominiali" (Lombardia, 5 anni).
- Atteso [IPOTESI]: uffici e condomini = domanda stabile tutto l'anno, cali ad agosto e a fine dicembre; fine cantiere e sgomberi con picchi in primavera e a settembre (traslochi, ristrutturazioni).

## Comportamento di ricerca locale [IPOTESI da validare con Keyword Planner]

- B2B: "impresa di pulizie + città", "pulizia uffici + città", "ditta pulizie condominio + città". Ricerche fatte da amministratori, office manager, titolari.
- Urgenza: rara per uffici/condomini (cambio fornitore pianificato); alta per fine cantiere ("pulizia fine cantiere urgente") e sgomberi.
- "Vicino a me": rilevante soprattutto da mobile → coperto dalla scheda Google e dal targeting per area.

## Priorità zone (domanda stimata × capacità di servizio × concorrenza)

| Priorità | Zona | Motivo | Confidenza |
|---|---|---|---|
| 1 | Sesto San Giovanni | sede, nessun costo di trasferta, credibilità "impresa locale" | 8/10 |
| 2 | Cinisello, Cologno, Bresso | confinanti, ~148.000 residenti, meno concorrenza di Milano | 7/10 |
| 3 | Monza, Brugherio | bacino ampio ma più concorrenti brianzoli | 6/10 |
| 4 | Milano (zone nord) | domanda alta, CPC più alto: attivare solo con budget > 10 €/giorno | 6/10 |

**Raccomandazione geotargeting:** elenco comuni (non raggio): Sesto San Giovanni, Cinisello Balsamo, Cologno Monzese, Bresso, Monza, Brugherio. Opzione località: **"Presenza: persone che si trovano o si trovano regolarmente"** nelle località (non "interesse"). Milano in campagna separata in pausa, da attivare quando il budget sale. Confidenza 7/10: per alzarla servono i volumi di Keyword Planner per comune.
