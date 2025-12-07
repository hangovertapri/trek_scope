'use client';

import { Suspense } from 'react';
import Meta from '@/components/meta';
import TreksContent from '@/components/trek/treks-content';
import { Skeleton } from '@/components/ui/skeleton';

function TreksLoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function TreksPage() {
  return (
    <>
      <Meta title="Explore Treks" description="Browse and filter Nepal treks by region, difficulty and duration." />
      
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Explore Our Treks
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your next adventure from our collection of world-class treks.
          </p>
        </div>

        <Suspense fallback={<TreksLoadingSkeleton />}>
          <TreksContent />
        </Suspense>
      </div>
    </>
  );
}
