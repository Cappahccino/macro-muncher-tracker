import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { DietaryFilters } from "@/components/recipe/DietaryFilters";
import { QuickSuggestions } from "@/components/recipe/QuickSuggestions";
import { RecipeCard } from "@/components/recipe/RecipeCard";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

const RecipeVault = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Recipe[];
    },
  });

  const filteredRecipes = recipes?.filter(recipe => {
    if (activeFilter === "all") return true;
    return recipe.dietary_tags?.includes(activeFilter);
  });

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
      <div className="container max-w-4xl mx-auto p-4">
        <Header />
        <div className="mt-8 text-center">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Recipe Vault
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <DietaryFilters 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
          <QuickSuggestions />
        </div>

        <ScrollArea className="h-[600px] rounded-md border p-4">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {filteredRecipes?.map((recipe) => (
              <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))}

            {filteredRecipes?.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                No recipes found. Start creating some delicious meals!
              </div>
            )}
          </motion.div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default RecipeVault;