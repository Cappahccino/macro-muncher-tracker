import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { DietaryFilters } from "@/components/recipe/DietaryFilters";
import { QuickSuggestions } from "@/components/recipe/QuickSuggestions";
import { HealthyAlternative } from "@/components/recipe/HealthyAlternative";
import { useToast } from "@/components/ui/use-toast";
import { SearchBar } from "@/components/recipe/SearchBar";
import { RecipeList } from "@/components/recipe/RecipeList";
import { RecipeVaultHeader } from "@/components/recipe/RecipeVaultHeader";
import { useRecipes } from "@/hooks/useRecipes";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const RecipeVault = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { recipes, isLoading, queryClient } = useRecipes();

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
            <h2 className="text-2xl font-semibold mb-4">Your Recipes</h2>
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <RecipeList 
                recipes={filteredRecipes || []} 
                onDelete={handleDelete}
              />
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default RecipeVault;