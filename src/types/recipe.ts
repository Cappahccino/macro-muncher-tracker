export interface Ingredient {
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

export interface Recipe {
  recipe_id?: string;
  title: string;
  description: string | null;
  instructions: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  ingredients: Ingredient[];
  dietary_tags?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface SavedRecipe {
  title: string;
  notes: string;
  instructions: string[];
  ingredients: Ingredient[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}