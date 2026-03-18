import { getState, setState, subscribe } from '../../utils/state.js';
import { categories, services } from '../../data/services.js';
import { sectorServiceMap } from '../../data/sectors.js';
import { calculateLayout, calculatePillarFocusLayout, calculateCategoryFocusLayout } from './layout.js';
import { animateToPositions, getGridDimensions } from './renderer.js';

let _hexElements, _lineElements, _crossLinks, _grid;

export function initHexInteractions(hexElements, lineElements, crossLinks, grid) {
  _hexElements = hexElements;
  _lineElements = lineElements;
  _crossLinks = crossLinks;
  _grid = grid;

  hexElements.forEach((el, id) => {
    const handler = () => handleClick(id);
    el.addEventListener('click', (e) => { e.stopPropagation(); handler(); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  grid.addEventListener('click', (e) => {
    if (e.target === grid || e.target.closest('svg')) resetToDefault();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') resetToDefault(); });

  subscribe('hex-vis', (state) => applyFilters(state));
}

function handleClick(id) {
  const el = _hexElements.get(id);
  const type = el.dataset.type;
  const state = getState();
  const { width, height } = getGridDimensions();

  if (type === 'pillar') {
    if (state.focusedPillar === id) {
      // Collapse back
      resetToDefault();
    } else {
      // Expand this pillar's branch
      const newPos = calculatePillarFocusLayout(width, height, id);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
      setState({ focusedPillar: id, focusedCategory: null, selectedService: null, detailPanelOpen: false });
    }
  } else if (type === 'category') {
    if (state.focusedCategory === id) {
      // Go back to pillar focus
      const cat = categories.find(c => c.id === id);
      const newPos = calculatePillarFocusLayout(width, height, cat.pillarId);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
      setState({ focusedCategory: null });
    } else {
      // Expand this category
      const newPos = calculateCategoryFocusLayout(width, height, id);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
      const cat = categories.find(c => c.id === id);
      setState({ focusedPillar: cat.pillarId, focusedCategory: id });
    }
  } else if (type === 'service') {
    if (el.classList.contains('hex--dimmed')) setState({ activeFilters: [] });
    setState({ selectedService: id, detailPanelOpen: true });
  }
}

function resetToDefault() {
  const { width, height } = getGridDimensions();
  const newPos = calculateLayout(width, height);
  animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
  setState({ focusedPillar: null, focusedCategory: null, selectedService: null, detailPanelOpen: false });
}

function applyFilters(state) {
  const { selectedService, detailPanelOpen, activeFilters, toggles } = state;
  const sectorServices = toggles.sectorLens ? (sectorServiceMap[toggles.sectorLens] || []) : null;

  const grid = document.getElementById('hex-grid');
  if (grid) grid.classList.toggle('hex-grid--shifted', detailPanelOpen);

  _hexElements.forEach((el, id) => {
    const type = el.dataset.type;
    let dimmed = false;

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
