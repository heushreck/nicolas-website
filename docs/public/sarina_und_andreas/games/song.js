// song.js: "Wie heißt der Song?". The first seconds of a song play and the players pick its title from
// four. Knowing it after 3 seconds scores most; each longer listen they ask for is worth less. The
// songs are listed in song-list.js; the clips and covers are Apple Music's 30-second previews, looked
// up when the game starts.
import { SONGS } from './song-list.js';

const LOOKUP = 'https://itunes.apple.com/lookup';
const OPTIONS = 4;
// how much of the clip the players may hear, and what a right answer is worth after hearing that much
const STEPS = [{ seconds: 3, points: 3 }, { seconds: 10, points: 2 }, { seconds: 30, points: 1 }];
const FULL = STEPS.at(-1).seconds;
const BEST_KEY = 'sa-song-best-v3'; // v3: a game plays every song, so records from shorter games don't count

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const same = (a, b) => a.toLowerCase() === b.toLowerCase();
const pointsText = n => `${n} ${n === 1 ? 'Punkt' : 'Punkte'}`;

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

  const arc = `cx="50" cy="50" r="48" pathLength="1"`;
  stage.innerHTML = `
    <div class="sg">
      <div class="sgBar"><span class="sgNum"></span><span class="sgScore"></span></div>
      <div class="sgPlay">
        <div class="sgDeck">
          <button type="button" class="sgDisc">
            <svg class="sgRing" viewBox="0 0 100 100" aria-hidden="true"><circle ${arc}/><circle class="open" ${arc}/><circle class="t" ${arc}/>${
              STEPS.slice(0, -1).map(s => `<circle class="tick" ${arc} style="stroke-dashoffset:${0.004 - s.seconds / FULL}"/>`).join('')}</svg>
            <span class="sgVinyl"><span class="sgLabel"><img alt=""><b>?</b></span></span>
            <span class="sgIcon" aria-hidden="true"></span>
          </button>
          <p class="sgNow" role="status"></p>
          <button type="button" class="sgMore"></button>
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
  const [play, end, disc, open, ring, cover, now, more, opts, say, go] =
    ['.sgPlay', '.sgEnd', '.sgDisc', '.sgRing .open', '.sgRing .t', '.sgLabel img', '.sgNow', '.sgMore', '.sgOpts', '.sgSay', '.sgGo'].map($);

  let round, at, audio, step, answered, score, streak, bestStreak, results, stopTimer;

  // Wrong answers are two other songs by the same artist, so recognising the voice isn't enough,
  // filled up with other titles in the same language, so the language doesn't give it away either.
  function choices(song) {
    const picked = [song.title];
    const add = title => { if (picked.length < OPTIONS && !picked.some(p => same(p, title))) picked.push(title); };
    const others = songs.filter(s => s !== song);
    const sameLanguage = others.filter(s => s.lang === song.lang);
    shuffle([...song.decoys]).slice(0, 2).forEach(add);
    shuffle(sameLanguage.map(s => s.title)).forEach(add);
    shuffle([...song.decoys, ...sameLanguage.flatMap(s => s.decoys)]).forEach(add);
    shuffle(others.flatMap(s => [s.title, ...s.decoys])).forEach(add);
    return shuffle(picked);
  }

  function counters() {
    $('.sgNum').textContent = round[at] ? `Song ${at + 1} von ${round.length}` : `${round.length} Songs`;
    $('.sgScore').innerHTML = `<b>${score}</b> Punkte${streak > 1 ? ` · Serie <b>${streak}</b>` : ''}`;
  }

  // the ring shows how far the clip has played, over the part the players may hear
  function drawRing() {
    ring.style.strokeDashoffset = 1 - Math.min((audio?.currentTime || 0) / FULL, 1);
    open.style.strokeDashoffset = answered ? 0 : 1 - STEPS[step].seconds / FULL;
  }

  // Pauses the clip at the end of what the players may hear. The audio element reports its time
  // only a few times a second, so a timer aims at the exact moment and is re-aimed on each report.
  function holdAtLimit() {
    clearTimeout(stopTimer);
    if (!audio || audio.paused || answered) return;
    const left = STEPS[step].seconds - audio.currentTime;
    if (left <= 0.02) audio.pause();
    else stopTimer = setTimeout(holdAtLimit, left * 1000);
  }

  function animateRing() {
    drawRing();
    if (audio && !audio.paused) requestAnimationFrame(animateRing);
  }

  function showStep() {
    const { seconds, points } = STEPS[step];
    const longer = STEPS[step + 1];
    now.innerHTML = `<b>${seconds} Sekunden</b>Wisst ihr’s jetzt, gibt’s ${pointsText(points)}`;
    more.classList.toggle('off', !longer);
    if (longer) more.textContent = `Mehr hören: ${longer.seconds} Sekunden für ${pointsText(longer.points)}`;
    drawRing();
  }

  function newGame() {
    round = shuffle([...songs]); // every song, in a new order each game
    at = -1;
    score = streak = bestStreak = 0;
    results = [];
    play.hidden = false;
    end.hidden = true;
    next();
  }

  function setDisc(state) {
    disc.dataset.state = state; // loading, playing, paused or over
    disc.setAttribute('aria-label', state === 'playing' ? 'Pause' : 'Abspielen');
  }

  // Sound only ever starts from the players: a tap on the record, or asking to hear more. Answering
  // and moving on to the next song stop it. (Phones also require a tap before a page may play sound.)
  function playClip() {
    setDisc('loading');
    audio.play().catch(() => setDisc('paused'));
  }

  function next() {
    stopAudio();
    at++;
    if (at === round.length) return showEnd();
    const song = round[at];
    step = 0;
    answered = false;
    counters();
    cover.removeAttribute('src');
    more.hidden = false;
    more.disabled = true;
    showStep();
    opts.innerHTML = choices(song).map((t, i) => `<button type="button" data-title="${esc(t)}" disabled><kbd>${i + 1}</kbd>${esc(t)}</button>`).join('');
    say.className = 'sgSay';
    say.textContent = `${at ? '' : 'Jeder dieser Songs lief an eurer Hochzeit. '}Tippt auf die Platte, dann geht’s los.`;
    go.hidden = true;
    // the events of a song that was already stopped can still arrive, so each listener checks
    const clip = audio = new Audio(song.preview);
    clip.preload = 'auto';
    clip.addEventListener('playing', () => {
      if (clip !== audio) return;
      setDisc('playing');
      if (!answered) say.textContent = '';
      more.disabled = false;
      for (const b of opts.children) b.disabled = answered;
      holdAtLimit();
      requestAnimationFrame(animateRing);
    });
    clip.addEventListener('timeupdate', () => { if (clip === audio) { drawRing(); holdAtLimit(); } });
    clip.addEventListener('pause', () => { if (clip === audio && !clip.ended) { setDisc('paused'); drawRing(); } });
    clip.addEventListener('ended', () => { if (clip === audio) setDisc('over'); });
    clip.addEventListener('error', () => {
      if (clip !== audio || answered) return;
      setDisc('over');
      now.textContent = 'Dieser Song lädt gerade nicht.';
      more.hidden = true;
      for (const b of opts.children) b.disabled = false;
    });
    setDisc('paused');
    if (round[at + 1]) new Audio(round[at + 1].preview).preload = 'auto';
  }

  function listenLonger() {
    if (answered || !audio || !STEPS[step + 1]) return;
    step++;
    showStep();
    if (audio.paused) playClip(); // carries on from where it stopped
    else holdAtLimit();
  }

  function answer(title) {
    if (answered || !audio) return;
    answered = true;
    const song = round[at];
    const right = same(title, song.title);
    const { seconds, points: worth } = STEPS[step];
    const points = right ? worth : 0;
    if (right) {
      streak++;
      bestStreak = Math.max(bestStreak, streak);
    }
    const lost = !right && streak > 1;
    if (!right) streak = 0;
    score += points;
    results.push({ song, right, points, seconds });

    for (const b of opts.children) {
      b.disabled = true;
      if (same(b.dataset.title, song.title)) b.className = 'right';
      else if (b.dataset.title === title) b.className = 'wrong';
    }
    if (song.cover) cover.src = song.cover;
    now.innerHTML = `<b>${esc(song.title)}</b>${esc(song.artist)}`;
    more.hidden = true;
    say.className = `sgSay ${right ? 'right' : 'wrong'}`;
    say.innerHTML = right
      ? `<b>Richtig!</b> +${pointsText(points)} nach ${seconds} Sekunden`
      : `<b>Leider nicht.</b>${lost ? ' Eure Serie ist vorbei.' : ''}`;
    go.hidden = false;
    go.textContent = at + 1 < round.length ? 'Nächster Song' : 'Zum Ergebnis';
    counters();
    drawRing();
    audio.pause(); // a tap on the record plays the rest
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
      <p class="big">${score} von ${results.length * STEPS[0].points} Punkten</p>
      <p class="sub">${right} von ${results.length} richtig · längste Serie ${bestStreak} · ${score > best ? 'neuer Rekord!' : `Rekord ${best}`}</p>
      <ol>${results.map(({ song, right, points, seconds }) => `
        <li class="${right ? 'right' : 'wrong'}"><a href="${esc(song.link)}" target="_blank" rel="noopener">
          <img src="${esc(song.cover)}" alt="" loading="lazy">
          <div><b title="${esc(song.title)}">${esc(song.title)}</b><span>${esc(song.artist)}</span></div>
          <em>${right ? `+${points}<small>${seconds} Sek.</small>` : '✗'}</em></a></li>`).join('')}</ol>
      <button type="button" class="sgGo" data-again>Nochmal spielen</button>
      <p class="credit">Hörproben von Apple Music. Tippt auf einen Song, um ihn ganz zu hören.</p>`;
  }

  function stopAudio() {
    clearTimeout(stopTimer);
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    audio = null;
  }

  disc.addEventListener('click', () => {
    if (!audio) return;
    if (!audio.paused) {
      if (answered) audio.pause();
      return;
    }
    // before the answer a tap replays the part they may hear; afterwards it carries on with the song
    if (!answered || audio.ended) audio.currentTime = 0;
    playClip();
  });
  more.addEventListener('click', listenLonger);
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
    .sgDeck{--below:112px;flex:1 1 0;min-height:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;container-type:size}
    .sgDisc{position:relative;flex:none;width:max(56px,min(300px,100cqw,calc(100cqh - var(--below))));aspect-ratio:1;padding:0;border:0;border-radius:50%;background:none;-webkit-tap-highlight-color:transparent}
    .sgRing{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}
    .sgRing circle{fill:none;stroke:var(--line);stroke-width:2.5}
    .sgRing .open{stroke:#cfe3c4;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset .4s}
    .sgRing .t{stroke:var(--forest);stroke-dasharray:1;stroke-dashoffset:1}
    .sgRing .tick{stroke:var(--paper);stroke-width:5;stroke-dasharray:.008 1}
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
    .sgMore{padding:7px 16px;border:1.5px solid var(--line);border-radius:999px;background:#fff;font-size:14px;font-weight:600;color:var(--forest)}
    .sgMore:hover:not(:disabled){border-color:#cfdcd6;background:#f6f8f7}
    .sgMore:disabled{opacity:.45;cursor:default}
    .sgMore.off{visibility:hidden}
    .sgDeck:has(.sgMore[hidden]){--below:64px}

    .sgSide{flex:none;display:flex;flex-direction:column;gap:12px}
    .sgOpts{display:grid;gap:8px}
    .sgOpts:empty{display:none}
    .sgOpts button{display:flex;align-items:center;gap:10px;min-height:44px;padding:9px 14px;border:1.5px solid var(--line);border-radius:14px;background:#fff;text-align:left;font-weight:500;line-height:1.3;transition:border-color .15s,background .15s}
    .sgOpts button:not(:disabled):hover{border-color:#cfdcd6;background:#f6f8f7}
    .sgOpts button:disabled{cursor:default}
    .sgOpts kbd{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:6px;background:var(--sky);font:600 12px/1 var(--sans);color:var(--muted)}
    .sgOpts button:disabled:not(.right):not(.wrong){color:var(--muted)}
    .sgOpts .right{border-color:#8fc39a;background:#e3f2e6}
    .sgOpts .right::after,.sgOpts .wrong::after{margin-left:auto;font-weight:700}
    .sgOpts .right::after{content:"✓";color:var(--forest)}
    .sgOpts .wrong::after{content:"✗";color:var(--red)}
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
    .sgEnd em{flex:none;padding-right:6px;font-style:normal;font-weight:600;line-height:1.2;text-align:center;color:var(--forest)}
    .sgEnd em small{display:block;font-size:11px;font-weight:500;color:var(--muted)}
    .sgEnd .wrong em{color:var(--red)}
    .sgEnd .credit{margin:12px 0 0;font-size:12px;color:var(--muted)}

    @media (max-width:600px){.sg{padding:12px}}`;
  document.head.append(style);
}
