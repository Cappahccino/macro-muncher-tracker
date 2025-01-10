interface FoodComponent {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface PendingIngredientsListProps {
  ingredients: FoodComponent[];
}

export function PendingIngredientsList({ ingredients }: PendingIngredientsListProps) {
  if (ingredients.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="font-medium">Pending Ingredients:</h4>
      {ingredients.map((component, idx) => (
        <div key={idx} className="pl-4">
          <p>{component.name} - {component.amount}g</p>
          <p className="text-sm text-muted-foreground">
            Calories: {component.calories.toFixed(1)} | 
            Protein: {component.protein.toFixed(1)}g | 
            Carbs: {component.carbs.toFixed(1)}g | 
            Fat: {component.fat.toFixed(1)}g
          </p>
        </div>
      ))}
    </div>
  );
}