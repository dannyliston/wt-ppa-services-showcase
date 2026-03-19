import { getState, setState, subscribe } from '../../utils/state.js';
import { categories, services } from '../../data/services.js';
import { sectorServiceMap } from '../../data/sectors.js';
import { calculateLayout, calculatePillarFocusLayout, calculateCategoryFocusLayout, calculateFilterLayout } from './layout.js';
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

  subscribe('hex-vis', (state) => applyState(state));
}

function handleClick(id) {
  const el = _hexElements.get(id);
  const type = el.dataset.type;
  const state = getState();
  const { width, height } = getGridDimensions();

  if (type === 'pillar') {
    if (state.focusedPillar === id) {
      resetToDefault();
    } else {
      const newPos = calculatePillarFocusLayout(width, height, id);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
      setState({ focusedPillar: id, focusedCategory: null, selectedService: null, detailPanelOpen: false, activeFilters: [] });
    }
  } else if (type === 'category') {
    if (state.focusedCategory === id) {
      const cat = categories.find(c => c.id === id);
      const newPos = calculatePillarFocusLayout(width, height, cat.pillarId);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
      setState({ focusedCategory: null });
    } else {
      const newPos = calculateCategoryFocusLayout(width, height, id);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
      const cat = categories.find(c => c.id === id);
      setState({ focusedPillar: cat.pillarId, focusedCategory: id });
    }
  } else if (type === 'service') {
    setState({ selectedService: id, detailPanelOpen: true });
  }
}

function resetToDefault() {
  const { width, height } = getGridDimensions();
  const newPos = calculateLayout(width, height);
  animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
  setState({ focusedPillar: null, focusedCategory: null, selectedService: null, detailPanelOpen: false, activeFilters: [] });
}

/** Called when filters change — triggers layout recalculation */
export function applyFilterLayout(activeFilters) {
  const { width, height } = getGridDimensions();
  if (activeFilters.length === 0) {
    // No filters — go back to default or current focus
    const state = getState();
    if (state.focusedPillar) {
      const newPos = calculatePillarFocusLayout(width, height, state.focusedPillar);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
    } else {
      const newPos = calculateLayout(width, height);
      animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
    }
  } else {
    // Filter active — show cross-cutting filter view
    const newPos = calculateFilterLayout(width, height, activeFilters);
    animateToPositions(newPos, _hexElements, _lineElements, _crossLinks);
  }
}

function applyState(state) {
  const { selectedService, detailPanelOpen, toggles } = state;

  // Note: grid transform (shift + zoom) is managed by zoom.js via state subscription

  // Digital highlight
  _hexElements.forEach((el, id) => {
    el.classList.toggle('digital-active', !!toggles.digitalHighlight);
    el.classList.toggle('hex--selected', id === selectedService);
  });
}
