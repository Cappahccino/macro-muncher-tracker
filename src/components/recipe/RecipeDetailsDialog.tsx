import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChefHat, Clock, Utensils } from "lucide-react";
import { MacroNutrient } from "../meal/MacroNutrient";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    ingredients: Array<{ name: string; amount: number }>;
    steps: string[];
    servingSize: {
      servings: number;
      gramsPerServing: number;
    };
    macronutrients: {
      totalCalories: number;
      perServing: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    };
  } | null;
  created_at: string;
  dietary_tags?: string[];
}

interface RecipeDetailsDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailsDialog({ recipe, isOpen, onClose }: RecipeDetailsDialogProps) {
  if (!recipe) return null;

  const macros = recipe.instructions?.macronutrients?.perServing;
  const servingInfo = recipe.instructions?.servingSize;
  const ingredients = recipe.instructions?.ingredients || [];
  const steps = recipe.instructions?.steps || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="h-6 w-6 text-purple-500" />
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {recipe.title}
            </DialogTitle>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Clock className="h-4 w-4" />
            {new Date(recipe.created_at).toLocaleDateString()}
          </div>

          {recipe.description && (
            <div className="flex items-start gap-2 mt-2">
              <Utensils className="h-4 w-4 text-gray-400 mt-1" />
              <DialogDescription className="text-base leading-relaxed text-gray-300">
                {recipe.description}
              </DialogDescription>
            </div>
          )}
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {/* Serving Information */}
          {servingInfo && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Serving Information</h4>
              <p className="text-gray-200">
                Makes {servingInfo.servings} servings ({servingInfo.gramsPerServing}g per serving)
              </p>
            </div>
          )}

          {/* Macronutrients per serving */}
          {macros && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Nutrition (per serving)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-800/50 rounded-lg p-4">
                <MacroNutrient label="Calories" value={macros.calories} unit="" />
                <MacroNutrient label="Protein" value={macros.protein} unit="g" />
                <MacroNutrient label="Carbs" value={macros.carbs} unit="g" />
                <MacroNutrient label="Fat" value={macros.fat} unit="g" />
                <MacroNutrient label="Fiber" value={macros.fiber} unit="g" />
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Ingredients
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-200">
                    {ingredient.name} - {ingredient.amount}g
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Instructions
            </h3>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <ol className="space-y-2 list-decimal list-inside">
                {steps.map((step, index) => (
                  <li key={index} className="text-gray-200">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Dietary Tags */}
          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Dietary Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-purple-900/40 text-purple-200 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}