import { describe, expect, it } from 'vitest';
import { computeStepTime, getTimingInfo } from '../lib/sequencer/scheduler';
import { createPattern } from '../lib/sequencer/pattern';

describe('timing calculations', () => {
  it('computes seconds per beat and step from bpm', () => {
    const { secondsPerBeat, secondsPerStep } = getTimingInfo(120);
    expect(secondsPerBeat).toBeCloseTo(0.5);
    expect(secondsPerStep).toBeCloseTo(0.125);
  });

  it('applies swing to odd steps', () => {
    const pattern = createPattern('Swing', 16);
    const withSwing = { ...pattern, swing: 0.2 };
    const timeEven = computeStepTime(withSwing, 2, 0);
    const timeOdd = computeStepTime(withSwing, 3, 0);
    expect(timeOdd).toBeGreaterThan(timeEven + 0.125);
  });
});
