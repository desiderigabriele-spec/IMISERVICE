/* IMI Service – interazioni del sito */
(() => {
  'use strict';

  const C = Object.assign({ intro: {}, models: {} }, window.IMI_CONFIG || {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const waLink = (text) => `https://wa.me/${C.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  /* Testi dinamici nelle due lingue del sito */
  const I18N = {
    it: {
      defaultWa: 'Buongiorno IMI Service, vorrei richiedere un sopralluogo gratuito.',
      keys: { Cliente: 'Cliente', Servizio: 'Servizio', Superficie: 'Superficie', Frequenza: 'Frequenza', Orario: 'Orario', Extra: 'Extra', Zona: 'Zona' },
      over: (n) => `oltre ${n} m²`,
      none: 'Nessuno',
      toDefine: 'Da indicare',
      configWa: (sum) => `Buongiorno IMI Service, vorrei un preventivo:\n${sum}\n\nGrazie!`,
      configMsg: (sum) => `Richiesta dal configuratore:\n${sum}\n\n`,
      labels: { nome: 'Nome', telefono: 'Telefono', email: 'Email', servizio: 'Servizio', localita: 'Località', messaggio: 'Dettagli' },
      invalid: 'Completa i campi evidenziati, per favore.',
      introQuick: 'Buongiorno IMI Service, vorrei essere ricontattato per un sopralluogo gratuito.',
      introFull: 'Buongiorno IMI Service, ecco la mia richiesta di preventivo.',
      waReady: 'WhatsApp è pronto con il messaggio compilato: premi Invia per completare.',
      sending: 'Invio in corso…',
      sent: 'Richiesta inviata. Ti ricontattiamo al più presto per fissare il sopralluogo.',
      sendFail: 'Invio non riuscito. Riprova, oppure scrivici su WhatsApp o chiamaci.',
      subject: 'Richiesta preventivo dal sito',
      mailOpened: 'Si è aperto il tuo programma email con la richiesta pronta da inviare.',
      zoneYes: (z) => `✓ Sì, operiamo in zona ${z}. `,
      zoneYesLink: 'Prenota il sopralluogo gratuito →',
      zoneMaybe: 'Fuori dalle zone abituali? Nessun problema: organizziamo trasferte su richiesta. ',
      zoneAsk: (z) => `Buongiorno IMI Service, operate anche a ${z}?`,
      zoneAskLink: 'Chiedi su WhatsApp →',
      grime: 'pulisci qui…'
    },
    ar: {
      defaultWa: 'مرحباً IMI Service، أرغب في طلب معاينة مجانية.',
      keys: { Cliente: 'العميل', Servizio: 'الخدمة', Superficie: 'المساحة', Frequenza: 'التكرار', Orario: 'التوقيت', Extra: 'إضافات', Zona: 'المنطقة' },
      over: (n) => `أكثر من ${n} م²`,
      none: 'لا يوجد',
      toDefine: 'غير محددة',
      configWa: (sum) => `مرحباً IMI Service، أرغب في الحصول على عرض سعر:\n${sum}\n\nشكراً!`,
      configMsg: (sum) => `طلب من أداة تجهيز الطلب:\n${sum}\n\n`,
      labels: { nome: 'الاسم', telefono: 'الهاتف', email: 'البريد الإلكتروني', servizio: 'الخدمة', localita: 'المنطقة', messaggio: 'التفاصيل' },
      invalid: 'يرجى إكمال الحقول المحددة.',
      introQuick: 'مرحباً IMI Service، أرغب في أن تتصلوا بي لتحديد موعد معاينة مجانية.',
      introFull: 'مرحباً IMI Service، هذا طلبي للحصول على عرض سعر.',
      waReady: 'واتساب جاهز والرسالة مكتوبة: اضغط "إرسال" لإتمام الطلب.',
      sending: 'جارٍ الإرسال…',
      sent: 'تم إرسال طلبك. سنتواصل معك في أقرب وقت لتحديد موعد المعاينة.',
      sendFail: 'تعذّر الإرسال. حاول مرة أخرى، أو راسلنا عبر واتساب أو اتصل بنا.',
      subject: 'طلب عرض سعر من الموقع',
      mailOpened: 'تم فتح برنامج البريد الإلكتروني والطلب جاهز للإرسال.',
      zoneYes: (z) => `✓ نعم، نعمل في منطقة ${z}. `,
      zoneYesLink: 'احجز المعاينة المجانية ←',
      zoneMaybe: 'خارج مناطق عملنا المعتادة؟ لا مشكلة: ننظّم تنقلات خاصة عند الطلب. ',
      zoneAsk: (z) => `مرحباً IMI Service، هل تعملون أيضاً في ${z}؟`,
      zoneAskLink: 'اسألنا عبر واتساب ←',
      grime: 'نظّفني…'
    }
  };
  const LANG = (document.documentElement.lang || 'it').slice(0, 2) === 'ar' ? 'ar' : 'it';
  const T = I18N[LANG];
  const DEFAULT_WA = T.defaultWa;
  const spray = () => window.dispatchEvent(new CustomEvent('imi:spray'));

  /* ------------------------------------------------------------------
     1. Contatti da config
     ------------------------------------------------------------------ */
  function applyConfig() {
    const tel = `tel:${C.phone}`;
    $$('[data-imi]').forEach((el) => {
      switch (el.dataset.imi) {
        case 'tel': el.href = tel; el.textContent = C.phoneDisplay; break;
        case 'tel-plain': el.href = tel; break;
        case 'tel-text': el.textContent = C.phoneDisplay; break;
        case 'wa': el.href = waLink(DEFAULT_WA); break;
        case 'mail': el.href = `mailto:${C.email}`; el.textContent = C.email; break;
        case 'mail-plain': el.href = `mailto:${C.email}`; break;
        case 'mail-text': el.textContent = C.email; break;
        case 'piva': el.textContent = C.piva; break;
      }
    });
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------
     2. Header e menu mobile
     ------------------------------------------------------------------ */
  function initHeader() {
    const header = $('.header');
    const toggle = $('.nav-toggle');
    const nav = $('#nav');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ------------------------------------------------------------------
     3. Comparsa al scroll + tilt 3D sulle card
     ------------------------------------------------------------------ */
  let revealStarted = false;
  function startReveal() {
    if (revealStarted) return;
    revealStarted = true;
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  }

  function initTilt() {
    if (!finePointer || reduced) return;
    $$('.tilt').forEach((card) => {
      let raf = 0;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateY(-4px)`;
        });
      });
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     4. Configuratore
     ------------------------------------------------------------------ */
  const config = { summaryText: '' };

  function initConfigurator() {
    const form = $('#configForm');
    if (!form) return;
    const list = $('#summaryList');
    const range = $('#c-mq');
    const out = $('#c-mq-out');
    const zona = $('#c-zona');
    const wa = $('#configWa');
    const toForm = $('#configForm2');
    let prev = {};

    const read = () => {
      const val = (name) => (form.querySelector(`input[name="${name}"]:checked`) || {}).value || '—';
      const extras = $$('input[name="c-extra"]:checked', form).map((i) => i.value);
      const mq = Number(range.value);
      return {
        Cliente: val('c-tipo'),
        Servizio: val('c-servizio'),
        Superficie: mq >= Number(range.max) ? T.over(mq) : `${mq} m²`,
        Frequenza: val('c-freq'),
        Orario: val('c-orario'),
        Extra: extras.length ? extras.join(LANG === 'ar' ? '، ' : ', ') : T.none,
        Zona: zona.value.trim() || T.toDefine
      };
    };

    const render = (animate) => {
      const data = read();
      const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
      range.style.setProperty('--p', `${pct}%`);
      out.textContent = data.Superficie;

      list.innerHTML = '';
      Object.entries(data).forEach(([k, v]) => {
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = T.keys[k] || k;
        dd.textContent = v;
        if (animate && prev[k] !== v) dd.classList.add('flash');
        row.append(dt, dd);
        list.append(row);
      });
      prev = data;

      config.data = data;
      config.summaryText = Object.entries(data).map(([k, v]) => `• ${T.keys[k] || k}: ${v}`).join('\n');
      wa.href = waLink(T.configWa(config.summaryText));
    };

    let sprayT = 0;
    form.addEventListener('input', () => {
      render(true);
      const now = Date.now();
      if (now - sprayT > 900) { sprayT = now; spray(); }
    });
    render(false);

    // "Continua con il modulo": porta il riepilogo nel form completo
    toForm.addEventListener('click', () => {
      const d = config.data;
      const full = $('#fullForm');
      const sel = $('#f-servizio', full);
      const opt = Array.from(sel.options).find((o) => o.text === d.Servizio);
      if (opt) sel.value = opt.text;
      if (d.Zona !== T.toDefine) $('#f-localita', full).value = d.Zona;
      $('#f-msg', full).value = T.configMsg(config.summaryText);
      setTimeout(() => $('#f-nome', full).focus({ preventScroll: true }), 650);
    });

    // Link "Configura" da servizi/target: preselezionano le opzioni
    $$('[data-prefill-service], [data-prefill-type]').forEach((a) => {
      a.addEventListener('click', () => {
        const s = a.dataset.prefillService;
        const t = a.dataset.prefillType;
        if (s) {
          const r = form.querySelector(`input[name="c-servizio"][value="${CSS.escape(s)}"]`);
          if (r) r.checked = true;
          const quick = $('#q-servizio');
          if (quick) quick.value = s;
        }
        if (t) {
          const r = form.querySelector(`input[name="c-tipo"][value="${CSS.escape(t)}"]`);
          if (r) r.checked = true;
        }
        render(true);
      });
    });
  }

  /* ------------------------------------------------------------------
     5. Form contatto
     ------------------------------------------------------------------ */
  const LABELS = T.labels;

  function validate(form) {
    let first = null;
    $$('[required]', form).forEach((el) => {
      let bad;
      if (el.type === 'checkbox') bad = !el.checked;
      else if (el.type === 'tel') bad = el.value.replace(/\D/g, '').length < 6;
      else bad = !el.value.trim();
      const target = el.type === 'checkbox' ? el.closest('.check') : el;
      target.classList.toggle('is-invalid', bad);
      if (bad && !first) first = el;
    });
    const email = form.querySelector('input[type="email"]');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      email.classList.add('is-invalid');
      if (!first) first = email;
    }
    return first;
  }

  function compose(form) {
    const fd = new FormData(form);
    const lines = [];
    for (const [k, v] of fd.entries()) {
      if (k === 'privacy' || !String(v).trim()) continue;
      lines.push(`${LABELS[k] || k}: ${String(v).trim()}`);
    }
    return lines.join('\n');
  }

  function setStatus(form, msg, type) {
    const st = $('.form-status', form);
    st.textContent = msg;
    st.className = `form-status${type ? ` is-${type}` : ''}`;
  }

  function initForms() {
    $$('.lead-form').forEach((form) => {
      form.addEventListener('input', (e) => {
        const t = e.target.type === 'checkbox' ? e.target.closest('.check') : e.target;
        t && t.classList.remove('is-invalid');
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const invalid = validate(form);
        if (invalid) {
          setStatus(form, T.invalid, 'error');
          invalid.focus();
          return;
        }

        let channel = e.submitter && e.submitter.dataset.channel;
        if (!channel) channel = C.formEndpoint ? 'form' : 'whatsapp';

        const body = compose(form);
        const intro = form.dataset.form === 'quick' ? T.introQuick : T.introFull;
        const text = `${intro}\n\n${body}`;

        if (channel === 'whatsapp') {
          window.open(waLink(text), '_blank', 'noopener');
          setStatus(form, T.waReady, 'ok');
          spray();
          return;
        }

        if (C.formEndpoint) {
          const btn = e.submitter;
          if (btn) btn.disabled = true;
          setStatus(form, T.sending);
          try {
            const payload = Object.fromEntries(new FormData(form).entries());
            payload._subject = `IMI Service – ${T.subject} (${LANG.toUpperCase()})`;
            payload.riepilogo = text;
            const res = await fetch(C.formEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(String(res.status));
            form.reset();
            setStatus(form, T.sent, 'ok');
            spray();
          } catch (err) {
            setStatus(form, T.sendFail, 'error');
          } finally {
            if (btn) btn.disabled = false;
          }
          return;
        }

        // Nessun endpoint configurato: apre il client email
        const subject = encodeURIComponent(T.subject);
        window.location.href = `mailto:${C.email}?subject=${subject}&body=${encodeURIComponent(text)}`;
        setStatus(form, T.mailOpened, 'ok');
      });
    });
  }

  /* ------------------------------------------------------------------
     6. Verifica zona
     ------------------------------------------------------------------ */
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f\u064b-\u065f]/g, '').replace(/[^a-z0-9\u0600-\u06ff ]/g, ' ').replace(/\s+/g, ' ').trim();

  const ZONES = [
    'milano', 'sesto san giovanni', 'sesto', 'monza',
    'ميلانو', 'مونزا', 'سيستو', 'سيستو سان جوفاني', 'سيستو سان جيوفاني',
    // Milano – quartieri
    'centro storico', 'centro', 'duomo', 'brera', 'porta nuova', 'garibaldi', 'isola', 'citta studi', 'loreto', 'nolo',
    'bicocca', 'niguarda', 'greco', 'lambrate', 'porta romana', 'navigli', 'citylife', 'city life', 'san siro', 'bovisa',
    'affori', 'bruzzano', 'comasina', 'dergano', 'maciachini', 'prato centenaro', 'precotto', 'gorla', 'turro', 'crescenzago',
    'cimiano', 'rubattino', 'ortica', 'forlanini', 'taliedo', 'corvetto', 'rogoredo', 'santa giulia', 'porta vittoria',
    'porta venezia', 'buenos aires', 'citta studi', 'lodi', 'vigentino', 'chiaravalle', 'gratosoglio', 'stadera', 'barona',
    'giambellino', 'lorenteggio', 'baggio', 'quarto cagnino', 'quinto romano', 'figino', 'gallaratese', 'qt8', 'portello',
    'fiera', 'de angeli', 'wagner', 'sempione', 'paolo sarpi', 'chinatown', 'cenisio', 'ghisolfa', 'villapizzone', 'quarto oggiaro',
    'roserio', 'certosa', 'tibaldi', 'ticinese', 'solari', 'tortona', 'magenta', 'cadorna', 'repubblica', 'centrale',
    'zara', 'stazione centrale', 'udine', 'cascina gobba', 'adriano', 'padova', 'viale monza', 'ripamonti', 'scalo romana',
    'calvairate', 'molise', 'mecenate', 'ponte lambro', 'trenno', 'lampugnano', 'musocco', 'bonola',
    // Prima cintura e Brianza vicina
    'cinisello', 'cinisello balsamo', 'cologno', 'cologno monzese', 'bresso', 'cusano', 'cusano milanino', 'brugherio',
    'vimodrone', 'segrate', 'paderno dugnano', 'cernusco', 'cernusco sul naviglio', 'cormano', 'novate milanese', 'novate',
    'bollate', 'pioltello', 'peschiera borromeo', 'san donato', 'san donato milanese', 'rozzano', 'assago', 'corsico',
    'buccinasco', 'cesano boscone', 'settimo milanese', 'pero', 'rho', 'arese', 'garbagnate', 'senago', 'nova milanese',
    'muggio', 'lissone', 'desio', 'villasanta', 'concorezzo', 'agrate', 'agrate brianza', 'carugate', 'cassina de pecchi',
    'opera', 'locate di triulzi', 'san giuliano milanese', 'trezzano sul naviglio', 'baranzate', 'vedano al lambro', 'biassono'
  ].map(norm);

  function initZoneCheck() {
    const form = $('#zoneCheck');
    if (!form) return;
    const input = $('#zone-input');
    const out = $('#zoneOut');
    const chips = $$('#zone .chip');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = norm(input.value);
      chips.forEach((c) => c.classList.remove('is-match'));
      out.className = 'zonecheck__out';
      out.textContent = '';
      if (!q) { input.focus(); return; }

      const cap = q.match(/\b(20\d{3})\b/);
      let hit = ZONES.find((z) => z.length > 3 && (q === z || q.includes(z) || (q.length >= 4 && z.startsWith(q))));
      if (!hit && cap) hit = cap[1];

      if (hit) {
        chips.forEach((c) => { if (norm(c.textContent).includes(q) || q.includes(norm(c.textContent))) c.classList.add('is-match'); });
        out.classList.add('is-yes');
        out.innerHTML = '';
        out.append(T.zoneYes(input.value.trim()));
        const a = document.createElement('a');
        a.href = '#preventivo';
        a.textContent = T.zoneYesLink;
        out.append(a);
        spray();
      } else {
        out.classList.add('is-maybe');
        out.innerHTML = '';
        out.append(T.zoneMaybe);
        const a = document.createElement('a');
        a.href = waLink(T.zoneAsk(input.value.trim()));
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = T.zoneAskLink;
        out.append(a);
      }
    });
  }

  /* ------------------------------------------------------------------
     6b. Video presentazione
     ------------------------------------------------------------------ */
  function initVideo() {
    const box = $('#videoBox');
    if (!box) return;
    const v = C.video || {};
    const frame = $('.video__frame', box);
    const play = $('.video__play', box);
    // percorsi relativi alla radice del sito (validi anche da /ar/)
    const root = (document.querySelector('script[src$="config.js"]') || {}).src || location.href;
    const fromRoot = (p) => new URL(p, new URL('../../', root)).href;

    if (v.vertical) box.classList.add('video--vertical');
    if (v.poster) $('.video__poster', box).style.backgroundImage = `url("${fromRoot(v.poster)}")`;
    const hasVideo = !!(v.youtube || v.vimeo || v.mp4);
    box.dataset.state = hasVideo ? 'ready' : 'empty';
    if (v.poster) box.classList.add('has-poster');

    play.addEventListener('click', () => {
      if (!hasVideo) {
        box.classList.remove('nudge');
        void box.offsetWidth;
        box.classList.add('nudge');
        return;
      }
      let el;
      if (v.mp4) {
        el = document.createElement('video');
        el.src = fromRoot(v.mp4);
        el.controls = true;
        el.autoplay = true;
        el.playsInline = true;
        if (v.poster) el.poster = fromRoot(v.poster);
      } else {
        el = document.createElement('iframe');
        el.src = v.youtube
          ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtube)}?autoplay=1&rel=0&modestbranding=1`
          : `https://player.vimeo.com/video/${encodeURIComponent(v.vimeo)}?autoplay=1&title=0&byline=0`;
        el.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        el.allowFullscreen = true;
        el.title = play.getAttribute('aria-label');
      }
      el.className = 'video__media';
      frame.append(el);
      box.dataset.state = 'playing';
      spray();
    });

    // Effetto 3D: il riquadro si "raddrizza" mentre entra nello schermo
    if (reduced) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = box.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
      const e = 1 - Math.pow(1 - p, 3);
      box.style.setProperty('--vx', `${(1 - e) * 22}deg`);
      box.style.setProperty('--vs', String(0.88 + e * 0.12));
      box.style.setProperty('--vy', `${(1 - e) * 60}px`);
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------
     7. INTRO – vetro sporco pulito dal tergivetro
     ------------------------------------------------------------------ */
  function finishIntro(intro) {
    document.body.classList.add('intro-done');
    window.dispatchEvent(new CustomEvent('imi:intro-done'));
    startReveal();
    if (intro) {
      intro.classList.add('is-done');
      setTimeout(() => intro.remove(), 800);
    }
  }

  function paintGrime(ctx, w, h) {
    const rnd = (a, b) => a + Math.random() * (b - a);
    ctx.clearRect(0, 0, w, h);

    // base polverosa
    ctx.fillStyle = 'rgba(221, 214, 200, 0.95)';
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(255,255,255,0.22)');
    g.addColorStop(0.5, 'rgba(190,178,155,0.10)');
    g.addColorStop(1, 'rgba(120,105,80,0.22)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // macchie
    const area = w * h;
    for (let i = 0; i < Math.round(area / 22000); i++) {
      const x = rnd(0, w), y = rnd(0, h), r = rnd(30, 220);
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      const a = rnd(0.04, 0.14);
      rg.addColorStop(0, `rgba(105, 90, 64, ${a})`);
      rg.addColorStop(1, 'rgba(105, 90, 64, 0)');
      ctx.fillStyle = rg;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // aloni circolari (passate di straccio)
    ctx.lineCap = 'round';
    for (let i = 0; i < Math.round(area / 90000) + 6; i++) {
      ctx.strokeStyle = `rgba(255,255,255,${rnd(0.05, 0.13)})`;
      ctx.lineWidth = rnd(18, 60);
      ctx.beginPath();
      const a0 = rnd(0, Math.PI * 2);
      ctx.arc(rnd(0, w), rnd(0, h), rnd(60, 240), a0, a0 + rnd(1.2, 3.6));
      ctx.stroke();
    }

    // grana fine
    const n = document.createElement('canvas');
    n.width = n.height = 140;
    const nctx = n.getContext('2d');
    const img = nctx.createImageData(140, 140);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 90;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = Math.random() * 34;
    }
    nctx.putImageData(img, 0, 0);
    ctx.fillStyle = ctx.createPattern(n, 'repeat');
    ctx.fillRect(0, 0, w, h);

    // gocce d'acqua
    for (let i = 0; i < Math.round(area / 5200); i++) {
      const x = rnd(0, w), y = rnd(0, h), r = Math.random() < 0.85 ? rnd(1, 3) : rnd(3, 7);
      ctx.fillStyle = 'rgba(80, 70, 52, 0.20)';
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.35, 0, Math.PI * 2); ctx.fill();
    }

    // scritta nella polvere
    ctx.save();
    ctx.font = `800 ${Math.round(Math.min(w, h) * 0.05)}px ${LANG === 'ar' ? 'Cairo' : 'Manrope'}, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.translate(w * 0.5, h * 0.22);
    ctx.rotate(-0.04);
    ctx.fillText(T.grime, 0, 0);
    ctx.restore();
  }

  // Tergivetro di riserva in SVG (se WebGL non è disponibile)
  function domSqueegee(container) {
    const el = document.createElement('div');
    el.className = 'intro__tool';
    el.innerHTML = `<svg viewBox="0 0 150 400" width="150" height="400" aria-hidden="true">
      <rect x="0" y="0" width="9" height="400" rx="3" fill="#111418"/>
      <rect x="8" y="2" width="16" height="396" rx="4" fill="#ffd23c"/>
      <rect x="20" y="180" width="26" height="40" rx="8" fill="#0e1a2b"/>
      <g transform="rotate(22 40 200)"><rect x="40" y="186" width="110" height="28" rx="14" fill="#f6f3ec"/>
      <rect x="128" y="186" width="22" height="28" rx="11" fill="#0e1a2b"/></g></svg>`;
    el.style.opacity = '0';
    container.append(el);
    const svg = el.firstElementChild;
    return {
      show() { el.style.opacity = '1'; },
      hide() { el.style.opacity = '0'; },
      set(x, y, angle, len, dir) {
        const s = len / 400;
        svg.style.transform = dir < 0 ? 'scaleX(-1)' : '';
        svg.style.transformOrigin = '4.5px 200px';
        el.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad) scale(${s}) translate(-4.5px, -200px)`;
      }
    };
  }

  function waitFor3D(timeout) {
    return new Promise((resolve) => {
      if (window.IMI3D && window.IMI3D.squeegee) return resolve(window.IMI3D);
      const t = setTimeout(() => resolve(null), timeout);
      window.addEventListener('imi3d:ready', () => { clearTimeout(t); resolve(window.IMI3D || null); }, { once: true });
      window.addEventListener('imi3d:failed', () => { clearTimeout(t); resolve(null); }, { once: true });
    });
  }

  async function runIntro() {
    const intro = $('#intro');
    if (!intro) return finishIntro(null);
    if (reduced || C.intro.enabled === false) {
      intro.remove();
      return finishIntro(null);
    }

    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      if (tool) tool.hide();
      finishIntro(intro);
    };
    let tool = null;

    try {
      document.documentElement.style.overflow = 'hidden';
      const canvas = $('#grime');
      const ctx = canvas.getContext('2d');
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.scale(dpr, dpr);
      paintGrime(ctx, w, h);
      intro.style.background = 'transparent';
      startReveal(); // l'hero compare sotto lo sporco, così il tergivetro lo "scopre"

      const pctEl = $('#introPct');
      const ring = $('#introRing');
      const RING = 276.5;
      $('#introSkip').addEventListener('click', done);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') done(); }, { once: true });

      const hasModel = !!(C.models && C.models.squeegee && C.models.squeegee.url);
      const api = await waitFor3D(hasModel ? 2600 : 1100);
      tool = api ? api.squeegee : domSqueegee(intro);

      // Percorso a serpentina: 3 passate orizzontali
      const rows = h > w * 1.4 ? 4 : 3;
      const band = h / rows;
      const L = band * 1.3;
      const margin = L * 0.3;
      const total = Math.max(1200, Number(C.intro.durationMs) || 2300);
      const per = total / rows;
      const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;

      let prev = null;
      let lastRow = -1;
      let elapsed = 0;
      let last = null;
      tool.show();

      const clearQuad = (a, b) => {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(a.tx, a.ty); ctx.lineTo(b.tx, b.ty);
        ctx.lineTo(b.bx, b.by); ctx.lineTo(a.bx, a.by);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const frame = (now) => {
        if (finished) return;
        // passo massimo per frame: eventuali blocchi del browser non fanno "saltare" la pulizia
        elapsed += last === null ? 0 : Math.min(now - last, 34);
        last = now;
        const el = elapsed;
        const p = Math.min(1, el / total);
        const row = Math.min(rows - 1, Math.floor(el / per));
        const rp = ease(Math.min(1, (el - row * per) / per));
        const dir = row % 2 === 0 ? 1 : -1;
        const xs = dir > 0 ? -margin : w + margin;
        const xe = dir > 0 ? w + margin : -margin;
        const x = xs + (xe - xs) * rp;
        const y = (row + 0.5) * band + Math.sin(rp * Math.PI * 2) * band * 0.05;
        const angle = dir * 0.12;
        const sx = Math.sin(angle) * L / 2;
        const cy = Math.cos(angle) * L / 2;
        const cur = { tx: x + sx, ty: y - cy, bx: x - sx, by: y + cy };

        if (row !== lastRow) { prev = null; lastRow = row; }
        if (prev) clearQuad(prev, cur);
        prev = cur;

        tool.set(x, y, angle, L, dir);

        const pct = Math.round(p * 100);
        pctEl.textContent = pct;
        ring.style.strokeDashoffset = String(RING * (1 - p));

        if (p >= 1) {
          ctx.clearRect(0, 0, w, h);
          setTimeout(done, 180);
          return;
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);

      // rete di sicurezza
      setTimeout(done, total + 4000);
    } catch (err) {
      console.warn('[IMI] intro non disponibile:', err);
      done();
    } finally {
      const restore = () => { document.documentElement.style.overflow = ''; };
      window.addEventListener('imi:intro-done', restore, { once: true });
    }
  }

  /* ------------------------------------------------------------------
     Avvio
     ------------------------------------------------------------------ */
  applyConfig();
  initHeader();
  initTilt();
  initConfigurator();
  initForms();
  initZoneCheck();
  initVideo();
  runIntro();
})();
