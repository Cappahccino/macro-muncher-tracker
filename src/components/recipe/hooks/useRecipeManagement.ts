import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types/recipe";
import { useRecipeDatabase } from "./useRecipeDatabase";
import { transformRecipeToDatabase } from "./utils/recipeTransformations";

export function useRecipeManagement() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { recipes, queryClient } = useRecipeDatabase();

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        return;
      }

      const dbRecipe = transformRecipeToDatabase(recipe);
      const { error } = await supabase
        .from('recipes')
        .insert({
          ...dbRecipe,
          user_id: session.user.id
        });

      if (error) throw error;

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        return;
      }

      const dbRecipe = transformRecipeToDatabase(recipe);
      const { error } = await supabase
        .from('recipes')
        .insert({
          ...dbRecipe,
          user_id: session.user.id
        });

      if (error) throw error;

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