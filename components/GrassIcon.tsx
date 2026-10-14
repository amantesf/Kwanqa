// A tuft of Simien grass (ሳር) — the currency Walia grazes on.

export default function GrassIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden>
      <path d="M4 29 C 6 20, 8 15, 6 6 C 10 13, 12 20, 12 29 Z" fill="#5fb84a" />
      <path d="M10 29 C 12 18, 14 11, 16 3 C 18 11, 20 18, 22 29 Z" fill="#4fa83c" />
      <path d="M20 29 C 20 20, 22 13, 27 7 C 25 15, 26 21, 28 29 Z" fill="#6cc455" />
      <rect x="3" y="27" width="26" height="4" rx="2" fill="#8a6a48" />
    </svg>
  );
}
