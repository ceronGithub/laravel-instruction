/* nav.js — Sticky nav scroll effect */
(function() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    nav.classList.toggle('nav--scrolled', window.scrollY > 60);
  }, { passive: true });
})();
