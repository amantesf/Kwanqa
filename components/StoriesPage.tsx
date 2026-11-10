'use client';

// /stories: read and listen to Amharic, the Kaufmann / LingQ way.
//   - kwanqa's own stories (lib/stories.ts), with hand-written meanings
//   - the Library: 29 illustrated storybooks (lib/library.ts, CC BY)
//   - My books: Amharic the learner brings (a PDF, a text file or pasted text)
//   - Words: the words you're learning, to review
// Every text opens in the same tap-a-word reader (components/Reader.tsx).

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LearnSidebar from '@/components/LearnSidebar';
import Reader, { tokenize, type ReaderPage } from '@/components/Reader';
import { amharicAudio } from '@/lib/amharicAudio';
import { fidelRoman } from '@/lib/fidelRoman';
import { reviewWord, setWordStatus, useKnownWords, useWordNotes } from '@/lib/knownWords';
import { LEVEL_NAMES, LIBRARY, cleanWord, libraryBook, licenseUrl, splitSentences, type LibraryBook } from '@/lib/library';
import { amharicShare, bookPages, deleteBook, getBook, newBookId, saveBook, useMyBooks, type MyBook } from '@/lib/myBooks';
import { useProfile } from '@/lib/profile';
import { STORIES, sentenceAudio, storyWords, wordText, type Story } from '@/lib/stories';

// ---------------------------------------------------------------------------
// Turning each kind of text into reader pages

function storyPages(story: Story): ReaderPage[] {
  return [
    {
      sentences: story.sentences.map(s => ({
        text: sentenceAudio(s),
        tokens: s.words.map(([am, tr, meaning], i) => ({ display: wordText(s, i), word: am, tr, meaning })),
        english: s.english,
        transliteration: s.transliteration,
      })),
    },
  ];
}

function libraryPages(book: LibraryBook): ReaderPage[] {
  return book.pages.map(p => ({
    image: p.img,
    english: p.en,
    sentences: splitSentences(p.text).map(text => ({ text, tokens: tokenize(text) })),
  }));
}

function myBookPages(book: MyBook): ReaderPage[] {
  return bookPages(book.text).map(text => ({
    sentences: splitSentences(text).map(s => ({ text: s, tokens: tokenize(s) })),
  }));
}

const STORY_VOICE = { kind: 'lines' as const, url: (text: string) => amharicAudio(text) };
const LIBRARY_VOICE = { kind: 'lines' as const, url: (text: string) => `/api/speak?text=${encodeURIComponent(text.trim())}` };

function wordsOfBook(book: LibraryBook) {
  return [...new Set(book.pages.flatMap(p => p.text.split(/\s+/).map(cleanWord)).filter(w => /[ሀ-፼]/.test(w)))];
}

// ---------------------------------------------------------------------------
// The shelf

function KnownCount() {
  const { known, learning } = useKnownWords();
  return (
    <div className="st-count-row">
      <p className="st-count">
        <strong>{known}</strong> {known === 1 ? 'word' : 'words'} known
      </p>
      {learning > 0 && (
        <Link href="/stories/words" className="st-review-link">
          Review {learning} {learning === 1 ? 'word' : 'words'} you’re learning →
        </Link>
      )}
    </div>
  );
}

function Progress({ words }: { words: string[] }) {
  const { status } = useKnownWords();
  const known = words.filter(w => status(w) === 'known').length;
  const pct = words.length ? Math.round((known / words.length) * 100) : 0;
  return (
    <span className="st-progress" aria-label={`${pct}% of its words known`}>
      <span className="st-progress-bar">
        <span style={{ width: `${pct}%` }} />
      </span>
      {pct}% known
    </span>
  );
}

function Shelf() {
  const books = useMyBooks();
  const levels = [...new Set(LIBRARY.map(b => b.level))].sort();
  return (
    <>
      <header className="st-head">
        <h1>Stories</h1>
        <p className="lead">Read and listen to real Amharic. Tap any word you don’t know, and watch your words grow.</p>
        <KnownCount />
      </header>

      <section className="st-section">
        <h2>kwanqa stories</h2>
        <p className="muted">Written for the camps, with every word explained.</p>
        <ul className="st-list">
          {STORIES.map(story => (
            <li key={story.id}>
              <Link href={`/stories/${story.id}`} className="st-card">
                <span className="st-card-am" lang="am">
                  {story.amharicTitle}
                </span>
                <span className="st-card-title">{story.title}</span>
                <span className="st-card-blurb">{story.blurb}</span>
                <span className="st-card-meta">Camp {story.camp}</span>
                <Progress words={storyWords(story)} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="st-section">
        <div className="st-section-head">
          <div>
            <h2>My books</h2>
            <p className="muted">Bring your own Amharic: a PDF, a text file, or text you paste.</p>
          </div>
          <Link href="/stories/add" className="btn st-add-btn">
            + Add a book
          </Link>
        </div>
        {books && books.length > 0 && (
          <ul className="st-list">
            {books.map(book => (
              <li key={book.id}>
                <Link href={`/stories/mine?id=${book.id}`} className="st-card">
                  <span className="st-card-am" lang="am">
                    {book.title}
                  </span>
                  <span className="st-card-blurb">
                    {bookPages(book.text).length} pages · added {new Date(book.added).toLocaleDateString()}
                  </span>
                  <Progress words={[...new Set(book.text.split(/\s+/).map(cleanWord).filter(w => /[ሀ-፼]/.test(w)))]} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="st-section">
        <h2>Library</h2>
        <p className="muted">
          Illustrated storybooks from{' '}
          <a href="https://globalstorybooks.net/" className="text-link" target="_blank" rel="noreferrer">
            Global Storybooks
          </a>{' '}
          and the{' '}
          <a href="https://africanstorybook.org/" className="text-link" target="_blank" rel="noreferrer">
            African Storybook
          </a>
          , free to share. Start with level 1 and work up.
        </p>
        {levels.map(level => (
          <div key={level} className="st-level">
            <h3>
              Level {level} · {LEVEL_NAMES[level]}
            </h3>
            <ul className="st-shelf">
              {LIBRARY.filter(b => b.level === level).map(book => (
                <li key={book.id}>
                  <Link href={`/stories/library/${book.id}`} className="st-book">
                    {book.cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/library/${book.cover}`} alt="" width={240} height={240} loading="lazy" />
                    )}
                    <span className="st-book-am" lang="am">
                      {book.title}
                    </span>
                    <span className="st-book-en">{book.titleEn}</span>
                    <Progress words={wordsOfBook(book)} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Adding a book

function AddBook() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState('');
  const [problem, setProblem] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  async function readFile(file: File) {
    setProblem('');
    try {
      let content: string;
      if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
        setBusy('Reading the PDF…');
        const { pdfText } = await import('@/lib/pdfText');
        content = await pdfText(file, (done, total) => setBusy(`Reading page ${done} of ${total}…`));
      } else {
        setBusy('Reading the file…');
        content = await file.text();
      }
      if (amharicShare(content) < 0.5) {
        setProblem(
          'We couldn’t find Amharic text in that file. It may be a scan (a picture of the pages), or typed with an older Ethiopian font (like Power Geez or Visual Geez) instead of Unicode. Try another copy, or paste the text instead.',
        );
        return;
      }
      setText(content);
      if (!title) setTitle(file.name.replace(/\.(pdf|txt)$/i, ''));
    } catch {
      setProblem('That file couldn’t be opened. Is it a PDF or a .txt file?');
    } finally {
      setBusy('');
    }
  }

  async function save() {
    if (amharicShare(text) < 0.5) {
      setProblem('This doesn’t look like Amharic text yet. Paste or upload Amharic written in ፊደል.');
      return;
    }
    const id = newBookId();
    try {
      await saveBook({ id, title: title.trim() || 'My book', text: text.trim(), added: Date.now() });
      router.push(`/stories/mine?id=${id}`);
    } catch {
      setProblem('Your browser didn’t let us save the book. Is it in private mode?');
    }
  }

  return (
    <>
      <Link href="/stories" className="st-back">
        ← Stories
      </Link>
      <header className="st-head">
        <h1>Add a book</h1>
        <p className="lead">Read any Amharic text with tap-a-word meanings and Walia’s voice.</p>
      </header>
      <div className="st-add">
        <button type="button" className="st-drop" onClick={() => fileInput.current?.click()} disabled={!!busy}>
          <strong>{busy || 'Choose a PDF or text file'}</strong>
          <span>Books in Unicode Amharic work best. It stays on this device.</span>
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".pdf,.txt,application/pdf,text/plain"
          hidden
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) void readFile(file);
            e.target.value = '';
          }}
        />
        <label className="field">
          <span>Title</span>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder="ፍቅር እስከ መቃብር" />
        </label>
        <label className="field">
          <span>Text</span>
          <textarea
            className="input st-textarea"
            lang="am"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={10}
            placeholder="Paste Amharic here, or choose a file above"
          />
        </label>
        {problem && (
          <p className="form-error" role="alert">
            {problem}
          </p>
        )}
        <button type="button" className="btn" onClick={() => void save()} disabled={!text.trim() || !!busy}>
          Start reading
        </button>
        <p className="st-fine">
          Add books you own or that are free to share. Your book is kept only on this device. When you ask what a word
          means, Walia sees just that sentence.
        </p>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Reading

function LibraryCredits({ book }: { book: LibraryBook }) {
  const by = [
    book.by.written && `Written by ${book.by.written}`,
    book.by.illustrated && `illustrated by ${book.by.illustrated}`,
    book.by.translated && `translated into Amharic by ${book.by.translated}`,
  ].filter(Boolean);
  return (
    <p>
      <strong>{book.titleEn}</strong>. {by.join(', ')}. From{' '}
      {book.source ? (
        <a href={book.source} className="text-link" target="_blank" rel="noreferrer">
          the African Storybook
        </a>
      ) : (
        'the African Storybook'
      )}{' '}
      via Global Storybooks, licensed{' '}
      <a href={licenseUrl(book)} className="text-link" target="_blank" rel="noreferrer">
        CC BY {book.license}
      </a>
      . Split into sentences for reading in kwanqa.
    </p>
  );
}

function MyBookReader({ id }: { id: string }) {
  const [book, setBook] = useState<MyBook | null | undefined>(undefined);
  const router = useRouter();
  useEffect(() => {
    getBook(id)
      .then(b => setBook(b ?? null))
      .catch(() => setBook(null));
  }, [id]);
  if (book === undefined) return <p className="muted">Opening your book…</p>;
  if (!book)
    return (
      <p className="muted">
        That book isn’t on this device.{' '}
        <Link href="/stories" className="text-link">
          Back to Stories
        </Link>
      </p>
    );
  return (
    <Reader
      title={book.title}
      subtitle="My book"
      backHref="/stories"
      backLabel="Stories"
      pages={myBookPages(book)}
      how={{ kind: 'own' }}
      translateSentences
      startPage={book.page ?? 0}
      onPage={page => void saveBook({ ...book, page })}
      credits={
        <button
          type="button"
          className="st-mini"
          onClick={async () => {
            await deleteBook(book.id);
            router.push('/stories');
          }}
        >
          Remove this book from this device
        </button>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Words: review what you're learning

function Words() {
  const { status } = useKnownWords();
  const notes = useWordNotes();
  const learning = Object.entries(notes).filter(([w]) => status(w) === 'learning');
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const card = learning.length ? learning[i % learning.length] : null;
  return (
    <>
      <Link href="/stories" className="st-back">
        ← Stories
      </Link>
      <header className="st-head">
        <h1>Words you’re learning</h1>
        <p className="lead">Know it three times in a row and it moves to your known words.</p>
      </header>
      {!card ? (
        <p className="muted">
          No words to review yet. In any story, tap a word and mark it <strong>Learning</strong>.
        </p>
      ) : (
        <div className="st-review">
          <p className="st-review-word" lang="am">
            {card[0]}
          </p>
          {open ? (
            <>
              <p className="st-review-tr">{card[1].tr}</p>
              <p className="st-review-meaning">{card[1].meaning || 'Open it in its story to look up the meaning.'}</p>
              {card[1].sentence && (
                <p className="st-review-sentence" lang="am">
                  {card[1].sentence}
                </p>
              )}
              <div className="st-review-buttons">
                <button
                  type="button"
                  className="st-status-btn"
                  onClick={() => {
                    reviewWord(card[0], false);
                    setOpen(false);
                    setI(n => n + 1);
                  }}
                >
                  Not yet
                </button>
                <button
                  type="button"
                  className="st-status-btn st-known on"
                  onClick={() => {
                    reviewWord(card[0], true);
                    setOpen(false);
                    setI(n => n + 1);
                  }}
                >
                  I knew it
                </button>
              </div>
            </>
          ) : (
            <button type="button" className="btn" onClick={() => setOpen(true)}>
              Show the meaning
            </button>
          )}
          <p className="st-fine">
            {learning.length} {learning.length === 1 ? 'word' : 'words'} to review ·{' '}
            <button type="button" className="st-link-btn" onClick={() => setWordStatus(card[0], 'known')}>
              I know this one already
            </button>
          </p>
        </div>
      )}
      {learning.length > 0 && (
        <ul className="st-word-list">
          {learning.map(([w, n]) => (
            <li key={w}>
              <span lang="am">{w}</span> <small>{n.tr || fidelRoman(w)}</small>
              {n.meaning && ` · ${n.meaning}`}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------

export type StoriesView =
  | { view: 'shelf' }
  | { view: 'story'; id: string }
  | { view: 'library'; id: string }
  | { view: 'mine'; id: string }
  | { view: 'add' }
  | { view: 'words' };

export default function StoriesPage(props: StoriesView) {
  const track = useProfile()?.track ?? 'amharic';
  let body: ReactNode;
  if (props.view === 'story') {
    const story = STORIES.find(s => s.id === props.id)!;
    body = (
      <Reader
        title={story.amharicTitle}
        subtitle={`${story.title} · Camp ${story.camp}`}
        backHref="/stories"
        backLabel="Stories"
        pages={storyPages(story)}
        how={STORY_VOICE}
        translateSentences
        note={story.note}
      />
    );
  } else if (props.view === 'library') {
    const book = libraryBook(props.id)!;
    body = (
      <Reader
        title={book.title}
        subtitle={`${book.titleEn} · Level ${book.level}`}
        backHref="/stories"
        backLabel="Stories"
        pages={libraryPages(book)}
        how={LIBRARY_VOICE}
        translateSentences={false}
        credits={<LibraryCredits book={book} />}
      />
    );
  } else if (props.view === 'mine') body = <MyBookReader id={props.id} />;
  else if (props.view === 'add') body = <AddBook />;
  else if (props.view === 'words') body = <Words />;
  else body = <Shelf />;
  return (
    <div className="learn-app">
      <LearnSidebar active="stories" track={track} />
      <main className="learn-main st-page">{body}</main>
    </div>
  );
}
