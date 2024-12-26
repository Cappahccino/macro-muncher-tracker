import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Target } from "lucide-react";
import { motion } from "framer-motion";

interface WeightGaugeProps {
  currentWeight: number;
  targetWeight: number;
  initialWeight: number;
}

export const WeightGauge = ({ currentWeight, targetWeight, initialWeight }: WeightGaugeProps) => {
  const totalWeightToLose = initialWeight - targetWeight;
  const weightLost = initialWeight - currentWeight;
  const progressPercentage = Math.min(100, Math.max(0, (weightLost / totalWeightToLose) * 100));
  const remainingWeight = currentWeight - targetWeight;

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-primary" />
          <CardTitle>Weight Progress</CardTitle>
        </div>
        <Target className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{initialWeight.toFixed(1)}kg</span>
              <span>{targetWeight.toFixed(1)}kg</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">
                {weightLost > 0 ? '+' : ''}{weightLost.toFixed(1)}kg
              </p>
              <p className="text-sm text-muted-foreground">Weight Lost</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary">
                {remainingWeight.toFixed(1)}kg
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};