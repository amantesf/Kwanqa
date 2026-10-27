import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { siteUrl } from '@/site';

// Recordings and Walia's voice come from kwanqa.com. Each sound gets a fresh
// player that starts once the file has loaded (starting before that is
// unreliable on iPhones), and is released when it ends or another sound of the
// same kind replaces it: a new word stops the last one, while answer chimes
// have their own channel so they never cut off a word.

// Play even with the ring/silent switch on silent: the learner asked to hear it.
void setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});

const channels: Record<'voice' | 'chime', AudioPlayer | null> = { voice: null, chime: null };

function stop(channel: 'voice' | 'chime') {
  const player = channels[channel];
  channels[channel] = null;
  if (!player) return;
  try {
    player.pause();
    player.remove();
  } catch {
    // already released
  }
}

function playOn(channel: 'voice' | 'chime', path: string, volume = 1) {
  stop(channel);
  const player = createAudioPlayer({ uri: siteUrl(path) });
  channels[channel] = player;
  player.volume = volume;
  let started = false;
  player.addListener('playbackStatusUpdate', status => {
    if (channels[channel] !== player) return;
    if (status.isLoaded && !started) {
      started = true;
      player.play();
    } else if (status.didJustFinish) {
      stop(channel);
    }
  });
}

export function play(path: string) {
  playOn('voice', path);
}

// the website's answer sounds (public/sounds/)
export function playEffect(kind: 'correct' | 'wrong' | 'complete') {
  playOn('chime', `/sounds/${kind}.mp3`, 0.6);
}
