import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" className="brand" aria-label="kwanqa home" onClick={onClick}>
      <span className="brand-mark">
        <Image
          src="/brand/walia-logo.png"
          alt=""
          fill
          sizes="44px"
          style={{ objectFit: 'contain' }}
          priority
        />
      </span>
      kwanqa
    </Link>
  );
}
