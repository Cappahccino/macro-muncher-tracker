import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodComponent } from "@/types/food";

interface EditIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: FoodComponent | undefined;
  onSave: (ingredient: FoodComponent) => void;
}

export function EditIngredientDialog({
  open,
  onOpenChange,
  ingredient,
  onSave,
}: EditIngredientDialogProps) {
  const [weight, setWeight] = useState<number>(0);

  useEffect(() => {
    if (ingredient) {
      setWeight(ingredient.amount);
    }
  }, [ingredient]);

  const handleSave = () => {
    if (!ingredient) return;

    const ratio = weight / ingredient.amount;
    const updatedIngredient: FoodComponent = {
      ...ingredient,
      amount: weight,
      calories: ingredient.calories * ratio,
      protein: ingredient.protein * ratio,
      carbs: ingredient.carbs * ratio,
      fat: ingredient.fat * ratio,
      fiber: ingredient.fiber * ratio,
    };

    onSave(updatedIngredient);
    onOpenChange(false);
  };

  if (!ingredient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {ingredient.name}</DialogTitle>
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
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}