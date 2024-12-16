import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { WeightEntry } from "./types";

interface WeightProgressChartProps {
  entries: WeightEntry[];
}

export const WeightProgressChart = ({ entries }: WeightProgressChartProps) => {
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
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};