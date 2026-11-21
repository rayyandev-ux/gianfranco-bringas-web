(() => {
  const qs = new URLSearchParams(location.search);
  const STATIC = qs.has('static') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const html = document.documentElement;
  if (qs.has('static')) html.classList.add('static');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (...a) => { if (typeof window.fbq === 'function') window.fbq(...a); };

  /* entry: ESCUDIA + his photo while a gold ring closes, then the page rises. ~1.1 s, the page is
     usable from 0.7 s. Skipped with ?static / reduced motion / back navigation; ?t=0.4 freezes a frame. */
  if (html.classList.contains('ld')) {
    const ov = document.createElement('div');
    ov.className = 'loader'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="ld-who"><span class="ld-pic"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/></svg><img src="assets/img/gianfranco-cara.jpg" alt="" width="84" height="84"></span><b>ESCUDIA</b><small>Gianfranco Bringas · abogado</small></div>';
    document.body.appendChild(ov);
    const E = 'cubic-bezier(.2,.8,.2,1)', S = 'cubic-bezier(.65,0,.35,1)';
    const heroBits = $$('.top, .hero .pill, .hero h1, .hero .lead, .hero .vsl, .hero .offer, .hero .cta-w, main > section:not(.hero)');
    const anims = [
      $('.ld-pic', ov).animate([{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: E, fill: 'backwards' }),
      $('circle', ov).animate([{ strokeDashoffset: 302 }, { strokeDashoffset: 0 }], { duration: 620, delay: 60, easing: S, fill: 'forwards' }),
      $('b', ov).animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 360, delay: 160, easing: E, fill: 'backwards' }),
      $('small', ov).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, delay: 240, easing: E, fill: 'backwards' }),
      $('.ld-who', ov).animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 300, delay: 720, easing: E, fill: 'forwards' }),
      ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, delay: 760, easing: 'ease', fill: 'forwards' }),
      ...heroBits.map((el, i) => el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 640, delay: 760 + Math.min(i, 7) * 70, easing: E, fill: 'backwards' }))
    ];
    html.classList.remove('ld');
    const t = parseFloat(qs.get('t'));
    if (!isNaN(t)) anims.forEach(a => { a.pause(); a.currentTime = t * 1000; });
    else Promise.all(anims.map(a => a.finished)).then(() => ov.parentNode && ov.parentNode.removeChild(ov));
  }

  /* reveal on scroll */
  const rv = $$('.sec h2, .sec .k, .facts, .proof, .heard li, .checks li, .gold-line, .mcard, .notes, .sum, .guar, .steps li, .fbox, .close p, .cta-w');
  if (STATIC || !('IntersectionObserver' in window)) rv.forEach(e => e.classList.add('rv', 'in'));
  else {
    rv.forEach(e => { if (!e.closest('.hero')) e.classList.add('rv'); });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(e => io.observe(e));
  }

  /* VSL plays in place, with sound */
  const v = $('#vsl .vframe');
  $('.play', v).addEventListener('click', () => {
    const x = $('video', v);
    if (!x.src) x.src = x.dataset.src;
    x.hidden = false; x.controls = true; v.classList.add('on');
    x.play().catch(() => {});
    track('trackCustom', 'VerVSL');
  });

  /* faq tabs */
  const ftabs = $$('.ftab'), fgroups = $$('.fgroup');
  ftabs.forEach(t => t.addEventListener('click', () => {
    ftabs.forEach(x => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-selected', x === t); });
    fgroups.forEach(g => { g.hidden = g.dataset.g !== t.dataset.g; });
  }));

  /* dialogs: calendar (GoHighLevel) and testimonials (Wistia) */
  const open = d => { if (typeof d.showModal === 'function') d.showModal(); };
  $$('dialog').forEach(d => {
    d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
    d.addEventListener('close', () => { const s = $('.vslot', d); if (s) s.innerHTML = ''; });
  });
  const cal = $('#calendar');
  $$('[data-book]').forEach(b => b.addEventListener('click', () => {
    track('trackCustom', 'AbrirCalendario');
    const f = $('iframe', cal);
    if (typeof cal.showModal !== 'function') return window.open(f.dataset.src, '_blank', 'noopener');
    if (!f.src) { cal.classList.add('loading'); f.addEventListener('load', () => cal.classList.remove('loading'), { once: true }); f.src = f.dataset.src; }
    open(cal);
  }));
  const voice = $('#voice');
  let wistia = false;
  const load = (src, mod) => { const s = document.createElement('script'); s.src = src; s.async = true; if (mod) s.type = 'module'; document.head.appendChild(s); };
  $$('[data-wistia]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.wistia;
    if (!wistia) { wistia = true; load('https://fast.wistia.com/player.js'); }
    load(`https://fast.wistia.com/embed/${id}.js`, true);
    $('.vslot', voice).innerHTML = `<wistia-player media-id="${id}" aspect="0.5625" fit-strategy="cover" autoplay player-color="8c2f39"></wistia-player>`;
    open(voice);
  }));

  /* Meta Pixel: WhatsApp or phone link = Contact (same as the previous site) */
  document.addEventListener('click', e => { if (e.target.closest?.('a[href*="wa.me/"], a[href^="tel:"]')) track('track', 'Contact'); }, true);
})();
