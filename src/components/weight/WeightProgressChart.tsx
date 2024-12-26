import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { WeightEntry } from "./types";
import { TrendingDown, TrendingUp } from "lucide-react";

interface WeightProgressChartProps {
  entries: WeightEntry[];
}

export const WeightProgressChart = ({ entries }: WeightProgressChartProps) => {
  const latestEntry = entries[0];
  const previousEntry = entries[1];
  const weightTrend = latestEntry && previousEntry
    ? latestEntry.morningWeight - previousEntry.morningWeight
    : 0;

  return (
    <Card className="bg-card transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Progress Chart</CardTitle>
        {latestEntry && previousEntry && (
          <div className="flex items-center gap-2 text-sm">
            <span>Trend:</span>
            {weightTrend > 0 ? (
              <div className="flex items-center text-destructive">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{weightTrend.toFixed(2)}kg
              </div>
            ) : (
              <div className="flex items-center text-green-500">
                <TrendingDown className="w-4 h-4 mr-1" />
                {weightTrend.toFixed(2)}kg
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              className="h-full"
              config={{
                weight: {
                  theme: {
                    light: "hsl(var(--primary))",
                    dark: "hsl(var(--primary))",
                  },
                },
              }}
            >
              <LineChart 
                data={entries} 
                margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
              >
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}kg`}
                />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="morningWeight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};