function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function initScrollParallax(heroElement, collectionElement, reduceMotion) {
  if (!heroElement || !collectionElement || reduceMotion) {
    return;
  }

  let animationFrame = 0;

  function updateParallax() {
    const heroRect = heroElement.getBoundingClientRect();
    const heroProgress = clamp(-heroRect.top / heroRect.height, 0, 1);
    const collectionRect = collectionElement.getBoundingClientRect();
    const collectionProgress = clamp((window.innerHeight - collectionRect.top) / (window.innerHeight * 0.72), 0, 1);

    heroElement.style.setProperty('--hero-parallax-image', Math.round(heroProgress * 72) + 'px');
    heroElement.style.setProperty('--hero-parallax-content', Math.round(heroProgress * -28) + 'px');
    collectionElement.style.setProperty('--parallax-y', Math.round((1 - collectionProgress) * 24) + 'px');

    animationFrame = 0;
  }

  function requestParallaxUpdate() {
    if (animationFrame) {
      return;
    }

    animationFrame = requestAnimationFrame(updateParallax);
  }

  updateParallax();
  window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  window.addEventListener('resize', requestParallaxUpdate);
}
