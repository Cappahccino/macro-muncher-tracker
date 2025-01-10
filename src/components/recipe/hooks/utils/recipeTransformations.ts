import { Recipe, Ingredient } from "@/types/recipe";
import { Json } from "@/integrations/supabase/types";

export interface DatabaseRecipe {
  recipe_id: string;
  user_id: string;
  title: string;
  description: string | null;
  instructions: Json;
  dietary_tags: string[] | null;
  total_calories: number | null;
  total_protein: number | null;
  total_carbs: number | null;
  total_fat: number | null;
  total_fiber: number | null;
  created_at: string;
  updated_at: string;
  recipe_ingredients: Array<{
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }>;
}

export const transformDatabaseRecipeToRecipe = (dbRecipe: DatabaseRecipe): Recipe => {
  const ingredients: Ingredient[] = (dbRecipe.recipe_ingredients || []).map(ingredient => ({
    name: ingredient.name,
    amount: ingredient.amount,
    macros: {
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      fiber: ingredient.fiber
    }
  }));

  return {
    title: dbRecipe.title,
    notes: dbRecipe.description || '',
    instructions: Array.isArray(dbRecipe.instructions) ? dbRecipe.instructions : [],
    ingredients,
    macros: {
      calories: dbRecipe.total_calories || 0,
      protein: dbRecipe.total_protein || 0,
      carbs: dbRecipe.total_carbs || 0,
      fat: dbRecipe.total_fat || 0,
      fiber: dbRecipe.total_fiber || 0,
    }
  };
};

export const transformRecipeToDatabase = (recipe: Recipe): Omit<DatabaseRecipe, 'recipe_id' | 'user_id' | 'created_at' | 'updated_at'> => {
  const recipe_ingredients = recipe.ingredients.map(ingredient => ({
    name: ingredient.name,
    amount: ingredient.amount,
    calories: ingredient.macros.calories,
    protein: ingredient.macros.protein,
    carbs: ingredient.macros.carbs,
    fat: ingredient.macros.fat,
    fiber: ingredient.macros.fiber
  }));

  return {
    title: recipe.title,
    description: recipe.notes,
    instructions: recipe.instructions,
    dietary_tags: [],
    total_calories: recipe.macros.calories,
    total_protein: recipe.macros.protein,
    total_carbs: recipe.macros.carbs,
    total_fat: recipe.macros.fat,
    total_fiber: recipe.macros.fiber,
    recipe_ingredients
  };
};