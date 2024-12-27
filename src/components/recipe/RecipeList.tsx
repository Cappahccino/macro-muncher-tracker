import { motion } from "framer-motion";
import { RecipeListItem } from "./RecipeListItem";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

interface RecipeListProps {
  recipes: Recipe[];
  onDelete: () => void;
}

export function RecipeList({ recipes, onDelete }: RecipeListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {recipes?.map((recipe) => (
        <RecipeListItem 
          key={recipe.recipe_id} 
          recipe={recipe}
          onDelete={onDelete}
        />
      ))}

      {recipes?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No recipes found. Start creating some delicious meals!
        </div>
      )}
    </motion.div>
  );
}