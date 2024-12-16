import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useToast } from "@/components/ui/use-toast";

interface WeightEntry {
  date: string;
  morningWeight: number;
  nightWeight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weightChange: number;
}

const WeightProgress = () => {
  const { toast } = useToast();
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [morningWeight, setMorningWeight] = useState<number>(0);
  const [nightWeight, setNightWeight] = useState<number>(0);
  const [entries, setEntries] = useState<WeightEntry[]>([]);

  const handleSetGoal = () => {
    if (currentWeight <= 0 || targetWeight <= 0) {
      toast({
        title: "Invalid weights",
        description: "Please enter valid weights greater than 0",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Goal set",
      description: `Current: ${currentWeight}kg, Target: ${targetWeight}kg`,
    });
  };

  const handleAddEntry = () => {
    if (morningWeight <= 0 || nightWeight <= 0) {
      toast({
        title: "Invalid weights",
        description: "Please enter valid weights greater than 0",
        variant: "destructive",
      });
      return;
    }

    const lastEntry = entries[0];
    const weightChange = lastEntry 
      ? morningWeight - lastEntry.morningWeight
      : 0;

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      morningWeight,
      nightWeight,
      calories: 2000, // This would come from daily totals
      protein: 150,   // This would come from daily totals
      carbs: 200,     // This would come from daily totals
      fat: 70,        // This would come from daily totals
      weightChange,
    };

    setEntries([newEntry, ...entries]);
    toast({
      title: "Entry added",
      description: "Weight entry has been recorded",
    });
  };

  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-8">
      <Header />
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Weight Goal</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="grid gap-2">
              <label>Current Weight (kg)</label>
              <Input
                type="number"
                value={currentWeight || ''}
                onChange={(e) => setCurrentWeight(Number(e.target.value))}
                placeholder="85"
              />
            </div>
            <div className="grid gap-2">
              <label>Target Weight (kg)</label>
              <Input
                type="number"
                value={targetWeight || ''}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                placeholder="82"
              />
            </div>
            <Button className="self-end" onClick={handleSetGoal}>Set Goal</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Entry</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="grid gap-2">
              <label>Morning Weight (kg)</label>
              <Input
                type="number"
                value={morningWeight || ''}
                onChange={(e) => setMorningWeight(Number(e.target.value))}
              />
            </div>
            <div className="grid gap-2">
              <label>Night Weight (kg)</label>
              <Input
                type="number"
                value={nightWeight || ''}
                onChange={(e) => setNightWeight(Number(e.target.value))}
              />
            </div>
            <Button className="self-end" onClick={handleAddEntry}>Add Entry</Button>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Daily Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Morning Weight</TableHead>
                  <TableHead>Night Weight</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Protein</TableHead>
                  <TableHead>Carbs</TableHead>
                  <TableHead>Fat</TableHead>
                  <TableHead>Weight Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.morningWeight}kg</TableCell>
                    <TableCell>{entry.nightWeight}kg</TableCell>
                    <TableCell>{entry.calories}</TableCell>
                    <TableCell>{entry.protein}g</TableCell>
                    <TableCell>{entry.carbs}g</TableCell>
                    <TableCell>{entry.fat}g</TableCell>
                    <TableCell className={entry.weightChange > 0 ? "text-red-500" : "text-green-500"}>
                      {entry.weightChange > 0 ? "+" : ""}{entry.weightChange}kg
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeightProgress;