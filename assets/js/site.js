// Nour Musharbash, RD — interactions and scroll-driven motion.
// Ported from the Claude Design file "Nour Musharbash RD v3".
(() => {
  const doc = document.documentElement;
  const rtl = doc.dir === 'rtl';
  const motion = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const SPRING = 'cubic-bezier(.34,1.56,.64,1)';
  const MARQUEE_SPEED = 1;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  // ---------- Entrance ----------
  function intro() {
    if (!motion) return;
    $$('[data-pulse]').forEach(el => el.animate(
      [{ boxShadow: '0 0 0 0 rgba(46,160,90,.55)' }, { boxShadow: '0 0 0 10px rgba(46,160,90,0)' }],
      { duration: 1600, iterations: Infinity }
    ));
    $$('[data-intro]').forEach(el => el.animate(
      [{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 1200, delay: 120 + (+el.dataset.intro || 0) * 110, easing: EASE, fill: 'backwards' }
    ));
    $$('[data-intro-clip]').forEach(el => el.animate(
      [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }],
      { duration: 1500, delay: 250, easing: EASE, fill: 'backwards' }
    ));
    $$('[data-intro-pop]').forEach(el => el.animate(
      [{ transform: 'scale(0.4) rotate(-20deg)', opacity: 0 }, { transform: 'scale(1) rotate(0)', opacity: 1 }],
      { duration: 1000, delay: 900 + (+el.dataset.introPop || 0) * 180, easing: SPRING, fill: 'backwards' }
    ));
  }

  // ---------- Reveal on scroll + count-up ----------
  function countUp(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const t0 = performance.now(), dur = 1600;
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(2, -10 * p);
      el.textContent = String(Math.round(target * (p === 1 ? 1 : e))).padStart(2, '0');
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '00';
    requestAnimationFrame(step);
  }

  function setupReveal() {
    if (!motion || !('IntersectionObserver' in window)) return;
    const vh = innerHeight;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io.unobserve(el);
      if (el.dataset.count != null && el.dataset.reveal == null) { countUp(el); return; }
      el.style.opacity = '';
      el.animate(
        [{ opacity: 0, transform: 'translateY(56px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 1100, delay: (+el.dataset.reveal || 0) * 100, easing: EASE, fill: 'backwards' }
      );
    }), { rootMargin: '0px 0px -10% 0px' });
    // Only hide what starts below the fold, so nothing already on screen flashes.
    $$('[data-reveal]').forEach(el => {
      if (el.getBoundingClientRect().top > vh * 0.92) { el.style.opacity = '0'; io.observe(el); }
    });
    $$('[data-count]').forEach(el => {
      if (el.getBoundingClientRect().top > vh * 0.95) { el.textContent = '00'; io.observe(el); }
    });
  }

  // ---------- Magnetic buttons ----------
  function setupMagnets() {
    if (!motion) return;
    const mags = $$('[data-magnet]');
    addEventListener('mousemove', e => {
      mags.forEach(el => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
        el.style.transform = near ? `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.3).toFixed(1)}px)` : '';
      });
    }, { passive: true });
  }

  // ---------- Accordions (one panel open per group) ----------
  function setupAccordions() {
    $$('[data-accordion]').forEach(group => {
      const items = $$('[data-acc-item]', group);
      const set = (item, open) => {
        item.classList.toggle('is-open', open);
        $('[data-acc-btn]', item).setAttribute('aria-expanded', String(open));
      };
      items.forEach(item => {
        $('[data-acc-btn]', item).addEventListener('click', () => {
          const wasOpen = item.classList.contains('is-open');
          items.forEach(other => set(other, false));
          if (!wasOpen) set(item, true);
        });
      });
    });
  }

  // ---------- Testimonials ----------
  function setupQuotes() {
    const box = $('[data-quotes]');
    if (!box) return;
    const quotes = $$('[data-quote]', box);
    const dots = $$('[data-q-dot]');
    const n = quotes.length;
    let index = 0, holdUntil = 0, hovering = false;

    const show = i => {
      index = (i + n) % n;
      quotes.forEach((q, k) => { q.hidden = k !== index; });
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === index);
        if (k === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
      if (motion) box.animate(
        [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 700, easing: EASE }
      );
    };
    const pick = i => { holdUntil = Date.now() + 15000; show(i); };

    $('[data-q-prev]').addEventListener('click', () => pick(index - 1));
    $('[data-q-next]').addEventListener('click', () => pick(index + 1));
    dots.forEach(d => d.addEventListener('click', () => pick(+d.dataset.qDot)));

    const stage = box.closest('.reviews');
    stage.addEventListener('mouseenter', () => { hovering = true; });
    stage.addEventListener('mouseleave', () => { hovering = false; });
    stage.addEventListener('focusin', () => { holdUntil = Date.now() + 15000; });

    setInterval(() => {
      if (hovering || Date.now() < holdUntil || document.hidden) return;
      show(index + 1);
    }, 6500);
  }

  // ---------- Scroll-linked frame loop ----------
  const els = {
    prog: $('[data-progress]'),
    marq: $$('[data-marquee]'),
    spin: $$('[data-spin]'),
    drift: $$('[data-drift]'),
    pimg: $$('[data-par-img]'),
    words: $$('[data-word]'),
    man: $('[data-manifesto]'),
    hsec: $('[data-hsec]'),
    htrack: $('[data-htrack]'),
    hbar: $('[data-hbar]'),
    hdot: $('[data-hdot]'),
    rise: $('[data-rise]')
  };
  const marqX = new Map();
  let frame = 0, vel = 0, lastY = null, wordKey = null;

  function tick() {
    const vh = innerHeight, vw = innerWidth, y = scrollY;
    const dy = lastY == null ? 0 : y - lastY;
    lastY = y;
    vel += (dy - vel) * 0.12;
    const heroP = clamp(y / (vh * 0.9));

    if (els.prog) {
      const max = Math.max(1, doc.scrollHeight - vh);
      els.prog.style.transform = `scaleX(${clamp(y / max).toFixed(4)})`;
    }

    // Marquees drift continuously and speed up with scroll velocity.
    const base = 0.6 * MARQUEE_SPEED;
    els.marq.forEach(el => {
      const dir = +el.dataset.marquee || 1;
      const half = el.scrollWidth / 2;
      if (!half) return;
      let x = marqX.has(el) ? marqX.get(el) : (dir < 0 ? -half / 2 : 0);
      if (motion) x -= dir * (base + Math.min(Math.abs(vel) * 0.35, 18));
      x = ((x % half) - half) % half;
      marqX.set(el, x);
      el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    });

    if (motion) {
      els.spin.forEach(el => { el.style.transform = `rotate(${((frame * 0.25 + y * 0.15) % 360).toFixed(2)}deg)`; });
      els.drift.forEach(el => {
        el.style.transform = `translate3d(${(heroP * vw * 0.09 * (+el.dataset.drift || 0) * (rtl ? -1 : 1)).toFixed(1)}px,0,0)`;
      });
      els.pimg.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * -0.06).toFixed(1)}px,0)`;
      });
    }

    // Manifesto words light up as the paragraph scrolls through the viewport.
    if (els.man && els.words.length) {
      const r = els.man.getBoundingClientRect();
      const p = motion ? clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3)) : 1;
      const lit = p * els.words.length * 1.04;
      const key = Math.round(lit * 12);
      if (key !== wordKey) {
        wordKey = key;
        els.words.forEach((w, i) => { w.style.opacity = (0.14 + 0.86 * clamp(lit - i)).toFixed(3); });
      }
    }

    // Journey: vertical scroll drives the horizontal card track.
    if (els.hsec && els.htrack) {
      const r = els.hsec.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      const dist = Math.max(0, els.htrack.scrollWidth - els.htrack.parentElement.clientWidth);
      els.htrack.style.transform = `translate3d(${((rtl ? 1 : -1) * p * dist).toFixed(1)}px,0,0)`;
      if (els.hbar) els.hbar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (els.hdot) els.hdot.style[rtl ? 'right' : 'left'] = (p * 100).toFixed(2) + '%';
    }

    if (els.rise && motion) {
      const r = els.rise.parentElement.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh + r.height * 0.4));
      els.rise.style.transform = `translate3d(0,${((1 - p) * 40).toFixed(1)}%,0) scale(${(0.8 + 0.2 * p).toFixed(3)})`;
    }

    frame++;
  }

  function loop() {
    tick();
    requestAnimationFrame(loop);
  }

  intro();
  doc.classList.remove('intro-pending');
  setupReveal();
  setupMagnets();
  setupAccordions();
  setupQuotes();
  requestAnimationFrame(loop);
})();
