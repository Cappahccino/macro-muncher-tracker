import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Recipe {
  recipe_id: string;
  title: string;
}

interface DeleteRecipeDialogProps {
  recipe: Recipe;
  onDelete: () => void;
}

export function DeleteRecipeDialog({ recipe, onDelete }: DeleteRecipeDialogProps) {
  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('recipe_id', recipe.recipe_id);

      if (error) throw error;

      onDelete();
      toast({
        title: "Recipe Deleted",
        description: "The recipe has been successfully deleted.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete the recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Recipe</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete this recipe? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}