'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/context/compare-context';
import { findImage } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Scaling, X } from 'lucide-react';
import AnimateOnScroll from '../shared/animate-on-scroll';

const MAX_COMPARE = 3;

export default function CompareBar() {
  const { compareList, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return null;
  }

  const trekSlugs = compareList.map((t) => t.slug).join(',');
  const compareUrl = `/compare?treks=${trekSlugs}`;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl z-50">
      <AnimateOnScroll className="bg-card/80 backdrop-blur-lg border border-primary/20 rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="font-headline text-lg hidden sm:block">Compare Treks</h3>
          <div className="flex items-center gap-2">
            {compareList.map((trek) => (
              <div key={trek.id} className="relative h-12 w-16 rounded-md overflow-hidden border-2 border-primary/50">
                <Image
                  src={findImage(trek.images[0]).imageUrl}
                  alt={trek.name}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {[...Array(MAX_COMPARE - compareList.length)].map((_, i) => (
              <div key={i} className="h-12 w-16 rounded-md bg-muted/50 border-2 border-dashed flex items-center justify-center">
                <Scaling className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild disabled={compareList.length < 2}>
            <Link href={compareUrl}>
              <Scaling className="mr-2 h-4 w-4" />
              Compare ({compareList.length})
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={clearCompare}>
            <X className="h-5 w-5" />
            <span className="sr-only">Clear comparison</span>
          </Button>
        </div>
      </AnimateOnScroll>
    </div>
  );
}
