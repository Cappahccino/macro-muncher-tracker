import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { DietaryFilters } from "@/components/recipe/DietaryFilters";
import { QuickSuggestions } from "@/components/recipe/QuickSuggestions";
import { HealthyAlternative } from "@/components/recipe/HealthyAlternative";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SearchBar } from "@/components/recipe/SearchBar";
import { RecipeList } from "@/components/recipe/RecipeList";
import { RecipeVaultHeader } from "@/components/recipe/RecipeVaultHeader";
import { useRecipes } from "@/hooks/useRecipes";

const RecipeVault = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { recipes, isLoading, queryClient } = useRecipes();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      return;
    }
    
    setIsSearching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to search recipes",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('search-recipes', {
        body: { searchQuery }
      });

      if (error) throw error;
      
      if (data.analysis?.dietaryTags?.length > 0) {
        setActiveFilter(data.analysis.dietaryTags[0]);
      }

      await queryClient.invalidateQueries({ queryKey: ['recipes'] });

      toast({
        title: "Search Results",
        description: `Found ${data.recipes?.length || 0} recipes matching your search.`,
      });

    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = async () => {
    await queryClient.invalidateQueries({ queryKey: ['recipes'] });
    if (searchQuery) {
      setSearchQuery("");
      setIsSearching(false);
    }
  };

  const filteredRecipes = recipes?.filter(recipe => {
    if (activeFilter === "all") return true;
    return recipe.dietary_tags?.includes(activeFilter);
  });

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
        <RecipeVaultHeader title="Recipe Vault" />

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Find Healthy Alternatives</h3>
            <HealthyAlternative />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                isSearching={isSearching}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <DietaryFilters 
              activeFilter={activeFilter} 
              onFilterChange={setActiveFilter} 
            />
            <QuickSuggestions />
          </div>

          <ScrollArea className="h-[600px] rounded-md border p-4">
            <RecipeList 
              recipes={filteredRecipes || []} 
              onDelete={handleDelete}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default RecipeVault;