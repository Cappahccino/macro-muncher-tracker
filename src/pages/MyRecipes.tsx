import { useState } from "react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { CreateRecipeForm } from "@/components/recipe/CreateRecipeForm";
import { SavedRecipesList } from "@/components/recipe/SavedRecipesList";

interface Recipe {
  title: string;
  notes: string;
  instructions: string[];
  ingredients: {
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

const MyRecipes = () => {
  const { toast } = useToast();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const handleSaveRecipe = (recipe: Recipe) => {
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

    setRecipes([...recipes, recipe]);
    toast({
      title: "Success",
      description: "Recipe saved successfully",
    });
  };

  const handleDeleteRecipe = (index: number) => {
    const newRecipes = recipes.filter((_, i) => i !== index);
    setRecipes(newRecipes);
    toast({
      title: "Success",
      description: "Recipe deleted successfully",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="space-y-8">
        <CreateRecipeForm onSave={handleSaveRecipe} />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Saved Recipes</h2>
          <SavedRecipesList
            recipes={recipes}
            onDelete={handleDeleteRecipe}
          />
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;