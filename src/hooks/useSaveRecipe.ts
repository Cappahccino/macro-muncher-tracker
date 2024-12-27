import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredient_id?: string; // Updated from 'id' to 'ingredient_id' to match Supabase schema
}

interface Recipe {
  title: string;
  description: string;
  instructions: any;
  dietary_tags?: string[];
  ingredients?: Ingredient[];
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
          dietary_tags: recipe.dietary_tags || []
        }])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // If we have ingredients, add them to the recipe
      if (newRecipe && recipe.ingredients) {
        const ingredientPromises = recipe.ingredients.map(async (ingredient) => {
          const { error: ingredientError } = await supabase
            .from('recipe_ingredients')
            .insert([{
              recipe_id: newRecipe.recipe_id,
              ingredient_id: ingredient.ingredient_id, // Updated from 'id' to 'ingredient_id'
              quantity_g: ingredient.amount,
              custom_calories: ingredient.calories,
              custom_protein: ingredient.protein,
              custom_carbs: ingredient.carbs,
              custom_fat: ingredient.fat,
              custom_fiber: ingredient.fiber
            }]);

          if (ingredientError) throw ingredientError;
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