import { useState, useEffect } from "react";

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

export function useRecipeStorage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const savedRecipes = localStorage.getItem('savedRecipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem('savedRecipes', JSON.stringify(recipes));
    }
  }, [recipes]);

  return {
    recipes,
    setRecipes,
  };
}