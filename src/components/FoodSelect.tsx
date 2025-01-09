import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
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
}

interface FoodSelectProps {
  onSelect: (food: FoodItem | null) => void;
}

export function FoodSelect({ onSelect }: FoodSelectProps) {
  const [selectedFood, setSelectedFood] = useState<string>("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingComponent, setPendingComponent] = useState<any>(null);
  
  const foodItems: FoodItem[] = JSON.parse(localStorage.getItem('foodItems') || '[]');

  const handleFoodSelect = (foodName: string) => {
    setSelectedFood(foodName);
    const food = foodItems.find(item => item.name === foodName);
    onSelect(food || null);
  };

  return (
    <div className="w-full">
      <Select value={selectedFood} onValueChange={handleFoodSelect}>
        <SelectTrigger>
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Ingredient</AlertDialogTitle>
            <AlertDialogDescription>
              This ingredient already exists in the recipe. Do you want to update it?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              setSelectedFood("");
              setPendingComponent(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              // Handle confirmation if needed
              setShowConfirmDialog(false);
            }}>
              Update Ingredient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
