// raetsel.js: the crossword. The words and clues live in raetsel-puzzle.js.
import { PUZZLE } from './raetsel-puzzle.js';

const SAVE_KEY = `sa-raetsel-${PUZZLE.id}`;
// Umlauts are typed out as in German crosswords; toUpperCase() already turns ß into SS.
const SPELLED_OUT = { Ä: 'AE', Ö: 'OE', Ü: 'UE' };
const KEY_ROWS = ['QWERTZUIOP', 'ASDFGHJKL', 'YXCVBNM'];
const DIR_NAME = { A: 'waagerecht', D: 'senkrecht' };
const CONFETTI = ['#d9534f', '#f2c14e', '#2f5d4a', '#8fbf7a', '#9fb3c4'];

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const keyOf = (r, c) => `${r},${c}`;
const other = dir => (dir === 'A' ? 'D' : 'A');

// Squares by "row,col", each knowing its answer letter and the across/down word it belongs to.
// Words are numbered the usual crossword way: by their first square, left to right, top to bottom.
function buildGrid() {
  const squares = new Map();
  const words = PUZZLE.words.map(w => ({ ...w, keys: [...w.answer].map((_, i) => keyOf(w.row + (w.dir === 'D' ? i : 0), w.col + (w.dir === 'A' ? i : 0))) }));
  for (const w of words) w.keys.forEach((k, i) => {
    const sq = squares.get(k) || { answer: w.answer[i], words: {} };
    sq.words[w.dir] = w;
    squares.set(k, sq);
  });
  const starts = [...new Set(words.map(w => w.keys[0]))].sort((a, b) => {
    const [ar, ac] = a.split(',').map(Number), [br, bc] = b.split(',').map(Number);
    return ar - br || ac - bc;
  });
  starts.forEach((k, i) => { squares.get(k).num = i + 1; });
  for (const w of words) w.num = squares.get(w.keys[0]).num;
  PUZZLE.solution.forEach(([r, c], i) => { squares.get(keyOf(r, c)).sol = i + 1; });
  const order = ['A', 'D'].flatMap(d => words.filter(w => w.dir === d).sort((a, b) => a.num - b.num));
  return { squares, order };
}

export function start(stage) {
  injectStyle();
  const { squares, order } = buildGrid();
  const wordById = new Map(order.map(w => [`${w.dir}${w.num}`, w]));
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } })();
  const letters = saved.letters || {};
  const hinted = new Set(saved.hinted || []);
  const wrong = new Set();
  let solved = isSolved();
  let dir = 'A';
  let active = order[0].keys[0];
  let celebration = null;

  const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ letters, hinted: [...hinted] })); } catch {} };
  const word = () => squares.get(active).words[dir];
  function isSolved() { return [...squares].every(([k, sq]) => letters[k] === sq.answer); }

  stage.innerHTML = `
    <div class="cw">
      <div class="cwDock">
        <div class="cwClue">
          <button type="button" class="cwStep" data-step="-1" aria-label="Vorheriger Hinweis">‹</button>
          <p aria-live="polite"><b></b><span></span></p>
          <button type="button" class="cwStep" data-step="1" aria-label="Nächster Hinweis">›</button>
        </div>
        <div class="cwKeys">${KEY_ROWS.map((row, i) => `<div>${[...row].map(ch => `<button type="button" data-key="${ch}">${ch}</button>`).join('')}${i === 2 ? '<button type="button" data-key="Backspace" class="wide" aria-label="Löschen">⌫</button>' : ''}</div>`).join('')}</div>
      </div>
      <div class="cwMain">
        <div>
          <div class="cwGrid" style="--cols:${PUZZLE.cols}">${gridHtml()}</div>
          <div class="cwSol"><span>Lösungswort</span><div>${PUZZLE.solution.map((_, i) => `<b data-sol="${i + 1}"></b>`).join('')}</div></div>
          <div class="cwTools">
            <button type="button" data-act="check">Prüfen</button>
            <button type="button" data-act="hint">Buchstabe zeigen</button>
            <button type="button" data-act="reset">Neu anfangen</button>
          </div>
          <p class="cwMsg" role="status"></p>
        </div>
        <div class="cwLists">${['A', 'D'].map(d => `
          <section><h4>${d === 'A' ? 'Waagerecht' : 'Senkrecht'}</h4><ol>${order.filter(w => w.dir === d).map(w => `
            <li data-word="${w.dir}${w.num}"><b>${w.num}</b><span>${esc(w.clue)}</span></li>`).join('')}</ol></section>`).join('')}
        </div>
      </div>
      <p class="cwNote">Umlaute schreibt ihr aus: Ü wird UE, ß wird SS.</p>
    </div>`;

  function gridHtml() {
    let html = '';
    for (let r = 0; r < PUZZLE.rows; r++) for (let c = 0; c < PUZZLE.cols; c++) {
      const sq = squares.get(keyOf(r, c));
      html += sq
        ? `<div class="cwSq" data-k="${keyOf(r, c)}">${sq.num ? `<span class="n">${sq.num}</span>` : ''}${sq.sol ? `<span class="o"></span><span class="s">${sq.sol}</span>` : ''}<span class="l"></span></div>`
        : '<div class="cwGap"></div>';
    }
    return html;
  }

  const els = new Map([...stage.querySelectorAll('.cwSq')].map(el => [el.dataset.k, el]));
  const msg = stage.querySelector('.cwMsg');
  const say = text => { msg.textContent = text; };

  function paint() {
    const w = word();
    for (const [k, el] of els) {
      el.querySelector('.l').textContent = letters[k] || '';
      el.classList.toggle('active', k === active);
      el.classList.toggle('inWord', w.keys.includes(k));
      el.classList.toggle('wrong', wrong.has(k));
      el.classList.toggle('given', hinted.has(k));
    }
    stage.querySelector('.cwClue b').textContent = `${w.num} ${DIR_NAME[w.dir]}`;
    stage.querySelector('.cwClue span').textContent = w.clue;
    for (const li of stage.querySelectorAll('.cwLists li')) {
      const lw = wordById.get(li.dataset.word);
      li.classList.toggle('current', lw === w);
      li.classList.toggle('filled', lw.keys.every(k => letters[k]));
    }
    PUZZLE.solution.forEach(([r, c], i) => { stage.querySelector(`[data-sol="${i + 1}"]`).textContent = letters[keyOf(r, c)] || ''; });
  }

  function select(k, toggle = true) {
    if (k === active && toggle && squares.get(k).words[other(dir)]) dir = other(dir);
    active = k;
    if (!squares.get(k).words[dir]) dir = other(dir);
    paint();
    els.get(k).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  function selectWord(w) {
    dir = w.dir;
    select(w.keys.find(k => !letters[k]) || w.keys[0], false);
  }
  function stepWord(step) {
    const i = order.indexOf(word());
    selectWord(order[(i + step + order.length) % order.length]);
  }

  function type(ch) {
    letters[active] = ch;
    wrong.delete(active);
    hinted.delete(active);
    const w = word(), i = w.keys.indexOf(active);
    if (i < w.keys.length - 1) select(w.keys[i + 1], false);
    else stepWord(1);
    afterChange();
  }
  function erase() {
    const w = word(), i = w.keys.indexOf(active);
    if (!letters[active] && i > 0) active = w.keys[i - 1];
    delete letters[active];
    wrong.delete(active);
    hinted.delete(active);
    select(active, false);
    afterChange();
  }
  function move(dr, dc) {
    let [r, c] = active.split(',').map(Number);
    for (r += dr, c += dc; r >= 0 && c >= 0 && r < PUZZLE.rows && c < PUZZLE.cols; r += dr, c += dc) {
      const k = keyOf(r, c);
      if (!squares.has(k)) continue;
      const want = dr ? 'D' : 'A';
      if (squares.get(k).words[want]) dir = want;
      return select(k, false);
    }
  }

  function afterChange() {
    save();
    paint();
    if (solved || [...squares.keys()].some(k => !letters[k])) return say('');
    if (isSolved()) { solved = true; say('Gelöst!'); celebrate(); }
    else say('Alle Kästchen sind voll, aber irgendwo hakt es noch. „Prüfen“ zeigt euch, wo.');
  }

  function act(name) {
    if (name === 'check') {
      for (const [k, sq] of squares) if (letters[k] && letters[k] !== sq.answer) wrong.add(k);
      say(wrong.size ? `${wrong.size} ${wrong.size === 1 ? 'Buchstabe ist' : 'Buchstaben sind'} noch falsch, rot markiert.` : 'Alles richtig, was bisher drinsteht!');
      paint();
    } else if (name === 'hint') {
      if (letters[active] === squares.get(active).answer) return say('Der Buchstabe stimmt schon. Wählt ein anderes Kästchen.');
      letters[active] = squares.get(active).answer;
      wrong.delete(active);
      hinted.add(active);
      afterChange();
    } else if (name === 'reset' && confirm('Wirklich alle Buchstaben löschen?')) {
      for (const k of Object.keys(letters)) delete letters[k];
      hinted.clear(); wrong.clear(); solved = false;
      say('');
      selectWord(order[0]);
      save();
    }
  }

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea')) return;
    if (celebration) { if (e.key === 'Escape') closeCelebration(); return; }
    handleKey(e.key, e.shiftKey) && e.preventDefault();
  }
  function handleKey(key, shift = false) {
    const upper = key.length === 1 ? key.toUpperCase() : '';
    const typed = SPELLED_OUT[upper] || upper;
    if (/^[A-Z]+$/.test(typed)) { [...typed].forEach(type); return true; }
    switch (key) {
      case 'Backspace': case 'Delete': erase(); return true;
      case 'ArrowLeft': move(0, -1); return true;
      case 'ArrowRight': move(0, 1); return true;
      case 'ArrowUp': move(-1, 0); return true;
      case 'ArrowDown': move(1, 0); return true;
      case 'Tab': stepWord(shift ? -1 : 1); return true;
      case 'Enter': stepWord(1); return true;
      case ' ': select(active); return true;
    }
    return false;
  }

  stage.addEventListener('click', e => {
    const sq = e.target.closest('.cwSq');
    if (sq) return select(sq.dataset.k);
    const key = e.target.closest('[data-key]');
    if (key) return handleKey(key.dataset.key);
    const step = e.target.closest('.cwStep');
    if (step) return stepWord(Number(step.dataset.step));
    const li = e.target.closest('.cwLists li');
    if (li) return selectWord(wordById.get(li.dataset.word));
    const tool = e.target.closest('[data-act]');
    if (tool) act(tool.dataset.act);
  });
  document.addEventListener('keydown', onKey);

  function celebrate() {
    const hints = hinted.size;
    celebration = document.createElement('div');
    celebration.className = 'cwWin';
    celebration.innerHTML = `
      <canvas aria-hidden="true"></canvas>
      <div class="card" role="dialog" aria-label="Rätsel gelöst">
        <p class="k">Lösungswort</p>
        <p class="w">${esc(PUZZLE.solution.map(([r, c]) => squares.get(keyOf(r, c)).answer).join(''))}</p>
        <p>Geschafft, ihr zwei, ${hints ? `mit ${hints === 1 ? 'einem Tipp' : `${hints} Tipps`}` : 'ganz ohne Tipps'}! Herzlichen Glückwunsch.</p>
        <button type="button">Zurück zum Rätsel</button>
      </div>`;
    document.body.append(celebration);
    celebration.querySelector('button').addEventListener('click', closeCelebration);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) confetti(celebration.querySelector('canvas'));
  }

  function closeCelebration() { celebration?.remove(); celebration = null; }

  paint();
  return () => {
    document.removeEventListener('keydown', onKey);
    closeCelebration();
  };
}

function confetti(cv) {
  const ctx = cv.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  const bits = Array.from({ length: 140 }, () => ({
    x: Math.random() * W, y: -Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 2 * dpr, vy: (2 + Math.random() * 3) * dpr,
    w: (5 + Math.random() * 6) * dpr, h: (3 + Math.random() * 4) * dpr, a: Math.random() * 6.28, va: (Math.random() - 0.5) * 0.3,
    c: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
  }));
  const end = performance.now() + 4500;
  (function frame(now) {
    if (!cv.isConnected) return;
    ctx.clearRect(0, 0, W, H);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.a += b.va;
      if (b.y > H && now < end) { b.y = -10; b.x = Math.random() * W; }
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
    }
    if (bits.some(b => b.y <= H)) requestAnimationFrame(frame);
  })(performance.now());
}

function injectStyle() {
  if (document.getElementById('cw-style')) return;
  const style = document.createElement('style');
  style.id = 'cw-style';
  style.textContent = `
    .stage:has(.cw){overflow:clip}
    .cw{padding:16px 18px 20px}
    .cwDock{position:sticky;top:0;z-index:5;margin:-16px -18px 16px;padding:10px 12px;background:rgba(255,255,255,.94);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-bottom:1px solid var(--line)}
    .cwClue{display:flex;align-items:center;gap:8px}
    .cwClue p{flex:1;min-height:2.9em;margin:0;display:flex;flex-direction:column;justify-content:center;line-height:1.35}
    .cwClue b{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--forest)}
    .cwStep{flex:none;width:36px;height:36px;border:1px solid var(--line);border-radius:50%;background:#fff;font-size:20px;line-height:1;color:var(--muted)}
    .cwStep:hover{color:var(--ink);border-color:#cfdcd6}
    .cwKeys{display:none}

    .cwMain{display:grid;gap:22px}
    @media (min-width:760px){.cwMain{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:start}}
    .cwGrid{container-type:inline-size;display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:2px;width:min(100%,calc(var(--cols) * 34px));margin:0 auto}
    .cwSq{position:relative;aspect-ratio:1;display:grid;place-items:center;background:#fff;border:1.5px solid #c5d0cc;border-radius:4px;cursor:pointer;-webkit-tap-highlight-color:transparent;scroll-margin:90px 0 24px}
    .cwSq.inWord{background:#fdf1cf;border-color:#e7c66b}
    .cwSq.active{background:#f2c14e;border-color:#c99a2a}
    .cwSq .l{font:700 calc(100cqw / var(--cols) * .52)/1 var(--sans);color:var(--ink)}
    .cwSq.wrong .l{color:var(--red)}
    .cwSq.wrong::after{content:"";position:absolute;inset:0;background:linear-gradient(to top right,transparent 47%,rgba(217,83,79,.55) 48% 52%,transparent 53%)}
    .cwSq.given .l{color:#3a6fb0}
    .cwSq .n{position:absolute;top:1px;left:2px;font:600 calc(100cqw / var(--cols) * .22)/1 var(--sans);color:var(--muted)}
    .cwSq .o{position:absolute;inset:12%;border:1.5px solid rgba(217,83,79,.55);border-radius:50%;pointer-events:none}
    .cwSq .s{position:absolute;right:2px;bottom:1px;font:700 calc(100cqw / var(--cols) * .2)/1 var(--sans);color:var(--red)}

    .cwSol{display:flex;align-items:center;justify-content:center;gap:12px;margin:18px 0 0}
    .cwSol span{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
    .cwSol div{display:flex;gap:4px}
    .cwSol b{display:grid;place-items:center;width:30px;height:34px;border:1.5px solid rgba(217,83,79,.55);border-radius:6px;background:#fff;font:700 17px/1 var(--sans)}
    .cwTools{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:14px 0 0}
    .cwTools button{padding:7px 14px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:14px}
    .cwTools button:hover{border-color:#cfdcd6;background:#f6f8f7}
    .cwMsg{min-height:1.5em;margin:10px 0 0;text-align:center;font-size:14px;color:var(--forest)}

    .cwLists{display:grid;gap:18px}
    .cwLists h4{margin:0 0 4px;font:600 12px/1.4 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
    .cwLists ol{margin:0;padding:0;list-style:none}
    .cwLists li{display:flex;gap:10px;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:14px;line-height:1.4}
    .cwLists li b{flex:none;min-width:18px;text-align:right}
    .cwLists li:hover{background:#f6f8f7}
    .cwLists li.current{background:#fdf1cf}
    .cwLists li.filled span{color:var(--muted)}
    .cwNote{margin:18px 0 0;text-align:center;font-size:13px;color:var(--muted)}

    .cwWin{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:rgba(31,45,56,.35)}
    .cwWin canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
    .cwWin .card{position:relative;max-width:360px;padding:28px 24px 24px;text-align:center;background:#fff;border-radius:22px;box-shadow:0 20px 60px rgba(31,45,56,.25)}
    .cwWin .k{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .cwWin .w{margin:4px 0 10px;font:700 40px/1.1 var(--serif);letter-spacing:.12em;color:var(--red)}
    .cwWin button{margin-top:10px;padding:9px 18px;border:0;border-radius:999px;background:var(--forest);color:#fff;font-weight:500}

    @media (max-width:600px){
      .stage:has(.cw){margin:0 -16px;border-radius:0;border-left:0;border-right:0}
      .cw{padding:12px 8px 20px}
      .cwDock{margin:-12px -8px 12px}
    }
    /* phones and tablets get an on-screen keyboard docked to the bottom, like the NYT apps */
    @media (pointer:coarse){
      .cw{padding-bottom:250px}
      .cwSq{scroll-margin:16px 0 260px}
      .cwDock{position:fixed;top:auto;left:0;right:0;bottom:0;margin:0;padding:8px 6px calc(8px + env(safe-area-inset-bottom));border-top:1px solid var(--line);border-bottom:0;box-shadow:0 -6px 20px rgba(31,45,56,.08)}
      .cwKeys{display:grid;gap:6px;margin-top:8px}
      .cwKeys div{display:flex;justify-content:center;gap:4px}
      .cwKeys button{flex:1;max-width:40px;height:44px;padding:0;border:0;border-radius:6px;background:#eef1f0;font:600 16px/1 var(--sans);color:var(--ink)}
      .cwKeys button:active{background:#d9e0dd}
      .cwKeys .wide{max-width:64px;flex:1.6}
    }`;
  document.head.append(style);
}
