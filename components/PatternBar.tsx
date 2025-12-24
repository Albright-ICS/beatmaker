'use client';

import React, { useEffect, useState } from 'react';
import { encodePatternToQuery } from '../lib/share';
import { clampSteps } from '../lib/sequencer/pattern';
import { Pattern } from '../lib/sequencer/types';
import { loadPatterns, removePattern, StoredPattern, upsertPattern } from '../lib/storage';

interface Props {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  onNew: () => void;
  onDuplicate: () => void;
  onClear: () => void;
  onStepsChange: (steps: number) => void;
  onToast: (message: string) => void;
}

export const PatternBar: React.FC<Props> = ({
  pattern,
  onPatternChange,
  onNew,
  onDuplicate,
  onClear,
  onStepsChange,
  onToast
}) => {
  const [saved, setSaved] = useState<StoredPattern[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  useEffect(() => {
    setSaved(loadPatterns());
  }, []);

  const handleSave = () => {
    const entry: StoredPattern = {
      id: pattern.id,
      name: pattern.name,
      data: pattern,
      updatedAt: Date.now()
    };
    upsertPattern(entry);
    setSaved(loadPatterns());
    onToast('Pattern saved locally');
  };

  const handleLoad = (id: string) => {
    const entry = saved.find((p) => p.id === id);
    if (!entry) return;
    onPatternChange(entry.data as Pattern);
    onToast('Pattern loaded');
  };

  const handleDelete = (id: string) => {
    removePattern(id);
    setSaved(loadPatterns());
    onToast('Pattern removed');
  };

  const handleShare = async () => {
    const query = encodePatternToQuery(pattern);
    const url = `${window.location.origin}?${query}`;
    await navigator.clipboard.writeText(url);
    onToast('Share link copied to clipboard');
  };

  return (
    <div className="bg-panel/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-slate-300">
          Name
          <input
            value={pattern.name}
            onChange={(e) => onPatternChange({ ...pattern, name: e.target.value })}
            className="ml-2 bg-slate-900 border border-slate-700 rounded px-2 py-1"
            aria-label="Pattern name"
          />
        </label>
        <label className="text-sm text-slate-300">
          Steps
          <select
            value={pattern.steps}
            onChange={(e) => onStepsChange(clampSteps(Number(e.target.value)))}
            className="ml-2 bg-slate-900 border border-slate-700 rounded px-2 py-1"
          >
            <option value={16}>16</option>
            <option value={32}>32</option>
            <option value={64}>64</option>
          </select>
        </label>
        <button
          className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
          onClick={onNew}
        >
          New
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
          onClick={onDuplicate}
        >
          Duplicate
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
          onClick={onClear}
        >
          Clear
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:border-accent focus-ring"
          onClick={handleShare}
        >
          Share link
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-200">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded px-2 py-1"
        >
          <option value="">Load saved pattern</option>
          {saved.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          className="px-3 py-1 rounded bg-accent text-black font-semibold disabled:opacity-50"
          onClick={() => handleLoad(selectedId)}
          disabled={!selectedId}
        >
          Load
        </button>
        <button
          className="px-3 py-1 rounded bg-slate-800 border border-slate-700 disabled:opacity-50"
          onClick={() => handleDelete(selectedId)}
          disabled={!selectedId}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
