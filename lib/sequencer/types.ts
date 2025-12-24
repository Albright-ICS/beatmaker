export type TrackId = 'kick' | 'snare' | 'hat' | 'clap';

export type Velocity = 0 | 1 | 2; // 0 ghost, 1 normal, 2 accent

export interface Step {
  on: boolean;
  velocity: Velocity;
}

export interface Pattern {
  id: string;
  name: string;
  steps: number;
  tracks: Record<TrackId, Step[]>;
  bpm: number;
  swing: number; // 0..0.6
}

export interface MixerState {
  master: number; // 0..1
  track: Record<TrackId, { volume: number; mute: boolean; solo: boolean }>;
}

export interface SequencerState {
  pattern: Pattern;
  mixer: MixerState;
  isPlaying: boolean;
  playhead: number;
}

export interface ScheduledNote {
  track: TrackId;
  stepIndex: number;
  time: number;
  velocity: Velocity;
}
