import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { MealFormInput } from "./MealFormInput";
import { MacroInputsGrid } from "./MacroInputsGrid";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AddMealFormProps {
  onAddMeal: (meal: Meal) => void;
  initialMeal?: Meal | null;
}

export function AddMealForm({ onAddMeal, initialMeal }: AddMealFormProps) {
  const { toast } = useToast();
  const [meal, setMeal] = useState<Meal>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    if (initialMeal) {
      setMeal(initialMeal);
    }
  }, [initialMeal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!meal.name) {
      toast({
        title: "Error",
        description: "Please enter a meal name",
        variant: "destructive",
      });
      return;
    }
    onAddMeal(meal);
    setMeal({ name: "", calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleMealChange = (updates: Partial<Meal>) => {
    setMeal((prev) => ({ ...prev, ...updates }));
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <MealFormInput
          placeholder="Meal name"
          value={meal.name}
          onChange={(value) => handleMealChange({ name: String(value) })}
          isMealName={true}
        />
        <MacroInputsGrid meal={meal} onMealChange={handleMealChange} />
        <Button type="submit" className="w-full">
          {initialMeal ? "Update Meal" : "Add Meal"}
        </Button>
      </form>
    </Card>
  );
}