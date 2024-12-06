import { useState } from "react";
import { MacroCircle } from "@/components/MacroCircle";
import { AddMealForm } from "@/components/AddMealForm";
import { DailySummary } from "@/components/DailySummary";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);

  const targets = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">MyMacros</h1>
        <Button onClick={() => navigate("/food-list")}>Food List</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MacroCircle
          label="Calories"
          current={totals.calories}
          target={targets.calories}
          color="stroke-primary"
        />
        <MacroCircle
          label="Protein"
          current={totals.protein}
          target={targets.protein}
          color="stroke-secondary"
        />
        <MacroCircle
          label="Carbs"
          current={totals.carbs}
          target={targets.carbs}
          color="stroke-accent"
        />
        <MacroCircle
          label="Fat"
          current={totals.fat}
          target={targets.fat}
          color="stroke-destructive"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <AddMealForm onAddMeal={handleAddMeal} />
        <DailySummary meals={meals} />
      </div>
    </div>
  );
};

export default Index;