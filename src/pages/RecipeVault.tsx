import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { DietaryFilters } from "@/components/recipe/DietaryFilters";
import { QuickSuggestions } from "@/components/recipe/QuickSuggestions";
import { HealthyAlternative } from "@/components/recipe/HealthyAlternative";
import { SearchBar } from "@/components/recipe/SearchBar";
import { RecipeList } from "@/components/recipe/RecipeList";
import { RecipeVaultHeader } from "@/components/recipe/RecipeVaultHeader";
import { useRecipes } from "@/hooks/useRecipes";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RecipeVault = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { recipes, isLoading, queryClient } = useRecipes();
  const { toast } = useToast();

  const handleDelete = async () => {
    await queryClient.invalidateQueries({ queryKey: ['recipes'] });
    if (searchQuery) {
      setSearchQuery("");
      setIsSearching(false);
    }
    toast({
      title: "Success",
      description: "Recipe deleted successfully",
    });
  };

  const filteredRecipes = recipes?.filter(recipe => {
    // First apply dietary filter
    if (activeFilter !== "all" && !recipe.dietary_tags?.includes(activeFilter)) {
      return false;
    }
    
    // Then apply search filter if there's a search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="mt-8 space-y-8">
        <RecipeVaultHeader title="Recipe Vault" />

        <div className="space-y-6">
          <HealthyAlternative />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
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

          <Separator className="my-8" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
              Your Recipes
            </h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="h-[600px] rounded-md border bg-card/50 backdrop-blur-sm p-4">
                <RecipeList 
                  recipes={filteredRecipes || []} 
                  onDelete={handleDelete}
                />
              </ScrollArea>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default RecipeVault;