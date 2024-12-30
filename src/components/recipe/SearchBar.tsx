import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AlternativeResults } from "./AlternativeResults";
import { useNavigate } from "react-router-dom";
import { saveIngredients, saveRecipe } from "@/utils/ingredientManagement";
import { useRecipeSearch } from "@/hooks/useRecipeSearch";

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
  const { handleSearch: performSearch } = useRecipeSearch();

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

      const savedIngredientsList = await saveIngredients(alternative.ingredients || [], session.user.id);
      if (!savedIngredientsList) throw new Error('Failed to save ingredients');

      await saveRecipe(alternative, savedIngredientsList, session.user.id);

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
    setIsSearching(true);
    await performSearch(searchQuery);
    setIsSearching(false);
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