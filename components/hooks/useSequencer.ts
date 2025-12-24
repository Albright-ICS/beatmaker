'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clampSteps, createPattern, cycleVelocity, resizePattern, toggleStep, updateBpm, updateSwing } from '../../lib/sequencer/pattern';
import { MixerState, Pattern, TrackId, Velocity } from '../../lib/sequencer/types';
import { generateId } from '../../lib/utils';

const defaultMixer = (): MixerState => ({
  master: 0.85,
  track: {
    kick: { volume: 0.95, mute: false, solo: false },
    snare: { volume: 0.95, mute: false, solo: false },
    hat: { volume: 0.8, mute: false, solo: false },
    clap: { volume: 0.9, mute: false, solo: false }
  }
});

export const useSequencer = () => {
  const [pattern, setPattern] = useState<Pattern>(createPattern('Studio Beat'));
  const [mixer, setMixer] = useState<MixerState>(defaultMixer);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const [countIn, setCountIn] = useState(false);
  const [humanize, setHumanize] = useState(false);

  useEffect(() => {
    setPattern((prev) => ({ ...prev, id: generateId() }));
  }, []);

  const toggleStepAt = useCallback((track: TrackId, index: number) => {
    setPattern((prev) => toggleStep(prev, track, index));
  }, []);

  const cycleVelocityAt = useCallback((track: TrackId, index: number) => {
    setPattern((prev) => cycleVelocity(prev, track, index));
  }, []);

  const setBpm = useCallback((bpm: number) => {
    setPattern((prev) => updateBpm(prev, bpm));
  }, []);

  const setSwing = useCallback((swing: number) => {
    setPattern((prev) => updateSwing(prev, swing));
  }, []);

  const setSteps = useCallback((steps: number) => {
    setPattern((prev) => resizePattern(prev, steps));
  }, []);

  const setName = useCallback((name: string) => {
    setPattern((prev) => ({ ...prev, name }));
  }, []);

  const clearPattern = useCallback(() => {
    setPattern((prev) => createPattern(prev.name, prev.steps));
  }, []);

  const duplicatePattern = useCallback(() => {
    setPattern((prev) => ({ ...prev, id: generateId(), name: `${prev.name} Copy` }));
  }, []);

  const replacePattern = useCallback((next: Pattern) => {
    setPattern(next);
  }, []);

  const setMixerVolume = useCallback((track: TrackId, value: number) => {
    setMixer((prev) => ({
      ...prev,
      track: { ...prev.track, [track]: { ...prev.track[track], volume: value } }
    }));
  }, []);

  const setMixerMute = useCallback((track: TrackId, mute: boolean) => {
    setMixer((prev) => ({
      ...prev,
      track: { ...prev.track, [track]: { ...prev.track[track], mute } }
    }));
  }, []);

  const setMixerSolo = useCallback((track: TrackId, solo: boolean) => {
    setMixer((prev) => ({
      ...prev,
      track: { ...prev.track, [track]: { ...prev.track[track], solo } }
    }));
  }, []);

  const setMasterVolume = useCallback((value: number) => {
    setMixer((prev) => ({ ...prev, master: value }));
  }, []);

  const anySolo = useMemo(() => Object.values(mixer.track).some((t) => t.solo), [mixer.track]);

  return {
    pattern,
    mixer,
    isPlaying,
    setIsPlaying,
    playhead,
    setPlayhead,
    metronome,
    setMetronome,
    countIn,
    setCountIn,
    humanize,
    setHumanize,
    toggleStepAt,
    cycleVelocityAt,
    setBpm,
    setSwing,
    setSteps,
    setName,
    clearPattern,
    duplicatePattern,
    replacePattern,
    setMixerVolume,
    setMixerMute,
    setMixerSolo,
    setMasterVolume,
    anySolo
  };
};
