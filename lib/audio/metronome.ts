export const scheduleMetronome = (
  context: AudioContext,
  time: number,
  destination: AudioNode,
  accented: boolean
) => {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(accented ? 1200 : 880, time);
  gain.gain.setValueAtTime(accented ? 0.15 : 0.08, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1);
  osc.connect(gain).connect(destination);
  osc.start(time);
  osc.stop(time + 0.12);
};
