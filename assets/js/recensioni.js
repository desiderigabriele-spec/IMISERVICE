/*
 * RECENSIONI GOOGLE – IMI SERVICE
 * Legge /api/recensioni (recensioni vere della scheda Google, aggiornate in automatico) e le mostra.
 * Finché non ci sono recensioni, la sezione resta nascosta.
 */
(() => {
  const sec = document.getElementById('recensioni'); if (!sec) return;
  const head = document.getElementById('rvHead'), list = document.getElementById('rvList');
  const all = document.getElementById('rvAll'), write = document.getElementById('rvWrite');
  const stelle = n => { const s = document.createElement('span'); s.className = 'rv-stars'; s.setAttribute('aria-label', n + ' stelle su 5'); s.textContent = '★★★★★'.slice(0, Math.round(n)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(n)); return s; };
  const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };

  fetch('/api/recensioni', { headers: { accept: 'application/json' } })
    .then(r => r.ok ? r.json() : null)
    .then(d => {
      if (!d || !d.ok || !d.totale || !d.recensioni || !d.recensioni.length) return;
      // intestazione: voto medio e numero di recensioni
      const voto = Number(d.voto || 0);
      const g = el('div', 'rv-g'); g.innerHTML = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.1z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.6-3.9-12.3-9.1H4.4v5.7C8 41.1 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.7 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.4C2.9 17.1 2 20.5 2 24s.9 6.9 2.4 9.9l7.3-5.7z"/><path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.4 2 8 6.9 4.4 14.1l7.3 5.7c1.7-5.2 6.6-9.1 12.3-9.1z"/></svg>';
      const box = el('div', 'rv-score');
      box.append(el('b', 'rv-num', voto.toFixed(1).replace('.', ',')), stelle(voto), el('span', 'rv-count', 'Voto medio su Google'));
      head.replaceChildren(g, box);
      // schede delle recensioni, testo originale senza modifiche
      list.replaceChildren(...d.recensioni.map(v => {
        const c = el('article', 'rv-card');
        const top = el('div', 'rv-top');
        const av = el('span', 'rv-av', (v.autore || '?').trim().charAt(0).toUpperCase());
        const who = el('div', 'rv-who');
        const name = v.profilo ? Object.assign(el('a', 'rv-name', v.autore), { href: v.profilo, target: '_blank', rel: 'noopener' }) : el('span', 'rv-name', v.autore);
        who.append(name, el('span', 'rv-when', v.quando));
        top.append(av, who);
        c.append(top, stelle(v.voto));
        if (v.testo) {
          const p = el('p', 'rv-text', v.testo); c.append(p);
          requestAnimationFrame(() => { if (p.scrollHeight > p.clientHeight + 4) { const b = el('button', 'rv-more', 'Leggi tutto'); b.type = 'button'; b.onclick = () => { p.classList.add('open'); b.remove(); }; c.append(b); } });
        }
        return c;
      }));
      if (d.mapsUri) all.href = d.mapsUri; else all.remove();
      if (d.scrivi) write.href = d.scrivi;
      sec.hidden = false;
    })
    .catch(() => {});
})();
