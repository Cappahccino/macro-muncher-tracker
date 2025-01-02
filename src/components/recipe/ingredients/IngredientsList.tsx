import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditIngredientWeightDialog } from "../EditIngredientWeightDialog";

interface Ingredient {
  recipe_ingredient_id: string;
  name: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
  onIngredientUpdate?: () => void;
}

export function IngredientsList({ ingredients, onIngredientUpdate }: IngredientsListProps) {
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const handleWeightUpdate = (weight: number) => {
    if (onIngredientUpdate) {
      onIngredientUpdate();
    }
  };

  if (!ingredients?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Ingredients
      </h3>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <ul className="space-y-2">
          {ingredients.map((ingredient) => (
            <li key={ingredient.recipe_ingredient_id} className="text-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span>{ingredient.name} - {Math.round(ingredient.quantity_g)}g</span>
                  <span className="text-sm text-gray-400">
                    Calories: {Math.round(ingredient.calories)} | 
                    Protein: {Math.round(ingredient.protein)}g | 
                    Carbs: {Math.round(ingredient.carbs)}g | 
                    Fat: {Math.round(ingredient.fat)}g
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingIngredient(ingredient)}
                  className="ml-2"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <EditIngredientWeightDialog
        open={editingIngredient !== null}
        onOpenChange={(open) => !open && setEditingIngredient(null)}
        ingredient={editingIngredient}
        onSave={handleWeightUpdate}
      />
    </div>
  );
}