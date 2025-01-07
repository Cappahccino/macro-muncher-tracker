import { Header } from "@/components/Header";
import { LoadingSpinner } from "@/components/recipe/page/LoadingSpinner";
import { RecipePageHeader } from "@/components/recipe/page/RecipePageHeader";
import { RecipeContent } from "@/components/recipe/page/RecipeContent";
import { useRecipeManagement } from "@/hooks/recipe/useRecipeManagement";

const MyRecipes = () => {
  const {
    recipes,
    isLoading,
    handleSaveRecipe,
    handleDeleteRecipe,
    handleSaveToVault,
    handleUpdateIngredient
  } = useRecipeManagement();

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      <RecipePageHeader />
      <div className="space-y-6">
        {isLoading ? (
          <LoadingSpinner />
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