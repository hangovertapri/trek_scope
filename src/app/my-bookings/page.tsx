'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, MapPin, Users, Calendar } from 'lucide-react';

interface BookingRequest {
  id: string;
  trek: string;
  trekName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dates: { start: string; end: string };
  groupSize: number;
  specialRequests?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function MyBookingsPage() {
  const session = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (session.status === 'authenticated') {
      fetchBookings();
    }
  }, [session.status, router]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      const allBookings = await res.json();
      
      // Filter bookings by customer email from session
      const customerEmail = session.data?.user?.email || '';
      const myBookings = allBookings.filter((b: BookingRequest) => b.customerEmail === customerEmail);
      
      setBookings(myBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(bookingId: string) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelling(bookingId);
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: bookingId,
          status: 'cancelled',
        }),
      });

      if (!res.ok) throw new Error('Failed to cancel booking');

      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setCancelling(null);
    }
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You don't have any bookings yet. <a href="/treks" className="font-semibold hover:underline">Browse treks</a> to make your first booking!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Trek Info */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">{booking.trekName}</h2>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.groupSize} {booking.groupSize === 1 ? 'person' : 'people'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{booking.dates.start} to {booking.dates.end}</span>
                      </div>
                      {booking.specialRequests && (
                        <div className="mt-2">
                          <p className="font-medium">Special Requests:</p>
                          <p className="text-muted-foreground">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <h3 className="font-semibold mb-2">Your Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {booking.customerName}</p>
                      <p><span className="text-muted-foreground">Email:</span> {booking.customerEmail}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {booking.customerPhone}</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div>
                    <h3 className="font-semibold mb-2">Status</h3>
                    <div className="mb-4">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'pending' ? 'bg-accent/20 text-accent' :
                        booking.status === 'approved' ? 'bg-amber-100 text-amber-800' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>

                    {booking.status !== 'completed' && booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => cancelBooking(booking.id)}
                        disabled={cancelling === booking.id}
                      >
                        {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground mt-4">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
