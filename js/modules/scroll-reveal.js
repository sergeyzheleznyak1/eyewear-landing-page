export function initScrollReveal(animatedElements, reduceMotion) {
  if (!animatedElements.length) {
    return;
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    animatedElements.forEach(function(element) {
      element.classList.add('is-visible');
    });
    return;
  }

  document.body.classList.add('page--motion');

  const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px'
  });

  animatedElements.forEach(function(element) {
    revealObserver.observe(element);
  });
}
