'use client';

// /talk: pick a conversation and call Walia. The calls themselves are in TalkCall.
// The page opens on a phone ringing with Walia's call; answering it starts the
// first conversation.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Mascot from '@/components/Mascot';
import TalkCall from '@/components/TalkCall';
import { callBest, useClimb } from '@/lib/climb';
import { LEVELS, conversationsFor, type Conversation, type Gender, type Level } from '@/lib/conversations';
import type { Track } from '@/lib/courses';
import { useProfile } from '@/lib/profile';

const GENDER_KEY = 'kwanqa-talk-gender';

// Rough call length by level: harder calls take longer answers.
const MINUTES = { beginner: 3, intermediate: 4, advanced: 5 } as const;

function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        d="M6.6 3.5l2.6.4c.5.1.8.4.9.9l.6 3.1c.1.4-.1.9-.4 1.1L8.6 10.3a12 12 0 0 0 5.1 5.1l1.3-1.7c.3-.4.7-.5 1.1-.4l3.1.6c.5.1.8.5.9.9l.4 2.6c.1.6-.3 1.2-.9 1.3-1 .2-2 .3-3 .3A13.6 13.6 0 0 1 3 4.4c0-1 .1-2 .3-3 .1-.6.7-1 1.3-.9z"
        fill="currentColor"
      />
    </svg>
  );
}

function HangUpIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path
        d="M3.5 14.2c4.9-4.3 12.1-4.3 17 0l-1.9 2.6c-.3.4-.9.5-1.3.3l-2.6-1.3c-.4-.2-.6-.6-.6-1v-1.6a10.6 10.6 0 0 0-4.2 0v1.6c0 .4-.2.8-.6 1l-2.6 1.3c-.4.2-1 .1-1.3-.3z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

/**
 * The words on the page. English learners are Amharic speakers, so they get
 * Amharic first with the English beside it, and calls in English.
 */
function pageText(track: Track) {
  const en = track === 'english';
  const both = (english: string, amharic: string) => (en ? `${amharic} · ${english}` : english);
  return {
    en,
    both,
    back: both('Back to the trail', 'ወደ መንገዱ ተመለስ'),
    kicker: en ? 'ጨዋታ · English speaking practice' : 'Speaking practice',
    lede: en
      ? 'ለዋሊያ ይደውሉ። ቀላል ጥያቄዎችን በእንግሊዝኛ ይጠይቅዎታል፣ እርስዎም ጮክ ብለው በእንግሊዝኛ ይመልሳሉ። Give Walia a call: he asks simple questions in English, and you answer out loud.'
      : 'Give Walia a call. He’ll ask you simple questions in Amharic, and you answer out loud, just like talking with family back home.',
    steps: en
      ? [
          { title: 'ዋሊያ ይደውልልዎታል · Walia calls you', text: 'በእንግሊዝኛ ይናገራል፤ የአማርኛ ትርጉሙን ማየት ይችላሉ። He speaks English, with the Amharic meaning when you need it.' },
          { title: 'ጮክ ብለው ይመልሱ · You answer out loud', text: 'ማይኩን ይንኩና በእንግሊዝኛ ይናገሩ። Tap the mic and speak English.' },
          { title: 'ሲቸገሩ እርዳታ · Help when you’re stuck', text: 'በዝግታ ይስሙ፣ ምን ማለት እንደሚችሉ ይዩ፣ ወይም ይጻፉ። Hear it slowly, see what to say, or type.' },
        ]
      : [
          { title: 'Walia calls you', text: 'He speaks real Amharic, with captions you can read along.' },
          { title: 'You answer out loud', text: 'Tap the mic and talk, just like with family on the phone.' },
          { title: 'Help when you’re stuck', text: 'Hear it slowly, see what you could say, or type instead.' },
        ],
    floats: en ? ['Hello!', 'How are you?', 'I’m fine, and you?'] : null,
    incoming: both('Incoming call…', 'ጥሪ እየመጣ ነው…'),
    missed: both('Missed call', 'ያመለጠ ጥሪ'),
    decline: en ? 'አትቀበል' : 'Decline',
    accept: en ? 'ተቀበል' : 'Answer',
    callBack: en ? 'መልሰህ ደውል' : 'Call back',
    talkToMe: both('Walia should talk to me', 'ዋሊያ እንዲያናግረኝ'),
    asMan: both('As a man', 'እንደ ወንድ'),
    asWoman: both('As a woman', 'እንደ ሴት'),
    signUpTip: both('Sign up free to answer', 'ለመመለስ በነፃ ይመዝገቡ'),
    gateTitle: both('Make a free account to call Walia', 'ለዋሊያ ለመደወል በነፃ ይመዝገቡ'),
    gateText: en
      ? 'ጥሪዎቹ እውነተኛ የድምፅ ማወቂያ ይጠቀማሉ፣ ስለዚህ መለያ ያስፈልጋል። ነፃ ነው። Calls use real speech recognition, so they’re for learners with an account. It’s free.'
      : 'Calls use real speech recognition, so they’re for learners with an account. It’s free and takes a minute.',
    signUp: both('Sign up', 'ይመዝገቡ'),
    logIn: both('Log in', 'ይግቡ'),
    loading: both('Getting Walia on the line…', 'ዋሊያን እየደወልን ነው…'),
    genderTitle: en ? 'ዋሊያ በአማርኛ ሲያብራራ እንዴት ያናግርዎ? · How should Walia talk to you?' : 'How should Walia talk to you?',
    genderNote: en
      ? 'የአማርኛ ትርጉሞችና ማብራሪያዎች ለወንድና ለሴት ይለያያሉ። The Amharic help changes for a man or a woman.'
      : 'Amharic changes with who you’re talking to, so Walia asks a man and a woman differently.',
    genderLabel: (g: Gender) =>
      en ? (g === 'm' ? 'እንደ ወንድ አናግረኝ · Talk to me as a man' : 'እንደ ሴት አናግሪኝ · Talk to me as a woman') : g === 'm' ? 'Talk to me as a man' : 'Talk to me as a woman',
    pickTitle: both('Pick a call', 'ጥሪ ይምረጡ'),
    pickNote: en
      ? 'እያንዳንዱ ጥሪ ጥቂት ደቂቃዎች ነው። ከጀማሪ ጀምረው ወደ ላይ ይሂዱ። Each call is a few minutes long. Start with Beginner and work your way up.'
      : 'Each call is a few minutes long. Start with Beginner and work your way up.',
    levelLabel: (id: Level, label: string) =>
      en ? `${{ beginner: 'ጀማሪ', intermediate: 'መካከለኛ', advanced: 'የላቀ' }[id]} · ${label}` : label,
    levelBlurb: (id: Level, blurb: string) =>
      en
        ? {
            beginner: 'አጭር ጥያቄዎች፣ ቀላል መልሶች። Short questions with simple answers. Start here.',
            intermediate: 'የዕለት ተዕለት ሁኔታዎች፦ ሰው መተዋወቅ፣ ምግብ ቤት፣ አከራይ፣ መንገድ፣ ገበያ፣ ስልክ። Everyday situations: meeting people, restaurants, your landlord, directions, the market, phone calls.',
            advanced: 'ስለ ሕይወትዎ ክፍት ጥያቄዎች። በሙሉ ዓረፍተ ነገር ይመልሱ። Open questions about your life. Answer in full sentences.',
          }[id]
        : blurb,
    finishedLevel: (label: string) => both(`You’ve finished every ${label} call.`, 'የዚህን ደረጃ ጥሪዎች በሙሉ ጨርሰዋል።'),
    tryNext: (label: string) => both(`Try ${label}`, 'ቀጣዩን ይሞክሩ'),
    done: (best: number, total: number) => both(`Done · ${best}/${total} on your own`, `ተጠናቋል · ${best}/${total}`),
    questions: (n: number) => both(`${n} questions`, `${n} ጥያቄዎች`),
    minutes: (n: number) => both(`about ${n} min`, `${n} ደቂቃ ያህል`),
    call: en ? 'ደውል' : 'Call',
  };
}

type PageText = ReturnType<typeof pageText>;

// The icons beside the three steps.
const STEP_ICONS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" fill="currentColor" />
        <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" />
        <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
      </svg>
    ),
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
      </svg>
    ),
  },
];

/** The phone in the hero, ringing with Walia's call. */
function RingingPhone({
  gender,
  onAnswer,
  asking,
  onPick,
  tip,
  first,
  t,
}: {
  first: Conversation;
  t: PageText;
  gender: Gender | null;
  onAnswer: () => void;
  /** Answered before choosing ነህ / ነሽ: the screen asks how Walia should talk. */
  asking: boolean;
  onPick: (g: Gender) => void;
  /** Shown on the screen when the call can't be answered yet. */
  tip: string | null;
}) {
  const [declined, setDeclined] = useState(false);
  return (
    <div className="talk-stage">
      <div className="talk-stage-glow" aria-hidden />

      {/* bits of the conversation floating round the phone */}
      <span className="talk-float talk-float-1" lang={t.en ? 'en' : 'am'} aria-hidden>
        {t.floats ? t.floats[0] : 'ሰላም!'}
      </span>
      <span className="talk-float talk-float-2" lang={t.en ? 'en' : 'am'} aria-hidden>
        {t.floats ? t.floats[1] : gender === 'f' ? 'እንዴት ነሽ?' : 'እንዴት ነህ?'}
      </span>
      <span className="talk-float talk-float-3 you" lang={t.en ? 'en' : 'am'} aria-hidden>
        {t.floats ? t.floats[2] : 'ደህና ነኝ፣ አንተስ?'}
      </span>

      <div className={`talk-phone${declined ? ' quiet' : ''}`}>
        <span className="talk-phone-btn talk-phone-btn-1" aria-hidden />
        <span className="talk-phone-btn talk-phone-btn-2" aria-hidden />
        <span className="talk-phone-btn talk-phone-btn-3" aria-hidden />
        <div className="talk-screen">
          <div className="talk-status" aria-hidden>
            <span>9:41</span>
            <span className="talk-notch" />
            <span className="talk-status-icons">
              <i />
              <i />
              <i />
              <b />
            </span>
          </div>

          <p className="talk-incoming">{declined ? t.missed : t.incoming}</p>

          <div className="talk-avatar">
            {!declined && (
              <>
                <span className="talk-ring" aria-hidden />
                <span className="talk-ring talk-ring-2" aria-hidden />
              </>
            )}
            <div className="talk-avatar-face">
              <Mascot pose="wave" size={100} animated={!declined} />
            </div>
          </div>

          <p className="talk-caller">Walia</p>
          <p className="talk-caller-sub">
            <span lang="am">ዋልያ</span> · {first.title}
          </p>

          {asking ? (
            <div className="talk-screen-ask" role="group" aria-label="How should Walia talk to you?">
              <span>{t.talkToMe}</span>
              {(['m', 'f'] as Gender[]).map(g => (
                <button key={g} type="button" onClick={() => onPick(g)}>
                  {g === 'm' ? t.asMan : t.asWoman} <b lang="am">{g === 'm' ? 'ነህ' : 'ነሽ'}</b>
                </button>
              ))}
            </div>
          ) : (
          <div className="talk-answer-row">
            <div className="talk-answer">
              <button
                type="button"
                className="talk-round decline"
                onClick={() => setDeclined(true)}
                aria-label="Decline"
                disabled={declined}
              >
                <HangUpIcon />
              </button>
              <span>{t.decline}</span>
            </div>
            <div className="talk-answer">
              <button
                type="button"
                className={`talk-round accept${declined ? '' : ' ringing'}`}
                onClick={() => {
                  setDeclined(false);
                  onAnswer();
                }}
                aria-label={declined ? 'Call Walia back' : 'Answer Walia’s call'}
              >
                <PhoneIcon size={28} />
              </button>
              <span>{declined ? t.callBack : t.accept}</span>
            </div>
          </div>
          )}

          {tip && <p className="talk-screen-tip">{tip}</p>}
          <span className="talk-home-bar" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export default function TalkPage() {
  const { enabled, loading, user } = useAuth();
  // English learners call Walia in English; everyone else in Amharic.
  const profile = useProfile();
  const track: Track = profile?.track ?? 'amharic';
  const conversations = conversationsFor(track);
  const t = pageText(track);
  const [gender, setGender] = useState<Gender | null>(null);
  const [calling, setCalling] = useState<Conversation | null>(null);
  // Calling before choosing ነህ / ነሽ asks right where the call was made.
  const climb = useClimb();
  // Until the learner picks a tab, open on the first level with a call they haven't finished.
  const [picked, setPicked] = useState<Level | null>(null);
  const levelDone = (id: Level) =>
    conversations.filter(c => c.level === id).every(c => callBest(climb, c.slug) !== null);
  // Only levels with calls get a tab.
  const levels = LEVELS.filter(l => conversations.some(c => c.level === l.id));
  const level = picked ?? levels.find(l => !levelDone(l.id))?.id ?? levels[levels.length - 1]?.id ?? 'advanced';
  const nextLevel = levels[levels.findIndex(l => l.id === level) + 1];
  const [asking, setAsking] = useState<Conversation | null>(null);
  const [askingOnPhone, setAskingOnPhone] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GENDER_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from storage after hydration
      if (saved === 'm' || saved === 'f') setGender(saved);
    } catch {
      // storage blocked: just ask each time
    }
  }, []);

  function pickGender(g: Gender) {
    setGender(g);
    try {
      localStorage.setItem(GENDER_KEY, g);
    } catch {
      // fine
    }
  }

  const signedOut = enabled && !user;

  // Answering the phone in the hero calls the first conversation (an account comes first).
  function answer() {
    if (signedOut) {
      document.getElementById('talk-gate')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!gender) {
      setAsking(null);
      setAskingOnPhone(true);
      return;
    }
    setCalling(conversations[0]);
  }

  function pickAndCall(g: Gender, c: Conversation) {
    pickGender(g);
    setAsking(null);
    setAskingOnPhone(false);
    setCalling(c);
  }

  return (
    <main className="section talk-page">
      <div className="container talk-container">
        <Link href={`/courses?track=${track}`} className="back-link">
          ← {t.back}
        </Link>
        <header className="talk-hero">
          <div className="talk-hero-text">
            <span className="talk-kicker">
              {t.en ? t.kicker : <><span lang="am">ጨዋታ</span> · {t.kicker}</>}
            </span>
            <h1 className="talk-title">
              Talk with <span>Walia</span>
            </h1>
            <p className="talk-lede">{t.lede}</p>
            <ol className="talk-steps">
              {t.steps.map((s, i) => (
                <li key={s.title} className={`talk-step talk-step-${i + 1}`}>
                  <span className="talk-step-icon">{STEP_ICONS[i].icon}</span>
                  <span>
                    <strong>{s.title}</strong>
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <RingingPhone
            gender={gender}
            onAnswer={answer}
            asking={askingOnPhone && !gender && !signedOut}
            onPick={g => pickAndCall(g, conversations[0])}
            tip={signedOut ? t.signUpTip : null}
            first={conversations[0]}
            t={t}
          />
        </header>

        {signedOut ? (
          <div className="talk-gate" id="talk-gate">
            {loading ? (
              <p className="muted">{t.loading}</p>
            ) : (
              <>
                <div className="talk-gate-walia" aria-hidden>
                  <Mascot pose="cheer" size={90} animated />
                </div>
                <div className="talk-gate-text">
                  <h2>{t.gateTitle}</h2>
                  <p>{t.gateText}</p>
                  <div className="talk-gate-actions">
                    <Link href="/signup?next=%2Ftalk" className="btn">
                      {t.signUp}
                    </Link>
                    <Link href="/login?next=%2Ftalk" className="btn btn-secondary">
                      {t.logIn}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <section className="talk-setup" aria-labelledby="talk-gender">
              <div className="talk-section-head">
                <span className="talk-num">1</span>
                <div>
                  <h2 id="talk-gender" className="talk-h2">
                    {t.genderTitle}
                  </h2>
                  <p className="talk-note">{t.genderNote}</p>
                </div>
              </div>
              <div className="talk-gender" role="radiogroup" aria-labelledby="talk-gender">
                {(['m', 'f'] as Gender[]).map(g => (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={gender === g}
                    className={`talk-gender-option talk-gender-${g}${gender === g ? ' on' : ''}`}
                    onClick={() => pickGender(g)}
                  >
                    <span className="talk-gender-ending" lang="am">
                      {g === 'm' ? 'ነህ' : 'ነሽ'}
                    </span>
                    <span className="talk-gender-text">
                      <strong>{t.genderLabel(g)}</strong>
                      <span>
                        Walia asks <b lang="am">{g === 'm' ? 'እንዴት ነህ?' : 'እንዴት ነሽ?'}</b>{' '}
                        <em>{g === 'm' ? 'indet neh?' : 'indet nesh?'}</em>
                      </span>
                    </span>
                    <span className="talk-gender-check" aria-hidden>
                      {gender === g && <CheckIcon />}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section aria-labelledby="talk-beginner">
              <div className="talk-section-head">
                <span className="talk-num">2</span>
                <div>
                  <h2 id="talk-beginner" className="talk-h2">
                    {t.pickTitle}
                  </h2>
                  <p className="talk-note">{t.pickNote}</p>
                </div>
              </div>

              <div className="talk-tabs" role="tablist" aria-label="Difficulty">
                {levels.map(l => (
                  <button
                    key={l.id}
                    type="button"
                    role="tab"
                    id={`talk-tab-${l.id}`}
                    aria-selected={level === l.id}
                    aria-controls="talk-level-panel"
                    className={`talk-tab ${l.id}${level === l.id ? ' on' : ''}`}
                    onClick={() => setPicked(l.id)}
                  >
                    {levelDone(l.id) && <CheckIcon />}
                    {t.levelLabel(l.id, l.label)}
                  </button>
                ))}
              </div>

              <div id="talk-level-panel" role="tabpanel" aria-labelledby={`talk-tab-${level}`} className="talk-level">
                <p className="talk-note">{t.levelBlurb(level, LEVELS.find(l => l.id === level)?.blurb ?? '')}</p>
                {levelDone(level) && nextLevel && (
                  <p className="talk-next">
                    {t.finishedLevel(LEVELS.find(l => l.id === level)?.label ?? '')}{' '}
                    <button type="button" className="talk-next-btn" onClick={() => setPicked(nextLevel.id)}>
                      {t.tryNext(nextLevel.label)}
                    </button>
                  </p>
                )}
                <div className="talk-list">
                  {conversations.filter(c => c.level === level).map(c => (
                    <article key={c.slug} className="talk-card">
                      <div className="talk-card-avatar" aria-hidden>
                        <Mascot pose="wave" size={58} />
                        <span className="talk-online" />
                      </div>
                      <div className="talk-card-text">
                        <h3>
                          {c.title} <span lang="am">{c.amharicTitle}</span>
                        </h3>
                        <p>{c.blurb}</p>
                        <div className="talk-chips">
                          {callBest(climb, c.slug) !== null && (
                            <span className="talk-chip done">
                              <CheckIcon /> {t.done(callBest(climb, c.slug) ?? 0, c.turns.length)}
                            </span>
                          )}
                          <span className="talk-chip">{t.questions(c.turns.length)}</span>
                          <span className="talk-chip">{t.minutes(MINUTES[c.level])}</span>
                        </div>
                      </div>
                      {asking === c && !gender ? (
                        <div className="talk-ask" role="group" aria-label="How should Walia talk to you?">
                          <span>{t.talkToMe}</span>
                          {(['m', 'f'] as Gender[]).map(g => (
                            <button key={g} type="button" className="btn btn-sm btn-secondary" onClick={() => pickAndCall(g, c)}>
                              {g === 'm' ? t.asMan : t.asWoman}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="talk-call-btn"
                          onClick={() => (gender ? setCalling(c) : (setAskingOnPhone(false), setAsking(c)))}
                        >
                          <span className="talk-call-btn-circle">
                            <PhoneIcon size={24} />
                          </span>
                          <span>{t.call}</span>
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>

      {calling && gender && (!enabled || user) && (
        <TalkCall conversation={calling} gender={gender} onEnd={() => setCalling(null)} />
      )}
    </main>
  );
}
