import { describe, expect, it } from 'vitest';
import { createPattern, cycleVelocity, resizePattern, toggleStep } from '../lib/sequencer/pattern';

describe('pattern creation', () => {
  it('creates tracks with correct step length', () => {
    const pattern = createPattern('Test', 16);
    expect(pattern.steps).toBe(16);
    expect(pattern.tracks.kick).toHaveLength(16);
  });

  it('resizes while preserving data', () => {
    let pattern = createPattern('Resize', 16);
    pattern = toggleStep(pattern, 'kick', 0);
    const resized = resizePattern(pattern, 32);
    expect(resized.steps).toBe(32);
    expect(resized.tracks.kick[0].on).toBe(true);
    expect(resized.tracks.kick[16].on).toBe(false);
  });
});

describe('step editing', () => {
  it('toggles step on/off', () => {
    const pattern = createPattern('Toggle', 16);
    const next = toggleStep(pattern, 'snare', 4);
    expect(next.tracks.snare[4].on).toBe(true);
  });

  it('cycles velocity and ensures step is on', () => {
    const pattern = createPattern('Velocity', 16);
    const next = cycleVelocity(pattern, 'hat', 2);
    expect(next.tracks.hat[2].velocity).toBe(2 % 3);
    expect(next.tracks.hat[2].on).toBe(true);
  });
});
