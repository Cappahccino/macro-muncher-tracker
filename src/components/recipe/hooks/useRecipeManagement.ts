import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Recipe, Ingredient } from "@/types/recipe";

interface DatabaseRecipe {
  recipe_id: string;
  user_id: string;
  title: string;
  description: string;
  instructions: string[];
  dietary_tags: string[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  total_fiber: number;
  created_at: string;
  updated_at: string;
  ingredients?: Array<{
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }>;
}

const transformDatabaseRecipeToRecipe = (dbRecipe: DatabaseRecipe): Recipe => {
  const ingredients: Ingredient[] = (dbRecipe.ingredients || []).map(ingredient => ({
    name: ingredient.name,
    amount: ingredient.amount,
    macros: {
      calories: ingredient.calories,
      protein: ingredient.protein,
      carbs: ingredient.carbs,
      fat: ingredient.fat,
      fiber: ingredient.fiber
    }
  }));

  return {
    title: dbRecipe.title,
    notes: dbRecipe.description || '',
    instructions: { steps: Array.isArray(dbRecipe.instructions) ? dbRecipe.instructions : [] },
    ingredients,
    macros: {
      calories: dbRecipe.total_calories || 0,
      protein: dbRecipe.total_protein || 0,
      carbs: dbRecipe.total_carbs || 0,
      fat: dbRecipe.total_fat || 0,
      fiber: dbRecipe.total_fiber || 0,
    }
  };
};

const transformRecipeToDatabase = (recipe: Recipe): Omit<DatabaseRecipe, 'recipe_id' | 'user_id' | 'created_at' | 'updated_at'> => {
  const ingredients = recipe.ingredients.map(ingredient => ({
    name: ingredient.name,
    amount: ingredient.amount,
    calories: ingredient.macros.calories,
    protein: ingredient.macros.protein,
    carbs: ingredient.macros.carbs,
    fat: ingredient.macros.fat,
    fiber: ingredient.macros.fiber
  }));

  return {
    title: recipe.title,
    description: recipe.notes,
    instructions: recipe.instructions.steps,
    dietary_tags: [],
    total_calories: recipe.macros.calories,
    total_protein: recipe.macros.protein,
    total_carbs: recipe.macros.carbs,
    total_fat: recipe.macros.fat,
    total_fiber: recipe.macros.fiber,
    ingredients
  };
};

export function useRecipeManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { saveRecipe } = useSaveRecipe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbRecipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please sign in to view your recipes",
            variant: "destructive",
          });
          navigate("/sign-in");
          return [];
        }

        const { data, error } = await supabase
          .from('recipes')
          .select('*, recipe_ingredients(*)') // Include recipe ingredients in the query
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error loading recipes:', error);
        return [];
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch recipes",
          variant: "destructive",
        });
      }
    }
  });

  const recipes = dbRecipes.map(transformDatabaseRecipeToRecipe);

  const handleSaveRecipe = async (recipe: Recipe) => {
    if (!recipe.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }

    if (recipe.ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    try {
      const dbRecipe = transformRecipeToDatabase(recipe);
      await saveRecipe(dbRecipe);
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      toast({
        title: "Success",
        description: "Recipe saved successfully",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecipe = async (index: number) => {
    try {
      const recipe = dbRecipes[index];
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('recipe_id', recipe.recipe_id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      toast({
        title: "Success",
        description: "Recipe deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe",
        variant: "destructive",
      });
    }
  };

  const handleSaveToVault = async (recipe: Recipe) => {
    try {
      const dbRecipe = transformRecipeToDatabase(recipe);
      await saveRecipe(dbRecipe);
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      toast({
        title: "Success",
        description: "Recipe saved to vault successfully",
      });
    } catch (error) {
      console.error('Error saving to vault:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to vault",
        variant: "destructive",
      });
    }
  };

  const handleUpdateIngredient = async (recipeIndex: number, ingredientIndex: number, newAmount: number) => {
    try {
      const recipe = dbRecipes[recipeIndex];
      if (!recipe) return;

      const { error } = await supabase
        .from('recipe_ingredients')
        .update({ quantity_g: newAmount })
        .eq('recipe_id', recipe.recipe_id)
        .eq('ingredient_id', recipe.ingredients[ingredientIndex].ingredient_id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      toast({
        title: "Success",
        description: "Ingredient weight updated successfully",
      });
    } catch (error) {
      console.error('Error updating ingredient:', error);
      toast({
        title: "Error",
        description: "Failed to update ingredient weight",
        variant: "destructive",
      });
    }
  };

  return {
    recipes,
    isLoading,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleSaveToVault,
    handleUpdateIngredient
  };
}
