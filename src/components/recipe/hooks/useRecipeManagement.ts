import { useRecipeDatabase } from "./useRecipeDatabase";
import { useRecipeSave } from "./useRecipeSave";
import { useRecipeDelete } from "./useRecipeDelete";
import { useRecipeIngredient } from "./useRecipeIngredient";
import { Recipe } from "@/types/recipe";

export function useRecipeManagement() {
  const { recipes, isLoading: isLoadingRecipes } = useRecipeDatabase();
  const { handleSaveRecipe, isSaving: isSavingRecipe } = useRecipeSave();
  const { handleDeleteRecipe, isDeleting } = useRecipeDelete();
  const { handleUpdateIngredient, isUpdating } = useRecipeIngredient();

  const handleDelete = async (index: number) => {
    const recipe = recipes[index];
    if (recipe) {
      await handleDeleteRecipe(recipe);
    }
  };

  const handleUpdate = async (recipeIndex: number, ingredientIndex: number, newAmount: number) => {
    const recipe = recipes[recipeIndex];
    if (recipe) {
      await handleUpdateIngredient(recipe, ingredientIndex, newAmount);
    }
  };

  return {
    recipes,
    isLoading: isLoadingRecipes || isSavingRecipe || isDeleting || isUpdating,
    handleSaveRecipe,
    handleDeleteRecipe: handleDelete,
    handleSaveToVault: handleSaveRecipe,
    handleUpdateIngredient: handleUpdate
  };
}