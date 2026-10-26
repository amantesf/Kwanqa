import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { siteUrl } from '@/site';

// One player for the whole app: tapping a new sound stops the last one.
let player: AudioPlayer | null = null;

export function play(path: string) {
  const source = { uri: siteUrl(path) };
  if (!player) player = createAudioPlayer(source);
  else player.replace(source);
  player.play();
}
