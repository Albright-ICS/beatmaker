'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ExportWavButton } from './ExportWavButton';
import { PatternBar } from './PatternBar';
import { StepGrid } from './StepGrid';
import { Toast } from './Toast';
import { TrackControls } from './TrackControls';
import { Transport } from './Transport';
import { useAudioEngine } from './hooks/useAudioEngine';
import { useSequencer } from './hooks/useSequencer';
import { decodePatternFromQuery } from '../lib/share';
import { createPattern } from '../lib/sequencer/pattern';
import { Pattern } from '../lib/sequencer/types';
import { isInputElement } from '../lib/utils';

export const BeatMakerApp = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [toast, setToast] = useState('');

  const {
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
    setMixerVolume,
    setMixerMute,
    setMixerSolo,
    setMasterVolume,
    replacePattern
  } = useSequencer();

  const { start, stop, isCountingIn, isPlaying: audioPlaying, error } = useAudioEngine({
    pattern,
    mixer,
    metronomeEnabled: metronome,
    countIn,
    humanize,
    onStep: (step) => setPlayhead(step)
  });

  useEffect(() => {
    setIsPlaying(audioPlaying);
  }, [audioPlaying, setIsPlaying]);

  useEffect(() => {
    const encoded = searchParams.get('p');
    if (encoded) {
      const decoded = decodePatternFromQuery(`p=${encoded}`);
      if (decoded) {
        replacePattern(decoded);
        setToast('Pattern loaded from link');
        router.replace('/');
      }
    }
  }, [replacePattern, router, searchParams]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isInputElement(e.target)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          stop();
        } else {
          start();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying, start, stop]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleNew = () => {
    replacePattern(createPattern());
    setPlayhead(0);
    setToast('New pattern');
  };

  const handleRestart = async () => {
    stop();
    setPlayhead(0);
    await start();
  };

  const handleClear = () => {
    clearPattern();
    setPlayhead(0);
  };

  const handlePatternChange = (next: Pattern) => {
    replacePattern(next);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-white">Beat Maker</h1>
      {error && <div className="p-3 bg-amber-900 text-amber-100 rounded border border-amber-700">{error}</div>}
      <Transport
        bpm={pattern.bpm}
        swing={pattern.swing}
        isPlaying={isPlaying || isCountingIn}
        metronome={metronome}
        countIn={countIn}
        onPlayPause={() => (isPlaying ? stop() : start())}
        onStop={() => {
          stop();
          setPlayhead(0);
        }}
        onRestart={handleRestart}
        onBpmChange={setBpm}
        onSwingChange={setSwing}
        onMetronomeToggle={() => setMetronome((v) => !v)}
        onCountInToggle={() => setCountIn((v) => !v)}
        masterVolume={mixer.master}
        onMasterChange={setMasterVolume}
      />

      <PatternBar
        pattern={pattern}
        onPatternChange={handlePatternChange}
        onNew={handleNew}
        onDuplicate={duplicatePattern}
        onClear={handleClear}
        onStepsChange={setSteps}
        onToast={setToast}
      />

      <div className="bg-panel/80 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <div>
            Playhead: <span className="font-mono">{playhead + 1}</span> / {pattern.steps}
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={humanize}
              onChange={() => setHumanize((v) => !v)}
              className="accent-accent"
            />
            Humanize
          </label>
        </div>

        <StepGrid
          pattern={pattern}
          playhead={playhead}
          onToggle={toggleStepAt}
          onVelocity={cycleVelocityAt}
        />
      </div>

      <TrackControls
        mixer={mixer}
        onVolumeChange={setMixerVolume}
        onMute={setMixerMute}
        onSolo={setMixerSolo}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 bg-panel/80 border border-slate-800 rounded-xl p-4">
        <ExportWavButton pattern={pattern} mixer={mixer.track} master={mixer.master} onToast={setToast} />
        <p className="text-slate-400 text-sm">Space: Play/Pause · Enter on step: Toggle · Alt/Right-click: Velocity</p>
      </div>

      <Toast message={toast} />
    </div>
  );
};
