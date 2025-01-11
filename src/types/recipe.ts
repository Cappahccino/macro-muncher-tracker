export interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredient_id?: string;
}

export interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  created_at: string;
  dietary_tags?: string[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  notes: string;
  ingredients: Ingredient[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}