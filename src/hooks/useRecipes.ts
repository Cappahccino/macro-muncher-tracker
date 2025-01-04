import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useRecipes() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error fetching recipes:', error);
        if (error.code === '42501') {
          toast({
            title: "Access denied",
            description: "You don't have permission to view these recipes",
            variant: "destructive",
          });
          navigate("/sign-in");
        }
        throw error;
      }

      return data;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        if (error.message !== 'Authentication required') {
          toast({
            title: "Error",
            description: "Failed to fetch recipes: " + error.message,
            variant: "destructive",
          });
        }
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