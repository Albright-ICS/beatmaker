import { computeStepTime, getTimingInfo } from '../sequencer/scheduler';
import { Pattern, TrackId } from '../sequencer/types';
import { triggerClap, triggerHat, triggerKick, triggerSnare } from './drums';

interface RenderOptions {
  bars: number;
  masterVolume: number;
  mixer: Record<TrackId, { volume: number; mute: boolean; solo: boolean }>;
}

export const renderPatternOffline = async (
  pattern: Pattern,
  { bars, masterVolume, mixer }: RenderOptions
): Promise<AudioBuffer> => {
  const { secondsPerStep } = getTimingInfo(pattern.bpm);
  const totalSteps = bars * 16;
  const durationSeconds = totalSteps * secondsPerStep + 1;
  const sampleRate = 48000;
  const offline = new OfflineAudioContext(2, Math.ceil(durationSeconds * sampleRate), sampleRate);

  const master = offline.createGain();
  master.gain.value = masterVolume;
  master.connect(offline.destination);

  const anySolo = Object.values(mixer).some((t) => t.solo);
  const trackGains = (Object.keys(pattern.tracks) as TrackId[]).reduce<Record<TrackId, GainNode>>((acc, track) => {
    const gain = offline.createGain();
    const state = mixer[track];
    const muted = anySolo ? !state.solo : state.mute;
    gain.gain.value = muted ? 0 : state.volume;
    gain.connect(master);
    acc[track] = gain;
    return acc;
  }, {} as Record<TrackId, GainNode>);

  for (let step = 0; step < totalSteps; step += 1) {
    const stepIndex = step % pattern.steps;
    const time = computeStepTime(pattern, step, 0);
    (Object.entries(pattern.tracks) as [TrackId, typeof pattern.tracks[TrackId]][]).forEach(([trackId, steps]) => {
      const stepData = steps[stepIndex];
      if (!stepData.on) return;
      switch (trackId) {
        case 'kick':
          triggerKick(offline, time, stepData.velocity, trackGains[trackId]);
          break;
        case 'snare':
          triggerSnare(offline, time, stepData.velocity, trackGains[trackId]);
          break;
        case 'hat':
          triggerHat(offline, time, stepData.velocity, trackGains[trackId]);
          break;
        case 'clap':
          triggerClap(offline, time, stepData.velocity, trackGains[trackId]);
          break;
        default:
          break;
      }
    });
  }

  return offline.startRendering();
};
