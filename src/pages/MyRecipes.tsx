import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { CreateRecipeForm } from "@/components/recipe/CreateRecipeForm";
import { SavedRecipesList } from "@/components/recipe/SavedRecipesList";
import { RecipeVaultHeader } from "@/components/recipe/RecipeVaultHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useSaveRecipe } from "@/hooks/useSaveRecipe";

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
  const { saveRecipe, isSaving } = useSaveRecipe();

  useEffect(() => {
    const savedRecipes = localStorage.getItem('savedRecipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(recipes));
  }, [recipes]);

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

  const handleSaveToVault = async (recipe: Recipe) => {
    try {
      const recipeForVault = {
        title: recipe.title,
        description: recipe.notes,
        instructions: {
          steps: recipe.instructions
        },
        ingredients: recipe.ingredients.map(ingredient => ({
          name: ingredient.name,
          amount: ingredient.amount,
          macros: {
            calories: ingredient.calories,
            protein: ingredient.protein,
            carbs: ingredient.carbs,
            fat: ingredient.fat,
            fiber: ingredient.fiber,
          }
        })),
        macronutrients: {
          perServing: recipe.macros
        },
        total_calories: recipe.macros.calories,
        total_protein: recipe.macros.protein,
        total_carbs: recipe.macros.carbs,
        total_fat: recipe.macros.fat,
        total_fiber: recipe.macros.fiber
      };

      await saveRecipe(recipeForVault);
      
      toast({
        title: "Success",
        description: "Recipe saved to vault successfully",
      });
    } catch (error) {
      console.error('Error saving to vault:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to vault",
        variant: "destructive",
      });
    }
  };

  const handleUpdateIngredient = (recipeIndex: number, ingredientIndex: number, newAmount: number) => {
    const updatedRecipes = [...recipes];
    const recipe = updatedRecipes[recipeIndex];
    const ingredient = recipe.ingredients[ingredientIndex];
    
    const ratio = newAmount / ingredient.amount;
    
    ingredient.amount = newAmount;
    ingredient.calories *= ratio;
    ingredient.protein *= ratio;
    ingredient.carbs *= ratio;
    ingredient.fat *= ratio;
    ingredient.fiber *= ratio;
    
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
    
    setRecipes(updatedRecipes);
    toast({
      title: "Success",
      description: "Ingredient weight updated successfully",
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
            <CreateRecipeForm onSave={handleSaveRecipe} />

            <Separator className="my-8" />

            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Saved Recipes
            </h2>
            
            <ScrollArea className="h-[600px] rounded-md border bg-card/50 backdrop-blur-sm p-4">
              <SavedRecipesList
                recipes={recipes}
                onDelete={handleDeleteRecipe}
                onSaveToVault={handleSaveToVault}
                onUpdateIngredient={handleUpdateIngredient}
              />
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;