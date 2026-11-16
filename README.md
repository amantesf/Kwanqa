# kwanqa

**The fun, game-like way to learn Amharic and English, built for Ethiopian families and the diaspora.**
Walia the ibex climbs the Simien Mountains with you, one lesson at a time.

🌐 **[kwanqa.com](https://kwanqa.com)**

---

## Why kwanqa?

Millions of Ethiopians live abroad, and many of their kids grow up understanding a little Amharic but never learning to speak, read or write it. At the same time, Ethiopians moving abroad need practical English for jobs, school and everyday life. Most language apps either skip Amharic entirely or teach it as a list of words with no culture behind it.

kwanqa (ቋንቋ, "language") is built for both directions:

- **Learn Amharic**: for the diaspora, heritage learners, and anyone with Ethiopian family or friends.
- **Learn English**: for Amharic speakers getting ready for life, work and school abroad.

Every lesson is rooted in real Ethiopian life: the coffee ceremony, bargaining in Merkato, visiting relatives, Meskel, Genna, Fasika, Eid and Ramadan.

## What's inside

### 🏔️ The climb
- **12 Amharic camps** and **9 English camps**, from greetings and first words up to "The Summit": everyday conversation, job interviews, money and bills.
- Short, game-like lessons with listening, speaking, matching, typing and picture questions.
- Streaks, a progress trail up the Simien Mountains, stamps in your **Passport**, and grass that grows as you learn.

### ፊደል The alphabet
- An interactive **ፊደል chart** with audio for every letter.
- Stroke-by-stroke writing practice.
- **Ge'ez numerals** (፩ ፪ ፫ …) with their Amharic names.

### 📞 Talk with Walia
- Practice real conversations out loud. Walia listens to what you say, checks whether it fits, and answers back.
- Hints, slow replay and an example answer when you get stuck.

### 📖 Stories (inspired by the LingQ method)
- Hand-written Amharic stories with a gloss for every word.
- A **library of 29 illustrated storybooks** (see Credits below).
- **Add your own book**: upload a PDF or paste Amharic text, and read it with tap-to-translate.
- Tap any word to see its meaning and transliteration, and mark it **new**, **learning** or **known**. Your known-word count grows as you read.

### 🛒 Games and culture
- **Merkato**: bargain your way through three market stalls.
- A **phrasebook**, **proverbs** (ምሳሌዎች), an Ethiopian **holiday calendar** and the Ethiopian date.
- 80+ original illustrations made for the app.

### 👨‍👩‍👧 Family mode
- Parents and kids each learn on their own account and join one family with a 6-letter code.
- The **family streak** only grows on days when *everyone* practises.

### More
- Light and dark mode.
- Streak reminder and holiday emails, with one-click unsubscribe.
- Start without an account, then sign in with email or Google to keep your progress.

## Built with

| Part | Tools |
|---|---|
| Website | [Next.js](https://nextjs.org) 16, React 19, TypeScript, plain CSS |
| Phone app | [Expo](https://expo.dev) / React Native (in [`mobile/`](mobile)) |
| Accounts and data | [Supabase](https://supabase.com) (Postgres, Auth, row-level security) |
| Walia's voice and ears | Azure Speech (Amharic and English text-to-speech and speech-to-text) |
| Walia's brain | Claude by Anthropic (Talk answers and word meanings) |
| Email | [Resend](https://resend.com) |
| Hosting | [Vercel](https://vercel.com) |

## Project layout

```
app/          pages and API routes (Next.js App Router)
  api/        gloss, tutor, listen, speak, reminders, stats …
components/   React components (lessons, Talk, Reader, Family …)
lib/          lessons, courses, dictionary, pictures, stories, helpers
mobile/       the iPhone and Android app (Expo)
public/       pictures, sounds, library book art
scripts/      build helpers (dark-mode CSS, fidel audio)
supabase/     SQL to set up the database
```

The phone app reads its lessons straight from `lib/`, so a fix there shows up on both the website and the app.

## Running it locally

You'll need **Node.js 20+**.

```bash
git clone https://github.com/amantesf/Kwanqa.git
cd Kwanqa
npm install
cp .env.example .env.local   # then fill in the keys you have
npm run dev                  # open http://localhost:3000
```
