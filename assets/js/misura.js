/*
 * MISURAZIONE ANNUNCI (Google Ads) – IMI SERVICE
 * --------------------------------------------------------------
 * Consent Mode v2 in modalità "base": finché la persona non accetta la categoria "Marketing" nel banner
 * (consenso.js), il tag Google NON viene scaricato e non parte nessuna richiesta verso Google.
 * Con il consenso: si scarica il tag, il consenso viene aggiornato a "granted" e i clic su WhatsApp,
 * Chiama ed Email diventano conversioni.
 *
 * Da configurare in config.js:
 *   googleTag:  ID del tag Google (es. 'GTM-NGMGNLPK')
 *   adsConversione: 'AW-123456789/AbCdEfGh' (snippet evento della conversione "Contatti" in Google Ads).
 *                   Finché è vuoto, i clic vengono comunque inviati come evento "contatto".
 */
(() => {
  const CFG = window.IMI_CONFIG || {};
  const ID = CFG.googleTag;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // tutto negato finché non c'è una scelta
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  gtag('set', 'ads_data_redaction', true);

  let caricato = false, marketing = false;
  function aggiorna(v) {
    marketing = !!(v && v.marketing);
    const s = marketing ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: s, ad_user_data: s, ad_personalization: s, analytics_storage: v && v.statistiche ? 'granted' : 'denied' });
    if (marketing && ID && !caricato) {
      caricato = true;
      const t = document.createElement('script'); t.async = true; t.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(ID);
      document.head.appendChild(t);
      gtag('js', new Date());
    }
  }
  document.addEventListener('imi-consenso', e => aggiorna(e.detail));
  if (window.IMI_CONSENSO) aggiorna(window.IMI_CONSENSO);

  // conversioni: clic su WhatsApp, telefono, email (solo con consenso marketing)
  document.addEventListener('click', e => {
    if (!marketing) return;
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href') || '';
    const metodo = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h) ? 'whatsapp' : h.startsWith('tel:') ? 'telefono' : h.startsWith('mailto:') ? 'email' : '';
    if (!metodo) return;
    gtag('event', 'contatto', { metodo });
    if (CFG.adsConversione) gtag('event', 'conversion', { send_to: CFG.adsConversione });
  }, true);
})();
