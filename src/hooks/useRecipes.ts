import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useRecipes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching recipes:', error);
        throw error;
      }

      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "Failed to fetch recipes: " + error.message,
          variant: "destructive",
        });
      }
    }
  });

  return {
    recipes,
    isLoading,
    error,
    queryClient,
  };
}