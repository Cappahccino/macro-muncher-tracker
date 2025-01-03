import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { motion } from "framer-motion";
import { SavedRecipesList } from "@/components/recipe/SavedRecipesList";
import { convertToVaultRecipe } from "@/utils/recipe/recipeConversion";
import { RecipeVaultHeader } from "@/components/recipe/RecipeVaultHeader";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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

const initialRecipes: Recipe[] = [];

export default function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteRecipe = (index: number) => {
    const newRecipes = [...recipes];
    newRecipes.splice(index, 1);
    setRecipes(newRecipes);
    
    toast({
      title: "Recipe deleted",
      description: "The recipe has been removed from your list.",
    });
  };

  const handleSaveToVault = async (recipe: Recipe) => {
    const vaultRecipe = convertToVaultRecipe(recipe);
    
    // After successful save, navigate to the recipe vault
    toast({
      title: "Recipe saved",
      description: "The recipe has been saved to your vault.",
    });
    navigate("/recipe-vault");
  };

  const handleUpdateIngredient = (
    recipeIndex: number,
    ingredientIndex: number,
    newAmount: number
  ) => {
    setRecipes(prevRecipes => {
      const newRecipes = [...prevRecipes];
      const recipe = { ...newRecipes[recipeIndex] };
      const ingredient = { ...recipe.ingredients[ingredientIndex] };
      
      // Update the ingredient amount and recalculate macros
      const ratio = newAmount / ingredient.amount;
      ingredient.amount = newAmount;
      ingredient.calories *= ratio;
      ingredient.protein *= ratio;
      ingredient.carbs *= ratio;
      ingredient.fat *= ratio;
      ingredient.fiber *= ratio;
      
      // Update the ingredient in the recipe
      recipe.ingredients[ingredientIndex] = ingredient;
      
      // Recalculate total macros for the recipe
      recipe.macros = recipe.ingredients.reduce(
        (acc, curr) => ({
          calories: acc.calories + curr.calories,
          protein: acc.protein + curr.protein,
          carbs: acc.carbs + curr.carbs,
          fat: acc.fat + curr.fat,
          fiber: acc.fiber + curr.fiber,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      );
      
      newRecipes[recipeIndex] = recipe;
      return newRecipes;
    });
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="mt-8 space-y-8">
        <RecipeVaultHeader title="My Recipes" />

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Saved Recipes
            </h2>
            
            <Separator className="my-4" />
            
            <ScrollArea className="h-[600px] rounded-md border bg-card/50 backdrop-blur-sm p-4">
              <SavedRecipesList
                recipes={recipes}
                onDelete={handleDeleteRecipe}
                onUpdateIngredient={handleUpdateIngredient}
                onSaveToVault={handleSaveToVault}
              />
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  );
}