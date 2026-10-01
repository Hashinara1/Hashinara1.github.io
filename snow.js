(function () {
  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let W, H, particles = [];
  let scrollVel = 0, lastScrollY = 0;
  let animationFrame = null;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < 130; i++) {
      particles.push({
        x:           Math.random() * W,
        y:           Math.random() * H,
        r:           Math.random() * 2 + 0.5,
        speed:       Math.random() * 0.6 + 0.3,
        wind:        Math.random() * 0.4 + 0.1,
        opacity:     Math.random() * 0.5 + 0.3,
        wobble:      Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.005
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const parallax = Math.max(-3, Math.min(3, scrollVel * 0.3));

    for (const p of particles) {
      p.wobble += p.wobbleSpeed;
      p.x += p.wind + Math.sin(p.wobble) * 0.3;
      p.y += p.speed + parallax;

      if (p.y > H + 5) { p.y = -5; p.x = Math.random() * W; }
      if (p.x > W + 5)   p.x = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.fill();
    }

    scrollVel *= 0.85;
    animationFrame = requestAnimationFrame(draw);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrame !== null) cancelAnimationFrame(animationFrame);
      animationFrame = null;
      return;
    }

    lastScrollY = window.scrollY;
    if (animationFrame === null) draw();
  });

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    scrollVel = sy - lastScrollY;
    lastScrollY = sy;
  });

  resize();
  initParticles();
  draw();
})();
