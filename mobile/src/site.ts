// Recordings and Walia's voice are served by the website, so the app plays
// them from there. Paths in lib/ start with "/", like "/sounds/fidel/1200.mp3".
export const SITE = process.env.EXPO_PUBLIC_SITE_URL ?? 'https://kwanqa.com';

export const siteUrl = (path: string) => (path.startsWith('http') ? path : SITE + path);
