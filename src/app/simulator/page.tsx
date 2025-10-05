'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getImpactAssessment, getChatbotResponse } from '@/app/actions';
import { ImpactForm, type ImpactFormData } from '@/components/impact-form';
import { DamageReport } from '@/components/damage-report';
import { ImpactAnimation } from '@/components/impact-animation';
import { MapView } from '@/components/map-view';
import { AssessImpactDamageOutput } from '@/ai/flows/assess-impact-damage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { asteroids, type Asteroid } from '@/lib/asteroid-data';
import { calculateImpactMetrics } from '@/lib/impact-calculator';
import { AsteroidStats } from '@/components/asteroid-stats';
import { ContextualChatbot, type Message } from '@/components/contextual-chatbot';
import { Separator } from '@/components/ui/separator';


export type Coordinates = {
  lat: number;
  lng: number;
};

export type SimulationOutput = {
  D_diameter_m: string;
  M_mass_kg: string;
  Ek_megatons: string;
  R_blast_km: string;
  D_crater_km: string;
  M_richter: string;
}

export type Report = AssessImpactDamageOutput & {
  simulation: SimulationOutput;
  asteroid: Asteroid;
};

export default function SimulatorPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [impactLocation, setImpactLocation] = useState<Coordinates | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImpact, setShowImpact] = useState(false);
  const [impactPixel, setImpactPixel] = useState<{x: number, y: number} | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleLocationSelect = (coords: Coordinates, pixel?: {x: number, y: number}) => {
    if (isBusy) return;
    setImpactLocation(coords);
    if(pixel) setImpactPixel(pixel);
    setReport(null);
    setError(null);
  };
  
  const addBotMessageToChat = (content: string) => {
    setChatMessages(prev => [...prev, { role: 'model', content }]);
  };

  const handleSimulate = async (data: ImpactFormData) => {
    if (!impactLocation) {
      toast({
        variant: 'destructive',
        title: 'No location selected',
        description: 'Please click on the map to select an impact location.',
      });
      return;
    }
    
    const selectedAsteroid = asteroids.find(a => a.full_name === data.asteroidName);
    if (!selectedAsteroid) {
        toast({
            variant: 'destructive',
            title: 'Invalid Asteroid',
            description: 'Please select a valid asteroid from the list.',
        });
        return;
    }

    setIsBusy(true);
    setError(null);
    setReport(null);
    setShowImpact(true);

    // Get fun fact about asteroid
    const funFactResponse = await getChatbotResponse({
      history: chatMessages,
      appContext: { type: 'simulationStart', data: selectedAsteroid }
    });
    if (funFactResponse.success && funFactResponse.data) {
      addBotMessageToChat(funFactResponse.data);
    }

    const simulationResults = calculateImpactMetrics(selectedAsteroid.H);
    
    const input = {
      latitude: impactLocation.lat,
      longitude: impactLocation.lng,
      meteoriteSizeInKilograms: parseFloat(simulationResults.M_mass_kg),
      radiusInKilometers: parseFloat(simulationResults.R_blast_km),
    };

    const result = await getImpactAssessment(input);

    if (result.success && result.data) {
      const newReport = { 
        ...result.data,
        simulation: simulationResults,
        asteroid: selectedAsteroid
      };
      setReport(newReport);

      // Get reaction to report
       const reactionResponse = await getChatbotResponse({
        history: chatMessages,
        appContext: { type: 'reportGenerated', data: result.data }
      });
      if (reactionResponse.success && reactionResponse.data) {
        addBotMessageToChat(reactionResponse.data);
      }

    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        variant: 'destructive',
        title: 'Simulation Failed',
        description: result.error || 'Could not get a report from the AI model.',
      });
    }

    setIsBusy(false);
    setTimeout(() => {
      setShowImpact(false);
      setImpactPixel(null);
    }, 2000);
  };
  
  const handleReset = () => {
    setImpactLocation(null);
    setReport(null);
    setError(null);
    setIsBusy(false);
    setShowImpact(false);
    setImpactPixel(null);
    setChatMessages([]);
  };

  return (
    <main className="grid h-screen w-screen grid-cols-1 md:grid-cols-[400px_1fr_350px]">
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
        <MapView onLocationSelect={handleLocationSelect} selectedLocation={impactLocation} />
        {showImpact && impactPixel && <ImpactAnimation x={impactPixel.x} y={impactPixel.y} />}
         {!impactLocation && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/50">
            <div className="max-w-md rounded-lg bg-background/80 p-8 text-center text-foreground shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl font-bold">Select Impact Location</h2>
              <p className="mt-2 text-muted-foreground">
                Click anywhere on the map to choose a point of impact for the meteorite.
              </p>
            </div>
          </div>
        )}
      </div>
      <aside className="z-10 flex h-full flex-col gap-4 overflow-y-auto bg-background/70 p-4 backdrop-blur-sm">
        <AsteroidStats />
        <Separator />
        <ContextualChatbot messages={chatMessages} setMessages={setChatMessages} />
      </aside>
    </main>
  );
}
