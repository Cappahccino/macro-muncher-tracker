import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function HealthyAlternative() {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alternative, setAlternative] = useState<any>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
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

  const handleAddToMeals = async () => {
    if (!alternative) return;
    
    try {
      // Create a new recipe entry
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          title: alternative.title,
          description: alternative.description,
          instructions: alternative.instructions,
          dietary_tags: alternative.dietary_tags || []
        }])
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Add ingredients
      if (recipe && alternative.ingredients) {
        const ingredientPromises = alternative.ingredients.map(async (ingredient: any) => {
          const { data: ingredientData, error: ingredientError } = await supabase
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
          return ingredientData;
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
      className="p-6 bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-lg border shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <ChefHat className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Find Healthy Alternatives</h3>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Enter a dish (e.g., 'mac and cheese')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className="w-[100px]"
        >
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search
            </>
          )}
        </Button>
      </div>

      <AlertDialog open={showResults} onOpenChange={setShowResults}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Healthy Alternative Found!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              {alternative && (
                <>
                  <h4 className="font-semibold text-lg">{alternative.title}</h4>
                  <p className="text-muted-foreground">{alternative.description}</p>
                  
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Nutritional Information (per serving):</h5>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="font-medium">{Math.round(alternative.calories || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="font-medium">{Math.round(alternative.protein || 0)}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="font-medium">{Math.round(alternative.carbs || 0)}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="font-medium">{Math.round(alternative.fat || 0)}g</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fiber</p>
                        <p className="font-medium">{Math.round(alternative.fiber || 0)}g</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowResults(false);
                handleSearch();
              }}
            >
              Research
            </Button>
            <Button onClick={handleAddToMeals}>
              Add to Meals
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}