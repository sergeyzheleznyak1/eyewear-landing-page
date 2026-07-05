(function() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-menu');
  const heroLead = document.getElementById('hero-lead');
  const revealImage = document.getElementById('hero-reveal-image');
  const mailTyped = document.querySelector('.mail-card__typed');
  const craftVisual = document.querySelector('[data-craft-visual]');
  const craftDetails = document.querySelectorAll('[data-craft-detail]');
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  const canUseReveal = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initWordReveal(element, wordClassName, baseDelay) {
    if (!element) {
      return;
    }

    const text = element.textContent.trim();

    if (!text) {
      return;
    }

    element.textContent = '';

    const words = text.split(/\s+/);

    words.forEach(function(word, index) {
      const wordElement = document.createElement('span');
      wordElement.className = wordClassName;
      wordElement.textContent = word;
      wordElement.style.animationDelay = baseDelay + index * 0.055 + 's';
      element.appendChild(wordElement);

      if (index < words.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }

  function closeMenu() {
    if (!menuToggle || !menu) {
      return;
    }

    menuToggle.classList.remove('header__burger--open');
    menu.classList.remove('menu--open');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
  }

  function openMenu() {
    if (!menuToggle || !menu) {
      return;
    }

    menuToggle.classList.add('header__burger--open');
    menu.classList.add('menu--open');
    menuToggle.setAttribute('aria-label', 'Close menu');
    menuToggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.inert = false;
  }

  if (menuToggle && menu) {
    menu.inert = true;

    menuToggle.addEventListener('click', function() {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMenu();
        return;
      }

      openMenu();
    });

    menu.querySelectorAll('.menu__link').forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  function initMailTyping(element) {
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

  initWordReveal(heroLead, 'hero__word', 2.42);
  initMailTyping(mailTyped);

  if (craftVisual && craftDetails.length) {
    craftDetails.forEach(function(detail) {
      const detailName = detail.getAttribute('data-craft-detail');

      detail.addEventListener('mouseenter', function() {
        craftVisual.setAttribute('data-active-detail', detailName);
      });

      detail.addEventListener('focus', function() {
        craftVisual.setAttribute('data-active-detail', detailName);
      });

      detail.addEventListener('mouseleave', function() {
        craftVisual.removeAttribute('data-active-detail');
      });

      detail.addEventListener('blur', function() {
        craftVisual.removeAttribute('data-active-detail');
      });
    });
  }

  if (animatedElements.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      animatedElements.forEach(function(element) {
        element.classList.add('is-visible');
      });
    } else {
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
  }

  if (revealImage && canUseReveal && !reduceMotion) {
    let animationFrame = 0;

    window.addEventListener('pointermove', function(event) {
      if (animationFrame) {
        return;
      }

      animationFrame = requestAnimationFrame(function() {
        revealImage.style.setProperty('--mask-x', event.clientX + 'px');
        revealImage.style.setProperty('--mask-y', event.clientY + 'px');
        animationFrame = 0;
      });
    });
  }
})();
