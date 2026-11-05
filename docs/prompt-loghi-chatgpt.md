# Prompt per generare loghi IMI Service con ChatGPT

Copia il **prompt principale** in ChatGPT (con generazione immagini attiva). Poi usa i **prompt di rifinitura** sul concept che ti piace di più.

---

## 1. Prompt principale (6 concept diversi)

```
Sei un brand designer senior specializzato in identità visive per aziende di servizi B2B.
Progetta il logo di "IMI Service", impresa di pulizie professionali, sanificazioni e manutenzioni con sede a Sesto San Giovanni (Milano).

CHI È IL CLIENTE
- Clienti: aziende, uffici, amministratori di condominio, cantieri, privati.
- Servizi: pulizia e sanificazione uffici (anche H24), pulizie condominiali, pulizie post-ristrutturazione e sgomberi, vetrate in altezza, lavaggio moquette, lucidatura pavimenti (marmo, parquet, gres).
- Valori: affidabilità, precisione, puntualità, trasparenza, squadra esperta e multiculturale, attrezzature industriali.
- Il logo deve sembrare quello di un'impresa solida e organizzata, NON di una piccola ditta improvvisata.

TESTO DEL LOGO
- Nome esatto: "IMI Service" (scritto esattamente così, nessun'altra parola, nessuno slogan).
- "IMI" è l'elemento dominante; "Service" è secondario.

PALETTE OBBLIGATORIA
- Blu notte #0E1A2B (principale)
- Giallo segnale #FFD23C (accento)
- Crema #F6F3EC (sfondo)

STILE
- Logo vettoriale, piatto, geometrico, pulito. Niente 3D, niente sfumature, niente ombre, niente effetti realistici.
- Deve funzionare anche piccolissimo (favicon 32×32 px) e in un solo colore (stampa sulle divise e sui furgoni).
- Evita i cliché: bolle di sapone, scintille sparse, secchi e scope disegnati, gocce clipart, mascotte.

GENERA 6 CONCEPT DIVERSI, in una griglia 3×2 su sfondo crema, ciascuno con un'idea distinta:
1. Monogramma "IMI" in cui la barra di una lettera è una lama di tergivetro che lascia una traccia pulita.
2. Simbolo astratto: un quadrato/finestra con una diagonale "pulita" che divide una metà opaca da una metà brillante.
3. Wordmark tipografico forte e compatto, con un dettaglio giallo (es. il punto di una "i" a forma di goccia stilizzata geometrica).
4. Simbolo a scudo/badge minimale che comunica affidabilità e sanificazione, con le iniziali IMI.
5. Logo che richiama la pianta di un edificio o una facciata con finestre (uffici e condomini), essenziale.
6. Concept libero, il più originale e memorabile possibile, sempre coerente con il brief.

Sotto ogni concept scrivi in piccolo il numero e un titolo di 2-3 parole.
Dopo l'immagine, spiega per ogni concept in una riga l'idea e perché funziona per questo cliente.
```

---

## 2. Prompt di rifinitura (dopo aver scelto un concept)

**Sviluppo del concept scelto**
```
Sviluppa il concept n. [NUMERO]. Crea 4 varianti dello stesso concept che cambiano solo proporzioni, peso del carattere e posizione dell'accento giallo. Stessa palette, stesso stile piatto vettoriale, sfondo crema #F6F3EC. Il testo deve essere esattamente "IMI Service".
```

**Kit completo del logo scelto**
```
Del logo [NUMERO / VARIANTE] crea il kit completo in un'unica tavola:
1. versione orizzontale (simbolo + scritta);
2. versione verticale (simbolo sopra, scritta sotto);
3. solo simbolo in un quadrato con angoli arrotondati (icona app/favicon);
4. versione negativa: tutto chiaro su fondo blu notte #0E1A2B;
5. versione monocromatica nera su bianco;
6. anteprima a 32 px e a 16 px per verificare la leggibilità.
Mantieni testo identico: "IMI Service".
```

**Applicazioni reali (per valutarlo prima di decidere)**
```
Mostra il logo [NUMERO / VARIANTE] applicato in un mockup realistico: polo da lavoro blu notte, fiancata di un furgone bianco, biglietto da visita, foto profilo WhatsApp Business circolare. Il logo non deve essere modificato.
```

**Versione pulita da vettorializzare**
```
Ridisegna il logo [NUMERO / VARIANTE] come immagine finale: solo il logo, centrato, su sfondo completamente bianco, colori piatti pieni (#0E1A2B e #FFD23C), contorni netti, nessuna texture, alta risoluzione, pronto per essere convertito in vettoriale (SVG).
```

---

## Consigli

- I generatori di immagini sbagliano spesso le lettere: se il testo esce storto, chiedi "correggi solo la scritta: deve essere esattamente IMI Service, stesso stile".
- Il file finale va **vettorializzato** (SVG) da un grafico o con un tool di vettorializzazione prima di usarlo su divise, furgoni e sito.
- Una volta scelto il logo, mandamelo in SVG o PNG e lo inserisco nel sito (header, footer, favicon ed etichetta dello spruzzino 3D).
