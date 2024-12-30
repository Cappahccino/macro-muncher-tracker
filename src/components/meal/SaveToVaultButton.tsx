import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Ingredient {
  name: string;
  amount: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface SaveToVaultButtonProps {
  meal: {
    title: string;
    description: string;
    instructions: {
      steps: string[];
      servingSize?: {
        servings: number;
        gramsPerServing: number;
      };
    };
    ingredients?: Ingredient[];
    macronutrients: {
      perServing: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    };
  };
}

export function SaveToVaultButton({ meal }: SaveToVaultButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveToVault = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        return;
      }

      // First, save the recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: session.user.id,
          title: meal.title,
          description: meal.description,
          instructions: meal.instructions,
          total_calories: meal.macronutrients.perServing.calories,
          total_protein: meal.macronutrients.perServing.protein,
          total_carbs: meal.macronutrients.perServing.carbs,
          total_fat: meal.macronutrients.perServing.fat,
          total_fiber: meal.macronutrients.perServing.fiber
        })
        .select()
        .single();

      if (recipeError) {
        console.error('Error saving recipe:', recipeError);
        throw recipeError;
      }

      // Then, save each ingredient with its macros
      if (meal.ingredients && recipe) {
        const ingredientPromises = meal.ingredients.map(async (ingredient) => {
          // First, create or get the ingredient
          const { data: savedIngredient, error: ingredientError } = await supabase
            .from('ingredients')
            .insert({
              name: ingredient.name,
              calories_per_100g: (ingredient.macros.calories / ingredient.amount) * 100,
              protein_per_100g: (ingredient.macros.protein / ingredient.amount) * 100,
              carbs_per_100g: (ingredient.macros.carbs / ingredient.amount) * 100,
              fat_per_100g: (ingredient.macros.fat / ingredient.amount) * 100,
              fiber_per_100g: (ingredient.macros.fiber / ingredient.amount) * 100,
            })
            .select()
            .single();

          if (ingredientError) {
            console.error('Error saving ingredient:', ingredientError);
            throw ingredientError;
          }

          // Then, create the recipe_ingredient relationship with custom macros
          const { error: recipeIngredientError } = await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: recipe.recipe_id,
              ingredient_id: savedIngredient.ingredient_id,
              quantity_g: ingredient.amount,
              custom_calories: ingredient.macros.calories,
              custom_protein: ingredient.macros.protein,
              custom_carbs: ingredient.macros.carbs,
              custom_fat: ingredient.macros.fat,
              custom_fiber: ingredient.macros.fiber
            });

          if (recipeIngredientError) {
            console.error('Error saving recipe ingredient:', recipeIngredientError);
            throw recipeIngredientError;
          }
        });

        await Promise.all(ingredientPromises);
      }

      toast({
        title: "Success",
        description: "Recipe saved to vault successfully",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to vault",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleSaveToVault} className="flex items-center gap-2">
      <Save className="h-4 w-4" />
      Save to Vault
    </Button>
  );
}