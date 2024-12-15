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

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
}

interface FoodSelectProps {
  onAddComponent: (component: {
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
}

export function FoodSelect({ onAddComponent }: FoodSelectProps) {
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [weight, setWeight] = useState<number>(100);
  
  const foodItems: FoodItem[] = JSON.parse(localStorage.getItem('foodItems') || '[]');

  const calculateMacros = (food: FoodItem, weightInGrams: number) => {
    const ratio = weightInGrams / 100; // Since base values are per 100g
    return {
      calories: food.calories * ratio,
      protein: food.protein * ratio,
      carbs: food.carbs * ratio,
      fat: food.fat * ratio,
    };
  };

  const handleAddComponent = () => {
    const food = foodItems.find(item => item.name === selectedFood);
    if (food) {
      const macros = calculateMacros(food, weight);
      onAddComponent({
        name: food.name,
        amount: weight,
        ...macros
      });
      setSelectedFood("");
      setWeight(100);
    }
  };

  return (
    <div className="space-y-4">
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
        <Button onClick={handleAddComponent}>Add Component</Button>
      </div>
    </div>
  );
}