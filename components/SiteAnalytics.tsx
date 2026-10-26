'use client';

// Visitor numbers with Vercel Web Analytics: page views, countries, devices and
// where visitors came from. No cookies, and nothing that identifies a learner.
//
// Lesson pages carry the lesson in the query (?lesson=2&practice=1), which the
// dashboard doesn't show, so they're reported as readable paths instead, like
// /courses/amharic-beginner-1/lesson-3/practice. Finishing a lesson or a review
// is reported as a visit to /done/…, so the Pages list shows how far learners
// get (custom events need a paid plan; these work on the free one).

import { Analytics, type BeforeSendEvent } from '@vercel/analytics/next';
import { pageview } from '@vercel/analytics';

function readablePath(event: BeforeSendEvent): BeforeSendEvent | null {
  try {
    const url = new URL(event.url);
    // Never send links from emails (unsubscribe, password reset) with their tokens.
    for (const key of ['token', 'code', 'token_hash', 'email']) url.searchParams.delete(key);
    const lesson = url.searchParams.get('lesson');
    if (url.pathname.startsWith('/courses/') && lesson !== null) {
      const n = Number(lesson);
      if (Number.isInteger(n) && n >= 0) {
        url.pathname += `/lesson-${n + 1}${url.searchParams.get('practice') === '1' ? '/practice' : ''}`;
      }
      url.searchParams.delete('lesson');
      url.searchParams.delete('practice');
    }
    if (url.pathname.startsWith('/courses/') && url.searchParams.get('review') === '1') {
      url.pathname += '/review';
      url.searchParams.delete('review');
    }
    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}

export default function SiteAnalytics() {
  return <Analytics beforeSend={readablePath} />;
}

/** Counts a finished lesson (or mistakes review) as a visit to /done/<camp>/<lesson>. */
export function countFinished(slug: string, lesson: number | 'review') {
  try {
    pageview({ path: `/done/${slug}/${lesson === 'review' ? 'review' : `lesson-${lesson + 1}`}` });
  } catch {
    // analytics blocked or not loaded: nothing to do
  }
}
