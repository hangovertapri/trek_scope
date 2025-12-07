'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LogOut, TrendingUp, Users, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import type { Trek } from '@/lib/types';

// Analytics data type
interface BookingAnalytics {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  conversionRate: number;
  monthlyData: Array<{ month: string; bookings: number; revenue: number }>;
  trekPopularity: Array<{ name: string; bookings: number }>;
  difficultyBreakdown: Array<{ difficulty: string; count: number }>;
}

interface BookingRequest {
  id: string;
  trekName: string;
  trekSlug: string;
  trek: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dates: { start: string; end: string };
  groupSize: number;
  specialRequests: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  agencyId: string;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function AgencyDashboardContent() {
  const session = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [treks, setTreks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<BookingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Show loading state while session is being checked
  if (session.status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  // Protect route
  useEffect(() => {
    if (session.status === 'loading') {
      return; // Wait for session to load
    }
    
    if (session.status === 'unauthenticated') {
      router.push('/agency/login');
    } else if (session.data?.user?.role !== 'agency') {
      // User is authenticated but not an agency user
      router.push('/');
    }
  }, [session.status, session.data?.user?.role, router]);

  // Load data
  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchDashboardData();
    }
  }, [session.status]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Fetch all treks and filter by this agency's ID
      const treksRes = await fetch('/api/treks');
      const allTreks = await treksRes.json();
      const agencyTreks = allTreks.filter((t: any) => t.agencyId === session.data?.user?.id);
      setTreks(agencyTreks);
      
      // Fetch inquiries for this agency
      const inquiriesRes = await fetch('/api/inquiries');
      const allInquiries = await inquiriesRes.json();
      const agencyInquiries = allInquiries.filter((i: any) => i.agencyId === session.data?.user?.id);
      setInquiries(agencyInquiries);
      
      // Fetch messages for this agency
      const messagesRes = await fetch('/api/messages');
      const allMessages = await messagesRes.json();
      const agencyMessages = allMessages.filter((m: any) => m.agencyId === session.data?.user?.id);
      setMessages(agencyMessages);
      
      // Fetch bookings for this agency
      const bookingsRes = await fetch('/api/bookings');
      const allBookings = await bookingsRes.json();
      const agencyBookings = allBookings.filter((b: any) => b.agencyId === session.data?.user?.id);
      setBookings(agencyBookings);
      
      // Calculate analytics from actual data with dynamic trek pricing
      const activeBookings = agencyBookings.filter((b: any) => b.status !== 'cancelled' && b.status !== 'rejected');
      const totalBookings = activeBookings.length;
      const totalRevenue = activeBookings
        .filter((b: any) => b.status === 'completed' || b.status === 'approved')
        .reduce((sum: number, b: any) => {
          const trek = agencyTreks.find((t: any) => t.slug === b.trek);
          const trekPrice = trek?.price_range?.[0] || 0;
          return sum + (trekPrice * b.groupSize);
        }, 0);
      const averageBookingValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
      const conversionRate = agencyInquiries.length > 0 ? Math.round((totalBookings / agencyInquiries.length) * 100 * 10) / 10 : 0;
      
      const mockAnalytics: BookingAnalytics = {
        totalBookings,
        totalRevenue,
        averageBookingValue,
        conversionRate,
        monthlyData: [
          { month: 'Jan', bookings: 8, revenue: 2860 },
          { month: 'Feb', bookings: 12, revenue: 4320 },
          { month: 'Mar', bookings: 10, revenue: 3590 },
          { month: 'Apr', bookings: 15, revenue: 5385 },
          { month: 'May', bookings: 18, revenue: 6480 },
          { month: 'Jun', bookings: 21, revenue: 7560 },
        ],
        trekPopularity: agencyTreks.map((t: any) => ({
          name: t.name,
          bookings: activeBookings.filter((b: any) => b.trek === t.slug).length,
        })),
        difficultyBreakdown: [
          { difficulty: 'Easy', count: agencyTreks.filter((t: any) => t.difficulty === 'Easy').length },
          { difficulty: 'Moderate', count: agencyTreks.filter((t: any) => t.difficulty === 'Moderate').length },
          { difficulty: 'Challenging', count: agencyTreks.filter((t: any) => t.difficulty === 'Challenging').length },
          { difficulty: 'Expert', count: agencyTreks.filter((t: any) => t.difficulty === 'Expert').length },
        ],
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(bookingId: string, newStatus: BookingRequest['status']) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });
      
      if (res.ok) {
        setBookings(bookings.map(b => 
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  }

  function getBookingRevenue(booking: BookingRequest): number {
    const trek = treks.find((t: any) => t.slug === booking.trek);
    const trekPrice = trek?.price_range?.[0] || 0;
    return (booking.status === 'completed' || booking.status === 'approved') ? (trekPrice * booking.groupSize) : 0;
  }

  async function handleLogout() {
    await signOut({ redirect: true, callbackUrl: '/' });
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session.data?.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Agency Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {session.data.user.name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-3xl font-bold mt-2">{analytics.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${analytics.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Booking Value</p>
                <p className="text-3xl font-bold mt-2">${analytics.averageBookingValue}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold mt-2">{analytics.conversionRate}%</p>
              </div>
              <Users className="h-8 w-8 text-orange-500 opacity-20" />
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Analytics Overview</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
          <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
          <TabsTrigger value="communication">Messages</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="overview" className="space-y-6">
          {analytics && (
            <>
              {/* Monthly Trend */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Monthly Bookings & Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="bookings" stroke="#3b82f6" name="Bookings" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trek Popularity */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Most Popular Treks</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.trekPopularity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Difficulty Breakdown */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Bookings by Difficulty</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.difficultyBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ difficulty, count }) => `${difficulty}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics.difficultyBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Trek Inquiries</h2>
            {inquiries.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>No inquiries yet. When customers ask about your treks, they'll appear here.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry: any) => (
                  <Card key={inquiry.id} className="p-4 border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{inquiry.trekName}</h3>
                        <p className="text-sm text-muted-foreground">from {inquiry.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'read' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <p className="text-sm mb-3">{inquiry.message}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-medium">Email:</span> {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div>
                          <span className="font-medium">Phone:</span> {inquiry.phone}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString()}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-4">
          {bookings.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>No booking requests yet.</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <Card key={booking.id} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{booking.trekName}</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-muted-foreground">Customer:</span> {booking.customerName}</p>
                        <p><span className="text-muted-foreground">Email:</span> {booking.customerEmail}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {booking.customerPhone}</p>
                        <p><span className="text-muted-foreground">Group Size:</span> {booking.groupSize} people</p>
                        <p><span className="text-muted-foreground">Dates:</span> {booking.dates.start} to {booking.dates.end}</p>
                        {booking.specialRequests && (
                          <p><span className="text-muted-foreground">Special Requests:</span> {booking.specialRequests}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Status</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Revenue</div>
                        <div className="text-lg font-bold text-green-600">${getBookingRevenue(booking).toLocaleString()}</div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        {booking.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => updateBookingStatus(booking.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateBookingStatus(booking.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {(booking.status === 'approved' || booking.status === 'completed') && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Messages from Customers</h2>
            {messages.length === 0 ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>No messages yet. Customers can send messages about your treks from the trek detail pages.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {messages.map((msg: any) => (
                  <Card key={msg.id} className="p-4 border-l-4 border-l-purple-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{msg.trekName}</h3>
                        <p className="text-sm text-muted-foreground">from {msg.name}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        !msg.read ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {msg.read ? 'Read' : 'New'}
                      </span>
                    </div>
                    <p className="text-sm mb-3 whitespace-pre-wrap">{msg.message}</p>
                    <div className="text-sm mb-3">
                      <span className="font-medium">Email:</span> {msg.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AgencyDashboardPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
      </div>
    }>
      <AgencyDashboardContent />
    </Suspense>
  );
}
