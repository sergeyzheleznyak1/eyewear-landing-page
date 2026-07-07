# SOVA Eyewear

A one-page editorial landing page for the SOVA optical collection. The project is built with plain HTML, CSS, and modular JavaScript, with the experience focused on product presence, restrained motion, and accessible interaction.

## Highlights

- Large typographic hero with layered product imagery and a pointer-driven reveal effect on desktop.
- Motion system built around a short preloader, word reveal, scroll reveals, subtle parallax, and a typed email preview.
- Interactive craft cards that respond to hover, focus, click, Enter, and Space.
- Floating booking CTA that appears only while the collection and craft sections are in view.
- Accessibility details include semantic sections, ARIA states for the menu and card controls, keyboard support, and `prefers-reduced-motion` handling.
- Responsive image delivery with WebP sources and lazy loading for below-the-fold visuals.

## Notes

The JavaScript is split into small modules by behavior, while `js/script.js` remains the entry point. There is no build step or framework layer; the landing page stays lightweight and easy to inspect.
