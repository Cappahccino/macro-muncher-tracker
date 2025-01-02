import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | undefined;
  onSave: (weight: number) => void;
}

export function EditIngredientWeightDialog({
  open,
  onOpenChange,
  ingredient,
  onSave,
}: EditIngredientWeightDialogProps) {
  const [weight, setWeight] = useState<number>(0);

  useEffect(() => {
    if (ingredient) {
      setWeight(ingredient.amount);
    }
  }, [ingredient]);

  if (!ingredient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {ingredient.name} Weight</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              Weight (g)
            </label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onSave(weight)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}