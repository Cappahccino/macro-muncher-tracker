import { Header } from "@/components/Header";
import { RecipeList } from "@/components/recipe/RecipeList";
import { SearchBar } from "@/components/recipe/SearchBar";
import { DietaryFilters } from "@/components/recipe/DietaryFilters";
import { RecipeVaultHeader } from "@/components/recipe/RecipeVaultHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/recipe/page/LoadingSpinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Recipe } from "@/types/recipe";
import { DatabaseRecipe, transformDatabaseRecipeToRecipe } from "@/components/recipe/hooks/utils/recipeTransformations";

const RecipeVault = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to view your recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/sign-in");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const { data: recipes, isLoading } = useQuery({
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

        if (error) throw error;

        return (data || []) as DatabaseRecipe[];
      } catch (error) {
        console.error('Error loading recipes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch recipes",
          variant: "destructive",
        });
        return [];
      }
    }
  });

  const handleDelete = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('recipe_id', recipeId);

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

  const transformedRecipes: Recipe[] = (recipes || []).map(transformDatabaseRecipeToRecipe);

  const filteredRecipes = transformedRecipes.filter(recipe => {
    if (activeFilter !== "all" && !recipe.dietary_tags?.includes(activeFilter)) {
      return false;
    }
    
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower) ||
        recipe.dietary_tags?.some(tag => 
          tag.toLowerCase().includes(searchLower)
        )
      );
    }
    
    return true;
  });

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      <RecipeVaultHeader />
      
      <div className="mt-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
          </div>
          <DietaryFilters 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : (
            <ScrollArea className="h-[600px] rounded-md border bg-card/50 backdrop-blur-sm p-4">
              <RecipeList 
                recipes={filteredRecipes} 
                onDelete={handleDelete}
              />
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeVault;
