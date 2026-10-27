// weg.js: "Zeichnet den Weg". A map without roads shows where a trip starts and ends, the players draw
// the way they would take, by car or on foot, and the real route shows how much of it they got. The trips
// are listed in weg-routes.js.
import { PLACES, TRIPS } from './weg-routes.js';
import { loadLeaflet } from './leaflet.js';

// a cloud-free satellite mosaic that needs no key, blurred until no road is left
const PHOTOS = 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/g/{z}/{y}/{x}.jpg';
const ATTRIBUTION = '<a href="https://s2maps.eu">Sentinel-2 cloudless 2024</a> © EOX'
  + ' · © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
// a drawn stretch is on the route when it is within this share of the start-to-goal distance, or within
// MIN_TOLERANCE metres on a short walk, where the next street over is about that far
const TOLERANCE = 0.05;
const MIN_TOLERANCE = 60;
// the share of the trip's span to spare around it on the map; routes.py fetches the names for this framing
const FRAME_PAD = 0.35;
const SAVE_KEY = 'sa-weg-v1';
const DRAW_STYLE = { color: '#d9534f', weight: 5, opacity: 0.95, interactive: false };
const ROUTE_STYLE = { color: '#2e9b5b', weight: 6, interactive: false, className: 'wegRoute' };
const CASING_STYLE = { color: '#fff', weight: 10, opacity: 0.9, interactive: false, className: 'wegRoute' };
const HOUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V20h-5.5v-5h-5v5H4z" fill="#fff"/></svg>';
const FLAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21V4" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M7.5 4.5h11l-2.6 4 2.6 4h-11z" fill="#fff"/></svg>';

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const kmText = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 });
const keyOf = trip => `${trip.from}>${trip.to}`;
const listText = items => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} und ${items.at(-1)}`);
const verdict = (score, walk) => (score >= 85 ? 'Wie mit Navi!' : score >= 65 ? (walk ? 'Gut gelaufen!' : 'Gut gefahren!')
  : score >= 40 ? 'Mit kleinem Umweg.' : `Da hättet ihr euch ${walk ? 'verlaufen' : 'verfahren'}.`);

// [x, y] in metres for [lat, lng], flat around one latitude; close enough for a drive across Bavaria
function flat(lat0) {
  const k = Math.cos(lat0 * Math.PI / 180);
  return ([lat, lng]) => [lng * 111320 * k, lat * 110540];
}

function segmentDistance(p, a, b) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const t = dx || dy ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))) : 0;
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

function distanceTo(p, lines) {
  let best = Infinity;
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) best = Math.min(best, segmentDistance(p, line[i], line[i + 1] ?? line[i]));
  }
  return best;
}

// points every `step` metres along a line, starting with its first point
function along(line, step) {
  const points = [line[0]];
  let since = 0; // metres from the last point taken to the start of the current segment
  for (let i = 1; i < line.length; i++) {
    const [a, b] = [line[i - 1], line[i]];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let at = step - since;
    for (; at <= length; at += step) points.push([a[0] + (b[0] - a[0]) * at / length, a[1] + (b[1] - a[1]) * at / length]);
    since = length - (at - step);
  }
  return points;
}

// How well the drawing matches the route, 0 to 100. It weighs the share of the route the drawing follows
// against the share of the drawing that is on the route, so both missing stretches and detours cost.
function match(trip, strokes) {
  const toXY = flat(trip.route[0][0]);
  const route = trip.route.map(toXY);
  const lines = strokes.map(stroke => stroke.map(toXY));
  const [a, b] = [trip.from, trip.to].map(k => toXY([PLACES[k].lat, PLACES[k].lng]));
  const tolerance = Math.max(MIN_TOLERANCE, TOLERANCE * Math.hypot(b[0] - a[0], b[1] - a[1]));
  const near = (points, others) => points.filter(p => distanceTo(p, others) <= tolerance).length / (points.length || 1);
  const followed = near(along(route, tolerance / 4), lines);
  const onRoute = near(lines.flatMap(line => along(line, tolerance / 4)), [route]);
  return followed + onRoute ? Math.round(200 * followed * onRoute / (followed + onRoute)) : 0;
}

// a small picture of the route and the drawing, for the results
function thumbnail(trip, strokes) {
  const toXY = flat(trip.route[0][0]);
  const lines = [trip.route, ...strokes].map(line => line.map(toXY));
  const xs = lines.flat().map(p => p[0]), ys = lines.flat().map(p => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const scale = 48 / Math.max(x1 - x0, y1 - y0, 1);
  // centred in a 56px square with 4px to spare
  const [left, top] = [28 - (x1 - x0) * scale / 2, 28 - (y1 - y0) * scale / 2];
  const path = line => line.map(([x, y], i) => `${i ? 'L' : 'M'}${(left + (x - x0) * scale).toFixed(1)} ${(top + (y1 - y) * scale).toFixed(1)}`).join('');
  const [route, ...drawn] = lines;
  return `<svg class="wegThumb" viewBox="0 0 56 56" aria-hidden="true"><path d="${path(route)}" class="real"/>${drawn.map(l => `<path d="${path(l)}" class="mine"/>`).join('')}</svg>`;
}

// The intro shows a way being drawn and checked on a made-up map, then the rules from games.js.
const DEMO = `
  <svg class="wegDemo" viewBox="0 0 320 168" role="img" aria-label="Ein Finger zeichnet einen Weg vom Haus zur Fahne, dann erscheint die echte Route.">
    <defs><filter id="wegDemoBlur"><feGaussianBlur stdDeviation="5"/></filter><clipPath id="wegDemoClip"><rect width="320" height="168" rx="14"/></clipPath></defs>
    <g clip-path="url(#wegDemoClip)">
      <rect width="320" height="168" fill="#7b8f5c"/>
      <g filter="url(#wegDemoBlur)">
        <ellipse cx="160" cy="40" rx="70" ry="26" fill="#3f5a36"/><ellipse cx="250" cy="130" rx="60" ry="30" fill="#405c37"/>
        <rect x="60" y="20" width="60" height="44" fill="#a5a777"/><rect x="200" y="70" width="70" height="36" fill="#b6ad7e"/>
        <ellipse cx="46" cy="128" rx="34" ry="24" fill="#9a958c"/><ellipse cx="272" cy="44" rx="30" ry="22" fill="#9a958c"/>
        <rect x="110" y="110" width="70" height="40" fill="#8ea365"/>
      </g>
      <g><animate attributeName="opacity" values="1;1;0" keyTimes="0;.93;1" dur="7s" repeatCount="indefinite"/>
        <path d="M46 128C82 128 92 104 128 100S172 96 196 76 246 52 272 44" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1">
          <animate attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes="0;.51;.69;1" dur="7s" repeatCount="indefinite"/></path>
        <path d="M46 128C82 128 92 104 128 100S172 96 196 76 246 52 272 44" fill="none" stroke="#2e9b5b" stroke-width="6" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1">
          <animate attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes="0;.51;.69;1" dur="7s" repeatCount="indefinite"/></path>
        <path id="wegDemoDraw" d="M46 128C66 110 100 118 126 104S166 66 200 70 252 52 272 44" fill="none" stroke="#d9534f" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1">
          <animate attributeName="stroke-dashoffset" values="1;1;0;0" keyTimes="0;.09;.46;1" dur="7s" repeatCount="indefinite"/></path>
      </g>
      <g transform="translate(46 128)"><circle r="12" fill="#2f5d4a" stroke="#fff" stroke-width="2.5"/><path d="M-6.5 -0.5 0-6l6.5 5.5V7h-4.3V3h-4.4v4H-6.5z" fill="#fff"/></g>
      <g transform="translate(272 44)"><circle r="12" fill="#d9534f" stroke="#fff" stroke-width="2.5"/><path d="M-4 7V-7M-3.6 -6.5h8.6l-2 3.2 2 3.2h-8.6z" fill="#fff" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></g>
      <g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.05;.09;.46;.5;1" dur="7s" repeatCount="indefinite"/>
        <animateMotion dur="7s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.09;.46;1" calcMode="linear"><mpath href="#wegDemoDraw"/></animateMotion>
        <circle r="13" fill="#fff" opacity=".35"/><circle r="7" fill="#fff" stroke="#1f2d38" stroke-opacity=".25"/></g>
      <g opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.7;.75;.93;1" dur="7s" repeatCount="indefinite"/>
        <rect x="14" y="14" width="112" height="30" rx="15" fill="#fff"/>
        <text x="70" y="34" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#2f5d4a">82 % passt</text></g>
    </g>
  </svg>`;

export async function start(stage, { game }) {
  injectStyle();
  stage.innerHTML = '<p class="wegNote">Die Karte wird geladen …</p>';
  let L;
  try {
    L = await loadLeaflet();
  } catch {
    stage.innerHTML = '<p class="wegNote">Die Karte konnte nicht geladen werden. Versucht es gleich nochmal.</p>';
    return;
  }
  if (!stage.isConnected) return; // the players left while the map was loading

  // Progress is a score and the drawing per trip, kept by the trip's start and goal so that trips
  // added to weg-routes.js later are simply still to play.
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } })();
  const done = Object.fromEntries(Object.entries(saved.done || {}).filter(([k]) => TRIPS.some(t => keyOf(t) === k)));
  let seenIntro = Boolean(saved.seenIntro);
  const save = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ done, seenIntro })); } catch {} };

  stage.innerHTML = `
    <div class="weg">
      <div class="wegBar"><span class="wegNum"></span><span class="wegRight"><span class="wegScore"></span>
        <button type="button" class="wegHelp" aria-label="So geht’s" title="So geht’s">?</button></span></div>
      <div class="wegPlay">
        <h3 class="wegTitle"></h3>
        <div class="wegMapBox">
          <div class="wegMap"></div>
          <p class="wegHint">Zeichnet den Weg vom Haus zur Fahne</p>
        </div>
        <div class="wegFoot">
          <div class="wegResult" role="status"></div>
          <div class="wegButtons">
            <button type="button" class="wegUndo">Rückgängig</button>
            <button type="button" class="wegGo"></button>
          </div>
        </div>
      </div>
      <div class="wegEnd" hidden></div>
      <div class="wegIntro" hidden>
        <div class="wegCard">
          ${DEMO}
          <h3>So geht’s</h3>
          <ol class="wegSteps">${game.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
          <p class="wegTip">Abgesetzt? Einfach weiterzeichnen. Verzeichnet? „Rückgängig“ nimmt den letzten Strich zurück.</p>
          <button type="button" class="wegGo" data-close>Los geht’s</button>
        </div>
      </div>
    </div>`;
  const $ = sel => stage.querySelector(sel);
  const [play, end, intro, mapBox, hint, title, result, undo, go] =
    ['.wegPlay', '.wegEnd', '.wegIntro', '.wegMapBox', '.wegHint', '.wegTitle', '.wegResult', '.wegUndo', '.wegFoot .wegGo'].map($);
  const demo = $('.wegDemo');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { demo.pauseAnimations(); demo.setCurrentTime(5.8); }

  // The map stays put, so every drag on it draws.
  const map = L.map($('.wegMap'), {
    zoomControl: false, dragging: false, touchZoom: false, doubleClickZoom: false, scrollWheelZoom: false,
    boxZoom: false, keyboard: false, zoomSnap: 0,
  }).setView([48.4, 10.5], 8);
  map.attributionControl.setPrefix(false);
  L.tileLayer(PHOTOS, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
  map.createPane('names').style.zIndex = 350; // place names lie under the lines
  const nameLayer = L.layerGroup().addTo(map);
  const routeLayer = L.layerGroup().addTo(map);
  const drawLayer = L.layerGroup().addTo(map);
  const pinLayer = L.layerGroup().addTo(map);

  let trip = null;
  let strokes = []; // each a { points: [[lat, lng], ...], line } the players drew
  let drawing = null;
  let revealed = false;

  // the start and goal with room around them, widened if the route strays further, and clear of the hint
  // at the top and of the pins' names and the credits at the bottom however small the map gets
  function frame() {
    map.fitBounds(L.latLngBounds([trip.from, trip.to].map(k => [PLACES[k].lat, PLACES[k].lng]))
      .pad(FRAME_PAD).extend(L.latLngBounds(trip.route)), { animate: false, paddingTopLeft: [0, 30], paddingBottomRight: [0, 40] });
    names();
  }

  // Place names come with the trip, biggest first. Each sits on its place, or just above, below or beside
  // it where it would cover a pin, the hint, the credits or a name already shown, and is left out if none
  // of those spots is free.
  function names() {
    nameLayer.clearLayers();
    const area = mapBox.getBoundingClientRect();
    const pins = pinLayer.getLayers().flatMap(m => [m.getElement(), m.getTooltip().getElement()]);
    const taken = [map.attributionControl.getContainer(), ...pins, ...(hint.hidden ? [] : [hint])].map(el => el.getBoundingClientRect());
    const free = r => r.left >= area.left && r.right <= area.right && r.top >= area.top && r.bottom <= area.bottom
      && !taken.some(t => r.left < t.right + 6 && r.right > t.left - 6 && r.top < t.bottom + 3 && r.bottom > t.top - 3);
    for (const [name, lat, lng, size] of trip.labels) {
      const label = L.marker([lat, lng], {
        pane: 'names', interactive: false, keyboard: false,
        icon: L.divIcon({ className: `wegName size${size}`, html: `<span>${esc(name)}</span>`, iconSize: [0, 0] }),
      }).addTo(nameLayer);
      const text = label.getElement().firstChild;
      const [up, aside] = [text.offsetHeight + 4, text.offsetWidth / 2 + 30]; // beside it clears a pin near the place
      const spots = [[0, 0], [0, -up], [0, up], [aside, 0], [-aside, 0], [0, -2 * up], [0, 2 * up]];
      const placed = spots.some(([x, y]) => {
        Object.assign(text.style, { left: `${x}px`, top: `${y}px` });
        return free(text.getBoundingClientRect());
      });
      if (placed) taken.push(text.getBoundingClientRect()); else label.remove();
    }
  }
  const resize = new ResizeObserver(() => { map.invalidateSize(); if (trip) frame(); });
  resize.observe(mapBox);

  const pin = (place, kind) => L.marker([place.lat, place.lng], {
    icon: L.divIcon({ className: `wegPin ${kind}`, html: kind === 'start' ? HOUSE : FLAG, iconSize: [30, 30] }),
    interactive: false, keyboard: false,
  }).bindTooltip(esc(place.name), { permanent: true, direction: 'bottom', offset: [0, 12], className: 'wegLabel' });

  function counters() {
    const scores = Object.values(done).map(d => d.score);
    $('.wegNum').textContent = trip ? `Weg ${TRIPS.indexOf(trip) + 1} von ${TRIPS.length}` : `${TRIPS.length} Wege`;
    $('.wegScore').innerHTML = scores.length ? `Ø <b>${Math.round(scores.reduce((a, b) => a + b) / scores.length)} %</b> passt` : '';
  }

  function buttons() {
    undo.hidden = revealed;
    undo.disabled = !strokes.length;
    go.disabled = !revealed && !strokes.length;
    go.textContent = !revealed ? 'Fertig' : TRIPS.some(t => !done[keyOf(t)]) ? 'Nächster Weg' : 'Zum Ergebnis';
  }

  function next() {
    trip = TRIPS.find(t => !done[keyOf(t)]);
    if (!trip) return showEnd();
    play.hidden = false;
    end.hidden = true;
    revealed = false;
    strokes = [];
    [routeLayer, drawLayer, pinLayer].forEach(layer => layer.clearLayers());
    pin(PLACES[trip.from], 'start').addTo(pinLayer);
    pin(PLACES[trip.to], 'goal').addTo(pinLayer);
    title.textContent = trip.title;
    result.innerHTML = '';
    hint.hidden = false;
    frame(); // once the page around the map is laid out for this trip
    mapBox.classList.add('fresh');
    counters();
    buttons();
  }

  function reveal() {
    revealed = true;
    const score = match(trip, strokes.map(s => s.points));
    const round = n => Math.round(n * 1e5) / 1e5;
    done[keyOf(trip)] = { score, strokes: strokes.map(s => s.points.map(p => p.map(round))) };
    save();
    // the real route goes under the drawing and traces itself in
    const lines = [L.polyline(trip.route, CASING_STYLE), L.polyline(trip.route, ROUTE_STYLE)];
    lines.forEach(line => line.addTo(routeLayer).getElement().setAttribute('pathLength', 1));
    lines.reverse().forEach(line => line.bringToBack());
    const [real, legend, time] = trip.walk ? ['Der kürzeste Fußweg', 'Kürzester Fußweg', 'Minuten zu Fuß']
      : ['Die echte Route', 'Echte Route', 'Minuten'];
    const via = trip.via.length ? ` über ${esc(listText(trip.via))}` : '';
    result.innerHTML = `<b>${score} % passt.</b> ${verdict(score, trip.walk)}
      <p>${real}: ${kmText.format(trip.km)} km${via}, etwa ${trip.minutes} ${time}.
      <span class="wegKey"><i class="mine"></i>Euer Weg <i class="real"></i>${legend}</span></p>`;
    counters();
    buttons();
  }

  function showEnd() {
    trip = null;
    counters();
    play.hidden = true;
    end.hidden = false;
    end.innerHTML = `
      <p class="k">Ergebnis</p>
      <p class="big">${$('.wegScore').innerHTML}</p>
      <ol>${TRIPS.map(t => `<li>${thumbnail(t, done[keyOf(t)].strokes)}
        <div><b title="${esc(t.title)}">${esc(t.title)}</b><span>${done[keyOf(t)].score} % passt</span></div></li>`).join('')}</ol>
      <button type="button" class="wegGo" data-again>Nochmal spielen</button>`;
  }

  function showIntro(open) {
    intro.hidden = !open;
    if (!open && !seenIntro) { seenIntro = true; save(); }
  }

  const mapEl = $('.wegMap');
  mapEl.addEventListener('pointerdown', e => {
    if (revealed || !trip || e.button > 0 || e.target.closest('.leaflet-control')) return;
    e.preventDefault();
    mapEl.setPointerCapture(e.pointerId);
    const start = map.mouseEventToLatLng(e);
    drawing = { points: [[start.lat, start.lng]], line: L.polyline([start], DRAW_STYLE).addTo(drawLayer) };
    hint.hidden = true;
    mapBox.classList.remove('fresh');
  });
  mapEl.addEventListener('pointermove', e => {
    if (!drawing) return;
    const point = map.mouseEventToLatLng(e);
    if (map.latLngToContainerPoint(point).distanceTo(map.latLngToContainerPoint(drawing.points.at(-1))) < 3) return;
    drawing.points.push([point.lat, point.lng]);
    drawing.line.addLatLng(point);
  });
  const finish = () => {
    if (!drawing) return;
    if (drawing.points.length > 1) strokes.push(drawing); else drawing.line.remove(); // a tap draws nothing
    drawing = null;
    buttons();
  };
  mapEl.addEventListener('pointerup', finish);
  mapEl.addEventListener('pointercancel', finish);

  undo.addEventListener('click', () => { strokes.pop()?.line.remove(); buttons(); });
  go.addEventListener('click', () => (revealed ? next() : reveal()));
  end.addEventListener('click', e => {
    if (!e.target.closest('[data-again]')) return;
    for (const k of Object.keys(done)) delete done[k];
    save();
    next();
  });
  $('.wegHelp').addEventListener('click', () => showIntro(intro.hidden));
  intro.addEventListener('click', e => { if (e.target === intro || e.target.closest('[data-close]')) showIntro(false); });
  const onKey = e => { if (e.key === 'Escape' && !intro.hidden) showIntro(false); };
  document.addEventListener('keydown', onKey);

  next();
  if (!seenIntro) showIntro(true);
  return () => {
    document.removeEventListener('keydown', onKey);
    resize.disconnect();
    map.remove();
  };
}

function injectStyle() {
  if (document.getElementById('weg-style')) return;
  const style = document.createElement('style');
  style.id = 'weg-style';
  style.textContent = `
    /* --route is the real route's green, as in ROUTE_STYLE */
    .weg{--route:#2e9b5b;position:relative;height:100%;display:flex;flex-direction:column;padding:14px 18px 18px}
    .weg [hidden]{display:none}
    .wegNote{margin:0;padding:70px 20px;text-align:center;color:var(--muted)}
    .wegBar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:8px;font-size:14px;color:var(--muted)}
    .wegRight{display:flex;align-items:center;gap:8px}
    .wegScore{padding:4px 12px;border-radius:999px;background:var(--sky)}
    .wegScore:empty{display:none}
    .wegScore b{color:var(--ink)}
    .wegHelp{width:30px;height:30px;padding:0;border:1px solid var(--line);border-radius:50%;background:var(--paper);font-weight:600;color:var(--forest)}
    .wegHelp:hover{border-color:var(--forest)}

    .wegPlay{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px}
    .wegTitle{margin:0;font:600 20px/1.25 var(--serif)}
    .wegMapBox{position:relative;flex:1;min-height:180px;border-radius:14px;overflow:hidden;background:#66764f}
    .wegMap{position:absolute;inset:0;z-index:0;cursor:crosshair}
    .wegMap.leaflet-container{font:inherit;background:#66764f;touch-action:none}
    /* blurred until no road is left; the place names stay sharp */
    .wegMap .leaflet-tile-pane{filter:blur(2px)}
    .wegMap .leaflet-control-attribution{font-size:10px}
    .wegHint{position:absolute;z-index:1;top:10px;left:50%;transform:translateX(-50%);max-width:calc(100% - 20px);margin:0;padding:6px 14px;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 2px 10px rgba(0,0,0,.18);font-size:13px;font-weight:600;color:var(--forest);text-align:center;pointer-events:none}
    .wegPin{display:grid;place-items:center;border:2.5px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.35)}
    .wegPin.start{background:var(--forest)}
    .wegPin.goal{background:var(--red)}
    .wegPin svg{width:17px;height:17px}
    .wegMapBox.fresh .wegPin.start{animation:wegPulse 1.6s ease-out infinite}
    @keyframes wegPulse{0%{box-shadow:0 0 0 0 rgba(255,255,255,.85),0 2px 8px rgba(0,0,0,.35)}100%{box-shadow:0 0 0 16px rgba(255,255,255,0),0 2px 8px rgba(0,0,0,.35)}}
    .wegMap .wegLabel{padding:1px 7px;border:0;border-radius:6px;background:rgba(31,45,56,.85);box-shadow:none;font:600 12px/1.4 var(--sans);color:#fff}
    .wegMap .wegLabel::before{display:none}
    .wegName span{position:absolute;transform:translate(-50%,-50%);white-space:nowrap;font:600 12px/1.2 var(--sans);color:#fff;text-shadow:0 0 3px rgba(0,0,0,.9),0 1px 3px rgba(0,0,0,.7)}
    .wegName.size1 span{font-size:15px}
    .wegName.size2 span{font-size:13px}
    .wegName.size4 span{font-size:11px;font-style:italic}
    .wegRoute{stroke-dasharray:1;animation:wegTrace 1.6s ease-in-out both}
    @keyframes wegTrace{from{stroke-dashoffset:1}}

    .wegFoot{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:10px}
    .wegResult{flex:1 1 260px;padding:8px 14px;border-radius:12px;background:#f6f8f7;font-size:14px;color:var(--muted)}
    .wegResult:empty{display:none}
    .wegResult b{margin-right:4px;font-size:16px;color:var(--forest)}
    .wegResult p{margin:2px 0 0;color:var(--ink)}
    .wegKey{display:block;font-size:12px;color:var(--muted)}
    .wegKey i{display:inline-block;width:14px;height:4px;margin:0 5px 2px 0;border-radius:2px;vertical-align:middle}
    .wegKey i.real{margin-left:10px;background:var(--route)}
    .wegKey i.mine{background:var(--red)}
    .wegButtons{display:flex;gap:8px}
    .wegUndo{padding:10px 16px;border:1px solid var(--line);border-radius:999px;background:var(--paper);font-size:15px;font-weight:600;color:var(--forest)}
    .wegUndo:disabled{color:#b3bfba;cursor:default}
    .wegGo{padding:11px 22px;border:0;border-radius:999px;background:var(--forest);font-size:15px;font-weight:600;color:#fff}
    .wegGo:disabled{background:#c9d3cf;cursor:default}

    .wegIntro{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;padding:14px;border-radius:inherit;background:var(--paper);overflow:auto}
    /* the demo gives way so the whole card fits without scrolling */
    .wegCard{display:flex;flex-direction:column;width:min(440px,100%);max-height:100%;text-align:center}
    .wegDemo{display:block;flex:0 1 auto;width:100%;height:34vh;min-height:90px;margin:0 auto 6px}
    .wegCard h3{margin:0 0 6px;font:600 20px/1.3 var(--serif)}
    .wegSteps{margin:0;padding:0;list-style:none;text-align:left;font-size:14px;line-height:1.45;counter-reset:s}
    .wegSteps li{position:relative;padding:7px 0 7px 36px;border-top:1px solid var(--line);counter-increment:s}
    .wegSteps li::before{content:counter(s);position:absolute;left:0;top:6px;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--sky);font-weight:600;font-size:12px;color:var(--forest)}
    .wegTip{margin:6px 0 12px;font-size:13px;color:var(--muted)}

    .wegEnd{flex:1;min-height:0;overflow:auto;text-align:center}
    .wegEnd .k{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .wegEnd .big{margin:2px 0 14px;font:700 30px/1.2 var(--serif)}
    .wegEnd .big b{font-weight:inherit}
    .wegEnd ol{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin:0 0 16px;padding:0;list-style:none;text-align:left}
    .wegEnd li{display:flex;align-items:center;gap:10px;padding:6px;border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.35}
    .wegEnd li div{min-width:0}
    .wegEnd li b{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .wegEnd li span{font-size:13px;color:var(--muted)}
    .wegThumb{flex:none;width:56px;height:56px;border-radius:8px;background:#eef2ec}
    .wegThumb path{fill:none;stroke-linecap:round;stroke-linejoin:round}
    .wegThumb .real{stroke:var(--route);stroke-width:3.5}
    .wegThumb .mine{stroke:var(--red);stroke-width:2}

    @media (max-width:600px){
      .weg{padding:12px}
      .wegTitle{font-size:18px}
      .wegResult{padding:7px 12px;font-size:13px}
      .wegEnd .big{margin-bottom:10px;font-size:26px}
      .wegEnd ol{gap:6px}
      .wegEnd li{padding:4px}
      .wegThumb{width:44px;height:44px}
    }`;
  document.head.append(style);
}
