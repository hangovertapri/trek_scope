'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Trek } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { findImage } from '@/lib/placeholder-images';
import {
  Mountain,
  Clock,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompare } from '@/context/compare-context';

interface TrekCardProps {
  trek: Trek;
  className?: string;
}

const difficultyColors = {
  Easy: 'bg-green-800/20 text-green-300 border-green-500/30',
  Moderate: 'bg-yellow-800/20 text-yellow-300 border-yellow-500/30',
  Challenging: 'bg-orange-800/20 text-orange-300 border-orange-500/30',
  Expert: 'bg-red-800/20 text-red-300 border-red-500/30',
};

export default function TrekCard({
  trek,
  className,
}: TrekCardProps) {
  const { toggleCompare, isComparing } = useCompare();
  const comparing = isComparing(trek.id);

  const trekImage = findImage(trek.images[0]);
  const difficultyColor =
    difficultyColors[trek.difficulty] || 'bg-gray-800/20 text-gray-300';

  return (
    <Card
      className={cn(
        'group overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20',
        comparing ? 'border-primary/80 shadow-primary/20' : 'hover:border-primary/50',
        className
      )}
    >
      <div className="relative">
        <Link href={`/treks/${trek.slug}`} className="block">
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={trekImage.imageUrl}
              alt={trekImage.description}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={trekImage.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          </div>
        </Link>
      </div>
      <CardHeader className="relative -mt-12 z-10 p-4">
        <CardTitle className="text-xl font-headline leading-tight text-white drop-shadow-md">
          <Link
            href={`/treks/${trek.slug}`}
            className="hover:text-primary transition-colors"
          >
            {trek.name}
          </Link>
        </CardTitle>
        <CardDescription className="text-gray-300 drop-shadow-sm">
          {trek.region}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-2 p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            variant="outline"
            className={cn(
              'border transition-transform duration-300',
              difficultyColor
            )}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-1 transition-transform duration-300 group-hover:animate-pulse" />
            {trek.difficulty}
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3.5 h-3.5 mr-1 transition-transform duration-300 group-hover:animate-spin-slow" />
            {trek.duration} days
          </Badge>
          <Badge variant="outline">
            <Mountain className="w-3.5 h-3.5 mr-1 transition-transform duration-300 group-hover:animate-bounce" />
            {trek.altitude}m
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {trek.overview}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <Button asChild size="sm" variant="outline" className="transition-transform duration-300 group-hover:translate-x-1">
          <Link href={`/treks/${trek.slug}`}>
            View Details{' '}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>
        <Button onClick={() => toggleCompare(trek)} variant={comparing ? 'default' : 'secondary'} size="sm">
           {comparing ? (
             <CheckCircle className="mr-2" />
           ) : (
             <PlusCircle className="mr-2" />
           )}
           {comparing ? 'Selected' : 'Compare'}
         </Button>
      </CardFooter>
    </Card>
  );
}