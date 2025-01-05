import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { FoodForm } from "@/components/FoodForm";
import { FoodItemCard } from "@/components/FoodItemCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  notes: string;
  weight: number;
}

interface MealTemplate {
  name: string;
  components: { name: string }[];
}

const FoodList = () => {
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [affectedTemplates, setAffectedTemplates] = useState<string[]>([]);

  useEffect(() => {
    const savedItems = localStorage.getItem('foodItems');
    if (savedItems) {
      setFoodItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('foodItems', JSON.stringify(foodItems));
  }, [foodItems]);

  const checkFoodUsage = (foodName: string): string[] => {
    const templates: MealTemplate[] = JSON.parse(localStorage.getItem('mealTemplates') || '[]');
    return templates
      .filter(template => 
        template.components.some(component => component.name === foodName)
      )
      .map(template => template.name);
  };

  const handleDeleteAttempt = (index: number) => {
    const foodItem = foodItems[index];
    const usedIn = checkFoodUsage(foodItem.name);
    
    if (usedIn.length > 0) {
      setAffectedTemplates(usedIn);
      setShowDeleteWarning(true);
      setDeleteIndex(index);
    } else {
      handleDelete(index);
    }
  };

  const handleDelete = (index: number) => {
    const updatedItems = foodItems.filter((_, i) => i !== index);
    setFoodItems(updatedItems);
    toast({
      title: "Success",
      description: "Food item deleted successfully",
    });
    setShowDeleteWarning(false);
    setDeleteIndex(null);
    setAffectedTemplates([]);
  };

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

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <Header />
      <div className="space-y-6">
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
              onDelete={() => handleDeleteAttempt(index)}
            />
          ))}
        </div>
      </div>

      <AlertDialog open={showDeleteWarning} onOpenChange={setShowDeleteWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              This food item is currently used in the following meal templates:
              <ul className="list-disc pl-6 mt-2">
                {affectedTemplates.map((template, index) => (
                  <li key={index}>{template}</li>
                ))}
              </ul>
              Deleting this item will affect these templates. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteWarning(false);
              setDeleteIndex(null);
              setAffectedTemplates([]);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteIndex !== null && handleDelete(deleteIndex)}>
              Delete Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FoodList;