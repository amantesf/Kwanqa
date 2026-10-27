// The "are you human?" check for the phone app. The app shows this page in a
// small web view, because Turnstile only runs on kwanqa.com; each token is
// handed back to the app (window.ReactNativeWebView), which sends it to
// Supabase with the sign-in, like the website's forms do (components/Captcha.tsx).

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export function GET() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Kwanqa</title>
<style>html, body { margin: 0; background: transparent; } #check { display: flex; justify-content: center; }</style>
<script>
  function send(token) {
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(token);
  }
  function start() {
    turnstile.render('#check', {
      sitekey: ${JSON.stringify(SITE_KEY)},
      theme: 'light',
      size: 'flexible',
      callback: send,
      'expired-callback': function () { send(''); },
      'error-callback': function () { send(''); },
    });
  }
</script>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=start" async defer></script>
</head>
<body><div id="check"></div></body>
</html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
