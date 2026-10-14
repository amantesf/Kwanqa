# kwanqa

The fun, game-like way to learn Amharic and English, built for Ethiopian families and the diaspora. Walia the ibex climbs the Simien Mountains with you, one lesson at a time.

See [ROADMAP.md](ROADMAP.md) for the plan.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The page reloads automatically when you save a file.

Before pushing, check that the production build works:

```bash
npm run lint
npm run build
```

## Where things live

| Path | What's there |
|---|---|
| `app/` | Pages (home, courses, lessons, about, approach, values) |
| `app/globals.css` | The design system: colors, buttons, cards, trail, practice |
| `components/` | Shared UI: header, footer, Walia mascot, trail, practice session |
| `lib/courses.ts` | All lesson content (phrases, dialogues) |
| `lib/climb.ts` | Game rules: progress, grass, horns, altitude zones |
| `lib/exercises.ts` | Turns lesson phrases into practice questions |
| `lib/team.ts` | Founder profiles and photo paths |
| `public/` | Images (logo, founder photos) |

To re-theme the site, change the `--primary` colors at the top of `app/globals.css`.

## Working together

We each work on our own branch, and every push gets its own preview link, so we can build different things at the same time without stepping on each other.

1. **Start from the latest main:**
   ```bash
   git checkout main
   git pull
   git checkout -b your-name/what-youre-building   # e.g. amanuel/fidel-course
   ```
2. **Work and commit as you go:**
   ```bash
   git add -A
   git commit -m "Short description of the change"
   git push -u origin HEAD
   ```
3. **Open a pull request** on GitHub. Vercel posts a preview link on it, and the link updates about a minute after every push. Share it with each other to review.
4. **Merge** once the preview looks right. Then everyone runs `git checkout main && git pull` to get the update.

Tips:
- Keep branches small and focused (one feature each) so merges stay easy.
- Pull `main` into your branch often (`git pull origin main`) to pick up the other person's work.
- For true side-by-side editing in the same files, use the **Live Share** extension in VS Code.
