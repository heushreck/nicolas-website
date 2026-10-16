// pixel.js — one renderer for every sprite-data module. Each module brings its own
// PALETTE, so sprites remember which palette they were registered with.

const REG = {};          // name -> { rows, palette }
const RUNS = {};         // name -> [colour, x, y, length][]
const URLS = new Map();
export const ANIMS = {};
export const ANCHORS = {};

export function register(mod) {
  for (const [name, rows] of Object.entries(mod.SPRITES)) { REG[name] = { rows, palette: mod.PALETTE }; delete RUNS[name]; }
  Object.assign(ANIMS, mod.ANIMS || {});
  for (const [name, a] of Object.entries(mod.ANCHORS || {})) ANCHORS[name] = { ...ANCHORS[name], ...a };
}

export const has = name => name in REG;

export function size(name) {
  const s = REG[name];
  if (!s) throw new Error(`Unknown sprite: ${name}`);
  return { w: s.rows[0].length, h: s.rows.length };
}

function runs(name) {
  if (RUNS[name]) return RUNS[name];
  const { rows, palette } = REG[name];
  const r = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const c = row[x];
      let len = 1;
      while (row[x + len] === c) len++;
      if (c !== '.') r.push([palette[c], x, y, len]);
      x += len;
    }
  });
  return (RUNS[name] = r);
}

export function draw(ctx, name, x, y, scale = 1, flip = false) {
  const { w } = size(name);
  const ox = Math.round(x), oy = Math.round(y), s = Math.max(1, Math.round(scale));
  for (const [col, rx, ry, len] of runs(name)) {
    ctx.fillStyle = col;
    ctx.fillRect(ox + (flip ? w - rx - len : rx) * s, oy + ry * s, len * s, s);
  }
}

// Draw with the sprite's bottom-centre at (cx, by). Returns the top-left it was drawn at.
export function drawAt(ctx, name, cx, by, scale = 1, flip = false) {
  const { w, h } = size(name), s = Math.max(1, Math.round(scale));
  const x = Math.round(cx - (w * s) / 2), y = Math.round(by - h * s);
  draw(ctx, name, x, y, s, flip);
  return { x, y };
}

// Anchor point of a sprite drawn with drawAt(), in canvas coordinates (or null).
export function anchorAt(name, kind, cx, by, scale = 1, flip = false) {
  const a = ANCHORS[name]?.[kind];
  if (!a || !has(name)) return null;
  const { w, h } = size(name), s = Math.max(1, Math.round(scale));
  const ax = flip ? w - 1 - a[0] : a[0];
  return [Math.round(cx - (w * s) / 2) + (ax + 0.5) * s, Math.round(by - h * s) + (a[1] + 0.5) * s];
}

export function dataURL(name, scale = 4, flip = false) {
  const key = `${name}|${scale}|${+flip}`;
  if (!URLS.has(key)) {
    const { w, h } = size(name), cv = document.createElement('canvas');
    cv.width = w * scale; cv.height = h * scale;
    draw(cv.getContext('2d'), name, 0, 0, scale, flip);
    URLS.set(key, cv.toDataURL('image/png'));
  }
  return URLS.get(key);
}

// Frame of an animation at time t (ms since it started). loop=false holds the last frame.
export function frameAt(anim, t, loop = true) {
  const a = typeof anim === 'string' ? ANIMS[anim] : anim;
  if (!a) return null;
  const i = Math.floor(Math.max(0, t) / a.ms);
  return a.frames[loop ? i % a.frames.length : Math.min(i, a.frames.length - 1)];
}
export const hasAnim = anim => { const a = typeof anim === 'string' ? ANIMS[anim] : anim; return !!a && a.frames.every(has); };
