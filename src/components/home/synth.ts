/**
 * synth.ts — le petit moteur sonore des maquettes d'accueil.
 *
 * Tout est synthétisé dans le navigateur (Web Audio), rien à charger :
 *  - corde pincée par Karplus-Strong (guitare, ukulélé) ;
 *  - touche de piano par addition d'harmoniques, filtre qui se referme ;
 *  - tic de métronome.
 * Ce sont des sons de démonstration, et les pages le disent.
 * Le contexte audio n'est créé qu'au premier geste (règle des navigateurs).
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function audio() {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.55;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 5200;
    master.connect(lp).connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return { ctx, master: master! };
}

export function muted(): boolean {
  return document.documentElement.dataset.sound === 'off';
}

const buffers = new Map<number, AudioBuffer>();
function pluckBuffer(freq: number) {
  const { ctx } = audio();
  const k = Math.round(freq * 10);
  const hit = buffers.get(k);
  if (hit) return hit;
  const sr = ctx.sampleRate;
  const period = Math.round(sr / freq);
  const length = Math.floor(sr * 2.4);
  const buffer = ctx.createBuffer(1, length, sr);
  const out = buffer.getChannelData(0);
  const ring = new Float32Array(period);
  for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1;
  for (let p = 0; p < 2; p++) for (let i = 0; i < period; i++) ring[i] = 0.5 * (ring[i] + ring[(i + 1) % period]);
  const decay = Math.pow(0.12, 1 / (freq * 1.8));
  let idx = 0;
  for (let i = 0; i < length; i++) {
    const cur = ring[idx];
    const nxt = ring[(idx + 1) % period];
    out[i] = cur;
    ring[idx] = decay * 0.5 * (cur + nxt);
    idx = (idx + 1) % period;
  }
  const tail = Math.floor(sr * 0.2);
  for (let i = 0; i < tail; i++) out[length - 1 - i] *= i / tail;
  buffers.set(k, buffer);
  return buffer;
}

/** Corde pincée. */
export function pluck(freq: number, delay = 0, gain = 0.5) {
  if (muted()) return;
  const { ctx, master } = audio();
  const src = ctx.createBufferSource();
  src.buffer = pluckBuffer(freq);
  const g = ctx.createGain();
  g.gain.value = gain;
  src.connect(g).connect(master);
  src.start(ctx.currentTime + delay);
}

/** Touche de piano. */
export function key(freq: number, delay = 0, dur = 1.9, gain = 0.42) {
  if (muted()) return;
  const { ctx, master } = audio();
  const t = ctx.currentTime + delay;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + 0.006);
  env.gain.exponentialRampToValueAtTime(gain * 0.26, t + 0.4);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(freq * 9, t);
  lp.frequency.exponentialRampToValueAtTime(freq * 2.2, t + 0.7);
  env.connect(lp).connect(master);
  const partials: [number, number, OscillatorType][] = [
    [1, 1, 'triangle'],
    [2, 0.32, 'sine'],
    [3, 0.15, 'sine'],
    [4, 0.07, 'sine'],
    [6, 0.03, 'sine'],
  ];
  partials.forEach(([h, a, type]) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq * h;
    const g = ctx.createGain();
    g.gain.value = a;
    o.connect(g).connect(env);
    o.start(t);
    o.stop(t + dur + 0.05);
  });
}

/** Un son entretenu, pour accorder : on l'arrête avec la fonction renvoyée. */
export function tone(freq: number, gain = 0.25) {
  if (muted()) return () => {};
  const { ctx, master } = audio();
  const o = ctx.createOscillator();
  o.type = 'triangle';
  o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, ctx.currentTime + 0.03);
  o.connect(g).connect(master);
  o.start();
  return () => {
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.stop(t + 0.15);
  };
}

/** Tic de métronome ; le temps fort sonne plus haut. */
export function tick(delay = 0, strong = false) {
  if (muted()) return;
  const { ctx, master } = audio();
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.value = strong ? 1320 : 880;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.5, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + 0.09);
}

/** Fréquence d'une note, do 4 = 261,63 Hz. */
export const NOTE: Record<string, number> = {
  sol3: 196.0,
  la3: 220.0,
  si3: 246.94,
  do4: 261.63,
  re4: 293.66,
  mi4: 329.63,
  fa4: 349.23,
  sol4: 392.0,
  la4: 440.0,
  si4: 493.88,
  do5: 523.25,
  re5: 587.33,
  mi5: 659.25,
};

export const NAME: Record<string, string> = {
  sol3: 'sol', la3: 'la', si3: 'si', do4: 'do', re4: 'ré', mi4: 'mi', fa4: 'fa', sol4: 'sol', la4: 'la', si4: 'si', do5: 'do', re5: 'ré', mi5: 'mi',
};

/** Les quatre accords « magiques » du cours, en fréquences, pour chaque instrument. */
const STRUMS: Record<string, Record<string, number[]>> = {
  guitar: {
    C: [130.81, 164.81, 196.0, 261.63, 329.63],
    G: [98.0, 123.47, 146.83, 196.0, 246.94, 392.0],
    Am: [110.0, 164.81, 220.0, 261.63, 329.63],
    F: [87.31, 130.81, 174.61, 220.0, 261.63, 349.23],
  },
  ukulele: {
    C: [392.0, 261.63, 329.63, 523.25],
    G: [392.0, 293.66, 392.0, 493.88],
    Am: [440.0, 261.63, 329.63, 440.0],
    F: [440.0, 261.63, 349.23, 440.0],
  },
  piano: {
    C: [261.63, 329.63, 392.0],
    G: [246.94, 293.66, 392.0],
    Am: [261.63, 329.63, 440.0],
    F: [261.63, 349.23, 440.0],
  },
};

/** Joue un accord : gratté sur les cordes, plaqué au piano. */
export function chord(name: string, instrument: string, delay = 0) {
  const set = STRUMS[instrument === 'solfege' ? 'piano' : instrument] ?? STRUMS.piano;
  const freqs = set[name] ?? set.C;
  if (instrument === 'guitar' || instrument === 'ukulele') {
    freqs.forEach((f, i) => pluck(f, delay + i * 0.04, 0.45));
  } else {
    freqs.forEach((f) => key(f, delay, 1.6, 0.3));
  }
}
