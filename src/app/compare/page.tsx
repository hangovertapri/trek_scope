'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTrekBySlug, getAllTreks } from '@/lib/data';
import type { Trek } from '@/lib/types';
import CompareBar from '@/components/trek/compare-bar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { findImage } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ComparePageContent() {
  const searchParams = useSearchParams();
  const trekSlugs = searchParams.get('treks')?.split(',') || [];
  const treksToCompare: Trek[] = trekSlugs
    .map((slug) => getTrekBySlug(slug))
    .filter((trek): trek is Trek => !!trek);

  const features = [
    { key: 'region', label: 'Region' },
    { key: 'difficulty', label: 'Difficulty' },
    { key: 'duration', label: 'Duration (days)' },
    { key: 'altitude', label: 'Max Altitude (m)' },
    { key: 'price_range', label: 'Price Range' },
    { key: 'permit_required', label: 'Permit Required' },
    { key: 'best_season', label: 'Best Season' },
  ];

  if (treksToCompare.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-headline font-bold">Compare Treks</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Select up to 3 treks from the treks page to compare them side-by-side.
        </p>
        <Button asChild className="mt-8">
            <Link href="/treks">Explore Treks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary text-center mb-8">
        Trek Comparison
      </h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-1/4 font-bold text-lg p-4">Feature</TableHead>
              {treksToCompare.map((trek) => (
                <TableHead key={trek.id} className="w-1/4 p-4 border-l">
                    <div className="relative w-full h-24 rounded-md overflow-hidden mb-2">
                        <Image src={findImage(trek.images[0]).imageUrl} alt={trek.name} fill className="object-cover" />
                    </div>
                  <Link href={`/treks/${trek.slug}`} className="font-bold text-primary hover:underline text-base">
                    {trek.name}
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <TableRow key={feature.key}>
                <TableCell className="font-semibold p-4">{feature.label}</TableCell>
                {treksToCompare.map((trek) => (
                  <TableCell key={trek.id} className="p-4 border-l">
                    {(() => {
                      const value = trek[feature.key as keyof Trek];
                      if (feature.key === 'price_range' && Array.isArray(value)) {
                        const nums = value as number[];
                        return `${formatCurrency(nums[0])} - ${formatCurrency(nums[1])}`;
                      }
                      if (feature.key === 'permit_required') {
                        return value ? (
                          <Check className="h-5 w-5 text-amber-400" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        );
                      }
                      if (Array.isArray(value)) {
                        return value.join(', ');
                      }
                      return String(value);
    })()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <>
      <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading comparison...</div>}>
        <ComparePageContent />
      </Suspense>
      <CompareBar />
    </>
  );
}

