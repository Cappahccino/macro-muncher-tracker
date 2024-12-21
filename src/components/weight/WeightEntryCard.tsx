import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { WeightEntry } from "./types";
import { Plus } from "lucide-react";

interface WeightEntryCardProps {
  onEntryAdd: (entry: WeightEntry) => void;
}

export const WeightEntryCard = ({ onEntryAdd }: WeightEntryCardProps) => {
  const { toast } = useToast();
  const [morningWeight, setMorningWeight] = useState<number>(0);
  const [nightWeight, setNightWeight] = useState<number>(0);

  const handleAddEntry = () => {
    if (morningWeight <= 0 || nightWeight <= 0) {
      toast({
        title: "Invalid weights",
        description: "Please enter valid weights greater than 0",
        variant: "destructive",
      });
      return;
    }

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      morningWeight,
      nightWeight,
      calories: 2000,
      protein: 150,
      carbs: 200,
      fat: 70,
      weightChange: 0,
    };

    onEntryAdd(newEntry);
    setMorningWeight(0);
    setNightWeight(0);
    
    toast({
      title: "Entry added",
      description: "Weight entry has been recorded",
    });
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add Daily Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Morning Weight (kg)</label>
          <Input
            type="number"
            value={morningWeight || ''}
            onChange={(e) => setMorningWeight(Number(e.target.value))}
            className="bg-background"
            placeholder="0.0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Night Weight (kg)</label>
          <Input
            type="number"
            value={nightWeight || ''}
            onChange={(e) => setNightWeight(Number(e.target.value))}
            className="bg-background"
            placeholder="0.0"
          />
        </div>
        <Button 
          className="w-full" 
          onClick={handleAddEntry}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Entry
        </Button>
      </CardContent>
    </Card>
  );
};