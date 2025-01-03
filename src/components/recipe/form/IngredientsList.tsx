import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  editingIndex: number | null;
  editWeight: number;
  onDeleteIngredient: (index: number) => void;
  onStartEditingWeight: (index: number) => void;
  onEditWeightChange: (weight: number) => void;
  onUpdateWeight: () => void;
}

export function IngredientsList({
  ingredients,
  editingIndex,
  editWeight,
  onDeleteIngredient,
  onStartEditingWeight,
  onEditWeightChange,
  onUpdateWeight,
}: IngredientsListProps) {
  if (!ingredients.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Ingredients List</h3>
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="font-medium">{ingredient.name}</p>
              {editingIndex === index ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    value={editWeight}
                    onChange={(e) => onEditWeightChange(Number(e.target.value))}
                    className="w-24"
                  />
                  <Button size="sm" onClick={onUpdateWeight}>
                    Update
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Weight: {ingredient.amount}g | 
                  Calories: {Math.round(ingredient.calories)} | 
                  P: {Math.round(ingredient.protein)}g | 
                  C: {Math.round(ingredient.carbs)}g | 
                  F: {Math.round(ingredient.fat)}g |
                  Fiber: {Math.round(ingredient.fiber)}g
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStartEditingWeight(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteIngredient(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}