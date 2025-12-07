import { Card } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface AnalyticsSummary {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  conversionRate: number;
  bookingsTrend: number; // percentage change
  revenueTrend: number; // percentage change
  monthlyData: Array<{ month: string; bookings: number; revenue: number }>;
  trekPopularity: Array<{ name: string; bookings: number }>;
  difficultyBreakdown: Array<{ difficulty: string; count: number }>;
}

interface AnalyticsSectionProps {
  analytics: AnalyticsSummary;
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

export function AnalyticsSummaryCard({ label, value, trend, icon: Icon }: 
  { label: string; value: string | number; trend?: number; icon: React.ReactNode }) {
  const isPositive = (trend ?? 0) >= 0;
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(trend)}% vs last period</span>
            </div>
          )}
        </div>
        <div className="text-muted-foreground opacity-20">
          {Icon}
        </div>
      </div>
    </Card>
  );
}

export function MonthlyTrendChart({ data }: { data: AnalyticsSummary['monthlyData'] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Performance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
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
  );
}

export function TrekPopularityChart({ data }: { data: AnalyticsSummary['trekPopularity'] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Most Booked Treks</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bookings" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function DifficultyDistributionChart({ data }: { data: AnalyticsSummary['difficultyBreakdown'] }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Bookings by Difficulty Level</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ difficulty, count }) => `${difficulty}: ${count}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
