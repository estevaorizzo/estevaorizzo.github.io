(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const desktop = matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  const header = document.querySelector('.header');
  const gallery = document.querySelector('.stage-essay');
  const frames = [...gallery.querySelectorAll('figure')];
  const closing = document.querySelector('.ready-scene img');
  const journeyItems = [...document.querySelectorAll('.journey-list > li')];
  let pending = 0;
  const clamp = x => Math.max(-1, Math.min(1, x));
  function progress(element) {
    const box = element.getBoundingClientRect();
    return clamp((innerHeight / 2 - box.top - box.height / 2) / (innerHeight / 2 + box.height / 2));
  }
  function render() {
    pending = 0;
    header.classList.toggle('has-scrolled', scrollY > 28);
    for (const frame of frames) {
      frame.style.removeProperty('--dy');
      frame.querySelector('img').style.removeProperty('transform');
    }
    closing.style.removeProperty('transform');
    if (!reduced.matches && !document.hidden && (mobile.matches || desktop.matches)) {
      const p = progress(gallery);
      frames.forEach((frame, index) => {
        const dy = p * (index === 1 ? -1 : 1) * (mobile.matches ? 14 : 20);
        if (mobile.matches) frame.style.setProperty('--dy', dy.toFixed(2) + 'px');
        else frame.querySelector('img').style.transform = `translateY(${dy.toFixed(2)}px)`;
      });
      if (desktop.matches) closing.style.transform = `translateY(${(progress(document.querySelector('.ready')) * 20).toFixed(2)}px)`;
    }
    const current = journeyItems.find(item => item.getBoundingClientRect().bottom > innerHeight * .42);
    for (const item of journeyItems) item.classList.toggle('is-current', item === current);
  }
  function request() {
    if (!pending) pending = requestAnimationFrame(render);
  }
  addEventListener('scroll', request, {passive:true});
  addEventListener('resize', request, {passive:true});
  document.addEventListener('visibilitychange', request);
  for (const query of [reduced, mobile, desktop]) query.addEventListener('change', request);
  for (const anchor of document.querySelectorAll('a[href^="#"]')) {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      anchor.addEventListener('click', () => requestAnimationFrame(() => target.focus({preventScroll:true})));
    }
  }
  request();
})();