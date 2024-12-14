import { MealFormInput } from "./MealFormInput";

interface Meal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MacroInputsGridProps {
  meal: Meal;
  onMealChange: (updatedMeal: Partial<Meal>) => void;
}

export function MacroInputsGrid({ meal, onMealChange }: MacroInputsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MealFormInput
        type="number"
        placeholder="Calories"
        value={meal.calories}
        onChange={(value) => onMealChange({ calories: Number(value) })}
      />
      <MealFormInput
        type="number"
        placeholder="Protein (g)"
        value={meal.protein}
        onChange={(value) => onMealChange({ protein: Number(value) })}
      />
      <MealFormInput
        type="number"
        placeholder="Carbs (g)"
        value={meal.carbs}
        onChange={(value) => onMealChange({ carbs: Number(value) })}
      />
      <MealFormInput
        type="number"
        placeholder="Fat (g)"
        value={meal.fat}
        onChange={(value) => onMealChange({ fat: Number(value) })}
      />
    </div>
  );
}