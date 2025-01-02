import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface EditIngredientWeightDialogProps {
  ingredient: Ingredient;
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
}

export function EditIngredientWeightDialog({
  ingredient,
  isOpen,
  onClose,
  onSave,
}: EditIngredientWeightDialogProps) {
  const [weight, setWeight] = useState(ingredient.amount.toString());

  const handleSave = () => {
    const newWeight = parseFloat(weight);
    if (isNaN(newWeight) || newWeight <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight greater than 0",
        variant: "destructive",
      });
      return;
    }

    const confirmSave = window.confirm(
      `Are you sure you want to set ${ingredient.name} to ${newWeight}g?`
    );

    if (confirmSave) {
      onSave(newWeight);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {ingredient.name} Weight</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="col-span-4"
              placeholder="Enter weight in grams"
              min="0"
              step="0.1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}