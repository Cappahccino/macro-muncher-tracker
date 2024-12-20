import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Today's Meals</h3>
      <div className="space-y-2">
        {meals.map((meal, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <span className="font-medium">{meal.name}</span>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>{Math.round(meal.calories)} cal</span>
                <span>{Math.round(meal.protein)}g P</span>
                <span>{Math.round(meal.carbs)}g C</span>
                <span>{Math.round(meal.fat)}g F</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/meal/${index}`, { state: { meal } })}
                  className="h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditMeal(index, meal)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteMeal(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {meals.length === 0 && (
          <p className="text-center text-muted-foreground">No meals added yet</p>
        )}
      </div>
    </Card>
  );
}