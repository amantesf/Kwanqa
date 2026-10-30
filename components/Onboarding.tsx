'use client';

import { useState, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Flag from '@/components/Flag';
import Mascot from '@/components/Mascot';
import { startCamp } from '@/lib/climb';
import type { Track } from '@/lib/courses';
import { readProfile, saveProfile, type Profile } from '@/lib/profile';
import { supabase } from '@/lib/supabase';

type Answers = {
  track?: Track;
  speaks: string[];
  level?: Profile['level'];
  reasons: string[];
  heardFrom: string[];
  dailyMinutes?: number;
};

type Option = { value: string; label: string; sub?: string; icon?: ReactNode; soon?: boolean };

const LANGUAGE_NAME: Record<Track, string> = { amharic: 'Amharic', english: 'English' };

function Bars({ filled }: { filled: number }) {
  return (
    <svg width="28" height="24" viewBox="0 0 28 24" aria-hidden>
      {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
          x={i * 7}
          y={18 - i * 5}
          width="5"
          height={6 + i * 5}
          rx="2"
          fill={i < filled ? 'var(--primary)' : 'var(--border)'}
        />
      ))}
    </svg>
  );
}

const emoji = (e: string) => <span className="onb-emoji">{e}</span>;

export default function Onboarding() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const preset = params.get('track');
  const [answers, setAnswers] = useState<Answers>({
    track: preset === 'amharic' || preset === 'english' ? preset : undefined,
    speaks: [],
    reasons: [],
    heardFrom: [],
  });
  const [step, setStep] = useState(0);

  const lang = answers.track ? LANGUAGE_NAME[answers.track] : 'the language';

  const steps: {
    key: keyof Answers;
    question: string;
    multi?: boolean;
    options: Option[];
  }[] = [
    {
      key: 'track',
      question: 'What would you like to learn?',
      options: [
        { value: 'amharic', label: 'Amharic', sub: 'አማርኛ', icon: <Flag name="ethiopia" className="onb-flag" /> },
        { value: 'english', label: 'English', sub: 'እንግሊዝኛ', icon: <Flag name="usa" className="onb-flag" /> },
        { value: 'oromo', label: 'Afaan Oromoo', sub: 'Oromo', icon: <Flag name="oromia" className="onb-flag" />, soon: true },
        { value: 'tigrinya', label: 'Tigrinya', sub: 'ትግርኛ', icon: <Flag name="tigray" className="onb-flag" />, soon: true },
      ],
    },
    {
      key: 'speaks',
      question: 'Which languages do you already speak?',
      multi: true,
      options: [
        { value: 'english', label: 'English' },
        { value: 'amharic', label: 'Amharic', sub: 'አማርኛ' },
        { value: 'oromo', label: 'Afaan Oromo' },
        { value: 'tigrinya', label: 'Tigrinya', sub: 'ትግርኛ' },
        { value: 'other', label: 'Something else' },
      ],
    },
    {
      key: 'level',
      question: `How much ${lang} do you know?`,
      options: [
        { value: 'new', label: `I’m new to ${lang}`, icon: <Bars filled={1} /> },
        { value: 'some-words', label: 'I know some common words', icon: <Bars filled={2} /> },
        { value: 'basic', label: 'I can have basic conversations', icon: <Bars filled={3} /> },
        { value: 'conversational', label: 'I can talk about most topics', icon: <Bars filled={4} /> },
      ],
    },
    {
      key: 'reasons',
      question: `Why are you learning ${lang}?`,
      multi: true,
      options: [
        { value: 'family', label: 'Talk with family', icon: emoji('👨‍👩‍👧') },
        { value: 'heritage', label: 'Connect with my heritage', icon: emoji('☕') },
        { value: 'travel', label: 'Travel to Ethiopia', icon: emoji('✈️') },
        { value: 'work', label: 'Work or school', icon: emoji('💼') },
        { value: 'fun', label: 'Just for fun', icon: emoji('🎉') },
        { value: 'other', label: 'Something else', icon: emoji('💬') },
      ],
    },
    {
      key: 'heardFrom',
      question: 'How did you hear about kwanqa?',
      multi: true,
      options: [
        { value: 'friends', label: 'Friends or family', icon: emoji('🤝') },
        { value: 'community', label: 'Church or community', icon: emoji('⛪') },
        { value: 'social', label: 'Social media', sub: 'TikTok, Instagram, Telegram…', icon: emoji('📱') },
        { value: 'search', label: 'Search engine', icon: emoji('🔎') },
        { value: 'other', label: 'Somewhere else', icon: emoji('✨') },
      ],
    },
    {
      key: 'dailyMinutes',
      question: 'What’s your daily learning goal?',
      options: [
        { value: '5', label: 'A stroll', sub: '5 min / day' },
        { value: '10', label: 'A hike', sub: '10 min / day' },
        { value: '15', label: 'A climb', sub: '15 min / day' },
        { value: '20', label: 'Summit push', sub: '20 min / day' },
      ],
    },
  ];

  const done = step >= steps.length;
  const placedAt = startCamp(answers.track ?? 'amharic', answers.level);
  const current = steps[Math.min(step, steps.length - 1)];
  const progress = Math.min(step, steps.length) / steps.length;

  function isSelected(value: string) {
    const v = answers[current.key];
    if (Array.isArray(v)) return v.includes(value);
    return String(v ?? '') === value;
  }

  function choose(value: string) {
    setAnswers(prev => {
      if (current.multi) {
        const key = current.key as 'speaks' | 'reasons' | 'heardFrom';
        const list = prev[key].includes(value)
          ? prev[key].filter(v => v !== value)
          : [...prev[key], value];
        return { ...prev, [key]: list };
      }
      const parsed = current.key === 'dailyMinutes' ? Number(value) : value;
      return { ...prev, [current.key]: parsed };
    });
  }

  const answer = answers[current.key];
  const answered = Array.isArray(answer) ? answer.length > 0 : answer !== undefined;

  function finish() {
    const track = answers.track ?? 'amharic';
    const before = readProfile();
    const earlier = before?.tracks ?? [];
    const level = answers.level ?? 'new';
    const profile: Profile = {
      track,
      tracks: earlier.includes(track) ? earlier : [...earlier, track],
      speaks: answers.speaks,
      level,
      levels: { ...before?.levels, [track]: level },
      reasons: answers.reasons,
      heardFrom: answers.heardFrom,
      dailyMinutes: answers.dailyMinutes ?? 10,
      completedAt: new Date().toISOString(),
    };
    saveProfile(profile);
    if (user) supabase?.auth.updateUser({ data: { onboarding: profile } }); // retaking it while logged in
    router.push(`/courses?track=${profile.track}`);
  }

  return (
    <div className="onboarding">
      <div className="onb-top">
        <button
          type="button"
          className="onb-back"
          onClick={() => (step === 0 ? router.push('/') : setStep(s => s - 1))}
          aria-label="Back"
        >
          ←
        </button>
        <div className="meter onb-meter" aria-label={`Step ${Math.min(step + 1, steps.length)} of ${steps.length}`}>
          <span style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {done ? (
        <div className="onb-body onb-done">
          <Mascot pose="cheer" size={150} className="floaty" />
          <h1 className="h2" style={{ color: 'var(--text-strong)' }}>
            You’re all set!
          </h1>
          <p className="lead">
            Learning <strong>{lang}</strong> · <strong>{answers.dailyMinutes ?? 10} min</strong> a day.{' '}
            {placedAt > 0
              ? `You already know some ${lang}, so you’ll start at Camp ${placedAt + 1}. The camps below stay open for review.`
              : 'Your trail is ready. Let’s take the first step.'}
          </p>
        </div>
      ) : (
        <div className="onb-body" key={current.key}>
          <div className="onb-ask">
            <Mascot pose="wave" size={96} />
            <div className="onb-bubble">{current.question}</div>
          </div>
          {current.multi && <p className="faint small onb-hint">Choose all that apply</p>}
          <div
            className={`onb-options${current.key === 'track' ? ' onb-cards' : current.options.length > 4 ? ' many' : ''}`}
          >
            {current.options.map(option => (
              <button
                key={option.value}
                type="button"
                className={`onb-option${isSelected(option.value) ? ' selected' : ''}${option.soon ? ' soon' : ''}`}
                onClick={() => choose(option.value)}
                aria-pressed={isSelected(option.value)}
                disabled={option.soon}
              >
                {option.icon && <span className="onb-icon">{option.icon}</span>}
                <span className="onb-label">
                  {option.label}
                  {option.sub && <small>{option.sub}</small>}
                </span>
                {option.soon && <span className="onb-soon">Coming soon</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="onb-footer">
        {done ? (
          <button type="button" className="btn onb-continue" onClick={finish}>
            Start climbing
          </button>
        ) : (
          <button
            type="button"
            className="btn onb-continue"
            disabled={!answered}
            onClick={() => setStep(s => s + 1)}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
