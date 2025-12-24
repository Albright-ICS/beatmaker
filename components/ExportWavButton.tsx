'use client';

import React, { useState } from 'react';
import { renderPatternOffline } from '../lib/audio/offlineRender';
import { encodeWav } from '../lib/audio/wavEncode';
import { Pattern, TrackId } from '../lib/sequencer/types';

interface Props {
  pattern: Pattern;
  mixer: Record<TrackId, { volume: number; mute: boolean; solo: boolean }>;
  master: number;
  onToast: (message: string) => void;
}

export const ExportWavButton: React.FC<Props> = ({ pattern, mixer, master, onToast }) => {
  const [bars, setBars] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const buffer = await renderPatternOffline(pattern, { bars, masterVolume: master, mixer });
      const blob = encodeWav(buffer);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${pattern.name || 'beat'}.wav`;
      a.click();
      URL.revokeObjectURL(url);
      onToast('WAV exported');
    } catch (err) {
      console.error(err);
      onToast('Export failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-slate-300">
        Bars
        <select
          value={bars}
          onChange={(e) => setBars(Number(e.target.value))}
          className="ml-2 bg-slate-900 border border-slate-700 rounded px-2 py-1"
        >
          {[1, 2, 4, 8].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <button
        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring disabled:opacity-60"
        onClick={handleExport}
        disabled={loading}
      >
        {loading ? 'Rendering…' : 'Export WAV'}
      </button>
    </div>
  );
};
