import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

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
  onEdit?: (index: number, ingredient: Ingredient) => void;
}

export function IngredientsList({ ingredients, onEdit }: IngredientsListProps) {
  if (!ingredients?.length) return null;

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
                    Fat: {Math.round(ingredient.fat)}g
                  </span>
                </div>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(index, ingredient)}
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
    </div>
  );
}