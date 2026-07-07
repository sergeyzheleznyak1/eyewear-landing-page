export function initMailTyping(element, reduceMotion) {
  if (!element) {
    return;
  }

  const text = element.textContent.trim();

  if (!text) {
    return;
  }

  if (reduceMotion) {
    element.classList.remove('is-typing', 'is-typed');
    return;
  }

  let characterIndex = 0;
  let timerId = 0;
  let hasTyped = false;

  element.setAttribute('aria-label', text);
  element.textContent = '';

  function typeNextCharacter() {
    characterIndex += 1;
    element.textContent = text.slice(0, characterIndex);

    if (characterIndex < text.length) {
      timerId = window.setTimeout(typeNextCharacter, 34);
      return;
    }

    element.classList.remove('is-typing');
    element.classList.add('is-typed');
  }

  function startTyping() {
    if (hasTyped) {
      return;
    }

    hasTyped = true;
    window.clearTimeout(timerId);
    element.classList.add('is-typing');
    timerId = window.setTimeout(typeNextCharacter, 260);
  }

  if (!('IntersectionObserver' in window)) {
    startTyping();
    return;
  }

  const typingObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) {
        return;
      }

      startTyping();
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.36,
    rootMargin: '0px 0px -12% 0px'
  });

  typingObserver.observe(element);
}
