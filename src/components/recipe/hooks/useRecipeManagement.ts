import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { saveRecipe } = useSaveRecipe();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: recipes = [] } = useQuery({
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
          .select('*')
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error loading recipes:', error);
        return [];
      } finally {
        setIsLoading(false);
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
      await saveRecipe(recipe);
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
      const recipe = recipes[index];
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
      await saveRecipe(recipe);
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
      const recipe = recipes[recipeIndex];
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