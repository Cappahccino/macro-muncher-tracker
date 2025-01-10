import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteRecipeDialog } from "./DeleteRecipeDialog";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SaveRecipeButton } from "./buttons/SaveRecipeButton";
import { PrintRecipeButton } from "./buttons/PrintRecipeButton";
import { addRecipeToMeals } from "@/utils/recipe/recipeOperations";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: string[];
  created_at: string;
  dietary_tags?: string[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  notes: string;
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

interface RecipeActionsProps {
  recipe: Recipe;
  onDelete: () => void;
  onSave?: (recipe: Recipe) => void;
}

export function RecipeActions({ recipe, onDelete, onSave }: RecipeActionsProps) {
  const queryClient = useQueryClient();

  const handleAddToMeals = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addRecipeToMeals(recipe);
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      toast({
        title: "Success",
        description: "Recipe has been added to your meals",
      });
    } catch (error) {
      console.error('Error adding to meals:', error);
      toast({
        title: "Error",
        description: "Failed to add recipe to meals. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddToMeals}
        className="shrink-0"
        title="Add to Meals"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <SaveRecipeButton recipe={recipe} onSave={onSave} />
      <PrintRecipeButton recipe={recipe} />
      <DeleteRecipeDialog recipe={recipe} onDelete={onDelete} />
    </div>
  );
}