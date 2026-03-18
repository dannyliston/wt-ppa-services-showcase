import { prefersReducedMotion, isLowPerformance } from '../utils/perf.js';

export function initParticles(canvas) {
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles, mouseX = 0, mouseY = 0;
  const count = isLowPerformance() ? 25 : 50;

  function resize() {
    w = canvas.width = canvas.parentElement.clientWidth;
    h = canvas.height = canvas.parentElement.clientHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      // Mouse parallax
      const dx = (mouseX - w / 2) * 0.005;
      const dy = (mouseY - h / 2) * 0.005;

      p.x += p.vx + dx * p.size * 0.2;
      p.y += p.vy + dy * p.size * 0.2;

      // Wrap
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 135, 207, ${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.parentElement.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  window.addEventListener('resize', resize);
  init();
  draw();
}
