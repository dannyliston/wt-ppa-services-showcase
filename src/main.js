import './styles/app.css';
import { renderHexGrid } from './components/hex-grid/renderer.js';
import { playEntranceAnimation } from './components/hex-grid/animations.js';
import { initHexInteractions } from './components/hex-grid/interactions.js';
import { initDetailPanel } from './components/detail-panel.js';
import { renderFilters } from './components/filters.js';
import { initToggleControls } from './components/toggle-controls.js';
import { initGuidedTour } from './components/guided-tour.js';
import { initParticles } from './components/particles.js';
import { renderStatsBar } from './components/stats-bar.js';
import { renderCaseStudies } from './components/case-studies.js';
import { renderContacts } from './components/contacts.js';
import { detectLowPerformance } from './utils/perf.js';
import { pillars, categories, services } from './data/services.js';

document.addEventListener('DOMContentLoaded', () => {
  detectLowPerformance();

  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="header">
      <div class="header__logo">
        <div class="header__logo-mark">WT</div>
        <div>
          <div class="header__title">Portfolio & Program Advisory</div>
          <div class="header__tagline">Empowering growth.</div>
        </div>
      </div>
    </header>

    <main>
      <section class="hex-section" id="hex-section">
        <canvas class="hex-canvas" id="particle-canvas"></canvas>
        <div id="hex-grid-container" style="width:100%;height:700px;position:relative;z-index:2;"></div>
      </section>

      <div id="stats-container"></div>
      <div id="case-studies-container"></div>
      <div id="contacts-container"></div>
    </main>

    <footer class="footer">
      <div class="header__logo-mark" style="width:36px;height:36px;font-size:13px;">WT</div>
      <span class="footer__tagline">Empowering growth.</span>
      <span>&copy; ${new Date().getFullYear()} WT Partnership</span>
    </footer>

    <div class="mobile-accordion" id="mobile-accordion" style="display:none;"></div>
  `;

  const gridContainer = document.getElementById('hex-grid-container');
  const hexSection = document.getElementById('hex-section');
  const { hexElements, lineElements, crossLinks, positions, grid, svg } = renderHexGrid(gridContainer);

  // Init everything BEFORE animation — so interactions work even if animation fails
  renderFilters(hexSection);
  initToggleControls(hexSection);
  initDetailPanel();
  initHexInteractions(hexElements, grid);
  initGuidedTour(hexSection, hexElements);

  // Hide loader, show app
  document.getElementById('loader').style.display = 'none';
  app.style.display = 'block';

  // Entrance animation (fire and forget — don't block)
  playEntranceAnimation(hexElements, lineElements);

  // Particles
  initParticles(document.getElementById('particle-canvas'));

  // Remaining sections
  renderStatsBar(document.getElementById('stats-container'));
  renderCaseStudies(document.getElementById('case-studies-container'));
  renderContacts(document.getElementById('contacts-container'));

  // Mobile accordion fallback
  buildMobileAccordion();
});

function buildMobileAccordion() {
  const container = document.getElementById('mobile-accordion');
  container.innerHTML = pillars.map(p => {
    const cats = categories.filter(c => c.pillarId === p.id);
    return `
      <div style="padding:20px;border-bottom:1px solid rgba(255,255,255,0.06);">
        <h3 style="color:var(--wt-yellow);font-size:1.2rem;margin-bottom:4px;">${p.name}</h3>
        <p style="color:var(--text-secondary);font-size:0.8rem;margin-bottom:16px;">${p.tagline}</p>
        ${cats.map(cat => {
          const svcs = services.filter(s => s.categoryId === cat.id);
          return `
            <div style="margin-bottom:12px;">
              <h4 style="color:var(--process-blue);font-size:0.9rem;margin-bottom:8px;">${cat.name}</h4>
              ${svcs.map(s => `<div style="padding:6px 0 6px 16px;font-size:0.85rem;color:var(--text-primary);border-left:2px solid var(--bg-tertiary);">${s.name}</div>`).join('')}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');
}
