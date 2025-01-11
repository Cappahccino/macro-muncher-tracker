import { supabase } from "@/integrations/supabase/client";
import { Ingredient } from "@/types/recipe";

export const findOrCreateIngredient = async (ingredient: Ingredient) => {
  if (!ingredient?.macros) {
    throw new Error('Invalid ingredient data: missing macros');
  }

  // First, try to find existing ingredient
  const { data: existingIngredient, error: searchError } = await supabase
    .from('ingredients')
    .select('ingredient_id')
    .eq('name', ingredient.name)
    .maybeSingle();

  if (searchError) throw searchError;

  if (existingIngredient) {
    return existingIngredient.ingredient_id;
  }

  // Create new ingredient if it doesn't exist
  const { data: newIngredient, error: createError } = await supabase
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

  if (createError) throw createError;
  return newIngredient.ingredient_id;
};

export const addIngredientToRecipe = async (
  recipeId: string,
  ingredientId: string,
  ingredient: Ingredient
) => {
  const { error } = await supabase
    .from('recipe_ingredients')
    .insert([{
      recipe_id: recipeId,
      ingredient_id: ingredientId,
      quantity_g: ingredient.amount,
      custom_calories: ingredient.macros.calories,
      custom_protein: ingredient.macros.protein,
      custom_carbs: ingredient.macros.carbs,
      custom_fat: ingredient.macros.fat,
      custom_fiber: ingredient.macros.fiber
    }]);

  if (error) throw error;
};