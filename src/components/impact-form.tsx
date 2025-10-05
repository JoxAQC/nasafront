'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Coordinates } from '@/app/simulator/page';
import { Rocket, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { asteroids } from '@/lib/asteroid-data';
import { useEffect } from 'react';

const formSchema = z.object({
  asteroidName: z.string().min(1, 'Please select an asteroid.'),
  latitude: z.number(),
  longitude: z.number(),
});

export type ImpactFormData = z.infer<typeof formSchema>;

type ImpactFormProps = {
  onSimulate: (data: ImpactFormData) => void;
  onReset: () => void;
  isBusy: boolean;
  impactLocation: Coordinates | null;
};

export function ImpactForm({ onSimulate, onReset, isBusy, impactLocation }: ImpactFormProps) {
  const form = useForm<ImpactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asteroidName: '',
      latitude: NaN,
      longitude: NaN,
    },
  });

  useEffect(() => {
    if (impactLocation) {
      form.setValue('latitude', impactLocation.lat);
      form.setValue('longitude', impactLocation.lng);
    }
  }, [impactLocation, form]);

  const onSubmit = (data: ImpactFormData) => {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="asteroidName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Asteroid</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isBusy}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a Near-Earth Object..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {asteroids.map((asteroid) => (
                          <SelectItem key={asteroid.full_name} value={asteroid.full_name}>
                            {asteroid.full_name.trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                         <Input 
                            {...field} 
                            value={field.value || ''}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            type="number"
                            disabled={isBusy} 
                            placeholder="Select on map"
                         />
                      </FormControl>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                         <Input 
                            {...field} 
                            value={field.value || ''}
                            onChange={e => field.onChange(parseFloat(e.target.value))}
                            type="number"
                            disabled={isBusy} 
                            placeholder="Select on map"
                         />
                      </FormControl>
                    </FormItem>
                  )}
                />
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
