import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useRecipeStorage } from "./useRecipeStorage";
import { useRecipeValidation } from "./useRecipeValidation";
import { useRecipeVault } from "./useRecipeVault";
import { useRecipeToast } from "./useRecipeToast";

interface Recipe {
  title: string;
  notes: string;
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

export function useRecipeManagement() {
  const { recipes, setRecipes } = useRecipeStorage();
  const { validateRecipe } = useRecipeValidation();
  const { saveToVault } = useRecipeVault();
  const { showSuccessToast } = useRecipeToast();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleSaveRecipe = (recipe: Recipe) => {
    if (!validateRecipe(recipe)) return;
    setRecipes([...recipes, recipe]);
    showSuccessToast("Recipe saved successfully");
  };

  const handleDeleteRecipe = (index: number) => {
    const newRecipes = recipes.filter((_, i) => i !== index);
    setRecipes(newRecipes);
    showSuccessToast("Recipe deleted successfully");
  };

  const handleUpdateIngredient = (recipeIndex: number, ingredientIndex: number, newAmount: number) => {
    const updatedRecipes = [...recipes];
    const recipe = updatedRecipes[recipeIndex];
    const ingredient = recipe.ingredients[ingredientIndex];
    
    const ratio = newAmount / ingredient.amount;
    
    ingredient.amount = newAmount;
    ingredient.calories *= ratio;
    ingredient.protein *= ratio;
    ingredient.carbs *= ratio;
    ingredient.fat *= ratio;
    ingredient.fiber *= ratio;
    
    recipe.macros = recipe.ingredients.reduce(
      (acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.protein,
        carbs: acc.carbs + curr.carbs,
        fat: acc.fat + curr.fat,
        fiber: acc.fiber + curr.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
    
    setRecipes(updatedRecipes);
    showSuccessToast("Ingredient weight updated successfully");
  };

  return {
    recipes,
    isLoading,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleSaveToVault: saveToVault,
    handleUpdateIngredient
  };
}