import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Recipe } from "@/types/recipe";
import { useQueryClient } from "@tanstack/react-query";

export function useRecipeSave() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

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
      setIsSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        return;
      }

      const dbRecipe = {
        title: recipe.title,
        description: recipe.description,
        instructions: { steps: recipe.instructions },
        user_id: session.user.id,
        total_calories: recipe.macros.calories,
        total_protein: recipe.macros.protein,
        total_carbs: recipe.macros.carbs,
        total_fat: recipe.macros.fat,
        total_fiber: recipe.macros.fiber
      };

      const { error } = await supabase
        .from('recipes')
        .insert(dbRecipe);

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
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSaveRecipe,
    isSaving
  };
}