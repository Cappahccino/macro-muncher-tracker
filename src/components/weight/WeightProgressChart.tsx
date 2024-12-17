import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts";
import { WeightEntry } from "./types";

interface WeightProgressChartProps {
  entries: WeightEntry[];
  currentWeight: number;
  targetWeight: number;
}

export const WeightProgressChart = ({ entries, currentWeight, targetWeight }: WeightProgressChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progress Chart</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ChartContainer
          config={{
            weight: {
              theme: {
                light: "hsl(var(--primary))",
                dark: "hsl(var(--primary))",
              },
            },
          }}
        >
          <LineChart data={entries}>
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip />
            <Line
              type="monotone"
              dataKey="morningWeight"
              stroke="var(--color-weight)"
              strokeWidth={2}
            />
            {currentWeight > 0 && (
              <ReferenceLine 
                y={currentWeight} 
                stroke="blue" 
                strokeDasharray="3 3" 
                label="Starting Weight" 
              />
            )}
            {targetWeight > 0 && (
              <ReferenceLine 
                y={targetWeight} 
                stroke="green" 
                strokeDasharray="3 3" 
                label="Target Weight" 
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};