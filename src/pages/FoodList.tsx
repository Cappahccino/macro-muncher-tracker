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

const FoodList = () => {
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newFood, setNewFood] = useState<FoodItem>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fibre: 0,
    notes: "",
  });

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.name) {
      toast({
        title: "Error",
        description: "Please enter a food name",
        variant: "destructive",
      });
      return;
    }
    setFoodItems([...foodItems, newFood]);
    setNewFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fibre: 0,
      notes: "",
    });
    toast({
      title: "Success",
      description: "Food item added successfully",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Food List</h1>
      
      <Card className="p-4">
        <form onSubmit={handleAddFood} className="space-y-4">
          <Input
            placeholder="Food name"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="Calories"
              value={newFood.calories || ""}
              onChange={(e) =>
                setNewFood({ ...newFood, calories: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Protein (g)"
              value={newFood.protein || ""}
              onChange={(e) =>
                setNewFood({ ...newFood, protein: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Carbs (g)"
              value={newFood.carbs || ""}
              onChange={(e) =>
                setNewFood({ ...newFood, carbs: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Fat (g)"
              value={newFood.fat || ""}
              onChange={(e) =>
                setNewFood({ ...newFood, fat: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="Fibre (g)"
              value={newFood.fibre || ""}
              onChange={(e) =>
                setNewFood({ ...newFood, fibre: Number(e.target.value) })
              }
            />
          </div>
          <Textarea
            placeholder="Notes (e.g., food source)"
            value={newFood.notes}
            onChange={(e) => setNewFood({ ...newFood, notes: e.target.value })}
          />
          <Button type="submit" className="w-full">
            Add Food Item
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        {foodItems.map((food, index) => (
          <Card key={index} className="p-4">
            <h3 className="font-bold text-lg">{food.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <p>Calories: {food.calories}</p>
              <p>Protein: {food.protein}g</p>
              <p>Carbs: {food.carbs}g</p>
              <p>Fat: {food.fat}g</p>
              <p>Fibre: {food.fibre}g</p>
            </div>
            {food.notes && (
              <p className="mt-2 text-gray-600">Notes: {food.notes}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FoodList;