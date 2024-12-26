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

  const formatInstructions = (instructions: any) => {
    if (typeof instructions === 'string') {
      // Split by newlines and create bullet points
      return instructions.split('\n').filter(line => line.trim()).map(line => `• ${line.trim()}`).join('\n');
    } else if (Array.isArray(instructions)) {
      // If it's an array, add bullet points
      return instructions.map(item => `• ${item}`).join('\n');
    } else {
      // For objects or other types, stringify but remove brackets
      return JSON.stringify(instructions, null, 2)
        .replace(/[\[\]]/g, '')
        .split(',')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => `• ${line}`)
        .join('\n');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ChefHat className="h-6 w-6 text-purple-500" />
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {recipe.title}
            </DialogTitle>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <Clock className="h-4 w-4" />
            {new Date(recipe.created_at).toLocaleDateString()}
          </div>

          {recipe.description && (
            <div className="flex items-start gap-2 mt-2">
              <Utensils className="h-4 w-4 text-gray-400 mt-1" />
              <DialogDescription className="text-base leading-relaxed text-gray-300">
                {recipe.description}
              </DialogDescription>
            </div>
          )}
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Dietary Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.dietary_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-purple-900/40 text-purple-200 text-xs font-medium"
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
            <div className="prose prose-sm prose-invert max-w-none">
              {recipe.instructions ? (
                <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                  <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-200">
                    {formatInstructions(recipe.instructions)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 italic">No instructions available</p>
              )}
            </div>
          </div>
        </div>

        <DialogClose asChild>
          <Button
            variant="outline"
            className="absolute right-4 top-4 hover:bg-gray-700 text-gray-300 border-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}