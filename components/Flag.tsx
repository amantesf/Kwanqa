// Simplified flags used as language icons (like a course picker).

export type FlagName = 'ethiopia' | 'usa';

function star(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.4;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

export default function Flag({ name, className }: { name: FlagName; className?: string }) {
  if (name === 'ethiopia') {
    return (
      <svg viewBox="0 0 60 40" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="60" height="13.4" fill="#078930" />
        <rect y="13.3" width="60" height="13.4" fill="#fcdd09" />
        <rect y="26.6" width="60" height="13.4" fill="#da121a" />
        <circle cx="30" cy="20" r="10" fill="#0f47af" />
        <polygon points={star(30, 20.6, 7.4)} fill="none" stroke="#fcdd09" strokeWidth="1.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 40" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="60" height="40" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map(i => (
        <rect key={i} y={(i * 40) / 13} width="60" height={40 / 13} fill="#b22234" />
      ))}
      <rect width="26" height={(40 / 13) * 7} fill="#3c3b6e" />
      {[0, 1, 2].map(r =>
        [0, 1, 2, 3].map(c => (
          <circle key={`${r}-${c}`} cx={4 + c * 6} cy={4.5 + r * 6.5} r="1.3" fill="#fff" />
        )),
      )}
    </svg>
  );
}
