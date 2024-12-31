import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MacronutrientSummary } from "./details/MacronutrientSummary";
import { RecipeIngredientsList } from "./details/RecipeIngredientsList";
import { RecipeInstructions } from "./details/RecipeInstructions";
import { RecipeServingInfo } from "./details/RecipeServingInfo";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  ingredients?: {
    name: string;
    amount: number;
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  }[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
}

interface RecipeDetailsDialogProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailsDialog({ recipe, isOpen, onClose }: RecipeDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{recipe.title}</DialogTitle>
        </DialogHeader>

        {(recipe.total_calories || recipe.ingredients?.[0]?.macros) && (
          <MacronutrientSummary
            calories={recipe.total_calories || recipe.ingredients?.reduce((sum, ing) => sum + ing.macros.calories, 0) || 0}
            protein={recipe.total_protein || recipe.ingredients?.reduce((sum, ing) => sum + ing.macros.protein, 0) || 0}
            carbs={recipe.total_carbs || recipe.ingredients?.reduce((sum, ing) => sum + ing.macros.carbs, 0) || 0}
            fat={recipe.total_fat || recipe.ingredients?.reduce((sum, ing) => sum + ing.macros.fat, 0) || 0}
            fiber={recipe.total_fiber || recipe.ingredients?.reduce((sum, ing) => sum + ing.macros.fiber, 0) || 0}
          />
        )}

        {recipe.description && (
          <p className="text-muted-foreground">{recipe.description}</p>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <RecipeIngredientsList ingredients={recipe.ingredients} />
        )}

        {recipe.instructions?.steps && recipe.instructions.steps.length > 0 && (
          <RecipeInstructions steps={recipe.instructions.steps} />
        )}

        {recipe.instructions?.servingSize && (
          <RecipeServingInfo servingSize={recipe.instructions.servingSize} />
        )}
      </DialogContent>
    </Dialog>
  );
}