import { useState } from "react";
import { FoodSelect } from "@/components/FoodSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface RecipeIngredientSelectProps {
  onAddIngredient: (ingredient: Ingredient) => void;
}

export function RecipeIngredientSelect({ onAddIngredient }: RecipeIngredientSelectProps) {
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [weight, setWeight] = useState<number>(0);

  const handleAddIngredient = () => {
    if (!selectedFood || !weight) return;

    // Calculate the ratio based on the entered weight
    const ratio = weight / 100; // Convert from per 100g to actual weight

    const ingredient: Ingredient = {
      name: selectedFood.name,
      amount: weight,
      calories: (selectedFood.calories || 0) * ratio,
      protein: (selectedFood.protein || 0) * ratio,
      carbs: (selectedFood.carbs || 0) * ratio,
      fat: (selectedFood.fat || 0) * ratio,
      fiber: (selectedFood.fibre || 0) * ratio, // Note: 'fibre' is the property name in the food list
    };

    onAddIngredient(ingredient);
    setSelectedFood(null);
    setWeight(0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <FoodSelect
            onFoodSelect={setSelectedFood}
            selectedFood={selectedFood}
          />
        </div>
        <div className="w-32">
          <Input
            type="number"
            placeholder="Weight (g)"
            value={weight || ''}
            onChange={(e) => setWeight(Number(e.target.value))}
            min="0"
          />
        </div>
        <Button 
          onClick={handleAddIngredient}
          disabled={!selectedFood || !weight}
        >
          Add
        </Button>
      </div>
    </div>
  );
}