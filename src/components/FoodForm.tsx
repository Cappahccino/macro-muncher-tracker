import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { MacroInputs } from "./MacroInputs";
import { FoodFormActions } from "./FoodFormActions";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  notes: string;
  weight: number;
}

interface FoodFormProps {
  onSave: (food: FoodItem) => void;
  initialFood?: FoodItem;
  onCancel?: () => void;
}

export function FoodForm({ onSave, initialFood, onCancel }: FoodFormProps) {
  const { toast } = useToast();
  const [food, setFood] = useState<FoodItem>(
    initialFood || {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fibre: 0,
      notes: "",
      weight: 100, // Default weight is 100g
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!food.name) {
      toast({
        title: "Error",
        description: "Please enter a food name",
        variant: "destructive",
      });
      return;
    }
    onSave(food);
  };

  const handleMacroChange = (field: string, value: number) => {
    setFood({ ...food, [field]: value });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Food name"
          value={food.name}
          onChange={(e) => setFood({ ...food, name: e.target.value })}
        />
        <MacroInputs
          weight={food.weight}
          calories={food.calories}
          protein={food.protein}
          carbs={food.carbs}
          fat={food.fat}
          fibre={food.fibre}
          onChange={handleMacroChange}
        />
        <Textarea
          placeholder="Notes (e.g., food source)"
          value={food.notes}
          onChange={(e) => setFood({ ...food, notes: e.target.value })}
        />
        <FoodFormActions 
          isEditing={!!initialFood} 
          onCancel={onCancel}
        />
      </form>
    </Card>
  );
}