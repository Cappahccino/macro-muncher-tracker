import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MacroNutrient } from "./meal/MacroNutrient";
import { MacroRatios } from "./meal/MacroRatios";
import { SaveToVaultButton } from "./meal/SaveToVaultButton";

interface Ingredient {
  name: string;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  title: string;
  description: string;
  instructions: {
    steps: string[];
    servingSize?: {
      servings: number;
      gramsPerServing: number;
    };
  };
  ingredients?: Ingredient[];
  macronutrients: {
    perServing: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
    };
  };
}

interface MealDetailsProps {
  meal: Meal;
}

export function MealDetails({ meal }: MealDetailsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{meal.name || meal.title}</h2>
        </div>
        <SaveToVaultButton meal={meal} />
      </div>
      
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroNutrient 
            label="Calories" 
            value={meal.calories || meal.macronutrients.perServing.calories} 
            unit="" 
          />
          <MacroNutrient 
            label="Protein" 
            value={meal.protein || meal.macronutrients.perServing.protein} 
          />
          <MacroNutrient 
            label="Carbs" 
            value={meal.carbs || meal.macronutrients.perServing.carbs} 
          />
          <MacroNutrient 
            label="Fat" 
            value={meal.fat || meal.macronutrients.perServing.fat} 
          />
        </div>

        <MacroRatios 
          calories={meal.calories || meal.macronutrients.perServing.calories}
          protein={meal.protein || meal.macronutrients.perServing.protein}
          carbs={meal.carbs || meal.macronutrients.perServing.carbs}
          fat={meal.fat || meal.macronutrients.perServing.fat}
        />
      </Card>
    </div>
  );
}