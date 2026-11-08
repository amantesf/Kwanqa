// Small icons inside the log-in, sign-up and password fields.
const FIELD_ICONS = {
  person: 'M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.4 0-8 2.2-8 5v1.5h16V19c0-2.8-3.6-5-8-5Z',
  mail: 'M3 5.5h18v13H3v-13Zm2 2.3v.2l7 4.6 7-4.6v-.2H5Z',
  lock: 'M7 10V8a5 5 0 0 1 10 0v2h1.5v11h-13V10H7Zm2 0h6V8a3 3 0 0 0-6 0v2Z',
};

export function FieldIcon({ name }: { name: keyof typeof FIELD_ICONS }) {
  return (
    <svg className="auth-field-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d={FIELD_ICONS[name]} fill="currentColor" />
    </svg>
  );
}

export function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 20 20 4" />}
    </svg>
  );
}
