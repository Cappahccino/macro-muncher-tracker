import { motion } from "framer-motion";
import { RecipeListItem } from "./RecipeListItem";
import { LoadingSpinner } from "./page/LoadingSpinner";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: {
    steps?: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  } | null;
  created_at: string;
  dietary_tags?: string[];
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  total_fiber?: number;
  notes: string;
  ingredients: {
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface RecipeListProps {
  recipes: Recipe[];
  onDelete: (index: number) => void;
  isLoading?: boolean;
}

export function RecipeList({ recipes, onDelete, isLoading = false }: RecipeListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {recipes && recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <RecipeListItem 
            key={recipe.recipe_id} 
            recipe={recipe}
            onDelete={() => onDelete(index)}
          />
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No recipes found. Start creating some delicious meals!
        </div>
      )}
    </motion.div>
  );
}