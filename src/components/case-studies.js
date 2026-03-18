import { caseStudies } from '../data/case-studies.js';
import { services } from '../data/services.js';

let modalEl = null;

export function renderCaseStudies(container) {
  container.innerHTML = `
    <section class="case-studies">
      <h2 class="case-studies__title">Our Experience</h2>
      <div class="case-studies__scroll">
        ${caseStudies.map(cs => `
          <div class="case-card" data-id="${cs.id}">
            <div class="case-card__name">${cs.name}</div>
            <div class="case-card__location">${cs.location}</div>
            <div class="case-card__sector">${cs.sector}</div>
            <div class="case-card__services">
              ${cs.serviceIds.map(sid => {
                const svc = services.find(s => s.id === sid);
                return svc ? `<span class="case-card__service-tag">${svc.name}</span>` : '';
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;

  // Modal
  modalEl = document.createElement('div');
  modalEl.className = 'case-modal';
  modalEl.innerHTML = `<div class="case-modal__content"><button class="case-modal__close">&times;</button><div class="case-modal__body"></div></div>`;
  document.body.appendChild(modalEl);

  modalEl.querySelector('.case-modal__close').addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeModal(); });

  container.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', () => {
      const cs = caseStudies.find(c => c.id === card.dataset.id);
      if (cs) openModal(cs);
    });
  });
}

function openModal(cs) {
  const body = modalEl.querySelector('.case-modal__body');
  body.innerHTML = `
    <div class="detail-panel__badge" style="margin-bottom:16px">${cs.sector}</div>
    <h2 class="detail-panel__name">${cs.name}</h2>
    <p class="detail-panel__value">${cs.location} — Placeholder case study details. Content to be provided.</p>
    <div class="detail-panel__section-title">Services Delivered</div>
    <div class="detail-panel__related">
      ${cs.serviceIds.map(sid => {
        const svc = services.find(s => s.id === sid);
        return svc ? `<span class="detail-panel__related-btn">${svc.name}</span>` : '';
      }).join('')}
    </div>
  `;
  modalEl.classList.add('case-modal--open');
}

function closeModal() { modalEl.classList.remove('case-modal--open'); }
