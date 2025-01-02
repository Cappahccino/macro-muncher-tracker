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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Ingredient {
  recipe_ingredient_id: string;
  quantity_g: number;
  name: string;
}

interface EditIngredientWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
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
      setWeight(ingredient.quantity_g);
    }
  }, [ingredient]);

  const handleSave = async () => {
    if (!ingredient) return;

    try {
      const { error } = await supabase
        .from('recipe_ingredients')
        .update({ quantity_g: weight })
        .eq('recipe_ingredient_id', ingredient.recipe_ingredient_id);

      if (error) throw error;

      onSave(weight);
      onOpenChange(false);
      
      toast({
        title: "Success",
        description: `Updated ${ingredient.name} weight to ${weight}g`,
      });
    } catch (error) {
      console.error('Error updating ingredient weight:', error);
      toast({
        title: "Error",
        description: "Failed to update ingredient weight",
        variant: "destructive",
      });
    }
  };

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
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}