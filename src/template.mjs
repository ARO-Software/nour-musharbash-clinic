// Renders one language version of the page to a static HTML string.
// Structure and copy follow the Claude Design file "Nour Musharbash RD v3" (split hero).

const esc = s => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const pad2 = n => String(n).padStart(2, '0');

const RING = Array.from('NOUR MUSHARBASH, RD • CLINICAL DIETITIAN • ');

const eyebrow = (n, label) =>
  `<div class="eyebrow"><span class="eyebrow__n">(${n})</span>${esc(label)}</div>`;

const chips = (tags, cls = '') =>
  tags.map(tag => `<span class="chip${cls}">${esc(tag)}</span>`).join('');

const card = (num, j, variant = '') => `
        <article class="jcard${variant ? ` jcard--${variant}` : ''}">
          <div class="jcard__meta"><span>${num}</span><span>${esc(j.place)}</span></div>
          <div class="jcard__inst">${esc(j.inst)}</div>
          <div class="jcard__body"><div class="jcard__cred">${esc(j.cred)}</div><div class="jcard__d">${esc(j.d)}</div></div>
        </article>`;

const step = (n, a) => `
    <article class="step step--${n}">
      <div class="step__n">0${n}</div>
      <div class="step__main">
        <h3 class="step__title">${esc(a.title)}</h3>
        <p class="step__body">${esc(a.body)}</p>
        <div class="step__tags">${chips(a.tags)}</div>
      </div>
    </article>`;

const plan = (n, p, t, tel, featured = false) => `
      <article class="plan${featured ? ' plan--featured' : ''}" data-reveal="${n - 1}">
        <div class="plan__top"><span class="plan__tag">${esc(p.tag)}</span><span class="plan__n">0${n}</span></div>
        <h3 class="plan__name">${esc(p.name)}</h3>
        <p class="plan__desc">${esc(p.desc)}</p>
        <ul class="plan__feats">${p.feats.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        <div class="plan__foot"><span class="plan__fees">${esc(t.fees)}</span><a class="plan__cta" href="${tel}">${esc(t.callCta)}</a></div>
      </article>`;

export function renderPage({ t, lang, meta, clinic, base, otherHref, otherLang }) {
  const ar = lang === 'ar';
  const tel = 'tel:' + clinic.phone.replace(/[^\d+]/g, '');
  const wa = 'https://wa.me/' + clinic.phone.replace(/\D/g, '');
  const phone = esc(clinic.phone);
  const address = esc(clinic.address[lang]);
  const img = name => `${base}assets/img/${name}`;
  const pageUrl = clinic.siteUrl + (ar ? 'ar/' : '');
  const altUrl = clinic.siteUrl + (ar ? '' : 'ar/');

  const words = t.manifesto.split(' ').map(w => {
    const em = w.length > 2 && w[0] === '*' && w[w.length - 1] === '*';
    const text = esc(em ? w.slice(1, -1) : w);
    return `<span class="word" data-word>${em ? `<span class="hl">${text}</span>` : text}</span>`;
  }).join(' ');

  const marqA = t.marqA.concat(t.marqA)
    .map(m => `<div class="marquee__item"><span class="marquee__text">${esc(m)}</span><span class="marquee__dot"></span></div>`).join('');
  const marqB = [].concat(t.marqB, t.marqB, t.marqB, t.marqB)
    .map(m => `<div class="marquee__item"><span class="marquee__text">${esc(m)}</span><span class="marquee__dot"></span></div>`).join('');

  const ring = RING.map((ch, i) =>
    `<span style="transform:rotate(${(i * 360 / RING.length).toFixed(2)}deg)">${ch === ' ' ? '&nbsp;' : esc(ch)}</span>`).join('');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${ar ? 'rtl' : 'ltr'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(meta.title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="theme-color" content="#1f3a2c">
<link rel="canonical" href="${pageUrl}">
<link rel="alternate" hreflang="en" href="${clinic.siteUrl}">
<link rel="alternate" hreflang="ar" href="${clinic.siteUrl}ar/">
<link rel="alternate" hreflang="x-default" href="${clinic.siteUrl}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(meta.title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${clinic.siteUrl}assets/img/nour-portrait.jpg">
<meta property="og:locale" content="${ar ? 'ar_JO' : 'en_US'}">
<meta property="og:locale:alternate" content="${ar ? 'en_US' : 'ar_JO'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${img('mark-sage.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=Instrument+Serif:ital@0;1&family=Reem+Kufi:wght@400..700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Mulish:wght@200..800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/css/site.css">
<script>
  // Hide intro elements until site.js starts their entrance animations (failsafe after 4s).
  (function (r) {
    r.classList.add('js');
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    r.classList.add('intro-pending');
    setTimeout(function () { r.classList.remove('intro-pending'); }, 4000);
  })(document.documentElement);
</script>
<script src="${base}assets/js/site.js" defer></script>
</head>
<body>
<div class="site">

<div class="progress" data-progress></div>

<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="#top" aria-label="${esc(t.logo)}, RD">
      <img class="brand__mark" src="${img('mark-sage.png')}" alt="" width="393" height="453">
      <span class="brand__name"><span>${esc(t.logoA)}</span><span>${esc(t.logoB)}</span></span>
    </a>
    <nav class="site-nav" aria-label="${ar ? 'القائمة الرئيسية' : 'Primary'}">
      <span class="site-nav__spacer"></span>
      <a href="#about">${esc(t.navAbout)}</a>
      <a href="#specialties">${esc(t.navSpec)}</a>
      <a href="#programs">${esc(t.navProg)}</a>
      <a href="#faq">${esc(t.navFaq)}</a>
    </nav>
    <a class="lang-toggle" href="${otherHref}" hreflang="${otherLang}" lang="${otherLang}" aria-label="${ar ? 'English version' : 'النسخة العربية'}">${esc(t.langBtn)}</a>
    <a class="nav-call" href="${tel}" data-magnet>${esc(t.navCall)}<span class="nav-call__ic" aria-hidden="true">↗</span></a>
  </div>
</header>

<main>

<section id="top" class="hero">
  <div class="hero__copy">
    <div class="status" data-intro="0"><span class="status__dot" data-pulse></span>${esc(t.status)}</div>
    <h1 class="hero__title">
      <span class="line line--1"><span data-intro="1"><span data-drift="-1">${esc(t.splitA)}</span></span></span>
      <span class="line line--2"><span data-intro="2"><span data-drift="1">${esc(t.splitB)}</span></span></span>
      <span class="line line--3"><span data-intro="3"><span data-drift="-1" class="hero__accent">${esc(t.splitC)}</span></span></span>
    </h1>
    <p class="hero__sub" data-intro="4">${esc(t.subHeroC)}</p>
    <div class="hero__ctas" data-intro="5">
      <a class="btn btn--sun" href="${tel}" data-magnet>${esc(t.cta1)}<span class="btn__ic" aria-hidden="true">${esc(t.arrow)}</span></a>
      <a class="text-link text-link--light" href="#specialties">${esc(t.cta2)}</a>
    </div>
    <dl class="hero__creds" data-intro="6">
      ${t.creds.map(c => `<div class="cred"><dt class="cred__k">${esc(c.k)}</dt><dd class="cred__v">${esc(c.v)}</dd></div>`).join('\n      ')}
    </dl>
  </div>
  <div class="hero__media">
    <div class="hero__photo" data-intro-clip>
      <img data-par-img src="${img('nour-portrait.jpg')}" alt="${ar ? 'نور مشربش، أخصائية تغذية علاجية' : 'Nour Musharbash, Clinical Dietitian'}" width="1600" height="1600" fetchpriority="high">
    </div>
    <div class="badge" data-intro-pop="1" aria-hidden="true">
      <div class="badge__ring" data-spin>${ring}</div>
      <div class="badge__core"><span>${esc(t.tagA)}</span><span>${esc(t.tagB)}</span></div>
    </div>
  </div>
</section>

<section class="marquee" aria-label="${ar ? 'مجالات الرعاية' : 'Areas of care'}">
  <div class="marquee__band marquee__band--b" dir="ltr" aria-hidden="true">
    <div class="marquee__track" data-marquee="-1">${marqB}</div>
  </div>
  <div class="marquee__band marquee__band--a" dir="ltr">
    <div class="marquee__track" data-marquee="1">${marqA}</div>
  </div>
</section>

<section id="about" class="about">
  <div class="about__top">
    <div class="about__aside" data-reveal="0">
      ${eyebrow('01', t.aboutLabel)}
      <div class="about__card">
        <img class="about__mark" src="${img('mark-sage.png')}" alt="" width="393" height="453">
        <div class="about__clinic"><span class="about__name">${esc(t.hospital)}</span><span class="about__where">${esc(t.aboutWhere)}</span></div>
        <div class="chips">${chips([t.aboutChip1, t.aboutChip2])}</div>
      </div>
    </div>
    <p class="manifesto" data-manifesto>${words}</p>
  </div>
  <div class="counters">
    ${t.counters.map((c, i) => `<div class="counter" data-reveal="${i}"><span class="counter__n" data-count="${c.n}">${pad2(c.n)}</span><span class="counter__k">${esc(c.k)}</span><span class="counter__d">${esc(c.d)}</span></div>`).join('\n    ')}
  </div>
</section>

<section id="journey" class="journey" data-hsec>
  <div class="journey__sticky">
    <div class="journey__head">
      <div class="journey__intro">
        ${eyebrow('02', t.pathLabel)}
        <h2 class="h2 h2--journey">${esc(t.pathH2a)}<em>${esc(t.pathH2b)}</em></h2>
      </div>
      <p class="journey__p">${esc(t.pathP)}</p>
    </div>
    <div class="journey__viewport">
      <div class="journey__track" data-htrack>${card('01', t.j1)}${card('02', t.j2)}${card('03', t.j3)}${card('04', t.j7)}${card('05', t.j4, 'sun')}${card('06', t.j8)}
        <article class="jcard jcard--dark">
          <img class="jcard__mark" src="${img('mark-sage.png')}" alt="" width="393" height="453">
          <div class="jcard__meta"><span>07</span><span>${esc(t.j5.place)}</span></div>
          <div class="jcard__inst">${esc(t.j5.inst)}</div>
          <div class="jcard__body"><div class="jcard__cred">${esc(t.j5.cred)}</div><div class="jcard__d">${esc(t.j5.d)}</div></div>
        </article>
        <article class="jcard jcard--outline">
          <div class="jcard__meta"><span>+</span><span>${esc(t.j6.place)}</span></div>
          <ul class="jcard__list">${t.j6.items.map(m => `<li>${esc(m)}</li>`).join('')}</ul>
        </article>
      </div>
    </div>
    <div class="journey__progress" aria-hidden="true">
      <div class="journey__bar"><div class="journey__fill" data-hbar></div><div class="journey__dot" data-hdot></div></div>
      <div class="journey__stops">${t.pathStops.map(p => `<span>${esc(p)}</span>`).join('')}</div>
    </div>
  </div>
</section>

<section id="specialties" class="section">
  <div class="section-head">
    <div class="section-head__title" data-reveal="0">
      ${eyebrow('03', t.specLabel)}
      <h2 class="h2 h2--xl">${esc(t.specH2a)}<em>${esc(t.specH2b)}</em></h2>
    </div>
    <p class="section-head__p" data-reveal="1">${esc(t.specP)}</p>
  </div>
  <div class="specs" data-reveal="2" data-accordion>
    ${t.specs.map((s, i) => `<div class="spec${i === 0 ? ' is-open' : ''}" data-acc-item>
      <h3 class="spec__h"><button class="spec__btn" type="button" aria-expanded="${i === 0}" aria-controls="spec-${i}" data-acc-btn>
        <span class="spec__n">${pad2(i + 1)}</span><span class="spec__title">${esc(s.title)}</span><span class="spec__plus" aria-hidden="true">+</span>
      </button></h3>
      <div class="acc-panel" id="spec-${i}"><div class="acc-clip"><div class="spec__inner">
        <span class="spec__gutter"></span>
        <div class="spec__content"><p>${esc(s.body)}</p><div class="spec__tags">${chips(s.tags)}</div></div>
      </div></div></div>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="approach" class="approach">
  <div class="approach__head" data-reveal="0">
    ${eyebrow('04', t.apprLabel)}
    <h2 class="h2 h2--xl">${esc(t.apprH2a)}<em>${esc(t.apprH2b)}</em></h2>
  </div>
  <div class="steps">${step(1, t.a1)}${step(2, t.a2)}${step(3, t.a3)}${step(4, t.a4)}
  </div>
</section>

<section id="programs" class="programs">
  <div class="programs__inner">
    <div class="section-head">
      <div class="section-head__title" data-reveal="0">
        ${eyebrow('05', t.progLabel)}
        <h2 class="h2 h2--xl">${esc(t.progH2a)}<em>${esc(t.progH2b)}</em></h2>
      </div>
      <p class="section-head__p" data-reveal="1">${esc(t.progP)}</p>
    </div>
    <div class="plans">${plan(1, t.p1, t, tel)}${plan(2, t.p2, t, tel, true)}${plan(3, t.p3, t, tel)}
    </div>
  </div>
</section>

<section id="reviews" class="reviews">
  <div class="reviews__inner">
    <div class="reviews__head" data-reveal="0">
      <div class="reviews__title">
        ${eyebrow('06', t.testLabel)}
        <h2 class="h2 h2--lg">${esc(t.testH2a)}<em>${esc(t.testH2b)}</em></h2>
      </div>
      <div class="reviews__nav">
        <button class="qbtn qbtn--prev" type="button" data-q-prev aria-label="${ar ? 'المراجعة السابقة' : 'Previous review'}">${esc(t.prevArrow)}</button>
        <button class="qbtn qbtn--next" type="button" data-q-next aria-label="${ar ? 'المراجعة التالية' : 'Next review'}">${esc(t.arrow)}</button>
      </div>
    </div>
    <div class="reviews__stage" data-reveal="1">
      <span class="reviews__mark" aria-hidden="true">“</span>
      <div class="quotes" data-quotes aria-live="polite">
        ${t.quotes.map((q, i) => `<figure class="quote" data-quote${i === 0 ? '' : ' hidden'}>
          <blockquote class="quote__text"><p>${esc(q.q)}</p></blockquote>
          <figcaption class="quote__by"><span class="quote__ini" aria-hidden="true">${esc(q.ini)}</span><span class="quote__meta"><span class="quote__who">${esc(q.who)}</span><span class="quote__ctx">${esc(q.ctx)}</span></span></figcaption>
        </figure>`).join('\n        ')}
      </div>
    </div>
    <div class="reviews__foot">
      <div class="qdots">${t.quotes.map((_, i) => `<button class="qdot${i === 0 ? ' is-active' : ''}" type="button" data-q-dot="${i}" aria-label="${ar ? 'عرض المراجعة' : 'Show review'} ${i + 1}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
      <span class="reviews__note">${esc(t.testNote)}</span>
    </div>
  </div>
</section>

<section id="faq" class="faq">
  <div class="faq__head" data-reveal="0">
    ${eyebrow('07', t.faqLabel)}
    <h2 class="h2 h2--lg">${esc(t.faqH2a)}<em>${esc(t.faqH2b)}</em></h2>
  </div>
  <div class="faqs" data-reveal="1" data-accordion>
    ${t.faqs.map((f, i) => `<div class="faq-item${i === 0 ? ' is-open' : ''}" data-acc-item>
      <h3 class="faq-item__h"><button class="faq-item__q" type="button" aria-expanded="${i === 0}" aria-controls="faq-${i}" data-acc-btn>${esc(f.q)}<span class="faq-item__icon" aria-hidden="true">+</span></button></h3>
      <div class="acc-panel" id="faq-${i}"><div class="acc-clip"><p class="faq-item__a">${esc(f.a)}</p></div></div>
    </div>`).join('\n    ')}
  </div>
</section>

<section id="book" class="book">
  <div class="book__sun" data-rise aria-hidden="true"></div>
  <div class="book__inner">
    <div class="book__main" data-reveal="0">
      ${eyebrow('08', t.bookLabel)}
      <h2 class="h2 h2--book">${esc(t.bookH2a)}<em>${esc(t.bookH2b)}</em></h2>
      <p class="book__p">${esc(t.bookP)}</p>
      <a class="book__phone" href="${tel}" dir="ltr">${phone}</a>
      <div class="book__ctas">
        <a class="btn btn--sun" href="${tel}" data-magnet>${esc(t.callNow)}<span class="btn__ic" aria-hidden="true">${esc(t.arrow)}</span></a>
        <a class="btn-ghost" href="${clinic.mapsUrl}" target="_blank" rel="noopener">${esc(t.directions)}</a>
      </div>
    </div>
    <div class="book-card" data-reveal="1">
      <div class="book-card__who">
        <img src="${img('nour-portrait.jpg')}" alt="" width="64" height="64" loading="lazy">
        <div class="book-card__whotext"><span class="label">${esc(t.askFor)}</span><span class="book-card__name">${esc(t.askName)}</span></div>
      </div>
      <div class="book-card__rows">
        <div class="book-row"><span class="label">${esc(t.lblWhere)}</span><span class="book-row__v">${esc(t.hospital)}<br>${address}</span></div>
        <div class="book-row"><span class="label">${esc(t.hoursLbl)}</span><span class="book-row__v book-row__v--hours">${esc(t.hours1)}<br>${esc(t.hours2)}</span></div>
        <a class="book-row" href="${tel}"><span class="label">${esc(t.lblMain)}</span><span class="book-row__v book-row__v--strong" dir="ltr">${phone}</span></a>
        <a class="book-row" href="${wa}" target="_blank" rel="noopener"><span class="label">WhatsApp</span><span class="book-row__v book-row__v--strong" dir="ltr">${phone} ↗</span></a>
        <a class="book-row" href="${clinic.instagram}" target="_blank" rel="noopener"><span class="label">Instagram</span><span class="book-row__v book-row__v--strong" dir="ltr">@nourmusharbash ↗</span></a>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="footer">
  <div class="footer__inner">
    <div class="footer__cols">
      <div class="fcol"><span class="fcol__label">${esc(t.fVisit)}</span><span class="fcol__v">${esc(t.hospital)}<br>${address}</span></div>
      <div class="fcol"><span class="fcol__label">${esc(t.fCall)}</span><a class="fcol__v" href="${tel}" dir="ltr">${phone}</a></div>
      <div class="fcol"><span class="fcol__label">${esc(t.fFollow)}</span>
        <div class="fcol__links">
          <a class="fcol__v" href="${clinic.instagram}" target="_blank" rel="noopener">Instagram ↗</a>
          <a class="fcol__v" href="${clinic.facebook}" target="_blank" rel="noopener">Facebook ↗</a>
          <a class="fcol__v" href="${clinic.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>
        </div>
      </div>
      <div class="fcol fcol--start"><span class="fcol__label">${esc(t.fStart)}</span><a class="footer-cta" href="${tel}">${esc(t.cta1)}<span aria-hidden="true">${esc(t.arrow)}</span></a></div>
    </div>
    <div class="wordmark-wrap">
      <div class="wordmark" data-reveal="0"><img src="${img('mark-ink.png')}" alt="" width="393" height="453"><div class="wordmark__text">${esc(t.logo)}</div></div>
    </div>
    <div class="footer__bottom"><span>${esc(t.rights)}</span><a href="#top">${esc(t.toTop)}</a></div>
  </div>
</footer>

</div>
</body>
</html>
`;
}
