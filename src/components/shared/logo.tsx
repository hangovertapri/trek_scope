import Link from 'next/link';
import { Mountain } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md px-2 py-1">
      <Mountain className="h-6 w-6 text-primary" />
      <span className="font-bold text-lg font-headline text-primary">
        TrekScope
      </span>
    </Link>
  );
}
