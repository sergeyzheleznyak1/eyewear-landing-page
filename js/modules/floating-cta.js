export function initFloatingCta(floatingCta, collectionSection, craftSection, reserveSection) {
  if (!floatingCta || !collectionSection || !craftSection || !reserveSection) {
    return;
  }

  const visibleSections = {
    collection: false,
    craft: false
  };
  let isReserveVisible = false;

  function syncFloatingCta() {
    const isMiddleVisible = visibleSections.collection || visibleSections.craft;
    floatingCta.classList.toggle('floating-cta--visible', isMiddleVisible && !isReserveVisible);
  }

  if (!('IntersectionObserver' in window)) {
    floatingCta.classList.add('floating-cta--visible');
    return;
  }

  const middleObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      visibleSections[entry.target.id] = entry.isIntersecting;
      syncFloatingCta();
    });
  }, {
    threshold: 0.12,
    rootMargin: '-8% 0px -18% 0px'
  });

  const reserveObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      isReserveVisible = entry.isIntersecting;
      syncFloatingCta();
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  middleObserver.observe(collectionSection);
  middleObserver.observe(craftSection);
  reserveObserver.observe(reserveSection);
}
