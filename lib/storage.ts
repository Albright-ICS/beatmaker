const KEY = 'beatmaker:patterns';

export interface StoredPattern {
  id: string;
  name: string;
  data: unknown;
  updatedAt: number;
}

const isBrowser = typeof window !== 'undefined';

export const loadPatterns = (): StoredPattern[] => {
  if (!isBrowser) return [];
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredPattern[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse saved patterns', err);
    return [];
  }
};

export const savePatternList = (patterns: StoredPattern[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(KEY, JSON.stringify(patterns));
};

export const upsertPattern = (pattern: StoredPattern) => {
  const existing = loadPatterns();
  const updated = existing.filter((p) => p.id !== pattern.id);
  updated.unshift({ ...pattern, updatedAt: Date.now() });
  savePatternList(updated.slice(0, 50));
};

export const removePattern = (id: string) => {
  const existing = loadPatterns();
  savePatternList(existing.filter((p) => p.id !== id));
};
