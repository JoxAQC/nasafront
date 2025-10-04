'use client';

import { useState } from 'react';
import { ImpactForm } from '@/components/impact-form';
import { MapView } from '@/components/map-view';
import { DamageReport } from '@/components/damage-report';
import { ImpactAnimation } from '@/components/impact-animation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AssessImpactDamageOutput } from '@/ai/flows/assess-impact-damage';
import { getImpactAssessment } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export type Coordinates = { lat: number; lng: number; x: number; y: number };
export type Report = AssessImpactDamageOutput;

export default function Home() {
  const [impactLocation, setImpactLocation] = useState<Coordinates | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('Select an impact location on the map.');
  const [formKey, setFormKey] = useState(Date.now());
  const { toast } = useToast();

  const handleLocationSelect = (coords: Coordinates) => {
    if (isLoading || isSimulating) return;
    setImpactLocation(coords);
    setReport(null);
    setFeedback('Adjust parameters and click "Simulate Impact".');
  };

  const handleReset = () => {
    setImpactLocation(null);
    setReport(null);
    setIsSimulating(false);
    setIsLoading(false);
    setFeedback('Select an impact location on the map.');
    setFormKey(Date.now());
  };

  const handleSimulate = async (formData: { meteoriteSize: number; radius: number }) => {
    if (!impactLocation) {
      toast({
        variant: 'destructive',
        title: 'No location selected',
        description: 'Please click on the map to select an impact location.',
      });
      return;
    }

    setIsSimulating(true);
    setReport(null);
    setFeedback('Impact in progress...');

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSimulating(false);
    setIsLoading(true);
    setFeedback('Assessing damage...');

    const input = {
      latitude: impactLocation.lat,
      longitude: impactLocation.lng,
      meteoriteSizeInKilograms: formData.meteoriteSize * 1000,
      radiusInKilometers: formData.radius,
    };

    const result = await getImpactAssessment(input);

    setIsLoading(false);
    if (result.success && result.data) {
      setReport(result.data);
      setFeedback('Damage assessment complete. See report below.');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      handleReset();
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground font-body">
      <aside className="w-full md:w-[380px] p-4 border-r border-border flex flex-col gap-6 overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline text-primary">Terra Impact</h1>
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </div>
        <ImpactForm
          key={formKey}
          onSimulate={handleSimulate}
          onReset={handleReset}
          isBusy={isSimulating || isLoading}
          impactLocation={impactLocation}
        />
        <Separator />
        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Assessing Damage...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is analyzing the impact zone...</p>
              </div>
            </CardContent>
          </Card>
        )}
        {report && <DamageReport report={report} />}
      </aside>
      <main className="flex-1 relative overflow-hidden">
        <MapView onLocationSelect={handleLocationSelect} selectedLocation={impactLocation} isBusy={isSimulating || isLoading} />
        {isSimulating && impactLocation && (
          <ImpactAnimation x={impactLocation.x} y={impactLocation.y} />
        )}
      </main>
    </div>
  );
}
