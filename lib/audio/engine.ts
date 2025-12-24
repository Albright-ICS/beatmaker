import { triggerClap, triggerHat, triggerKick, triggerSnare } from './drums';
import { scheduleMetronome } from './metronome';
import { Pattern, Step, TrackId, Velocity } from '../sequencer/types';

const TRACK_IDS: TrackId[] = ['kick', 'snare', 'hat', 'clap'];

export interface EngineNodes {
  context: AudioContext;
  master: GainNode;
  tracks: Record<TrackId, GainNode>;
  metronome: GainNode;
}

export class AudioEngine {
  private nodes: EngineNodes | null = null;
  private initialized = false;

  async init(): Promise<EngineNodes> {
    if (this.nodes) return this.nodes;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioCtx();
    const master = context.createGain();
    master.gain.value = 0.8;
    master.connect(context.destination);

    const tracks = TRACK_IDS.reduce<Record<TrackId, GainNode>>((acc, id) => {
      const gain = context.createGain();
      gain.gain.value = 0.9;
      gain.connect(master);
      acc[id] = gain;
      return acc;
    }, {} as Record<TrackId, GainNode>);

    const metronome = context.createGain();
    metronome.gain.value = 0.0;
    metronome.connect(master);

    this.nodes = { context, master, tracks, metronome };
    this.initialized = true;
    return this.nodes;
  }

  isReady(): boolean {
    return this.initialized && this.nodes !== null;
  }

  get context(): AudioContext | null {
    return this.nodes?.context ?? null;
  }

  setMasterVolume(value: number) {
    if (!this.nodes) return;
    this.nodes.master.gain.value = value;
  }

  setTrackVolume(track: TrackId, value: number) {
    if (!this.nodes) return;
    this.nodes.tracks[track].gain.value = value;
  }

  triggerStep(track: TrackId, step: Step, time: number) {
    if (!this.nodes || !step.on) return;
    const destination = this.nodes.tracks[track];
    const ctx = this.nodes.context;
    const velocity = step.velocity;

    switch (track) {
      case 'kick':
        triggerKick(ctx, time, velocity, destination);
        break;
      case 'snare':
        triggerSnare(ctx, time, velocity, destination);
        break;
      case 'hat':
        triggerHat(ctx, time, velocity, destination);
        break;
      case 'clap':
        triggerClap(ctx, time, velocity, destination);
        break;
      default:
        break;
    }
  }

  scheduleMetronomeClick(time: number, accented: boolean) {
    if (!this.nodes) return;
    scheduleMetronome(this.nodes.context, time, this.nodes.metronome, accented);
  }

  reset() {
    if (!this.nodes) return;
    this.nodes.master.disconnect();
    Object.values(this.nodes.tracks).forEach((gain) => gain.disconnect());
    this.nodes.metronome.disconnect();
    this.nodes.context.close();
    this.nodes = null;
    this.initialized = false;
  }
}

export const getEffectiveGain = (soloed: boolean, muted: boolean, baseVolume: number): number => {
  if (soloed) return baseVolume;
  if (muted) return 0;
  return baseVolume;
};

export const selectStepsForTrack = (pattern: Pattern, track: TrackId): Step[] => pattern.tracks[track];

export const velocityToGain = (velocity: Velocity): number => {
  if (velocity === 2) return 1.1;
  if (velocity === 0) return 0.45;
  return 0.8;
};
