import { prefersReducedMotion } from '../../utils/perf.js';

export function playEntranceAnimation(hexElements, lineElements) {
  // In the new collapsed layout, services start at opacity 0 (hidden).
  // We animate pillars and categories appearing; services stay hidden until expand.

  const pillarEls = [];
  const catEls = [];
  hexElements.forEach((el) => {
    const type = el.dataset.type;
    if (type === 'pillar') pillarEls.push(el);
    else if (type === 'category') catEls.push(el);
    // Services stay at their initial opacity (0) — no entrance animation for them
  });

  const catLines = lineElements.filter(l => hexElements.get(l.to)?.dataset.type === 'category');

  if (prefersReducedMotion) {
    // Just show everything at its target opacity
    return;
  }

  // Temporarily hide pillars and categories for entrance animation
  pillarEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.5)';
    el.style.transition = 'none';
  });
  catEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.5)';
    el.style.transition = 'none';
  });

  setTimeout(() => {
    setTimeout(() => {
      const trans = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)';

      // Phase 1: Pillars
      pillarEls.forEach((el, i) => {
        el.style.transition = trans;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'scale(1)';
        }, i * 120);
      });

      // Phase 2: Category lines + hexes
      const catDelay = 400;
      setTimeout(() => catLines.forEach(l => l.line.classList.add('visible')), catDelay);
      catEls.forEach((el, i) => {
        el.style.transition = trans;
        setTimeout(() => {
          el.style.opacity = '0.7'; // Default opacity for categories in collapsed state
          el.style.transform = 'scale(1)';
        }, catDelay + i * 80);
      });

      // Clean up
      const totalDuration = catDelay + catEls.length * 80 + 600;
      setTimeout(() => {
        [...pillarEls, ...catEls].forEach(el => {
          el.style.transition = '';
          el.style.transform = '';
        });
      }, totalDuration);
    }, 0);
  }, 0);
}
