'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/logo';
import { MobileNav } from './mobile-nav';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import { LogOut, Bookmark } from 'lucide-react';

const navLinksList = [
  { href: '/', label: 'Home' },
  { href: '/treks', label: 'Treks' },
  { href: '/compare', label: 'Compare' },
  { href: '/recommend', label: 'Recommend' },
];

function NavLinks() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium ml-10" role="navigation" aria-label="Main navigation">
      {navLinksList.map(({ href, label }, index) => {
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href}
            className={cn(
              'px-3 py-2 rounded-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isActive
                ? 'text-foreground bg-accent/10 font-semibold'
                : 'text-foreground/70 hover:text-foreground hover:bg-accent/5',
              isClient && 'animate-fade-in'
            )}
            style={{ animationDelay: isClient ? `${150 * (index + 1)}ms` : undefined }}
            aria-current={isActive ? 'page' : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}


export default function Header() {
  const [isClient, setIsClient] = useState(false);
  const session = useSession();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content"
        className="absolute top-0 left-0 -translate-y-full focus:translate-y-0 bg-primary text-primary-foreground px-4 py-2 z-50 rounded-b-md font-medium"
      >
        Skip to main content
      </a>
      
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <NavLinks />
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          {session.status === 'authenticated' && session.data?.user?.role === 'customer' && (
            <Button
              asChild
              variant="outline"
              className="hidden md:inline-flex"
            >
              <Link href="/my-bookings" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                My Bookings
              </Link>
            </Button>
          )}
          
          {session.status === 'authenticated' && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}

          {session.status === 'unauthenticated' && (
            <Button
              asChild
              className={cn(
                'hidden md:inline-flex bg-accent hover:bg-accent/90 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2',
                isClient && 'animate-fade-in'
              )}
              style={{ animationDelay: isClient ? '600ms' : undefined }}
            >
              <Link href="/treks">Explore Treks</Link>
            </Button>
          )}
          
          <MobileNav navLinks={navLinksList} />
        </div>
      </div>
    </header>
  );
}
