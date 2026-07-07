export function initHeroReveal(hero, revealImage, canUseReveal, reduceMotion) {
  if (!hero || !revealImage || !canUseReveal || reduceMotion) {
    return;
  }

  let animationFrame = 0;

  hero.addEventListener('pointermove', function(event) {
    if (animationFrame) {
      return;
    }

    animationFrame = requestAnimationFrame(function() {
      revealImage.style.setProperty('--mask-x', event.clientX + 'px');
      revealImage.style.setProperty('--mask-y', event.clientY + 'px');
      animationFrame = 0;
    });
  }, { passive: true });
}
