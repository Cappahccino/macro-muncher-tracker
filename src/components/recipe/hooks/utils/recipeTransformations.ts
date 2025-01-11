import { Recipe, Ingredient } from "@/types/recipe";
import { Json } from "@/integrations/supabase/types";

export interface DatabaseRecipeIngredient {
  recipe_ingredient_id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  custom_calories: number | null;
  custom_protein: number | null;
  custom_carbs: number | null;
  custom_fat: number | null;
  custom_fiber: number | null;
  created_at: string;
  updated_at: string;
  ingredients?: {
    name: string;
  };
}

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
  recipe_ingredients: DatabaseRecipeIngredient[];
}

export const transformDatabaseRecipeToRecipe = (dbRecipe: DatabaseRecipe): Recipe => {
  const ingredients: Ingredient[] = (dbRecipe.recipe_ingredients || []).map(ingredient => ({
    name: ingredient.ingredients?.name || '',
    amount: ingredient.quantity_g,
    calories: ingredient.custom_calories !== null ? ingredient.custom_calories : ingredient.calories,
    protein: ingredient.custom_protein !== null ? ingredient.custom_protein : ingredient.protein,
    carbs: ingredient.custom_carbs !== null ? ingredient.custom_carbs : ingredient.carbs,
    fat: ingredient.custom_fat !== null ? ingredient.custom_fat : ingredient.fat,
    fiber: ingredient.custom_fiber !== null ? ingredient.custom_fiber : ingredient.fiber,
    ingredient_id: ingredient.ingredient_id
  }));

  const instructionsArray = Array.isArray(dbRecipe.instructions) 
    ? dbRecipe.instructions.map(String)
    : [];

  return {
    recipe_id: dbRecipe.recipe_id,
    title: dbRecipe.title,
    description: dbRecipe.description || '',
    instructions: instructionsArray,
    ingredients,
    macros: {
      calories: dbRecipe.total_calories || 0,
      protein: dbRecipe.total_protein || 0,
      carbs: dbRecipe.total_carbs || 0,
      fat: dbRecipe.total_fat || 0,
      fiber: dbRecipe.total_fiber || 0,
    },
    created_at: dbRecipe.created_at,
    dietary_tags: dbRecipe.dietary_tags || [],
    total_calories: dbRecipe.total_calories || 0,
    total_protein: dbRecipe.total_protein || 0,
    total_carbs: dbRecipe.total_carbs || 0,
    total_fat: dbRecipe.total_fat || 0,
    total_fiber: dbRecipe.total_fiber || 0,
    user_id: dbRecipe.user_id
  };
};

export const transformRecipeToDatabase = (recipe: Recipe): Omit<DatabaseRecipe, 'recipe_id' | 'user_id' | 'created_at' | 'updated_at'> => {
  return {
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    dietary_tags: recipe.dietary_tags || [],
    total_calories: recipe.macros.calories,
    total_protein: recipe.macros.protein,
    total_carbs: recipe.macros.carbs,
    total_fat: recipe.macros.fat,
    total_fiber: recipe.macros.fiber,
    recipe_ingredients: recipe.ingredients.map(ingredient => ({
      recipe_ingredient_id: '',
      recipe_id: '',
      ingredient_id: ingredient.ingredient_id || '',
      quantity_g: ingredient.amount,
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      fiber: ingredient.fiber,
      custom_calories: null,
      custom_protein: null,
      custom_carbs: null,
      custom_fat: null,
      custom_fiber: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  };
};