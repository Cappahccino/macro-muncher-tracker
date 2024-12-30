import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  dietary_tags?: string[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
}

export async function addRecipeToMeals(recipe: Recipe) {
  try {
    // First, get the recipe's ingredients with their nutritional information
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .select(`
        quantity_g,
        calories,
        protein,
        fat,
        carbs,
        fiber,
        ingredients (
          ingredient_id,
          name,
          calories_per_100g,
          protein_per_100g,
          fat_per_100g,
          carbs_per_100g,
          fiber_per_100g
        )
      `)
      .eq('recipe_id', recipe.recipe_id);

    if (ingredientsError) throw ingredientsError;

    // Create the new recipe
    const { data: newRecipe, error: recipeError } = await supabase
      .from('recipes')
      .insert([{
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        dietary_tags: recipe.dietary_tags,
        total_calories: recipe.total_calories,
        total_protein: recipe.total_protein,
        total_carbs: recipe.total_carbs,
        total_fat: recipe.total_fat,
        total_fiber: recipe.total_fiber
      }])
      .select()
      .single();

    if (recipeError) throw recipeError;

    // If we have ingredients, add them to the new recipe
    if (newRecipe && ingredients && ingredients.length > 0) {
      const ingredientPromises = ingredients.map(async (ingredient) => {
        if (!ingredient.ingredients) return;
        
        const { error: ingredientError } = await supabase
          .from('recipe_ingredients')
          .insert([{
            recipe_id: newRecipe.recipe_id,
            ingredient_id: ingredient.ingredients.ingredient_id,
            quantity_g: ingredient.quantity_g,
            calories: ingredient.calories,
            protein: ingredient.protein,
            fat: ingredient.fat,
            carbs: ingredient.carbs,
            fiber: ingredient.fiber
          }]);

        if (ingredientError) throw ingredientError;
      });

      await Promise.all(ingredientPromises);
    }

    return newRecipe;
  } catch (error) {
    console.error('Error adding to meals:', error);
    throw error;
  }
}