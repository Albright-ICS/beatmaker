'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioEngine } from '../../lib/audio/engine';
import { computeStepTime, getTimingInfo } from '../../lib/sequencer/scheduler';
import { MixerState, Pattern, TrackId } from '../../lib/sequencer/types';

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_TIME = 0.1;

interface UseAudioEngineArgs {
  pattern: Pattern;
  mixer: MixerState;
  metronomeEnabled: boolean;
  countIn: boolean;
  humanize?: boolean;
  onStep: (stepIndex: number) => void;
}

export const useAudioEngine = ({
  pattern,
  mixer,
  metronomeEnabled,
  countIn,
  humanize,
  onStep
}: UseAudioEngineArgs) => {
  const engineRef = useRef<AudioEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const nextStepRef = useRef<number>(0);
  const nextStepTimeRef = useRef<number>(0);
  const patternRef = useRef(pattern);
  const mixerRef = useRef(mixer);
  const metronomeRef = useRef(metronomeEnabled);
  const countInRef = useRef(countIn);
  const humanizeRef = useRef(humanize ?? false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCountingIn, setIsCountingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  useEffect(() => {
    mixerRef.current = mixer;
    applyMixer();
  }, [mixer]);

  useEffect(() => {
    metronomeRef.current = metronomeEnabled;
    if (engineRef.current?.isReady()) {
      const nodes = engineRef.current.context;
      if (nodes) {
        engineRef.current.init().then((n) => {
          n.metronome.gain.value = metronomeEnabled ? 0.12 : 0;
        });
      }
    }
  }, [metronomeEnabled]);

  useEffect(() => {
    countInRef.current = countIn;
  }, [countIn]);

  useEffect(() => {
    humanizeRef.current = Boolean(humanize);
  }, [humanize]);

  const applyMixer = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !engine.isReady()) return;
    const anySolo = Object.values(mixerRef.current.track).some((t) => t.solo);
    engine.setMasterVolume(mixerRef.current.master);
    (Object.entries(mixerRef.current.track) as [TrackId, { volume: number; mute: boolean; solo: boolean }][]) // eslint-disable-line max-len
      .forEach(([trackId, state]) => {
        const muted = anySolo ? !state.solo : state.mute;
        const gain = muted ? 0 : state.volume;
        engine.setTrackVolume(trackId, gain);
      });
  }, []);

  const init = useCallback(async () => {
    if (engineRef.current?.isReady()) return;
    try {
      engineRef.current = new AudioEngine();
      await engineRef.current.init();
      applyMixer();
    } catch (err) {
      console.error(err);
      setError('Could not initialize audio. You can still edit patterns.');
    }
  }, [applyMixer]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    nextStepRef.current = 0;
    nextStepTimeRef.current = 0;
    setIsPlaying(false);
    setIsCountingIn(false);
  }, []);

  const schedule = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !engine.isReady()) return;
    const nodes = engine.context;
    if (!nodes) return;
    const ctx = nodes;
    const currentPattern = patternRef.current;
    const { secondsPerStep } = getTimingInfo(currentPattern.bpm);
    const scheduleAhead = ctx.currentTime + SCHEDULE_AHEAD_TIME;

    while (nextStepTimeRef.current < scheduleAhead) {
      const stepIndex = nextStepRef.current % currentPattern.steps;
      const baseTime = computeStepTime(currentPattern, nextStepRef.current, startTimeRef.current);
      const jitter = humanizeRef.current ? (Math.random() - 0.5) * 0.006 : 0;
      const time = baseTime + jitter;
      (Object.entries(currentPattern.tracks) as [TrackId, typeof currentPattern.tracks[TrackId]][]).forEach(
        ([trackId, steps]) => {
          const step = steps[stepIndex];
          engine.triggerStep(trackId, step, time);
        }
      );

      if (metronomeRef.current) {
        const accented = stepIndex % 4 === 0;
        engine.scheduleMetronomeClick(time, accented);
      }

      onStep(stepIndex);
      nextStepRef.current += 1;
      nextStepTimeRef.current = startTimeRef.current + nextStepRef.current * secondsPerStep;
    }
  }, [onStep]);

  const start = useCallback(async () => {
    await init();
    const engine = engineRef.current;
    if (!engine || !engine.context) return;
    await engine.context.resume();
    applyMixer();

    const patternToPlay = patternRef.current;
    const { secondsPerBeat, secondsPerStep } = getTimingInfo(patternToPlay.bpm);

    if (countInRef.current) {
      const countInStart = engine.context.currentTime;
      setIsCountingIn(true);
      for (let i = 0; i < 4; i += 1) {
        engine.scheduleMetronomeClick(countInStart + i * secondsPerBeat, i === 0);
      }
      startTimeRef.current = countInStart + secondsPerBeat * 4;
    } else {
      startTimeRef.current = engine.context.currentTime;
    }

    nextStepRef.current = 0;
    nextStepTimeRef.current = startTimeRef.current + secondsPerStep;
    setIsPlaying(true);
    setIsCountingIn(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(schedule, LOOKAHEAD_MS);
  }, [applyMixer, init, schedule]);

  useEffect(() => () => stop(), [stop]);

  return {
    isPlaying,
    isCountingIn,
    start,
    stop,
    init,
    error
  };
};
