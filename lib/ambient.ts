/**
 * Generative ambient soundtrack (Web Audio, no audio file): slow evolving pads on
 * a four-chord loop, glassy notes, a long synthesized reverb and a breathing
 * low-pass filter. It is locked to the hero video's 6 s loop: a new chord on each
 * loop start, a note when the walk begins (2.2 s) and an arpeggio on the cut to
 * the dance (4 s). Off-screen it keeps the same 6 s clock. Starts only from a user
 * gesture; fades in/out; suspends while the tab is hidden.
 */
type Engine = {
  ctx: AudioContext;
  master: GainNode;
  bus: BiquadFilterNode;
  sparkleBus: GainNode;
};

const CHORDS = [
  [48, 55, 59, 62, 64], // Cmaj9
  [45, 52, 55, 60, 64], // Am7
  [41, 48, 52, 55, 60], // Fmaj7
  [43, 50, 55, 59, 62], // G6/9
];
const SPARKLE = [72, 74, 76, 79, 81, 84];
const LEVEL = 0.2;
const CYCLE = 6; // seconds — the hero video loop
const CUES = [
  { at: 0, play: "chord" },
  { at: 2.2, play: "note" },
  { at: 4.0, play: "arpeggio" },
] as const;

let engine: Engine | null = null;
let running = false;
let raf = 0;
let stopTimer = 0;
let chordIndex = 0;
let lastPhase = -1;

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function build(): Engine {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  master.connect(comp).connect(ctx.destination);

  // Long, dark reverb from decaying noise.
  const len = ctx.sampleRate * 5;
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = impulse.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
  }
  const reverb = ctx.createConvolver();
  reverb.buffer = impulse;
  const wet = ctx.createGain();
  wet.gain.value = 0.75;
  const dry = ctx.createGain();
  dry.gain.value = 0.45;
  reverb.connect(wet).connect(master);
  dry.connect(master);

  // Pads go through a slowly breathing low-pass.
  const bus = ctx.createBiquadFilter();
  bus.type = "lowpass";
  bus.frequency.value = 1100;
  bus.Q.value = 0.4;
  const lfo = ctx.createOscillator();
  const lfoDepth = ctx.createGain();
  lfo.frequency.value = 0.04;
  lfoDepth.gain.value = 450;
  lfo.connect(lfoDepth).connect(bus.frequency);
  lfo.start();
  bus.connect(dry);
  bus.connect(reverb);

  // Glassy notes get a soft echo before the reverb.
  const sparkleBus = ctx.createGain();
  sparkleBus.gain.value = 0.5;
  const delay = ctx.createDelay(2);
  delay.delayTime.value = 0.42;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.35;
  sparkleBus.connect(reverb);
  sparkleBus.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(reverb);

  return { ctx, master, bus, sparkleBus };
}

function pad(e: Engine, midi: number, at: number, dur: number, level: number) {
  const g = e.ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(level, at + 2.8);
  g.gain.setValueAtTime(level, at + dur - 3.5);
  g.gain.linearRampToValueAtTime(0, at + dur);
  g.connect(e.bus);
  for (const [type, detune] of [
    ["sine", -6],
    ["triangle", 7],
  ] as const) {
    const o = e.ctx.createOscillator();
    o.type = type;
    o.frequency.value = hz(midi);
    o.detune.value = detune;
    o.connect(g);
    o.start(at);
    o.stop(at + dur + 0.1);
  }
}

function playChord(e: Engine) {
  const t = e.ctx.currentTime + 0.05;
  const notes = CHORDS[chordIndex % CHORDS.length];
  chordIndex++;
  pad(e, notes[0] - 12, t, CYCLE + 4, 0.05); // soft sub root
  notes.forEach((n, i) => pad(e, n, t + i * 0.12, CYCLE + 4, 0.028));
}

function sparkle(e: Engine, delay = 0, midi = SPARKLE[Math.floor(Math.random() * SPARKLE.length)]) {
  const t = e.ctx.currentTime + 0.02 + delay;
  const o = e.ctx.createOscillator();
  const g = e.ctx.createGain();
  o.type = "sine";
  o.frequency.value = hz(midi);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.035, t + 0.04);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
  o.connect(g).connect(e.sparkleBus);
  o.start(t);
  o.stop(t + 3.1);
}

/** Current position in the 6 s cycle: the hero video's time when it plays, the audio clock otherwise. */
function phase(e: Engine) {
  const v = document.querySelector<HTMLVideoElement>("[data-hero-video]");
  if (v && !v.paused && v.readyState >= 2) return v.currentTime % CYCLE;
  return e.ctx.currentTime % CYCLE;
}

function tick() {
  if (!engine || !running) return;
  const e = engine;
  const p = phase(e);
  // A cue fires when the phase crosses it (including the wrap back to 0).
  const wrapped = p < lastPhase;
  for (const cue of CUES) {
    const crossed = wrapped ? cue.at > lastPhase || cue.at <= p : cue.at > lastPhase && cue.at <= p;
    if (!crossed || lastPhase < 0) continue;
    if (cue.play === "chord") playChord(e);
    else if (cue.play === "note") sparkle(e);
    else {
      const start = Math.floor(Math.random() * 3);
      [0, 2, 4].forEach((step, i) => sparkle(e, i * 0.16, SPARKLE[(start + step) % SPARKLE.length]));
    }
  }
  lastPhase = p;
  raf = requestAnimationFrame(tick);
}

function onVisibility() {
  if (!engine || !running) return;
  if (document.hidden) {
    engine.ctx.suspend();
  } else {
    engine.ctx.resume();
    lastPhase = phase(engine);
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }
}

export async function startAmbient() {
  window.clearTimeout(stopTimer);
  if (!engine) {
    engine = build();
    document.addEventListener("visibilitychange", onVisibility);
  }
  const e = engine;
  await e.ctx.resume();
  const now = e.ctx.currentTime;
  e.master.gain.cancelScheduledValues(now);
  e.master.gain.setValueAtTime(e.master.gain.value, now);
  e.master.gain.linearRampToValueAtTime(LEVEL, now + 2.5);
  if (running) return;
  running = true;
  playChord(e);
  lastPhase = phase(e);
  raf = requestAnimationFrame(tick);
}

export function stopAmbient() {
  if (!engine) return;
  const e = engine;
  running = false;
  cancelAnimationFrame(raf);
  const now = e.ctx.currentTime;
  e.master.gain.cancelScheduledValues(now);
  e.master.gain.setValueAtTime(e.master.gain.value, now);
  e.master.gain.linearRampToValueAtTime(0, now + 1.5);
  stopTimer = window.setTimeout(() => e.ctx.suspend(), 1700);
}

export const isAmbientRunning = () => running;
