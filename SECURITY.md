# Security

Found a security problem in kwanqa? Thank you for looking out for our learners.

Please email **kwanqa.team@gmail.com** with what you found and how to reproduce it.
Don't open a public GitHub issue for security problems, and please don't access other
people's data while testing.

We'll reply within a few days and keep you posted while we fix it.

## How kwanqa protects learners

- **Database:** every table has row-level security. Learners can only read and change their own rows, and server-only functions can't be called from the browser.
- **API routes:** AI and speech features need a signed-in learner, check what's sent to them, and have daily limits per learner.
- **Secrets:** API keys live only on the server (Vercel), never in the browser or in Git.
- **Browser:** a strict Content Security Policy and a Permissions Policy that only allows the microphone, for Talk with Walia.
- **Phone app:** asks only for the microphone and, if reminders are on, notifications. Everything else is blocked.
