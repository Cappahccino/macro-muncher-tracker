interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IngredientsListProps {
  ingredients: Ingredient[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  if (!ingredients?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Ingredients
      </h3>
      <div className="bg-gray-800/50 rounded-lg p-4">
        <ul className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-200">
              <div className="flex flex-col">
                <span>{ingredient.name} - {Math.round(ingredient.amount)}g</span>
                <span className="text-sm text-gray-400">
                  Calories: {Math.round(ingredient.calories)} | 
                  Protein: {Math.round(ingredient.protein)}g | 
                  Carbs: {Math.round(ingredient.carbs)}g | 
                  Fat: {Math.round(ingredient.fat)}g
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}