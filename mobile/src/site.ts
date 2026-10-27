// Recordings and Walia's voice are served by the website, so the app plays
// them from there. Paths in lib/ start with "/", like "/sounds/fidel/1200.mp3";
// full addresses (and files already on the phone) are left as they are.
export const SITE = process.env.EXPO_PUBLIC_SITE_URL ?? 'https://kwanqa.com';

export const siteUrl = (path: string) => (/^[a-z][a-z0-9+.-]*:/i.test(path) ? path : SITE + path);
