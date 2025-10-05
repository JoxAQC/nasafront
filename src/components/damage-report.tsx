import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/app/simulator/page';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Mountain, Building2, Landmark, Bomb, Diameter, Scale, Sparkles, AlertTriangle,
  Weight, Telescope, Atom, Sigma, Info, ShieldCheck, Waves
} from 'lucide-react';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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

  const simulationData = [
    {
      icon: Telescope,
      label: "Asteroid Name",
      value: report.asteroid.full_name.trim(),
      tooltip: { title: "Near-Earth Object (NEO)", text: "The official designation for the selected asteroid." }
    },
    {
      icon: Sigma,
      label: "Absolute Magnitude (H)",
      value: report.asteroid.H.toString(),
      tooltip: { title: "Absolute Magnitude (H)", text: "A measure of a celestial object's intrinsic brightness. Lower values mean a brighter (and generally larger) object." }
    },
    {
      icon: Diameter,
      label: "Est. Diameter",
      value: `${report.simulation.D_diameter_m} m`,
      tooltip: { title: "Estimated Diameter", text: "The approximate diameter of the asteroid, calculated from its absolute magnitude (H) and an assumed albedo (reflectivity)." }
    },
    {
      icon: Weight,
      label: "Est. Mass",
      value: `${report.simulation.M_mass_kg} kg`,
      tooltip: { title: "Estimated Mass", text: "Calculated from the estimated diameter and an assumed density for a siliceous (stony) asteroid." }
    },
    {
      icon: Atom,
      label: "Impact Energy",
      value: `${report.simulation.Ek_megatons} MT`,
      tooltip: { title: "Kinetic Energy Released", text: "One megaton (MT) is the energy of one million tons of TNT. For context, the Tunguska event was ~15 MT and the Tsar Bomba, the most powerful nuclear weapon ever detonated, had a yield of ~50 MT." }
    },
    {
      icon: Waves,
      label: "Est. Seismic Magnitude",
      value: `${report.simulation.M_richter} Richter`,
      tooltip: { title: "Estimated Seismic Magnitude", text: "An estimation of the equivalent earthquake magnitude on the Richter scale based on the impact's kinetic energy. This is a simplified model." }
    },
    {
      icon: AlertTriangle,
      label: "Blast Radius",
      value: `${report.simulation.R_blast_km} km`,
      tooltip: { title: "Estimated Blast Radius", text: "The approximate radius of significant destruction from the air blast. This is a simplified estimation." }
    },
     {
      icon: Diameter,
      label: "Crater Diameter",
      value: `${(parseFloat(report.simulation.D_crater_km) * 1000).toLocaleString('en-US', { maximumFractionDigits: 0 })} m`,
      tooltip: { title: "Simple Crater Diameter", text: "An estimation of the final crater's diameter based on a simplified scaling law. The AI provides a more nuanced estimate based on other factors." }
    },
  ];

  function getRiskImage(riskLevel: string) {
    if (riskLevel === 'Low' || riskLevel === 'Moderate') {
      return '/chill.png';
    }
    if (riskLevel === 'High' || riskLevel === 'Catastrophic') {
      return '/risk.png';
    }
    return '/chill.png'; // default
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Impact Report</CardTitle>
        <CardDescription>Simulation & AI-Generated Analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center text-center p-4 bg-muted/30 rounded-lg">
          <img
            src={getRiskImage(report.riskLevel)}
            alt={report.riskLevel + ' risk'}
            className="w-30 h-30 mb-4"
          />
          <Badge
            variant="outline"
            className={`text-lg font-bold px-4 py-1 rounded-full ${riskLevelStyles[report.riskLevel] || ''}`}
          >
            {report.riskLevel} Risk
          </Badge>
        </div>
        
        <TooltipProvider>
            <div>
                <h4 className="font-semibold mb-2 text-base">Simulation Results</h4>
                <Table>
                    <TableBody>
                        {simulationData.map(item => (
                            <TableRow key={item.label}>
                                <TableCell className="font-medium flex items-center gap-2 p-2">
                                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                                    <span>{item.label}</span>
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="max-w-xs text-center p-2">
                                                <p className="font-bold text-base">{item.tooltip.title}</p>
                                                <p className="text-sm text-muted-foreground">{item.tooltip.text}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TableCell>
                                <TableCell className="text-right p-2 text-muted-foreground">{item.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <p className="text-xs text-muted-foreground mt-2 px-1">
                    *Estimates are approximate, based on a simplified model.
                </p>
            </div>
        </TooltipProvider>

        <Separator />
        
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold">Contextual Fact</h4>
              <p className="text-muted-foreground whitespace-pre-line">{report.funFact}</p>
            </div>
          </div>
        </div>
        
        <Separator />

        <div>
          <h4 className="font-semibold mb-2 text-base">Damage Assessment</h4>
          <div className="text-sm text-foreground/90 space-y-4">
            <p>{report.summary}</p>
          </div>
        </div>

        <Separator />

         <div>
          <h4 className="font-semibold mb-2 text-base">Mitigation Strategies</h4>
           <ul className="space-y-3 text-sm text-foreground/90 pl-1">
            {report.mitigationStrategies.map((strategy, index) => (
              <li key={index} className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>

      </CardContent>
    </Card>
  );
}
