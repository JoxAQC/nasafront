import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/app/page';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Mountain, Building2, Landmark, Bomb, Diameter, Scale, Sparkles } from 'lucide-react';

const riskLevelStyles: { [key: string]: string } = {
  Low: 'bg-green-500/20 text-green-300 border-green-500/30',
  Moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  High: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Catastrophic: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const iconMap: { [key: string]: React.ElementType } = {
  Mountain: Mountain,
  Building2: Building2,
  Landmark: Landmark,
  Bomb: Bomb,
};

export function DamageReport({ report }: { report: Report }) {
  const IconComponent = iconMap[report.icon] || Scale;

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Damage Assessment</CardTitle>
        <CardDescription>AI-Generated Impact Analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/30 rounded-lg">
          <IconComponent className="w-16 h-16 mb-4 text-primary" strokeWidth={1} />
          <Badge
            variant="outline"
            className={`text-lg font-bold px-4 py-1 rounded-full ${riskLevelStyles[report.riskLevel] || ''}`}
          >
            {report.riskLevel} Risk
          </Badge>
        </div>

        <div className="text-sm text-foreground/90 space-y-4">
          <p>{report.summary}</p>
        </div>
        
        <Separator />

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Diameter className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Crater Diameter</h4>
              <p className="text-muted-foreground">{report.craterDiameterKm.toLocaleString()} km</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Curious Fact</h4>
              <p className="text-muted-foreground">{report.funFact}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
