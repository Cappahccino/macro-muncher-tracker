import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MacroCircleProps {
  label: string;
  current: number;
  target: number;
  color: string;
}

export function MacroCircle({ label, current, target, color }: MacroCircleProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-4 flex flex-col items-center justify-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            className="stroke-muted"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            className={cn("transition-all duration-500", color)}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{current}</span>
          <span className="text-xs text-muted-foreground">/ {target}</span>
        </div>
      </div>
      <span className="mt-2 font-medium">{label}</span>
    </Card>
  );
}