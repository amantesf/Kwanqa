'use client';

import { useEffect, useState } from 'react';

// A tiny global toast: call showToast('...') from anywhere on the client.
type Toast = { id: number; message: string; tone: 'good' | 'bad' };

const listeners = new Set<(toast: Toast) => void>();
let nextId = 1;

export function showToast(message: string, tone: Toast['tone'] = 'good') {
  const toast = { id: nextId++, message, tone };
  listeners.forEach(listener => listener(toast));
}

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const add = (toast: Toast) => {
      setToasts(current => [...current, toast]);
      window.setTimeout(() => setToasts(current => current.filter(t => t.id !== toast.id)), 4500);
    };
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, []);

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.tone}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
