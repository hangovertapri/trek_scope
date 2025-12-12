'use client';

import { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  name: string;
  trek: string;
  rating: number;
  text: string;
  image?: string;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    trek: 'Everest Base Camp',
    rating: 5,
    text: 'An absolutely incredible experience! The guides were knowledgeable, the accommodations were comfortable, and the views were breathtaking. This trek changed my perspective on life.',
    date: 'Oct 2024',
    verified: true,
  },
  {
    id: '2',
    name: 'Michael Chen',
    trek: 'Gokyo Lakes',
    rating: 5,
    text: 'Best trekking experience of my life. The route was well-planned, guides were friendly and professional. Highly recommend for anyone looking for an adventure!',
    date: 'Sep 2024',
    verified: true,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    trek: 'Langtang Gosaikunda',
    rating: 5,
    text: 'Amazing trek with stunning scenery. The team took excellent care of us and made sure we were safe and comfortable throughout the journey.',
    date: 'Aug 2024',
    verified: true,
  },
  {
    id: '4',
    name: 'David Martinez',
    trek: 'Manaslu Circuit',
    rating: 5,
    text: 'Challenging but rewarding! The guides provided valuable insights about local culture and nature. Worth every step!',
    date: 'Jul 2024',
    verified: true,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    trek: 'Three Passes Trek',
    rating: 5,
    text: 'Exceeded all my expectations. Professional service, beautiful route, and an unforgettable adventure. Thank you!',
    date: 'Jun 2024',
    verified: true,
  },
  {
    id: '6',
    name: 'James Taylor',
    trek: 'Annapurna Base Camp',
    rating: 5,
    text: 'Perfectly organized trek with amazing views. The guides were attentive and ensured everyone had a safe journey.',
    date: 'May 2024',
    verified: true,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  // Show 3 testimonials on desktop, 1 on mobile
  const visibleTestimonials = [
    currentTestimonial,
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-headline text-amber-400 mb-4">
            What Our Trekkers Say
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Join thousands of satisfied adventurers who've transformed their lives through our treks
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="mb-8">
          {/* Desktop View - 3 cards */}
          <div className="hidden md:grid grid-cols-3 gap-6 mb-6">
            {visibleTestimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className={`p-6 rounded-lg border transition-all duration-300 ${
                  idx === 0
                    ? 'bg-slate-800 border-amber-500 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <Quote className="h-5 w-5 text-amber-400 mb-3 opacity-50" />

                {/* Text */}
                <p className="text-slate-300 mb-4 line-clamp-3">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-100">{testimonial.name}</p>
                      <p className="text-xs text-slate-400">{testimonial.trek}</p>
                    </div>
                    {testimonial.verified && (
                      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{testimonial.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View - 1 card */}
          <div className="md:hidden mb-6">
            <div className="p-6 rounded-lg bg-slate-800 border border-amber-500 shadow-lg shadow-amber-500/20">
              {/* Stars */}
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <Quote className="h-5 w-5 text-teal-400 mb-3 opacity-50" />

              {/* Text */}
              <p className="text-slate-300 mb-4">
                "{currentTestimonial.text}"
              </p>

              {/* Author */}
              <div className="pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-100">{currentTestimonial.name}</p>
                    <p className="text-xs text-slate-400">{currentTestimonial.trek}</p>
                  </div>
                  {currentTestimonial.verified && (
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">{currentTestimonial.date}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={prevTestimonial}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:text-slate-100 hover:border-teal-500"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-accent w-6'
                      : 'bg-slate-700 w-2 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={nextTestimonial}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:text-slate-100 hover:border-teal-500"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-800">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">4.9★</div>
            <p className="text-slate-300 text-sm">Average Rating</p>
            <p className="text-xs text-slate-500">from 2,400+ reviews</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">12K+</div>
            <p className="text-slate-300 text-sm">Happy Trekkers</p>
            <p className="text-xs text-slate-500">since 2015</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">99%</div>
            <p className="text-slate-300 text-sm">Satisfaction Rate</p>
            <p className="text-xs text-slate-500">recommend us</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">Ready to become part of our success stories?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-accent hover:bg-accent/90" size="lg">
              <a href="/treks">Explore Treks Now</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-slate-700 text-slate-100 hover:border-amber-500">
              <a href="/recommend">Get Recommendations</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
