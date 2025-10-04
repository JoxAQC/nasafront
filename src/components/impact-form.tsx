'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { Coordinates } from '@/app/page';
import { Rocket, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const formSchema = z.object({
  meteoriteSize: z.number().min(1).max(1000),
  radius: z.number().min(1).max(500),
});

type ImpactFormProps = {
  onSimulate: (data: z.infer<typeof formSchema>) => void;
  onReset: () => void;
  isBusy: boolean;
  impactLocation: Coordinates | null;
};

export function ImpactForm({ onSimulate, onReset, isBusy, impactLocation }: ImpactFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meteoriteSize: 50,
      radius: 100,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSimulate(data);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Impact Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="meteoriteSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meteorite Size (kilotons)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={1000}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isBusy}
                        />
                      </FormControl>
                      <Input
                        type="number"
                        className="w-24"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        disabled={isBusy}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assessment Radius (km)</FormLabel>
                    <div className="flex items-center gap-4">
                      <FormControl>
                        <Slider
                          min={1}
                          max={500}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          disabled={isBusy}
                        />
                      </FormControl>
                      <Input
                        type="number"
                        className="w-24"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        disabled={isBusy}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <Input value={impactLocation ? impactLocation.lat.toFixed(4) : 'N/A'} readOnly disabled />
                  </FormItem>
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <Input value={impactLocation ? impactLocation.lng.toFixed(4) : 'N/A'} readOnly disabled />
                  </FormItem>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isBusy || !impactLocation} className="flex-1">
                  <Rocket />
                  {isBusy ? 'Simulating...' : 'Simulate Impact'}
                </Button>
                <Button variant="outline" type="button" onClick={onReset} disabled={isBusy}>
                  <RotateCcw />
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
