import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, MessageSquare } from 'lucide-react';

export interface BookingRequestItem {
  id: string;
  trekName: string;
  customerName: string;
  customerEmail: string;
  groupSize: number;
  dates: { start: string; end: string };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
}

interface BookingManagementProps {
  bookings: BookingRequestItem[];
  onApprove?: (bookingId: string) => void;
  onReject?: (bookingId: string) => void;
  onContact?: (bookingId: string) => void;
}

const statusConfig = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
  approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
  completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
};

export function BookingManagement({ bookings, onApprove, onReject, onContact }: BookingManagementProps) {
  return (
    <div className="space-y-4">
      {bookings.map(booking => {
        const status = statusConfig[booking.status];
        return (
          <Card key={booking.id} className="p-6 hover:shadow-lg transition">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.trekName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Requested on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={`${status.bg} ${status.text}`}>
                    {status.label}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Customer:</span> {booking.customerName}</p>
                  <p><span className="font-medium">Email:</span> {booking.customerEmail}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{booking.groupSize} people</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{booking.dates.start} to {booking.dates.end}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions */}
              <div className="flex flex-col justify-between">
                {booking.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 w-full"
                      onClick={() => onApprove?.(booking.id)}
                    >
                      Approve Booking
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      onClick={() => onReject?.(booking.id)}
                    >
                      Reject Booking
                    </Button>
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="gap-2 w-full"
                  onClick={() => onContact?.(booking.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact Customer
                </Button>
              </div>
            </div>
          </Card>
        );
      })}

      {bookings.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No booking requests yet</p>
        </Card>
      )}
    </div>
  );
}
