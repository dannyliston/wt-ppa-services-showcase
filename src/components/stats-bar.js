import { prefersReducedMotion } from '../utils/perf.js';

const stats = [
  { value: 75, suffix: '+', label: 'Years of experience' },
  { value: 2000, suffix: '+', label: 'Staff globally' },
  { value: 500, suffix: '+', label: 'Specialists in Australia' },
  { value: 70, suffix: '+', label: 'Offices worldwide' },
  { value: 12, suffix: '', label: 'Offices nationwide' },
];

export function renderStatsBar(container) {
  container.innerHTML = `<section class="stats-bar">${stats.map(s => `
    <div class="stat">
      <div class="stat__number" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
      <div class="stat__label">${s.label}</div>
    </div>`).join('')}</section>`;

  if (prefersReducedMotion) {
    container.querySelectorAll('.stat__number').forEach(el => {
      el.textContent = Number(el.dataset.target).toLocaleString() + el.dataset.suffix;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { countUp(container); observer.disconnect(); }
    });
  }, { threshold: 0.3 });
  observer.observe(container.querySelector('.stats-bar'));
}

function countUp(container) {
  container.querySelectorAll('.stat__number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix;
    const start = performance.now();
    const dur = 2200;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  });
}
