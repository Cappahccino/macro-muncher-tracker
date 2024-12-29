import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailySummaryProps {
  meals: Meal[];
  onDeleteMeal: (index: number) => void;
  onEditMeal: (index: number, meal: Meal) => void;
}

export function DailySummary({ meals, onDeleteMeal, onEditMeal }: DailySummaryProps) {
  const navigate = useNavigate();
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  const toggleMeal = (index: number) => {
    setExpandedMeal(expandedMeal === index ? null : index);
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Today's Meals</h3>
      <div className="space-y-2">
        {meals.map((meal, index) => (
          <div
            key={index}
            className="border rounded-lg hover:bg-muted transition-colors"
          >
            <div
              className="flex justify-between items-center p-3 cursor-pointer"
              onClick={() => toggleMeal(index)}
            >
              <span className="font-medium">{meal.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {Math.round(meal.calories)} cal
                </span>
                {expandedMeal === index ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>

            <AnimatePresence>
              {expandedMeal === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 space-y-3 border-t">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground pt-3">
                      <div>Calories: {Math.round(meal.calories)}</div>
                      <div>Protein: {Math.round(meal.protein)}g</div>
                      <div>Carbs: {Math.round(meal.carbs)}g</div>
                      <div>Fat: {Math.round(meal.fat)}g</div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/meal/${index}`, { state: { meal } });
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMeal(index, meal);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteMeal(index);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        {meals.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No meals added yet
          </p>
        )}
      </div>
    </Card>
  );
}