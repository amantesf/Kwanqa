import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Learn',
    links: [
      { href: '/courses', label: 'All courses' },
      { href: '/courses?track=amharic', label: 'Learn Amharic' },
      { href: '/courses?track=english', label: 'Learn English' },
    ],
  },
  {
    title: 'About us',
    links: [
      { href: '/about', label: 'Our story' },
      { href: '/values', label: 'Values' },
    ],
  },
  {
    title: 'Method',
    links: [
      { href: '/approach', label: 'Our approach' },
      { href: '/about#reviews', label: 'Reviews' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              kwanqa
            </Link>
            <p>
              The fun way to learn Amharic and English—built for Ethiopian families and
              the diaspora.
            </p>
          </div>
          {FOOTER_COLUMNS.map(col => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} kwanqa. All rights reserved.</span>
          <span>Made with care for Ethiopia and the diaspora.</span>
        </div>
      </div>
    </footer>
  );
}
