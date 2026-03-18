export const HEX_SIZES = { pillar: 68, category: 52, service: 38 };

export function calculateLayout(width, height, { pillars, categories, services }) {
  const positions = new Map();
  const cx = width / 2;
  const cy = height / 2;

  // 3 C's in a tight triangle — Clarity top, Capability bottom-left, Consistency bottom-right
  const pillarRadius = 80;
  const angles = {
    clarity: -Math.PI / 2,
    capability: -Math.PI / 2 + (2 * Math.PI / 3),
    consistency: -Math.PI / 2 + (4 * Math.PI / 3),
  };

  pillars.forEach(p => {
    positions.set(p.id, {
      x: cx + Math.cos(angles[p.id]) * pillarRadius,
      y: cy + Math.sin(angles[p.id]) * pillarRadius,
      size: HEX_SIZES.pillar, type: 'pillar',
    });
  });

  // Categories radiate from their parent pillar
  const catSpread = 165;
  const catsByPillar = {};
  categories.forEach(c => { (catsByPillar[c.pillarId] ??= []).push(c); });

  Object.entries(catsByPillar).forEach(([pid, cats]) => {
    const pp = positions.get(pid);
    const baseAngle = angles[pid];
    // Spread categories in a fan centred on the outward direction
    const span = cats.length <= 2 ? Math.PI * 0.5 : Math.PI * 0.7;
    const start = baseAngle - span / 2;
    cats.forEach((cat, i) => {
      const a = cats.length === 1 ? baseAngle : start + (i / (cats.length - 1)) * span;
      positions.set(cat.id, {
        x: pp.x + Math.cos(a) * catSpread,
        y: pp.y + Math.sin(a) * catSpread,
        size: HEX_SIZES.category, type: 'category',
      });
    });
  });

  // Services radiate from their parent category
  const svcSpread = 95;
  const svcsByCat = {};
  services.forEach(s => { (svcsByCat[s.categoryId] ??= []).push(s); });

  Object.entries(svcsByCat).forEach(([cid, svcs]) => {
    const cp = positions.get(cid);
    if (!cp) return;
    const cat = categories.find(c => c.id === cid);
    const pp = positions.get(cat.pillarId);
    const outAngle = Math.atan2(cp.y - pp.y, cp.x - pp.x);
    // Fan width scales with number of children
    const span = Math.PI * (0.25 + svcs.length * 0.12);
    const start = outAngle - span / 2;
    svcs.forEach((svc, i) => {
      const a = svcs.length === 1 ? outAngle : start + (i / (svcs.length - 1)) * span;
      positions.set(svc.id, {
        x: cp.x + Math.cos(a) * svcSpread,
        y: cp.y + Math.sin(a) * svcSpread,
        size: HEX_SIZES.service, type: 'service',
      });
    });
  });

  // Recenter: find bounding box of all positions and translate to fit viewport
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  positions.forEach(pos => {
    const pad = pos.size;
    minX = Math.min(minX, pos.x - pad);
    maxX = Math.max(maxX, pos.x + pad);
    minY = Math.min(minY, pos.y - pad);
    maxY = Math.max(maxY, pos.y + pad);
  });

  const gridW = maxX - minX;
  const gridH = maxY - minY;
  const padding = 30;
  const availW = width - padding * 2;
  const availH = height - padding * 2;
  const scale = Math.min(availW / gridW, availH / gridH, 1); // Don't scale up

  const gridCx = (minX + maxX) / 2;
  const gridCy = (minY + maxY) / 2;
  const offsetX = cx - gridCx;
  const offsetY = cy - gridCy;

  positions.forEach(pos => {
    // Translate to centre, then scale around viewport centre
    pos.x = cx + (pos.x + offsetX - cx) * scale;
    pos.y = cy + (pos.y + offsetY - cy) * scale;
    pos.size = Math.round(pos.size * scale);
  });

  return positions;
}
