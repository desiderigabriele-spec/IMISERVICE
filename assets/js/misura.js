/*
 * MISURAZIONE (Google Ads, Google Analytics, Microsoft Clarity) – IMI SERVICE
 * --------------------------------------------------------------
 * Consent Mode v2 "avanzato" per Google: i tag Google sono nell'<head> di ogni pagina (vedi index.html) e partono
 * con il consenso "negato", salvo una scelta già salvata. Senza consenso non usano cookie e mandano solo segnali
 * anonimi, che Google usa per stimare le conversioni.
 * Questo file aggiorna il consenso quando la persona sceglie nel banner (consenso.js):
 *   "Statistiche" → Google Analytics con cookie + Microsoft Clarity (che senza consenso NON si carica)
 *   "Marketing"   → Google Ads con cookie
 * e trasforma i clic su WhatsApp, Chiama ed Email in evento "contatto" e conversione Google Ads.
 *
 * Da configurare in config.js: adsConversione ('AW-…/…'), clarityId. Gli ID dei tag Google stanno nell'<head>.
 */
(() => {
  const CFG = window.IMI_CONFIG || {};
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  let marketing = false, statistiche = false, clarity = false;
  function caricaClarity() {
    const id = CFG.clarityId; if (!id || clarity) return; clarity = true;
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    const t = document.createElement('script'); t.async = true; t.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(id); document.head.appendChild(t);
  }
  function aggiorna(v) {
    marketing = !!(v && v.marketing); statistiche = !!(v && v.statistiche);
    const m = marketing ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: m, ad_user_data: m, ad_personalization: m, analytics_storage: statistiche ? 'granted' : 'denied' });
    if (statistiche) caricaClarity();
    if (clarity) window.clarity('consentv2', { ad_Storage: m, analytics_Storage: statistiche ? 'granted' : 'denied' });
  }
  document.addEventListener('imi-consenso', e => aggiorna(e.detail));
  if (window.IMI_CONSENSO) aggiorna(window.IMI_CONSENSO);

  // clic su WhatsApp, telefono, email: evento "contatto" e conversione Google Ads
  // (senza consenso Google li riceve come segnali senza cookie, secondo il Consent Mode)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href') || '';
    const metodo = /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(h) ? 'whatsapp' : h.startsWith('tel:') ? 'telefono' : h.startsWith('mailto:') ? 'email' : '';
    if (!metodo) return;
    gtag('event', 'contatto', { metodo });
    if (CFG.adsConversione) gtag('event', 'conversion', { send_to: CFG.adsConversione, value: 1.0, currency: 'EUR' });
  }, true);
})();
