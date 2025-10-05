'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { diameter: '0-30', total: 11830 },
  { diameter: '30-100', total: 13565 },
  { diameter: '100-300', total: 8276 },
  { diameter: '300-1000', total: 5030 },
  { diameter: '1000+', total: 877 },
];

export function AsteroidStats() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Did you know?</CardTitle>
        <CardDescription>Near-Earth Asteroids Discovered (as of Oct 2025)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: -10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="diameter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
