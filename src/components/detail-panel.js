import { services, getPillarForService, getContactForService } from '../data/services.js';
import { getState, setState, subscribe } from '../utils/state.js';

let panelEl = null;

export function initDetailPanel() {
  panelEl = document.createElement('div');
  panelEl.className = 'detail-panel';
  panelEl.innerHTML = `<button class="detail-panel__close" aria-label="Close">&times;</button><div class="detail-panel__inner"></div>`;
  document.body.appendChild(panelEl);

  panelEl.querySelector('.detail-panel__close').addEventListener('click', close);

  subscribe('detail-panel', (state) => {
    if (state.detailPanelOpen && state.selectedService) {
      render(state.selectedService);
      panelEl.classList.add('detail-panel--open');
    } else {
      panelEl.classList.remove('detail-panel--open');
    }
  });
}

function close() { setState({ selectedService: null, detailPanelOpen: false }); }

function render(serviceId) {
  const svc = services.find(s => s.id === serviceId);
  if (!svc) return;
  const pillar = getPillarForService(serviceId);
  const contact = getContactForService(serviceId);
  const inner = panelEl.querySelector('.detail-panel__inner');

  inner.innerHTML = `
    <div class="detail-panel__badge detail-panel__badge--${pillar?.id || ''}">${pillar?.name || ''}</div>
    <h2 class="detail-panel__name">${svc.name}</h2>
    <div class="detail-panel__tags">
      ${svc.tags.map(t => `<span class="detail-panel__tag detail-panel__tag--${t}">${t}</span>`).join('')}
    </div>
    <p class="detail-panel__value">${svc.valueStatement}</p>
    <ul class="detail-panel__bullets">
      ${svc.bullets.map(b => `<li>${b}</li>`).join('')}
    </ul>
    ${svc.relatedIds.length ? `
      <div class="detail-panel__section-title">Related Services</div>
      <div class="detail-panel__related">
        ${svc.relatedIds.map(rid => {
          const r = services.find(s => s.id === rid);
          return r ? `<button class="detail-panel__related-btn" data-id="${rid}">${r.name}</button>` : '';
        }).join('')}
      </div>
    ` : ''}
    <div class="detail-panel__section-title">Contact</div>
    <div class="detail-panel__contact">
      <div class="detail-panel__contact-name">${contact.name}</div>
      <div class="detail-panel__contact-role">${contact.role}</div>
      <a class="detail-panel__contact-email" href="mailto:${contact.email}">${contact.email}</a>
    </div>
  `;

  inner.querySelectorAll('.detail-panel__related-btn').forEach(btn => {
    btn.addEventListener('click', () => setState({ selectedService: btn.dataset.id }));
  });
}
