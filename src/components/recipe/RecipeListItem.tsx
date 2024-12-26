import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils, Save, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

interface RecipeListItemProps {
  recipe: Recipe;
  onDelete: () => void;
}

export const RecipeListItem = ({ recipe, onDelete }: RecipeListItemProps) => {
  const navigate = useNavigate();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Recipe Saved",
      description: `${recipe.title} has been saved to your favorites.`,
    });
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .description { color: #666; margin-bottom: 20px; }
              .instructions { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            <div class="description">${recipe.description || ''}</div>
            <div class="instructions">
              ${JSON.stringify(recipe.instructions, null, 2)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

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
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="cursor-pointer"
    >
      <div className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1" onClick={() => navigate(`/meal/${recipe.recipe_id}`)}>
            <div className="flex items-center gap-2 mb-1">
              <ChefHat className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-lg">{recipe.title}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              {new Date(recipe.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-start gap-2">
              <Utensils className="h-4 w-4 text-muted-foreground mt-1" />
              <p className="text-sm text-muted-foreground line-clamp-2">
                {recipe.description || "No description available"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className="shrink-0"
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrint}
              className="shrink-0"
            >
              <Printer className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </AlertDialogTrigger>
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
            </AlertDialog>
          </div>
        </div>
        {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
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
      </div>
    </motion.div>
  );
};