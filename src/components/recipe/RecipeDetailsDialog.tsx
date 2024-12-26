import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Utensils, X } from "lucide-react";

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
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="h-6 w-6 text-purple-500" />
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {recipe.title}
            </DialogTitle>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            {new Date(recipe.created_at).toLocaleDateString()}
          </div>

          {recipe.description && (
            <div className="flex items-start gap-2 mt-2">
              <Utensils className="h-4 w-4 text-muted-foreground mt-1" />
              <DialogDescription className="text-base leading-relaxed">
                {recipe.description}
              </DialogDescription>
            </div>
          )}
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Dietary Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Instructions
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {recipe.instructions ? (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
                  {typeof recipe.instructions === 'string' ? (
                    <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {recipe.instructions}
                    </p>
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {JSON.stringify(recipe.instructions, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No instructions available</p>
              )}
            </div>
          </div>
        </div>

        <DialogClose asChild>
          <Button
            variant="outline"
            className="absolute right-4 top-4 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}