import { useRecipes } from "@/hooks/useRecipes";
import { RecipeList } from "@/components/recipe/RecipeList";
import { Loader2 } from "lucide-react";

export default function MyRecipes() {
  const { recipes, isLoading } = useRecipes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">My Recipes</h1>
      <RecipeList 
        recipes={recipes || []} 
        onDelete={() => {
          // Will be implemented when needed
        }} 
      />
    </div>
  );
}