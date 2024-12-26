import { MacroCircle } from "@/components/MacroCircle";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroCirclesGridProps {
  totals: MacroTarget;
  targets: MacroTarget;
  onTargetChange: (value: string, key: keyof MacroTarget) => void;
}

export function MacroCirclesGrid({ totals, targets, onTargetChange }: MacroCirclesGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-4 gap-4"
    >
      <motion.div variants={item} className="space-y-4">
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <MacroCircle
            label="Calories"
            current={totals.calories}
            target={targets.calories}
            color="stroke-primary"
          />
          <div className="px-2 mt-4">
            <Input
              type="number"
              value={targets.calories}
              onChange={(e) => onTargetChange(e.target.value, "calories")}
              className="text-center"
              min="0"
              max="10000"
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <MacroCircle
            label="Protein"
            current={totals.protein}
            target={targets.protein}
            color="stroke-secondary"
          />
          <div className="px-2 mt-4">
            <Input
              type="number"
              value={targets.protein}
              onChange={(e) => onTargetChange(e.target.value, "protein")}
              className="text-center"
              min="0"
              max="1000"
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <MacroCircle
            label="Carbs"
            current={totals.carbs}
            target={targets.carbs}
            color="stroke-accent"
          />
          <div className="px-2 mt-4">
            <Input
              type="number"
              value={targets.carbs}
              onChange={(e) => onTargetChange(e.target.value, "carbs")}
              className="text-center"
              min="0"
              max="1000"
            />
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
          <MacroCircle
            label="Fat"
            current={totals.fat}
            target={targets.fat}
            color="stroke-destructive"
          />
          <div className="px-2 mt-4">
            <Input
              type="number"
              value={targets.fat}
              onChange={(e) => onTargetChange(e.target.value, "fat")}
              className="text-center"
              min="0"
              max="1000"
            />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}