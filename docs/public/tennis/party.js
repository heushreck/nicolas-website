// party.js — the post-match celebration: a two-panel comic. Top: the winner's victory
// scene. Bottom: "Meanwhile…" the loser. Scenes come from a per-player shuffled deck so the
// same one doesn't come round again until the others have been shown.
import { register, has, size, drawAt, anchorAt, frameAt, hasAnim, ANIMS } from './pixel.js';

const P = { n: 'nico', f: 'felix' };
const NAME = { n: 'NICOLAS', f: 'FELIX' };
const INK = '#1b1b2a';
const BAG_KEY = 'nf-tennis-party-deck-v1';
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

/* ---------------- drawing helpers ---------------- */
const rect = (ctx, c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
function bands(ctx, R, colors, top = R.y, bottom = R.y + R.h) {
  const h = (bottom - top) / colors.length;
  colors.forEach((c, i) => rect(ctx, c, R.x, top + i * h, R.w, h + 1));
}
function tile(ctx, name, R, by, s) {
  if (!has(name)) return;
  const w = size(name).w * s;
  for (let x = R.x + w / 2; x < R.x + R.w + w; x += w) drawAt(ctx, name, x, by, s);
}
function text(ctx, str, x, y, px, color = '#fff', align = 'center') {
  ctx.font = `${px}px "Press Start 2P", monospace`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(3, px / 3); ctx.strokeStyle = INK; ctx.strokeText(str, x, y);
  ctx.fillStyle = color; ctx.fillText(str, x, y);
}
function bubble(ctx, str, x, y, tail, px = 8, maxW = 150) {
  ctx.font = `${px}px "Press Start 2P", monospace`;
  const words = str.split(' '), lines = [];
  for (const w of words) { const l = lines.at(-1); if (l && ctx.measureText(l + ' ' + w).width < maxW) lines[lines.length - 1] = l + ' ' + w; else lines.push(w); }
  const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 14, bh = lines.length * (px + 6) + 10;
  const bx = Math.round(x - bw / 2), by = Math.round(y - bh);
  ctx.fillStyle = INK;
  ctx.beginPath(); ctx.moveTo(bx + bw * 0.35, by + bh); ctx.lineTo(tail[0], tail[1]); ctx.lineTo(bx + bw * 0.55, by + bh); ctx.fill();
  rect(ctx, INK, bx - 3, by - 3, bw + 6, bh + 6); rect(ctx, '#fff', bx, by, bw, bh);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(bx + bw * 0.38, by + bh - 1); ctx.lineTo(tail[0], tail[1] - 4); ctx.lineTo(bx + bw * 0.52, by + bh - 1); ctx.fill();
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, bx + bw / 2, by + 6 + i * (px + 6)));
}
function caption(ctx, R, str) {
  ctx.font = '8px "Press Start 2P", monospace';
  const w = ctx.measureText(str).width + 14;
  rect(ctx, INK, R.x, R.y, w + 3, 21); rect(ctx, '#fdf3c7', R.x, R.y, w, 18);
  ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(str, R.x + 7, R.y + 10);
}
// Largest integer scale at which every frame of `anim` fits in `h` px (and a share of the width).
function fitScale(anim, h, w, max = 5) {
  const a = ANIMS[anim];
  if (!a) return 2;
  const fh = Math.max(...a.frames.map(f => size(f).h)), fw = Math.max(...a.frames.map(f => size(f).w));
  return Math.max(1, Math.min(max, Math.floor(h / fh), Math.floor(w / fw)));
}
function sunburst(ctx, R, t, c1, c2) {
  rect(ctx, c1, R.x, R.y, R.w, R.h);
  const cx = R.x + R.w / 2, cy = R.y + R.h * 0.62, r = Math.hypot(R.w, R.h), n = 14, rot = t / 4000;
  ctx.fillStyle = c2;
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a + Math.PI / n) * r, cy + Math.sin(a + Math.PI / n) * r);
    ctx.fill();
  }
}
// Simple particle system: {x, y, vx, vy, c, s, g, life, sprite?}
function particles(ctx, st, dt, floorY) {
  st.parts = (st.parts || []).filter(p => (p.life -= dt) > 0);
  for (const p of st.parts) {
    p.vy += (p.g ?? 600) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    if (floorY && p.bounce && p.y > floorY) { p.y = floorY; p.vy *= -p.bounce; p.vx *= 0.7; }
    if (p.sprite && has(p.sprite)) drawAt(ctx, p.sprite, p.x, p.y, p.s);
    else rect(ctx, p.c, p.x, p.y, p.s, p.s);
  }
}
function confetti(ctx, R, st, dt, colors = ['#d9f24b', '#e2483d', '#2e9b57', '#f0be45', '#4f74a8', '#fff']) {
  st.conf ??= Array.from({ length: 46 }, () => ({ x: rnd(0, R.w), y: rnd(-R.h, 0), v: rnd(30, 80), c: pick(colors), s: pick([2, 3, 3, 4]), d: rnd(0, 6) }));
  for (const p of st.conf) {
    p.y += p.v * dt; p.d += dt * 3;
    if (p.y > R.h) { p.y = -6; p.x = rnd(0, R.w); }
    rect(ctx, p.c, R.x + p.x + Math.sin(p.d) * 3, R.y + p.y, p.s, p.s);
  }
}
// Frame of a looping character anim plus whether it just changed (for spawning effects).
function frame(st, anim, t, loop = true) {
  const f = frameAt(anim, t, loop), changed = f !== st.last;
  st.last = f;
  return { f, changed };
}

/* ---------------- victory scenes (top panel) ---------------- */
const WIN = {
  podium: {
    needs: ['win1'],
    caption: w => `${NAME[w]} WINS!`,
    draw(ctx, R, t, w, st) {
      st.anim ??= pick(['win1', 'win2', 'win3'].filter(a => hasAnim(`${P[w]}_${a}`)));
      sunburst(ctx, R, t, '#fff1b8', '#ffe27a');
      const anim = `${P[w]}_${st.anim}`, s = fitScale(anim, R.h - 90, R.w * 0.5, 4);
      const pw = 30 * s, px = R.x + R.w / 2 - pw / 2, py = R.y + R.h - 40;
      rect(ctx, INK, px - 3, py - 3, pw + 6, 46); rect(ctx, '#f0be45', px, py, pw, 46);
      text(ctx, '1', R.x + R.w / 2, py + 21, 16, '#fff');
      const top = drawAt(ctx, frameAt(anim, t), R.x + R.w / 2, py, s);
      if (has('crown') && t > 500) drawAt(ctx, 'crown', R.x + R.w / 2, top.y - 6 + Math.sin(t / 160) * 2, 3);
      confetti(ctx, R, st, st.dt);
    },
  },
  beach: {
    needs: ['beach'],
    caption: w => `${NAME[w]} HITS THE BEACH`,
    draw(ctx, R, t, w, st) {
      const sea = R.y + R.h * 0.5, sand = R.y + R.h * 0.62;
      bands(ctx, R, ['#7cc8f2', '#94d3f5', '#acdef7', '#c6e9fa'], R.y, sea);
      if (hasAnim('sun')) drawAt(ctx, frameAt('sun', t), R.x + R.w - 30, R.y + 54, 2);
      if (hasAnim('gull')) drawAt(ctx, frameAt('gull', t), R.x + ((t / 14) % (R.w + 60)) - 30, R.y + 36 + Math.sin(t / 300) * 4, 2);
      bands(ctx, R, ['#2f8fcf', '#3aa0d8', '#4aa6f0'], sea, sand); // last band = the wave tile's water colour
      if (hasAnim('wave')) tile(ctx, frameAt('wave', t), R, sand + 3, 2);
      bands(ctx, R, ['#f2d48b', '#eccb7a'], sand, R.y + R.h);
      if (hasAnim('palm')) drawAt(ctx, frameAt('palm', t), R.x + 34, R.y + R.h - 8, 2);
      if (has('parasol')) drawAt(ctx, 'parasol', R.x + R.w - 44, R.y + R.h - 10, 2);
      if (has('sandcastle')) drawAt(ctx, 'sandcastle', R.x + R.w - 92, R.y + R.h - 6, 2);
      for (const [i, f] of [[0, 'friend1'], [1, 'friend2']]) if (hasAnim(f)) drawAt(ctx, frameAt(f, t), R.x + R.w * (i ? 0.75 : 0.27), R.y + R.h - 18, 2, !!i);
      // beach ball keeps getting passed between the friends
      if (hasAnim('beachball')) {
        const k = (t % 1600) / 1600, dir = Math.floor(t / 1600) % 2, u = dir ? 1 - k : k;
        drawAt(ctx, frameAt('beachball', t), R.x + R.w * (0.3 + 0.42 * u), R.y + R.h * 0.42 - Math.sin(Math.PI * k) * R.h * 0.25, 2);
      }
      const anim = `${P[w]}_beach`, s = fitScale(anim, R.h - 50, R.w * 0.4, 4);
      drawAt(ctx, frameAt(anim, t), R.x + R.w / 2, R.y + R.h - 6, s);
      if (hasAnim('crab')) drawAt(ctx, frameAt('crab', t), R.x + 20 + ((t / 30) % (R.w - 40)), R.y + R.h - 2, 2);
    },
  },
  wimbledon: {
    needs: ['wimb'],
    caption: w => `${NAME[w]}, WIMBLEDON CHAMPION`,
    draw(ctx, R, t, w, st) {
      rect(ctx, '#20402c', R.x, R.y, R.w, R.h);
      const crowdS = 2, crowdH = has('crowd1') ? size('crowd1').h * crowdS : 0;
      if (hasAnim('crowd')) { tile(ctx, frameAt('crowd', t), R, R.y + crowdH + 4, crowdS); tile(ctx, frameAt('crowd', t + 130), R, R.y + crowdH * 2 - 6, crowdS); }
      const grass = R.y + R.h * 0.62;
      if (has('banner')) tile(ctx, 'banner', R, grass, 2);
      for (let x = R.x, i = 0; x < R.x + R.w; x += 22, i++) rect(ctx, i % 2 ? '#5aa650' : '#4f9a47', x, grass, 22, R.h);
      rect(ctx, '#fff', R.x, R.y + R.h - 14, R.w, 3);
      // camera flashes from the crowd
      st.flashes = (st.flashes || []).filter(f => t - f.t < 90);
      if (Math.random() < 0.08) st.flashes.push({ t, x: rnd(R.x + 10, R.x + R.w - 10), y: rnd(R.y + 8, R.y + crowdH * 1.6) });
      for (const f of st.flashes) if (has('flash')) drawAt(ctx, 'flash', f.x, f.y, 2);
      if (has('bowl')) drawAt(ctx, 'bowl', R.x + R.w - 30, R.y + R.h - 18, 2);
      const anim = `${P[w]}_wimb`, s = fitScale(anim, R.h - 40, R.w * 0.45, 4);
      const { f } = frame(st, anim, t);
      drawAt(ctx, f, R.x + R.w / 2, R.y + R.h - 16, s);
      const lid = anchorAt(f, 'trophy', R.x + R.w / 2, R.y + R.h - 16, s);
      if (lid && has('sparkle') && Math.floor(t / 200) % 2) drawAt(ctx, 'sparkle', lid[0], lid[1] + 4, 2);
      confetti(ctx, R, st, st.dt, ['#5b2a86', '#2e7d32', '#ffffff', '#f0be45']);
    },
  },
  jump: {
    needs: ['jump'],
    caption: w => `${NAME[w]} CAN'T CONTAIN IT`,
    draw(ctx, R, t, w, st) {
      bands(ctx, R, ['#9fd8ff', '#b4e2ff', '#c9ebff', '#def4ff']);
      for (let i = 0; i < 4; i++) {
        const x = R.x + ((i * 97 + t / (40 + i * 10)) % (R.w + 60)) - 30, y = R.y + 20 + i * 18;
        rect(ctx, '#fff', x, y, 34, 8); rect(ctx, '#fff', x + 8, y - 6, 18, 8);
      }
      const floor = R.y + R.h - 20;
      rect(ctx, '#5aa650', R.x, floor, R.w, 20); rect(ctx, '#4f9a47', R.x, floor, R.w, 3);
      const anim = `${P[w]}_jump`, a = ANIMS[anim], s = fitScale(anim, R.h - 74, R.w * 0.4, 4);
      // lift the sprite while an airborne frame (jump3/jump4) is showing
      const cyc = a.frames.length * a.ms, tc = t % cyc, air = a.frames.map((f, i) => /jump[34]$/.test(f) ? i : -1).filter(i => i >= 0);
      const fa = air[0] ?? 2, la = air.at(-1) ?? 4;
      const k = (tc - fa * a.ms) / ((la - fa + 1) * a.ms);
      const lift = k > 0 && k < 1 ? Math.sin(Math.PI * k) * 52 : 0;
      ctx.globalAlpha = 0.25; rect(ctx, INK, R.x + R.w / 2 - 40 + lift / 3, floor - 2, 80 - lift / 1.5, 5); ctx.globalAlpha = 1;
      drawAt(ctx, frameAt(anim, t), R.x + R.w / 2, floor - lift, s);
      if (lift > 40 && has('sparkle')) { drawAt(ctx, 'sparkle', R.x + R.w / 2 - 50, floor - lift - 60, 2); drawAt(ctx, 'sparkle', R.x + R.w / 2 + 52, floor - lift - 30, 2); }
      if (lift > 30) text(ctx, '+1 SET!', R.x + R.w / 2, R.y + 46, 12, '#d9f24b');
    },
  },
  laugh: {
    needs: ['laugh'],
    caption: w => `${NAME[w]} CAN'T STOP LAUGHING`,
    draw(ctx, R, t, w, st) {
      rect(ctx, '#ffe08a', R.x, R.y, R.w, R.h);
      ctx.fillStyle = '#ffd25e';
      for (let y = R.y; y < R.y + R.h; y += 10) for (let x = R.x + (y / 10 % 2) * 5; x < R.x + R.w; x += 10) ctx.fillRect(x, y, 3, 3);
      const floor = R.y + R.h - 14;
      rect(ctx, '#e8b84a', R.x, floor, R.w, 14);
      const anim = `${P[w]}_laugh`, s = fitScale(anim, R.h - 60, R.w * 0.4, 4);
      const cx = R.x + R.w * 0.36;
      drawAt(ctx, frameAt(anim, t), cx, floor, s);
      const l = w === 'n' ? 'f' : 'n', la = hasAnim(`${P[l]}_lose1`) ? `${P[l]}_lose1` : `${P[l]}_idle`;
      drawAt(ctx, frameAt(la, t), R.x + R.w * 0.82, floor, 2, true);
      ['HA!', 'HA HA!', 'HAHA!'].forEach((str, i) => {
        const k = ((t / 1400) + i / 3) % 1;
        ctx.globalAlpha = 1 - k;
        text(ctx, str, cx + 30 + i * 18 + Math.sin(k * 6) * 6, R.y + R.h * 0.5 - k * R.h * 0.4, 10, '#fff');
        ctx.globalAlpha = 1;
      });
    },
  },
  champagne: {
    needs: ['champ'],
    caption: w => `CHAMPAGNE FOR ${NAME[w]}`,
    draw(ctx, R, t, w, st) {
      bands(ctx, R, ['#2a1e4a', '#33245a', '#3d2b6a', '#47327a']);
      ctx.fillStyle = 'rgba(255,240,180,.12)';
      ctx.beginPath(); ctx.moveTo(R.x + R.w / 2 - 20, R.y); ctx.lineTo(R.x + R.w / 2 + 20, R.y); ctx.lineTo(R.x + R.w / 2 + 90, R.y + R.h); ctx.lineTo(R.x + R.w / 2 - 90, R.y + R.h); ctx.fill();
      const floor = R.y + R.h - 12;
      rect(ctx, '#251a40', R.x, floor, R.w, 12);
      const anim = `${P[w]}_champ`, s = fitScale(anim, R.h - 50, R.w * 0.4, 4), cx = R.x + R.w / 2 - 20;
      const { f, changed } = frame(st, anim, t);
      drawAt(ctx, f, cx, floor, s);
      const mouth = anchorAt(f, 'bottle', cx, floor, s) || [cx + 16 * s, floor - 30 * s];
      st.parts ??= [];
      if (/champ3$/.test(f)) {
        if (changed && has('cork')) st.parts.push({ x: mouth[0], y: mouth[1], vx: rnd(60, 120), vy: -420, s: 2, sprite: 'cork', life: 1.4 });
        for (let i = 0; i < 6; i++) st.parts.push({ x: mouth[0], y: mouth[1], vx: rnd(80, 260), vy: rnd(-380, -160), c: pick(['#fff6c2', '#f4e27a', '#ffffff']), s: pick([2, 3]), life: 1, g: 500 });
      } else if (/champ[12]$/.test(f) && Math.random() < 0.3) {
        st.parts.push({ x: mouth[0], y: mouth[1], vx: rnd(-20, 20), vy: rnd(-90, -40), c: '#fff6c2', s: 2, life: 0.4, g: 100 });
      }
      particles(ctx, st, st.dt);
      confetti(ctx, R, st, st.dt);
    },
  },
  disco: {
    needs: ['dance'],
    caption: w => `${NAME[w]}'S VICTORY DANCE`,
    draw(ctx, R, t, w, st) {
      rect(ctx, '#140f24', R.x, R.y, R.w, R.h);
      const floor = R.y + R.h * 0.66, beat = Math.floor(t / 260);
      const tileC = ['#e2483d', '#f0be45', '#2e9b57', '#4f74a8', '#b45ad6'];
      for (let y = floor, r = 0; y < R.y + R.h; y += 14, r++) for (let x = R.x, c = 0; x < R.x + R.w; x += 24, c++) rect(ctx, (r + c + beat) % 3 ? '#2a2140' : tileC[(r * 3 + c + beat) % tileC.length], x + 1, y + 1, 22, 12);
      // mirror-ball light spots sweeping the walls
      for (let i = 0; i < 18; i++) { const a = i * 2.4 + t / 900; rect(ctx, tileC[i % tileC.length], R.x + R.w / 2 + Math.cos(a) * R.w * 0.45, R.y + R.h * 0.33 + Math.sin(a * 1.3) * R.h * 0.25, 3, 3); }
      if (hasAnim('discoball')) drawAt(ctx, frameAt('discoball', t), R.x + R.w / 2, R.y + 50, 2);
      if (hasAnim('friend3')) drawAt(ctx, frameAt('friend3', t), R.x + R.w * 0.8, R.y + R.h - 8, 2, true);
      const anim = `${P[w]}_dance`, s = fitScale(anim, R.h - 70, R.w * 0.4, 4);
      drawAt(ctx, frameAt(anim, t), R.x + R.w * 0.42, R.y + R.h - 6, s);
    },
  },
  flex: {
    needs: ['flex'],
    caption: w => `${NAME[w]}: PURE POWER`,
    draw(ctx, R, t, w, st) {
      sunburst(ctx, R, t, '#ffb347', '#ffcf6b');
      const floor = R.y + R.h - 12;
      rect(ctx, '#d9733f', R.x, floor, R.w, 12);
      const anim = `${P[w]}_flex`, s = fitScale(anim, R.h - 60, R.w * 0.4, 4), cx = R.x + R.w / 2;
      const f = frameAt(anim, t);
      drawAt(ctx, f, cx, floor, s);
      const b = anchorAt(f, 'bicep', cx, floor, s);
      if (b && has('sparkle') && /flex2$/.test(f)) drawAt(ctx, 'sparkle', b[0], b[1] + 8, 2);
      text(ctx, '+100 STRENGTH', cx, R.y + 46, 10, '#fff');
    },
  },
  throne: {
    needs: ['throne'],
    caption: w => `ALL HAIL KING ${NAME[w]}`,
    draw(ctx, R, t, w, st) {
      rect(ctx, '#4a2470', R.x, R.y, R.w, R.h);
      ctx.fillStyle = '#5b2f86';
      for (let y = R.y + 6; y < R.y + R.h; y += 18) for (let x = R.x + 6 + (y / 18 % 2) * 9; x < R.x + R.w; x += 18) ctx.fillRect(x, y, 4, 4);
      const floor = R.y + R.h - 10;
      ctx.fillStyle = '#b3262e';
      ctx.beginPath(); ctx.moveTo(R.x + R.w / 2 - 40, R.y + R.h * 0.55); ctx.lineTo(R.x + R.w / 2 + 40, R.y + R.h * 0.55); ctx.lineTo(R.x + R.w / 2 + 110, R.y + R.h); ctx.lineTo(R.x + R.w / 2 - 110, R.y + R.h); ctx.fill();
      const anim = `${P[w]}_throne`, s = fitScale(anim, R.h - 50, R.w * 0.45, 4);
      drawAt(ctx, frameAt(anim, t), R.x + R.w / 2, floor, s);
      if (has('sparkle')) for (let i = 0; i < 3; i++) if (Math.floor(t / 300 + i) % 3 === 0) drawAt(ctx, 'sparkle', R.x + R.w * (0.2 + i * 0.3), R.y + 30 + i * 14, 2);
      confetti(ctx, R, st, st.dt, ['#f0be45', '#ffe27a']);
    },
  },
};

/* ---------------- defeat scenes (bottom panel) ---------------- */
const EXCUSES = ['THE SUN WAS IN MY EYES!', 'IT WAS THE WIND!', 'MY SHOELACE CAME UNDONE', 'THE BALLS WERE FLAT', 'NEW STRINGS. NOT WORN IN.',
  'I WAS HOLDING BACK', 'MY RACKET HATES ME', 'I LET YOU WIN', 'THE NET WAS TOO HIGH', 'I DIDN\'T WARM UP'];

const LOSE = {
  classic: {
    needs: ['lose1'],
    caption: l => `MEANWHILE, ${NAME[l]}…`,
    draw(ctx, R, t, l, st) {
      st.anim ??= pick(['lose1', 'lose2', 'lose3'].filter(a => hasAnim(`${P[l]}_${a}`)));
      bands(ctx, R, ['#9aa7b8', '#a7b3c3', '#b4bfcd']);
      rect(ctx, '#8592a4', R.x, R.y + R.h - 12, R.w, 12);
      const anim = `${P[l]}_${st.anim}`;
      drawAt(ctx, frameAt(anim, t), R.x + R.w / 2, R.y + R.h - 8, fitScale(anim, R.h - 26, R.w, 3));
    },
  },
  rage: {
    needs: ['rage'],
    caption: l => `${NAME[l]} BLAMES THE RACKET`,
    draw(ctx, R, t, l, st) {
      rect(ctx, '#e08a55', R.x, R.y, R.w, R.h);
      const floor = R.y + R.h - 12;
      rect(ctx, '#c96f3c', R.x, floor, R.w, 12); rect(ctx, '#fff', R.x, floor, R.w, 2);
      const anim = `${P[l]}_rage`, s = fitScale(anim, R.h - 26, R.w * 0.5, 3), cx = R.x + R.w / 2;
      const { f, changed } = frame(st, anim, t);
      drawAt(ctx, f, cx, floor, s);
      st.parts ??= [];
      if (changed && /rage2$/.test(f)) {
        const at = anchorAt(f, 'impact', cx, floor, s) || [cx + 10 * s, floor];
        for (const b of ['bit1', 'bit2', 'bit3']) st.parts.push({ x: at[0], y: at[1] - 4, vx: rnd(-160, 160), vy: rnd(-320, -180), s: 2, sprite: `${P[l]}_${b}`, life: 1.6, bounce: 0.4 });
        for (let i = 0; i < 8; i++) st.parts.push({ x: at[0], y: at[1] - 2, vx: rnd(-120, 120), vy: rnd(-160, -40), c: '#f2c79b', s: 3, life: 0.5 });
      }
      if (/rage1$/.test(f) && Math.random() < 0.15) {
        const h = anchorAt(f, 'head', cx, floor, s) || [cx, floor - 36 * s];
        st.parts.push({ x: h[0] + rnd(-8, 8), y: h[1], vx: rnd(-10, 10), vy: -60, c: '#ffffff', s: 4, life: 0.6, g: 0 });
      }
      particles(ctx, st, st.dt, floor);
    },
  },
  cry: {
    needs: ['cry'],
    caption: l => `${NAME[l]} IS NOT OK`,
    draw(ctx, R, t, l, st) {
      bands(ctx, R, ['#7e8aa6', '#8994ae', '#949fb6']);
      const floor = R.y + R.h - 10;
      rect(ctx, '#6d7894', R.x, floor, R.w, 10);
      const pud = t < 1500 ? 'puddle1' : t < 3200 ? 'puddle2' : 'puddle3';
      const anim = `${P[l]}_cry`, s = fitScale(anim, R.h - 26, R.w * 0.5, 3), cx = R.x + R.w / 2;
      if (has(pud)) drawAt(ctx, pud, cx, floor + 2, 3);
      const f = frameAt(anim, t);
      drawAt(ctx, f, cx, floor, s);
      st.parts ??= [];
      for (const [eye, dir] of [['eyeL', -1], ['eyeR', 1]]) {
        const e = anchorAt(f, eye, cx, floor, s);
        if (e && Math.random() < 0.35) st.parts.push({ x: e[0], y: e[1], vx: dir * rnd(60, 110), vy: rnd(-90, -40), c: '#7cc8f2', s: 3, life: 0.8 });
      }
      particles(ctx, st, st.dt);
    },
  },
  tantrum: {
    needs: ['tantrum'],
    caption: l => `${NAME[l]} IS TAKING IT WELL`,
    draw(ctx, R, t, l, st) {
      bands(ctx, R, ['#c9b7e8', '#bda9e0']);
      const floor = R.y + R.h - 14;
      for (let x = R.x, i = 0; x < R.x + R.w; x += 16, i++) rect(ctx, i % 2 ? '#9a7d5a' : '#a88a64', x, floor, 16, 14);
      rect(ctx, '#7d6448', R.x, floor, R.w, 2);
      const anim = `${P[l]}_tantrum`, s = fitScale(anim, R.h - 30, R.w * 0.7, 3), cx = R.x + R.w / 2;
      const { f, changed } = frame(st, anim, t);
      // one fist hits the floor per frame: tantrum1 = right, tantrum3 = left (tantrum2 has both raised)
      const down = /tantrum1$/.test(f) ? 'fistR' : /tantrum3$/.test(f) ? 'fistL' : null;
      if (changed) st.hitAt = down ? t : -1e9;
      // the whole body jolts with every thump
      drawAt(ctx, f, cx, floor + (t - st.hitAt < 70 ? 2 : 0), s);
      st.parts ??= [];
      if (changed && down) {
        const p = anchorAt(f, down, cx, floor, s);
        if (p) for (let i = 0; i < 3; i++) st.parts.push({ x: p[0], y: floor - 2, vx: rnd(-70, 70), vy: rnd(-120, -60), c: '#e6dcc4', s: 3, life: 0.35 });
      }
      for (const [eye, dir] of [['eyeL', -1], ['eyeR', 1]]) {
        const e = anchorAt(f, eye, cx, floor, s);
        if (e && Math.random() < 0.4) st.parts.push({ x: e[0], y: e[1], vx: dir * rnd(70, 140), vy: rnd(-140, -70), c: '#7cc8f2', s: 3, life: 0.7 });
      }
      particles(ctx, st, st.dt, floor);
      if (Math.floor(t / 900) % 2) text(ctx, ['WAAAH!', 'NOOO!', 'UNFAIR!'][Math.floor(t / 1800) % 3], cx, R.y + 46, 10, '#fff');
    },
  },
  ko: {
    needs: ['ghost'],
    caption: l => `${NAME[l]} HAS LEFT THE COURT`,
    draw(ctx, R, t, l, st) {
      bands(ctx, R, ['#b9d9a8', '#acd09a', '#9fc78c']);
      const floor = R.y + R.h - 12, ko = `${P[l]}_ko`;
      rect(ctx, '#5aa650', R.x, floor, R.w, 12);
      if (!has(ko)) return;
      const s = Math.min(3, Math.floor((R.w * 0.6) / size(ko).w)), cx = R.x + R.w / 2;
      drawAt(ctx, ko, cx, floor, s);
      const body = anchorAt(ko, 'body', cx, floor, s) || [cx, floor - 8 * s];
      const k = (t % 3200) / 3200, gs = Math.max(2, s - 1);
      ctx.globalAlpha = 0.85 * (1 - Math.max(0, k - 0.75) * 4);
      const g = frameAt(`${P[l]}_ghost`, t), y = body[1] - k * (R.h * 0.6);
      drawAt(ctx, g, body[0] + Math.sin(t / 250) * 5, y, gs);
      if (has('halo')) drawAt(ctx, 'halo', body[0] + Math.sin(t / 250) * 5, y - size(g).h * gs - 2, gs);
      ctx.globalAlpha = 1;
    },
  },
  zap: {
    needs: ['zap'],
    caption: l => `${NAME[l]} GOT ZAPPED`,
    draw(ctx, R, t, l, st) {
      const anim = `${P[l]}_zap`, f = frameAt(anim, t), shocking = /zap[12]$/.test(f);
      // mid-grey storm sky so the charred frames still read; it flashes white on every strike
      rect(ctx, /zap1$/.test(f) ? '#e9ecff' : '#6b7391', R.x, R.y, R.w, R.h);
      const floor = R.y + R.h - 10, cx = R.x + R.w * 0.58, s = fitScale(anim, R.h - 56, R.w * 0.5, 3);
      rect(ctx, '#4f566f', R.x, floor, R.w, 10);
      const top = floor - size(f).h * s, head = anchorAt(f, 'head', cx, floor, s) || [cx, top + 8 * s];
      // the bolt ends on the head and starts behind the cloud, which is drawn over it
      const cloudBy = Math.max(R.y + 42, top + 6), cloudTop = cloudBy - (has('storm1') ? size('storm1').h * 2 : 0);
      if (shocking && hasAnim('bolt')) {
        const b = frameAt('bolt', t);
        drawAt(ctx, b, head[0], head[1], Math.max(1, Math.min(2, Math.floor((head[1] - cloudTop) / size(b).h))));
      }
      if (hasAnim('storm')) drawAt(ctx, frameAt('storm', t), head[0], cloudBy, 2);
      drawAt(ctx, f, cx, floor, s);
      st.parts ??= [];
      if (/charred2?$/.test(f) && Math.random() < 0.08) st.parts.push({ x: head[0] + rnd(-6, 6), y: head[1], vx: rnd(-8, 8), vy: -40, sprite: pick(['smoke1', 'smoke2']), s: 1, life: 0.9, g: 0 });
      particles(ctx, st, st.dt);
    },
  },
  bin: {
    needs: ['bin'],
    caption: l => `${NAME[l]} IS HIDING`,
    draw(ctx, R, t, l, st) {
      rect(ctx, '#9a5a44', R.x, R.y, R.w, R.h);
      for (let y = R.y, r = 0; y < R.y + R.h; y += 10, r++) for (let x = R.x - (r % 2) * 11; x < R.x + R.w; x += 22) rect(ctx, '#874c39', x + 1, y + 1, 20, 8);
      const floor = R.y + R.h - 12;
      rect(ctx, '#5b5b66', R.x, floor, R.w, 12);
      const anim = `${P[l]}_bin`, s = fitScale(anim, R.h - 26, R.w * 0.5, 3), cx = R.x + R.w / 2;
      const top = drawAt(ctx, frameAt(anim, t), cx, floor, s);
      for (let i = 0; i < 3; i++) { const a = t / 180 + i * 2.1; rect(ctx, INK, cx + Math.cos(a) * 26, top.y - 6 + Math.sin(a * 1.7) * 8, 2, 2); }
    },
  },
  excuse: {
    needs: ['excuse'],
    caption: l => `${NAME[l]} HAS AN EXCUSE`,
    draw(ctx, R, t, l, st) {
      st.line ??= pick(EXCUSES);
      bands(ctx, R, ['#cfe7f5', '#dcedf7']);
      const floor = R.y + R.h - 10;
      rect(ctx, '#b9cfdc', R.x, floor, R.w, 10);
      const anim = `${P[l]}_excuse`, s = fitScale(anim, R.h - 26, R.w * 0.4, 3), cx = R.x + R.w * 0.28;
      const f = frameAt(anim, t);
      drawAt(ctx, f, cx, floor, s);
      const m = anchorAt(f, 'mouth', cx, floor, s) || [cx + 8, floor - 30 * s];
      bubble(ctx, st.line, R.x + R.w * 0.66, R.y + R.h * 0.62, [m[0] + 6, m[1]], 7, R.w * 0.42);
    },
  },
  dizzy: {
    needs: ['dizzy'],
    caption: l => `${NAME[l]} DIDN'T SEE IT COMING`,
    draw(ctx, R, t, l, st) {
      bands(ctx, R, ['#8e6bb8', '#8462ae', '#7a59a4']);
      const floor = R.y + R.h - 10;
      rect(ctx, '#5e3f86', R.x, floor, R.w, 10);
      // leave headroom so the orbit clears the caption
      const anim = `${P[l]}_dizzy`, s = fitScale(anim, R.h - 60, R.w * 0.5, 3), cx = R.x + R.w * 0.55;
      const f = frameAt(anim, t), h = anchorAt(f, 'head', cx, floor, s) || [cx, floor - 36 * s];
      // stars (and one bird) circle the bump; the far half of the orbit passes behind the head
      const orbit = [0, 1, 2, 3].map(i => {
        const a = t / 260 + (i / 4) * Math.PI * 2;
        return { x: h[0] + Math.cos(a) * 9 * s, y: h[1] - 4 + Math.sin(a) * 3 * s, back: Math.sin(a) < 0, sp: i === 3 && hasAnim('bird') ? frameAt('bird', t) : 'star' };
      });
      const ring = back => orbit.filter(o => o.back === back && has(o.sp)).forEach(o => drawAt(ctx, o.sp, o.x, o.y, 2));
      ring(true);
      drawAt(ctx, f, cx, floor, s);
      ring(false);
    },
  },
  melt: {
    needs: ['melt'],
    caption: l => `${NAME[l]} MELTED UNDER PRESSURE`,
    draw(ctx, R, t, l, st) {
      bands(ctx, R, ['#ffcf6b', '#ffbb52', '#ffa63a']);
      if (hasAnim('sun')) drawAt(ctx, frameAt('sun', t), R.x + R.w - 28, R.y + 44, 2);
      const floor = R.y + R.h - 12;
      rect(ctx, '#d98a3f', R.x, floor, R.w, 12);
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      for (let i = 0; i < 5; i++) { const x = R.x + 30 + i * (R.w / 5), y = R.y + 30 + ((t / 20 + i * 13) % 30); ctx.fillRect(x + Math.sin(t / 200 + i) * 3, y, 2, 10); }
      const anim = `${P[l]}_melt`;
      drawAt(ctx, frameAt(anim, t, false), R.x + R.w / 2, floor, fitScale(anim, R.h - 26, R.w * 0.5, 3));
    },
  },
};

/* ---------------- deck + player ---------------- */
// Next scene from this player's shuffled deck (persisted), skipping scenes whose art isn't loaded.
const ready = (scene, who) => scene.needs.every(a => hasAnim(`${P[who]}_${a}`));
function deal(kind, who, table) {
  const ids = Object.keys(table).filter(k => ready(table[k], who));
  if (!ids.length) return null;
  let decks = {};
  try { decks = JSON.parse(localStorage.getItem(BAG_KEY)) || {}; } catch {}
  const k = `${kind}_${who}`;
  let deck = (decks[k] || []).filter(id => ids.includes(id));
  if (!deck.length) {
    deck = [...ids].sort(() => Math.random() - 0.5);
    if (deck.length > 1 && deck[0] === decks[k + '_last']) deck.push(deck.shift());
  }
  const id = deck.shift();
  decks[k] = deck; decks[k + '_last'] = id;
  try { localStorage.setItem(BAG_KEY, JSON.stringify(decks)); } catch {}
  return id;
}

let loading = null;
export function loadParty() {
  loading ??= Promise.allSettled(['./sprites-win.js', './sprites-lose.js', './sprites-scene.js'].map(u => import(u)))
    .then(rs => rs.forEach(r => r.status === 'fulfilled' && register(r.value)));
  return loading;
}

// Plays the comic on `cv` until stop() is called. winner null = draw.
export function playParty(cv, winner) {
  const ctx = cv.getContext('2d');
  let W, H, top, bot;
  // (Re)size the backing store to the canvas' on-screen size, e.g. after a phone rotates.
  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
    const gap = 10, topH = Math.round((H - gap) * 0.62);
    top = { x: 0, y: 0, w: W, h: topH }; bot = { x: 0, y: topH + gap, w: W, h: H - topH - gap };
  };
  fit();
  const loser = winner && (winner === 'n' ? 'f' : 'n');
  const winId = winner && deal('win', winner, WIN), loseId = loser && deal('lose', loser, LOSE);
  const sw = {}, sl = {};
  let raf, t0 = performance.now(), prev = t0;
  const panel = (R, fn) => {
    ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip(); fn(); ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(R.x + 1.5, R.y + 1.5, R.w - 3, R.h - 3);
  };
  const tick = now => {
    const t = now - t0;
    if (cv.offsetWidth !== W || cv.offsetHeight !== H) fit();
    sw.dt = sl.dt = Math.min(0.05, (now - prev) / 1000); prev = now;
    ctx.clearRect(0, 0, W, H);
    if (!winner) {
      const R = { x: 0, y: 0, w: W, h: H };
      panel(R, () => {
        sunburst(ctx, R, t, '#e9f3d2', '#dcebbd');
        for (const w of ['n', 'f']) drawAt(ctx, frameAt(`${P[w]}_idle`, t), W * (w === 'n' ? 0.32 : 0.68), H - 16, 4, w === 'f');
        caption(ctx, { x: 8, y: 8 }, 'HONOURS EVEN');
      });
    } else {
      panel(top, () => { if (winId) WIN[winId].draw(ctx, top, t, winner, sw); caption(ctx, { x: top.x + 8, y: top.y + 8 }, WIN[winId]?.caption(winner) || `${NAME[winner]} WINS!`); });
      panel(bot, () => { if (loseId) LOSE[loseId].draw(ctx, bot, t, loser, sl); caption(ctx, { x: bot.x + 8, y: bot.y + 8 }, LOSE[loseId]?.caption(loser) || `MEANWHILE, ${NAME[loser]}…`); });
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return { stop: () => cancelAnimationFrame(raf), scenes: { win: winId, lose: loseId } };
}
