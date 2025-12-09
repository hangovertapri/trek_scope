'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCompare } from '@/context/compare-context';
import { findImage } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Scaling, X } from 'lucide-react';

const MAX_COMPARE = 3;

export default function CompareBar() {
  const { compareList, clearCompare } = useCompare();

  if (compareList.length === 0) {
    return null;
  }

  const trekSlugs = compareList.map((t) => t.slug).join(',');
  const compareUrl = `/compare?treks=${trekSlugs}`;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-40">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-t border-amber-500/40 rounded-t-xl p-3 flex flex-col items-center gap-2 backdrop-blur-xl relative overflow-hidden bg-opacity-85">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none rounded-t-xl"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full flex flex-col items-center gap-2">
          <h3 className="font-headline text-xs font-bold text-white tracking-wide">
            Compare Treks
          </h3>
          
          <div className="flex items-center gap-2 w-full justify-center">
            {compareList.map((trek) => (
              <div key={trek.id} className="relative h-10 w-12 rounded-lg overflow-hidden border-2 border-amber-500/60 shadow-lg hover:shadow-amber-500/20 transition-all duration-300">
                <Image
                  src={findImage(trek.images[0]).imageUrl}
                  alt={trek.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            ))}
            {[...Array(MAX_COMPARE - compareList.length)].map((_, i) => (
              <div key={i} className="h-10 w-12 rounded-lg bg-slate-700/30 border-2 border-dashed border-slate-500/50 flex items-center justify-center hover:border-slate-400/50 transition-all duration-300">
                <Scaling className="h-3 w-3 text-slate-400" />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 w-full justify-center">
            <Button 
              asChild 
              disabled={compareList.length < 2} 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg px-3 py-1 text-xs shadow-lg hover:shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link href={compareUrl} className="flex items-center">
                <Scaling className="mr-1 h-3 w-3" />
                Compare
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearCompare} 
              className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear comparison</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
