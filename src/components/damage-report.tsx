import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Report } from '@/app/page';

export function DamageReport({ report }: { report: Report }) {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Damage Assessment</CardTitle>
        <CardDescription>AI-Generated Impact Report</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/90">{report.summary}</p>
      </CardContent>
    </Card>
  );
}
