import { useRecipeToast } from "./useRecipeToast";

interface Recipe {
  title: string;
  ingredients: any[];
}

export function useRecipeValidation() {
  const { showErrorToast } = useRecipeToast();

  const validateRecipe = (recipe: Recipe): boolean => {
    if (!recipe.title.trim()) {
      showErrorToast("Please enter a recipe name");
      return false;
    }

    if (recipe.ingredients.length === 0) {
      showErrorToast("Please add at least one ingredient");
      return false;
    }

    return true;
  };

  return {
    validateRecipe,
  };
}