'use client';

import { useEffect } from 'react';

// Shown only when the whole app breaks, even the layout around a page, so it
// brings its own <html> and plain styles. Progress is saved as you go.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#fff8ef',
          color: '#3a2a1a',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, margin: '0 0 8px' }}>Walia slipped on a rock</h1>
          <p style={{ margin: '0 0 20px', lineHeight: 1.5 }}>
            Something went wrong on our side. Your progress is safe. Try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: 0,
              borderRadius: 14,
              padding: '12px 22px',
              background: '#d2582e',
              color: '#fff',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
