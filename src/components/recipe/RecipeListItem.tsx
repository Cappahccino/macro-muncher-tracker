import { useState } from "react";
import { motion } from "framer-motion";
import { RecipeActions } from "./RecipeActions";
import { RecipeDetailsDialog } from "./RecipeDetailsDialog";
import { RecipeHeader } from "./details/RecipeHeader";
import { RecipeDescription } from "./details/RecipeDescription";
import { MacronutrientSummary } from "./details/MacronutrientSummary";
import { DietaryTags } from "./details/DietaryTags";
import { Recipe } from "@/types/recipe";

interface RecipeListItemProps {
  recipe: Recipe;
  onDelete: () => void;
  onSave?: (recipe: Recipe) => void;
}

export const RecipeListItem = ({ recipe, onDelete, onSave }: RecipeListItemProps) => {
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
              <RecipeHeader 
                title={recipe.title}
                createdAt={recipe.created_at}
              />
              <RecipeDescription description={recipe.description} />
              
              {recipe.total_calories && (
                <MacronutrientSummary
                  calories={recipe.total_calories}
                  protein={recipe.total_protein}
                  carbs={recipe.total_carbs}
                  fat={recipe.total_fat}
                />
              )}
            </div>
            <RecipeActions recipe={recipe} onDelete={onDelete} onSave={onSave} />
          </div>
          <DietaryTags tags={recipe.dietary_tags || []} />
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