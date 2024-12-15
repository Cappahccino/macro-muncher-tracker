import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Trash2, Edit, Check, X } from "lucide-react";

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFood, setNewFood] = useState<FoodItem>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fibre: 0,
    notes: "",
  });

  // Load food items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('foodItems');
    if (savedItems) {
      setFoodItems(JSON.parse(savedItems));
    }
  }, []);

  // Save food items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);

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

    if (editingIndex !== null) {
      // Update existing food item
      const updatedItems = [...foodItems];
      updatedItems[editingIndex] = newFood;
      setFoodItems(updatedItems);
      setEditingIndex(null);
      toast({
        title: "Success",
        description: "Food item updated successfully",
      });
    } else {
      // Add new food item
      setFoodItems([...foodItems, newFood]);
      toast({
        title: "Success",
        description: "Food item added successfully",
      });
    }

    setNewFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fibre: 0,
      notes: "",
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setNewFood(foodItems[index]);
  };

  const handleDelete = (index: number) => {
    const updatedItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedItems);
    toast({
      title: "Success",
      description: "Food item deleted successfully",
    });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fibre: 0,
      notes: "",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Food List</h1>
        </div>
      </div>
      
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
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingIndex !== null ? "Update Food Item" : "Add Food Item"}
            </Button>
            {editingIndex !== null && (
              <Button type="button" variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-4">
        {foodItems.map((food, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{food.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <p>Calories: {food.calories}</p>
                  <p>Protein: {food.protein}g</p>
                  <p>Carbs: {food.carbs}g</p>
                  <p>Fat: {food.fat}g</p>
                  <p>Fibre: {food.fibre}g</p>
                </div>
                {food.notes && (
                  <p className="mt-2 text-muted-foreground">Notes: {food.notes}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(index)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FoodList;