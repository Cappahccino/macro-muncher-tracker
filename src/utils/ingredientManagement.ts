import { supabase } from "@/integrations/supabase/client";

export const saveIngredients = async (ingredients: any[], userId: string) => {
  try {
    const savedIngredients = await Promise.all(
      ingredients.map(async (ingredient) => {
        const { data: existingIngredient, error: searchError } = await supabase
          .from('ingredients')
          .select('ingredient_id, name')
          .eq('name', ingredient.name)
          .eq('user_id', userId)
          .maybeSingle();

        if (searchError) {
          console.error('Error searching for ingredient:', searchError);
          throw searchError;
        }

        if (existingIngredient) {
          return existingIngredient;
        }

        const { data: newIngredient, error: insertError } = await supabase
          .from('ingredients')
          .insert({
            name: ingredient.name,
            calories_per_100g: (ingredient.calories / ingredient.amount) * 100,
            protein_per_100g: (ingredient.protein / ingredient.amount) * 100,
            fat_per_100g: (ingredient.fat / ingredient.amount) * 100,
            carbs_per_100g: (ingredient.carbs / ingredient.amount) * 100,
            fiber_per_100g: (ingredient.fiber / ingredient.amount) * 100,
            user_id: userId
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating ingredient:', insertError);
          throw insertError;
        }

        return newIngredient;
      })
    );

    return savedIngredients;
  } catch (error) {
    console.error('Error saving ingredients:', error);
    return null;
  }
};

export const saveRecipe = async (recipe: any, ingredients: any[], userId: string) => {
  try {
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        user_id: userId,
        title: recipe.title,
        description: recipe.description,
        instructions: recipe.instructions,
        dietary_tags: []
      })
      .select()
      .single();

    if (recipeError) throw recipeError;

    const recipeIngredients = ingredients.map((ingredient: any, index: number) => ({
      recipe_id: recipeData.recipe_id,
      ingredient_id: ingredient.ingredient_id,
      quantity_g: ingredient.amount,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      fiber: ingredient.fiber
    }));

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(recipeIngredients);

    if (ingredientsError) throw ingredientsError;

    return recipeData;
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw error;
  }
};