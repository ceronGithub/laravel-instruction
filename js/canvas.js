/* canvas.js — Animated particle + code snippet background */

(function() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;

  let ctx;
  try {
    ctx = canvas.getContext('2d');
    if (!ctx) return;
  } catch(e) { return; }

  let W, H, particles = [], codeSnippets = [];

  const CODE_TEXTS = [
    'composer create-project', 'php artisan migrate', 'Route::get()',
    '$user = User::find()', 'return view(\'home\')', 'DB::table(\'products\')',
    'Auth::user()', 'Eloquent::all()', 'php artisan serve',
    'Schema::create()', 'protected $fillable', 'HasMany', 'BelongsTo',
    'middleware(\'auth\')', '$request->validate()', '.then(res => res.json())',
    'env(\'DB_HOST\')', 'artisan key:generate', 'php -v', '@auth', '@guest',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.6 + 0.2);
      this.r  = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = ['#ff4757','#4ecdc4','#00d68f','#a855f7','#ff6b35','#ffd32a'][Math.floor(Math.random()*6)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  class CodeSnippet {
    constructor() { this.reset(true); }
    reset(init) {
      this.text  = CODE_TEXTS[Math.floor(Math.random() * CODE_TEXTS.length)];
      this.x     = Math.random() * W;
      this.y     = init ? Math.random() * H : H + 30;
      this.vy    = -(Math.random() * 0.25 + 0.1);
      this.alpha = Math.random() * 0.12 + 0.04;
      this.size  = Math.random() * 4 + 9;
    }
    update() { this.y += this.vy; if (this.y < -40) this.reset(false); }
    draw() {
      try {
        ctx.font = this.size + 'px Consolas, monospace';
        ctx.fillStyle = '#4ecdc4';
        ctx.globalAlpha = this.alpha;
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
      } catch(e) {}
    }
  }

  function init() {
    resize();
    particles    = Array.from({ length: 60 }, () => new Particle());
    codeSnippets = Array.from({ length: 18 }, () => new CodeSnippet());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(255,71,87,' + ((1 - dist/120) * 0.08) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  let animRunning = true;

  function loop() {
    if (!animRunning) return;
    try {
      ctx.clearRect(0, 0, W, H);
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0,   'rgba(255,71,87,0.02)');
      grad.addColorStop(0.5, 'rgba(78,205,196,0.01)');
      grad.addColorStop(1,   'rgba(168,85,247,0.02)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      drawConnections();
      particles.forEach(p => { p.update(); p.draw(); });
      codeSnippets.forEach(s => { s.update(); s.draw(); });
    } catch(e) { animRunning = false; return; }
    requestAnimationFrame(loop);
  }

  try {
    init();
    loop();
    window.addEventListener('resize', resize);
  } catch(e) {
    // Canvas failed silently — page still works fine without it
  }
})();
