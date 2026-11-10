// The kwanqa team: accounts listed in STATS_EMAILS (a comma-separated list in
// the Vercel environment variables). They can see /stats and /voice-lab.
export function isTeam(email: string | undefined) {
  const list = (process.env.STATS_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}
