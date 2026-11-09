'use client';

import { useState } from 'react';
import LearnSidebar from '@/components/LearnSidebar';
import { READING, SMALL_WORDS, type ReadingScene, type SmallWord } from '@/lib/everyday';
import { useProfile } from '@/lib/profile';

// Everyday Amharic (lib/everyday.ts): the small words that make speech sound
// natural, and real-world Amharic to read (a minibus sign, a menu, a text),
// tapping a line to check yourself.

function WordCard({ word }: { word: SmallWord }) {
  return (
    <article className="ev-word">
      <h3>
        <span lang="am">{word.word}</span> <small>{word.roman}</small>
      </h3>
      <p className="ev-meaning">{word.meaning}</p>
      <p className="ev-how">{word.how}</p>
      <ul className="ev-examples">
        {word.examples.map(ex => (
          <li key={ex.amharic}>
            <span lang="am">{ex.amharic}</span>
            <small>
              {ex.transliteration} · {ex.english}
            </small>
          </li>
        ))}
      </ul>
    </article>
  );
}

function Scene({ scene }: { scene: ReadingScene }) {
  const [shown, setShown] = useState<Set<number>>(new Set());
  const all = shown.size === scene.lines.length;
  return (
    <article className="ev-scene">
      <h3>{scene.title}</h3>
      <p className="ev-how">{scene.context}</p>
      <div className={`ev-board ev-${scene.look}`}>
        {scene.lines.map((line, i) => (
          <button
            key={line.amharic}
            type="button"
            className={`ev-line${shown.has(i) ? ' shown' : ''}`}
            onClick={() => setShown(s => new Set(s).add(i))}
            aria-label={shown.has(i) ? `${line.amharic}: ${line.transliteration}, ${line.english}` : `${line.amharic}: tap to check your reading`}
          >
            <span lang="am">{line.amharic}</span>
            {shown.has(i) ? (
              <small>
                {line.transliteration} · {line.english}
              </small>
            ) : (
              <small className="ev-hint">Read it, then tap to check</small>
            )}
          </button>
        ))}
      </div>
      <div className="ev-scene-foot">
        {!all && (
          <button type="button" className="ev-show-all" onClick={() => setShown(new Set(scene.lines.map((_, i) => i)))}>
            Show all
          </button>
        )}
        {all && scene.tip && <p className="grammar-tip">{scene.tip}</p>}
      </div>
    </article>
  );
}

export default function EverydayPage() {
  const track = useProfile()?.track ?? 'amharic';
  return (
    <div className="learn-app">
      <LearnSidebar active="everyday" track={track} />
      <main className="learn-main ev-page">
        <header className="ev-head">
          <h1>Everyday Amharic</h1>
          <p className="lead">The little words that make you sound natural, and the Amharic you’ll actually read on the street.</p>
        </header>

        <section className="stack">
          <h2 className="ev-section-title">Small words that make you sound natural</h2>
          {SMALL_WORDS.map(group => (
            <div key={group.title} className="stack">
              <h3 className="ev-group-title">{group.title}</h3>
              <p className="muted">{group.intro}</p>
              <div className="ev-grid">
                {group.words.map(w => (
                  <WordCard key={w.word} word={w} />
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="stack">
          <h2 className="ev-section-title">Read real Amharic</h2>
          <p className="muted">Try to read each line first, then tap it to check.</p>
          <div className="ev-grid">
            {READING.map(scene => (
              <Scene key={scene.id} scene={scene} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
