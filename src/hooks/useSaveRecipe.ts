import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const saveRecipe = async (recipe: Recipe) => {
    setIsSaving(true);
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

      // Insert the recipe
      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          user_id: session.user.id,
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
        const ingredientPromises = recipe.ingredients.map(async (ingredient) => {
          // First, try to find or create the ingredient
          const { data: existingIngredient, error: searchError } = await supabase
            .from('ingredients')
            .select('ingredient_id')
            .eq('name', ingredient.name)
            .single();

          let ingredientId;

          if (existingIngredient) {
            ingredientId = existingIngredient.ingredient_id;
          } else {
            // Create new ingredient if it doesn't exist
            const { data: newIngredient, error: ingredientError } = await supabase
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

            if (ingredientError) throw ingredientError;
            ingredientId = newIngredient.ingredient_id;
          }

          const { error: recipeIngredientError } = await supabase
            .from('recipe_ingredients')
            .insert([{
              recipe_id: newRecipe.recipe_id,
              ingredient_id: ingredientId,
              quantity_g: ingredient.amount,
              custom_calories: ingredient.macros.calories,
              custom_protein: ingredient.macros.protein,
              custom_carbs: ingredient.macros.carbs,
              custom_fat: ingredient.macros.fat,
              custom_fiber: ingredient.macros.fiber
            }]);

          if (recipeIngredientError) throw recipeIngredientError;
        });

        await Promise.all(ingredientPromises);
      }

      // Invalidate and refetch the recipes query
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      await queryClient.refetchQueries({ queryKey: ['recipes'] });

      toast({
        title: "Success",
        description: "Recipe has been added to your meals",
      });
      
      return newRecipe;
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveRecipe, isSaving };
}