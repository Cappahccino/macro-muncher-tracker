import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

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
}

export function SavedRecipesList({ recipes, onDelete }: SavedRecipesListProps) {
  if (recipes.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No recipes saved yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {recipes.map((recipe, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
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
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>
                      {ingredient.name} ({ingredient.amount}g)
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {Object.entries(recipe.macros).map(([key, value]) => (
                  <div key={key} className="bg-muted p-2 rounded">
                    <p className="text-xs text-muted-foreground capitalize">{key}</p>
                    <p className="font-medium">{Math.round(value)}{key === 'calories' ? '' : 'g'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}