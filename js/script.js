(function() {
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('site-menu');
  const hero = document.querySelector('.hero');
  const heroLead = document.getElementById('hero-lead');
  const revealImage = document.getElementById('hero-reveal-image');
  const collectionMedia = document.querySelector('.collection__media');
  const mailTyped = document.querySelector('.mail-card__typed');
  const collectionSection = document.getElementById('collection');
  const craftSection = document.getElementById('craft');
  const reserveSection = document.getElementById('reserve');
  const floatingCta = document.querySelector('.floating-cta');
  const craftCards = document.querySelectorAll('[data-craft-card]');
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

    window.addEventListener('hashchange', closeMenu);
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

  function initScrollParallax(heroElement, collectionElement) {
    if (!heroElement || !collectionElement || reduceMotion) {
      return;
    }

    let animationFrame = 0;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

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

  initWordReveal(heroLead, 'hero__word', 2.42);
  initMailTyping(mailTyped);
  initScrollParallax(hero, collectionMedia);

  function setActiveCraftCard(activeCard) {
    craftCards.forEach(function(card) {
      card.classList.toggle('craft-card--active', card === activeCard);
    });
  }

  if (craftCards.length) {
    craftCards.forEach(function(card) {
      card.addEventListener('mouseenter', function() {
        setActiveCraftCard(card);
      });

      card.addEventListener('focus', function() {
        setActiveCraftCard(card);
      });
    });
  }

  if (floatingCta && collectionSection && craftSection && reserveSection) {
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
    } else {
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
