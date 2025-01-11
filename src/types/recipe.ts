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
  recipe_id?: string;
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