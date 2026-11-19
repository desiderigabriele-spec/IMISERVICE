"""Genera i CSV delle campagne Google Ads di IMI Service.

Fonte unica dei testi: questo file. Dopo ogni modifica:
    python3 build_ads.py && python3 validate_ads.py
"""
import csv, os

HERE = os.path.dirname(os.path.abspath(__file__))
URL = 'https://imiservicepulizie.it/'

# ---------------------------------------------------------------- campagne
CAMPAIGNS = [
    # nome, budget giornaliero €, stato
    ('IMI | Search | Uffici e condomini | Nord Milano', 10, 'Enabled'),
    ('IMI | Search | Altri servizi | Nord Milano', 5, 'Paused'),
]
C1, C2 = CAMPAIGNS[0][0], CAMPAIGNS[1][0]

# ---------------------------------------------------------------- keyword
# (campagna, gruppo, keyword, corrispondenza, intento)
KW = []
def kws(camp, group, intent, words, types=('Phrase', 'Exact')):
    for w in words:
        for t in types:
            KW.append((camp, group, w, t, intent))

kws(C1, 'Pulizia uffici', 'transazionale', [
    'pulizia uffici sesto san giovanni', 'pulizie uffici sesto san giovanni', 'impresa pulizie uffici sesto san giovanni',
    'pulizia uffici cinisello balsamo', 'pulizia uffici cologno monzese', 'pulizia uffici monza', 'pulizia uffici bresso',
])
kws(C1, 'Pulizia uffici', 'commerciale', ['impresa pulizie uffici', 'ditta pulizie uffici', 'servizio pulizia uffici', 'pulizia uffici serale'], types=('Phrase',))
kws(C1, 'Pulizie condomini', 'transazionale', [
    'pulizie condominiali sesto san giovanni', 'pulizia condomini sesto san giovanni', 'pulizia scale condominio sesto san giovanni',
    'pulizie condominiali cinisello balsamo', 'pulizie condominiali cologno monzese', 'pulizie condominiali monza', 'pulizie condominiali bresso',
])
kws(C1, 'Pulizie condomini', 'commerciale', ['impresa pulizie condominiali', 'ditta pulizie condominio', 'pulizia scale condominio', 'pulizia androni condominio'], types=('Phrase',))
kws(C1, 'Impresa di pulizie', 'transazionale', [
    'impresa di pulizie sesto san giovanni', 'impresa pulizie sesto san giovanni', 'ditta di pulizie sesto san giovanni',
    'impresa di pulizie cinisello balsamo', 'impresa di pulizie cologno monzese', 'impresa di pulizie monza', 'impresa di pulizie bresso',
])
kws(C1, 'Impresa di pulizie', 'commerciale', ['impresa di pulizie', 'ditta di pulizie', 'impresa di pulizie vicino a me'], types=('Phrase',))

kws(C2, 'Fine cantiere', 'transazionale-urgente', ['pulizia fine cantiere', 'pulizia post ristrutturazione', 'pulizie fine lavori'], types=('Phrase',))
kws(C2, 'Sgomberi', 'transazionale-urgente', ['sgombero appartamenti', 'sgombero cantine', 'svuota cantine', 'sgombero locali'], types=('Phrase',))
kws(C2, 'Vetrate', 'transazionale', ['pulizia vetrate', 'pulizia vetri uffici', 'pulizia vetrine negozi'], types=('Phrase',))
kws(C2, 'Pavimenti', 'transazionale', ['lucidatura marmo', 'trattamento pavimenti', 'lavaggio moquette', 'levigatura parquet'], types=('Phrase',))
kws(C2, 'Sanificazione', 'transazionale', ['sanificazione uffici', 'sanificazione ambienti', 'sanificazione condominio'], types=('Phrase',))

# ---------------------------------------------------------------- negative
# (livello, campagna, gruppo, keyword, corrispondenza)
NEG_ACCOUNT = ['lavoro', 'lavorare', 'offerte di lavoro', 'cerco lavoro', 'cercasi', 'assunzioni', 'assume', 'stipendio', 'busta paga',
               'ccnl', 'contratto collettivo', 'corso', 'corsi', 'formazione', 'gratis', 'fai da te', 'come pulire', 'prodotti',
               'detersivi', 'macchinari', 'noleggio', 'lavapavimenti', 'aspirapolvere', 'colf', 'badante', 'domestica', 'pdf',
               'franchising', 'aprire impresa', 'avviare impresa', 'auto', 'piscina', 'tappezzeria auto', 'canna fumaria', 'lavanderia']
NEG = [('campagna', c, '', w, 'Phrase') for c, _, _ in CAMPAIGNS for w in NEG_ACCOUNT]
# anti-cannibalizzazione tra gruppi
for w in ['condominio', 'condominiali', 'condomini', 'scale']:
    NEG.append(('gruppo', C1, 'Pulizia uffici', w, 'Phrase'))
for w in ['uffici', 'ufficio']:
    NEG.append(('gruppo', C1, 'Pulizie condomini', w, 'Phrase'))
for w in ['uffici', 'ufficio', 'condominio', 'condominiali', 'condomini']:
    NEG.append(('gruppo', C1, 'Impresa di pulizie', w, 'Phrase'))

# ---------------------------------------------------------------- annunci RSA
# (campagna, gruppo, variante, titoli [(testo, posizione fissa o '')], descrizioni, path1, path2, stato)
ADS = [
 (C1, 'Pulizia uffici', 'A', [
    ('Pulizia Uffici a Sesto', '1'), ('Impresa di Pulizie dal 2008', ''), ('Puliamo di Sera e di Notte', ''),
    ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''), ('Ufficio Pulito Ogni Mattina', ''),
    ('Scrivici su WhatsApp', ''), ('Anche nel Weekend e Festivi', ''), ('Impresa Regolare dal 2008', ''),
    ('Pulizia Uffici Cinisello', ''), ('Pulizia Uffici Monza', ''), ('Calendario Fisso Concordato', ''),
    ('Pulizia e Sanificazione', ''), ('Impresa di Sesto San Giovanni', ''), ('Fattura e Documenti in Regola', '')],
  ['Puliamo il tuo ufficio la sera o di notte: al mattino trovi tutto in ordine.',
   'Sopralluogo gratuito e preventivo scritto. Sesto, Cinisello, Cologno, Monza e dintorni.',
   'Impresa iscritta in Camera di Commercio dal 2008, con fattura. Rispondiamo su WhatsApp.',
   'Postazioni, bagni, cestini e vetri con un calendario fisso concordato con te.'],
  'pulizia-uffici', 'sesto', 'Enabled'),
 (C1, 'Pulizia uffici', 'B', [
    ('Pulizie Uffici Fuori Orario', ''), ('Impresa di Pulizie a Sesto', ''), ('Dal 2008 a Sesto San Giovanni', ''),
    ('Non Disturbiamo il Lavoro', ''), ('Sopralluogo Senza Impegno', ''), ('Preventivo Scritto Gratuito', ''),
    ('Contatto Diretto su WhatsApp', ''), ('Uffici, Studi e Negozi', ''), ('Pulizia Uffici Cologno', ''),
    ('Pulizia Uffici Bresso', ''), ('Anche di Notte e nei Festivi', ''), ('Bagni e Cucine Igienizzati', '')],
  ['Uffici, studi e negozi puliti quando non ci sei: di sera, di notte o nel weekend.',
   'Prima veniamo a vedere, poi ti diamo un preventivo scritto. Il sopralluogo è gratuito.',
   'Impresa di Sesto San Giovanni dal 2008. Scrivici su WhatsApp o chiamaci.'],
  'uffici', 'nord-milano', 'Enabled'),
 (C1, 'Pulizie condomini', 'A', [
    ('Pulizie Condominiali a Sesto', '1'), ('Pulizia Scale e Androni', ''), ('Impresa di Pulizie dal 2008', ''),
    ('Calendario Fisso e Rispettato', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Meno Lamentele in Assemblea', ''), ('Esposizione Sacchi Inclusa', ''), ('Ascensori e Portoni Puliti', ''),
    ('Per Amministratori', ''), ('Impresa di Sesto San Giovanni', ''), ('Scrivici su WhatsApp', ''),
    ('Fattura e Documenti in Regola', ''), ('Pulizie Condomini Monza', ''), ('Pulizie Condomini Cinisello', '')],
  ['Scale, androni, ascensori e vetri del portone puliti secondo un calendario fisso.',
   'Sopralluogo gratuito e preventivo scritto. Sesto, Cinisello, Cologno, Monza e dintorni.',
   'Impresa iscritta in Camera di Commercio dal 2008, con fattura intestata al condominio.',
   'Ci occupiamo anche dei sacchi nei giorni di raccolta. Rispondiamo su WhatsApp.'],
  'condomini', 'sesto', 'Enabled'),
 (C1, 'Pulizie condomini', 'B', [
    ('Impresa Pulizie Condominiali', ''), ('Scale Pulite, Condòmini Sereni', ''), ('Dal 2008 a Sesto San Giovanni', ''),
    ('Passaggi Settimanali Fissi', ''), ('Sopralluogo Senza Impegno', ''), ('Preventivo Scritto Gratuito', ''),
    ('Contatto Diretto su WhatsApp', ''), ('Pulizie Condomini Cologno', ''), ('Pulizie Condomini Bresso', ''),
    ('Corrimano e Vetri Inclusi', ''), ('Cambi Impresa? Ti Aiutiamo', '')],
  ['Passaggi fissi su scale, androni e ascensori, con un calendario concordato con te.',
   "Prima veniamo a vedere il condominio, poi un preventivo scritto. Sopralluogo gratuito.",
   'Impresa di Sesto San Giovanni dal 2008. Scrivici su WhatsApp o chiamaci.'],
  'condomini', 'nord-milano', 'Enabled'),
 (C1, 'Impresa di pulizie', 'A', [
    ('Impresa di Pulizie a Sesto', '1'), ('Impresa di Pulizie dal 2008', ''), ('Uffici, Condomini e Cantieri', ''),
    ('Pulizie Anche di Notte', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Scrivici su WhatsApp', ''), ('Impresa di Pulizie Cinisello', ''), ('Impresa di Pulizie Monza', ''),
    ('Impresa di Pulizie Cologno', ''), ('Pulizia e Sanificazione', ''), ('Fattura e Documenti in Regola', ''),
    ('Vetrate, Pavimenti e Sgomberi', ''), ('Impresa di Sesto San Giovanni', '')],
  ['Uffici, condomini, fine cantiere, vetrate e pavimenti a Sesto, Cinisello, Monza e vicini.',
   'Sopralluogo gratuito e preventivo scritto. Lavoriamo anche di sera, notte e nei festivi.',
   'Impresa iscritta in Camera di Commercio dal 2008, con fattura. Rispondiamo su WhatsApp.'],
  'impresa-pulizie', 'sesto', 'Enabled'),
 (C2, 'Fine cantiere', 'A', [
    ('Pulizia Fine Cantiere', '1'), ('Pulizia Post Ristrutturazione', ''), ('Casa Pronta da Abitare', ''),
    ('Polvere, Calce e Vernice Via', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Impresa di Pulizie dal 2008', ''), ('Infissi, Sanitari e Pavimenti', ''), ('Scrivici su WhatsApp', ''),
    ('Sesto, Cinisello e Monza', '')],
  ['Togliamo polvere fine, calce, stucco e vernice: ti consegniamo la casa pronta.',
   'Sopralluogo gratuito e preventivo scritto. Impresa di Sesto San Giovanni dal 2008.'],
  'fine-cantiere', 'sesto', 'Enabled'),
 (C2, 'Sgomberi', 'A', [
    ('Sgombero Appartamenti', '1'), ('Sgombero Cantine e Solai', ''), ('Svuotiamo e Puliamo', ''),
    ('Smaltimento a Norma', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Impresa di Pulizie dal 2008', ''), ('Locali Pronti da Consegnare', ''), ('Scrivici su WhatsApp', ''),
    ('Sesto, Cinisello e Monza', '')],
  ['Svuotiamo appartamenti, cantine e uffici, smaltiamo a norma e puliamo a fondo.',
   'Sopralluogo gratuito e preventivo scritto. Impresa di Sesto San Giovanni dal 2008.'],
  'sgomberi', 'sesto', 'Enabled'),
 (C2, 'Vetrate', 'A', [
    ('Pulizia Vetrate', '1'), ('Vetri e Vetrine Senza Aloni', ''), ('Vetrate di Uffici e Negozi', ''),
    ('Pulizia Vetri in Altezza', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Impresa di Pulizie dal 2008', ''), ('Scrivici su WhatsApp', ''), ('Sesto, Cinisello e Monza', ''), ('Vetrate di Condomini', '')],
  ['Vetrate di uffici, negozi e condomini pulite anche in altezza, senza aloni.',
   'Sopralluogo gratuito e preventivo scritto. Impresa di Sesto San Giovanni dal 2008.'],
  'vetrate', 'sesto', 'Enabled'),
 (C2, 'Pavimenti', 'A', [
    ('Trattamento Pavimenti', '1'), ('Lucidatura Marmo e Parquet', ''), ('Lavaggio Moquette', ''),
    ('Pavimenti Come Nuovi', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Impresa di Pulizie dal 2008', ''), ('Scrivici su WhatsApp', ''), ('Sesto, Cinisello e Monza', ''), ('Marmo, Parquet, Gres', '')],
  ['Lucidatura di marmo e parquet, gres e lavaggio moquette con macchine professionali.',
   'Sopralluogo gratuito e preventivo scritto. Impresa di Sesto San Giovanni dal 2008.'],
  'pavimenti', 'sesto', 'Enabled'),
 (C2, 'Sanificazione', 'A', [
    ('Sanificazione Ambienti', '1'), ('Sanificazione Uffici', ''), ('Sanificazione Condomini', ''),
    ('Prodotti Professionali', ''), ('Sopralluogo Gratuito', ''), ('Preventivo Scritto e Chiaro', ''),
    ('Impresa di Pulizie dal 2008', ''), ('Scrivici su WhatsApp', ''), ('Sesto, Cinisello e Monza', ''), ('Uffici, Negozi e Case', '')],
  ['Sanifichiamo uffici, condomini, negozi e case con prodotti professionali specifici.',
   'Sopralluogo gratuito e preventivo scritto. Impresa di Sesto San Giovanni dal 2008.'],
  'sanificazione', 'sesto', 'Enabled'),
]

# ---------------------------------------------------------------- asset
SITELINKS = [  # testo, descrizione 1, descrizione 2, URL
    ('Pulizia Uffici', 'Anche di sera e di notte', 'Calendario fisso concordato', URL + '#svc-uffici'),
    ('Pulizie Condominiali', 'Scale, androni e ascensori', 'Passaggi settimanali fissi', URL + '#svc-condomini'),
    ('Fine Cantiere', 'Casa pronta da abitare', 'Polvere, calce e vernice via', URL + '#svc-cantiere'),
    ('Preventivo Gratuito', 'Rispondi a 3 domande', 'Ti contattiamo noi', URL + '#preventivo'),
    ('Domande Frequenti', 'Orari, prezzi e sopralluogo', 'Tutte le risposte', URL + '#faq'),
    ('Zone Servite', 'Sesto, Monza, Cinisello', 'Cologno, Bresso e Milano', URL + '#zone'),
]
CALLOUTS = ['Dal 2008', 'Sopralluogo Gratuito', 'Preventivo Scritto', 'Anche di Notte e Festivi', 'Fattura Regolare',
            'Rispondiamo su WhatsApp', 'Calendario Fisso']
SNIPPET = ('Servizi', ['Pulizia uffici', 'Pulizie condominiali', 'Fine cantiere', 'Sgomberi', 'Vetrate', 'Pavimenti', 'Sanificazione'])
CALL = ('IT', '+39 344 770 1121')


def write(name, header, rows):
    with open(os.path.join(HERE, name), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f); w.writerow(header); w.writerows(rows)

if __name__ == '__main__':
    write('keywords.csv', ['Campaign', 'Ad Group', 'Keyword', 'Match Type', 'Intento', 'Volume mensile', 'CPC stimato EUR'],
          [(c, g, k, t, i, 'n.d. [STIMA: validare con Keyword Planner]', '1,50-3,50 [STIMA]') for c, g, k, t, i in KW])
    write('negatives.csv', ['Livello', 'Campaign', 'Ad Group', 'Keyword', 'Match Type'], NEG)
    rows = [('Sitelink', '<Account-level>', t, d1, d2, u) for t, d1, d2, u in SITELINKS]
    rows += [('Callout', '<Account-level>', c, '', '', '') for c in CALLOUTS]
    rows += [('Structured snippet', '<Account-level>', SNIPPET[0], '; '.join(SNIPPET[1]), '', '')]
    rows += [('Call', '<Account-level>', CALL[1], CALL[0], '', '')]
    write('assets.csv', ['Asset type', 'Campaign', 'Text / Header / Phone', 'Description 1 / Values / Country', 'Description 2', 'Final URL'], rows)

    H = ['Campaign', 'Campaign Type', 'Campaign Status', 'Budget', 'Budget type', 'Bid Strategy Type', 'Networks', 'Languages',
         'Ad Group', 'Ad Group Status', 'Max CPC', 'Keyword', 'Criterion Type', 'Ad type', 'Status']
    H += [f'Headline {i}' for i in range(1, 16)] + [f'Headline {i} position' for i in range(1, 16)]
    H += [f'Description {i}' for i in range(1, 5)] + ['Path 1', 'Path 2', 'Final URL']
    blank = {h: '' for h in H}
    out = []
    for name, budget, status in CAMPAIGNS:
        out.append({**blank, 'Campaign': name, 'Campaign Type': 'Search', 'Campaign Status': status, 'Budget': f'{budget:.2f}',
                    'Budget type': 'Daily', 'Bid Strategy Type': 'Maximize clicks', 'Networks': 'Google search', 'Languages': 'it'})
    groups = sorted({(c, g) for c, g, *_ in KW}, key=lambda x: (x[0], x[1]))
    for c, g in groups:
        out.append({**blank, 'Campaign': c, 'Ad Group': g, 'Ad Group Status': 'Enabled', 'Max CPC': '2.50'})
    for c, g, k, t, _ in KW:
        out.append({**blank, 'Campaign': c, 'Ad Group': g, 'Keyword': k, 'Criterion Type': t, 'Status': 'Enabled'})
    for lvl, c, g, k, t in NEG:
        out.append({**blank, 'Campaign': c, 'Ad Group': g, 'Keyword': k,
                    'Criterion Type': ('Campaign Negative ' if lvl == 'campagna' else 'Negative ') + t})
    for c, g, v, hl, ds, p1, p2, st in ADS:
        r = {**blank, 'Campaign': c, 'Ad Group': g, 'Ad type': 'Responsive search ad', 'Status': st,
             'Path 1': p1, 'Path 2': p2, 'Final URL': URL}
        for i, (t, pos) in enumerate(hl, 1):
            r[f'Headline {i}'] = t; r[f'Headline {i} position'] = pos
        for i, d in enumerate(ds, 1):
            r[f'Description {i}'] = d
        out.append(r)
    write('google-ads-editor-import.csv', H, [[r[h] for h in H] for r in out])
    print(f'{len(KW)} keyword, {len(NEG)} negative, {len(ADS)} annunci, {len(SITELINKS)} sitelink, {len(CALLOUTS)} callout')
