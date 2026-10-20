import type { Metadata } from 'next';
import { PageHero } from '@/components/sections';

export const metadata: Metadata = { title: 'Privacy policy' };

const CONTACT = 'kwanqa.team@gmail.com';
const UPDATED = 'October 16, 2026';

// Plain-language privacy policy. Keep it in step with what the site actually
// collects, and have it reviewed by a lawyer before a public launch.
export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        kicker="Legal"
        title="Privacy policy"
        lead={`How kwanqa collects, uses, and protects your information. Last updated ${UPDATED}.`}
        pose="happy"
      />
      <section className="section">
        <div className="container">
          <article className="prose legal">
            <p>
              kwanqa (“we”, “us”) helps people learn Amharic and English. We collect only what we
              need to run your lessons and save your progress. We don’t sell your information, and
              we don’t show ads.
            </p>

            <h2>What we collect</h2>
            <ul>
              <li>
                <strong>Account details:</strong> your name and email address. If you sign up with
                an email and password, your password is stored securely by our login provider as a
                scrambled (hashed) value, so we never see it. If you continue with Google, Google shares
                your name, email address, and profile picture with us.
              </li>
              <li>
                <strong>Your “Get started” answers:</strong> the language you want to learn, the
                languages you speak, your level, why you’re learning, how you heard about kwanqa,
                and your daily goal.
              </li>
              <li>
                <strong>Learning progress:</strong> lessons completed, grass earned, your streak,
                and a daily log of lessons, answers, and minutes practiced. We also save your time zone,
                so reminders arrive at the right hour.
              </li>
              <li>
                <strong>Technical information:</strong> like most websites, our hosting provider
                keeps basic logs (such as IP address and browser type) to keep the site secure and
                working.
              </li>
            </ul>

            <h2>Information stored on your device</h2>
            <p>
              We save your progress and survey answers in your browser so you can learn before
              creating an account, and to keep you logged in. We don’t use advertising or tracking
              cookies. When you log out, kwanqa clears your progress and answers from that device
              (they stay saved in your account).
            </p>

            <h2>How we use your information</h2>
            <ul>
              <li>To run your lessons, save your progress, and keep it in sync across devices.</li>
              <li>To send account emails, such as confirming your email or resetting your password.</li>
              <li>
                To send a streak reminder email at 7 pm your time when your streak is about to end.
                You can turn these off on your profile or with the link in any reminder.
              </li>
              <li>
                To send a greeting email on Ethiopian holidays, such as Enkutatash, Meskel, Genna,
                Timket, and Fasika. These have their own switch on your profile and their own
                unsubscribe link.
              </li>
              <li>To understand, in general terms, who is learning and why, so we can improve our courses.</li>
              <li>To keep kwanqa secure and prevent misuse.</li>
            </ul>

            <h2>Who we share it with</h2>
            <p>
              We use a few trusted services to run kwanqa. They handle your information only to
              provide their service to us:
            </p>
            <ul>
              <li><strong>Supabase:</strong> accounts, login, and saving your progress (hosted in the United States).</li>
              <li><strong>Vercel:</strong> hosts the kwanqa website.</li>
              <li><strong>Resend:</strong> sends our account and reminder emails.</li>
              <li><strong>Google:</strong> only if you choose “Continue with Google”.</li>
              <li><strong>Cloudflare:</strong> manages our domain name.</li>
            </ul>
            <p>
              We don’t sell or rent your information, and we don’t share it with advertisers. We
              may disclose information if required by law.
            </p>

            <h2>How long we keep it</h2>
            <p>
              We keep your account and progress for as long as your account exists. If you ask us
              to delete your account, we delete your account and progress, except where we must
              keep something to comply with the law.
            </p>

            <h2>Your choices and rights</h2>
            <ul>
              <li><strong>See or correct your information:</strong> your name, answers, and progress are on your profile page, and you can change your name there.</li>
              <li><strong>Retake the survey</strong> at any time from your profile.</li>
              <li><strong>Turn off reminder or holiday emails</strong> on your profile, or with the link in any of those emails.</li>
              <li><strong>Delete your account</strong> at any time from your profile page (Account → Delete account). It deletes your account and progress right away.</li>
              <li><strong>Get a copy of your information</strong> by emailing us.</li>
            </ul>

            <h2>Children</h2>
            <p>
              kwanqa is made for families, but children under 13 should use it with a parent or
              guardian. If you believe a child under 13 has given us personal information without a
              parent’s consent, contact us and we’ll delete it.
            </p>

            <h2>Security</h2>
            <p>
              Everything on kwanqa is sent over encrypted connections (HTTPS). Passwords are
              hashed, and our database rules only let each learner read and change their own
              progress. No system is perfectly secure, but we work to protect your information.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              If we change this policy, we’ll update the date at the top. For important changes,
              we’ll let you know on the site or by email.
            </p>

            <h2>Contact us</h2>
            <p>
              Questions or requests? Email us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
