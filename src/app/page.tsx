import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, Scaling, MessageSquare } from 'lucide-react';
import TrekCard from '@/components/trek/trek-card';
import HeroSearch from '@/components/trek/hero-search';
import { findImage } from '@/lib/placeholder-images';
import AnimateOnScroll from '@/components/shared/animate-on-scroll';
import Meta from '@/components/meta';
import type { Trek } from '@/lib/types';
import { getAllTreks } from '@/lib/data';

async function getFeaturedTreks(): Promise<Trek[]> {
  try {
    const allTreks = await getAllTreks();
    return allTreks.slice(0, 3); // Get first 3 as featured
  } catch (error) {
    console.error('Failed to fetch featured treks:', error);
    return [];
  }
}

export default async function Home() {
  const featuredTreks = await getFeaturedTreks();
  const heroImage = findImage('hero-home');

  return (
    <>
      <Meta title="Nepal Trekking Guide" description="Compare and plan treks in Nepal — routes, permits, packing, and trip planning." />
      
    <div className="flex flex-col min-h-screen">
      <section className="parallax-container">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="parallax-image"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="parallax-overlay" />
        <div className="parallax-content">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline leading-tight drop-shadow-lg animate-fade-in-up">
            Discover Your Next Summit
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200 drop-shadow-md animate-fade-in-up animation-delay-300">
            Compare breathtaking treks, find your perfect trail, and start your
            adventure.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="animate-slide-in-from-left">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                <Link href="/treks">
                  Explore All Treks <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="animate-slide-in-from-right">
              <Button asChild size="lg" variant="secondary">
                <Link href="/recommend">
                  Get a Recommendation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Search Section */}
      <section className="relative z-10 mb-12 md:mb-16 lg:mb-20 w-full pt-12 md:pt-16 lg:pt-20" aria-label="Search and filter treks">
        <div className="w-full">
          <HeroSearch />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Featured Treks
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              Embark on one of our most popular and breathtaking journeys,
              handpicked for you.
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTreks.map((trek, i) => (
              <AnimateOnScroll
                key={trek.id}
                delay={i * 200}
              >
                <TrekCard trek={trek} />
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll className="text-center mt-12" delay={300}>
            <Button asChild variant="outline">
              <Link href="/treks">View All Treks</Link>
            </Button>
          </AnimateOnScroll>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <AnimateOnScroll className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Your Adventure in 3 Easy Steps
            </h2>
            <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
              Finding your dream trek has never been simpler.
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <AnimateOnScroll delay={100}>
              <Card className="bg-card border-transparent transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <CardHeader className="items-center">
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Search className="h-10 w-10 text-primary"/>
                  </div>
                  <CardTitle className="pt-4 text-2xl font-headline">1. Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Use our powerful filters to narrow down treks by region, difficulty, and more.
                  </p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <Card className="bg-card border-transparent transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <CardHeader className="items-center">
                   <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <Scaling className="h-10 w-10 text-primary"/>
                  </div>
                  <CardTitle className="pt-4 text-2xl font-headline">2. Compare & Decide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Compare key details like altitude, duration, and price side-by-side.
                  </p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
             <AnimateOnScroll delay={500}>
               <Card className="bg-card border-transparent transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2">
                <CardHeader className="items-center">
                   <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <MessageSquare className="h-10 w-10 text-primary"/>
                  </div>
                  <CardTitle className="pt-4 text-2xl font-headline">3. Inquire & Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Send an inquiry directly from the trek page to start planning your adventure.
                  </p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}