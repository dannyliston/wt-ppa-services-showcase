import { prefersReducedMotion } from '../../utils/perf.js';

export function playEntranceAnimation(hexElements, lineElements) {
  if (prefersReducedMotion) {
    hexElements.forEach(el => { el.style.opacity = '1'; });
    lineElements.forEach(({ line }) => line.classList.add('visible'));
    return;
  }

  const pillarEls = [];
  const catEls = [];
  const svcEls = [];
  hexElements.forEach((el) => {
    const type = el.dataset.type;
    if (type === 'pillar') pillarEls.push(el);
    else if (type === 'category') catEls.push(el);
    else if (type === 'service') svcEls.push(el);
  });

  const catLines = lineElements.filter(l => hexElements.get(l.to)?.dataset.type === 'category');
  const svcLines = lineElements.filter(l => hexElements.get(l.to)?.dataset.type === 'service');

  // Start all hidden with no transition
  hexElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.5)';
    el.style.transition = 'none';
  });

  // Use double setTimeout to ensure style flush before enabling transitions
  setTimeout(() => {
    setTimeout(() => {
      // Enable transitions
      hexElements.forEach(el => {
        el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      });

      // Phase 1: Pillars
      pillarEls.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, i * 100);
      });

      // Phase 2: Category lines + hexes
      const catDelay = 350;
      setTimeout(() => catLines.forEach(l => l.line.classList.add('visible')), catDelay);
      catEls.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, catDelay + i * 70);
      });

      // Phase 3: Service lines + hexes
      const svcDelay = 850;
      setTimeout(() => svcLines.forEach(l => l.line.classList.add('visible')), svcDelay);
      svcEls.forEach((el, i) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, svcDelay + i * 30);
      });

      // Clean up inline styles after animation completes
      const totalDuration = svcDelay + svcEls.length * 30 + 700;
      setTimeout(() => {
        hexElements.forEach(el => {
          el.style.transition = '';
          el.style.transform = '';
          el.style.opacity = '';
        });
      }, totalDuration);
    }, 0);
  }, 0);
}
