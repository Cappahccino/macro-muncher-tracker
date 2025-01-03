import { useState } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FoodSelect } from "@/components/FoodSelect";
import { Pencil, Trash, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

const MyRecipes = () => {
  const { toast } = useToast();
  const [recipeName, setRecipeName] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editWeight, setEditWeight] = useState<number>(0);

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  const handleDeleteIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleEditWeight = (index: number) => {
    setEditingIndex(index);
    setEditWeight(ingredients[index].amount);
    setShowEditDialog(true);
  };

  const handleSaveWeight = () => {
    if (editingIndex === null) return;

    const updatedIngredients = [...ingredients];
    const ingredient = updatedIngredients[editingIndex];
    const ratio = editWeight / ingredient.amount;

    updatedIngredients[editingIndex] = {
      ...ingredient,
      amount: editWeight,
      calories: ingredient.calories * ratio,
      protein: ingredient.protein * ratio,
      carbs: ingredient.carbs * ratio,
      fat: ingredient.fat * ratio,
      fiber: ingredient.fiber * ratio,
    };

    setIngredients(updatedIngredients);
    setShowEditDialog(false);
    setEditingIndex(null);
  };

  const calculateTotalMacros = () => {
    return ingredients.reduce(
      (acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.protein,
        carbs: acc.carbs + curr.carbs,
        fat: acc.fat + curr.fat,
        fiber: acc.fiber + curr.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  };

  const handleSaveRecipe = async () => {
    if (!recipeName) {
      toast({
        title: "Error",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }

    if (ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          title: recipeName,
          description: `Recipe created with ${ingredients.length} ingredients`,
          instructions: { steps: [], servingSize: { servings: 1, gramsPerServing: 100 } },
          ...calculateTotalMacros()
        })
        .select()
        .single();

      if (recipeError) throw recipeError;

      // Add ingredients to the recipe
      const { error: ingredientsError } = await supabase
        .from('recipe_ingredients')
        .insert(
          ingredients.map(ing => ({
            recipe_id: recipe.recipe_id,
            quantity_g: ing.amount,
            custom_calories: ing.calories,
            custom_protein: ing.protein,
            custom_carbs: ing.carbs,
            custom_fat: ing.fat,
            custom_fiber: ing.fiber
          }))
        );

      if (ingredientsError) throw ingredientsError;

      toast({
        title: "Success",
        description: "Recipe saved successfully",
      });

      // Reset form
      setRecipeName("");
      setIngredients([]);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "Failed to save recipe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Header />
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create New Recipe</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="Recipe name"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
            />

            <FoodSelect onAddComponent={handleAddIngredient} />

            {ingredients.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Ingredients:</h3>
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{ingredient.name} - {ingredient.amount}g</p>
                      <p className="text-sm text-muted-foreground">
                        Calories: {Math.round(ingredient.calories)} | 
                        Protein: {Math.round(ingredient.protein)}g | 
                        Carbs: {Math.round(ingredient.carbs)}g | 
                        Fat: {Math.round(ingredient.fat)}g |
                        Fiber: {Math.round(ingredient.fiber)}g
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditWeight(index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteIngredient(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {ingredients.length > 0 && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Total Macros:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {Object.entries(calculateTotalMacros()).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm text-muted-foreground capitalize">{key}</p>
                          <p className="font-medium">{Math.round(value)}{key !== 'calories' ? 'g' : ''}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button onClick={handleSaveRecipe}>
                <Plus className="h-4 w-4 mr-2" />
                Save Recipe
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Ingredient Weight</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the new weight for this ingredient:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="number"
              value={editWeight}
              onChange={(e) => setEditWeight(Number(e.target.value))}
              placeholder="Weight in grams"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowEditDialog(false);
              setEditingIndex(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveWeight}>
              Save Weight
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyRecipes;