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

The site works without any keys: progress is saved in the browser, and features that need a service (accounts, Talk, word lookups, audio) turn off until their keys are set.

### Environment variables

| Variable | What it's for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Accounts and synced progress |
| `SUPABASE_SECRET_KEY` | Server-only: reminders, stats, family, AI limits |
| `ANTHROPIC_API_KEY` | Walia's answers in Talk and word meanings in Stories |
| `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` | Walia's voice and listening |
| `RESEND_API_KEY`, `CRON_SECRET` | Streak reminder and holiday emails |
| `STATS_EMAILS` | Team emails that can see `/stats` and skip AI limits |
| `GLOSS_DAILY_LIMIT`, `TALK_DAILY_LIMIT`, `LISTEN_DAILY_LIMIT` | Optional daily caps per learner |

See [`.env.example`](.env.example) for details. Never commit `.env.local`.

### Database

Run these in the Supabase SQL editor, in this order. Each one is safe to run more than once:

1. `supabase/schema.sql`: profiles, progress and reminders
2. `supabase/events.sql`: lesson events for the team stats page
3. `supabase/family.sql`: Family mode
4. `supabase/ai-limits.sql`: daily limits on AI features

`supabase/stats.sql` has read-only queries for checking how learners are doing.

### Before a commit

```bash
npx tsc --noEmit
npm run lint
node scripts/make-dark-css.mjs   # after changing CSS, to rebuild dark mode
```

For the phone app, see [`mobile/README.md`](mobile/README.md).

## Credits

- **Library storybooks:** 29 Amharic storybooks from [Global Storybooks](https://globalstorybooks.net) and the [African Storybook](https://www.africanstorybook.org) initiative, used under [Creative Commons Attribution (CC BY 3.0 / 4.0)](https://creativecommons.org/licenses/by/4.0/). Each book's authors, illustrators and translators are credited on its page in the app.
- **Fonts:** Noto Sans Ethiopic and Nunito, under the SIL Open Font License.
- **Illustrations:** made for kwanqa.

## Team

kwanqa is built by **Amanuel Tesfaye** and **Nehmiya Erkelo**, co-founders. We're building the learning tools we wish we'd had growing up between two cultures.

Have an idea, a correction or a story to share? Email **kwanqa.team@gmail.com**.

---

<p align="center">ቋንቋ ድልድይ ነው · <em>Language is a bridge.</em></p>
