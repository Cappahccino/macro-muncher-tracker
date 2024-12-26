import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

interface RecipeDetailsDialogProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailsDialog({ recipe, isOpen, onClose }: RecipeDetailsDialogProps) {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{recipe.title}</DialogTitle>
          <DialogDescription className="text-base">
            {recipe.description || "No description available"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.dietary_tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Instructions</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {recipe.instructions ? (
                <pre className="whitespace-pre-wrap font-sans">
                  {JSON.stringify(recipe.instructions, null, 2)}
                </pre>
              ) : (
                <p>No instructions available</p>
              )}
            </div>
          </div>
        </div>

        <DialogClose asChild>
          <Button
            variant="outline"
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}