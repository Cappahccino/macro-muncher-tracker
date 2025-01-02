import { FoodComponent } from "@/types/food";

interface IngredientsListProps {
  ingredients: FoodComponent[];
}

export function IngredientsList({ ingredients }: IngredientsListProps) {
  if (!ingredients.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="font-medium text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Ingredients:
      </h4>
      {ingredients.map((component, idx) => (
        <div key={idx} className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border">
          <p className="font-medium">{component.name} - {component.amount}g</p>
          <p className="text-sm text-muted-foreground">
            Calories: {component.calories.toFixed(1)} | 
            Protein: {component.protein.toFixed(1)}g | 
            Carbs: {component.carbs.toFixed(1)}g | 
            Fat: {component.fat.toFixed(1)}g |
            Fiber: {component.fiber?.toFixed(1) || 0}g
          </p>
        </div>
      ))}
    </div>
  );
}