import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function MetricCard({
  label,
  value,
  detail,
  progress
}: {
  label: string;
  value: string;
  detail: string;
  progress?: number;
}) {
  return (
    <Card className="interactive-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        <p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">{detail}</p>
        {typeof progress === "number" ? <Progress value={progress} className="mt-4" /> : null}
      </CardContent>
    </Card>
  );
}
