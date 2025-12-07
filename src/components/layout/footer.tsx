import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';
import Logo from '@/components/shared/logo';

const footerLinks = [
  {
    section: 'Explore',
    links: [
      { label: 'All Treks', href: '/treks' },
      { label: 'Compare Treks', href: '/compare' },
      { label: 'AI Recommender', href: '/recommend' },
    ],
  },
  {
    section: 'Learn',
    links: [
      { label: 'Trek Guides', href: '/docs/permit-reference' },
      { label: 'Safety Tips', href: '/docs/permit-reference#safety' },
      { label: 'Permits & Visas', href: '/docs/permit-reference#permits' },
    ],
  },
  {
    section: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted text-muted-foreground border-t mt-16 md:mt-24">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand section */}
          <div className="col-span-1 lg:col-span-1">
            <div className="inline-block">
              <Logo />
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your ultimate guide to discovering and comparing trekking adventures worldwide.
            </p>
            {/* Social links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer sections */}
          {footerLinks.map((section) => (
            <div key={section.section}>
              <h4 className="font-headline font-semibold text-foreground text-sm uppercase tracking-wide">
                {section.section}
              </h4>
              <ul className="mt-4 space-y-3 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 md:my-12 border-t border-border/50" />

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TrekMapper. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm px-1"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
