export const HEX_SIZES = { pillar: 68, category: 52, service: 38 };

import { pillars, categories, services } from '../../data/services.js';

// Pre-compute relationships
const catsByPillar = {};
categories.forEach(c => { (catsByPillar[c.pillarId] ??= []).push(c); });
const svcsByCat = {};
services.forEach(s => { (svcsByCat[s.categoryId] ??= []).push(s); });

const pillarAngles = {
  clarity: -Math.PI / 2,
  capability: -Math.PI / 2 + (2 * Math.PI / 3),
  consistency: -Math.PI / 2 + (4 * Math.PI / 3),
};

/**
 * Default (collapsed) layout: 3 C's prominent in centre, categories orbiting close,
 * services tucked tight behind categories (barely visible — like dormant nodes).
 */
export function calculateLayout(width, height) {
  const positions = new Map();
  const cx = width / 2;
  const cy = height / 2;

  // Pillars in centre triangle
  const pillarRadius = 75;
  pillars.forEach(p => {
    const a = pillarAngles[p.id];
    positions.set(p.id, {
      x: cx + Math.cos(a) * pillarRadius,
      y: cy + Math.sin(a) * pillarRadius,
      size: HEX_SIZES.pillar, type: 'pillar', opacity: 1,
    });
  });

  // Categories — tight orbit around parent (visible but close)
  const catSpread = 130;
  Object.entries(catsByPillar).forEach(([pid, cats]) => {
    const pp = positions.get(pid);
    const baseAngle = pillarAngles[pid];
    const span = cats.length <= 2 ? Math.PI * 0.45 : Math.PI * 0.65;
    const start = baseAngle - span / 2;
    cats.forEach((cat, i) => {
      const a = cats.length === 1 ? baseAngle : start + (i / (cats.length - 1)) * span;
      positions.set(cat.id, {
        x: pp.x + Math.cos(a) * catSpread,
        y: pp.y + Math.sin(a) * catSpread,
        size: HEX_SIZES.category, type: 'category', opacity: 0.7,
      });
    });
  });

  // Services — collapsed: stacked on top of parent category (hidden/tiny)
  Object.entries(svcsByCat).forEach(([cid, svcs]) => {
    const cp = positions.get(cid);
    if (!cp) return;
    const cat = categories.find(c => c.id === cid);
    const pp = positions.get(cat.pillarId);
    const outAngle = Math.atan2(cp.y - pp.y, cp.x - pp.x);
    svcs.forEach((svc, i) => {
      // Stacked at category position with tiny offset
      const offset = 8 * (i - (svcs.length - 1) / 2);
      positions.set(svc.id, {
        x: cp.x + Math.cos(outAngle) * 15 + offset * 0.3,
        y: cp.y + Math.sin(outAngle) * 15 + offset * 0.3,
        size: HEX_SIZES.service, type: 'service', opacity: 0,
      });
    });
  });

  return fitToViewport(positions, width, height);
}

/**
 * Expanded layout when a pillar is focused: that pillar's branch spreads out fully,
 * other pillars shrink and move to edges.
 */
export function calculatePillarFocusLayout(width, height, focusedPillarId) {
  const positions = new Map();
  const cx = width / 2;
  const cy = height / 2;

  // Focused pillar moves to centre
  pillars.forEach(p => {
    if (p.id === focusedPillarId) {
      positions.set(p.id, {
        x: cx, y: cy - 20,
        size: HEX_SIZES.pillar, type: 'pillar', opacity: 1,
      });
    } else {
      // Other pillars shrink and move to far edges
      const a = pillarAngles[p.id];
      positions.set(p.id, {
        x: cx + Math.cos(a) * 320,
        y: cy + Math.sin(a) * 280,
        size: Math.round(HEX_SIZES.pillar * 0.6), type: 'pillar', opacity: 0.2,
      });
    }
  });

  // Focused pillar's categories expand outward
  const focusedCats = catsByPillar[focusedPillarId] || [];
  const catSpread = 180;
  const baseAngle = pillarAngles[focusedPillarId];
  const catSpan = focusedCats.length <= 2 ? Math.PI * 0.6 : Math.PI * 0.9;
  const catStart = baseAngle - catSpan / 2;

  focusedCats.forEach((cat, i) => {
    const a = focusedCats.length === 1 ? baseAngle : catStart + (i / (focusedCats.length - 1)) * catSpan;
    const pp = positions.get(focusedPillarId);
    positions.set(cat.id, {
      x: pp.x + Math.cos(a) * catSpread,
      y: pp.y + Math.sin(a) * catSpread,
      size: HEX_SIZES.category, type: 'category', opacity: 1,
    });

    // Services for this category — expanded fan
    const svcs = svcsByCat[cat.id] || [];
    const svcSpread = 100;
    const outAngle = a;
    const svcSpan = Math.PI * (0.2 + svcs.length * 0.1);
    const svcStart = outAngle - svcSpan / 2;
    svcs.forEach((svc, j) => {
      const sa = svcs.length === 1 ? outAngle : svcStart + (j / (svcs.length - 1)) * svcSpan;
      const cp = positions.get(cat.id);
      positions.set(svc.id, {
        x: cp.x + Math.cos(sa) * svcSpread,
        y: cp.y + Math.sin(sa) * svcSpread,
        size: HEX_SIZES.service, type: 'service', opacity: 1,
      });
    });
  });

  // Other pillars' categories and services — collapsed and hidden
  Object.entries(catsByPillar).forEach(([pid, cats]) => {
    if (pid === focusedPillarId) return;
    const pp = positions.get(pid);
    cats.forEach(cat => {
      positions.set(cat.id, {
        x: pp.x, y: pp.y,
        size: Math.round(HEX_SIZES.category * 0.5), type: 'category', opacity: 0,
      });
      (svcsByCat[cat.id] || []).forEach(svc => {
        positions.set(svc.id, {
          x: pp.x, y: pp.y,
          size: Math.round(HEX_SIZES.service * 0.5), type: 'service', opacity: 0,
        });
      });
    });
  });

  return fitToViewport(positions, width, height);
}

/**
 * Expanded layout when a specific category is focused.
 * That category + its services expand, siblings stay visible but smaller.
 */
export function calculateCategoryFocusLayout(width, height, focusedCategoryId) {
  const cat = categories.find(c => c.id === focusedCategoryId);
  if (!cat) return calculateLayout(width, height);

  // Start from pillar focus layout
  const positions = calculatePillarFocusLayout(width, height, cat.pillarId);

  // Now boost the focused category's services — spread them wider
  const cp = positions.get(focusedCategoryId);
  const pp = positions.get(cat.pillarId);
  const outAngle = Math.atan2(cp.y - pp.y, cp.x - pp.x);
  const svcs = svcsByCat[focusedCategoryId] || [];
  const svcSpread = 120;
  const svcSpan = Math.PI * (0.25 + svcs.length * 0.12);
  const svcStart = outAngle - svcSpan / 2;

  svcs.forEach((svc, j) => {
    const sa = svcs.length === 1 ? outAngle : svcStart + (j / (svcs.length - 1)) * svcSpan;
    const pos = positions.get(svc.id);
    pos.x = cp.x + Math.cos(sa) * svcSpread;
    pos.y = cp.y + Math.sin(sa) * svcSpread;
    pos.size = HEX_SIZES.service;
    pos.opacity = 1;
  });

  return fitToViewport(positions, width, height);
}

/**
 * Filter layout: shows all services matching given tags, expanded from their categories.
 * All pillars visible. Categories with matching services expand; others dim.
 * This is a cross-cutting view across the whole hierarchy.
 */
export function calculateFilterLayout(width, height, activeTags) {
  const positions = new Map();
  const cx = width / 2;
  const cy = height / 2;

  // All pillars in their standard triangle but slightly wider
  const pillarRadius = 100;
  pillars.forEach(p => {
    const a = pillarAngles[p.id];
    positions.set(p.id, {
      x: cx + Math.cos(a) * pillarRadius,
      y: cy + Math.sin(a) * pillarRadius,
      size: HEX_SIZES.pillar, type: 'pillar', opacity: 1,
    });
  });

  // Determine which services match the filter
  const matchingServiceIds = new Set();
  services.forEach(svc => {
    if (activeTags.some(t => svc.tags.includes(t))) {
      matchingServiceIds.add(svc.id);
    }
  });

  // Determine which categories have matching services
  const activeCategoryIds = new Set();
  services.forEach(svc => {
    if (matchingServiceIds.has(svc.id)) activeCategoryIds.add(svc.categoryId);
  });

  // Categories
  const catSpread = 160;
  Object.entries(catsByPillar).forEach(([pid, cats]) => {
    const pp = positions.get(pid);
    const baseAngle = pillarAngles[pid];
    const span = cats.length <= 2 ? Math.PI * 0.5 : Math.PI * 0.7;
    const start = baseAngle - span / 2;
    cats.forEach((cat, i) => {
      const a = cats.length === 1 ? baseAngle : start + (i / (cats.length - 1)) * span;
      const hasMatch = activeCategoryIds.has(cat.id);
      positions.set(cat.id, {
        x: pp.x + Math.cos(a) * catSpread,
        y: pp.y + Math.sin(a) * catSpread,
        size: HEX_SIZES.category, type: 'category',
        opacity: hasMatch ? 1 : 0.2,
      });
    });
  });

  // Services — expand matching ones, hide non-matching
  Object.entries(svcsByCat).forEach(([cid, svcs]) => {
    const cp = positions.get(cid);
    if (!cp) return;
    const cat = categories.find(c => c.id === cid);
    const pp = positions.get(cat.pillarId);
    const outAngle = Math.atan2(cp.y - pp.y, cp.x - pp.x);

    // Only fan out matching services
    const matchingSvcs = svcs.filter(s => matchingServiceIds.has(s.id));
    const svcSpread = 95;
    const svcSpan = Math.PI * (0.2 + matchingSvcs.length * 0.12);
    const svcStart = outAngle - svcSpan / 2;

    let matchIdx = 0;
    svcs.forEach(svc => {
      if (matchingServiceIds.has(svc.id)) {
        const a = matchingSvcs.length === 1 ? outAngle : svcStart + (matchIdx / Math.max(matchingSvcs.length - 1, 1)) * svcSpan;
        positions.set(svc.id, {
          x: cp.x + Math.cos(a) * svcSpread,
          y: cp.y + Math.sin(a) * svcSpread,
          size: HEX_SIZES.service, type: 'service', opacity: 1,
        });
        matchIdx++;
      } else {
        // Non-matching: collapse to category position
        positions.set(svc.id, {
          x: cp.x, y: cp.y,
          size: Math.round(HEX_SIZES.service * 0.5), type: 'service', opacity: 0,
        });
      }
    });
  });

  return fitToViewport(positions, width, height);
}

/** Fit all visible positions to the viewport, centred using bounding box. */
function fitToViewport(positions, width, height) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  positions.forEach(pos => {
    if (pos.opacity < 0.3) return;
    const pad = pos.size;
    minX = Math.min(minX, pos.x - pad);
    maxX = Math.max(maxX, pos.x + pad);
    minY = Math.min(minY, pos.y - pad);
    maxY = Math.max(maxY, pos.y + pad);
  });

  if (!isFinite(minX)) return positions;

  const gridW = maxX - minX;
  const gridH = maxY - minY;
  const padding = 40;
  const availW = width - padding * 2;
  const availH = height - padding * 2;
  const scale = Math.min(availW / gridW, availH / gridH, 1);

  const cx = width / 2;
  const cy = height / 2;
  const bbCx = (minX + maxX) / 2;
  const bbCy = (minY + maxY) / 2;

  positions.forEach(pos => {
    // Scale around bounding box centre, then translate to viewport centre
    pos.x = cx + (pos.x - bbCx) * scale;
    pos.y = cy + (pos.y - bbCy) * scale;
    pos.size = Math.max(Math.round(pos.size * scale), 20);
  });

  return positions;
}
