import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { CompareProvider } from '@/context/compare-context';
import { AuthProvider } from '@/components/auth-provider';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'TrekMapper - Compare Your Next Adventure',
  description:
    'An interactive trekking comparison website to help you find, compare, and plan your next adventure in Nepal and around the globe.',
  openGraph: {
    title: 'TrekMapper - Compare Your Next Adventure',
    description: 'Find and compare the best treks for your next journey.',
    type: 'website',
    url: 'https://trekmapper.example.com', // Replace with actual URL
    images: [
      {
        url: 'https://trekmapper.example.com/og-image.jpg', // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: 'TrekMapper Logo and scenic mountain background',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased min-h-screen flex flex-col bg-background text-foreground'
        )}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CompareProvider>
            <Header />
            <main id="main-content" className="flex-grow" role="main">
              {children}
            </main>
            <Toaster />
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
