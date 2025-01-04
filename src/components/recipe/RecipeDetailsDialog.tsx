import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RecipeHeader } from "./details/RecipeHeader";
import { ServingInfo } from "./details/ServingInfo";
import { MacronutrientSummary } from "./details/MacronutrientSummary";
import { IngredientsList } from "./details/IngredientsList";
import { InstructionsList } from "./details/InstructionsList";
import { DietaryTags } from "./details/DietaryTags";
import { addRecipeToMeals } from "@/utils/recipe/recipeOperations";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    steps?: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  } | null;
  created_at: string;
  dietary_tags?: string[];
  ingredients?: Array<{
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
}

interface RecipeDetailsDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateIngredient?: (index: number, newAmount: number) => void;
}

export function RecipeDetailsDialog({ 
  recipe, 
  isOpen, 
  onClose,
  onUpdateIngredient 
}: RecipeDetailsDialogProps) {
  const queryClient = useQueryClient();

  if (!recipe) return null;

  const servingInfo = recipe.instructions?.servingSize;
  const steps = recipe.instructions?.steps || [];

  const handleSaveToVault = async () => {
    try {
      await addRecipeToMeals(recipe);
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      toast({
        title: "Success",
        description: "Recipe has been saved to your vault",
      });
    } catch (error) {
      console.error('Error saving to vault:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe to vault. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <RecipeHeader
            title={recipe.title}
            createdAt={recipe.created_at}
            description={recipe.description}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSaveToVault}
            className="shrink-0"
            title="Save to Vault"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-6 space-y-6">
          {servingInfo && (
            <ServingInfo
              servings={servingInfo.servings}
              gramsPerServing={servingInfo.gramsPerServing}
            />
          )}

          <MacronutrientSummary
            calories={recipe.total_calories}
            protein={recipe.total_protein}
            carbs={recipe.total_carbs}
            fat={recipe.total_fat}
          />

          <IngredientsList 
            ingredients={recipe.ingredients || []} 
            onUpdateIngredient={onUpdateIngredient}
          />

          <InstructionsList steps={steps} />

          {recipe.dietary_tags && (
            <DietaryTags tags={recipe.dietary_tags} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}