import { calculateLayout } from './layout.js';
import { pillars, categories, services } from '../../data/services.js';

let gridWidth = 1280;
let gridHeight = 700;

export function renderHexGrid(container) {
  gridWidth = container.clientWidth || container.parentElement?.clientWidth || window.innerWidth || 1280;
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

  // Build a lookup: id → pillarId (for branch colouring)
  const branchOf = {};
  pillars.forEach(p => { branchOf[p.id] = p.id; });
  categories.forEach(c => { branchOf[c.id] = c.pillarId; });
  services.forEach(s => {
    const cat = categories.find(c => c.id === s.categoryId);
    if (cat) branchOf[s.id] = cat.pillarId;
  });

  // Pillar hexes
  pillars.forEach(p => {
    const pos = positions.get(p.id);
    const el = makeHex(p.id, p.name, pos, 'pillar', p.tagline);
    el.classList.add(`hex--branch-${p.id}`);
    el.dataset.pillar = p.id;
    grid.appendChild(el);
    hexElements.set(p.id, el);
  });

  // Category hexes + lines
  categories.forEach(cat => {
    const pos = positions.get(cat.id);
    const el = makeHex(cat.id, cat.name, pos, 'category');
    el.classList.add(`hex--branch-${cat.pillarId}`);
    grid.appendChild(el);
    hexElements.set(cat.id, el);
    const line = makeLine(svg, positions.get(cat.pillarId), pos);
    line.classList.add(`line--${cat.pillarId}`);
    lineElements.push({ line, from: cat.pillarId, to: cat.id });
  });

  // Service hexes + lines
  services.forEach(svc => {
    const pos = positions.get(svc.id);
    if (!pos) return;
    const cat = categories.find(c => c.id === svc.categoryId);
    const branch = cat ? cat.pillarId : 'clarity';
    const el = makeHex(svc.id, svc.name, pos, 'service');
    el.classList.add(`hex--branch-${branch}`);
    if (svc.digital) el.classList.add('hex--digital');
    grid.appendChild(el);
    hexElements.set(svc.id, el);
    const parentPos = positions.get(svc.categoryId);
    if (parentPos) {
      const line = makeLine(svg, parentPos, pos);
      line.classList.add(`line--${branch}`);
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

  // Update hierarchy lines with edge points
  lineElements.forEach(({ line, from, to }) => {
    const fp = newPositions.get(from);
    const tp = newPositions.get(to);
    if (!fp || !tp) return;
    line.style.transition = `all ${duration}ms cubic-bezier(0.16,1,0.3,1)`;
    const p1 = hexEdgePoint(fp.x, fp.y, fp.size, tp.x, tp.y);
    const p2 = hexEdgePoint(tp.x, tp.y, tp.size, fp.x, fp.y);
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
    const visible = fp.opacity > 0.1 && tp.opacity > 0.1;
    line.classList.toggle('visible', visible);
  });

  // Update cross-links with edge points
  crossLinks.forEach(({ line, from, to }) => {
    const fp = newPositions.get(from);
    const tp = newPositions.get(to);
    if (!fp || !tp) return;
    const p1 = hexEdgePoint(fp.x, fp.y, fp.size, tp.x, tp.y);
    const p2 = hexEdgePoint(tp.x, tp.y, tp.size, fp.x, fp.y);
    line.setAttribute('x1', p1.x);
    line.setAttribute('y1', p1.y);
    line.setAttribute('x2', p2.x);
    line.setAttribute('y2', p2.y);
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
  // Calculate edge points instead of centres
  const p1 = hexEdgePoint(from.x, from.y, from.size, to.x, to.y);
  const p2 = hexEdgePoint(to.x, to.y, to.size, from.x, from.y);
  line.setAttribute('x1', p1.x);
  line.setAttribute('y1', p1.y);
  line.setAttribute('x2', p2.x);
  line.setAttribute('y2', p2.y);
  if (isCross) line.classList.add('cross-link');
  svg.appendChild(line);
  return line;
}

/**
 * Calculate the point on a hex edge closest to a target point.
 * Our hex clip-path is pointy-top:
 *   polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)
 * The DOM element is (size*2) x (size*2) px, so visual radius ≈ size.
 *
 * For a regular pointy-top hexagon, the distance from centre to edge
 * varies with angle. We use the proper hex edge intersection formula.
 */
function hexEdgePoint(cx, cy, dataSize, targetX, targetY) {
  const angle = Math.atan2(targetY - cy, targetX - cx);
  // Visual radius of the hex (half of element width)
  const R = dataSize;
  // Pointy-top hex: vertices at 0°, 60°, 120°, 180°, 240°, 300° (rotated -90°)
  // Edge distance for pointy-top hex at angle θ:
  //   r(θ) = R * cos(30°) / cos(θ mod 60° - 30°)
  // cos(30°) ≈ 0.866
  const sector = ((angle % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3);
  const edgeDist = (R * 0.866) / Math.cos(sector - Math.PI / 6);
  // Clamp and scale slightly inward so lines don't overlap the border
  const r = Math.min(edgeDist, R) * 0.92;
  return {
    x: cx + Math.cos(angle) * r,
    y: cy + Math.sin(angle) * r,
  };
}
