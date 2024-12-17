import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WeightEntry } from "./types";

interface WeightEntryCardProps {
  onEntryAdd: (entry: WeightEntry) => void;
}

export const WeightEntryCard = ({ onEntryAdd }: WeightEntryCardProps) => {
  const { toast } = useToast();
  const [morningWeight, setMorningWeight] = useState<string>("");
  const [nightWeight, setNightWeight] = useState<string>("");

  const handleAddEntry = () => {
    const morning = parseFloat(morningWeight);
    const night = parseFloat(nightWeight);

    if (isNaN(morning) || isNaN(night) || morning <= 0 || night <= 0) {
      toast({
        title: "Invalid weights",
        description: "Please enter valid weights greater than 0",
        variant: "destructive",
      });
      return;
    }

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      morningWeight: morning,
      nightWeight: night,
      calories: 2000, // This would come from daily totals
      protein: 150,   // This would come from daily totals
      carbs: 200,     // This would come from daily totals
      fat: 70,        // This would come from daily totals
      weightChange: 0, // This will be calculated in the parent component
    };

    onEntryAdd(newEntry);
    setMorningWeight("");
    setNightWeight("");
    toast({
      title: "Entry added",
      description: "Weight entry has been recorded",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Entry</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <div className="grid gap-2">
          <label>Morning Weight (kg)</label>
          <Input
            type="number"
            value={morningWeight}
            onChange={(e) => setMorningWeight(e.target.value)}
            placeholder="Enter morning weight"
            step="0.1"
          />
        </div>
        <div className="grid gap-2">
          <label>Night Weight (kg)</label>
          <Input
            type="number"
            value={nightWeight}
            onChange={(e) => setNightWeight(e.target.value)}
            placeholder="Enter night weight"
            step="0.1"
          />
        </div>
        <Button className="self-end" onClick={handleAddEntry}>Add Entry</Button>
      </CardContent>
    </Card>
  );
};