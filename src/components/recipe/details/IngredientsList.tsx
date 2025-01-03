import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditIngredientWeightDialog } from "../EditIngredientWeightDialog";

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
  onUpdateIngredient?: (index: number, newAmount: number) => void;
}

export function IngredientsList({ ingredients, onUpdateIngredient }: IngredientsListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  if (!ingredients?.length) return null;

  const handleSave = (newAmount: number) => {
    if (editingIndex !== null && onUpdateIngredient) {
      onUpdateIngredient(editingIndex, newAmount);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Ingredients
      </h3>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span>{ingredient.name} - {Math.round(ingredient.amount)}g</span>
                  <span className="text-sm text-gray-400">
                    Calories: {Math.round(ingredient.calories)} | 
                    Protein: {Math.round(ingredient.protein)}g | 
                    Carbs: {Math.round(ingredient.carbs)}g | 
                    Fat: {Math.round(ingredient.fat)}g |
                    Fiber: {Math.round(ingredient.fiber)}g
                  </span>
                </div>
                {onUpdateIngredient && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingIndex(index)}
                    className="ml-2"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingIndex !== null && (
        <EditIngredientWeightDialog
          ingredient={ingredients[editingIndex]}
          isOpen={editingIndex !== null}
          onClose={() => setEditingIndex(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}