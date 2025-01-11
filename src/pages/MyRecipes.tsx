import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/recipe/page/LoadingSpinner";
import { RecipePageHeader } from "@/components/recipe/page/RecipePageHeader";
import { RecipeContent } from "@/components/recipe/page/RecipeContent";
import { useRecipeManagement } from "@/components/recipe/hooks/useRecipeManagement";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Recipe, SavedRecipe } from "@/types/recipe";

const MyRecipes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    recipes,
    isLoading,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleSaveToVault,
    handleUpdateIngredient
  } = useRecipeManagement();

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
  }, [navigate, toast]);

  // Convert Recipe to SavedRecipe
  const convertToSavedRecipes = (recipes: Recipe[]): SavedRecipe[] => {
    return recipes.map(recipe => ({
      title: recipe.title,
      notes: recipe.description || '',
      instructions: recipe.instructions.steps,
      ingredients: recipe.ingredients,
      macros: {
        calories: recipe.macros.calories,
        protein: recipe.macros.protein,
        carbs: recipe.macros.carbs,
        fat: recipe.macros.fat,
        fiber: recipe.macros.fiber
      }
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      <RecipePageHeader />
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <RecipeContent
            recipes={convertToSavedRecipes(recipes)}
            onSaveRecipe={async (recipe) => {
              await handleSaveRecipe(recipe as unknown as Recipe);
            }}
            onDeleteRecipe={handleDeleteRecipe}
            onSaveToVault={async (recipe) => {
              await handleSaveToVault(recipe as unknown as Recipe);
            }}
            onUpdateIngredient={handleUpdateIngredient}
          />
        )}
      </div>
    </div>
  );
};

export default MyRecipes;