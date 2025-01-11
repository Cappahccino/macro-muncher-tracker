import { CreateRecipeForm } from "@/components/recipe/CreateRecipeForm";
import { SavedRecipesList } from "@/components/recipe/SavedRecipesList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Recipe } from "@/types/recipe";

interface SavedRecipe {
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

interface RecipeContentProps {
  recipes: SavedRecipe[];
  onSaveRecipe: (recipe: SavedRecipe) => void;
  onDeleteRecipe: (index: number) => void;
  onSaveToVault: (recipe: SavedRecipe) => void;
  onUpdateIngredient: (recipeIndex: number, ingredientIndex: number, newAmount: number) => void;
  isLoading?: boolean;
}

export function RecipeContent({
  recipes,
  onSaveRecipe,
  onDeleteRecipe,
  onSaveToVault,
  onUpdateIngredient,
  isLoading = false,
}: RecipeContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CreateRecipeForm onSave={onSaveRecipe} />

      <Separator className="my-8" />

      <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
        Saved Recipes
      </h2>
      
      <ScrollArea className="h-[600px] rounded-md border bg-card/50 backdrop-blur-sm p-4">
        <SavedRecipesList
          recipes={recipes}
          onDelete={onDeleteRecipe}
          onSaveToVault={onSaveToVault}
          onUpdateIngredient={onUpdateIngredient}
          isLoading={isLoading}
        />
      </ScrollArea>
    </motion.div>
  );
}