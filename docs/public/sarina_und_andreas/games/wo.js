// wo.js: "Wo war das?". A photo appears, the players tap the map where it was taken, and the distance
// decides whether it counts as right. The photos are listed in wo-photos.js and stored in wo/.
import { PHOTOS, RIGHT_WITHIN_KM } from './wo-photos.js';
import { loadLeaflet } from './leaflet.js';

// the German OpenStreetMap style labels places in German (Lissabon, Rom) and needs no API key
const TILES = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
const ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>';
const START_VIEW = { center: [48.5, 10.5], zoom: 4 }; // Europe, with southern Germany in the middle
const SAVE_KEY = 'sa-wo-v1';
const GUESS_STYLE = { radius: 8, color: '#fff', weight: 3, fillColor: '#d9534f', fillOpacity: 1 };
const SPOT_STYLE = { radius: 8, color: '#fff', weight: 3, fillColor: '#2f5d4a', fillOpacity: 1 };
const LINE_STYLE = { color: '#1f2d38', weight: 2, dashArray: '6 6', opacity: 0.7 };

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const km = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const distanceText = d => (d < 1 ? 'Weniger als 1 km daneben' : `${km.format(d)} km daneben`);
const src = p => new URL(`./wo/${p.file}`, import.meta.url).href;

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export async function start(stage) {
  injectStyle();
  if (!PHOTOS.length) {
    stage.innerHTML = '<p class="woNote">Hier kommen bald eure Fotos hin.</p>';
    return;
  }
  stage.innerHTML = '<p class="woNote">Die Karte wird geladen …</p>';
  let L;
  try {
    L = await loadLeaflet();
  } catch {
    stage.innerHTML = '<p class="woNote">Die Karte konnte nicht geladen werden. Versucht es gleich nochmal.</p>';
    return;
  }
  if (!stage.isConnected) return; // the players left while the map was loading

  // The run is a shuffled order of photo files plus a guess per file. Photos added to wo-photos.js
  // later join the end of the run; removed ones drop out.
  const byFile = new Map(PHOTOS.map(p => [p.file, p]));
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } })();
  const guesses = Object.fromEntries(Object.entries(saved.guesses || {}).filter(([f]) => byFile.has(f)));
  let order = (saved.order || []).filter(f => byFile.has(f));
  order.push(...shuffle([...byFile.keys()].filter(f => !order.includes(f))));
  const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ order, guesses })); } catch {} };
  const isRight = f => guesses[f].km <= (byFile.get(f).radiusKm ?? RIGHT_WITHIN_KM);
  save();

  stage.innerHTML = `
    <div class="wo">
      <div class="woBar"><span class="woNum"></span><span class="woScore"></span></div>
      <div class="woPlay">
        <figure class="woPhoto" title="Zum Vergrößern antippen"><img alt=""></figure>
        <div class="woSide">
          <div class="woMap"></div>
          <div class="woResult" role="status"></div>
          <button type="button" class="woGo"></button>
        </div>
      </div>
      <div class="woEnd" hidden></div>
    </div>`;
  const $ = sel => stage.querySelector(sel);
  const [play, end, photo, img, result, go] = ['.woPlay', '.woEnd', '.woPhoto', '.woPhoto img', '.woResult', '.woGo'].map($);

  const map = L.map($('.woMap'), { worldCopyJump: true }).setView(START_VIEW.center, START_VIEW.zoom);
  L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 18 }).addTo(map);
  const marks = L.layerGroup().addTo(map);
  const resize = new ResizeObserver(() => map.invalidateSize());
  resize.observe($('.woMap'));

  let file = null;
  let guess = null;
  let revealed = false;

  function counters(round) {
    const done = order.filter(f => guesses[f]);
    $('.woNum').textContent = round ? `Foto ${round} von ${order.length}` : `${order.length} Fotos`;
    $('.woScore').innerHTML = `<b>${done.filter(isRight).length}</b> richtig · <b>${order.length - done.length}</b> übrig`;
  }

  function next() {
    file = order.find(f => !guesses[f]);
    if (!file) return showEnd();
    const round = order.filter(f => guesses[f]).length + 1;
    counters(round);
    play.hidden = false;
    end.hidden = true;
    guess = null;
    revealed = false;
    marks.clearLayers();
    img.src = src(byFile.get(file));
    img.alt = `Foto ${round}`;
    result.textContent = '';
    result.className = 'woResult';
    go.disabled = true;
    go.textContent = 'Tippt auf die Karte';
    map.setView(START_VIEW.center, START_VIEW.zoom, { animate: false });
    const upcoming = order.find(f => !guesses[f] && f !== file);
    if (upcoming) new Image().src = src(byFile.get(upcoming));
  }

  map.on('click', e => {
    if (revealed) return;
    guess = e.latlng.wrap();
    marks.clearLayers();
    L.circleMarker(guess, GUESS_STYLE).addTo(marks);
    go.disabled = false;
    go.textContent = 'Hier war’s!';
  });

  function reveal() {
    const p = byFile.get(file);
    const spot = L.latLng(p.lat, p.lng);
    const distance = guess.distanceTo(spot) / 1000;
    guesses[file] = { lat: guess.lat, lng: guess.lng, km: Math.round(distance * 10) / 10 };
    save();
    revealed = true;
    counters(order.filter(f => guesses[f]).length);
    L.polyline([guess, spot], LINE_STYLE).addTo(marks);
    L.circleMarker(spot, SPOT_STYLE).bindTooltip(esc(p.place), { permanent: true, direction: 'top', offset: [0, -10], className: 'woTip' }).addTo(marks);
    map.fitBounds(L.latLngBounds([guess, spot]), { padding: [60, 60], maxZoom: 9 });
    const right = isRight(file);
    result.className = `woResult ${right ? 'right' : 'wrong'}`;
    result.innerHTML = `<b>${right ? (distance < 5 ? 'Volltreffer!' : 'Richtig!') : 'Leider daneben.'}</b> ${distanceText(distance)}
      <p>${esc(p.place)}${p.note ? ` · ${esc(p.note)}` : ''}</p>`;
    go.textContent = order.some(f => !guesses[f]) ? 'Nächstes Foto' : 'Zum Ergebnis';
  }

  function showEnd() {
    counters();
    play.hidden = true;
    end.hidden = false;
    end.innerHTML = `
      <p class="k">Ergebnis</p>
      <p class="big">${order.filter(isRight).length} von ${order.length} richtig</p>
      <ol>${order.map(f => {
        const p = byFile.get(f);
        return `<li class="${isRight(f) ? 'right' : 'wrong'}"><img src="${src(p)}" alt="" loading="lazy">
          <div><b title="${esc(p.place)}">${esc(p.place)}</b><span>${distanceText(guesses[f].km)}</span></div></li>`;
      }).join('')}</ol>
      <button type="button" class="woGo" data-again>Nochmal spielen</button>`;
  }

  function again() {
    for (const f of Object.keys(guesses)) delete guesses[f];
    order = shuffle([...byFile.keys()]);
    save();
    next();
  }

  go.addEventListener('click', () => (revealed ? next() : reveal()));
  end.addEventListener('click', e => { if (e.target.closest('[data-again]')) again(); });
  photo.addEventListener('click', () => photo.classList.toggle('zoom'));
  const onKey = e => { if (e.key === 'Escape') photo.classList.remove('zoom'); };
  document.addEventListener('keydown', onKey);

  next();
  return () => {
    document.removeEventListener('keydown', onKey);
    resize.disconnect();
    map.remove();
  };
}

function injectStyle() {
  if (document.getElementById('wo-style')) return;
  const style = document.createElement('style');
  style.id = 'wo-style';
  style.textContent = `
    /* the photo and the map share whatever height the stage has: stacked on phones, side by side on wider screens */
    .wo{height:100%;display:flex;flex-direction:column;padding:14px 18px 18px}
    .wo [hidden]{display:none}
    .woNote{margin:0;padding:70px 20px;text-align:center;color:var(--muted)}
    .woBar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;font-size:14px;color:var(--muted)}
    .woScore{padding:4px 12px;border-radius:999px;background:var(--sky)}
    .woScore b{color:var(--ink)}

    .woPlay{flex:1;min-height:0;display:flex;flex-direction:column;gap:12px}
    .woPhoto{position:relative;flex:1 1 0;min-height:120px;margin:0;background:#1f2d38;border-radius:14px;overflow:hidden;cursor:zoom-in}
    .woPhoto img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
    .woPhoto.zoom{position:fixed;inset:0;z-index:60;border-radius:0;background:rgba(15,22,28,.94);cursor:zoom-out}
    .woSide{flex:1.2 1 0;min-height:0;display:flex;flex-direction:column;gap:10px}
    .woMap{position:relative;z-index:0;flex:1;min-height:150px;border:1px solid var(--line);border-radius:14px;background:#eef1f0}
    .woMap.leaflet-container{font:inherit}
    .woTip{font:600 13px/1.3 var(--sans);color:var(--forest)}
    @media (min-width:760px){
      .woPlay{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr)}
    }

    .woResult{padding:10px 14px;border-radius:12px;background:#f6f8f7;font-size:14px;color:var(--muted)}
    .woResult:empty{display:none}
    .woResult b{margin-right:4px;font-size:16px}
    .woResult.right b{color:var(--forest)}
    .woResult.wrong b{color:var(--red)}
    .woResult p{margin:2px 0 0;color:var(--ink)}
    .woGo{padding:11px 18px;border:0;border-radius:999px;background:var(--forest);font-size:15px;font-weight:600;color:#fff}
    .woGo:disabled{background:#c9d3cf;cursor:default}

    .woEnd{flex:1;min-height:0;overflow:auto;text-align:center}
    .woEnd .k{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .woEnd .big{margin:2px 0 14px;font:700 30px/1.2 var(--serif)}
    .woEnd ol{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;margin:0 0 16px;padding:0;list-style:none;text-align:left}
    .woEnd li{display:flex;align-items:center;gap:10px;padding:6px;border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.35}
    .woEnd li img{flex:none;width:44px;height:44px;object-fit:cover;border-radius:8px}
    .woEnd li div{min-width:0}
    .woEnd li b{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .woEnd li span{font-size:13px;color:var(--muted)}
    .woEnd li.right span::before{content:"✓ ";color:var(--forest)}
    .woEnd li.wrong span::before{content:"✗ ";color:var(--red)}

    @media (max-width:600px){.wo{padding:12px}}`;
  document.head.append(style);
}
