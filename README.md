# Beat Maker

A browser-based Web Audio step sequencer built with Next.js, React, TypeScript, and Tailwind CSS. Generates drum voices via synthesis (no samples) and supports 16/32/64-step patterns, per-step velocity, saving/loading, sharing, and WAV export.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to play.

## Scripts
- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run lint` – lint
- `npm test` – run Vitest unit tests

## Keyboard Shortcuts
- Space: Play / Pause
- Enter (focused step): Toggle step
- Alt/right-click on step: Cycle velocity

## Testing

```bash
npm test
```

## Architecture
- **App Router** with a client-only Beat Maker UI (`components/BeatMakerApp.tsx`).
- **State** via `useSequencer` hook (pattern + mixer), and `useAudioEngine` for Web Audio scheduling with lookahead.
- **Audio** synthesized in `lib/audio` (kick, snare, hat, clap), plus offline renderer + WAV encoder for exports.
- **Sequencer utilities** in `lib/sequencer` (types, pattern helpers, timing math).
- **Persistence** via `lib/storage` (localStorage) and `lib/share` (URL encoding for share links).
