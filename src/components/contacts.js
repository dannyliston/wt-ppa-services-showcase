import { contacts } from '../data/services.js';

export function renderContacts(container) {
  container.innerHTML = `
    <section class="contacts">
      <h2 class="contacts__title">Our Team</h2>
      <div class="contacts__grid">
        ${contacts.map(c => `
          <div class="contact-card">
            <div class="contact-card__name">${c.name}</div>
            <div class="contact-card__role">${c.role}</div>
            <a class="contact-card__email" href="mailto:${c.email}">${c.email}</a>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
