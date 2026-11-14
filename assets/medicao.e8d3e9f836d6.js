(() => {
  'use strict';
  // Do not send laboratory/review traffic to the real property.
  if (location.protocol !== 'https:' || !['estevaorizzo.com.br', 'www.estevaorizzo.com.br'].includes(location.hostname)) return;
  if (window.__estevaoMeasurementStarted) return;
  window.__estevaoMeasurementStarted = true;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', 'G-66XRW16HXY');
  const loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=G-66XRW16HXY';
  document.head.appendChild(loader);
  const identifiers = ['cabecalho', 'abertura', 'formato', 'resultado', 'investimento', 'convite'];
  const contacts = document.querySelectorAll('a[data-contact]');
  if (contacts.length !== identifiers.length) return;
  contacts.forEach((anchor, index) => {
    const track = () => gtag('event', 'whatsapp_click', {cta_id: identifiers[index]});
    anchor.addEventListener('click', track);
    anchor.addEventListener('auxclick', event => { if (event.button === 1) track(); });
  });
  // Entry into the viewport is exposure, not proof of reading.
  const sectionIds = ['abertura', 'introducao', 'programa', 'publico', 'mentor', 'experiencia', 'jornada', 'resultado', 'investimento', 'contato'];
  const sections = document.querySelectorAll('main > section');
  if (sections.length === sectionIds.length && typeof IntersectionObserver !== 'undefined') {
    const seen = new Set();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio <= 0 || seen.has(entry.target)) return;
        const index = Array.prototype.indexOf.call(sections, entry.target);
        if (index < 0) return;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        gtag('event', 'section_view', {section_id: sectionIds[index]});
      });
    }, {threshold: 0.001});
    sections.forEach(section => observer.observe(section));
  }
  // GA4 enhanced measurement already records the 90% scroll event.
  const recorded = new Set();
  const checkDepth = () => {
    const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    if (!height) return;
    const depth = (window.scrollY + window.innerHeight) / height * 100;
    [25, 50, 75].forEach(level => {
      if (depth >= level && !recorded.has(level)) {
        recorded.add(level);
        gtag('event', 'scroll_depth', {percent_scrolled: level});
      }
    });
  };
  window.addEventListener('scroll', checkDepth, {passive: true});
  window.addEventListener('pageshow', checkDepth);
  checkDepth();
})();
