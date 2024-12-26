import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Recipe {
  title: string;
  description: string;
  instructions: string[];
  dietaryTags: string[];
  macronutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export const HealthyAlternative = () => {
  const [junkFood, setJunkFood] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const generateHealthyAlternative = async () => {
    if (!junkFood.trim()) return;

    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase.functions.invoke('healthy-alternative', {
        body: { junkFood, userId },
      });

      if (error) throw error;

      setRecipe(data);
      setShowDialog(true);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to generate healthy alternative. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: userId,
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          dietary_tags: recipe.dietaryTags,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Recipe saved to your vault!",
      });
      setShowDialog(false);
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
    <>
      <div className="flex gap-2">
        <Input
          placeholder="Enter your favorite junk food..."
          value={junkFood}
          onChange={(e) => setJunkFood(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && generateHealthyAlternative()}
          className="max-w-xs"
        />
        <Button 
          onClick={generateHealthyAlternative}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Find Healthy Alternative"
          )}
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{recipe?.title}</DialogTitle>
            <DialogDescription>
              {recipe?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Macronutrients (per serving):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-muted rounded-lg mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="font-medium">{recipe?.macronutrients.calories}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="font-medium">{recipe?.macronutrients.protein}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="font-medium">{recipe?.macronutrients.carbs}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fat</p>
                <p className="font-medium">{recipe?.macronutrients.fat}g</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fiber</p>
                <p className="font-medium">{recipe?.macronutrients.fiber}g</p>
              </div>
            </div>

            <h4 className="font-semibold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2">
              {recipe?.instructions.map((step, index) => (
                <li key={index} className="text-sm">{step}</li>
              ))}
            </ol>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {recipe?.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => generateHealthyAlternative()}>
              Research Another
            </Button>
            <Button onClick={handleSaveRecipe}>
              Save Recipe
            </Button>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};