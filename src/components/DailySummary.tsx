import { Card } from "@/components/ui/card";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface DailySummaryProps {
  meals: Meal[];
}

export function DailySummary({ meals }: DailySummaryProps) {
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
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{meal.calories} cal</span>
              <span>{meal.protein}g P</span>
              <span>{meal.carbs}g C</span>
              <span>{meal.fat}g F</span>
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