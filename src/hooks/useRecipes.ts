import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

export function useRecipes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      // First check if we have an authenticated session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication required');
      }

      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your recipes",
          variant: "destructive",
        });
        throw new Error('Authentication required');
      }

      // Fetch recipes with their ingredients
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            *,
            ingredients (
              name,
              calories_per_100g,
              protein_per_100g,
              carbs_per_100g,
              fat_per_100g,
              fiber_per_100g
            )
          )
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
        toast({
          title: "Error",
          description: "Failed to load recipes. Please try again.",
          variant: "destructive",
        });
        throw recipesError;
      }

      // Process the recipes to include ingredient details
      const processedRecipes = recipesData.map(recipe => {
        const ingredients = recipe.recipe_ingredients?.map(ri => ({
          name: ri.ingredients.name,
          amount: ri.quantity_g,
          calories: ri.calories,
          protein: ri.protein,
          carbs: ri.carbs,
          fat: ri.fat,
          fiber: ri.fiber
        })) || [];

        // Calculate total macros
        const totalMacros = ingredients.reduce((acc, curr) => ({
          calories: acc.calories + (curr.calories || 0),
          protein: acc.protein + (curr.protein || 0),
          carbs: acc.carbs + (curr.carbs || 0),
          fat: acc.fat + (curr.fat || 0),
          fiber: acc.fiber + (curr.fiber || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

        return {
          ...recipe,
          ingredients,
          totalMacros
        };
      });

      return processedRecipes as Recipe[];
    },
    staleTime: 0, // Consider all data stale immediately
    meta: {
      onSettled: (data, error) => {
        if (error) {
          console.error('Query error:', error);
          toast({
            title: "Error",
            description: "Failed to load recipes. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  });

  return { recipes, isLoading, queryClient };
}