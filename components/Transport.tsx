'use client';

import React from 'react';

interface Props {
  bpm: number;
  swing: number;
  isPlaying: boolean;
  metronome: boolean;
  countIn: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  onRestart: () => void;
  onBpmChange: (value: number) => void;
  onSwingChange: (value: number) => void;
  onMetronomeToggle: () => void;
  onCountInToggle: () => void;
  onMasterChange: (value: number) => void;
  masterVolume: number;
}

export const Transport: React.FC<Props> = ({
  bpm,
  swing,
  isPlaying,
  metronome,
  countIn,
  onPlayPause,
  onStop,
  onRestart,
  onBpmChange,
  onSwingChange,
  onMetronomeToggle,
  onCountInToggle,
  masterVolume,
  onMasterChange
}) => {
  return (
    <div className="bg-panel/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-accent text-black font-semibold shadow hover:brightness-110 focus-ring"
            onClick={onPlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
            onClick={onStop}
            aria-label="Stop"
          >
            Stop
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
            onClick={onRestart}
            aria-label="Restart"
          >
            Restart
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">BPM</label>
          <input
            type="range"
            min={60}
            max={180}
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-32 accent-accent"
          />
          <input
            type="number"
            min={60}
            max={180}
            value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-right"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">Swing</label>
          <input
            type="range"
            min={0}
            max={60}
            value={Math.round(swing * 100)}
            onChange={(e) => onSwingChange(Number(e.target.value) / 100)}
            className="w-28 accent-accent"
          />
          <span className="text-xs text-slate-400 w-12 text-right">{Math.round(swing * 100)}%</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">Master</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={masterVolume}
            onChange={(e) => onMasterChange(Number(e.target.value))}
            className="w-28 accent-accent"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={metronome}
              onChange={onMetronomeToggle}
              className="accent-accent"
            />
            Metronome
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={countIn}
              onChange={onCountInToggle}
              className="accent-accent"
            />
            Count-in
          </label>
        </div>
      </div>
    </div>
  );
};
