interface Recipe {
  title: string;
  notes?: string;
  instructions: string[];
  ingredients: {
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface VaultRecipe {
  title: string;
  description?: string;
  instructions: {
    steps: string[];
  };
  ingredients: {
    name: string;
    amount: number;
    macros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  }[];
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

export const convertToVaultRecipe = (recipe: Recipe): VaultRecipe => {
  return {
    title: recipe.title,
    description: recipe.notes,
    instructions: {
      steps: recipe.instructions,
    },
    ingredients: recipe.ingredients.map(ingredient => ({
      name: ingredient.name,
      amount: ingredient.amount,
      macros: {
        calories: ingredient.calories,
        protein: ingredient.protein,
        carbs: ingredient.carbs,
        fat: ingredient.fat,
        fiber: ingredient.fiber,
      }
    })),
    macronutrients: {
      perServing: recipe.macros,
    },
  };
};