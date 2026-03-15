/* scroll.js — Reveal on scroll + progress bar + parallax */
(function() {

  // ===== PROGRESS BAR =====
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.prepend(bar);

  function updateProgress() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
  }

  // ===== REVEAL =====
  function triggerAll() {
    document.querySelectorAll('.reveal, .reveal-section, .step').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        el.classList.add('visible');
      }
    });
  }

  // Observer for below-fold elements
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

    document.querySelectorAll('.reveal, .reveal-section, .step')
      .forEach(el => io.observe(el));
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal, .reveal-section, .step')
      .forEach(el => el.classList.add('visible'));
  }

  // Run immediately — catches above-fold + fast loads
  triggerAll();
  requestAnimationFrame(triggerAll);
  setTimeout(triggerAll, 50);
  setTimeout(triggerAll, 200);
  setTimeout(triggerAll, 600);

  // ===== TOC =====
  const tocLinks = document.querySelectorAll('.toc__item a');
  const sections = document.querySelectorAll('[data-section]');
  function updateToc() {
    let cur = '';
    sections.forEach(s => { if (s.getBoundingClientRect().top <= 200) cur = s.dataset.section; });
    tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }

  // ===== PARALLAX =====
  const glows = document.querySelectorAll('.hero__glow');
  function parallax() {
    glows.forEach((g, i) => {
      g.style.transform = `translateY(${window.scrollY * (i === 0 ? 0.3 : 0.2)}px)`;
    });
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateToc();
    parallax();
    triggerAll();
  }, { passive: true });

  updateProgress();
})();
