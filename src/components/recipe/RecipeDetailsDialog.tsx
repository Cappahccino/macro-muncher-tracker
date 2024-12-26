import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChefHat, Clock, Utensils } from "lucide-react";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    steps: string[];
    ingredients?: { name: string; amount: number }[];
    macros?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      servings: number;
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

  const formatInstructions = (instructions: any) => {
    if (Array.isArray(instructions.steps)) {
      return instructions.steps.map(step => `• ${step}`).join('\n');
    }
    return 'No instructions available';
  };

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
          {recipe.instructions?.macros && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Nutritional Information (per serving)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Calories</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {Math.round(recipe.instructions.macros.calories)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Protein</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {Math.round(recipe.instructions.macros.protein)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Carbs</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {Math.round(recipe.instructions.macros.carbs)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fat</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {Math.round(recipe.instructions.macros.fat)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fiber</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {Math.round(recipe.instructions.macros.fiber)}g
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Servings</p>
                  <p className="text-lg font-semibold text-gray-200">
                    {recipe.instructions.macros.servings}
                  </p>
                </div>
              </div>
            </div>
          )}

          {recipe.instructions?.ingredients && (
            <div>
              <h4 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
                Ingredients
              </h4>
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                {recipe.instructions.ingredients.map((ingredient, index) => (
                  <p key={index} className="text-sm text-gray-200">
                    • {ingredient.name}: {Math.round(ingredient.amount)}g
                  </p>
                ))}
              </div>
            </div>
          )}

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

          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Instructions
            </h3>
            <div className="prose prose-sm prose-invert max-w-none">
              {recipe.instructions ? (
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-200">
                    {formatInstructions(recipe.instructions)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic">No instructions available</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}