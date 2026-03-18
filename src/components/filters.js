import { getState, setState, subscribe } from '../utils/state.js';

export function renderFilters(container) {
  const div = document.createElement('div');
  div.className = 'filters';
  div.innerHTML = ['people', 'process', 'technology'].map(t =>
    `<button class="filter-btn filter-btn--${t}" data-tag="${t}">${t}</button>`
  ).join('');
  container.parentElement.insertBefore(div, container);

  div.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const filters = [...getState().activeFilters];
      const idx = filters.indexOf(tag);
      if (idx >= 0) filters.splice(idx, 1); else filters.push(tag);
      setState({ activeFilters: filters });
    });
  });

  subscribe('filters-ui', (state) => {
    div.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', state.activeFilters.includes(btn.dataset.tag));
    });
  });
}
