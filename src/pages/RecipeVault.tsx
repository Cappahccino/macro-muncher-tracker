import { Header } from "@/components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useState } from "react";
import { DietaryFilters } from "@/components/recipe/DietaryFilters";
import { QuickSuggestions } from "@/components/recipe/QuickSuggestions";
import { RecipeListItem } from "@/components/recipe/RecipeListItem";
import { HealthyAlternative } from "@/components/recipe/HealthyAlternative";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Recipe[];
    },
    retry: false,
    onError: (error) => {
      console.error('Query error:', error);
      toast({
        title: "Error",
        description: "Failed to load recipes. Please try again.",
        variant: "destructive",
      });
    }
  });

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

        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-3">Find Healthy Alternatives</h3>
            <HealthyAlternative />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1 w-full md:w-auto">
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
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {filteredRecipes?.map((recipe) => (
                <RecipeListItem 
                  key={recipe.recipe_id} 
                  recipe={recipe}
                  onDelete={handleDelete}
                />
              ))}

              {filteredRecipes?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No recipes found. Start creating some delicious meals!
                </div>
              )}
            </motion.div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default RecipeVault;