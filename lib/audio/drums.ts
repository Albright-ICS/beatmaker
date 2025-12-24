import { Velocity } from '../sequencer/types';

const VELOCITY_SCALE: Record<Velocity, number> = {
  0: 0.45,
  1: 0.8,
  2: 1.1
};

const createNoiseBuffer = (context: BaseAudioContext): AudioBuffer => {
  const buffer = context.createBuffer(1, context.sampleRate * 1, context.sampleRate);
  const output = buffer.getChannelData(0);
  for (let i = 0; i < output.length; i += 1) {
    output[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

export const triggerKick = (
  context: AudioContext | OfflineAudioContext,
  time: number,
  velocity: Velocity,
  destination: AudioNode
) => {
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(40, time + 0.35);

  const scaled = VELOCITY_SCALE[velocity];
  gain.gain.setValueAtTime(1 * scaled, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.5);
};

export const triggerSnare = (
  context: AudioContext | OfflineAudioContext,
  time: number,
  velocity: Velocity,
  destination: AudioNode
) => {
  const noiseBuffer = createNoiseBuffer(context);
  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = context.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(1800, time);
  noiseFilter.Q.setValueAtTime(1, time);

  const noiseGain = context.createGain();
  const scaled = VELOCITY_SCALE[velocity];
  noiseGain.gain.setValueAtTime(0.7 * scaled, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

  noise.connect(noiseFilter).connect(noiseGain).connect(destination);
  noise.start(time);
  noise.stop(time + 0.3);

  const tone = context.createOscillator();
  const toneGain = context.createGain();
  tone.frequency.setValueAtTime(220, time);
  tone.type = 'triangle';
  toneGain.gain.setValueAtTime(0.15 * scaled, time);
  toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  tone.connect(toneGain).connect(destination);
  tone.start(time);
  tone.stop(time + 0.25);
};

export const triggerHat = (
  context: AudioContext | OfflineAudioContext,
  time: number,
  velocity: Velocity,
  destination: AudioNode
) => {
  const noiseBuffer = createNoiseBuffer(context);
  const noise = context.createBufferSource();
  noise.buffer = noiseBuffer;

  const hp = context.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.setValueAtTime(7000, time);

  const gain = context.createGain();
  const scaled = VELOCITY_SCALE[velocity];
  gain.gain.setValueAtTime(0.35 * scaled, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

  noise.connect(hp).connect(gain).connect(destination);
  noise.start(time);
  noise.stop(time + 0.1);
};

export const triggerClap = (
  context: AudioContext | OfflineAudioContext,
  time: number,
  velocity: Velocity,
  destination: AudioNode
) => {
  const noiseBuffer = createNoiseBuffer(context);
  const scaled = VELOCITY_SCALE[velocity];
  const burstCount = 3;
  const spread = 0.015;

  for (let i = 0; i < burstCount; i += 1) {
    const burst = context.createBufferSource();
    burst.buffer = noiseBuffer;
    const bandpass = context.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1800, time);
    bandpass.Q.setValueAtTime(0.8, time);

    const gain = context.createGain();
    const burstTime = time + i * spread;
    gain.gain.setValueAtTime(0.6 * scaled, burstTime);
    gain.gain.exponentialRampToValueAtTime(0.001, burstTime + 0.2);

    burst.connect(bandpass).connect(gain).connect(destination);
    burst.start(burstTime);
    burst.stop(burstTime + 0.25);
  }
};
