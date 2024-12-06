import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface AddMealFormProps {
  onAddMeal: (meal: Meal) => void;
}

export function AddMealForm({ onAddMeal }: AddMealFormProps) {
  const { toast } = useToast();
  const [meal, setMeal] = useState<Meal>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

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
    toast({
      title: "Success",
      description: "Meal added successfully",
    });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Meal name"
            value={meal.name}
            onChange={(e) => setMeal({ ...meal, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              type="number"
              placeholder="Calories"
              value={meal.calories || ""}
              onChange={(e) =>
                setMeal({ ...meal, calories: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Protein (g)"
              value={meal.protein || ""}
              onChange={(e) =>
                setMeal({ ...meal, protein: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Carbs (g)"
              value={meal.carbs || ""}
              onChange={(e) => setMeal({ ...meal, carbs: Number(e.target.value) })}
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Fat (g)"
              value={meal.fat || ""}
              onChange={(e) => setMeal({ ...meal, fat: Number(e.target.value) })}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Add Meal
        </Button>
      </form>
    </Card>
  );
}