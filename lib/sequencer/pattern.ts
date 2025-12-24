import { v4 as uuid } from 'uuid';
import { Pattern, Step, TrackId, Velocity } from './types';

const DEFAULT_STEPS = 16;
const DEFAULT_BPM = 120;
const DEFAULT_SWING = 0.12;
const TRACKS: TrackId[] = ['kick', 'snare', 'hat', 'clap'];

export const createEmptyStep = (): Step => ({ on: false, velocity: 1 });

export const createPattern = (name = 'New Pattern', steps: number = DEFAULT_STEPS): Pattern => {
  const length = clampSteps(steps);
  const trackSteps = TRACKS.reduce<Record<TrackId, Step[]>>((acc, track) => {
    acc[track] = Array.from({ length }, createEmptyStep);
    return acc;
  }, {} as Record<TrackId, Step[]>);

  return {
    id: uuid(),
    name,
    steps: length,
    tracks: trackSteps,
    bpm: DEFAULT_BPM,
    swing: DEFAULT_SWING
  };
};

export const clampSteps = (steps: number): number => {
  if (steps <= 16) return 16;
  if (steps <= 32) return 32;
  return 64;
};

export const resizePattern = (pattern: Pattern, steps: number): Pattern => {
  const length = clampSteps(steps);
  const nextTracks: Record<TrackId, Step[]> = { ...pattern.tracks };

  Object.entries(pattern.tracks).forEach(([track, arr]) => {
    if (arr.length === length) return;
    if (arr.length < length) {
      const extra = Array.from({ length: length - arr.length }, createEmptyStep);
      nextTracks[track as TrackId] = [...arr, ...extra];
    } else {
      nextTracks[track as TrackId] = arr.slice(0, length);
    }
  });

  return {
    ...pattern,
    steps: length,
    tracks: nextTracks
  };
};

export const toggleStep = (pattern: Pattern, track: TrackId, index: number): Pattern => {
  const steps = pattern.tracks[track].map((step, i) => {
    if (i !== index) return step;
    return { ...step, on: !step.on };
  });
  return { ...pattern, tracks: { ...pattern.tracks, [track]: steps } };
};

export const cycleVelocity = (pattern: Pattern, track: TrackId, index: number): Pattern => {
  const steps = pattern.tracks[track].map((step, i) => {
    if (i !== index) return step;
    const next = ((step.velocity + 1) % 3) as Velocity;
    return { ...step, velocity: next, on: true };
  });
  return { ...pattern, tracks: { ...pattern.tracks, [track]: steps } };
};

export const updateBpm = (pattern: Pattern, bpm: number): Pattern => ({
  ...pattern,
  bpm: Math.min(Math.max(60, bpm), 180)
});

export const updateSwing = (pattern: Pattern, swing: number): Pattern => ({
  ...pattern,
  swing: Math.min(Math.max(0, swing), 0.6)
});
