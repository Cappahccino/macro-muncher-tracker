import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AlternativeSearchInput } from "./AlternativeSearchInput";
import { AlternativeResults } from "./AlternativeResults";
import { useNavigate } from "react-router-dom";

export function HealthyAlternative() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alternative, setAlternative] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to search for recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        return;
      }

      const { data, error } = await supabase.functions.invoke('healthy-alternative', {
        body: { query: searchQuery }
      });

      if (error) {
        console.error('Search error:', error);
        throw error;
      }
      
      setAlternative(data);
      setShowResults(true);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to find alternatives. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToMeals = async () => {
    if (!alternative) return;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save recipes",
          variant: "destructive",
        });
        navigate("/sign-in");
        return;
      }

      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          user_id: session.user.id,
          title: alternative.title,
          description: alternative.description,
          instructions: alternative.instructions,
          dietary_tags: alternative.dietary_tags || []
        }])
        .select()
        .single();

      if (recipeError) throw recipeError;

      if (recipe && alternative.ingredients) {
        const ingredientPromises = alternative.ingredients.map(async (ingredient: any) => {
          const { error: ingredientError } = await supabase
            .from('recipe_ingredients')
            .insert([{
              recipe_id: recipe.recipe_id,
              ingredient_id: ingredient.id,
              quantity_g: ingredient.amount,
              custom_calories: ingredient.calories,
              custom_protein: ingredient.protein,
              custom_carbs: ingredient.carbs,
              custom_fat: ingredient.fat,
              custom_fiber: ingredient.fiber
            }]);

          if (ingredientError) throw ingredientError;
        });

        await Promise.all(ingredientPromises);
      }

      toast({
        title: "Success",
        description: "Recipe has been added to your meals",
      });
      setShowResults(false);
      
    } catch (error) {
      console.error('Error adding recipe:', error);
      toast({
        title: "Error",
        description: "Failed to add recipe to meals. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-purple-600/5 rounded-lg border border-purple-500/20 shadow-lg backdrop-blur-sm"
    >
      <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Use AI to Find Healthy Meal Alternatives
      </h3>
      
      <AlternativeSearchInput
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        isLoading={isLoading}
      />

      <AlternativeResults
        showResults={showResults}
        setShowResults={setShowResults}
        alternative={alternative}
        handleSearch={handleSearch}
        handleAddToMeals={handleAddToMeals}
      />
    </motion.div>
  );
}