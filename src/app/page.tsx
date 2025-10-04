'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-8 animate-fade-in-up">
        <h1 className="text-8xl font-bold text-primary tracking-tighter">
          NeoSentinel
        </h1>
        <p className="text-lg text-muted-foreground -mt-4">
          AI-Powered Meteorite Impact Simulation
        </p>
        <Link href="/simulator">
          <Button size="lg" className="mt-4">
            <Rocket className="mr-2 h-5 w-5" />
            Start Simulation
          </Button>
        </Link>
      </div>
    </div>
  );
}
