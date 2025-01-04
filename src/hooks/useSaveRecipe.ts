import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { findOrCreateIngredient, addIngredientToRecipe } from "@/utils/recipe/ingredientManagement";

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
  ingredient_id?: string;
}

interface Recipe {
  title: string;
  description: string;
  instructions: {
    steps: string[];
  };
  dietary_tags?: string[];
  ingredients?: Ingredient[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  macronutrients?: {
    perServing: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  };
}

export function useSaveRecipe() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const saveRecipe = async (recipe: Recipe) => {
    try {
      setIsSaving(true);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session found');
      }

      // Create the recipe with user_id
      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          user_id: session.user.id, // Add user_id here
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          dietary_tags: recipe.dietary_tags || [],
          total_calories: recipe.total_calories,
          total_protein: recipe.total_protein,
          total_carbs: recipe.total_carbs,
          total_fat: recipe.total_fat,
          total_fiber: recipe.total_fiber
        }])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // If we have ingredients, add them to the recipe
      if (newRecipe && recipe.ingredients) {
        await Promise.all(
          recipe.ingredients.map(async (ingredient) => {
            const ingredientId = await findOrCreateIngredient(ingredient);
            await addIngredientToRecipe(newRecipe.recipe_id, ingredientId, ingredient);
          })
        );
      }

      toast({
        title: "Success",
        description: "Recipe saved successfully",
      });

      return newRecipe;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveRecipe, isSaving };
}