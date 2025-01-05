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

interface Recipe {
  title: string;
  description: string;
  instructions: {
    steps: string[];
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
}

export async function saveRecipeToVault(recipe: Recipe, userId: string) {
  // First, save the recipe
  const { data: savedRecipe, error: recipeError } = await supabase
    .from('recipes')
    .insert({
      user_id: userId,
      title: recipe.title,
      description: recipe.description,
      instructions: { steps: recipe.instructions.steps },
      total_calories: recipe.macronutrients.perServing.calories,
      total_protein: recipe.macronutrients.perServing.protein,
      total_carbs: recipe.macronutrients.perServing.carbs,
      total_fat: recipe.macronutrients.perServing.fat,
      total_fiber: recipe.macronutrients.perServing.fiber
    })
    .select()
    .single();

  if (recipeError) throw recipeError;

  // Then, save each ingredient with its macros
  if (recipe.ingredients && savedRecipe) {
    const ingredientPromises = recipe.ingredients.map(async (ingredient) => {
      // First, try to find an existing ingredient
      const { data: existingIngredient, error: searchError } = await supabase
        .from('ingredients')
        .select('ingredient_id')
        .eq('name', ingredient.name)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        throw searchError;
      }

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

      // Create recipe_ingredient association with macros
      const { error: recipeIngredientError } = await supabase
        .from('recipe_ingredients')
        .insert({
          recipe_id: savedRecipe.recipe_id,
          ingredient_id: ingredientId,
          quantity_g: ingredient.amount,
          custom_calories: ingredient.macros.calories,
          custom_protein: ingredient.macros.protein,
          custom_carbs: ingredient.macros.carbs,
          custom_fat: ingredient.macros.fat,
          custom_fiber: ingredient.macros.fiber
        });

      if (recipeIngredientError) throw recipeIngredientError;
    });

    await Promise.all(ingredientPromises);
  }

  return savedRecipe;
}
