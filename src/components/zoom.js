import { getState, subscribe } from '../utils/state.js';

let currentZoom = 1;
let gridEl = null;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.08;

export function initZoom(hexSection) {
  gridEl = hexSection.querySelector('.hex-grid');
  if (!gridEl) return;

  hexSection.addEventListener('wheel', (e) => {
    // Only zoom if the wheel event is on the hex section
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, currentZoom + delta));
    applyTransform();
  }, { passive: false });

  // Subscribe to state changes to handle detail panel shift
  subscribe('zoom-transform', () => applyTransform());
}

function applyTransform() {
  if (!gridEl) return;
  const state = getState();

  if (state.detailPanelOpen) {
    // When detail panel is open, shift left and scale down, combined with zoom
    gridEl.style.transform = `translateX(-22%) scale(${0.78 * currentZoom})`;
  } else {
    // Normal: just zoom, centred
    gridEl.style.transform = `scale(${currentZoom})`;
  }
}

export function getZoom() { return currentZoom; }
export function resetZoom() { currentZoom = 1; applyTransform(); }
