// song.js: "Wie heißt der Song?". A song plays, the players pick its title from four, and the sooner
// they're right the more points they get. The songs are listed in song-list.js; the clips and covers
// are Apple Music's 30-second previews, looked up when the game starts.
import { SONGS } from './song-list.js';

const LOOKUP = 'https://itunes.apple.com/lookup';
const ROUND = 10; // songs per game
const OPTIONS = 4;
const MAX_POINTS = 100; // for a right answer straight away, falling to MIN_POINTS when the clip ends
const MIN_POINTS = 10;
const STREAK_BONUS = 10; // per right answer in a row before this one, up to STREAK_CAP of them
const STREAK_CAP = 5;
const CLIP_SECONDS = 30; // the length of Apple's previews, until the clip itself says
const BEST_KEY = 'sa-song-best-v1';

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const same = (a, b) => a.toLowerCase() === b.toLowerCase();

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

// Apple's preview links can change, so they are looked up by song ID each time rather than stored
async function lookup(ids) {
  const response = await fetch(`${LOOKUP}?id=${ids.join(',')}&country=DE`);
  if (!response.ok) throw new Error(`lookup ${response.status}`);
  const { results } = await response.json();
  return new Map(results.filter(r => r.previewUrl).map(r => [r.trackId, {
    preview: r.previewUrl,
    cover: r.artworkUrl100?.replace('100x100bb', '600x600bb'),
    link: r.trackViewUrl,
  }]));
}

export async function start(stage) {
  injectStyle();
  if (!SONGS.length) {
    stage.innerHTML = '<p class="sgNote">Hier kommen bald eure Songs hin.</p>';
    return;
  }
  stage.innerHTML = '<p class="sgNote">Die Songs werden geladen …</p>';
  let found;
  try {
    found = await lookup(SONGS.map(s => s.id));
  } catch {
    stage.innerHTML = '<p class="sgNote">Die Songs konnten nicht geladen werden. Versucht es gleich nochmal.</p>';
    return;
  }
  if (!stage.isConnected) return; // the players left while the songs were loading
  const songs = SONGS.filter(s => found.has(s.id)).map(s => ({ ...s, ...found.get(s.id) }));

  stage.innerHTML = `
    <div class="sg">
      <div class="sgBar"><span class="sgNum"></span><span class="sgScore"></span></div>
      <div class="sgPlay">
        <div class="sgDeck">
          <button type="button" class="sgDisc">
            <svg class="sgRing" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48"/><circle class="t" cx="50" cy="50" r="48" pathLength="1"/></svg>
            <span class="sgVinyl"><span class="sgLabel"><img alt=""><b>?</b></span></span>
            <span class="sgIcon" aria-hidden="true"></span>
          </button>
          <p class="sgNow" role="status"></p>
        </div>
        <div class="sgSide">
          <div class="sgOpts"></div>
          <p class="sgSay"></p>
          <button type="button" class="sgGo"></button>
        </div>
      </div>
      <div class="sgEnd" hidden></div>
    </div>`;
  const $ = sel => stage.querySelector(sel);
  const [play, end, disc, ring, cover, now, opts, say, go] =
    ['.sgPlay', '.sgEnd', '.sgDisc', '.sgRing .t', '.sgLabel img', '.sgNow', '.sgOpts', '.sgSay', '.sgGo'].map($);

  let round, at, audio, answered, heardAll, score, streak, bestStreak, results;
  const clipLength = () => audio.duration || CLIP_SECONDS;

  // Wrong answers are two other songs by the same artist, so recognising the voice isn't enough,
  // filled up with other titles from the list.
  function choices(song) {
    const picked = [song.title];
    const add = title => { if (picked.length < OPTIONS && !picked.some(p => same(p, title))) picked.push(title); };
    shuffle([...song.decoys]).slice(0, 2).forEach(add);
    shuffle(songs.filter(s => s !== song).map(s => s.title)).forEach(add);
    shuffle(songs.flatMap(s => s.decoys)).forEach(add);
    return shuffle(picked);
  }

  function counters() {
    $('.sgNum').textContent = round[at] ? `Song ${at + 1} von ${round.length}` : `${round.length} Songs`;
    $('.sgScore').innerHTML = `<b>${score}</b> Punkte${streak > 1 ? ` · Serie <b>${streak}</b>` : ''}`;
  }

  function newGame() {
    round = shuffle([...songs]).slice(0, ROUND);
    at = -1;
    score = streak = bestStreak = 0;
    results = [];
    play.hidden = false;
    end.hidden = true;
    counters();
    setDisc('ready');
    cover.removeAttribute('src');
    now.textContent = 'Tippt auf die Platte, dann läuft der erste Song.';
    opts.innerHTML = '';
    say.className = 'sgSay';
    say.textContent = 'Je schneller ihr den richtigen Titel antippt, desto mehr Punkte. Mehrere richtige Antworten in Folge geben einen Bonus.';
    go.hidden = false;
    go.textContent = 'Los geht’s';
  }

  function setDisc(state) {
    disc.dataset.state = state; // ready, loading, playing, paused or over
    disc.setAttribute('aria-label', state === 'playing' ? 'Pause' : 'Abspielen');
  }

  // Playing starts from a tap, which phones require before a page may play sound.
  function next() {
    stopAudio();
    at++;
    if (at === round.length) return showEnd();
    const song = round[at];
    answered = heardAll = false;
    counters();
    cover.removeAttribute('src');
    now.textContent = 'Wie heißt der Song?';
    opts.innerHTML = choices(song).map((t, i) => `<button type="button" data-title="${esc(t)}" disabled><kbd>${i + 1}</kbd>${esc(t)}</button>`).join('');
    say.textContent = '';
    go.hidden = true;
    audio = new Audio(song.preview);
    audio.addEventListener('playing', () => {
      setDisc('playing');
      for (const b of opts.children) b.disabled = answered;
    });
    audio.addEventListener('pause', () => { if (!audio.ended) setDisc('paused'); });
    audio.addEventListener('ended', () => { heardAll = true; setDisc('over'); });
    audio.addEventListener('timeupdate', () => { ring.style.strokeDashoffset = 1 - audio.currentTime / clipLength(); });
    audio.addEventListener('error', () => {
      if (answered) return;
      setDisc('over');
      now.textContent = 'Dieser Song lädt gerade nicht.';
      for (const b of opts.children) b.disabled = false;
    });
    ring.style.strokeDashoffset = 1;
    setDisc('loading');
    audio.play().catch(() => setDisc('paused'));
    if (round[at + 1]) new Audio(round[at + 1].preview).preload = 'auto';
  }

  function answer(title) {
    if (answered || !audio) return;
    answered = true;
    const song = round[at];
    const right = same(title, song.title);
    const heard = heardAll ? clipLength() : audio.currentTime;
    let points = 0;
    let bonus = 0;
    if (right) {
      points = Math.max(MIN_POINTS, Math.round(MAX_POINTS * (1 - heard / clipLength())));
      bonus = Math.min(streak, STREAK_CAP) * STREAK_BONUS;
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    }
    const lost = !right && streak > 1;
    if (!right) streak = 0;
    score += points + bonus;
    results.push({ song, right, points: points + bonus });

    for (const b of opts.children) {
      b.disabled = true;
      if (same(b.dataset.title, song.title)) b.className = 'right';
      else if (b.dataset.title === title) b.className = 'wrong';
    }
    if (song.cover) cover.src = song.cover;
    now.innerHTML = `<b>${esc(song.title)}</b>${esc(song.artist)}`;
    say.className = `sgSay ${right ? 'right' : 'wrong'}`;
    say.innerHTML = right
      ? `<b>Richtig!</b> +${points} Punkte${bonus ? `, dazu +${bonus} für eure Serie` : ''}`
      : `<b>Leider nicht.</b>${lost ? ' Eure Serie ist vorbei.' : ''}`;
    go.hidden = false;
    go.textContent = at + 1 < round.length ? 'Nächster Song' : 'Zum Ergebnis';
    counters();
  }

  function showEnd() {
    const best = (() => { try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; } })();
    if (score > best) try { localStorage.setItem(BEST_KEY, String(score)); } catch {}
    counters();
    play.hidden = true;
    end.hidden = false;
    const right = results.filter(r => r.right).length;
    end.innerHTML = `
      <p class="k">Ergebnis</p>
      <p class="big">${score} Punkte</p>
      <p class="sub">${right} von ${results.length} richtig · längste Serie ${bestStreak} · ${score > best ? 'neuer Rekord!' : `Rekord ${best}`}</p>
      <ol>${results.map(({ song, right, points }) => `
        <li class="${right ? 'right' : 'wrong'}"><a href="${esc(song.link)}" target="_blank" rel="noopener">
          <img src="${esc(song.cover)}" alt="" loading="lazy">
          <div><b title="${esc(song.title)}">${esc(song.title)}</b><span>${esc(song.artist)}</span></div>
          <em>${right ? `+${points}` : '✗'}</em></a></li>`).join('')}</ol>
      <button type="button" class="sgGo" data-again>Nochmal spielen</button>
      <p class="credit">Hörproben von Apple Music. Tippt auf einen Song, um ihn ganz zu hören.</p>`;
  }

  function stopAudio() {
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audio = null;
  }

  disc.addEventListener('click', () => {
    if (disc.dataset.state === 'ready') return next();
    if (!audio) return;
    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (answered) {
      audio.pause();
    }
  });
  go.addEventListener('click', next);
  opts.addEventListener('click', e => { const b = e.target.closest('button'); if (b && !b.disabled) answer(b.dataset.title); });
  end.addEventListener('click', e => { if (e.target.closest('[data-again]')) newGame(); });
  const onKey = e => {
    if (e.metaKey || e.ctrlKey || e.altKey || !end.hidden) return;
    const option = opts.children[Number(e.key) - 1];
    if (option && !option.disabled) answer(option.dataset.title);
    else if (e.key === 'Enter' && !go.hidden) { e.preventDefault(); next(); }
  };
  document.addEventListener('keydown', onKey);

  newGame();
  return () => {
    document.removeEventListener('keydown', onKey);
    stopAudio();
  };
}

function injectStyle() {
  if (document.getElementById('sg-style')) return;
  const style = document.createElement('style');
  style.id = 'sg-style';
  style.textContent = `
    /* the record and the answers share the stage: stacked on phones, side by side on wider screens */
    .sg{height:100%;display:flex;flex-direction:column;padding:14px 18px 18px}
    .sg [hidden]{display:none}
    .sgNote{margin:0;padding:70px 20px;text-align:center;color:var(--muted)}
    .sgBar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;font-size:14px;color:var(--muted)}
    .sgScore{padding:4px 12px;border-radius:999px;background:var(--sky)}
    .sgScore b{color:var(--ink)}

    .sgPlay{flex:1;min-height:0;display:flex;flex-direction:column;gap:14px}
    .sgDeck{flex:1 1 0;min-height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;container-type:size}
    .sgDisc{position:relative;flex:none;width:min(300px,100cqw,calc(100cqh - 64px));aspect-ratio:1;padding:0;border:0;border-radius:50%;background:none;-webkit-tap-highlight-color:transparent}
    .sgRing{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
    .sgRing circle{fill:none;stroke:var(--line);stroke-width:2.5}
    .sgRing .t{stroke:var(--forest);stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .3s linear}
    .sgVinyl{position:absolute;inset:7%;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,transparent 30%,rgba(255,255,255,.07) 31%,transparent 32%,transparent 44%,rgba(255,255,255,.06) 45%,transparent 46%,transparent 58%,rgba(255,255,255,.06) 59%,transparent 60%),repeating-radial-gradient(circle,#1f2d38 0 2px,#283845 2px 4px);box-shadow:0 10px 30px rgba(31,45,56,.25);animation:sgSpin 3.2s linear infinite;animation-play-state:paused}
    .sgDisc[data-state="playing"] .sgVinyl{animation-play-state:running}
    @keyframes sgSpin{to{transform:rotate(360deg)}}
    .sgLabel{position:relative;display:grid;place-items:center;width:38%;aspect-ratio:1;border-radius:50%;background:var(--red);overflow:hidden;box-shadow:0 0 0 3px rgba(255,255,255,.15)}
    .sgLabel::after{content:"";position:absolute;width:9%;aspect-ratio:1;border-radius:50%;background:#1f2d38}
    .sgLabel img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
    .sgLabel img:not([src]){display:none}
    .sgLabel b{font:700 clamp(22px,10cqmin,40px)/1 var(--serif);color:#fff;transform:translateY(-12%)}
    .sgIcon{position:absolute;left:50%;top:50%;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:50%;background:rgba(255,255,255,.94);box-shadow:0 6px 18px rgba(31,45,56,.25);transition:transform .2s}
    .sgIcon::before{content:"";position:absolute;left:26px;top:20px;border:12px solid transparent;border-left:19px solid var(--forest);border-right:0}
    .sgDisc:hover .sgIcon{transform:scale(1.06)}
    .sgDisc[data-state="loading"] .sgIcon,.sgDisc[data-state="playing"] .sgIcon{display:none}
    .sgNow{min-height:2.8em;margin:0;text-align:center;line-height:1.4;color:var(--muted)}
    .sgNow b{display:block;font:700 19px/1.3 var(--serif);color:var(--ink)}

    .sgSide{flex:none;display:flex;flex-direction:column;gap:12px}
    .sgOpts{display:grid;gap:8px}
    .sgOpts:empty{display:none}
    .sgOpts button{display:flex;align-items:center;gap:10px;min-height:48px;padding:10px 14px;border:1.5px solid var(--line);border-radius:14px;background:#fff;text-align:left;font-weight:500;line-height:1.3;transition:border-color .15s,background .15s}
    .sgOpts button:not(:disabled):hover{border-color:#cfdcd6;background:#f6f8f7}
    .sgOpts button:disabled{cursor:default}
    .sgOpts kbd{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:6px;background:var(--sky);font:600 12px/1 var(--sans);color:var(--muted)}
    .sgOpts .right{border-color:#a9cfb0;background:#eaf5ec}
    .sgOpts .right kbd{background:var(--forest);color:#fff}
    .sgOpts .wrong{border-color:rgba(217,83,79,.5);background:#fbeceb}
    .sgOpts .wrong kbd{background:var(--red);color:#fff}
    .sgSay{margin:0;padding:10px 14px;border-radius:12px;background:#f6f8f7;font-size:14px;color:var(--muted)}
    .sgSay:empty{display:none}
    .sgSay b{margin-right:4px;font-size:16px}
    .sgSay.right b{color:var(--forest)}
    .sgSay.wrong b{color:var(--red)}
    .sgGo{padding:11px 18px;border:0;border-radius:999px;background:var(--forest);font-size:15px;font-weight:600;color:#fff}
    @media (min-width:760px){
      .sgPlay{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);grid-template-rows:minmax(0,1fr);align-items:center;gap:28px}
      .sgDeck{height:100%}
    }
    @media (pointer:coarse){.sgOpts kbd{display:none}}

    .sgEnd{flex:1;min-height:0;overflow:auto;text-align:center}
    .sgEnd .k{margin:0;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
    .sgEnd .big{margin:2px 0 0;font:700 30px/1.2 var(--serif)}
    .sgEnd .sub{margin:2px 0 14px;font-size:14px;color:var(--muted)}
    .sgEnd ol{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;margin:0 0 16px;padding:0;list-style:none;text-align:left}
    .sgEnd a{display:flex;align-items:center;gap:10px;padding:6px;border:1px solid var(--line);border-radius:12px;font-size:14px;line-height:1.35;text-decoration:none;transition:border-color .15s}
    .sgEnd a:hover{border-color:#cfdcd6}
    .sgEnd img{flex:none;width:44px;height:44px;object-fit:cover;border-radius:8px;background:var(--sky)}
    .sgEnd a div{flex:1;min-width:0}
    .sgEnd b,.sgEnd span{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
    .sgEnd span{font-size:13px;color:var(--muted)}
    .sgEnd em{flex:none;padding-right:6px;font-style:normal;font-weight:600;color:var(--forest)}
    .sgEnd .wrong em{color:var(--red)}
    .sgEnd .credit{margin:12px 0 0;font-size:12px;color:var(--muted)}

    @media (max-width:600px){.sg{padding:12px}}`;
  document.head.append(style);
}
