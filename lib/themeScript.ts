// Applies dark mode in <head>, before anything is drawn, so there's no white
// flash. Kept apart from lib/theme.ts so the server-rendered layout can use it.

export const THEME_KEY = 'kwanqa-theme';

export const THEME_SCRIPT = `try{if(localStorage.getItem('${THEME_KEY}')==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}`;
