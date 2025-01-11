import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Save, Pencil } from "lucide-react";
import { useState } from "react";
import { EditIngredientWeightDialog } from "./EditIngredientWeightDialog";
import { LoadingSpinner } from "./page/LoadingSpinner";

interface Recipe {
  title: string;
  notes: string;
  instructions: string[];
  ingredients: {
    name: string;
    amount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  }[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface SavedRecipesListProps {
  recipes: Recipe[];
  onDelete: (index: number) => void;
  onSaveToVault: (recipe: Recipe) => void;
  onUpdateIngredient: (recipeIndex: number, ingredientIndex: number, newAmount: number) => void;
  isLoading?: boolean;
}

export function SavedRecipesList({ 
  recipes, 
  onDelete, 
  onSaveToVault,
  onUpdateIngredient,
  isLoading = false
}: SavedRecipesListProps) {
  const [editingRecipe, setEditingRecipe] = useState<number | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center items-center min-h-[200px]">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (recipes.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No recipes saved yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recipes.map((recipe, recipeIndex) => (
        <Card key={recipeIndex} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSaveToVault(recipe)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(recipeIndex)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {recipe.notes && (
                <div>
                  <h4 className="font-medium">Notes:</h4>
                  <p className="text-sm text-muted-foreground">{recipe.notes}</p>
                </div>
              )}
              
              {recipe.instructions.length > 0 && (
                <div>
                  <h4 className="font-medium">Instructions:</h4>
                  <ol className="list-decimal list-inside text-sm text-muted-foreground">
                    {recipe.instructions.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div>
                <h4 className="font-medium">Ingredients:</h4>
                <ul className="text-sm text-muted-foreground">
                  {recipe.ingredients.map((ingredient, ingredientIndex) => (
                    <li key={ingredientIndex} className="flex items-center justify-between py-1">
                      <div>
                        <span>{ingredient.name} ({ingredient.amount}g)</span>
                        <div className="text-xs text-muted-foreground mt-1">
                          Calories: {Math.round(ingredient.calories)} | 
                          Protein: {Math.round(ingredient.protein)}g | 
                          Carbs: {Math.round(ingredient.carbs)}g | 
                          Fat: {Math.round(ingredient.fat)}g |
                          Fiber: {Math.round(ingredient.fiber)}g
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingRecipe(recipeIndex);
                          setEditingIngredient(ingredientIndex);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-5 gap-2">
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-medium">{Math.round(recipe.macros.calories)}</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Protein</p>
                  <p className="font-medium">{Math.round(recipe.macros.protein)}g</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Carbs</p>
                  <p className="font-medium">{Math.round(recipe.macros.carbs)}g</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Fat</p>
                  <p className="font-medium">{Math.round(recipe.macros.fat)}g</p>
                </div>
                <div className="bg-muted p-2 rounded">
                  <p className="text-xs text-muted-foreground">Fiber</p>
                  <p className="font-medium">{Math.round(recipe.macros.fiber)}g</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      {editingRecipe !== null && editingIngredient !== null && (
        <EditIngredientWeightDialog
          ingredient={recipes[editingRecipe].ingredients[editingIngredient]}
          isOpen={editingRecipe !== null && editingIngredient !== null}
          onClose={() => {
            setEditingRecipe(null);
            setEditingIngredient(null);
          }}
          onSave={(newAmount) => {
            onUpdateIngredient(editingRecipe, editingIngredient, newAmount);
            setEditingRecipe(null);
            setEditingIngredient(null);
          }}
        />
      )}
    </div>
  );
}