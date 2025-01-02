import { FoodComponent } from "@/types/food";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface IngredientsListProps {
  ingredients: FoodComponent[];
  onEdit?: (index: number, ingredient: FoodComponent) => void;
  onDelete?: (index: number) => void;
}

export function IngredientsList({ ingredients, onEdit, onDelete }: IngredientsListProps) {
  if (!ingredients.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Ingredients:
      </h4>
      {ingredients.map((component, idx) => (
        <div key={idx} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{component.name} - {component.amount}g</p>
              <p className="text-sm text-muted-foreground">
                Calories: {component.calories.toFixed(1)} | 
                Protein: {component.protein.toFixed(1)}g | 
                Carbs: {component.carbs.toFixed(1)}g | 
                Fat: {component.fat.toFixed(1)}g |
                Fiber: {component.fiber?.toFixed(1) || 0}g
              </p>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(idx, component)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}