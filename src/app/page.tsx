'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Meta from '@/components/meta';
import type { Trek } from '@/lib/types';
import { useEffect, useState, useRef } from 'react';

async function getFeaturedTreks(): Promise<Trek[]> {
  try {
    // This won't work in client component, so we'll use dummy data
    return [];
  } catch (error) {
    console.error('Failed to fetch featured treks:', error);
    return [];
  }
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const portfolios = [
    {
      id: 1,
      title: 'Everest Base Camp',
      category: 'ICONIC PEAKS',
      description: 'Experience the journey to the world\'s highest peak. Trek through rhododendron forests, cross suspension bridges, and witness the majesty of Mount Everest.',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=right',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop',
      ],
      details: [
        'Duration: 14 days',
        'Altitude: 5,364m',
        'Difficulty: Moderate'
      ]
    },
    {
      id: 2,
      title: 'Gokyo Lakes',
      category: 'ALPINE LAKES',
      description: 'Discover the turquoise alpine lakes of Gokyo. A sacred pilgrimage route with stunning mountain vistas and pristine high-altitude lakes.',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=right',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=left',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=bottom',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop',
      ],
      details: [
        'Duration: 12 days',
        'Altitude: 4,790m',
        'Difficulty: Moderate-Hard'
      ]
    },
    {
      id: 3,
      title: 'Manaslu Circuit',
      category: 'CIRCUIT TREK',
      description: 'Complete the legendary circuit around Mount Manaslu. One of the most challenging and rewarding treks in the Himalayas.',
      images: [
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=top',
      ],
      details: [
        'Duration: 16 days',
        'Altitude: 5,106m',
        'Difficulty: Hard'
      ]
    },
    {
      id: 4,
      title: 'Annapurna Base Camp',
      category: 'MOUNTAIN TREK',
      description: 'Trek to the base camp of Mount Annapurna. Experience dramatic mountain scenery and encounter diverse wildlife and cultures.',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=bottom',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=left',
      ],
      details: [
        'Duration: 10 days',
        'Altitude: 4,130m',
        'Difficulty: Moderate'
      ]
    },
    {
      id: 5,
      title: 'Langtang Valley',
      category: 'VALLEY TREK',
      description: 'Walk through the beautiful Langtang Valley. Green forests, alpine meadows, and close-up views of snowy peaks await.',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=left',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop',
      ],
      details: [
        'Duration: 8 days',
        'Altitude: 3,870m',
        'Difficulty: Easy-Moderate'
      ]
    },
    {
      id: 6,
      title: 'Cholatse Trek',
      category: 'WILDERNESS',
      description: 'An off-the-beaten-path adventure. Experience raw wilderness, pristine nature, and fewer crowds than popular routes.',
      images: [
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=600&fit=crop',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200&h=600&fit=crop',
      ],
      details: [
        'Duration: 13 days',
        'Altitude: 5,400m',
        'Difficulty: Hard'
      ]
    },
  ];

  const testimonials = [
    {
      title: 'EVEREST BASE CAMP',
      quote: 'Creative courage is a dangerous horse to ride but Trek Scope never got off the saddle during their trekking journey. All their imagery and trails are not just routes, they are stories, they are judgements as much as they are pieces of adventure. It is only a gifted curator who can convey the poetry of the world with the visual language in a meaningful way.',
      author: 'ADVENTURE CURATOR',
      role: 'Trek Enthusiast',
    },
    {
      title: 'THE GOKYO EXPERIENCE',
      quote: 'A trek\'s essence is its soul. To which I must shamelessly add that Trek Scope\'s trails are sheer poetry. In a trekking world leaning perilously on pretence, this is work that is nude and nuanced. Whispering without shouting. Telling without stating. Sometimes to mean much it is imperative to say little.',
      author: 'NATURE GUIDE',
      role: 'Mountain Expert',
    },
    {
      title: 'MANASLU CIRCUIT',
      quote: 'What Cartier-Bresson was to photography, Trek Scope has become to adventure. He has commemorated the greatest trails we have with experiences that are as intuitive and imaginative as they are unforgettably iconic. These are classic routes, and they will remain to commemorate the spirit of mountain trekking long after the adventurers have retired their boots.',
      author: 'EXPEDITION LEADER',
      role: 'Himalayan Explorer',
    },
  ];

  // Calculate scroll-based transform values using actual element positions
  const getPortfolioTransform = (index: number) => {
    if (!mounted || !sectionRefs.current[index]) return {};

    const element = sectionRefs.current[index];
    if (!element) return {};

    const rect = element.getBoundingClientRect();
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const viewportHeight = window.innerHeight;
    
    // Calculate progress: -1 = above viewport, 0 = centered, 1 = below viewport
    const elementCenter = elementTop + elementHeight / 2;
    const viewportCenter = viewportHeight / 2;
    const progress = (elementCenter - viewportCenter) / viewportHeight;
    
    // When scrolling up (progress > 0): opacity increases, scale increases
    // When scrolling down (progress < 0): opacity decreases, scale decreases
    // At center (progress = 0): full opacity and scale
    
    let opacity = 1 - Math.abs(progress) * 1.5;
    opacity = Math.max(0.2, Math.min(1, opacity));
    
    let scale = 1 - Math.abs(progress) * 0.3;
    scale = Math.max(0.7, Math.min(1, scale));
    
    let translateY = progress * 100; // Moves up/down based on scroll
    
    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: opacity,
      transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out',
    };
  };

  return (
    <>
      <Meta title="Trek Scope - Himalayan Trekking Adventures" description="Discover extraordinary mountain experiences. Curated treks across the Himalayas." />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="relative z-10 text-center px-4">
            <p className="text-sm tracking-widest text-gray-300 mb-4 uppercase">Adventure Awaits</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Trek Scope</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">Discover extraordinary mountain experiences through curated himalayan adventures</p>
          </div>
        </section>

        {/* Portfolio Grid - Parallax Scroll Effect */}
        <section ref={containerRef} className="relative bg-white overflow-hidden">
          {portfolios.map((portfolio, index) => (
            <div 
              key={portfolio.id}
              ref={(el) => { if (el) sectionRefs.current[index] = el; }}
              className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-white px-4"
              style={getPortfolioTransform(index)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl w-full">
                {/* Image Section */}
                <div className={`order-1 ${index % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="relative w-full h-96 md:h-[500px] perspective" style={{ perspective: '1000px' }}>
                    {/* Stacked Card Images */}
                    {mounted && (
                      portfolio.images.map((image, imgIdx) => {
                      const currentIdx = currentImageIndex[index] || 0;
                      const isActive = imgIdx === currentIdx;
                      const isNext = imgIdx === (currentIdx + 1) % portfolio.images.length;
                      const isPrev = imgIdx === (currentIdx - 1 + portfolio.images.length) % portfolio.images.length;
                      
                      let zIndex = 0;
                      let rotation = 0;
                      let translateY = 0;
                      let translateX = 0;
                      let scale = 1;
                      let opacity = 0;

                      if (isActive) {
                        zIndex = 30;
                        rotation = 0;
                        translateY = 0;
                        translateX = 0;
                        scale = 1;
                        opacity = 1;
                      } else if (isNext) {
                        zIndex = 20;
                        rotation = 2;
                        translateY = 16;
                        translateX = 12;
                        scale = 0.98;
                        opacity = 0.8;
                      } else if (isPrev) {
                        zIndex = 10;
                        rotation = -2;
                        translateY = 12;
                        translateX = -12;
                        scale = 0.96;
                        opacity = 0.6;
                      } else {
                        zIndex = 1;
                        scale = 0.94;
                        opacity = 0;
                      }

                      return (
                        <div
                          key={imgIdx}
                          className="absolute w-full h-full rounded-lg overflow-hidden shadow-lg"
                          style={{
                            zIndex: zIndex,
                            transform: `translateY(${translateY}px) translateX(${translateX}px) rotate(${rotation}deg) scale(${scale})`,
                            opacity: opacity,
                            transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            pointerEvents: isActive ? 'auto' : 'none',
                          }}
                        >
                          <img
                            src={image}
                            alt={`${portfolio.title} - Image ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-all duration-700"></div>
                        </div>
                      );
                    })
                    )}

                    {/* Navigation Buttons - Overlay on Active Image */}
                    {portfolio.images.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => setCurrentImageIndex(prev => ({
                            ...prev,
                            [index]: (prev[index] || 0) === 0 ? portfolio.images.length - 1 : (prev[index] || 0) - 1
                          }))}
                          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 z-40 opacity-0 hover:opacity-100 group hover:opacity-100"
                          style={{
                            zIndex: 40,
                          }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setCurrentImageIndex(prev => ({
                            ...prev,
                            [index]: ((prev[index] || 0) + 1) % portfolio.images.length
                          }))}
                          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-200 z-40 opacity-0 hover:opacity-100 group hover:opacity-100"
                          style={{
                            zIndex: 40,
                          }}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                          {portfolio.images.map((_, imgIdx) => (
                            <button
                              key={imgIdx}
                              onClick={() => setCurrentImageIndex(prev => ({ ...prev, [index]: imgIdx }))}
                              className={`transition-all duration-300 rounded-full ${
                                (currentImageIndex[index] || 0) === imgIdx 
                                  ? 'bg-white w-3 h-3' 
                                  : 'bg-white/40 hover:bg-white/70 w-2 h-2'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className={`order-2 ${index % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="space-y-6 animate-fade-in-up">
                    <div>
                      <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">{portfolio.category}</p>
                      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{portfolio.title}</h2>
                    </div>
                    
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {portfolio.description}
                    </p>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                      {portfolio.details.map((detail, idx) => (
                        <div key={idx}>
                          <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">{detail.split(':')[0]}</p>
                          <p className="text-lg font-semibold text-slate-900">{detail.split(':')[1].trim()}</p>
                        </div>
                      ))}
                    </div>

                    <Link href="/inquiry">
                      <Button className="mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-base font-semibold">
                        Plan Your Trek
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`mb-24 ${index !== testimonials.length - 1 ? 'pb-24 border-b border-gray-200' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                  <div className="animate-fade-in-up">
                    <p className="text-xs tracking-widest text-gray-500 uppercase mb-4">Featured Experience</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">{testimonial.title}</h2>
                  </div>
                  <div className="animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
                      "{testimonial.quote}"
                    </p>
                    <div className="space-y-1">
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Begin Your Journey</h2>
            <p className="text-xl text-gray-300 mb-12">
              Explore our collection of carefully curated mountain treks and find your perfect adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/treks">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                  Explore All Treks
                </Button>
              </Link>
              <Link href="/recommend">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg font-semibold"
                >
                  Find Your Trek
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-slate-900 mb-4">Trek Scope</h3>
                <p className="text-sm text-gray-600">Curated himalayan adventures for every adventurer</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Quick Links</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/treks" className="hover:text-slate-900">Treks</Link></li>
                  <li><Link href="/compare" className="hover:text-slate-900">Compare</Link></li>
                  <li><Link href="/inquiry" className="hover:text-slate-900">Inquiry</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Info</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
                  <li><Link href="/" className="hover:text-slate-900">About</Link></li>
                  <li><Link href="/" className="hover:text-slate-900">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Connect</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="#" className="hover:text-slate-900">Facebook</a></li>
                  <li><a href="#" className="hover:text-slate-900">Instagram</a></li>
                  <li><a href="#" className="hover:text-slate-900">Twitter</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p>© Trek Scope. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}