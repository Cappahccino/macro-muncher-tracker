export interface FoodComponent {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface MealTemplate {
  name: string;
  description?: string;
  instructions?: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  components: FoodComponent[];
  totalMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}