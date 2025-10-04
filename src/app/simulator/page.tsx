'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getImpactAssessment } from '@/app/actions';
import { ImpactForm } from '@/components/impact-form';
import { DamageReport } from '@/components/damage-report';
import { ImpactAnimation } from '@/components/impact-animation';
import { MapView } from '@/components/map-view';
import { AssessImpactDamageOutput } from '@/ai/flows/assess-impact-damage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export type Coordinates = {
  lat: number;
  lng: number;
  x: number;
  y: number;
};

export type Report = AssessImpactDamageOutput;

export default function SimulatorPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [impactLocation, setImpactLocation] = useState<Coordinates | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImpact, setShowImpact] = useState(false);
  const { toast } = useToast();

  const handleLocationSelect = (coords: Coordinates) => {
    if (isBusy) return;
    setImpactLocation(coords);
    setReport(null);
    setError(null);
  };

  const handleSimulate = async (data: { meteoriteSize: number; radius: number }) => {
    if (!impactLocation) {
      toast({
        variant: 'destructive',
        title: 'No location selected',
        description: 'Please click on the map to select an impact location.',
      });
      return;
    }

    setIsBusy(true);
    setError(null);
    setReport(null);
    setShowImpact(true);

    const input = {
      latitude: impactLocation.lat,
      longitude: impactLocation.lng,
      meteoriteSizeInKilograms: data.meteoriteSize * 1000,
      radiusInKilometers: data.radius,
    };

    const result = await getImpactAssessment(input);

    if (result.success && result.data) {
      setReport(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: 'destructive',
        title: 'Simulation Failed',
        description: result.error || 'Could not get a report from the AI model.',
      });
    }

    setIsBusy(false);
    setTimeout(() => setShowImpact(false), 2000);
  };
  
  const handleReset = () => {
    setImpactLocation(null);
    setReport(null);
    setError(null);
    setIsBusy(false);
    setShowImpact(false);
  };

  return (
    <main className="grid h-screen w-screen grid-cols-1 md:grid-cols-[400px_1fr]">
      <div className="z-10 flex h-full flex-col gap-4 overflow-y-auto bg-background p-4">
        <h1 className="text-2xl font-bold text-primary">NeoSentinel</h1>
        <ImpactForm
          onSimulate={handleSimulate}
          onReset={handleReset}
          isBusy={isBusy}
          impactLocation={impactLocation}
        />
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Simulation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {report && !isBusy && <div className="animate-fade-in-up"><DamageReport report={report} /></div>}
      </div>
      <div className="relative h-full w-full">
        <MapView onLocationSelect={handleLocationSelect} selectedLocation={impactLocation} isBusy={isBusy} />
        {showImpact && impactLocation && <ImpactAnimation x={impactLocation.x} y={impactLocation.y} />}
         {!impactLocation && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="max-w-md rounded-lg bg-background/80 p-8 text-center text-foreground shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl font-bold">Select Impact Location</h2>
              <p className="mt-2 text-muted-foreground">
                Click anywhere on the map to choose a point of impact for the meteorite.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
