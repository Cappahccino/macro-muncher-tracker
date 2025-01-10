import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/recipe/page/LoadingSpinner";
import { RecipePageHeader } from "@/components/recipe/page/RecipePageHeader";
import { RecipeContent } from "@/components/recipe/page/RecipeContent";
import { useRecipeManagement } from "@/components/recipe/hooks/useRecipeManagement";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
            recipes={recipes}
            onSaveRecipe={handleSaveRecipe}
            onDeleteRecipe={handleDeleteRecipe}
            onSaveToVault={handleSaveToVault}
            onUpdateIngredient={handleUpdateIngredient}
          />
        )}
      </div>
    </div>
  );
};

export default MyRecipes;