import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealDetailsProps {
  meal: Meal;
}

export function MealDetails({ meal }: MealDetailsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">{meal.name}</h2>
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Calories</p>
            <p className="text-2xl font-bold">{meal.calories}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Protein</p>
            <p className="text-2xl font-bold">{meal.protein}g</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Carbs</p>
            <p className="text-2xl font-bold">{meal.carbs}g</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Fat</p>
            <p className="text-2xl font-bold">{meal.fat}g</p>
          </div>
        </div>
      </Card>
    </div>
  );
}