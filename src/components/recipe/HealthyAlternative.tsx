import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/recipe/SearchBar";
import { AlternativeResults } from "@/components/recipe/AlternativeResults";
import { supabase } from "@/integrations/supabase/client";

export function HealthyAlternative() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alternative, setAlternative] = useState<any>(null);
  const { toast } = useToast();

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
        return;
      }

      const { data, error } = await supabase.functions.invoke('healthy-alternative', {
        body: { query: searchQuery }
      });

      if (error) throw error;
      
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

  const saveIngredients = async (ingredients: any[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    for (const ingredient of ingredients) {
      const { data: existingIngredient } = await supabase
        .from('ingredients')
        .select('ingredient_id')
        .eq('name', ingredient.name)
        .single();

      if (!existingIngredient) {
        await supabase.from('ingredients').insert({
          name: ingredient.name,
          calories_per_100g: ingredient.calories,
          protein_per_100g: ingredient.protein,
          carbs_per_100g: ingredient.carbs,
          fat_per_100g: ingredient.fat,
          fiber_per_100g: ingredient.fiber,
          user_id: session.user.id
        });
      }
    }
  };

  const handleAddToMeals = async () => {
    if (!alternative) return;

    try {
      // Save ingredients first
      if (alternative.ingredients) {
        await saveIngredients(alternative.ingredients);
      }

      toast({
        title: "Success",
        description: "Recipe and ingredients have been saved",
      });
      
      setShowResults(false);
      setSearchQuery("");
      setAlternative(null);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <SearchBar
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
    </div>
  );
}