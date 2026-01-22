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

    // Swap after fade-out; keep timing aligned with CSS (300ms transition).
    window.setTimeout(() => {
      image.setAttribute('src', nextSrc);

      // Force a paint so the fade-in is smooth after the src change.
      void image.offsetHeight;
      image.classList.remove('is-fading');
    }, 300);
  };

  // Preload images to reduce flicker.
  for (const step of steps) {
    const src = step.getAttribute('data-img');
    if (!src) continue;
    const img = new Image();
    img.src = src;
  }

  // Click-to-navigate: users click step cards to change the image.
  for (const step of steps) {
    step.style.cursor = 'pointer';
    step.addEventListener('click', () => setActive(step));
  }

  // Ensure first step active on load.
  setActive(steps[0]);
})();
