/*
 * MISURAZIONE (Google Ads, Google Analytics, Microsoft Clarity) – IMI SERVICE
 * --------------------------------------------------------------
 * Consent Mode v2 in modalità "base": ogni tag Google viene scaricato SOLO dopo il consenso alla sua categoria
 * nel banner (consenso.js): Google Analytics e Microsoft Clarity con "Statistiche", Google Ads con "Marketing".
 * Senza consenso non parte nessuna richiesta verso Google o Microsoft.
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
  const ID = CFG.googleTag, GA = CFG.analyticsTag;
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // tutto negato finché non c'è una scelta
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  gtag('set', 'ads_data_redaction', true);

  const caricati = {};
  const carica = id => { if (!id || caricati[id]) return; caricati[id] = 1; const t = document.createElement('script'); t.async = true; t.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id); document.head.appendChild(t); };
  let marketing = false, statistiche = false, js = false;
  let clarity = false;
  function caricaClarity() {
    const id = CFG.clarityId; if (!id || clarity) return; clarity = true;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    const t = document.createElement('script'); t.async = true; t.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(id); document.head.appendChild(t);
  }
  function aggiorna(v) {
    marketing = !!(v && v.marketing); statistiche = !!(v && v.statistiche);
    const m = marketing ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: m, ad_user_data: m, ad_personalization: m, analytics_storage: statistiche ? 'granted' : 'denied' });
    if ((marketing && ID) || (statistiche && GA)) { if (!js) { js = true; gtag('js', new Date()); } }
    if (marketing) carica(ID);
    if (statistiche) { carica(GA); caricaClarity(); }
    if (clarity) window.clarity('consentv2', { ad_Storage: marketing ? 'granted' : 'denied', analytics_Storage: statistiche ? 'granted' : 'denied' });
  }
  document.addEventListener('imi-consenso', e => aggiorna(e.detail));
  if (window.IMI_CONSENSO) aggiorna(window.IMI_CONSENSO);

  // clic su WhatsApp, telefono, email: evento "contatto" (con un consenso), conversione Ads (solo con Marketing)
  document.addEventListener('click', e => {
    if (!marketing && !statistiche) return;
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href') || '';
    const metodo = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h) ? 'whatsapp' : h.startsWith('tel:') ? 'telefono' : h.startsWith('mailto:') ? 'email' : '';
    if (!metodo) return;
    gtag('event', 'contatto', { metodo });
    if (marketing && CFG.adsConversione) gtag('event', 'conversion', { send_to: CFG.adsConversione, value: 1.0, currency: 'EUR' });
  }, true);
})();
