import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import type { Trek } from '@/lib/types';
import { getAllTreks } from '@/lib/data';
import { findImage } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Mountain,
  Clock,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  ShieldCheck,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import InquiryForm from '@/components/forms/inquiry-form';
import BookingForm from '@/components/forms/booking-form';
import MessageForm from '@/components/forms/message-form';
import Meta from '@/components/meta';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import AnimateOnScroll from '@/components/shared/animate-on-scroll';
import AltitudeChart from '@/components/trek/altitude-chart';
import AltitudeChartAnimated from '@/components/trek/altitude-chart-animated';
import WeatherWidget from '@/components/trek/weather-widget';
import TrekMap from '@/components/trek/map';
import ReviewsList from '@/components/trek/reviews-list';
import ReviewForm from '@/components/trek/review-form';
import CostCalculator from '@/components/trek/cost-calculator';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const treks = getAllTreks();
  return treks.map((trek) => ({
    slug: trek.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const allTreks = getAllTreks();
    const trek = allTreks.find((t: Trek) => t.slug === resolvedParams.slug);

    if (!trek) {
      return {
        title: 'Trek Not Found',
      };
    }

    return {
      title: `${trek.name} | TrekMapper`,
      description: trek.description,
      openGraph: {
        title: trek.name,
        description: trek.description,
        images: [
          {
            url: findImage(trek.images[0]).imageUrl,
            width: 600,
            height: 400,
            alt: trek.name,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: 'Trek Not Found',
    };
  }
}

export default async function TrekDetailPage({ params }: Props) {
  const resolvedParams = await params;
  
  try {
    const allTreks = getAllTreks();
    const trek = allTreks.find((t: Trek) => t.slug === resolvedParams.slug);

    if (!trek) {
      notFound();
    }

  const heroImage = findImage(trek.images[0]);

  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/` },
      { "@type": "ListItem", "position": 2, "name": "Treks", "item": `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/treks` },
      { "@type": "ListItem", "position": 3, "name": trek.name, "item": `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/treks/${trek.slug}` }
    ]
  }

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": trek.faq.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  }

  const tourJson = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": trek.name,
    "description": trek.description,
    "image": trek.images.map((id) => findImage(id).imageUrl),
    "itinerary": trek.itinerary.map((i) => ({ "@type": "ListItem", "position": i.day, "name": i.title }))
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/treks/${trek.slug}`

  return (
    <article className="animate-fade-in">
      <Meta title={trek.name} description={trek.description} url={pageUrl} image={findImage(trek.images[0]).imageUrl} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tourJson) }} />
      <header className="parallax-container h-[50vh] md:h-[60vh]">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          priority
          className="parallax-image"
          data-ai-hint={heroImage.imageHint}
        />
        <div className="parallax-overlay from-black/60 to-transparent bg-gradient-to-t" />
        <div className="parallax-content justify-end items-start p-8 text-left">
          <div className='w-full'>
            <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg animate-fade-in-up">
              {trek.name}
            </h1>
            <p className="text-xl mt-2 text-gray-200 drop-shadow-md animate-fade-in-up animation-delay-200">
              {trek.region}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <AnimateOnScroll as="section" id="overview" className="scroll-mt-20">
              <h2 className="text-3xl font-bold font-headline text-primary mb-4">
                Overview
              </h2>
              <p className="text-lg text-muted-foreground">{trek.overview}</p>
              
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <AnimateOnScroll className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm" delay={100}>
                  <TrendingUp className="h-8 w-8 text-accent mb-2"/>
                  <span className="font-bold">{trek.difficulty}</span>
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                </AnimateOnScroll>
                <AnimateOnScroll className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm" delay={200}>
                  <Clock className="h-8 w-8 text-accent mb-2"/>
                  <span className="font-bold">{trek.duration} Days</span>
                  <span className="text-sm text-muted-foreground">Duration</span>
                </AnimateOnScroll>
                <AnimateOnScroll className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm" delay={300}>
                  <Mountain className="h-8 w-8 text-accent mb-2"/>
                  <span className="font-bold">{trek.altitude}m</span>
                  <span className="text-sm text-muted-foreground">Max Altitude</span>
                </AnimateOnScroll>
                <AnimateOnScroll className="flex flex-col items-center p-4 bg-card rounded-lg shadow-sm" delay={400}>
                  <DollarSign className="h-8 w-8 text-accent mb-2"/>
                  <span className="font-bold">{formatCurrency(trek.price_range[0])}+</span>
                  <span className="text-sm text-muted-foreground">Price</span>
                </AnimateOnScroll>
              </div>
            </AnimateOnScroll>
            
            <Separator className="my-12" />

            <AnimateOnScroll as="section" id="altitude-profile" className="scroll-mt-20">
               <h2 className="text-3xl font-bold font-headline text-primary mb-4">
                Altitude Profile
              </h2>
              <AltitudeChartAnimated itinerary={trek.itinerary} difficulty={trek.difficulty} />
            </AnimateOnScroll>

            <Separator className="my-12" />

            {trek.coordinates && (
              <>
                <AnimateOnScroll as="section" id="weather" className="scroll-mt-20">
                  <h2 className="text-3xl font-bold font-headline text-primary mb-4">
                    Current Weather Conditions
                  </h2>
                  <WeatherWidget coordinates={trek.coordinates} trekName={trek.name} />
                </AnimateOnScroll>
                <Separator className="my-12" />
              </>
            )}

            {trek.coordinates && (
              <>
                <AnimateOnScroll as="section" id="map" className="scroll-mt-20">
                  <h2 className="text-3xl font-bold font-headline text-primary mb-4">
                    Trek Location
                  </h2>
                  <TrekMap coordinates={trek.coordinates} name={trek.name} />
                </AnimateOnScroll>
                <Separator className="my-12" />
              </>
            )}

            <AnimateOnScroll as="section" id="itinerary" className="scroll-mt-20">
              <h2 className="text-3xl font-bold font-headline text-primary mb-4">
                Sample Itinerary
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {trek.itinerary.map((item) => (
                  <AccordionItem key={item.day} value={`day-${item.day}`}>
                    <AccordionTrigger className="text-lg font-semibold">
                      Day {item.day}: {item.title}
                       {item.altitude && <span className="ml-auto text-sm text-muted-foreground font-normal pr-2">{item.altitude}m</span>}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pl-2">
                      {item.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimateOnScroll>

             <Separator className="my-12" />

            <AnimateOnScroll as="section" id="gallery" className="scroll-mt-20">
                <h2 className="text-3xl font-bold font-headline text-primary mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {trek.images.map((imgId, index) => {
                        const img = findImage(imgId);
                        return (
                             <AnimateOnScroll key={`${imgId}-${index}`} className="relative aspect-video rounded-lg overflow-hidden shadow-md" delay={index * 100} animationClass="animate-fade-in">
                                <Image src={img.imageUrl} alt={img.description} fill className="object-cover" data-ai-hint={img.imageHint}/>
                            </AnimateOnScroll>
                        )
                    })}
                </div>
            </AnimateOnScroll>

            <Separator className="my-12" />

            <AnimateOnScroll as="section" id="faq" className="scroll-mt-20">
              <h2 className="text-3xl font-bold font-headline text-primary mb-4">FAQ</h2>
                <Accordion type="single" collapsible className="w-full">
                {trek.faq.map((faqItem) => (
                  <AccordionItem key={faqItem.question} value={faqItem.question}>
                    <AccordionTrigger className="text-lg font-semibold text-left">
                     {faqItem.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground pl-2">
                      {faqItem.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimateOnScroll>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Tabs defaultValue="inquiry" className="bg-card rounded-lg shadow-lg p-6">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="inquiry">Inquiry</TabsTrigger>
                  <TabsTrigger value="booking">Booking</TabsTrigger>
                  <TabsTrigger value="message">Message</TabsTrigger>
                </TabsList>
                
                <TabsContent value="inquiry" className="mt-0">
                  <h3 className="text-xl font-bold font-headline text-primary mb-4">
                    Quick Inquiry
                  </h3>
                  <InquiryForm defaultTrek={trek.slug} trekName={trek.name} />
                </TabsContent>

                <TabsContent value="booking" className="mt-0">
                  <h3 className="text-xl font-bold font-headline text-primary mb-4">
                    Book This Trek
                  </h3>
                  <BookingForm defaultTrek={trek.slug} trekName={trek.name} />
                </TabsContent>

                <TabsContent value="message" className="mt-0">
                  <h3 className="text-xl font-bold font-headline text-primary mb-4">
                    Send Message
                  </h3>
                  <MessageForm defaultTrek={trek.slug} trekName={trek.name} />
                </TabsContent>
              </Tabs>
            </div>
          </aside>
        </div>

        {/* Reviews Section - Full Width */}
        <Separator className="my-12" />

        <AnimateOnScroll as="section" id="cost-calculator" className="scroll-mt-20">
          <h2 className="text-3xl font-bold font-headline text-primary mb-8">
            Budget Planner
          </h2>
          <CostCalculator trekPrice={trek.price_range} trekName={trek.name} />
        </AnimateOnScroll>

        <Separator className="my-12" />

        <AnimateOnScroll as="section" id="reviews" className="scroll-mt-20">
          <h2 className="text-3xl font-bold font-headline text-primary mb-8">
            Trekker Reviews
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-2">
              <ReviewsList trekId={trek.id} trekName={trek.name} />
            </div>

            {/* Review Form - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div id={`write-review-${trek.id}`} className="lg:sticky lg:top-32">
                <ReviewForm trekId={trek.id} trekName={trek.name} />
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </article>
  );
  } catch (error) {
    console.error('Failed to fetch trek:', error);
    notFound();
  }
}
