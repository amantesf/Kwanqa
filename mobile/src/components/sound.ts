import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { siteUrl } from '@/site';

// Two players: one for voices (tapping a new line stops the last one) and one
// for the answer chimes, so a chime never cuts off a word.
let voice: AudioPlayer | null = null;
let chime: AudioPlayer | null = null;

function playOn(player: AudioPlayer | null, path: string, volume = 1) {
  const source = { uri: siteUrl(path) };
  if (!player) player = createAudioPlayer(source);
  else player.replace(source);
  player.volume = volume;
  player.play();
  return player;
}

export function play(path: string) {
  voice = playOn(voice, path);
}

// the website's answer sounds (public/sounds/)
export function playEffect(kind: 'correct' | 'wrong' | 'complete') {
  chime = playOn(chime, `/sounds/${kind}.mp3`, 0.6);
}
