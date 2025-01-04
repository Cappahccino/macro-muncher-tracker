import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Ingredient {
  name: string;
  amount: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface SaveToVaultButtonProps {
  meal: {
    title: string;
    description: string;
    instructions: {
      steps: string[];
      servingSize?: {
        servings: number;
        gramsPerServing: number;
      };
    };
    ingredients?: Ingredient[];
    macronutrients: {
      perServing: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber: number;
      };
    };
  };
  existingInstructions?: string[];
}

export function SaveToVaultButton({ meal, existingInstructions }: SaveToVaultButtonProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  const [instructions, setInstructions] = useState(existingInstructions ? existingInstructions.join('\n') : "");

  const handleSaveToVault = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        return;
      }

      setShowInstructionsDialog(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to prepare recipe for saving",
        variant: "destructive",
      });
    }
  };

  const handleConfirmSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const instructionsArray = instructions.split('\n').filter(line => line.trim() !== '');

      // First, save the recipe with the user_id
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: session.user.id, // Explicitly set the user_id
          title: meal.title,
          description: meal.description,
          instructions: { steps: instructionsArray },
          total_calories: meal.macronutrients.perServing.calories,
          total_protein: meal.macronutrients.perServing.protein,
          total_carbs: meal.macronutrients.perServing.carbs,
          total_fat: meal.macronutrients.perServing.fat,
          total_fiber: meal.macronutrients.perServing.fiber
        })
        .select()
        .single();

      if (recipeError) {
        console.error('Recipe error:', recipeError);
        throw recipeError;
      }

      // Then, save each ingredient with its macros
      if (meal.ingredients && recipe) {
        const ingredientPromises = meal.ingredients.map(async (ingredient) => {
          // First, try to find an existing ingredient with the same name
          const { data: existingIngredient, error: searchError } = await supabase
            .from('ingredients')
            .select('ingredient_id')
            .eq('name', ingredient.name)
            .single();

          if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw searchError;
          }

          let ingredientId;

          if (existingIngredient) {
            ingredientId = existingIngredient.ingredient_id;
          } else {
            // Create new ingredient if it doesn't exist
            const { data: newIngredient, error: ingredientError } = await supabase
              .from('ingredients')
              .insert({
                name: ingredient.name,
                calories_per_100g: (ingredient.macros.calories / ingredient.amount) * 100,
                protein_per_100g: (ingredient.macros.protein / ingredient.amount) * 100,
                carbs_per_100g: (ingredient.macros.carbs / ingredient.amount) * 100,
                fat_per_100g: (ingredient.macros.fat / ingredient.amount) * 100,
                fiber_per_100g: (ingredient.macros.fiber / ingredient.amount) * 100,
              })
              .select()
              .single();

            if (ingredientError) throw ingredientError;
            ingredientId = newIngredient.ingredient_id;
          }

          // Create recipe_ingredient association
          const { error: recipeIngredientError } = await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: recipe.recipe_id,
              ingredient_id: ingredientId,
              quantity_g: ingredient.amount,
              custom_calories: ingredient.macros.calories,
              custom_protein: ingredient.macros.protein,
              custom_carbs: ingredient.macros.carbs,
              custom_fat: ingredient.macros.fat,
              custom_fiber: ingredient.macros.fiber
            });

          if (recipeIngredientError) throw recipeIngredientError;
        });

        await Promise.all(ingredientPromises);
      }

      setShowInstructionsDialog(false);
      toast({
        title: "Success",
        description: "Recipe saved to vault successfully",
      });
      
      // Navigate to recipe vault to see the newly added recipe
      navigate("/recipe-vault");
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to vault",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button onClick={handleSaveToVault} className="flex items-center gap-2">
        <Save className="h-4 w-4" />
        Save to Vault
      </Button>

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
              <Button onClick={handleConfirmSave}>
                Save to Vault
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}