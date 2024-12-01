import Link from 'next/link';

import { Nabla } from 'next/font/google';

const nabla = Nabla({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
});

function Logo({ className }) {
  return (
    <Link href='/' className={`${nabla.className} flex items-center gap-2 z-10 ${className}`}>
      <span className='text-3xl'>WEflance</span>
    </Link>
  );
}

export default Logo;
