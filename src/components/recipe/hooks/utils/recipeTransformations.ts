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
    macros: {
      calories: ingredient.custom_calories !== null ? ingredient.custom_calories : ingredient.calories,
      protein: ingredient.custom_protein !== null ? ingredient.custom_protein : ingredient.protein,
      carbs: ingredient.custom_carbs !== null ? ingredient.custom_carbs : ingredient.carbs,
      fat: ingredient.custom_fat !== null ? ingredient.custom_fat : ingredient.fat,
      fiber: ingredient.custom_fiber !== null ? ingredient.custom_fiber : ingredient.fiber,
    },
    ingredient_id: ingredient.ingredient_id
  }));

  const instructionsData = typeof dbRecipe.instructions === 'string' 
    ? JSON.parse(dbRecipe.instructions)
    : dbRecipe.instructions;

  const totalMacros = ingredients.reduce((acc, ingredient) => ({
    calories: acc.calories + ingredient.macros.calories,
    protein: acc.protein + ingredient.macros.protein,
    carbs: acc.carbs + ingredient.macros.carbs,
    fat: acc.fat + ingredient.macros.fat,
    fiber: acc.fiber + ingredient.macros.fiber,
  }), {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  return {
    recipe_id: dbRecipe.recipe_id,
    title: dbRecipe.title,
    description: dbRecipe.description || '',
    notes: dbRecipe.description || '',
    instructions: {
      steps: Array.isArray(instructionsData) ? instructionsData : instructionsData?.steps || []
    },
    ingredients,
    dietary_tags: dbRecipe.dietary_tags || [],
    created_at: dbRecipe.created_at,
    updated_at: dbRecipe.updated_at,
    user_id: dbRecipe.user_id,
    macros: totalMacros
  };
};

export const transformRecipeToDatabase = (recipe: Recipe): Omit<DatabaseRecipe, 'recipe_id' | 'user_id' | 'created_at' | 'updated_at'> => {
  const totalMacros = recipe.ingredients.reduce((acc, ingredient) => ({
    calories: acc.calories + ingredient.macros.calories,
    protein: acc.protein + ingredient.macros.protein,
    carbs: acc.carbs + ingredient.macros.carbs,
    fat: acc.fat + ingredient.macros.fat,
    fiber: acc.fiber + ingredient.macros.fiber,
  }), {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  return {
    title: recipe.title,
    description: recipe.description || recipe.notes,
    instructions: recipe.instructions,
    dietary_tags: recipe.dietary_tags || [],
    total_calories: totalMacros.calories,
    total_protein: totalMacros.protein,
    total_carbs: totalMacros.carbs,
    total_fat: totalMacros.fat,
    total_fiber: totalMacros.fiber,
    recipe_ingredients: recipe.ingredients.map(ingredient => ({
      recipe_ingredient_id: '',
      recipe_id: '',
      ingredient_id: ingredient.ingredient_id || '',
      quantity_g: ingredient.amount,
      calories: ingredient.macros.calories,
      protein: ingredient.macros.protein,
      carbs: ingredient.macros.carbs,
      fat: ingredient.macros.fat,
      fiber: ingredient.macros.fiber,
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