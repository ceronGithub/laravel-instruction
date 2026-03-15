/* terminal.js — Hero terminal typing animation */
(function() {
  const cmdEl    = document.getElementById('typingCmd');
  const outputEl = document.getElementById('terminalOutput');
  if (!cmdEl || !outputEl) return;

  const sequences = [
    {
      cmd: 'composer create-project laravel/laravel shop',
      outputs: [
        { cls: 't-info',    text: 'Creating application...' },
        { cls: 't-out',     text: 'Loading composer repositories...' },
        { cls: 't-success', text: '✓  Package manifest generated.' },
        { cls: 't-success', text: '✓  Application ready! Build something amazing.' },
      ]
    },
    {
      cmd: 'php artisan migrate',
      outputs: [
        { cls: 't-info',    text: 'Running migrations...' },
        { cls: 't-success', text: '✓  create_users_table ................. DONE' },
        { cls: 't-success', text: '✓  create_products_table .............. DONE' },
        { cls: 't-success', text: '✓  create_orders_table ................ DONE' },
      ]
    },
    {
      cmd: 'php artisan serve',
      outputs: [
        { cls: 't-info',    text: 'Starting Laravel development server...' },
        { cls: 't-success', text: '✓  Server running on http://127.0.0.1:8000' },
        { cls: 't-warn',    text: '⚡  Press Ctrl+C to stop the server' },
      ]
    },
    {
      cmd: 'php artisan make:model Product -mcr',
      outputs: [
        { cls: 't-success', text: '✓  Model created:      app/Models/Product.php' },
        { cls: 't-success', text: '✓  Migration created:  create_products_table' },
        { cls: 't-success', text: '✓  Controller created: ProductController.php' },
      ]
    },
  ];

  let seqIdx = 0, charIdx = 0, outIdx = 0, phase = 'typing';

  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cmdEl.parentElement && cmdEl.parentElement.appendChild(cursor);

  function tick() {
    try {
      const seq = sequences[seqIdx];
      if (phase === 'typing') {
        if (charIdx < seq.cmd.length) {
          cmdEl.textContent = seq.cmd.slice(0, ++charIdx);
          setTimeout(tick, 50 + Math.random() * 35);
        } else {
          phase = 'outputs'; outIdx = 0;
          setTimeout(tick, 500);
        }
      } else if (phase === 'outputs') {
        if (outIdx < seq.outputs.length) {
          const line = seq.outputs[outIdx++];
          const div  = document.createElement('div');
          div.className = 'terminal-line ' + line.cls;
          div.textContent = line.text;
          div.style.opacity = '0';
          div.style.transition = 'opacity 0.3s ease';
          outputEl.appendChild(div);
          requestAnimationFrame(() => { div.style.opacity = '1'; });
          setTimeout(tick, 350);
        } else {
          phase = 'pause';
          setTimeout(tick, 2500);
        }
      } else if (phase === 'pause') {
        // Fade out
        outputEl.querySelectorAll('.terminal-line').forEach(l => l.style.opacity = '0');
        cmdEl.textContent = '';
        setTimeout(() => {
          outputEl.innerHTML = '';
          charIdx = 0; outIdx = 0;
          seqIdx  = (seqIdx + 1) % sequences.length;
          phase   = 'typing';
          tick();
        }, 500);
      }
    } catch(e) { /* silent fail */ }
  }

  setTimeout(tick, 800);
})();
