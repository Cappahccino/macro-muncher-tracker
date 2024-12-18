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
  const [meal, setMeal] = useState<Meal>(() => {
    const savedMeal = localStorage.getItem('currentMeal');
    if (savedMeal) {
      return JSON.parse(savedMeal);
    }
    return {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  });

  useEffect(() => {
    if (initialMeal) {
      setMeal(initialMeal);
      localStorage.setItem('currentMeal', JSON.stringify(initialMeal));
    }
  }, [initialMeal]);

  useEffect(() => {
    const handleTemplateSelection = (event: any) => {
      const macros = event.detail;
      const updatedMeal = {
        ...meal,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat
      };
      setMeal(updatedMeal);
      localStorage.setItem('currentMeal', JSON.stringify(updatedMeal));
    };

    window.addEventListener('templateSelected', handleTemplateSelection);
    return () => window.removeEventListener('templateSelected', handleTemplateSelection);
  }, [meal]);

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
    const emptyMeal = { name: "", calories: 0, protein: 0, carbs: 0, fat: 0 };
    setMeal(emptyMeal);
    localStorage.setItem('currentMeal', JSON.stringify(emptyMeal));
  };

  const handleMealChange = (updates: Partial<Meal>) => {
    const updatedMeal = { ...meal, ...updates };
    setMeal(updatedMeal);
    localStorage.setItem('currentMeal', JSON.stringify(updatedMeal));
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