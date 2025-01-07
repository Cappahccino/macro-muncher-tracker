import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";
import { useRecipeToast } from "./useRecipeToast";

interface Recipe {
  title: string;
  notes: string;
  instructions: string[];
  ingredients: any[];
  macros: any;
}

export function useRecipeVault() {
  const navigate = useNavigate();
  const { saveRecipe } = useSaveRecipe();
  const { showSuccessToast, showErrorToast } = useRecipeToast();

  const saveToVault = async (recipe: Recipe) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        showErrorToast("Please sign in to save to vault");
        navigate("/sign-in");
        return;
      }

      const recipeForVault = {
        title: recipe.title,
        description: recipe.notes,
        instructions: {
          steps: recipe.instructions
        },
        ingredients: recipe.ingredients.map(ingredient => ({
          name: ingredient.name,
          amount: ingredient.amount,
          macros: {
            calories: ingredient.calories,
            protein: ingredient.protein,
            carbs: ingredient.carbs,
            fat: ingredient.fat,
            fiber: ingredient.fiber,
          }
        })),
        macronutrients: {
          perServing: recipe.macros
        },
        total_calories: recipe.macros.calories,
        total_protein: recipe.macros.protein,
        total_carbs: recipe.macros.carbs,
        total_fat: recipe.macros.fat,
        total_fiber: recipe.macros.fiber
      };

      await saveRecipe(recipeForVault);
      showSuccessToast("Recipe saved to vault successfully");
    } catch (error) {
      console.error('Error saving to vault:', error);
      showErrorToast("Failed to save recipe to vault");
    }
  };

  return {
    saveToVault,
  };
}