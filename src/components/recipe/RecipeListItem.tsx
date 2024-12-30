import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Clock, Utensils, Activity } from "lucide-react";
import { RecipeActions } from "./RecipeActions";
import { RecipeDetailsDialog } from "./RecipeDetailsDialog";
import { MacroRatios } from "@/components/meal/MacroRatios";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
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
              
              {/* Add Macro Information */}
              {recipe.total_calories && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Nutritional Information</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                    <div className="bg-background/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Calories</p>
                      <p className="font-semibold">{Math.round(recipe.total_calories)}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Protein</p>
                      <p className="font-semibold">{Math.round(recipe.total_protein || 0)}g</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Carbs</p>
                      <p className="font-semibold">{Math.round(recipe.total_carbs || 0)}g</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Fat</p>
                      <p className="font-semibold">{Math.round(recipe.total_fat || 0)}g</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2">
                      <p className="text-muted-foreground">Fiber</p>
                      <p className="font-semibold">{Math.round(recipe.total_fiber || 0)}g</p>
                    </div>
                  </div>
                  
                  {/* Add Macro Ratios */}
                  {recipe.total_calories > 0 && (
                    <MacroRatios
                      calories={recipe.total_calories}
                      protein={recipe.total_protein || 0}
                      carbs={recipe.total_carbs || 0}
                      fat={recipe.total_fat || 0}
                    />
                  )}
                </div>
              )}
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