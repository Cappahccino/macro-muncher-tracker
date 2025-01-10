import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

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

interface SaveRecipeButtonProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
}

export function SaveRecipeButton({ recipe, onSave }: SaveRecipeButtonProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave(recipe);
    toast({
      title: "Recipe Saved",
      description: `${recipe.title} has been saved to your recipes.`,
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSave}
      className="shrink-0"
    >
      <Save className="h-4 w-4" />
    </Button>
  );
}