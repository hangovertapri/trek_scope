'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { ItineraryItem } from '@/lib/types';
import { useMemo } from 'react';

interface AltitudeChartProps {
  itinerary: ItineraryItem[];
}

export default function AltitudeChart({ itinerary }: AltitudeChartProps) {
  const chartData = useMemo(() => {
    return itinerary.filter(item => item.altitude !== undefined);
  }, [itinerary]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAltitude" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `Day ${value}`}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}m`}
            domain={['dataMin - 200', 'dataMax + 200']}
          />
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
            labelFormatter={(label) => `Day ${label}`}
             formatter={(value, name, props) => [
              `${value}m`,
              `Altitude - ${props.payload.title}`
            ]}
          />
          <Area
            type="monotone"
            dataKey="altitude"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorAltitude)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
