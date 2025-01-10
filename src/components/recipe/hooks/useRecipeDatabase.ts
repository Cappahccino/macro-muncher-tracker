import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { DatabaseRecipe, transformDatabaseRecipeToRecipe } from "./utils/recipeTransformations";
import { Recipe } from "@/types/recipe";

export const useRecipeDatabase = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dbRecipes = [], isLoading, error } = useQuery({
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
          .select(`
            *,
            recipe_ingredients (
              *,
              ingredients (
                name
              )
            )
          `)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching recipes:', error);
          throw error;
        }

        if (!data) {
          return [];
        }

        return data as DatabaseRecipe[];
      } catch (error) {
        console.error('Error loading recipes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch recipes",
          variant: "destructive",
        });
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

  const recipes: Recipe[] = (dbRecipes || []).map(transformDatabaseRecipeToRecipe);

  return {
    recipes,
    isLoading,
    error,
    queryClient
  };
};