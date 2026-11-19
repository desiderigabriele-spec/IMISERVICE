"""Controlla i CSV delle campagne prima dell'import in Google Ads Editor.

Limiti (verificati il 19/11/2026, vedi ../sources.md):
- RSA: titoli 30 caratteri (max 15), descrizioni 90 (max 4), percorsi 15  — support.google.com/google-ads/answer/7684791
- sitelink: testo 25, righe di descrizione 35                         — support.google.com/google-ads/answer/2375416 + API SitelinkAsset
- callout 25                                                           — support.google.com/google-ads/answer/6079510
- snippet strutturati: valori 25 [fonte terza, da riconfermare]
Esce con codice 1 se trova errori.
"""
import csv, os, re, sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
SITE_INDEX = os.path.join(HERE, '..', '..', '..', 'index.html')   # sito locale, per verificare le ancore dei sitelink
LIM = {'headline': 30, 'description': 90, 'path': 15, 'sitelink': 25, 'sitelink_desc': 35, 'callout': 25, 'snippet': 25}
errors, warnings = [], []

def rd(name):
    with open(os.path.join(HERE, name), encoding='utf-8') as f:
        return list(csv.DictReader(f))

PHONE = re.compile(r'\+?\d[\d .]{7,}\d')
EMOJI = re.compile('[\U0001F300-\U0001FAFF☀-➿]')
CAPS_OK = {'IMI', 'IVA', 'CCNL'}

def check_text(kind, text, where):
    lim = LIM[kind]
    if len(text) > lim:
        errors.append(f'{where}: "{text}" = {len(text)} caratteri (max {lim})')
    if kind in ('headline', 'sitelink', 'callout') and '!' in text:
        errors.append(f'{where}: "!" non ammesso in titoli, sitelink e callout')
    if re.search(r'([!?.,])\1', text):
        errors.append(f'{where}: punteggiatura ripetuta in "{text}"')
    if EMOJI.search(text):
        errors.append(f'{where}: emoji non ammesse in "{text}"')
    if kind != 'path' and PHONE.search(text) and kind != 'call':
        errors.append(f'{where}: numero di telefono nel testo (usare l\'asset chiamata): "{text}"')
    for w in re.findall(r'\b[A-ZÀ-Ú]{4,}\b', text):
        if w not in CAPS_OK:
            errors.append(f'{where}: parola tutta maiuscola "{w}" (non ammessa)')
    if text != text.strip() or '  ' in text:
        errors.append(f'{where}: spazi in eccesso in "{text}"')

# --- annunci e struttura -------------------------------------------------------------
rows = rd('google-ads-editor-import.csv')
ads = [r for r in rows if r['Ad type'] == 'Responsive search ad']
kw_rows = [r for r in rows if r['Criterion Type'] in ('Phrase', 'Exact', 'Broad')]
groups_with_kw = defaultdict(list)
for r in kw_rows:
    groups_with_kw[(r['Campaign'], r['Ad Group'])].append(r['Keyword'])
groups_with_ad = defaultdict(list)
for i, r in enumerate(ads, 1):
    where = f"annuncio {i} [{r['Ad Group']}]"
    hl = [r[f'Headline {n}'] for n in range(1, 16) if r[f'Headline {n}']]
    ds = [r[f'Description {n}'] for n in range(1, 5) if r[f'Description {n}']]
    if not 3 <= len(hl) <= 15: errors.append(f'{where}: {len(hl)} titoli (servono da 3 a 15)')
    if not 2 <= len(ds) <= 4: errors.append(f'{where}: {len(ds)} descrizioni (servono da 2 a 4)')
    if len(hl) < 10: warnings.append(f'{where}: solo {len(hl)} titoli (consigliati almeno 10 per un buon rendimento)')
    for t in hl: check_text('headline', t, where)
    for d in ds: check_text('description', d, where)
    for p in ('Path 1', 'Path 2'):
        if r[p]: check_text('path', r[p], where)
    low = [t.lower() for t in hl]
    for t in set(low):
        if low.count(t) > 1: errors.append(f'{where}: titolo duplicato "{t}"')
    if len(set(d.lower() for d in ds)) < len(ds): errors.append(f'{where}: descrizione duplicata')
    pins = [r[f'Headline {n} position'] for n in range(1, 16) if r[f'Headline {n} position']]
    if pins.count('1') > 1: warnings.append(f'{where}: più titoli fissati in posizione 1 (riduce le combinazioni)')
    if not r['Final URL'].startswith('https://'): errors.append(f'{where}: URL finale non https')
    groups_with_ad[(r['Campaign'], r['Ad Group'])].append(hl)

# ogni gruppo con keyword ha un annuncio, e ogni annuncio sta in un gruppo con keyword
for g in groups_with_kw:
    if g not in groups_with_ad: errors.append(f'gruppo {g[1]}: keyword senza annuncio')
for g in groups_with_ad:
    if g not in groups_with_kw: errors.append(f'gruppo {g[1]}: annuncio senza keyword')
# il tema del gruppo compare in almeno un titolo (pertinenza)
THEME = {'Pulizia uffici': 'uffici', 'Pulizie condomini': 'condomin', 'Impresa di pulizie': 'impresa di pulizie',
         'Fine cantiere': 'cantiere', 'Sgomberi': 'sgombero', 'Vetrate': 'vetr', 'Pavimenti': 'pavimenti', 'Sanificazione': 'sanificazione'}
for g, ads_hl in groups_with_ad.items():
    theme = THEME.get(g[1])
    for hl in ads_hl:
        if theme and not any(theme in t.lower() for t in hl):
            errors.append(f'gruppo {g[1]}: nessun titolo contiene "{theme}"')

# keyword duplicate nello stesso gruppo
seen = set()
for r in kw_rows:
    k = (r['Campaign'], r['Ad Group'], r['Keyword'], r['Criterion Type'])
    if k in seen: errors.append(f'keyword duplicata: {k}')
    seen.add(k)

# negative che bloccano keyword positive dello stesso gruppo/campagna
negs = rd('negatives.csv')
for n in negs:
    for r in kw_rows:
        same = r['Campaign'] == n['Campaign'] and (n['Livello'] == 'campagna' or r['Ad Group'] == n['Ad Group'])
        if same and re.search(r'\b' + re.escape(n['Keyword']) + r'\b', r['Keyword']):
            errors.append(f'negativa "{n["Keyword"]}" blocca la keyword "{r["Keyword"]}" ({r["Ad Group"]})')

# --- asset ---------------------------------------------------------------------------
html = open(SITE_INDEX, encoding='utf-8').read() if os.path.exists(SITE_INDEX) else ''
for a in rd('assets.csv'):
    t = a['Asset type']; where = f'asset {t} "{a["Text / Header / Phone"]}"'
    if t == 'Sitelink':
        check_text('sitelink', a['Text / Header / Phone'], where)
        for d in ('Description 1 / Values / Country', 'Description 2'):
            check_text('sitelink_desc', a[d], where)
        anchor = a['Final URL'].split('#', 1)[1] if '#' in a['Final URL'] else ''
        if anchor and html and f'id="{anchor}"' not in html:
            errors.append(f'{where}: l\'ancora #{anchor} non esiste nel sito')
        if not html: warnings.append('index.html non trovato: ancore dei sitelink non verificate')
    elif t == 'Callout':
        check_text('callout', a['Text / Header / Phone'], where)
    elif t == 'Structured snippet':
        vals = [v.strip() for v in a['Description 1 / Values / Country'].split(';')]
        if len(vals) < 3: errors.append(f'{where}: servono almeno 3 valori')
        for v in vals: check_text('snippet', v, where)

print(f'Annunci: {len(ads)} · keyword: {len(kw_rows)} · negative: {len(negs)}')
for w in warnings: print('AVVISO', w)
for e in errors: print('ERRORE', e)
if errors:
    print(f'\n{len(errors)} errori: correggere build_ads.py e rigenerare.'); sys.exit(1)
print('OK: nessun errore.')
