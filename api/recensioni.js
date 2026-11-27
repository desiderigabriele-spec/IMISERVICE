// Recensioni Google di IMI Service, lette dalla Places API (New) di Google lato server.
// Il browser del visitatore chiama solo /api/recensioni sul nostro dominio, mai Google.
// Variabili d'ambiente su Vercel: GOOGLE_PLACES_KEY (chiave API), GOOGLE_PLACE_ID (ID del luogo della scheda).
// Risposta in cache sulla CDN di Vercel per 6 ore: una nuova recensione compare entro poche ore.
// Google restituisce al massimo 5 recensioni ("le più pertinenti"), più voto medio e numero totale.

const REVIEW_URL = 'https://g.page/r/CQdiDPs7QafsEBM/review';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const key = process.env.GOOGLE_PLACES_KEY, id = process.env.GOOGLE_PLACE_ID;
  const vuoto = { ok: false, voto: null, totale: 0, mapsUri: null, scrivi: REVIEW_URL, recensioni: [] };
  if (!key || !id) {
    res.setHeader('Cache-Control', 'public, s-maxage=600');
    return res.status(200).send(JSON.stringify(vuoto));
  }
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=it`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews' }
    });
    if (!r.ok) throw new Error('Places API ' + r.status);
    const p = await r.json();
    const recensioni = (p.reviews || []).map(v => ({
      autore: (v.authorAttribution && v.authorAttribution.displayName) || 'Utente Google',
      profilo: (v.authorAttribution && v.authorAttribution.uri) || null,
      voto: v.rating || 0,
      testo: ((v.originalText && v.originalText.text) || (v.text && v.text.text) || '').trim(),
      quando: v.relativePublishTimeDescription || '',
      data: v.publishTime || null,
      link: v.googleMapsUri || null
    }));
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400');
    return res.status(200).send(JSON.stringify({
      ok: true, voto: p.rating || null, totale: p.userRatingCount || 0,
      mapsUri: p.googleMapsUri || null, scrivi: REVIEW_URL, recensioni
    }));
  } catch (e) {
    console.error(e);
    res.setHeader('Cache-Control', 'public, s-maxage=600');
    return res.status(200).send(JSON.stringify(vuoto));
  }
};
