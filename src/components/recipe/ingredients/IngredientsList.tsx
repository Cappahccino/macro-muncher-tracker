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

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  return (
    <div className="mt-4">
      <h5 className="font-medium mb-2">Ingredients:</h5>
      <div className="space-y-2">
        {ingredients?.map((ingredient, index) => (
          <ExpandableIngredient
            key={index}
            name={ingredient.name}
            amount={ingredient.amount}
            macros={ingredient.macros}
          />
        ))}
      </div>
    </div>
  );
}