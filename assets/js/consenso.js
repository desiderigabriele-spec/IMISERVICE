/*
 * CONSENSO COOKIE IMI SERVICE
 * --------------------------------------------------------------
 * Banner piccolo in basso: "Rifiuta" e "Accetta" con lo stesso peso, "Personalizza" per scegliere per categoria.
 * La scelta resta salvata nel browser per 6 mesi (poi il banner si ripresenta), e si cambia dal link "Preferenze cookie".
 *
 * Oggi il sito non usa cookie. Se in futuro si aggiungono statistiche o pubblicità, i loro script vanno scritti così,
 * e partono SOLO dopo il consenso alla categoria:
 *   <script type="text/plain" data-consenso="statistiche" src="https://..."></script>
 *   <script type="text/plain" data-consenso="marketing"> ...codice... </script>
 * (e vanno descritti nella cookie policy, cookie.html)
 */
(() => {
  const KEY = 'imi-consenso', VER = 1, DURATA = 180 * 864e5;
  const CAT = [
    { k: 'necessari', t: 'Necessari', d: 'Servono a far funzionare il sito e a ricordare questa scelta. Sempre attivi.', fisso: true },
    { k: 'statistiche', t: 'Statistiche', d: 'Ci dicono, in forma aggregata, quante persone visitano il sito e quali pagine leggono.' },
    { k: 'marketing', t: 'Marketing', d: 'Servono a misurare le nostre pubblicità e a mostrarti annunci pertinenti su altri siti.' }
  ];
  const leggi = () => { try { const v = JSON.parse(localStorage.getItem(KEY)); return v && v.v === VER && Date.now() - v.data < DURATA ? v : null; } catch (e) { return null; } };
  const salva = c => { const v = { v: VER, data: Date.now(), statistiche: !!c.statistiche, marketing: !!c.marketing }; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} return v; };

  // attiva gli script in attesa per le categorie accettate
  function applica(v) {
    document.querySelectorAll('script[type="text/plain"][data-consenso]').forEach(s => {
      if (!v[s.dataset.consenso] || s.dataset.attivo) return;
      const n = document.createElement('script'); for (const a of s.attributes) if (a.name !== 'type' && a.name !== 'data-consenso') n.setAttribute(a.name, a.value);
      n.text = s.text; s.dataset.attivo = '1'; s.after(n);
    });
    window.IMI_CONSENSO = v; document.dispatchEvent(new CustomEvent('imi-consenso', { detail: v }));
  }

  const css = `
#ck { position: fixed; z-index: 60; left: 12px; right: 12px; bottom: calc(var(--ck-b, 12px) + env(safe-area-inset-bottom, 0px)); max-width: 400px; margin-inline: auto;
  background: #FFFDF8; color: #0E1A2B; border: 1px solid #E3DCCD; border-radius: 18px; box-shadow: 0 14px 40px rgba(14, 26, 43, .22); padding: 14px 14px 12px;
  font: 500 14px/1.45 "Manrope", system-ui, -apple-system, "Segoe UI", sans-serif; transform: translateY(16px); opacity: 0; transition: transform .35s ease, opacity .35s ease; }
#ck.on { transform: none; opacity: 1; }
@media (min-width: 768px) { #ck { left: 20px; right: auto; margin: 0; width: 380px; } }
#ck p { margin: 0 34px 10px 0; }
#ck a { color: #0E1A2B; font-weight: 700; }
#ck .x { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; border: 0; border-radius: 50%; background: transparent; color: #5B6474; font-size: 20px; line-height: 1; cursor: pointer; }
#ck .b { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
#ck .b button { font-family: inherit; font-weight: 800; font-size: 14px; line-height: 1; padding: 12px 10px; border-radius: 999px; cursor: pointer; border: 2px solid #0E1A2B; background: #fff; color: #0E1A2B; }
#ck .b button.ok { background: #0E1A2B; color: #fff; }
#ck .pers { display: block; margin: 9px auto 0; border: 0; background: none; font-family: inherit; font-weight: 700; font-size: 13px; line-height: 1; color: #5B6474; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; padding: 4px; }
#ck .cats { display: none; margin: 0 0 10px; border-top: 1px solid #E3DCCD; }
#ck.det .cats { display: block; }
#ck.det .pers { display: none; }
#ck label { display: grid; grid-template-columns: 1fr auto; gap: 2px 12px; padding: 9px 0; border-bottom: 1px solid #E3DCCD; cursor: pointer; }
#ck label b { font-weight: 800; }
#ck label small { grid-column: 1; color: #5B6474; font-size: 12.5px; line-height: 1.4; }
#ck input { grid-row: 1 / span 2; grid-column: 2; align-self: center; width: 40px; height: 22px; appearance: none; -webkit-appearance: none; border-radius: 99px; background: #D5CDBD; position: relative; cursor: pointer; transition: background .2s; margin: 0; }
#ck input::after { content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .2s; }
#ck input:checked { background: #168F48; }
#ck input:checked::after { transform: translateX(18px); }
#ck input:disabled { opacity: .55; cursor: default; }
#ck input:focus-visible, #ck button:focus-visible { outline: 3px solid #FFD23C; outline-offset: 2px; }
#ck .nota { font-size: 12.5px; color: #5B6474; margin: 8px 0 0; }
@media (prefers-reduced-motion: reduce) { #ck { transition: none; } }`;

  let box = null;
  function chiudi(v) { applica(v); if (!box) return; const b = box; b.classList.remove('on'); setTimeout(() => b.remove(), 350); box = null; }
  function apri(dettaglio) {
    if (box) { if (dettaglio) box.classList.add('det'); return; }
    if (!document.getElementById('ck-css')) { const st = document.createElement('style'); st.id = 'ck-css'; st.textContent = css; document.head.appendChild(st); }
    const v = leggi() || {};
    box = document.createElement('div'); box.id = 'ck'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Preferenze cookie');
    box.innerHTML = `<button class="x" type="button" aria-label="Chiudi e rifiuta">×</button>
      <p>Usiamo solo strumenti tecnici necessari. Statistiche e pubblicità restano spente finché non le accetti. <a href="/cookie">Cookie policy</a></p>
      <div class="cats">${CAT.map(c => `<label><b>${c.t}</b><small>${c.d}</small><input type="checkbox" data-k="${c.k}" ${c.fisso || v[c.k] ? 'checked' : ''} ${c.fisso ? 'disabled' : ''}></label>`).join('')}
        <p class="nota">Al momento il sito non usa strumenti di statistica o pubblicità.</p></div>
      <div class="b"><button type="button" class="no">Rifiuta</button><button type="button" class="ok">Accetta</button></div>
      <button type="button" class="pers">Personalizza</button>`;
    if (dettaglio) box.classList.add('det');
    const sceltaCat = () => { const c = {}; box.querySelectorAll('input[data-k]').forEach(i => c[i.dataset.k] = i.checked); return c; };
    box.querySelector('.x').onclick = box.querySelector('.no').onclick = () => chiudi(salva({}));
    box.querySelector('.ok').onclick = () => chiudi(salva(box.classList.contains('det') ? sceltaCat() : { statistiche: true, marketing: true }));
    box.querySelector('.pers').onclick = () => { box.classList.add('det'); box.querySelector('.ok').textContent = 'Salva scelte'; };
    if (dettaglio) box.querySelector('.ok').textContent = 'Salva scelte';
    document.body.appendChild(box); posiziona();
    requestAnimationFrame(() => requestAnimationFrame(() => box && box.classList.add('on')));
  }
  // su telefono resta sopra la barra Chiama / WhatsApp / Email
  function posiziona() {
    if (!box) return; const m = document.querySelector('.mbar');
    const h = m && getComputedStyle(m).display !== 'none' ? innerHeight - m.getBoundingClientRect().top : 0;
    box.style.setProperty('--ck-b', (h ? h + 10 : 12) + 'px');
  }
  addEventListener('resize', posiziona);

  window.IMIConsenso = { apri: () => apri(true), stato: () => leggi() };
  document.addEventListener('click', e => { const a = e.target.closest('[data-cookie-pref]'); if (a) { e.preventDefault(); apri(true); } });

  const v = leggi();
  if (v) { applica(v); return; }
  // sulla home aspetta che finisca l'apertura con il tergivetro
  const pronto = () => !document.getElementById('veil') && !document.body.classList.contains('locked');
  const via = () => setTimeout(() => apri(false), 600);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attendi); else attendi();
  function attendi() { if (pronto()) return via(); const t = setInterval(() => { if (pronto()) { clearInterval(t); via(); } }, 250); }
})();
