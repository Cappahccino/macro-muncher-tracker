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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingComponent, setPendingComponent] = useState<any>(null);
  
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
      const newComponent = {
        name: food.name,
        amount: weight,
        ...macros
      };
      setPendingComponent(newComponent);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmAdd = () => {
    if (pendingComponent) {
      onAddComponent(pendingComponent);
      resetForm();
      setShowConfirmDialog(false);
    }
  };

  const resetForm = () => {
    setSelectedFood("");
    setWeight(100);
    setPendingComponent(null);
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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Component</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm the following values:
              <div className="mt-2 space-y-1">
                <p><strong>Food:</strong> {pendingComponent?.name}</p>
                <p><strong>Weight:</strong> {pendingComponent?.amount}g</p>
                <p><strong>Calories:</strong> {pendingComponent?.calories.toFixed(1)}</p>
                <p><strong>Protein:</strong> {pendingComponent?.protein.toFixed(1)}g</p>
                <p><strong>Carbs:</strong> {pendingComponent?.carbs.toFixed(1)}g</p>
                <p><strong>Fat:</strong> {pendingComponent?.fat.toFixed(1)}g</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              resetForm();
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAdd}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}