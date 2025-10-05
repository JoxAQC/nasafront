'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen text-foreground bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/fondo.png')",
      }}
    >
      <div className="flex flex-col items-center gap-8 animate-fade-in-up bg-black/50 p-10 rounded-2xl backdrop-blur-sm">
        <h1 className="text-8xl font-bold text-primary tracking-tighter drop-shadow-lg">
          NeoSentinel
        </h1>
        <p className="text-lg text-muted-foreground -mt-4 text-white drop-shadow">
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
