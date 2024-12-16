import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  notes: string;
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

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Food name"
          value={food.name}
          onChange={(e) => setFood({ ...food, name: e.target.value })}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input
            type="number"
            placeholder="Calories"
            value={food.calories || ""}
            onChange={(e) => setFood({ ...food, calories: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Protein (g)"
            value={food.protein || ""}
            onChange={(e) => setFood({ ...food, protein: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Carbs (g)"
            value={food.carbs || ""}
            onChange={(e) => setFood({ ...food, carbs: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Fat (g)"
            value={food.fat || ""}
            onChange={(e) => setFood({ ...food, fat: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Fibre (g)"
            value={food.fibre || ""}
            onChange={(e) => setFood({ ...food, fibre: Number(e.target.value) })}
          />
        </div>
        <Textarea
          placeholder="Notes (e.g., food source)"
          value={food.notes}
          onChange={(e) => setFood({ ...food, notes: e.target.value })}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {initialFood ? "Update Food Item" : "Add Food Item"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}