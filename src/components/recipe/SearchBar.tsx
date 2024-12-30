import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlternativeResults } from "./AlternativeResults";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  isSearching,
  setIsSearching 
}: SearchBarProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [alternative, setAlternative] = useState<any>(null);

  const saveIngredients = async (ingredients: any[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const savedIngredients = await Promise.all(
        ingredients.map(async (ingredient) => {
          // Check if ingredient already exists using maybeSingle() instead of single()
          const { data: existingIngredient, error: searchError } = await supabase
            .from('ingredients')
            .select('ingredient_id, name')
            .eq('name', ingredient.name)
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (searchError) {
            console.error('Error searching for ingredient:', searchError);
            throw searchError;
          }

          if (existingIngredient) {
            return existingIngredient;
          }

          // Create new ingredient if it doesn't exist
          const { data: newIngredient, error: insertError } = await supabase
            .from('ingredients')
            .insert({
              name: ingredient.name,
              calories_per_100g: (ingredient.calories / ingredient.amount) * 100,
              protein_per_100g: (ingredient.protein / ingredient.amount) * 100,
              fat_per_100g: (ingredient.fat / ingredient.amount) * 100,
              carbs_per_100g: (ingredient.carbs / ingredient.amount) * 100,
              fiber_per_100g: (ingredient.fiber / ingredient.amount) * 100,
              user_id: session.user.id
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating ingredient:', insertError);
            throw insertError;
          }

          return newIngredient;
        })
      );

      return savedIngredients;
    } catch (error) {
      console.error('Error saving ingredients:', error);
      return null;
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

      // Save ingredients first
      const savedIngredients = await saveIngredients(alternative.ingredients || []);
      if (!savedIngredients) throw new Error('Failed to save ingredients');

      // Save the recipe
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: session.user.id,
          title: alternative.title,
          description: alternative.description,
          instructions: alternative.instructions,
          dietary_tags: []
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Link ingredients to recipe
      const recipeIngredients = alternative.ingredients.map((ingredient: any, index: number) => ({
        recipe_id: recipe.recipe_id,
        ingredient_id: savedIngredients[index].ingredient_id,
        quantity_g: ingredient.amount,
        calories: ingredient.calories,
        protein: ingredient.protein,
        carbs: ingredient.carbs,
        fat: ingredient.fat,
        fiber: ingredient.fiber
      }));

      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(recipeIngredients);

      if (ingredientsError) throw ingredientsError;

      setShowResults(false);
      toast({
        title: "Success",
        description: "Recipe and ingredients have been saved",
      });
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe and ingredients",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
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

      const { data: userData } = await supabase
        .from('users')
        .select('dietary_preferences')
        .eq('user_id', session.user.id)
        .single();

      const userGoals = userData?.dietary_preferences || {};

      const { data, error } = await supabase.functions.invoke('search-recipes', {
        body: { 
          searchQuery,
          userGoals
        }
      });

      if (error) throw error;
      
      setAlternative(data);
      setShowResults(true);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Input
          placeholder="Search recipes with AI (e.g., 'healthy breakfast under 500 calories')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="w-[100px]"
        >
          {isSearching ? (
            "Searching..."
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      <AlternativeResults
        showResults={showResults}
        setShowResults={setShowResults}
        alternative={alternative}
        handleSearch={handleSearch}
        handleAddToMeals={handleAddToMeals}
      />
    </>
  );
}