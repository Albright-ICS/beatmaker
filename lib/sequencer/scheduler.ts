import { Pattern } from './types';

export interface TimingInfo {
  secondsPerBeat: number;
  secondsPerStep: number;
}

export const getTimingInfo = (bpm: number): TimingInfo => {
  const secondsPerBeat = 60 / bpm;
  const secondsPerStep = secondsPerBeat / 4; // 16th notes
  return { secondsPerBeat, secondsPerStep };
};

export const computeStepTime = (pattern: Pattern, stepIndex: number, startTime: number): number => {
  const { secondsPerStep } = getTimingInfo(pattern.bpm);
  const swingOffset = stepIndex % 2 === 1 ? pattern.swing * secondsPerStep : 0;
  return startTime + stepIndex * secondsPerStep + swingOffset;
};
