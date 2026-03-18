import { calculateLayout } from './layout.js';
import { pillars, categories, services } from '../../data/services.js';

let gridWidth = 1280;
let gridHeight = 700;

export function renderHexGrid(container) {
  gridWidth = container.clientWidth || 1280;
  gridHeight = 700;

  const grid = document.createElement('div');
  grid.className = 'hex-grid';
  grid.id = 'hex-grid';
  container.appendChild(grid);

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('hex-grid__svg');
  svg.setAttribute('viewBox', `0 0 ${gridWidth} ${gridHeight}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  grid.appendChild(svg);

  const positions = calculateLayout(gridWidth, gridHeight);
  const hexElements = new Map();
  const lineElements = [];

  // Pillar hexes
  pillars.forEach(p => {
    const pos = positions.get(p.id);
    const el = makeHex(p.id, p.name, pos, 'pillar', p.tagline);
    grid.appendChild(el);
    hexElements.set(p.id, el);
  });

  // Category hexes + lines
  categories.forEach(cat => {
    const pos = positions.get(cat.id);
    const el = makeHex(cat.id, cat.name, pos, 'category');
    grid.appendChild(el);
    hexElements.set(cat.id, el);
    const line = makeLine(svg, positions.get(cat.pillarId), pos);
    lineElements.push({ line, from: cat.pillarId, to: cat.id });
  });

  // Service hexes + lines
  services.forEach(svc => {
    const pos = positions.get(svc.id);
    if (!pos) return;
    const el = makeHex(svc.id, svc.name, pos, 'service');
    if (svc.digital) el.classList.add('hex--digital');
    grid.appendChild(el);
    hexElements.set(svc.id, el);
    const parentPos = positions.get(svc.categoryId);
    if (parentPos) {
      const line = makeLine(svg, parentPos, pos);
      lineElements.push({ line, from: svc.categoryId, to: svc.id });
    }
  });

  // Cross-C relationship lines
  const crossLinks = [];
  const drawn = new Set();
  services.forEach(svc => {
    svc.relatedIds.forEach(rid => {
      const key = [svc.id, rid].sort().join('--');
      if (drawn.has(key)) return;
      drawn.add(key);
      const from = positions.get(svc.id);
      const to = positions.get(rid);
      if (from && to) {
        const line = makeLine(svg, from, to, true);
        crossLinks.push({ line, from: svc.id, to: rid });
      }
    });
  });

  return { hexElements, lineElements, crossLinks, positions, grid, svg, gridWidth, gridHeight };
}

/** Animate all hexes + lines to new positions */
export function animateToPositions(newPositions, hexElements, lineElements, crossLinks, svg) {
  const duration = 500;

  hexElements.forEach((el, id) => {
    const pos = newPositions.get(id);
    if (!pos) return;
    const size = pos.size * 2;

    el.style.transition = `left ${duration}ms cubic-bezier(0.16,1,0.3,1), top ${duration}ms cubic-bezier(0.16,1,0.3,1), width ${duration}ms cubic-bezier(0.16,1,0.3,1), height ${duration}ms cubic-bezier(0.16,1,0.3,1), opacity ${duration}ms ease-out`;
    el.style.left = `${pos.x - size / 2}px`;
    el.style.top = `${pos.y - size / 2}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.opacity = String(pos.opacity);
    el.style.pointerEvents = pos.opacity > 0.1 ? 'auto' : 'none';
    el.classList.toggle('hex--hidden', pos.opacity <= 0.05);
  });

  // Update hierarchy lines
  lineElements.forEach(({ line, from, to }) => {
    const fp = newPositions.get(from);
    const tp = newPositions.get(to);
    if (!fp || !tp) return;
    line.style.transition = `all ${duration}ms cubic-bezier(0.16,1,0.3,1)`;
    line.setAttribute('x1', fp.x);
    line.setAttribute('y1', fp.y);
    line.setAttribute('x2', tp.x);
    line.setAttribute('y2', tp.y);
    // Show line only if both endpoints are visible
    const visible = fp.opacity > 0.1 && tp.opacity > 0.1;
    line.classList.toggle('visible', visible);
  });

  // Update cross-links
  crossLinks.forEach(({ line, from, to }) => {
    const fp = newPositions.get(from);
    const tp = newPositions.get(to);
    if (!fp || !tp) return;
    line.setAttribute('x1', fp.x);
    line.setAttribute('y1', fp.y);
    line.setAttribute('x2', tp.x);
    line.setAttribute('y2', tp.y);
  });

  // Clean up transitions after animation
  setTimeout(() => {
    hexElements.forEach(el => { el.style.transition = ''; });
    lineElements.forEach(({ line }) => { line.style.transition = ''; });
  }, duration + 50);
}

export function getGridDimensions() {
  return { width: gridWidth, height: gridHeight };
}

function makeHex(id, label, pos, type, tagline) {
  const size = pos.size * 2;
  const el = document.createElement('div');
  el.className = `hex hex--${type}`;
  el.dataset.id = id;
  el.dataset.type = type;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${pos.x - size / 2}px`;
  el.style.top = `${pos.y - size / 2}px`;
  el.style.opacity = String(pos.opacity);
  if (pos.opacity <= 0.05) {
    el.style.pointerEvents = 'none';
    el.classList.add('hex--hidden');
  }
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.setAttribute('aria-label', label);

  let inner = `<span class="hex__label">${label}</span>`;
  if (tagline) inner += `<span class="hex__tagline">${tagline}</span>`;
  el.innerHTML = `<div class="hex__content">${inner}</div>`;
  return el;
}

function makeLine(svg, from, to, isCross = false) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', from.x);
  line.setAttribute('y1', from.y);
  line.setAttribute('x2', to.x);
  line.setAttribute('y2', to.y);
  if (isCross) line.classList.add('cross-link');
  svg.appendChild(line);
  return line;
}
