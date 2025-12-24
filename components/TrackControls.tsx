'use client';

import React from 'react';
import { MixerState, TrackId } from '../lib/sequencer/types';

interface Props {
  mixer: MixerState;
  onVolumeChange: (track: TrackId, value: number) => void;
  onMute: (track: TrackId, mute: boolean) => void;
  onSolo: (track: TrackId, solo: boolean) => void;
}

const TRACK_LABELS: Record<TrackId, string> = {
  kick: 'Kick',
  snare: 'Snare',
  hat: 'Hat',
  clap: 'Clap'
};

export const TrackControls: React.FC<Props> = ({ mixer, onMute, onSolo, onVolumeChange }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {(Object.keys(mixer.track) as TrackId[]).map((track) => {
      const state = mixer.track[track];
      return (
        <div key={track} className="bg-panel/70 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="uppercase text-xs text-slate-300">{TRACK_LABELS[track]}</span>
            <div className="flex gap-1">
              <button
                className={`px-2 py-1 rounded text-xs border ${
                  state.mute ? 'bg-slate-700 border-slate-500' : 'bg-slate-800 border-slate-700'
                }`}
                onClick={() => onMute(track, !state.mute)}
                aria-label={`${TRACK_LABELS[track]} mute`}
              >
                M
              </button>
              <button
                className={`px-2 py-1 rounded text-xs border ${
                  state.solo ? 'bg-accent text-black border-accent' : 'bg-slate-800 border-slate-700'
                }`}
                onClick={() => onSolo(track, !state.solo)}
                aria-label={`${TRACK_LABELS[track]} solo`}
              >
                S
              </button>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={state.volume}
            onChange={(e) => onVolumeChange(track, Number(e.target.value))}
            className="w-full accent-accent"
            aria-label={`${TRACK_LABELS[track]} volume`}
          />
        </div>
      );
    })}
  </div>
);
