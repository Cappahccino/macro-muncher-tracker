import { RecipeIngredientItem } from "./RecipeIngredientItem";

interface Ingredient {
  name: string;
  amount: number;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface RecipeIngredientsListProps {
  ingredients: Ingredient[];
}

export function RecipeIngredientsList({ ingredients }: RecipeIngredientsListProps) {
  return (
    <div className="mt-4">
      <h5 className="font-medium mb-2">Ingredients:</h5>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <RecipeIngredientItem
            key={index}
            ingredient={ingredient}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
}