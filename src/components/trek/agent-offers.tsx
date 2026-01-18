'use client';

import { useState } from 'react';
import type { AgentTrekOffer } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Calendar, CheckCircle, XCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import BookingForm from '@/components/forms/booking-form';

interface AgentOffersProps {
  offers: AgentTrekOffer[];
  trekName: string;
  trekSlug: string;
}

export default function AgentOffers({ offers, trekName, trekSlug }: AgentOffersProps) {
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'rating'>('price_low');
  const [selectedOffer, setSelectedOffer] = useState<AgentTrekOffer | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Sort offers
  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'price_low') return a.price_usd - b.price_usd;
    if (sortBy === 'price_high') return b.price_usd - a.price_usd;
    if (sortBy === 'rating') return b.agent_rating - a.agent_rating;
    return 0;
  });

  const handleBookNow = (offer: AgentTrekOffer) => {
    setSelectedOffer(offer);
    setIsBookingOpen(true);
  };

  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <Info className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Agents Available</h3>
        <p className="text-muted-foreground">
          This trek is not currently offered by any agents. Please check back later or contact us for more information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Available Agents</h2>
          <p className="text-muted-foreground mt-1">
            {offers.length} {offers.length === 1 ? 'agent offers' : 'agents offer'} this trek
          </p>
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent offer cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedOffers.map((offer) => (
          <Card key={offer.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{offer.agent_name}</CardTitle>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{offer.agent_rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">rating</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">${offer.price_usd}</div>
                  <div className="text-xs text-muted-foreground">per person</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Group size and dates */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Group: {offer.group_size_min}-{offer.group_size_max} people
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {new Date(offer.availability_start).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    -{' '}
                    {new Date(offer.availability_end).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* What's included (first 3 items) */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">What&apos;s Included:</h4>
                <ul className="space-y-1">
                  {offer.includes.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                  {offer.includes.length > 3 && (
                    <li className="text-sm text-muted-foreground ml-6">
                      +{offer.includes.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>

              {/* Custom notes */}
              {offer.custom_notes && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm italic text-muted-foreground">&quot;{offer.custom_notes}&quot;</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto space-y-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      View Full Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{offer.agent_name}</DialogTitle>
                      <DialogDescription>Complete package details for this trek</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Price */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Pricing</h3>
                        <div className="text-3xl font-bold text-primary">${offer.price_usd} USD</div>
                        <p className="text-sm text-muted-foreground">per person</p>
                      </div>

                      {/* Group size */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Group Size</h3>
                        <p>
                          Minimum: {offer.group_size_min} people · Maximum: {offer.group_size_max} people
                        </p>
                      </div>

                      {/* Availability */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Availability</h3>
                        <p>
                          {new Date(offer.availability_start).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          to{' '}
                          {new Date(offer.availability_end).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      {/* What's included */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          What&apos;s Included
                        </h3>
                        <ul className="space-y-2">
                          {offer.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* What's excluded */}
                      <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-red-500" />
                          What&apos;s Not Included
                        </h3>
                        <ul className="space-y-2">
                          {offer.excludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Custom notes */}
                      {offer.custom_notes && (
                        <div>
                          <h3 className="font-semibold text-lg mb-2">Special Notes</h3>
                          <p className="text-muted-foreground">{offer.custom_notes}</p>
                        </div>
                      )}

                      {/* Booking terms */}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Booking Terms</h3>
                        <p className="text-muted-foreground">{offer.booking_terms}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => handleBookNow(offer)} className="w-full">
                  Book This Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking dialog */}
      {selectedOffer && (
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book with {selectedOffer.agent_name}</DialogTitle>
              <DialogDescription>
                ${selectedOffer.price_usd} per person · {trekName}
              </DialogDescription>
            </DialogHeader>
            <BookingForm
              trekSlug={trekSlug}
              trekName={trekName}
              agentOfferId={selectedOffer.id}
              agentId={selectedOffer.agent_id}
              agentName={selectedOffer.agent_name}
              onSuccess={() => setIsBookingOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
