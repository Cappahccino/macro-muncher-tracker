import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { CreateRecipeForm } from "@/components/recipe/CreateRecipeForm";
import { SavedRecipesList } from "@/components/recipe/SavedRecipesList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [instructions, setInstructions] = useState("");

  // Load saved recipes from localStorage on component mount
  useEffect(() => {
    const savedRecipes = localStorage.getItem('savedRecipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  // Save recipes to localStorage whenever they change
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

  const handleSaveToVault = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowInstructionsDialog(true);
  };

  const handleConfirmVaultSave = () => {
    if (!selectedRecipe) return;
    
    const recipeWithInstructions = {
      ...selectedRecipe,
      instructions: instructions.split('\n').filter(line => line.trim() !== ''),
    };

    setShowInstructionsDialog(false);
    setInstructions("");
    setSelectedRecipe(null);
    
    toast({
      title: "Success",
      description: "Recipe saved to vault successfully",
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
            onSaveToVault={handleSaveToVault}
          />
        </div>
      </div>

      <Dialog open={showInstructionsDialog} onOpenChange={setShowInstructionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cooking Instructions</DialogTitle>
            <DialogDescription>
              Please enter the cooking instructions for this recipe (one step per line)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="1. Preheat oven to 350°F&#10;2. Mix ingredients in a bowl&#10;3. Bake for 30 minutes"
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInstructionsDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmVaultSave}>
                Save to Vault
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyRecipes;