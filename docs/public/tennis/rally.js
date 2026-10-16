// rally.js — the header: Nicolas and Felix playing a shuffled playlist of scripted points
// (rallies, serves, net play, lobs, drop shots…). Each point is a Script of timed tracks:
// player animations, player moves along the court, ball keyframes and effects.
import { ANIMS, has, size, drawAt, anchorAt, frameAt, hasAnim } from './pixel.js';

const P = { n: 'nico', f: 'felix' };
const other = w => (w === 'n' ? 'f' : 'n');
const HOME = { n: 0, f: 1 };          // court position u: 0 = Nicolas' baseline, 1 = Felix's
const NET = { n: 0.3, f: 0.7 };       // where a player stands when rushing the net
const toward = (who, frac) => 0.5 + (HOME[other(who)] - 0.5) * frac; // u on the opponent's side
const CONTACT = /_(swing2|serve2_nb|serve2|slice2|volley2|dive1)$/;
const PAUSE = 1300;                   // dead time between points (ball kid runs then)
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const ease = k => k * k * (3 - 2 * k);

class Script {
  constructor() {
    this.anims = { n: [], f: [] }; this.moves = { n: [], f: [] }; this.jumps = { n: [], f: [] };
    this.ball = []; this.fx = []; this.shakes = []; this.end = 0; this.arcIn = 0;
  }
  bump(t) { this.end = Math.max(this.end, t); }
  anim(who, key) {
    if (typeof key !== 'string') return key.frames.every(has) ? key : null;
    return hasAnim(`${P[who]}_${key}`) ? ANIMS[`${P[who]}_${key}`] : null;
  }
  still(who, frame, ms) { return has(`${P[who]}_${frame}`) ? { frames: [`${P[who]}_${frame}`], ms } : null; }
  // loop: ms to keep looping; hold: ms to hold the last frame afterwards
  play(who, key, t, { loop = 0, hold = 0 } = {}) {
    const a = key && this.anim(who, key);
    if (!a) return null;
    const until = t + (loop || a.frames.length * a.ms) + hold;
    this.anims[who].push({ t, a, loop: !!loop, until });
    this.anims[who].sort((x, y) => x.t - y.t);
    this.bump(until);
    return a;
  }
  // Start a stroke so its contact frame is on screen at time tc. Returns the contact frame.
  hit(who, key, tc, opts) {
    const a = this.anim(who, key);
    if (!a) return null;
    let i = a.frames.findIndex(f => CONTACT.test(f));
    if (i < 0) i = Math.min(1, a.frames.length - 1);
    this.play(who, a, tc - i * a.ms - a.ms / 2, opts);
    return a.frames[i];
  }
  move(who, u, t0, dur) { this.moves[who].push({ t0, t1: t0 + dur, u }); this.moves[who].sort((a, b) => a.t0 - b.t0); this.bump(t0 + dur); }
  uAt(who, t) {
    let u = HOME[who];
    for (const m of this.moves[who]) {
      if (t >= m.t1) u = m.u;
      else if (t > m.t0) return u + (m.u - u) * ease((t - m.t0) / (m.t1 - m.t0));
      else break;
    }
    return u;
  }
  moveDir(who, t) {
    const m = this.moves[who].find(m => t >= m.t0 && t < m.t1);
    return m ? Math.sign(m.u - this.uAt(who, m.t0)) : 0;
  }
  jump(who, t0, dur, h) { this.jumps[who].push({ t0, t1: t0 + dur, h }); }
  lift(who, t) {
    const j = this.jumps[who].find(j => t >= j.t0 && t < j.t1);
    if (!j) return 0;
    const k = (t - j.t0) / (j.t1 - j.t0);
    return j.h * 4 * k * (1 - k);
  }
  key(k) { this.ball.push(k); this.ball.sort((a, b) => a.t - b.t); this.bump(k.t); }
  hide(t) { this.key({ t, hide: true }); }
  text(str, t, { u = 0.5, z = 40, dur = 1000, color = '#d9f24b' } = {}) { this.fx.push({ kind: 'text', str, t, dur, u, z, color }); this.bump(t + dur); }
  burst(name, t, at) { this.fx.push({ kind: 'sprite', name, t, dur: 280, at }); }
  dust(who, t) { this.fx.push({ kind: 'dust', who, t, dur: 360 }); }
  shake(t, dur = 240, mag = 3) { this.shakes.push({ t, dur, mag }); }
}

// One groundstroke/volley from `from`: contact at tc, optional bounce on the far side.
// The ball's next keyframe (the opponent's contact) is added by the following shot() call.
function shot(S, from, tc, stroke, { flight = 1050, peak = 34, bounce = 0.72, after = 12, noBounce = false } = {}) {
  const frame = S.hit(from, stroke, tc);
  S.key({ t: tc, at: from, frame, arc: S.arcIn });
  if (noBounce) { S.arcIn = peak; return tc + flight; } // the opponent volleys it
  const uf = S.uAt(from, tc), ut = S.uAt(other(from), tc + flight);
  S.key({ t: tc + flight * bounce, u: uf + (ut - uf) * bounce, z: 0, arc: peak });
  S.arcIn = after;
  return tc + flight;
}
// The last shot was a winner: the ball sails past `loser` and off the court.
function pass(S, loser, tArrive) {
  S.key({ t: tArrive + 160, u: HOME[loser] + (HOME[loser] - 0.5) * 0.35, z: 16, arc: S.arcIn });
  S.hide(tArrive + 161);
}
function ballKid(S) { S.fx.push({ kind: 'kid', t: S.end + 150, dur: 1150, dir: Math.random() < 0.5 ? 1 : -1 }); }

const SCENES = {
  rally(A) {
    const S = new Script();
    let t = 400, who = A;
    const n = 3 + rnd(4);
    for (let i = 0; i < n; i++) { t = shot(S, who, t, 'rally'); who = other(who); }
    const winner = other(who);
    pass(S, who, t);
    S.play(who, 'miss', t - 200);
    S.text(pick(['WINNER!', 'CLEAN!', 'NICE!']), t - 150, { u: toward(who, 0.2) });
    S.play(winner, 'cmon', t + 200);
    return S;
  },
  fast(A) {
    const S = new Script();
    let t = 400, who = A;
    const n = 6 + rnd(4);
    for (let i = 0; i < n; i++) { t = shot(S, who, t, 'rally', { flight: 600, peak: 14, after: 6, bounce: 0.68 }); who = other(who); }
    // the putaway: a flat rocket
    const last = other(who);
    S.burst('smash', t - 600, { at: last, frame: S.ball.at(-2)?.frame });
    S.shake(t - 600);
    pass(S, who, t - 200);
    S.play(who, S.still(who, 'lunge', 500) ? S.still(who, 'lunge', 500) : 'miss', t - 260);
    S.text('BOOM!', t - 500, { u: 0.5, color: '#ff8f3a' });
    S.play(last, 'cmon', t + 150);
    return S;
  },
  serve(A) {
    const S = new Script(), B = other(A), p = P[A];
    let t = 300;
    // the pre-serve bounce routine
    S.play(A, 'bounce', t, { loop: 1200 });
    for (let i = 0; i < 3; i++) {
      S.key({ t: t + i * 400, at: A, frame: `${p}_bounce1`, kind: 'hand' });
      S.key({ t: t + i * 400 + 200, at: A, frame: `${p}_bounce2`, kind: 'hand', ground: true });
    }
    t += 1200;
    S.key({ t, at: A, frame: `${p}_bounce1`, kind: 'hand' });
    // toss (hold the toss pose while the ball goes up), then hit it at the top
    const toss = { frames: [`${p}_serve1_nb`, `${p}_serve1_nb`, `${p}_serve1_nb`, `${p}_serve1_nb`, `${p}_serve2_nb`, `${p}_swing3`, `${p}_ready`], ms: 140 };
    S.play(A, toss, t);
    S.key({ t: t + 120, at: A, frame: `${p}_serve1_nb`, kind: 'hand' });
    const tc = t + 4 * 140 + 70;
    S.key({ t: tc, at: A, frame: `${p}_serve2_nb`, arc: 42 });
    S.burst('sparkle', tc, { at: A, frame: `${p}_serve2_nb` });
    S.key({ t: tc + 300, u: toward(A, 0.42), z: 0, arc: 3 });
    S.key({ t: tc + 620, u: HOME[B] + (HOME[B] - 0.5) * 0.3, z: 20, arc: 4 });
    S.hide(tc + 621);
    // the receiver dives… and doesn't get there
    S.play(B, 'dive', tc + 260, { hold: 1100 });
    S.move(B, toward(A, 0.86), tc + 390, 260);
    S.dust(B, tc + 520);
    S.text('ACE!', tc + 360, { u: toward(B, 0.25), z: 44 });
    S.play(A, 'cmon', tc + 700);
    S.move(B, HOME[B], tc + 1900, 700);
    return S;
  },
  netSlice(A) {
    // A charges the net and plays slow, floaty slices; B ends up dumping one into the net
    const S = new Script(), B = other(A);
    let t = shot(S, A, 400, 'rally', { flight: 1000 });
    S.move(A, NET[A], 650, 700);
    const n = 2 + rnd(2);
    for (let i = 0; i < n; i++) {
      t = shot(S, B, t, 'rally', { flight: 760, peak: 12, noBounce: true });
      t = shot(S, A, t, i % 2 ? 'volley' : 'slice', { flight: 1750, peak: 13, bounce: 0.82, after: 9 });
    }
    const fr = S.hit(B, 'rally', t);
    S.key({ t, at: B, frame: fr, arc: S.arcIn });
    const side = HOME[B] - 0.5;
    S.key({ t: t + 420, u: 0.5 + side * 0.03, z: 9, arc: 10 });
    S.key({ t: t + 650, u: 0.5 + side * 0.08, z: 0, arc: 0 });
    S.key({ t: t + 830, u: 0.5 + side * 0.11, z: 0, arc: 3 });
    S.key({ t: t + 1500, u: 0.5 + side * 0.15, z: 0, arc: 0 });
    S.hide(t + 1501);
    S.text('NET!', t + 440, { u: 0.5, z: 30, color: '#ff8f3a' });
    S.play(B, 'miss', t + 300);
    S.play(B, 'tired', t + 800, { loop: 1100 });
    S.play(A, 'cmon', t + 700);
    S.move(A, HOME[A], t + 1600, 900);
    return S;
  },
  lobSmash(A) {
    const S = new Script(), B = other(A);
    let t = shot(S, A, 400, 'rally', { flight: 1000 });
    S.move(A, NET[A], 650, 700);
    // B throws up a big lob…
    const fr = S.hit(B, 'rally', t);
    S.key({ t, at: B, frame: fr, arc: S.arcIn });
    const tc = t + 1600;
    // …and A jumps into an overhead smash
    S.jump(A, tc - 330, 660, 9);
    const sm = S.hit(A, 'serve_nb', tc);
    S.key({ t: tc, at: A, frame: sm, arc: 78 });
    S.burst('smash', tc, { at: A, frame: sm });
    S.shake(tc, 300, 4);
    S.text('SMASH!', tc + 60, { u: toward(A, -0.1), z: 46, color: '#ff8f3a' });
    S.key({ t: tc + 210, u: toward(A, 0.5), z: 0, arc: 0 });
    S.key({ t: tc + 720, u: HOME[B] + (HOME[B] - 0.5) * 0.45, z: 72, arc: 18 });
    S.hide(tc + 721);
    S.play(B, S.still(B, 'lunge', 600) ? S.still(B, 'lunge', 600) : 'miss', tc + 120);
    S.play(A, 'cmon', tc + 650);
    S.move(A, HOME[A], tc + 1500, 900);
    return S;
  },
  dropShot(A) {
    const S = new Script(), B = other(A);
    let t = shot(S, A, 400, 'rally');
    t = shot(S, B, t, 'rally');
    const fr = S.hit(A, 'slice', t);
    S.key({ t, at: A, frame: fr, arc: S.arcIn });
    S.key({ t: t + 820, u: toward(A, 0.16), z: 0, arc: 22 });
    S.key({ t: t + 1070, u: toward(A, 0.21), z: 0, arc: 6 });
    S.key({ t: t + 1250, u: toward(A, 0.25), z: 0, arc: 2.5 });
    S.key({ t: t + 1950, u: toward(A, 0.3), z: 0, arc: 0 });
    S.hide(t + 1951);
    S.text('DROP SHOT!', t + 650, { u: 0.5, z: 44 });
    // B sprints in and dives — too late
    S.move(B, toward(A, 0.48), t + 250, 780);
    S.play(B, 'dive', t + 1030, { hold: 950 });
    S.move(B, toward(A, 0.33), t + 1160, 260);
    S.dust(B, t + 1290);
    S.play(A, 'cmon', t + 1400);
    S.move(B, HOME[B], t + 2700, 1000);
    return S;
  },
  marathon(A) {
    const S = new Script();
    let t = 400, who = A;
    const n = 10 + rnd(4);
    for (let i = 0; i < n; i++) { t = shot(S, who, t, 'rally', { flight: 950 }); who = other(who); }
    pass(S, who, t);
    S.play(who, 'miss', t - 200);
    S.text('WHAT A RALLY!', t, { u: 0.5, z: 46, dur: 1500 });
    for (const w of ['n', 'f']) S.play(w, 'tired', t + 450, { loop: 1500 });
    return S;
  },
};
// Animations each scene needs (for both players) beyond the basic rally/idle set.
const NEEDS = {
  serve: ['serve_nb', 'bounce', 'dive'], netSlice: ['run', 'slice', 'volley'], lobSmash: ['run', 'serve_nb'],
  dropShot: ['run', 'slice', 'dive'], marathon: ['tired'],
};
const available = () => Object.keys(SCENES).filter(k => ['n', 'f'].every(w => (NEEDS[k] || []).every(a => hasAnim(`${P[w]}_${a}`))));

/* ---------------- rendering ---------------- */
function fit(cv) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3), w = cv.offsetWidth, h = cv.offsetHeight;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const ctx = cv.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.imageSmoothingEnabled = false;
  const s = w < 420 ? 2 : w < 760 ? 3 : 4, sw = 32 * s;
  const left = sw / 2 + 4, right = w - sw / 2 - 4;
  // br: ball radius, so a bouncing ball touches the ground instead of sinking into it
  return { ctx, w, h, s, ground: h - 18, br: 3 * Math.max(2, s - 1), xOf: u => left + u * (right - left) };
}

function pose(S, who, t) {
  const face = who === 'f';
  let ev = null;
  for (const e of S.anims[who]) { if (e.t <= t) ev = e; else break; }
  if (ev && t < ev.until) {
    const i = Math.floor((t - ev.t) / ev.a.ms), n = ev.a.frames.length;
    return { name: ev.a.frames[ev.loop ? i % n : Math.min(i, n - 1)], flip: face };
  }
  const dir = S.moveDir(who, t);
  if (dir && hasAnim(`${P[who]}_run`)) {
    // run facing the way they're going: toward the net is their normal facing
    const towardNet = dir === Math.sign(0.5 - HOME[who]);
    return { name: frameAt(`${P[who]}_run`, t), flip: towardNet ? face : !face };
  }
  return { name: frameAt(`${P[who]}_idle`, t), flip: face };
}

function resolve(S, L, k) {
  if (!k.at) return [L.xOf(k.u), L.ground - L.br - k.z * L.s];
  const who = k.at, cx = L.xOf(S.uAt(who, k.t)), by = L.ground - S.lift(who, k.t) * L.s, flip = who === 'f';
  const kind = k.kind || 'racket';
  let p = k.frame && anchorAt(k.frame, kind, cx, by, L.s, flip);
  if (!p) {
    const dir = who === 'n' ? 1 : -1;
    p = kind === 'hand' ? [cx - dir * 6 * L.s, by - 18 * L.s] : [cx + dir * 13 * L.s, by - 22 * L.s];
  }
  return k.ground ? [p[0], L.ground - L.br] : p;
}

function ballAt(S, L, t) {
  const K = S.ball;
  if (!K.length || t < K[0].t) return null;
  let i = 0;
  while (i < K.length - 1 && K[i + 1].t <= t) i++;
  const k0 = K[i], k1 = K[i + 1];
  if (k0.hide) return null;
  if (!k1 || k1.hide) return resolve(S, L, k0); // resting until it's hidden
  const u = (t - k0.t) / (k1.t - k0.t), a = resolve(S, L, k0), b = resolve(S, L, k1);
  const y = a[1] + (b[1] - a[1]) * u - (k1.arc || 0) * L.s * 4 * u * (1 - u);
  return [a[0] + (b[0] - a[0]) * u, Math.max(6, y)];
}

function drawText(ctx, L, fx, t) {
  const k = (t - fx.t) / fx.dur, pop = Math.min(1, (t - fx.t) / 120);
  const px = Math.round(L.s * (2.5 + 2.5 * (0.6 + 0.4 * pop)));
  ctx.save();
  ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1;
  ctx.font = `${px}px "Press Start 2P", monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  const x = L.xOf(fx.u), y = L.ground - fx.z * L.s - k * 8 * L.s;
  ctx.lineWidth = Math.max(3, L.s * 1.5); ctx.strokeStyle = '#1b1b2a'; ctx.strokeText(fx.str, x, y);
  ctx.fillStyle = fx.color; ctx.fillText(fx.str, x, y);
  ctx.restore();
}

function render(L, S, t) {
  const { ctx, w, h, s, ground } = L;
  ctx.clearRect(0, 0, w, h);
  ctx.save();
  const sh = S.shakes.find(q => t >= q.t && t < q.t + q.dur);
  if (sh) ctx.translate(Math.round((Math.random() - 0.5) * sh.mag * 2), Math.round((Math.random() - 0.5) * sh.mag * 2));

  ctx.fillStyle = '#e6dcc4'; ctx.fillRect(0, ground, w, 4);
  ctx.fillStyle = '#d9d1bd'; for (let x = 0; x < w; x += 12) ctx.fillRect(x, ground + 9, 6, 3);

  const sNet = Math.max(1, s - 1);
  for (const fx of S.fx) if (fx.kind === 'kid' && t >= fx.t && t < fx.t + fx.dur && has('ballkid1')) {
    const k = (t - fx.t) / fx.dur, x = fx.dir > 0 ? -20 + k * (w + 40) : w + 20 - k * (w + 40);
    drawAt(ctx, frameAt('ballkid', t) || 'ballkid1', x, ground + 2, sNet, fx.dir < 0);
  }
  if (has('net')) drawAt(ctx, 'net', w / 2, ground + 2, sNet);

  const ball = ballAt(S, L, t), prev = ballAt(S, L, t - 40);
  if (has('umpire1')) {
    const sU = Math.max(1, s - 2), nw = has('net') ? size('net').w * sNet : 0;
    const look = ball && prev && ball[0] > prev[0] ? 'umpire2' : 'umpire1';
    drawAt(ctx, has(look) ? look : 'umpire1', w / 2 + nw / 2 + size('umpire1').w * sU / 2 + 6, ground + 2, sU);
  }

  for (const who of ['n', 'f']) {
    const cx = L.xOf(S.uAt(who, t)), lift = S.lift(who, t) * s;
    const { name, flip } = pose(S, who, t);
    ctx.fillStyle = 'rgba(27,27,42,.13)';
    const shw = 32 * s * (0.6 - Math.min(0.25, lift / 200));
    ctx.fillRect(Math.round(cx - shw / 2), ground - 2, Math.round(shw), 4);
    drawAt(ctx, name, cx, ground - lift, s, flip);
  }

  if (ball) {
    const bs = Math.max(2, s - 1), height = ground - ball[1];
    ctx.globalAlpha = 0.18; ctx.fillStyle = '#1b1b2a';
    const shW = Math.max(4, 12 - height / 10) * bs / 2;
    ctx.fillRect(Math.round(ball[0] - shW / 2), ground - 1, Math.round(shW), 3);
    ctx.globalAlpha = 1;
    if (has('ball')) drawAt(ctx, 'ball', ball[0], ball[1] + size('ball').h * bs / 2, bs);
  }

  for (const fx of S.fx) {
    if (t < fx.t || t >= fx.t + fx.dur) continue;
    if (fx.kind === 'text') drawText(ctx, L, fx, t);
    else if (fx.kind === 'sprite' && has(fx.name)) {
      const p = resolve(S, L, { ...fx.at, t: fx.t });
      drawAt(ctx, fx.name, p[0], p[1] + size(fx.name).h * Math.max(2, s - 1) / 2, Math.max(2, s - 1), fx.at.at === 'f');
    } else if (fx.kind === 'dust') {
      const cx = L.xOf(S.uAt(fx.who, t)), k = (t - fx.t) / fx.dur;
      if (hasAnim('dust')) drawAt(ctx, frameAt('dust', t - fx.t, false), cx, ground, Math.max(1, s - 1));
      else { ctx.fillStyle = `rgba(160,150,130,${0.6 * (1 - k)})`; for (let i = -2; i <= 2; i++) ctx.fillRect(cx + i * 7 * s - 3 * s * k * i, ground - 4 * s * k - 3, 3 * s, 3 * s); }
    }
  }
  ctx.restore();
}

export function startRally(cv) {
  let L = fit(cv);
  addEventListener('resize', () => { L = fit(cv); });
  let bag = [], S = null, t0 = 0, lastKey = null, first = true;
  function next(now) {
    const avail = available();
    if (!bag.length) bag = avail.filter(k => k !== lastKey || avail.length === 1).sort(() => Math.random() - 0.5);
    let key = bag.shift();
    if (first && avail.includes('serve')) { key = 'serve'; bag = bag.filter(k => k !== 'serve'); }
    first = false;
    lastKey = key;
    S = SCENES[key](Math.random() < 0.5 ? 'n' : 'f');
    ballKid(S);
    t0 = now;
  }
  function frame(now) {
    if (!S || now - t0 > S.end + PAUSE) next(now);
    render(L, S, now - t0);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return { get scene() { return lastKey; }, skip() { S = null; } };
}
