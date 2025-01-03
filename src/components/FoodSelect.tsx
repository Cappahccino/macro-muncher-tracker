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
      
      // Check if this component already exists in the current template
      const templates = JSON.parse(localStorage.getItem('mealTemplates') || '[]');
      const currentTemplate = templates.find((template: any) => 
        template.components.some((comp: any) => comp.name === food.name)
      );

      if (currentTemplate) {
        setPendingComponent(newComponent);
        setShowConfirmDialog(true);
      } else {
        onAddComponent(newComponent);
        resetForm();
      }
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
            <AlertDialogTitle>Update Component</AlertDialogTitle>
            <AlertDialogDescription>
              This food item already exists in the template. Do you want to update it with the new weight and macros?
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
              Update Component
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}