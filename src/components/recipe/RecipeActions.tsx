import { Save, Printer, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteRecipeDialog } from "./DeleteRecipeDialog";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Recipe {
  recipe_id: string;
  title: string;
  description: string | null;
  instructions: any | null;
  created_at: string;
  dietary_tags?: string[];
}

interface RecipeActionsProps {
  recipe: Recipe;
  onDelete: () => void;
}

export function RecipeActions({ recipe, onDelete }: RecipeActionsProps) {
  const queryClient = useQueryClient();

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Recipe Saved",
      description: `${recipe.title} has been saved to your favorites.`,
    });
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .description { color: #666; margin-bottom: 20px; }
              .instructions { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${recipe.title}</h1>
            <div class="description">${recipe.description || ''}</div>
            <div class="instructions">
              ${JSON.stringify(recipe.instructions, null, 2)}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleAddToMeals = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { data: ingredients, error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .select(`
          quantity_g,
          calories,
          protein,
          fat,
          carbs,
          fiber,
          ingredients (
            ingredient_id,
            name
          )
        `)
        .eq('recipe_id', recipe.recipe_id);

      if (ingredientsError) throw ingredientsError;

      const { data: newRecipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([{
          title: recipe.title,
          description: recipe.description,
          instructions: recipe.instructions,
          dietary_tags: recipe.dietary_tags
        }])
        .select()
        .single();

      if (recipeError) throw recipeError;

      if (newRecipe && ingredients) {
        const ingredientPromises = ingredients.map(async (ingredient) => {
          const { error: ingredientError } = await supabase
            .from('recipe_ingredients')
            .insert([{
              recipe_id: newRecipe.recipe_id,
              ingredient_id: ingredient.ingredients?.ingredient_id,
              quantity_g: ingredient.quantity_g,
              calories: ingredient.calories,
              protein: ingredient.protein,
              fat: ingredient.fat,
              carbs: ingredient.carbs,
              fiber: ingredient.fiber
            }]);

          if (ingredientError) throw ingredientError;
        });

        await Promise.all(ingredientPromises);
      }

      await queryClient.invalidateQueries({ queryKey: ['recipes'] });

      toast({
        title: "Success",
        description: "Recipe has been added to your meals",
      });
    } catch (error) {
      console.error('Error adding to meals:', error);
      toast({
        title: "Error",
        description: "Failed to add recipe to meals. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddToMeals}
        className="shrink-0"
        title="Add to Meals"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSave}
        className="shrink-0"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrint}
        className="shrink-0"
      >
        <Printer className="h-4 w-4" />
      </Button>
      <DeleteRecipeDialog recipe={recipe} onDelete={onDelete} />
    </div>
  );
}