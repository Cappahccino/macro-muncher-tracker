import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Scale } from "lucide-react";
import { motion } from "framer-motion";

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
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center space-x-2">
        <Scale className="w-5 h-5 text-primary" />
        <CardTitle>Weight Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="grid gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid gap-2">
            <label className="text-sm font-medium">Current Weight (kg)</label>
            <Input
              type="number"
              value={currentWeight || ''}
              onChange={(e) => setCurrentWeight(Number(e.target.value))}
              placeholder="85"
              className="transition-all duration-300 hover:border-primary focus:border-primary"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Target Weight (kg)</label>
            <Input
              type="number"
              value={targetWeight || ''}
              onChange={(e) => setTargetWeight(Number(e.target.value))}
              placeholder="82"
              className="transition-all duration-300 hover:border-primary focus:border-primary"
            />
          </div>
          <Button 
            onClick={handleSetGoal}
            className="w-full transition-transform hover:scale-105"
          >
            Set Goal
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};