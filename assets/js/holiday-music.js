/* =====================================================================
   HOLIDAY MUSIC — a button that plays two traditional carols (Jingle
   Bells, We Wish You a Merry Christmas) as a soft music box. The notes
   are played by the browser itself, so there is no audio file. Browsers
   only allow sound after a tap, so it never starts on its own: once a
   visitor turns it on, it resumes on their first tap on the next page.
   Loaded by site.js. Delete this file (and the line in site.js that
   loads it) after the holidays.
   ===================================================================== */

(() => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const KEY = "hermel_music";
  const NOTES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  // "F#5" → frequency in Hz
  const frequency = (name) => {
    const [, letter, sharp, octave] = name.match(/^([A-G])(#?)(\d)$/);
    const midi = 12 * (Number(octave) + 1) + NOTES[letter] + (sharp ? 1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  // Each song: tempo, then [note, beats] for the tune and the bass. "-" is a rest.
  const SONGS = [
    {
      bpm: 116,
      tune: [
        ["E5", 1], ["E5", 1], ["E5", 2], ["E5", 1], ["E5", 1], ["E5", 2],
        ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4],
        ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5], ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
        ["E5", 1], ["D5", 1], ["D5", 1], ["E5", 1], ["D5", 2], ["G5", 2],
        ["E5", 1], ["E5", 1], ["E5", 2], ["E5", 1], ["E5", 1], ["E5", 2],
        ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5], ["E5", 4],
        ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5], ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
        ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1], ["C5", 4],
      ],
      bass: [
        ["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2],
        ["F3", 2], ["C4", 2], ["C3", 2], ["G3", 2], ["G3", 2], ["D3", 2], ["G3", 2], ["B2", 2],
        ["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2], ["C3", 2], ["G3", 2],
        ["F3", 2], ["C4", 2], ["C3", 2], ["G3", 2], ["G3", 2], ["G2", 2], ["C3", 4],
      ],
    },
    {
      bpm: 132,
      tune: [
        ["-", 2], ["D5", 1],
        ["G5", 1], ["G5", 0.5], ["A5", 0.5], ["G5", 0.5], ["F#5", 0.5], ["E5", 1], ["E5", 1], ["E5", 1],
        ["A5", 1], ["A5", 0.5], ["B5", 0.5], ["A5", 0.5], ["G5", 0.5], ["F#5", 1], ["D5", 1], ["D5", 1],
        ["B5", 1], ["B5", 0.5], ["C6", 0.5], ["B5", 0.5], ["A5", 0.5], ["G5", 1], ["E5", 1], ["D5", 0.5], ["D5", 0.5],
        ["E5", 1], ["A5", 1], ["F#5", 1], ["G5", 3],
      ],
      bass: [
        ["-", 3],
        ["G3", 3], ["C3", 3], ["A2", 3], ["D3", 3], ["B2", 3], ["C3", 3], ["D3", 3], ["G2", 3],
      ],
    },
  ];

  let ctx = null;
  let output = null;
  let playing = false;
  let timer = null;
  let songIndex = 0;
  let queue = []; // notes of the current song not yet scheduled: { time, note, beats, voice }

  function setUp() {
    ctx = new AudioContextClass();
    output = ctx.createGain();
    output.gain.value = 0.18;
    // a short echo makes it sound like a music box in a room
    const echo = ctx.createDelay();
    const feedback = ctx.createGain();
    const soften = ctx.createBiquadFilter();
    echo.delayTime.value = 0.27;
    feedback.gain.value = 0.28;
    soften.type = "lowpass";
    soften.frequency.value = 2400;
    output.connect(ctx.destination);
    output.connect(echo);
    echo.connect(soften);
    soften.connect(feedback);
    feedback.connect(echo);
    soften.connect(ctx.destination);
  }

  function pluck(name, time, voice) {
    const loud = voice === "tune" ? 0.9 : 0.45;
    const ring = voice === "tune" ? 1.6 : 1.1;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(loud, time + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, time + ring);
    env.connect(output);
    // a pure tone plus a faint bright overtone, like a metal comb
    [[1, 1], [4, 0.12]].forEach(([ratio, level]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency(name) * ratio;
      gain.gain.value = level;
      osc.connect(gain);
      gain.connect(env);
      osc.start(time);
      osc.stop(time + ring + 0.05);
    });
  }

  function loadSong(startTime) {
    const song = SONGS[songIndex];
    const beat = 60 / song.bpm;
    queue = [];
    ["tune", "bass"].forEach((voice) => {
      let at = startTime;
      song[voice].forEach(([note, beats]) => {
        if (note !== "-") queue.push({ time: at, note, voice });
        at += beats * beat;
      });
    });
    queue.sort((a, b) => a.time - b.time);
    const length = song.tune.reduce((sum, [, beats]) => sum + beats, 0) * beat;
    return startTime + length;
  }

  // Schedules notes a little ahead so the timing stays steady.
  let songEnd = 0;
  function tick() {
    const horizon = ctx.currentTime + 0.4;
    while (queue.length && queue[0].time < horizon) {
      const { note, time, voice } = queue.shift();
      pluck(note, time, voice);
    }
    if (!queue.length && songEnd < horizon) {
      songIndex = (songIndex + 1) % SONGS.length;
      songEnd = loadSong(songEnd + 1.2); // a short pause between carols
    }
  }

  function start() {
    if (playing) return;
    if (!ctx) setUp();
    ctx.resume();
    output.gain.cancelScheduledValues(ctx.currentTime);
    output.gain.setValueAtTime(0.18, ctx.currentTime);
    playing = true;
    songEnd = loadSong(ctx.currentTime + 0.15);
    timer = setInterval(tick, 100);
    tick();
    render();
  }

  function stop() {
    if (!playing) return;
    playing = false;
    clearInterval(timer);
    queue = [];
    // fade out what is still ringing
    const now = ctx.currentTime;
    output.gain.cancelScheduledValues(now);
    output.gain.setValueAtTime(output.gain.value, now);
    output.gain.linearRampToValueAtTime(0, now + 0.4);
    setTimeout(() => {
      if (!playing) ctx.suspend();
    }, 450);
    render();
  }

  const remember = (on) => {
    try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (error) { /* storage blocked */ }
  };
  const wanted = () => {
    try { return localStorage.getItem(KEY) === "on"; } catch (error) { return false; }
  };

  /* ---- The button ---- */
  const button = document.createElement("button");
  button.type = "button";
  button.className = "music-toggle";
  button.innerHTML = `
    <svg class="icon music-toggle__note" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 17.5V5.5l10-2v12"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/></svg>
    <span class="music-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>`;
  document.body.appendChild(button);

  function render() {
    button.classList.toggle("is-playing", playing);
    button.setAttribute("aria-pressed", String(playing));
    button.setAttribute("aria-label", playing ? "Stop Christmas music" : "Play Christmas music");
    button.title = playing ? "Stop the music · إيقاف الموسيقى" : "Christmas music · موسيقى الميلاد";
  }

  // Turned on earlier: resume on the first tap or key press on this page.
  const events = ["pointerdown", "keydown"];
  function stopWaiting() {
    button.classList.remove("is-waiting");
    events.forEach((type) => document.removeEventListener(type, resume, true));
  }
  function resume(event) {
    if (button.contains(event.target)) return; // the button handles its own click
    stopWaiting();
    start();
  }
  if (wanted()) {
    button.classList.add("is-waiting");
    events.forEach((type) => document.addEventListener(type, resume, true));
  }

  button.addEventListener("click", () => {
    stopWaiting();
    if (playing) stop();
    else start();
    remember(playing);
  });

  // Quiet while the tab is in the background.
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !playing) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });

  render();
})();
