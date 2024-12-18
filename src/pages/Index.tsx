import { useState, useEffect } from "react";
import { MacroCircle } from "@/components/MacroCircle";
import { AddMealForm } from "@/components/AddMealForm";
import { DailySummary } from "@/components/DailySummary";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const Index = () => {
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>(() => {
    const savedMeals = localStorage.getItem('dailyMeals');
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  
  const [editingMeal, setEditingMeal] = useState<{ index: number; meal: Meal } | null>(null);
  const [targets, setTargets] = useState(() => {
    const savedTargets = localStorage.getItem('macroTargets');
    return savedTargets ? JSON.parse(savedTargets) : {
      calories: 2000,
      protein: 150,
      carbs: 250,
      fat: 70,
    };
  });

  // Save meals whenever they change
  useEffect(() => {
    localStorage.setItem('dailyMeals', JSON.stringify(meals));
  }, [meals]);

  // Save targets whenever they change
  useEffect(() => {
    localStorage.setItem('macroTargets', JSON.stringify(targets));
  }, [targets]);

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
    if (editingMeal !== null) {
      const updatedMeals = [...meals];
      updatedMeals[editingMeal.index] = meal;
      setMeals(updatedMeals);
      setEditingMeal(null);
      toast({
        title: "Success",
        description: "Meal updated successfully",
      });
    } else {
      setMeals([...meals, meal]);
      toast({
        title: "Success",
        description: "Meal added successfully",
      });
    }
  };

  const handleDeleteMeal = (index: number) => {
    const updatedMeals = meals.filter((_, i) => i !== index);
    setMeals(updatedMeals);
    toast({
      title: "Success",
      description: "Meal deleted successfully",
    });
  };

  const handleEditMeal = (index: number, meal: Meal) => {
    setEditingMeal({ index, meal });
  };

  const handleTargetChange = (value: string, key: keyof typeof targets) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    
    const maxValues = {
      calories: 10000,
      protein: 1000,
      carbs: 1000,
      fat: 1000,
    };

    if (numValue > maxValues[key]) {
      toast({
        title: "Value too high",
        description: `Maximum value for ${key} is ${maxValues[key]}`,
        variant: "destructive",
      });
      return;
    }

    setTargets((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <Header />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-4">
          <MacroCircle
            label="Calories"
            current={totals.calories}
            target={targets.calories}
            color="stroke-primary"
          />
          <div className="px-2">
            <Input
              type="number"
              value={targets.calories}
              onChange={(e) => handleTargetChange(e.target.value, "calories")}
              className="text-center"
              min="0"
              max="10000"
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
            <Input
              type="number"
              value={targets.protein}
              onChange={(e) => handleTargetChange(e.target.value, "protein")}
              className="text-center"
              min="0"
              max="1000"
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
            <Input
              type="number"
              value={targets.carbs}
              onChange={(e) => handleTargetChange(e.target.value, "carbs")}
              className="text-center"
              min="0"
              max="1000"
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
            <Input
              type="number"
              value={targets.fat}
              onChange={(e) => handleTargetChange(e.target.value, "fat")}
              className="text-center"
              min="0"
              max="1000"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <AddMealForm onAddMeal={handleAddMeal} initialMeal={editingMeal?.meal} />
        <DailySummary 
          meals={meals} 
          onDeleteMeal={handleDeleteMeal}
          onEditMeal={handleEditMeal}
        />
      </div>
    </div>
  );
};

export default Index;