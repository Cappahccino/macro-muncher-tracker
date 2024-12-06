import { useState } from "react";
import { MacroCircle } from "@/components/MacroCircle";
import { AddMealForm } from "@/components/AddMealForm";
import { DailySummary } from "@/components/DailySummary";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

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
  const [targets, setTargets] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  });

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

  const handleTargetChange = (value: number[], key: keyof typeof targets) => {
    setTargets((prev) => ({
      ...prev,
      [key]: value[0],
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">MyMacros</h1>
        <Button onClick={() => navigate("/food-list")}>Food List</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-4">
          <MacroCircle
            label="Calories"
            current={totals.calories}
            target={targets.calories}
            color="stroke-primary"
          />
          <div className="px-2">
            <Slider
              defaultValue={[targets.calories]}
              max={5000}
              step={50}
              onValueChange={(value) => handleTargetChange(value, "calories")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <MacroCircle
            label="Protein"
            current={totals.protein}
            target={targets.protein}
            color="stroke-secondary"
          />
          <div className="px-2">
            <Slider
              defaultValue={[targets.protein]}
              max={300}
              step={5}
              onValueChange={(value) => handleTargetChange(value, "protein")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <MacroCircle
            label="Carbs"
            current={totals.carbs}
            target={targets.carbs}
            color="stroke-accent"
          />
          <div className="px-2">
            <Slider
              defaultValue={[targets.carbs]}
              max={500}
              step={5}
              onValueChange={(value) => handleTargetChange(value, "carbs")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <MacroCircle
            label="Fat"
            current={totals.fat}
            target={targets.fat}
            color="stroke-destructive"
          />
          <div className="px-2">
            <Slider
              defaultValue={[targets.fat]}
              max={200}
              step={5}
              onValueChange={(value) => handleTargetChange(value, "fat")}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <AddMealForm onAddMeal={handleAddMeal} />
        <DailySummary meals={meals} />
      </div>
    </div>
  );
};

export default Index;