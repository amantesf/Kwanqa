'use client';

import { setSoundsMuted, useSoundsMuted } from '@/lib/sounds';

/** The Sound effects switch in the profile page's settings. */
export default function SoundToggle() {
  const muted = useSoundsMuted();
  return (
    <label className="toggle reminder-toggle">
      <input type="checkbox" checked={!muted} onChange={e => setSoundsMuted(!e.target.checked)} />
      <span>
        <strong>Sound effects</strong>
        <span className="faint small">Dings for right and wrong answers, and little sounds on the trail. Saved on this device.</span>
      </span>
    </label>
  );
}
