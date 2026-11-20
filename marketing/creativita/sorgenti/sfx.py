"""Effetti sonori sintetizzati per gli spot IMI Service (nessun campione esterno, quindi nessun problema di licenza).
Uso: python3 sfx.py  -> out/sfx-spot15.wav, out/sfx-bumper6.wav e le singole tracce in sfx/"""
import numpy as np, wave, os
SR = 48000
rng = np.random.default_rng(7)
os.makedirs('sfx', exist_ok=True); os.makedirs('out', exist_ok=True)

def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r, shape=2.0):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na) ** shape
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** shape
    return e
def bandpass(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = ((f >= lo) & (f <= hi)).astype(float)
    k = int(0.02 * len(m)) or 1; m = np.convolve(m, np.ones(k) / k, 'same'); return np.fft.irfft(X * m, len(x))
def norm(x, peak): return x / (np.max(np.abs(x)) + 1e-9) * peak

def whoosh(d=0.55, lo=300, hi=3500, peak=.35):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 2048
    for i in range(0, n, seg // 2):          # filtro che sale e scende: effetto "passaggio"
        k = i / n; c = lo + (hi - lo) * np.sin(np.pi * k)
        w = np.hanning(min(seg, n - i)); out[i:i + len(w)] += bandpass(x[i:i + len(w)] * w, c * .6, c * 1.6)
    return norm(out * env(n, d * .45, d * .5), peak)

def squeegee(d=1.3, peak=.42):
    """passata della gomma sul vetro: attrito bagnato + cigolio a scatti (stick-slip)"""
    tt = t_(d); n = len(tt); k = tt / d
    speed = np.sin(np.pi * k) ** 1.5                                   # segue l'andamento della passata (piano-veloce-piano)
    fric = bandpass(rng.standard_normal(n), 1800, 7000) * speed * .5
    f0 = 820 + 260 * k + 40 * np.sin(2 * np.pi * 5 * tt)
    ph = 2 * np.pi * np.cumsum(f0) / SR
    tone = np.sin(ph) + .45 * np.sin(2 * ph) + .2 * np.sin(3 * ph)
    stick = (0.6 + 0.4 * np.tanh(2.5 * np.sin(2 * np.pi * 34 * tt))) * speed  # scatti di attrito
    squeak = tone * stick * .28
    x = fric + squeak
    x[-int(.12 * SR):] += np.sin(2 * np.pi * 1350 * t_(.12)) * np.linspace(.35, 0, int(.12 * SR))  # cigolio finale a fine passata
    return norm(x * env(n, .06, .1, 1.2), peak)

def bell(f, d=.9, peak=1.0):
    """campanello cristallino: parziali da campana con attacco morbido"""
    tt = t_(d)
    x = (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * f * 2.0 * tt) * np.exp(-tt * 3)
         + .18 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 6) + .08 * np.sin(2 * np.pi * f * 5.4 * tt) * np.exp(-tt * 10))
    e = np.exp(-tt * 4.2); e[:int(.006 * SR)] *= np.linspace(0, 1, int(.006 * SR))
    return x * e * peak

def wipe(d=1.5, peak=.42):
    """passata gratificante: fruscio morbido + arpeggio sulle note del brano (mi bemolle: Eb-G-Bb) + ding finale col luccichio"""
    n = int((d + 1.0) * SR); out = np.zeros(n); tt = t_(d); k = tt / d
    speed = np.sin(np.pi * k) ** 2
    swish = bandpass(rng.standard_normal(len(tt)), 500, 3200) * speed * .16
    out[:len(tt)] += swish
    notes = [1244.5, 1568.0, 1864.7]                        # Eb6, G6, Bb6: una nota per battito
    for i, f in enumerate(notes):
        b = bell(f, .9, .32 + .06 * i); st = int(i * d / 3 * SR); out[st:st + len(b)] += b[:n - st]
    ding = bell(2489.0, 1.0, .55) + .4 * bell(3729.3, 1.0, .5)  # Eb7 + Bb7 a fine passata
    st = int(d * SR); out[st:st + len(ding)] += ding[:n - st]
    air = bandpass(rng.standard_normal(int(.8 * SR)), 7000, 12000) * np.exp(-t_(.8) * 6) * .12   # luccichio
    out[st:st + len(air)] += air[:n - st]
    return norm(out, peak)

def pop(f1=950, f2=380, d=.09, peak=.4):
    tt = t_(d); f = f1 * (f2 / f1) ** (tt / d); x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return norm(x * np.exp(-tt * 38), peak)

def thud(peak=.6):
    tt = t_(.55); body = np.sin(2 * np.pi * (62 + 40 * np.exp(-tt * 18)) * tt) * np.exp(-tt * 7)
    click = bandpass(rng.standard_normal(len(tt)), 900, 4000) * np.exp(-tt * 60) * .5
    return norm(body + click, peak)

def sparkle(peak=.28):
    out = np.zeros(int(.9 * SR))
    for i, f in enumerate([2093, 2637, 3136, 4186]):            # do-mi-sol-do acuti
        tt = t_(.5); s = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 9)
        st = int(i * .07 * SR); out[st:st + len(s)] += s[:len(out) - st]
    return norm(out, peak)

def cut(peak=.3):
    return norm(whoosh(.22, 1500, 6000, 1) + np.pad(pop(1800, 900, .05, .5), (0, int(.22 * SR) - int(.05 * SR))), peak)

FX = {'whoosh': whoosh, 'squeegee': squeegee, 'wipe': wipe, 'pop': pop, 'thud': thud, 'sparkle': sparkle, 'cut': cut}

def write(path, x):
    x = np.clip(x, -1, 1); st = np.stack([x, x], 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())

def track(dur, events):
    out = np.zeros(int(dur * SR))
    for at, name, *kw in events:
        s = FX[name](**(kw[0] if kw else {})); i = int(at * SR); out[i:i + len(s)] += s[:len(out) - i]
    return out

B = 0.5  # battito a 120 BPM: tutti gli effetti cadono sui battiti
SQ = {'d': 3 * B}
SPOT15 = [(0.0, 'whoosh', {'d': .4, 'peak': .2}), (B, 'wipe', SQ),
          (6 * B - .15, 'whoosh'), (7 * B, 'wipe', SQ),
          (12 * B - .02, 'cut'), (12 * B, 'pop', {'f1': 1200, 'f2': 600}), (14 * B - .02, 'cut'), (14 * B, 'pop', {'f1': 1200, 'f2': 600}),
          (16 * B - .02, 'cut'), (16 * B, 'pop', {'f1': 1200, 'f2': 600}),
          (18 * B - .25, 'whoosh', {'d': .5}), (20 * B, 'thud'), (24 * B - .15, 'whoosh'), (25 * B, 'pop', {'f1': 800, 'f2': 300}), (26 * B, 'sparkle')]
BUMPER6 = [(0.0, 'whoosh', {'d': .4, 'peak': .2}), (B, 'wipe', SQ), (6 * B - .15, 'whoosh'),
           (7 * B, 'pop', {'f1': 800, 'f2': 300}), (8 * B, 'sparkle')]

if __name__ == '__main__':
    for name, f in FX.items(): write(f'sfx/{name}.wav', f())
    write('out/sfx-spot15.wav', track(15, SPOT15)); write('out/sfx-bumper6.wav', track(6, BUMPER6))
    print('ok')
