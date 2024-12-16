import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { FoodForm } from "@/components/FoodForm";
import { FoodItemCard } from "@/components/FoodItemCard";

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

const FoodList = () => {
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const savedItems = localStorage.getItem('foodItems');
    if (savedItems) {
      setFoodItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);

  const handleSaveFood = (food: FoodItem) => {
    if (editingIndex !== null) {
      const updatedItems = [...foodItems];
      updatedItems[editingIndex] = food;
      setFoodItems(updatedItems);
      setEditingIndex(null);
      toast({
        title: "Success",
        description: "Food item updated successfully",
      });
    } else {
      setFoodItems([...foodItems, food]);
      toast({
        title: "Success",
        description: "Food item added successfully",
      });
    }
  };

  const handleDelete = (index: number) => {
    const updatedItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedItems);
    toast({
      title: "Success",
      description: "Food item deleted successfully",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <Header />
      <FoodForm
        onSave={handleSaveFood}
        initialFood={editingIndex !== null ? foodItems[editingIndex] : undefined}
        onCancel={editingIndex !== null ? () => setEditingIndex(null) : undefined}
      />
      <div className="space-y-4">
        {foodItems.map((food, index) => (
          <FoodItemCard
            key={index}
            food={food}
            onEdit={() => setEditingIndex(index)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodList;