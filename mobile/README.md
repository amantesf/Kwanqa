# Kwanqa app

The iPhone and Android app, built with Expo. It reads the lessons, the fidel
and the flashcard decks straight from the website's `lib/` folder, so a fix
there shows up in both. Recordings and Walia's voice are played from
kwanqa.com.

## Running it

```bash
cd mobile
npm install
npx expo start        # scan the QR code with Expo Go on your phone
npx expo start --web  # or open it in the browser
```

Before a commit, run `npx tsc --noEmit` and `npx expo lint`.
