(() => {
  const qs = new URLSearchParams(location.search);
  const STATIC = qs.has('static') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (qs.has('static')) document.documentElement.classList.add('static');
  const DRY = qs.has('dry');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const track = (...a) => { if (typeof window.fbq === 'function') window.fbq(...a); };
  const WA = '51992878215';

  /* entry: you open his chat. His photo appears in the middle while a gold ring closes around it, then it
     flies in an arc to its place in the chat bar and the conversation starts. ~1.3 s, never blocks:
     the page is usable from 0.76 s. Skipped with ?static / reduced motion; ?t=0.4 freezes a frame. */
  let LOADER = 0;
  const html = document.documentElement;
  if (html.classList.contains('ld')) {
    LOADER = 1000;
    const ov = document.createElement('div');
    ov.className = 'loader'; ov.setAttribute('aria-hidden', 'true');
    ov.innerHTML = '<div class="ld-who"><span class="ld-pic"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/></svg><img src="assets/img/gianfranco-cara.jpg" alt="" width="84" height="84"></span><b>Gianfranco Bringas</b><small>Abogado · litigio y protección patrimonial</small></div>';
    document.body.appendChild(ov);
    const pic = $('.ld-pic', ov), ring = $('circle', ov), name = $('b', ov), sub = $('small', ov);
    const dest = $('.bar .pic img');
    const from = pic.getBoundingClientRect(), to = dest.getBoundingClientRect();
    const dx = to.left + to.width / 2 - (from.left + from.width / 2), dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const s = to.width / from.width;
    const EASE = 'cubic-bezier(.2,.8,.2,1)', SOFT = 'cubic-bezier(.65,0,.35,1)';
    const page = $$('.bar, main, .legal');
    const anims = [
      pic.animate([{ opacity: 0, transform: 'scale(.86)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 380, easing: EASE, fill: 'backwards' }),
      ring.animate([{ strokeDashoffset: 302, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: .75 }, { strokeDashoffset: 0, opacity: 0 }], { duration: 920, delay: 60, easing: SOFT, fill: 'both' }),
      name.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none', offset: .5 }, { opacity: 1, offset: .82 }, { opacity: 0 }], { duration: 760, delay: 140, easing: EASE, fill: 'both' }),
      sub.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none', offset: .55 }, { opacity: 1, offset: .82 }, { opacity: 0 }], { duration: 680, delay: 220, easing: EASE, fill: 'both' }),
      /* the arc: up and over, then down into the bar, and it hands over to the real photo */
      pic.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * .42}px,${dy * .62 - 26}px) scale(${(1 + s) / 2})`, opacity: 1, offset: .55 },
        { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 1, offset: .96 },
        { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0 }
      ], { duration: 600, delay: 720, easing: SOFT, fill: 'forwards' }),
      ov.animate([{ backgroundColor: 'rgba(246,242,234,1)' }, { backgroundColor: 'rgba(246,242,234,0)' }], { duration: 420, delay: 760, easing: 'ease', fill: 'both' }),
      ...page.map(el => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 760, easing: 'ease', fill: 'backwards' })),
      dest.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 40, delay: 1280, fill: 'backwards' })
    ];
    html.classList.remove('ld');
    setTimeout(() => { ov.style.pointerEvents = 'none'; }, 760);
    const t = parseFloat(qs.get('t'));
    if (!isNaN(t)) anims.forEach(a => { a.pause(); a.currentTime = t * 1000; });
    else Promise.all(anims.map(a => a.finished)).then(() => ov.parentNode && ov.parentNode.removeChild(ov));
  }

  /* messages pop in like a chat: the first four on load (they're "typing" at you), the rest as you scroll */
  const msgs = $$('.msg');
  const st = $('#st'), bar = $('.bar');

  /* honest status from his real hours (8 a. m.–10 p. m., Lima), never a fake "en línea" */
  const status = () => {
    const h = +new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour: 'numeric', hour12: false }) % 24;
    const open = h >= 8 && h < 22;
    bar.classList.toggle('open', open);
    return open ? '<span class="l">responde hoy hasta las 10 p. m.</span><span class="s">responde hasta 10 p. m.</span>'
                : '<span class="l">responde desde las 8 a. m.</span><span class="s">responde desde 8 a. m.</span>';
  };
  if (st) st.innerHTML = status();
  if (STATIC || !('IntersectionObserver' in window)) msgs.forEach(m => m.classList.add('in'));
  else {
    const intro = $$('.msg.intro');
    intro.forEach((m, i) => setTimeout(() => m.classList.add('in'), LOADER + 250 + i * 280));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting || e.target.classList.contains('intro')) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    }), { rootMargin: '0px 0px -6% 0px' });
    msgs.filter(m => !m.classList.contains('intro')).forEach(m => io.observe(m));
  }

  /* VSL plays inside its bubble, with sound */
  const v = $('#vsl');
  $('.p', v).addEventListener('click', () => {
    const x = $('video', v);
    if (!x.src) x.src = x.dataset.src;
    x.hidden = false; x.controls = true; v.classList.add('on');
    x.play().catch(() => {});
    track('trackCustom', 'VerVSL');
  });
  /* header video icon: go to the VSL bubble and play it */
  $$('[data-play-vsl]').forEach(b => b.addEventListener('click', () => {
    v.scrollIntoView({ behavior: STATIC ? 'auto' : 'smooth', block: 'center' });
    $('.p', v).click();
  }));

  /* polls */
  const sigs = $$('.opt[data-sig]'), moms = $$('.opt[data-mom]'), lights = $$('.poll-foot .lights i'), nSig = $('#nSig'), chips = $('#chips');
  const refresh = () => {
    const on = sigs.filter(b => b.getAttribute('aria-pressed') === 'true');
    lights.forEach((l, i) => l.classList.toggle('on', i < on.length));
    nSig.textContent = on.length;
    const mom = moms.find(b => b.getAttribute('aria-checked') === 'true');
    chips.innerHTML = (mom ? `<span>${mom.dataset.mom}</span>` : '') + (on.length ? `<span>${on.length} de 6 tácticas</span>` : '');
  };
  sigs.forEach(b => b.addEventListener('click', () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); refresh(); }));
  moms.forEach(b => b.addEventListener('click', () => { moms.forEach(x => x.setAttribute('aria-checked', x === b)); refresh(); }));

  /* compose box = footer; appears once the conversation starts */
  const compose = $('#compose');
  if (STATIC) compose.classList.add('on'); else setTimeout(() => compose.classList.add('on'), 1500);

  /* send to his WhatsApp */
  $$('[data-ask]').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const caso = (f.caso.value || '').trim();
    const mom = moms.find(b => b.getAttribute('aria-checked') === 'true')?.dataset.mom;
    const marked = sigs.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.sig);
    let txt = 'Hola, quiero saber qué hacer en mi caso.';
    if (mom) txt += `\nMomento: ${mom}.`;
    if (marked.length) txt += `\nTácticas que reconozco (${marked.length} de 6):\n` + marked.map(m => `● ${m}`).join('\n');
    if (caso) txt += `\nLo que pasó: ${caso}`;
    const url = `https://wa.me/${WA}?text=${encodeURIComponent(txt)}`;
    track('track', 'Contact');
    if (st) { st.textContent = 'abriendo WhatsApp…'; st.classList.add('typing-now'); setTimeout(() => { st.innerHTML = status(); st.classList.remove('typing-now'); }, 2500); }
    if (DRY) { console.log('[dry] WhatsApp →', url); window.__lastWa = url; return; }
    window.open(url, '_blank', 'noopener');
  }));

  /* faq tabs */
  const ftabs = $$('.ftab'), fgroups = $$('.fgroup');
  ftabs.forEach(t => t.addEventListener('click', () => {
    ftabs.forEach(x => { x.classList.toggle('is-on', x === t); x.setAttribute('aria-selected', x === t); });
    fgroups.forEach(g => { g.hidden = g.dataset.g !== t.dataset.g; });
  }));

  /* dialogs */
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
    $('.vslot', voice).innerHTML = `<wistia-player media-id="${id}" aspect="0.5625" fit-strategy="cover" autoplay player-color="0b1424"></wistia-player>`;
    open(voice);
  }));

  /* sections: ⋮ menu + inline links. Jump, then light up the message you landed on */
  const menu = $('#menu'), more = $('.more');
  const closeMenu = () => { if (!menu.hidden) { menu.hidden = true; more.setAttribute('aria-expanded', 'false'); } };
  more?.addEventListener('click', e => {
    e.stopPropagation();
    menu.hidden = !menu.hidden; more.setAttribute('aria-expanded', String(!menu.hidden));
    if (!menu.hidden) $('a', menu).focus({ preventScroll: true });
  });
  document.addEventListener('click', e => { if (!e.target.closest('#menu')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  $$('.links a, #menu a').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault(); closeMenu();
    const m = t.closest('.msg') || t;
    m.classList.add('in');
    const target = () => m.getBoundingClientRect().top + scrollY - bar.offsetHeight - 16;
    window.scrollTo({ top: target(), behavior: STATIC ? 'auto' : 'smooth' });
    /* lazy images above can change the layout mid-scroll: settle on the exact spot once it stops */
    const settle = () => { const d = target() - scrollY; if (Math.abs(d) > 4) window.scrollTo({ top: target(), behavior: 'auto' }); };
    if ('onscrollend' in window) addEventListener('scrollend', settle, { once: true }); else setTimeout(settle, 900);
    m.classList.remove('flash'); void m.offsetWidth; m.classList.add('flash');
    history.replaceState(null, '', a.getAttribute('href'));
  }));
  /* desktop: the link of the part you're reading stays marked */
  const linkFor = Object.fromEntries($$('.links a').map(a => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      $$('.links a').forEach(a => a.classList.toggle('on', a === linkFor[e.target.dataset.sec]));
    }), { rootMargin: '-45% 0px -50% 0px' });
    [['metodo', '#metodo'], ['casos', '#casos'], ['gianfranco', '#gianfranco'], ['precio', '#precio'], ['preguntas', '#preguntas']].forEach(([k, sel]) => {
      const el = $(sel)?.closest('.msg') || $(sel); if (el) { el.dataset.sec = k; spy.observe(el); }
    });
  }

  /* Meta Pixel: WhatsApp or phone link = Contact (same as the previous site) */
  document.addEventListener('click', e => { if (e.target.closest?.('a[href*="wa.me/"], a[href^="tel:"]')) track('track', 'Contact'); }, true);
})();
