import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface WeightGoalCardProps {
  onGoalSet: (current: number, target: number) => void;
}

export const WeightGoalCard = ({ onGoalSet }: WeightGoalCardProps) => {
  const { toast } = useToast();
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [targetWeight, setTargetWeight] = useState<number>(0);

  const handleSetGoal = () => {
    if (currentWeight <= 0 || targetWeight <= 0) {
      toast({
        title: "Invalid weights",
        description: "Please enter valid weights greater than 0",
        variant: "destructive",
      });
      return;
    }
    onGoalSet(currentWeight, targetWeight);
    toast({
      title: "Goal set",
      description: `Current: ${currentWeight}kg, Target: ${targetWeight}kg`,
    });
  };

  return (
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
  );
};