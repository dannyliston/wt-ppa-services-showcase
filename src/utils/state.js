const state = {
  activeFilters: [],
  focusedPillar: null,
  focusedCategory: null,
  selectedService: null,
  detailPanelOpen: false,
  toggles: {
    connections: false,
    sectorLens: null,
    guidedTour: false,
    digitalHighlight: false,
  },
  tourState: { active: false, paused: false, currentStep: 0 },
};

const listeners = new Map();

export function getState() { return state; }

export function setState(updates) {
  Object.assign(state, updates);
  listeners.forEach(cb => cb(state));
}

export function setToggle(key, value) {
  state.toggles = { ...state.toggles, [key]: value };
  listeners.forEach(cb => cb(state));
}

export function subscribe(id, callback) {
  listeners.set(id, callback);
  return () => listeners.delete(id);
}
