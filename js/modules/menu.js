export function initMenu(menuToggle, menu) {
  if (!menuToggle || !menu) {
    return;
  }

  function closeMenu() {
    menuToggle.classList.remove('header__burger--open');
    menu.classList.remove('menu--open');
    menuToggle.setAttribute('aria-label', 'Open menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
  }

  function openMenu() {
    menuToggle.classList.add('header__burger--open');
    menu.classList.add('menu--open');
    menuToggle.setAttribute('aria-label', 'Close menu');
    menuToggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    menu.inert = false;
  }

  menu.inert = true;

  menuToggle.addEventListener('click', function() {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  });

  menu.querySelectorAll('a[href]').forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('hashchange', closeMenu);
}
