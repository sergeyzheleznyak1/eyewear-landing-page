export function initWordReveal(element, wordClassName, baseDelay) {
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
