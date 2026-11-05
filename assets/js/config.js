/*
 * CONFIGURAZIONE IMI SERVICE
 * --------------------------------------------------------------
 * Modifica SOLO questo file per aggiornare contatti, invio form e modelli 3D.
 * I valori qui sotto sostituiscono automaticamente quelli presenti nell'HTML.
 * (Ricorda di aggiornare anche telefono/email nel blocco JSON-LD di index.html, per Google.)
 */
window.IMI_CONFIG = {
  // Numero mostrato a video
  phoneDisplay: '+39 000 000 0000',
  // Numero per i link "tel:" (formato internazionale, senza spazi)
  phone: '+390000000000',
  // Numero WhatsApp (solo cifre, con prefisso 39, senza + e senza spazi)
  whatsapp: '390000000000',
  email: 'info@imiservice.it',
  piva: '00000000000',

  // Endpoint per ricevere i form via email senza server (es. Formspree o Web3Forms).
  // Esempio: 'https://formspree.io/f/abcdwxyz'
  // Se vuoto: "Invia richiesta" apre il client email, "WhatsApp" apre la chat precompilata.
  formEndpoint: '',

  // Animazione di ingresso (tergivetro che pulisce lo schermo)
  intro: {
    enabled: true,
    durationMs: 2300
  },

  // Video di presentazione. Compila UNO dei tre campi:
  //   youtube: ID del video YouTube (es. per https://youtu.be/AbCdEf12345 -> 'AbCdEf12345')
  //   vimeo:   ID numerico del video Vimeo (es. '123456789')
  //   mp4:     file caricato nel sito (es. 'assets/video/presentazione.mp4')
  // poster: immagine di copertina opzionale (es. 'assets/video/copertina.jpg')
  // vertical: true se il video è girato in verticale (formato telefono 9:16)
  video: {
    youtube: '',
    vimeo: '',
    mp4: '',
    poster: '',
    vertical: false
  },

  // Modelli 3D personalizzati (.glb / .gltf). Se null viene usato il modello 3D generato dal codice.
  // Esempio:
  //   squeegee: { url: 'assets/models/tergivetro.glb', rotation: [0, 0, 0] },
  //   bottle:   { url: 'assets/models/spruzzino.glb',  rotation: [0, 0, 0] }
  // rotation è in gradi [x, y, z]: serve a raddrizzare il modello se arriva ruotato.
  models: {
    squeegee: null,
    bottle: null
  }
};
