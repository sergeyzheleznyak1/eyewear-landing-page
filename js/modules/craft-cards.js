export function initCraftCards(craftCards) {
  if (!craftCards.length) {
    return;
  }

  function setActiveCraftCard(activeCard) {
    craftCards.forEach(function(card) {
      const isActive = card === activeCard;

      card.classList.toggle('craft-card--active', isActive);
      card.setAttribute('aria-pressed', String(isActive));
    });
  }

  craftCards.forEach(function(card) {
    card.setAttribute('aria-pressed', String(card.classList.contains('craft-card--active')));

    card.addEventListener('mouseenter', function() {
      setActiveCraftCard(card);
    });

    card.addEventListener('focusin', function() {
      setActiveCraftCard(card);
    });

    card.addEventListener('click', function() {
      setActiveCraftCard(card);
    });

    card.addEventListener('keydown', function(event) {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      event.preventDefault();
      setActiveCraftCard(card);
    });
  });
}
