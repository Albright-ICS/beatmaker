import { Pattern } from './sequencer/types';

const PREFIX = 'p=';

export const encodePatternToQuery = (pattern: Pattern): string => {
  const payload = JSON.stringify(pattern);
  const encoded = typeof window === 'undefined' ? Buffer.from(payload).toString('base64') : btoa(payload);
  return `${PREFIX}${encoded}`;
};

export const decodePatternFromQuery = (query: string | null): Pattern | null => {
  if (!query || !query.startsWith(PREFIX)) return null;
  const encoded = query.slice(PREFIX.length);
  try {
    const json = typeof window === 'undefined' ? Buffer.from(encoded, 'base64').toString('utf-8') : atob(encoded);
    return JSON.parse(json) as Pattern;
  } catch (err) {
    console.warn('Failed to decode pattern from URL', err);
    return null;
  }
};
