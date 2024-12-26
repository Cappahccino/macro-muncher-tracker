import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils } from "lucide-react";
import { RecipeActions } from "./RecipeActions";
import { RecipeDetailsDialog } from "./RecipeDetailsDialog";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="cursor-pointer"
      >
        <div 
          className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
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
            <RecipeActions recipe={recipe} onDelete={onDelete} />
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

      <RecipeDetailsDialog
        recipe={recipe}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
};