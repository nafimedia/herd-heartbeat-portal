import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  delta,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string;
  hint?: string;
  delta?: number;
  icon: LucideIcon;
  tone?: "primary" | "accent" | "success" | "warning" | "destructive";
}) {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent",
    success: "bg-success/15 text-success",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium text-muted-foreground">{label}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
            {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
          </div>
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", toneMap[tone])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {delta !== undefined && (
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
                delta >= 0 ? "bg-success/15 text-success" : "bg-destructive/10 text-destructive",
              )}
            >
              {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(delta)}%
            </span>
            <span className="text-muted-foreground">vs bulan lalu</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
