(() => {
  const yearNode = document.querySelector('[data-year]');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  const scrollyRoot = document.querySelector('[data-scrolly]');
  if (!scrollyRoot) return;

  const steps = Array.from(scrollyRoot.querySelectorAll('[data-step]'));
  const image = scrollyRoot.querySelector('[data-scrolly-image]');
  if (!steps.length || !image) return;

  const setActive = (active) => {
    for (const step of steps) {
      const isActive = step === active;
      step.classList.toggle('is-active', isActive);
    }

    const nextSrc = active.getAttribute('data-img');
    if (!nextSrc || image.getAttribute('src') === nextSrc) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      image.setAttribute('src', nextSrc);
      return;
    }

    image.classList.add('is-fading');

    // Swap after fade-out; keep timing aligned with CSS.
    window.setTimeout(() => {
      image.setAttribute('src', nextSrc);

      // Force a paint so the fade-in is smooth after the src change.
      void image.offsetHeight;
      image.classList.remove('is-fading');
    }, 140);
  };

  // Preload images to reduce flicker.
  for (const step of steps) {
    const src = step.getAttribute('data-img');
    if (!src) continue;
    const img = new Image();
    img.src = src;
  }

  // Activate based on scroll position.
  const observer = new IntersectionObserver(
    (entries) => {
      // Choose the entry closest to the center of the viewport.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

      const best = visible[0];
      if (best) setActive(best.target);
    },
    {
      root: null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: '-35% 0px -45% 0px',
    },
  );

  for (const step of steps) observer.observe(step);

  // Fallback: ensure first step active on load.
  setActive(steps[0]);
})();
