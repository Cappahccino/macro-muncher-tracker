interface FoodComponent {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export const calculateTotalMacros = (components: FoodComponent[]) => {
  return components.reduce(
    (acc, component) => ({
      calories: acc.calories + component.calories,
      protein: acc.protein + component.protein,
      carbs: acc.carbs + component.carbs,
      fat: acc.fat + component.fat,
      fiber: acc.fiber + (component.fiber || 0), // Handle cases where fiber might be undefined
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
};