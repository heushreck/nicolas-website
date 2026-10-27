// tutorial.js: the "So geht’s" pop-up. It opens the first time a game is played and again from the
// "?" in the top bar, and lists the game's steps from games.js, each with one of the icons below.

const SEEN_KEY = 'sa-tutorial-seen-v1';

// Line icons on a 24px grid, drawn in the stroke colour of .tutIcon
const ICONS = {
  photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-8 8"/>',
  pin: '<path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2.2"/>',
  distance: '<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 16.3 17 7.7" stroke-dasharray="2 2.6"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  pencil: '<path d="m4 20 1-4L16 5l3 3L8 19z"/><path d="m14 7 3 3"/>',
  route: '<circle cx="5" cy="18" r="2"/><path d="M7 18c4 0 3-6 7-6s3-4 4-5"/><path d="M18 3v6M18 3h3.5l-1.2 1.5 1.2 1.5H18"/>',
  undo: '<path d="M9 6 4 11l5 5"/><path d="M4 11h10a5 5 0 0 1 0 10h-3"/>',
  rings: '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="m12 3 1.6 2-1.6 2-1.6-2z"/>',
  disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M7.5 9a5.5 5.5 0 0 1 3-2.5"/>',
  listen: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6L12 16.8l-5.4 2.8 1.1-6-4.5-4.2 6.1-.8z"/>',
  grid: '<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
  check: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12.3 2.8 2.7L16 9.5"/>',
  solution: '<circle cx="12" cy="12" r="8.5"/><path d="m9 16 3-8 3 8M10.1 13.4h3.8"/>',
};

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const seenIds = () => { try { return JSON.parse(localStorage.getItem(SEEN_KEY)) || []; } catch { return []; } };

export const seenTutorial = id => seenIds().includes(id);

// Opens the pop-up for a game and returns a function that closes it. art is optional markup shown
// above the steps; an animated SVG in it holds still on its data-still second for reduced motion.
export function openTutorial(game, art = '') {
  injectStyle();
  const dialog = document.createElement('dialog');
  dialog.className = 'tut';
  dialog.setAttribute('aria-label', `So geht’s: ${game.title}`);
  dialog.innerHTML = `
    ${art ? `<div class="tutArt">${art}</div>` : ''}
    <h3>So geht’s</h3>
    <ol>${game.steps.map(s => `
      <li><span class="tutIcon" style="background:${game.tint}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.icon] || ''}</svg></span><span>${esc(s.text)}</span></li>`).join('')}
    </ol>
    <button type="button" autofocus>Los geht’s</button>`;
  document.body.append(dialog);
  // a click on the button or on the dimmed page around the card closes it, and so does Escape
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target.closest('button')) dialog.close(); });
  dialog.addEventListener('close', () => {
    dialog.remove();
    try { localStorage.setItem(SEEN_KEY, JSON.stringify([...new Set([...seenIds(), game.id])])); } catch {}
  });
  dialog.showModal();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    for (const svg of dialog.querySelectorAll('svg[data-still]')) { svg.pauseAnimations(); svg.setCurrentTime(Number(svg.dataset.still)); }
  }
  return () => { if (dialog.open) dialog.close(); };
}

function injectStyle() {
  if (document.getElementById('tut-style')) return;
  const style = document.createElement('style');
  style.id = 'tut-style';
  style.textContent = `
    /* the art gives way so the whole card fits on screen without scrolling */
    .tut{width:min(420px,calc(100% - 32px));max-height:calc(100dvh - 32px);padding:20px 22px 18px;border:0;border-radius:22px;background:var(--paper);box-shadow:0 20px 60px rgba(31,45,56,.25);color:var(--ink);text-align:center}
    .tut[open]{display:flex;flex-direction:column;animation:tutIn .25s ease-out}
    .tut::backdrop{background:rgba(31,45,56,.4)}
    @keyframes tutIn{from{opacity:0;transform:translateY(10px) scale(.98)}}
    .tutArt{flex:0 1 auto;min-height:80px;margin-bottom:8px}
    .tutArt svg{display:block;width:100%;height:auto;max-height:30vh}
    .tut h3{margin:0 0 8px;font:600 20px/1.3 var(--serif)}
    .tut ol{margin:0 0 14px;padding:0;list-style:none;text-align:left;font-size:14px;line-height:1.45}
    .tut li{display:flex;align-items:center;gap:12px;padding:7px 0;border-top:1px solid var(--line)}
    .tutIcon{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:11px}
    .tutIcon svg{width:22px;height:22px;fill:none;stroke:var(--forest);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .tut button{align-self:center;padding:11px 26px;border:0;border-radius:999px;background:var(--forest);font-size:15px;font-weight:600;color:#fff;cursor:pointer}`;
  document.head.append(style);
}
