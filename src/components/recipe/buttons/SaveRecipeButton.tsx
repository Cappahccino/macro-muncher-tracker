import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Recipe {
  title: string;
}

interface SaveRecipeButtonProps {
  recipe: Recipe;
}

export function SaveRecipeButton({ recipe }: SaveRecipeButtonProps) {
  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Recipe Saved",
      description: `${recipe.title} has been saved to your favorites.`,
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