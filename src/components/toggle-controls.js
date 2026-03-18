import { setToggle, subscribe } from '../utils/state.js';
import { sectors } from '../data/sectors.js';

export function initToggleControls(container) {
  const panel = document.createElement('div');
  panel.className = 'toggle-panel';
  panel.innerHTML = `
    <button class="toggle-panel__trigger" aria-label="View options">&#9881;</button>
    <div class="toggle-panel__body">
      <label class="toggle-item"><input type="checkbox" data-toggle="connections" /> Connections</label>
      <label class="toggle-item"><input type="checkbox" data-toggle="digitalHighlight" /> Digital</label>
      <div class="toggle-item">
        <select data-toggle="sectorLens">
          <option value="">Sector Lens</option>
          ${sectors.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
      </div>
    </div>
  `;
  container.appendChild(panel);

  panel.querySelector('.toggle-panel__trigger').addEventListener('click', () => {
    panel.classList.toggle('toggle-panel--open');
  });

  panel.querySelectorAll('input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => setToggle(input.dataset.toggle, input.checked));
  });

  panel.querySelector('select').addEventListener('change', (e) => {
    setToggle('sectorLens', e.target.value || null);
  });

  // Sync connections toggle with cross-link visibility
  subscribe('toggle-connections', (state) => {
    document.querySelectorAll('.cross-link').forEach(line => {
      line.classList.toggle('visible', state.toggles.connections);
    });
  });
}
