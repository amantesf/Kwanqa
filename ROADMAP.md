# kwanqa Roadmap

A 16-week (~4-month) plan for building kwanqa, the game-like way to learn Amharic and English.

> **How to use this doc:** check off tasks as they ship (`- [x]`), put initials next to owned items (e.g. `— AT`), and add notes under each phase. Edit freely; this is a living plan.

_Last updated: 2026-10-13_

---

## Where things stand

- [x] **Website:** all pages built in the Walia/Simien design (founders section hidden until new photos are ready)
- [x] **Game loop (in-browser):** bottom-up trail, locked camps, grass (ሳር), horn levels, stamina (ጉልበት), practice generated from lessons
- [ ] **Content:** 4 courses × 3 lessons = **12 lessons**, enough for a demo but not a real course
- [ ] **Accounts, backend, mobile app, audio, speech, AI:** not built yet
- [ ] **Version control:** current work still needs to be committed and pushed to GitHub

---

## Workstreams

### 1. Engineering foundations

- [ ] Commit and push current work; agree on a workflow (a branch per feature, pull requests, review each other's changes)
- [ ] Deploy to **Vercel** with preview links on every pull request, so everyone sees the same build
  - Vercel's free Hobby plan is for non-commercial use, so plan on Pro (~$20/month) at launch
- [ ] Write a `README` (how to run the project) and a `CLAUDE.md` (project conventions)
- [ ] Lint and build checks on every pull request
- [ ] Tests for the exercise generator and the grass/stamina math
- [ ] Error monitoring (e.g. Sentry free tier) and privacy-friendly analytics

### 2. Content and curriculum (our biggest advantage, and the main bottleneck)

- [ ] **Curriculum map:** units from absolute beginner to early-intermediate for both tracks (first target: ~10 camps × 5 lessons per track)
- [ ] **Ge'ez alphabet course (ፊደል):** 33 base letters × 7 vowel forms, a great fit for letter-tile games and the #1 need for heritage learners
- [ ] **One transliteration standard:** current data mixes systems (e.g. "dehna neñ" vs "ṯewat sɨdɨst … ənəsalehu")
- [ ] **Native-speaker review:** every lesson checked by someone other than its author
- [ ] **Content format:** move lessons out of code into structured JSON (a CMS later) so non-coders can add lessons
- [ ] **Culture notes:** coffee ceremony, Enkutatash, Meskel, Timkat, greetings etiquette, respectful forms of address
- [ ] **English track** at the same depth, with explanations in Amharic

### 3. Game design (Duolingo-like, but our own)

Already shipped: trail, camps, grass, horns, stamina.

- [ ] **Checkpoint cliffs** between camps: a review quiz that unlocks the next zone
- [ ] **Review meadow:** spaced repetition that brings back words you're forgetting
- [ ] **Daily grazing streak** and a daily goal
- [ ] **Achievements** (e.g. "First ፊደል mastered", "Reached the heather belt")
- [ ] **Placement test** so heritage speakers can skip ahead
- [ ] **Feel:** sound effects, short celebration animations
- [ ] **More Walia poses** (slipping, grazing, sleeping) and sidekicks (e.g. a gelada)
- [ ] **Balance tuning:** grass rewards, rest cost, how often stamina recovers
- [ ] **Ethical rules:** never lock learners out, no pay-to-continue, gentle reminders

### 4. Accounts and backend

- [ ] **Login:** Supabase, Firebase, or Clerk (Supabase is a good default: database + login, with a free tier)
- [ ] **Database:** users, progress, grass, streaks, answers (answers data shows which questions are too hard)
- [ ] **Migration:** move in-browser progress into the account on first login
- [ ] **Kids' privacy decision:** US users under 13 trigger **COPPA** (parental consent, limited data). Decide: require 13+, or build parent accounts?

### 5. Mobile app

- [ ] **Step 1, PWA:** installable web app with an icon and offline lessons (cheap, reuses everything)
- [ ] **Step 2, native:** **Expo (React Native)**, sharing game logic and content files with the website
- [ ] **App stores:** Apple Developer ($99/year), Google Play ($25 once), privacy labels, screenshots
- [ ] **App-only features:** push notifications for streaks, offline lesson packs

### 6. Audio, speech, and AI

Build audio first, then speech, and AI last. Each layer depends on the one before it.

| Layer | What it adds | Notes |
|---|---|---|
| **Recorded audio** | Native voice for every phrase | Record ourselves or community volunteers. The gold standard; makes listening exercises possible. |
| **Text-to-speech** | Audio for unrecorded content | Amharic voices exist in some cloud services and Meta's open MMS models. Quality varies, so listen before using. |
| **Listening exercises** | "Tap what you hear", dictation | Needs only audio, no AI. |
| **Speaking checks** | "Say this phrase" pass/fail | Speech recognition turns the voice into text, compared with the target phrase (allowing small differences). Amharic options: Google Cloud, Azure, Meta MMS, Whisper; **accuracy differs a lot, so test each with our own voices**. English has mature pronunciation-scoring services. |
| **AI feedback** | Explains *why* an answer is wrong | Hosted model chosen by the blind test below. Limited to explaining, never inventing lessons. |
| **Practice chat with Walia** | Conversation practice | Labeled experimental; kept on-topic and safe for kids. |
| **AI-drafted content** | Faster lesson creation | Always reviewed by a native speaker before learners see it. |

- [ ] Record audio for all existing lessons
- [ ] Build listening exercises
- [ ] Test Amharic speech recognition options with our own voices
- [ ] Ship "say this phrase" (English first, Amharic if accuracy holds)
- [ ] **AI blind test:** write 30–50 real prompts; grade answers from candidate models (Claude, GPT, Gemini, Aya, Llama-2-Amharic) for correctness and naturalness
- [ ] AI feedback on wrong answers, behind a toggle
- [ ] Voice data policy: consent, clear privacy terms, no training on learner recordings without permission
- [ ] Spending caps on all speech/AI APIs

### 7. Business, legal, and community

- [ ] **User research:** interview 10–20 learners (diaspora parents, heritage teens, Amharic speakers learning English); watch them use the trail
- [ ] **Beta community:** churches, Ethiopian community centers, student associations, a Telegram/WhatsApp group
- [ ] **Trademark search on "kwanqa"**
- [ ] Privacy policy and terms of use
- [ ] Form an LLC once money is involved
- [ ] Optional: quick lawyer review of the Duolingo-inspired design
- [ ] **Metrics:** lessons completed, next-day and next-week return rate, streak length, where people quit
- [ ] **Funding:** university entrepreneurship programs, pitch competitions, language-preservation and education grants

---

## Week-by-week plan

| Phase | Weeks | Focus | Done when |
|---|---|---|---|
| **0. Stabilize** | 1 | Commit, push, Vercel previews, branch workflow, README | Everyone opens the same preview link |
| **1. Content foundation** | 2–4 | Curriculum map, transliteration standard, lessons as JSON, ፊደል course outline, 10 new reviewed lessons, 10 user interviews, privacy policy, trademark search | 20+ reviewed lessons; interview notes summarized |
| **2. Game loop v2 + accounts** | 5–8 | Supabase login, synced progress, checkpoint cliffs, review meadow, daily streak, sound effects, placement test | A tester keeps progress across two devices |
| **3. Audio + mobile** | 9–12 | Audio for all lessons, listening exercises, installable PWA, Expo prototype | A tester completes a full camp on a phone, with audio |
| **4. Speech + AI pilot** | 13–16 | Speech-recognition test, "say this phrase", AI blind test, AI feedback toggle, closed beta (20–50 learners) | Beta report with retention numbers and a go/no-go on each AI feature |

**Every week:**

- 3–5 new reviewed lessons
- One playtest session
- A short sync: what shipped, what's blocked, what's next

### Phase notes

_Add decisions, blockers, and learnings here as each phase runs._

- **Phase 0:**
- **Phase 1:**
- **Phase 2:**
- **Phase 3:**
- **Phase 4:**

---

## Ownership

| Person | Owns |
|---|---|
| **Founder A** | Engineering: deploys, backend, app |
| **Founder B** | Content and curriculum: lessons, review, audio recording |
| **Friend** | Game design and testing, user research, community |

Swap to match strengths. The key rule: **content needs an owner every single week.**

---

## Biggest risks

1. **Too little content.** The game loop is ready, but 12 lessons won't keep anyone.
2. **Inaccurate AI or speech in Amharic.** Mitigate with the blind test, human review, and English-first rollout.
3. **Kids' privacy (COPPA).** Decide the age policy before building accounts.
4. **Scope creep.** Ship phase by phase; keep the app as a PWA until the web version holds onto learners.

---

## Rough costs (first 4 months)

| Item | Cost | When |
|---|---|---|
| Domain | ~$15/year | Now |
| Vercel Pro | ~$20/month | Once commercial |
| Supabase | Free tier to start | Phase 2 |
| Apple Developer | $99/year | Native app stage |
| Google Play | $25 once | Native app stage |
| Speech and AI APIs | Likely under ~$50/month in beta, with caps | Phase 4 |

_Prices change, so verify them when signing up._
