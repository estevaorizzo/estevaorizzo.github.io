(() => {
  'use strict';
  const photos = [...document.querySelectorAll('[data-parallax]')];
  const control = document.querySelector('.motion-toggle');
  const eligible = window.matchMedia('(prefers-reduced-motion: no-preference)');
  const mobile = window.matchMedia('(max-width: 760px)');
  const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  let frame = 0;
  let paused = false;
  let active = false;

  function render() {
    frame = 0;
    if (!active || document.hidden) return;
    const viewport = window.innerHeight;
    for (const [index, photo] of photos.entries()) {
      const parent = photo.closest('[data-parallax-frame]');
      const gallery = photo.closest('.stage-essay');
      if (mobile.matches && !gallery) continue;
      const bounds = (mobile.matches ? gallery : parent).getBoundingClientRect();
      if (bounds.bottom < -60 || bounds.top > viewport + 60) continue;
      const speed = mobile.matches ? (index === 1 ? -0.032 : 0.02 + index * 0.008) : Number(photo.dataset.speed) || 0.08;
      const distance = (viewport / 2 - bounds.top - bounds.height / 2) * speed;
      const limit = mobile.matches ? 14 : 48;
      const y = Math.max(-limit, Math.min(limit, distance));
      const target = mobile.matches ? parent : photo;
      target.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    }
  }

  function requestFrame() {
    if (active && !document.hidden && !frame) frame = requestAnimationFrame(render);
  }

  function sync() {
    active = eligible.matches && !paused && (mobile.matches || desktop.matches);
    window.removeEventListener('scroll', requestFrame);
    window.removeEventListener('resize', requestFrame);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    for (const photo of photos) {
      photo.style.transform = '';
      photo.closest('[data-parallax-frame]').style.transform = '';
    }
    if (control) {
      control.hidden = !eligible.matches;
      control.setAttribute('aria-pressed', String(paused));
      control.textContent = paused ? 'Retomar efeitos' : 'Pausar efeitos';
    }
    if (active) {
      window.addEventListener('scroll', requestFrame, { passive: true });
      window.addEventListener('resize', requestFrame, { passive: true });
      requestFrame();
    }
  }

  if (control) control.addEventListener('click', () => {
    paused = !paused;
    sync();
  });
  eligible.addEventListener('change', sync);
  mobile.addEventListener('change', sync);
  desktop.addEventListener('change', sync);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else requestFrame();
  });
  window.addEventListener('load', requestFrame, { once: true });
  sync();
})();
