import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types/recipe";
import { useQueryClient } from "@tanstack/react-query";

export function useRecipeIngredient() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateIngredient = async (recipe: Recipe, ingredientIndex: number, newAmount: number) => {
    try {
      setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleUpdateIngredient,
    isUpdating
  };
}