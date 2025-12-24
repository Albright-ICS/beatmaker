'use client';

import classNames from 'classnames';
import React, { CSSProperties } from 'react';
import { Pattern, TrackId } from '../lib/sequencer/types';

interface Props {
  pattern: Pattern;
  playhead: number;
  onToggle: (track: TrackId, index: number) => void;
  onVelocity: (track: TrackId, index: number) => void;
}

const TRACK_LABELS: Record<TrackId, string> = {
  kick: 'Kick',
  snare: 'Snare',
  hat: 'Hat',
  clap: 'Clap'
};

const velocityClass = (velocity: number) => {
  switch (velocity) {
    case 0:
      return 'bg-slate-700 border-slate-700';
    case 2:
      return 'bg-accent border-accent shadow-[0_0_8px_rgba(56,189,248,0.7)]';
    default:
      return 'bg-sky-600 border-sky-500';
  }
};

export const StepGrid: React.FC<Props> = ({ pattern, playhead, onToggle, onVelocity }) => {
  return (
    <div className="space-y-4">
      {(Object.keys(pattern.tracks) as TrackId[]).map((track) => (
        <div key={track} className="flex items-center gap-3">
          <div className="w-20 text-right pr-2 uppercase text-sm text-slate-300">{TRACK_LABELS[track]}</div>
          <div
            className="grid flex-1 gap-2 step-grid"
            style={{ '--steps': pattern.steps } as CSSProperties}
            role="grid"
            aria-label={`${TRACK_LABELS[track]} steps`}
          >
            {pattern.tracks[track].map((step, index) => {
              const isPlayhead = index === playhead;
              return (
                <button
                  key={`${track}-${index}`}
                  className={classNames(
                    'aspect-square rounded-md border transition-all duration-150 focus-visible:outline-none focus-ring',
                    step.on ? velocityClass(step.velocity) : 'border-slate-700 bg-slate-800/60',
                    isPlayhead ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : '',
                    'hover:brightness-110'
                  )}
                  onClick={(e) => {
                    if (e.altKey) {
                      onVelocity(track, index);
                    } else {
                      onToggle(track, index);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onVelocity(track, index);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onToggle(track, index);
                    }
                  }}
                  tabIndex={0}
                  aria-pressed={step.on}
                  aria-label={`${TRACK_LABELS[track]} step ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-sm text-slate-400">Tip: Alt/right-click to cycle velocity (ghost, normal, accent).</p>
    </div>
  );
};
