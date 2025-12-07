'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, BookOpen, TrendingUp, AlertTriangle, Download, Eye } from 'lucide-react';

interface Trek {
  id: string;
  slug: string;
  name: string;
  price_range: [number, number];
  agencyId?: string;
}

interface BookingRequest {
  id: string;
  trek: string;
  trekName: string;
  agencyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dates: { start: string; end: string };
  groupSize: number;
  specialRequests?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
}

interface AgencyStats {
  agencyId: string;
  agencyName: string;
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  topTrek: string;
  bookings: BookingRequest[];
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AdminAgenciesPage() {
  const session = useSession();
  const router = useRouter();
  const [agencies, setAgencies] = useState<AgencyStats[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [overviewTab, setOverviewTab] = useState('overview');
  const [agencyDetailTab, setAgencyDetailTab] = useState('details');

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/admin/login');
      return;
    }

    if (session.data?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (session.status === 'authenticated') {
      fetchData();
    }
  }, [session.status, session.data?.user?.role, router]);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch treks
      const treksRes = await fetch('/api/treks');
      const allTreks: Trek[] = await treksRes.json();
      setTreks(allTreks);
      
      // Fetch bookings
      const res = await fetch('/api/bookings');
      const allBookings: BookingRequest[] = await res.json();
      
      console.log('All bookings:', allBookings); // Debug log
      
      setBookings(allBookings);

      // Group bookings by agency
      const agencyMap = new Map<string, BookingRequest[]>();
      allBookings.forEach((booking) => {
        const agencyId = booking.agencyId || 'agency-1'; // Fallback to agency-1 if missing
        if (!agencyMap.has(agencyId)) {
          agencyMap.set(agencyId, []);
        }
        agencyMap.get(agencyId)!.push(booking);
      });

      console.log('Agency map:', agencyMap); // Debug log

      // Calculate stats for each agency
      const agencyStats: AgencyStats[] = Array.from(agencyMap.entries()).map(
        ([agencyId, agencyBookings]) => {
          const completed = agencyBookings.filter((b) => b.status === 'completed').length;
          const pending = agencyBookings.filter((b) => b.status === 'pending').length;
          const approved = agencyBookings.filter((b) => b.status === 'approved').length;
          const rejected = agencyBookings.filter((b) => b.status === 'rejected').length;
          const cancelled = agencyBookings.filter((b) => b.status === 'cancelled').length;

          // Calculate revenue based on trek prices
          const totalRevenue = agencyBookings
            .filter((b) => b.status === 'completed' || b.status === 'approved')
            .reduce((sum, b) => {
              // Find the trek price
              const trek = allTreks.find((t) => t.slug === b.trek);
              const trekPrice = trek?.price_range?.[0] || 0; // Use minimum price
              return sum + (trekPrice * b.groupSize);
            }, 0);

          const trekCounts = new Map<string, number>();
          agencyBookings.forEach((b) => {
            trekCounts.set(b.trekName, (trekCounts.get(b.trekName) || 0) + 1);
          });

          const topTrek = Array.from(trekCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

          return {
            agencyId,
            agencyName: agencyId === 'admin-1' ? 'Admin Agency' : (agencyId === 'agency-1' ? 'Agency 1' : `${agencyId}`),
            totalBookings: agencyBookings.length,
            completedBookings: completed,
            pendingBookings: pending,
            approvedBookings: approved,
            rejectedBookings: rejected,
            cancelledBookings: cancelled,
            totalRevenue,
            averageBookingValue: agencyBookings.length > 0 ? Math.round(totalRevenue / agencyBookings.length) : 0,
            topTrek,
            bookings: agencyBookings,
          };
        }
      );

      setAgencies(agencyStats.sort((a, b) => b.totalRevenue - a.totalRevenue));
      console.log('Agency stats:', agencyStats); // Debug log
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (session.status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading agency data...</p>
      </div>
    );
  }

  const totalRevenue = agencies.reduce((sum, a) => sum + a.totalRevenue, 0);
  const totalBookings = agencies.reduce((sum, a) => sum + a.totalBookings, 0);
  const completedBookings = agencies.reduce((sum, a) => sum + a.completedBookings, 0);
  const averagePerAgency = agencies.length > 0 ? Math.round(totalRevenue / agencies.length) : 0;

  const agencyRevenueData = agencies.map((a) => ({
    name: a.agencyName.replace('Agency - ', ''),
    revenue: a.totalRevenue,
  }));

  const bookingStatusData = [
    { name: 'Completed', value: completedBookings, color: '#10b981' },
    { name: 'Pending', value: agencies.reduce((s, a) => s + a.pendingBookings, 0), color: '#f59e0b' },
    { name: 'Approved', value: agencies.reduce((s, a) => s + a.approvedBookings, 0), color: '#3b82f6' },
    { name: 'Cancelled', value: agencies.reduce((s, a) => s + a.cancelledBookings, 0), color: '#6b7280' },
  ];

  const selectedAgencyData = agencies.find((a) => a.agencyId === selectedAgency);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard - Agency Tracking</h1>
      <p className="text-muted-foreground mb-8">Monitor all agencies, bookings, and revenue</p>

      <Tabs value={overviewTab} onValueChange={setOverviewTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agencies">Agency Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold mt-2">{totalBookings}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Agencies</p>
                  <p className="text-3xl font-bold mt-2">{agencies.length}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500 opacity-20" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Revenue/Agency</p>
                  <p className="text-3xl font-bold mt-2">${averagePerAgency.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500 opacity-20" />
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Agency */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Revenue by Agency</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agencyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Booking Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Top Agencies Table */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top Agencies by Revenue</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Agency</th>
                    <th className="text-right py-2 px-4">Total Bookings</th>
                    <th className="text-right py-2 px-4">Completed</th>
                    <th className="text-right py-2 px-4">Pending</th>
                    <th className="text-right py-2 px-4">Total Revenue</th>
                    <th className="text-right py-2 px-4">Avg Value</th>
                    <th className="text-center py-2 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {agencies.map((agency) => (
                    <tr key={agency.agencyId} className="border-b hover:bg-accent/5">
                      <td className="py-2 px-4 font-medium">{agency.agencyName}</td>
                      <td className="text-right py-2 px-4">{agency.totalBookings}</td>
                      <td className="text-right py-2 px-4">
                        <span className="text-green-600 font-semibold">{agency.completedBookings}</span>
                      </td>
                      <td className="text-right py-2 px-4">
                        <span className="text-yellow-600 font-semibold">{agency.pendingBookings}</span>
                      </td>
                      <td className="text-right py-2 px-4 font-semibold">${agency.totalRevenue.toLocaleString()}</td>
                      <td className="text-right py-2 px-4">${agency.averageBookingValue}</td>
                      <td className="text-center py-2 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAgency(agency.agencyId);
                            setOverviewTab('agencies');
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Agency Details Tab */}
        <TabsContent value="agencies" className="space-y-6">
          {selectedAgency ? (
            selectedAgencyData && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedAgencyData.agencyName}</h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAgency(null)}
                  >
                    Back to Overview
                  </Button>
                </div>

                {/* Agency KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{selectedAgencyData.totalBookings}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{selectedAgencyData.completedBookings}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${selectedAgencyData.totalRevenue.toLocaleString()}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Avg Value</p>
                    <p className="text-2xl font-bold">${selectedAgencyData.averageBookingValue}</p>
                  </Card>
                </div>

                <Tabs value={agencyDetailTab} onValueChange={setAgencyDetailTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">Booking Details</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>

                  {/* Booking Details */}
                  <TabsContent value="details" className="space-y-4">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-4">Agency</th>
                              <th className="text-left py-2 px-4">Trek</th>
                              <th className="text-left py-2 px-4">Customer</th>
                              <th className="text-left py-2 px-4">Email</th>
                              <th className="text-left py-2 px-4">Phone</th>
                              <th className="text-center py-2 px-4">Group Size</th>
                              <th className="text-left py-2 px-4">Dates</th>
                              <th className="text-center py-2 px-4">Status</th>
                              <th className="text-right py-2 px-4">Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedAgencyData.bookings.map((booking) => (
                              <tr key={booking.id} className="border-b hover:bg-accent/5">
                                <td className="py-2 px-4 font-medium text-sm">{selectedAgencyData.agencyName}</td>
                                <td className="py-2 px-4 font-medium">{booking.trekName}</td>
                                <td className="py-2 px-4">{booking.customerName}</td>
                                <td className="py-2 px-4 text-sm text-muted-foreground">{booking.customerEmail}</td>
                                <td className="py-2 px-4">{booking.customerPhone}</td>
                                <td className="text-center py-2 px-4">{booking.groupSize}</td>
                                <td className="py-2 px-4 text-sm">
                                  {booking.dates.start} to {booking.dates.end}
                                </td>
                                <td className="text-center py-2 px-4">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    booking.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                    booking.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                </td>
                                <td className="text-right py-2 px-4 font-semibold">
                                  ${(booking.status === 'completed' || booking.status === 'approved') ? 
                                    ((treks.find(t => t.slug === booking.trek)?.price_range?.[0] || 0) * booking.groupSize).toLocaleString() : '0'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Statistics */}
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Booking Status Breakdown</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Completed</span>
                            <span className="font-semibold text-green-600">{selectedAgencyData.completedBookings}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Pending</span>
                            <span className="font-semibold text-yellow-600">{selectedAgencyData.pendingBookings}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Approved</span>
                            <span className="font-semibold text-blue-600">{selectedAgencyData.approvedBookings}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Rejected</span>
                            <span className="font-semibold text-red-600">{selectedAgencyData.rejectedBookings}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Cancelled</span>
                            <span className="font-semibold text-gray-600">{selectedAgencyData.cancelledBookings}</span>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Revenue Insights</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>Total Revenue</span>
                            <span className="font-semibold text-lg">${selectedAgencyData.totalRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Average per Booking</span>
                            <span className="font-semibold">${selectedAgencyData.averageBookingValue}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Average Group Size</span>
                            <span className="font-semibold">
                              {selectedAgencyData.bookings.length > 0
                                ? Math.round(selectedAgencyData.bookings.reduce((s, b) => s + b.groupSize, 0) / selectedAgencyData.bookings.length)
                                : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Most Popular Trek</span>
                            <span className="font-semibold">{selectedAgencyData.topTrek}</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Select an agency from the overview table to see detailed booking information.</AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
