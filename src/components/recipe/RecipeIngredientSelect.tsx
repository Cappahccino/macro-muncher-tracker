import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Ingredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface RecipeIngredientSelectProps {
  onAddIngredient: (ingredient: {
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }) => void;
}

export function RecipeIngredientSelect({ onAddIngredient }: RecipeIngredientSelectProps) {
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [weight, setWeight] = useState<number>(100);
  
  const foodItems: Ingredient[] = JSON.parse(localStorage.getItem('foodItems') || '[]');

  const calculateMacros = (food: Ingredient, weightInGrams: number) => {
    const ratio = weightInGrams / 100; // Since base values are per 100g
    return {
      calories: (food.calories || 0) * ratio,
      protein: (food.protein || 0) * ratio,
      carbs: (food.carbs || 0) * ratio,
      fat: (food.fat || 0) * ratio,
      fiber: (food.fiber || 0) * ratio,
    };
  };

  const handleAddIngredient = () => {
    const food = foodItems.find(item => item.name === selectedFood);
    if (food) {
      const macros = calculateMacros(food, weight);
      const newIngredient = {
        name: food.name,
        amount: weight,
        ...macros
      };
      onAddIngredient(newIngredient);
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedFood("");
    setWeight(100);
  };

  return (
    <div className="flex gap-4">
      <Select value={selectedFood} onValueChange={setSelectedFood}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a food" />
        </SelectTrigger>
        <SelectContent>
          {foodItems.map((food, index) => (
            <SelectItem key={index} value={food.name}>
              {food.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        placeholder="Weight (g)"
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        className="w-[120px]"
      />
      <Button onClick={handleAddIngredient}>Add Ingredient</Button>
    </div>
  );
}