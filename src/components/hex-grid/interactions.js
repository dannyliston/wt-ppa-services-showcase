import { getState, setState, subscribe } from '../../utils/state.js';
import { categories, services } from '../../data/services.js';
import { sectorServiceMap } from '../../data/sectors.js';

export function initHexInteractions(hexElements, grid) {
  hexElements.forEach((el, id) => {
    const handler = () => handleClick(id, hexElements);
    el.addEventListener('click', (e) => { e.stopPropagation(); handler(); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  grid.addEventListener('click', (e) => {
    if (e.target === grid || e.target.closest('svg')) reset();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') reset(); });

  subscribe('hex-vis', (state) => applyVisualState(hexElements, state));
}

function handleClick(id, hexElements) {
  const el = hexElements.get(id);
  const type = el.dataset.type;
  const state = getState();

  if (type === 'pillar') {
    setState({
      focusedPillar: state.focusedPillar === id ? null : id,
      focusedCategory: null, selectedService: null, detailPanelOpen: false,
    });
  } else if (type === 'category') {
    setState({ focusedCategory: state.focusedCategory === id ? null : id });
  } else if (type === 'service') {
    if (el.classList.contains('hex--dimmed')) setState({ activeFilters: [] });
    setState({ selectedService: id, detailPanelOpen: true });
  }
}

function reset() {
  setState({ focusedPillar: null, focusedCategory: null, selectedService: null, detailPanelOpen: false });
}

function applyVisualState(hexElements, state) {
  const { focusedPillar, selectedService, detailPanelOpen, activeFilters, toggles } = state;
  const sectorServices = toggles.sectorLens ? (sectorServiceMap[toggles.sectorLens] || []) : null;

  const grid = document.getElementById('hex-grid');
  if (grid) grid.classList.toggle('hex-grid--shifted', detailPanelOpen);

  hexElements.forEach((el, id) => {
    const type = el.dataset.type;
    let dimmed = false;

    // Pillar focus
    if (focusedPillar) {
      const pid = getPillarId(id, type);
      if (pid && pid !== focusedPillar) dimmed = true;
    }

    // Tag filters (services only)
    if (activeFilters.length > 0 && type === 'service') {
      const svc = services.find(s => s.id === id);
      if (svc && !activeFilters.some(f => svc.tags.includes(f))) dimmed = true;
    }

    // Sector lens (services only)
    if (sectorServices && type === 'service') {
      if (!sectorServices.includes(id)) dimmed = true;
    }

    // Digital highlight
    el.classList.toggle('digital-active', !!toggles.digitalHighlight);

    el.classList.toggle('hex--dimmed', dimmed);
    el.classList.toggle('hex--selected', id === selectedService);
  });
}

function getPillarId(id, type) {
  if (type === 'pillar') return id;
  if (type === 'category') return categories.find(c => c.id === id)?.pillarId;
  if (type === 'service') {
    const svc = services.find(s => s.id === id);
    if (!svc) return null;
    return categories.find(c => c.id === svc.categoryId)?.pillarId;
  }
  return null;
}
