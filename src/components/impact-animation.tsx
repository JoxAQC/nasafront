'use client';

export function ImpactAnimation({ x, y }: { x: number; y: number; }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute"
        style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="absolute w-64 h-64 bg-accent/80 rounded-full animate-impact-flash"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="absolute rounded-full border-accent animate-shockwave"
          style={{ width: 400, height: 400, transform: 'translate(-50%, -50%)' }}
        />
        <div
          className="absolute w-12 h-12 bg-red-600 rounded-full border border-red-800 animate-crater-appear"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );
}
