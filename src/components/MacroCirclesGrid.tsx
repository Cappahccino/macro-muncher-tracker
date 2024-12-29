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

  const macros = [
    { label: "Calories", key: "calories" as const, color: "stroke-primary", max: 10000 },
    { label: "Protein", key: "protein" as const, color: "stroke-secondary", max: 1000 },
    { label: "Carbs", key: "carbs" as const, color: "stroke-accent", max: 1000 },
    { label: "Fat", key: "fat" as const, color: "stroke-destructive", max: 1000 }
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {macros.map((macro) => (
        <motion.div key={macro.key} variants={item}>
          <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
            <MacroCircle
              label={macro.label}
              current={totals[macro.key]}
              target={targets[macro.key]}
              color={macro.color}
            />
            <div className="px-2 mt-4">
              <Input
                type="number"
                value={targets[macro.key]}
                onChange={(e) => onTargetChange(e.target.value, macro.key)}
                className="text-center"
                min="0"
                max={macro.max}
              />
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}